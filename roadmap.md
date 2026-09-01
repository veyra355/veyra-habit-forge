# Veyra Mobile-App-First Redesign — Roadmap

Goal: premium mobile-app experience (NTC/Peloton-grade polish, original manga/anime energy, red + black identity). Preserve auth, Supabase data flows, all routes.

## Tasks

1. [ ] Design system pass in `src/styles.css`: manga utilities (speed-lines, halftone texture, comic section labels, red aura/glow, ink panels), app-canvas layout for desktop (centered phone-like column on dark canvas), reduced-motion safe keyframes (aura-pulse, xp-pop, sweep, float/breathe).
2. [ ] `AppShell.tsx`: floating safe-area-aware bottom nav — Home | Train | Recovery | Progress | Profile with active red indicator; slim app-style top bar (greeting/avatar/notifications on Home); keep admin/theme/signout; keep secondary features reachable (Profile > explore grid or Home feed links: game, academy, nutrition, achievements, grooming, presentation, habits, coach).
3. [ ] New `src/routes/train.tsx`: workout library with filter chips (Home, Gym, No Equipment, Dumbbells, Beginner, Strength, Mobility, Conditioning), premium content-style workout cards (artwork, duration, difficulty, equipment, progress). Nav "Train" points here; `/workout` remains today's session (live workout).
4. [ ] Rebuild `/workout` as immersive live-workout screen: per-exercise stage w/ pose art, set progress, rest timer, pause/skip, then manga "MISSION CLEARED" completion (XP earned via existing completeWorkout/awardXp, feedback Easy/Good/Challenging/Too difficult preserved).
5. [ ] Rebuild `home.tsx` as app feed: greeting + avatar + bell, TODAY'S MISSION hero card (Guardian silhouette, level/XP/streak), START TRAINING CTA, quick stats row, today's workout card, daily quests (real use-game data), discreet Recovery card ("Recovery — N day consistency"), horizontal swipeable recommendation cards.
6. [ ] Guardian mascot presentation component: CSS layered-depth idle animation (breathe/float, particles, red aura), milestone titles Awakening/Disciplined/Warrior/Elite/Veyra Legend keyed off level.
7. [ ] `progress.tsx` redesign: weekly/monthly consistency chart, workout completion, habit consistency, XP/level timeline, private recovery consistency, manga milestone timeline (Day 1/7/14/30/60/90).
8. [ ] `recovery.tsx` restyle to new system (keep all logic/privacy/XP milestones); ensure bottom-nav Recovery works.
9. [ ] `profile.tsx`: level/XP/streaks, goals, preferences, equipment, achievements/badges, privacy controls, explore grid to secondary features.
10. [ ] Microinteractions: XP pop, red progress sweep, page transitions, comic mission-complete transition; respect prefers-reduced-motion.
11. [ ] Sweep remaining routes (game, habits, coach, academy, nutrition, grooming, presentation, pricing, auth, onboarding, index landing) for visual consistency w/ new tokens — minimal edits only.
12. [ ] Validation: `npx prettier --check src` (write if needed), `npx eslint . --rule '@typescript-eslint/no-explicit-any: off'`, `npm run build`; mobile viewport audit 360–430px via Playwright; fix overflow/touch targets.

## Key facts from code inspection
- Nav currently 13-item desktop / 4+More mobile in `AppShell.tsx`; XP bar in header uses `25*level^2` formula (matches `xpForLevel` in veyra-store).
- `veyra-store.tsx`: real Supabase auth + `awardXp` RPC (dedup via source_key), habits/completions/sessions synced; do NOT touch auth logic.
- `use-game.ts` + `quest-display.ts` provide live quests/achievements; `game.ts` progression math.
- `sample-data.ts`: todaysWorkout (6 exercises w/ pose SVGs), upcomingWorkouts, plans (Free/Starter/Pro/Elite ₹0/99/299/699).
- `home.tsx` is 956 lines w/ local quest state — replace with use-game-driven feed.
- Styles: Tailwind v4 CSS-first, red/black tokens already in place, utilities: panel/glass/display-italic/eyebrow/glow-*/tap/safe-bottom.
