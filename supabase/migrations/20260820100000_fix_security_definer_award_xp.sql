-- Fix Supabase security warning:
-- Signed-in users must not execute a SECURITY DEFINER XP function.
-- award_xp only operates on rows owned by auth.uid(), so SECURITY INVOKER
-- is the correct and safer execution mode with the existing RLS policies.

ALTER FUNCTION public.award_xp(text, text, int) SECURITY INVOKER;

-- Keep the trigger-only bootstrap function inaccessible to client roles.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM authenticated;

-- award_xp is intentionally callable by signed-in users, but now runs with
-- the caller's permissions and therefore remains constrained by RLS.
REVOKE ALL ON FUNCTION public.award_xp(text, text, int) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.award_xp(text, text, int) FROM anon;
GRANT EXECUTE ON FUNCTION public.award_xp(text, text, int) TO authenticated;
