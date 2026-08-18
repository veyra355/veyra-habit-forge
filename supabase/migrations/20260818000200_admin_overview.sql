create or replace function public.get_admin_overview()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_role text;
begin
  select role into caller_role from public.profiles where id = auth.uid();
  if caller_role <> 'admin' then
    raise exception 'not authorized';
  end if;

  return jsonb_build_object(
    'total_users', (select count(*) from public.profiles),
    'active_today', (select count(distinct user_id) from public.habit_completions where completed_on = current_date),
    'coach_messages', coalesce((select sum(jsonb_array_length(messages)) from public.ai_conversations), 0),
    'paid_plans', (select count(*) from public.profiles where plan <> 'free'),
    'recent_signups', coalesce((select jsonb_agg(x order by x.created_at desc) from (select name,email,plan,created_at from public.profiles order by created_at desc limit 5) x), '[]'::jsonb),
    'plan_distribution', coalesce((select jsonb_object_agg(plan, total) from (select plan,count(*) total from public.profiles group by plan) p), '{}'::jsonb)
  );
end;
$$;
revoke all on function public.get_admin_overview() from public;
grant execute on function public.get_admin_overview() to authenticated;
