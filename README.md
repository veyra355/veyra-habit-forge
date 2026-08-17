# Veyra: Your Personal Coach

AI Fitness + Grooming Coach — MVP

Build a modern, premium, responsive web application for an AI-powered fitness, wellness, grooming, and personal-improvement coach aimed primarily at young adults in India.

The product should feel like a premium consumer startup, not a generic AI chatbot.

Brand direction

Working name: "Veyra"

Tagline: "Build better habits. Feel better. Show up better."

Visual style:

Premium

Minimal

Modern

Dark/light mode

Clean typography

Smooth animations

Mobile-first responsive design

Avoid excessive gradients and clutter

Use rounded cards and subtle shadows

Make the interface feel similar in quality to modern fitness/wellness apps

Do not use body comparisons, attractiveness scores, celebrity comparisons, or messaging that shames users about their appearance.

Main navigation

After login, provide:

Home

Workout

Grooming

Habits

Progress

AI Coach

Profile

On mobile, use a bottom navigation bar.

SCREEN 1 — LANDING PAGE

Create a premium landing page.

Hero:

"Your AI-powered fitness & grooming coach."

Subheading:

"Personalized routines for fitness, habits, grooming and everyday wellness—adapted to your goals and progress."

Primary CTA:

"Start Free"

Secondary CTA:

"See How It Works"

Add a visual dashboard preview showing:

Today's workout

Habit progress

Grooming routine

Weekly progress

Sections:

How it works

Tell us your goals

Get your personalized plan

Check in every day

Watch your plan adapt

Features

Personalized workouts

Adaptive AI coaching

Habit tracking

Grooming routines

Progress analytics

AI Coach

Pricing preview

Free
₹0/month

Plus
₹499/month

Pro
₹999/month

FAQ

Final CTA

"Start building your routine today."

Footer with:

About

Privacy

Terms

Contact

SCREEN 2 — SIGN UP / LOGIN

Create:

Email login

Google login

Password

Forgot password

Create account

After successful signup, automatically send the user to onboarding.

SCREEN 3 — ONBOARDING

Create a multi-step onboarding questionnaire with a progress indicator.

Step 1 — About You

Ask:

Age range

Fitness experience

Workout location

Available equipment

Days available per week

Typical workout time

Step 2 — Goals

Allow multiple selections:

General fitness

Strength

Mobility

Endurance

Better daily habits

Grooming

Skincare basics

Hair-care routine

Personal style

Better sleep

Better consistency

Avoid asking users to rate their physical attractiveness.

Step 3 — Lifestyle

Ask:

Typical sleep schedule

Activity level

Work/study schedule

Available time per day

Step 4 — Preferences

Ask:

Vegetarian / non-vegetarian / other

Home / gym / outdoor

Beginner / intermediate / advanced

Preferred workout duration

Step 5 — Confirmation

Show:

"Your personal plan is ready."

Button:

"Build My Plan"

Store all onboarding data in the database.

SCREEN 4 — HOME DASHBOARD

Create a personalized dashboard.

Header:

"Good morning, [Name]"

Show:

Today's focus

Workout card:

Workout name

Duration

Difficulty

Start Workout button

Habits:

Sleep

Water

Movement

Personal routine

Grooming:

Morning routine

Evening routine

AI Coach card:

"Your coach has a suggestion for today."

Weekly progress:

Workouts

Habits completed

Consistency

Personal milestones

Use progress bars and clean cards.

SCREEN 5 — WORKOUT

Create a workout dashboard.

Show:

Today's Workout

Workout title

Estimated duration

Difficulty

Equipment required

Exercise cards containing:

Exercise name

Sets

Repetitions/time

Rest period

Instructions

Mark Complete button

Add:

"How did this workout feel?"

Options:

Easy

Good

Challenging

Too difficult

After completion:

"Workout Complete 🎉"

Store workout completion and difficulty feedback.

The system should use this feedback to personalize future plans.

Do not provide medical rehabilitation or injury-treatment advice.

SCREEN 6 — GROOMING

Create a grooming dashboard.

Categories:

Hair

Basic hair-care routine

Hair-care habits

Hairstyle inspiration

Skin

Simple skincare routine

Sun protection

General skincare education

Grooming

Hygiene

