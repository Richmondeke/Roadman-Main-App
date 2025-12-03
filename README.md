# NEON WINGS - Tron-Style Flight Booking Demo

A futuristic flight booking application using React, Tailwind, Supabase, and Duffel.

## Setup Instructions

### 1. Environment Variables
Create a `.env` file or set these in your deployment platform:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Duffel (Set this in Supabase Edge Function Secrets)
DUFFEL_API_KEY=your_test_key_here
```

**NOTE:** Ensure `DUFFEL_API_KEY` is set in the backend environment (Supabase Secrets), not the frontend.

### 2. Database
Run the SQL in `supabase/migrations/20260101_initial_schema.sql` in your Supabase SQL Editor.

### 3. Edge Functions
Deploy the proxy function:
```bash
supabase functions deploy duffel-proxy --no-verify-jwt
supabase secrets set DUFFEL_API_KEY=your_key_here
```

### 4. Run Frontend
1. `npm install`
2. `npm start` (or whatever script runs your bundler, e.g. Vite or Parcel)

## Testing
- Search: JFK -> LHR
- Date: Future date
- Use mock credit card details for the "Payment" step.

## Architecture
- **Frontend**: React + Framer Motion for Tron animations.
- **Backend**: Supabase Edge Functions proxying requests to Duffel API to keep keys secure.
- **Style**: Tailwind CSS with custom neon utility classes.
