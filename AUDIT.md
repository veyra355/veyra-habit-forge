# Veyra Step 1 audit

## Fixed in this PR
- Removed the tracked `.env` file and added `.env.example`.
- Moved authentication/session restoration to Supabase and handled email-confirmation signup correctly.
- Deferred auth-state database hydration to avoid Supabase auth callback lock/deadlock patterns.
- Added error handling around profile, habit, completion and workout reads/writes.
- Fixed habit persistence so workout completion uses the real database habit UUID instead of the old demo IDs.
- Added automatic default-habit creation for every new user and a backfill for existing users.
- Hardened profile privilege fields so a browser client cannot promote itself to admin or change its plan.
- Replaced hardcoded admin dashboard numbers with a security-checked Supabase RPC.
- Added a second migration for the admin overview RPC.
- Added Supabase schema types for the new tables/functions.
- Added mobile setup documentation and preserved the Capacitor Android configuration.

## Not yet verified by execution
The connected GitHub tooling can inspect and edit the repository, but this audit pass does not execute `npm run build`, ESLint, Android Studio, or a live Supabase migration. Those need to be run in the project environment before merging to `main`.
