-- ============ helper: updated_at ============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============ level / rank math ============
-- threshold(n) = 25*(n-1)*(n+2)  -> L1=0, L2=100, L3=250, L4=450, L5=700 ...
CREATE OR REPLACE FUNCTION public.xp_for_level(_level int)
RETURNS int LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT GREATEST(0, 25 * (_level - 1) * (_level + 2))::int
$$;

CREATE OR REPLACE FUNCTION public.level_for_xp(_xp int)
RETURNS int LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT GREATEST(1, FLOOR((-1 + SQRT(1 + 4 * (2 + GREATEST(_xp,0)::numeric / 25))) / 2))::int
$$;

CREATE OR REPLACE FUNCTION public.rank_for_level(_level int)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT CASE
    WHEN _level >= 76 THEN 'veyra'
    WHEN _level >= 51 THEN 'master'
    WHEN _level >= 36 THEN 'diamond'
    WHEN _level >= 21 THEN 'platinum'
    WHEN _level >= 11 THEN 'gold'
    WHEN _level >= 6  THEN 'silver'
    ELSE 'bronze' END
$$;

-- ============ profiles ============
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT 'Friend',
  email text,
  plan text NOT NULL DEFAULT 'free',
  onboarding jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ user_progress ============
CREATE TABLE public.user_progress (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp int NOT NULL DEFAULT 0,
  level int NOT NULL DEFAULT 1,
  rank text NOT NULL DEFAULT 'bronze',
  current_streak int NOT NULL DEFAULT 0,
  longest_streak int NOT NULL DEFAULT 0,
  last_active_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.user_progress TO authenticated;
GRANT ALL ON public.user_progress TO service_role;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own progress read" ON public.user_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own progress insert" ON public.user_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own progress update" ON public.user_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER user_progress_updated_at BEFORE UPDATE ON public.user_progress FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ habits ============
CREATE TABLE public.habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key text NOT NULL,
  name text NOT NULL,
  xp int NOT NULL DEFAULT 10,
  is_custom boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, key)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.habits TO authenticated;
GRANT ALL ON public.habits TO service_role;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own habits" ON public.habits FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER habits_updated_at BEFORE UPDATE ON public.habits FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.habit_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_id uuid NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  completed_on date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, habit_id, completed_on)
);
GRANT SELECT, INSERT, DELETE ON public.habit_completions TO authenticated;
GRANT ALL ON public.habit_completions TO service_role;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own habit completions" ON public.habit_completions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX habit_completions_user_date_idx ON public.habit_completions (user_id, completed_on DESC);

-- ============ quests (shared catalog) ============
CREATE TABLE public.quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  period text NOT NULL CHECK (period IN ('daily','weekly','mission')),
  xp int NOT NULL DEFAULT 20,
  target int NOT NULL DEFAULT 1,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.quests TO authenticated;
GRANT ALL ON public.quests TO service_role;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quests readable" ON public.quests FOR SELECT TO authenticated USING (is_active);

CREATE TABLE public.quest_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id uuid NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  xp_awarded int NOT NULL DEFAULT 0,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, quest_id, period_start)
);
GRANT SELECT, INSERT ON public.quest_completions TO authenticated;
GRANT ALL ON public.quest_completions TO service_role;
ALTER TABLE public.quest_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own quest completions" ON public.quest_completions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ achievements ============
CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  metric text NOT NULL CHECK (metric IN ('streak','xp','level','rank_ups','workouts','habits_done')),
  threshold int NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.achievements TO authenticated;
GRANT ALL ON public.achievements TO service_role;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "achievements readable" ON public.achievements FOR SELECT TO authenticated USING (true);

CREATE TABLE public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, achievement_id)
);
GRANT SELECT, INSERT ON public.user_achievements TO authenticated;
GRANT ALL ON public.user_achievements TO service_role;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own achievements" ON public.user_achievements FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ xp events (dedupe ledger) ============
CREATE TABLE public.xp_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source text NOT NULL,
  source_key text NOT NULL,
  amount int NOT NULL,
  occurred_on date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, source, source_key)
);
GRANT SELECT, INSERT, DELETE ON public.xp_events TO authenticated;
GRANT ALL ON public.xp_events TO service_role;
ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own xp events" ON public.xp_events FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX xp_events_user_date_idx ON public.xp_events (user_id, occurred_on DESC);

