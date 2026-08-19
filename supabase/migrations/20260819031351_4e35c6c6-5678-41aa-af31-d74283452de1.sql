REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM authenticated;
REVOKE ALL ON FUNCTION public.award_xp(text, text, int) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.award_xp(text, text, int) FROM anon;
GRANT EXECUTE ON FUNCTION public.award_xp(text, text, int) TO authenticated;