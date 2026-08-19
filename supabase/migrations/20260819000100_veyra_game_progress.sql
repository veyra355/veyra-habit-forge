alter table public.profiles
  add column if not exists total_xp integer not null default 0,
  add column if not exists current_level integer not null default 1,
  add column if not exists current_rank text not null default 'BRONZE',
  add column if not exists current_streak integer not null default 0,
  add column if not exists achievements jsonb not null default '[]'::jsonb;

alter table public.profiles
  drop constraint if exists profiles_current_rank_check;

alter table public.profiles
  add constraint profiles_current_rank_check
  check (current_rank in ('BRONZE','SILVER','GOLD','PLATINUM','DIAMOND','MASTER','VEYRA'));

create index if not exists profiles_total_xp_idx on public.profiles (total_xp);
