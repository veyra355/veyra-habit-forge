create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  role text not null default 'user' check (role in ('user','admin')),
  plan text not null default 'free' check (plan in ('free','starter','pro','elite')),
  onboarding jsonb,
  notifications jsonb not null default '{"workout":true,"habits":true,"weekly":true}'::jsonb,
  privacy jsonb not null default '{"analytics":true,"personalization":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  custom boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.habit_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  completed_on date not null,
  created_at timestamptz not null default now(),
  unique (user_id, habit_id, completed_on)
);

create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_title text not null,
  session_date date not null default current_date,
  feedback text check (feedback in ('easy','good','challenging','too_difficult')),
  created_at timestamptz not null default now()
);

create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  messages jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.habit_completions enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.ai_conversations enable row level security;

create policy "profiles own row" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "habits own rows" on public.habits for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "habit completions own rows" on public.habit_completions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "workout sessions own rows" on public.workout_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ai conversations own rows" on public.ai_conversations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name',''), coalesce(new.email,''))
  on conflict (id) do update set email = excluded.email, updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

insert into public.habits (user_id, name, custom)
select p.id, v.name, false
from public.profiles p
cross join (values ('Workout'),('Sleep routine'),('Hydration'),('Personal grooming'),('Movement'),('Study/work focus')) v(name)
where not exists (select 1 from public.habits h where h.user_id = p.id);
