# Veyra

Veyra is a habit, workout, grooming and coaching web app prepared for Android packaging with Capacitor.

## Local development

1. Copy `.env.example` to `.env` and add the Supabase URL and publishable key.
2. Install dependencies.
3. Run `npm run dev`.

## Supabase setup

Apply the migrations in `supabase/migrations/` to the connected Supabase project. They create the user profile, habit, completion, workout and AI conversation tables, row-level security, new-user profile/habit provisioning, protected role/plan fields, and the secure admin overview RPC.

## Android

- `npm run mobile:sync` builds the web app and syncs Capacitor Android.
- `npm run mobile:open` opens the Android project in Android Studio.
- `npm run mobile:run` runs the app on a connected Android device/emulator.

Never commit `.env` or service-role secrets. The browser app only needs the Supabase publishable key.
