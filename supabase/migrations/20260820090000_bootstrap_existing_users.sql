-- Backfill users that existed before the signup trigger was installed.
-- This is idempotent and safe to run more than once.

INSERT INTO public.profiles (id, display_name, email)
SELECT
  u.id,
  COALESCE(
    NULLIF(u.raw_user_meta_data->>'display_name', ''),
    NULLIF(u.raw_user_meta_data->>'full_name', ''),
    split_part(COALESCE(u.email, 'friend@veyra.app'), '@', 1)
  ),
  u.email
FROM auth.users AS u
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  display_name = CASE
    WHEN public.profiles.display_name = 'Friend' THEN EXCLUDED.display_name
    ELSE public.profiles.display_name
  END;

INSERT INTO public.user_progress (user_id)
SELECT u.id FROM auth.users AS u
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.habits (user_id, key, name, xp, sort_order)
SELECT u.id, h.key, h.name, h.xp, h.sort_order
FROM auth.users AS u
CROSS JOIN (
  VALUES
    ('workout', 'Workout', 30, 1),
    ('sleep', 'Sleep routine', 15, 2),
    ('hydration', 'Hydration', 20, 3),
    ('grooming', 'Personal grooming', 15, 4),
    ('movement', 'Movement', 15, 5),
    ('focus', 'Deep work focus', 40, 6)
) AS h(key, name, xp, sort_order)
ON CONFLICT (user_id, key) DO NOTHING;

-- Helpful indexes for the dashboard and user history.
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles (created_at DESC);
CREATE INDEX IF NOT EXISTS user_progress_updated_at_idx ON public.user_progress (updated_at DESC);