-- ============ signup bootstrap ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'display_name',''), NULLIF(NEW.raw_user_meta_data->>'full_name',''), split_part(COALESCE(NEW.email,'friend@veyra.app'),'@',1)),
    NEW.email
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_progress (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.habits (user_id, key, name, xp, sort_order)
  VALUES
    (NEW.id,'workout','Workout',30,1),
    (NEW.id,'sleep','Sleep routine',15,2),
    (NEW.id,'hydration','Hydration',20,3),
    (NEW.id,'grooming','Personal grooming',15,4),
    (NEW.id,'movement','Movement',15,5),
    (NEW.id,'focus','Deep work focus',40,6)
  ON CONFLICT (user_id, key) DO NOTHING;

  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ award_xp: single source of truth ============
CREATE OR REPLACE FUNCTION public.award_xp(_source text, _source_key text, _amount int)
RETURNS public.user_progress
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid uuid := auth.uid();
  _inserted int := 0;
  _prog public.user_progress;
  _today date := CURRENT_DATE;
  _new_streak int;
  _rank_ups int;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _amount IS NULL OR _amount < 0 OR _amount > 500 THEN RAISE EXCEPTION 'Invalid XP amount'; END IF;

  INSERT INTO public.user_progress (user_id) VALUES (_uid) ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.xp_events (user_id, source, source_key, amount, occurred_on)
  VALUES (_uid, _source, _source_key, _amount, _today)
  ON CONFLICT (user_id, source, source_key) DO NOTHING;
  GET DIAGNOSTICS _inserted = ROW_COUNT;

  SELECT * INTO _prog FROM public.user_progress WHERE user_id = _uid;

  IF _inserted = 0 THEN
    RETURN _prog;
  END IF;

  -- streak
  IF _prog.last_active_date IS NULL THEN
    _new_streak := 1;
  ELSIF _prog.last_active_date = _today THEN
    _new_streak := GREATEST(_prog.current_streak, 1);
  ELSIF _prog.last_active_date = _today - 1 THEN
    _new_streak := _prog.current_streak + 1;
  ELSE
    _new_streak := 1;
  END IF;

  UPDATE public.user_progress SET
    total_xp = total_xp + _amount,
    level = public.level_for_xp(total_xp + _amount),
    rank = public.rank_for_level(public.level_for_xp(total_xp + _amount)),
    current_streak = _new_streak,
    longest_streak = GREATEST(longest_streak, _new_streak),
    last_active_date = _today
  WHERE user_id = _uid
  RETURNING * INTO _prog;

  -- achievements
  _rank_ups := CASE _prog.rank
    WHEN 'bronze' THEN 0 WHEN 'silver' THEN 1 WHEN 'gold' THEN 2 WHEN 'platinum' THEN 3
    WHEN 'diamond' THEN 4 WHEN 'master' THEN 5 ELSE 6 END;

  INSERT INTO public.user_achievements (user_id, achievement_id)
  SELECT _uid, a.id FROM public.achievements a
  WHERE (a.metric = 'xp' AND _prog.total_xp >= a.threshold)
     OR (a.metric = 'level' AND _prog.level >= a.threshold)
     OR (a.metric = 'streak' AND _prog.current_streak >= a.threshold)
     OR (a.metric = 'rank_ups' AND _rank_ups >= a.threshold)
     OR (a.metric = 'workouts' AND (SELECT count(*) FROM public.xp_events e WHERE e.user_id = _uid AND e.source = 'workout') >= a.threshold)
     OR (a.metric = 'habits_done' AND (SELECT count(*) FROM public.habit_completions hc WHERE hc.user_id = _uid) >= a.threshold)
  ON CONFLICT (user_id, achievement_id) DO NOTHING;

  RETURN _prog;
END; $$;

REVOKE ALL ON FUNCTION public.award_xp(text, text, int) FROM public;
GRANT EXECUTE ON FUNCTION public.award_xp(text, text, int) TO authenticated;

-- ============ catalog seed ============
INSERT INTO public.quests (key, title, description, period, xp, sort_order) VALUES
  ('daily_workout','Complete your workout','Finish today''s Veyra session','daily',30,1),
  ('daily_water','Drink your water','Hit your hydration target','daily',20,2),
  ('daily_morning','Morning routine','Grooming + light movement','daily',15,3),
  ('daily_focus','Deep work block','One distraction-free focus block','daily',40,4),
  ('daily_habits','Close your habits','Complete every habit today','daily',25,5),
  ('daily_reflect','Evening reflection','Two lines on how today went','daily',15,6),
  ('weekly_four_sessions','Four sessions this week','Train four times','weekly',80,1),
  ('weekly_sleep','Five nights on schedule','Stick to your sleep window','weekly',70,2),
  ('weekly_grooming','Full grooming reset','Complete the weekly routine','weekly',60,3),
  ('weekly_coach','Check in with your coach','One AI coach conversation','weekly',40,4),
  ('mission_30_days','30 days of showing up','Build a 30-day streak','mission',300,1),
  ('mission_level_10','Reach Level 10','Climb into Silver rank','mission',250,2),
  ('mission_1000_xp','Earn 1000 XP','Real progress, banked','mission',200,3);

INSERT INTO public.achievements (key, title, description, metric, threshold, sort_order) VALUES
  ('first_step','First Step','Earn your very first XP','xp',1,1),
  ('first_streak','First Streak','Show up two days in a row','streak',2,2),
  ('streak_3','3-Day Streak','Three consecutive days','streak',3,3),
  ('streak_7','7-Day Consistency','A full week of showing up','streak',7,4),
  ('streak_30','30-Day Unstoppable','Thirty consecutive days','streak',30,5),
  ('xp_1000','1000 XP','Bank a thousand experience points','xp',1000,6),
  ('level_10','Level 10','Reach level ten','level',10,7),
  ('first_rank_up','First Rank Up','Climb out of Bronze','rank_ups',1,8),
  ('workouts_10','Ten Sessions','Log ten workouts','workouts',10,9),
  ('habits_50','Fifty Habits Closed','Complete fifty habits','habits_done',50,10);