Facial-hair grooming

Nail care

Style

Outfit suggestions

Color coordination

Occasion-based styling

Presentation

Posture

Organization

Communication habits

Important:
Do not diagnose skin/hair conditions.
Do not promise permanent physical changes.
Do not judge or score attractiveness.

For medical concerns, clearly recommend consulting a qualified healthcare professional.

SCREEN 7 — HABITS

Create a daily habit tracker.

Default habits:

Workout

Sleep routine

Hydration

Personal grooming

Movement

Study/work focus

Allow users to add custom habits.

Show:

Daily completion

Weekly streak

Monthly consistency

Use encouraging language rather than guilt or shame.

SCREEN 8 — PROGRESS

Create a progress analytics dashboard.

Show:

Weekly:

Workouts completed

Habit completion percentage

Consistency

Personal milestones

Monthly:

Workout consistency trend

Habit trend

Completed sessions

Create attractive charts.

Add:

"Your Week"

Example:

"You completed 4 of 5 planned workouts this week."

"Next week, your coach recommends maintaining your current schedule."

Do not make health claims from incomplete data.

SCREEN 9 — AI COACH

Create a conversational AI coach interface.

Header:

"Your AI Coach"

The coach should use the user's:

Profile

Goals

Workout history

Habit history

Preferences

Previous feedback

Example prompts:

"Create today's workout."

"Make today's workout shorter."

"Help me stay consistent this week."

"What should I focus on today?"

"Build my weekly routine."

"Suggest a simple grooming routine."

The AI should provide general wellness and fitness guidance.

It must not:

Diagnose diseases

Prescribe medication

Recommend dangerous or extreme diets

Encourage excessive exercise

Encourage unhealthy weight loss

Replace doctors or qualified healthcare professionals

If a user asks about symptoms, injuries, medication, or medical treatment, recommend appropriate professional medical advice.

SCREEN 10 — PRICING

Create a premium pricing page.

FREE

₹0/month

Limited AI coaching

Basic workout generation

Basic habit tracking

Basic grooming routine

PLUS

₹499/month

Personalized workouts

Adaptive workout planning

Habit tracking

Grooming routines

AI Coach

Progress dashboard

PRO

₹999/month

Everything in Plus

Advanced personalization

Detailed progress analysis

More AI coaching

Advanced routines

Add buttons:

"Start Free"

"Upgrade to Plus"

"Upgrade to Pro"

Do not implement real payment processing yet. Create the UI and placeholder checkout actions.

SCREEN 11 — PROFILE & SETTINGS

Create:

Profile information
Goals
Preferences
Subscription
Notification settings
Privacy settings
Account settings
Logout

Allow users to update their onboarding information.

SCREEN 12 — ADMIN DASHBOARD

Create a protected admin dashboard.

Show:

Total users

Active users

Free users

Paid users

Subscription breakdown

Daily active users

Workout completions

AI usage

Create basic charts and tables.

Only administrators should be able to access this page.

DATABASE STRUCTURE

Prepare the application for Supabase.

Create data models for:

users
profiles
goals
preferences
workouts
workout_exercises
workout_sessions
habit_definitions
habit_completions
grooming_routines
progress
ai_conversations
subscriptions

Users must only be able to access their own private data.

Use secure authentication and authorization.

AI ARCHITECTURE

Do not hard-code personalized responses.

Create a backend service structure where the user's profile and progress can later be passed securely to an AI API.

The AI should generate:

Workout plans

Habit recommendations

General grooming routines

Weekly summaries

Adaptive suggestions

Keep API keys server-side and never expose them in frontend code.

IMPORTANT PRODUCT RULES

This is a wellness and fitness product, not a medical diagnosis platform.

Never:

Shame users

Compare users to celebrities

Score attractiveness

Promote extreme dieting

Promote excessive exercise

Promise specific physical transformations

Diagnose medical conditions

Prescribe medication

Use supportive, realistic language.

Build the complete frontend with realistic sample data so I can navigate the entire application before connecting the real backend.

Make every screen responsive for desktop, tablet, and mobile.

Use reusable components and clean project structure.

The final result should look like a polished startup MVP ready for user testing.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://veyra-habit-forge.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/21082a4a-a529-4feb-9fae-3c203a35a349).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
