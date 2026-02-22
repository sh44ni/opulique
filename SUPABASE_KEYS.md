# Getting Your Supabase API Keys

The application needs the correct Supabase API keys. Here's how to get them:

## Steps:

1. **Go to your Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard/project/zyjtjanrqrhccuuorpyr

2. **Navigate to Project Settings:**
   - Click on the **Settings** icon (gear) in the left sidebar
   - Click on **API**

3. **Copy the keys:**
   - **Project URL**: Should be `https://zyjtjanrqrhccuuorpyr.supabase.co`
   - **anon/public key**: Copy the full key under "Project API keys" → "anon public"
   - **service_role key**: Copy the full key under "Project API keys" → "service_role" (click reveal to see it)

4. **Update `.env.local`:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://zyjtjanrqrhccuuorpyr.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste the full anon key here>
   SUPABASE_SERVICE_ROLE_KEY=<paste the full service_role key here>
   ```

5. **Restart the dev server:**
   ```bash
   npm run dev
   ```

## Note:
The keys are JWT tokens and should be very long (around 200+ characters). If your key is shorter, it's incomplete.
