# Filmy Sneaky Link

Link two Bollywood stars through the movies they share. Solo daily challenges, custom pairs, and real-time multiplayer rooms (co-op and head-to-head) powered by Supabase. Built with Vite, React, Tailwind and Lucide, and installable on an iPhone Home Screen as a PWA.

The app is fully playable with its built-in dataset. Adding a TMDB key unlocks search across every film and actor with real posters and headshots.

## Run it locally

```bash
npm install
cp .env.example .env.local      # optional: paste your TMDB key into VITE_TMDB_KEY
npm run dev
```

Open the URL Vite prints. On your phone, use your computer's local network address (run `npm run dev -- --host`).

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New > Project** and import the repository.
3. Vercel detects Vite on its own. Leave the defaults (build command `npm run build`, output directory `dist`).
4. Add the TMDB key (next section) **before** the first deploy, or redeploy afterwards.
5. Click **Deploy**.

Prefer the command line? Run `npm i -g vercel`, then `vercel` in this folder, and `vercel --prod` for production.

## Set up your TMDB key so everyone gets it automatically

1. Create a free account at themoviedb.org, then open **Settings > API** and request a developer key.
2. Copy the **API Read Access Token** (the long one that starts with `eyJ`). The shorter v3 **API Key** also works.
3. In Vercel open your project, go to **Settings > Environment Variables**.
4. Add a variable:
   - **Key:** `VITE_TMDB_KEY`
   - **Value:** your token or key
   - **Environments:** tick Production, Preview and Development
5. Click **Save**.
6. Go to **Deployments**, open the menu on the latest deployment and choose **Redeploy**. Vite reads variables while building, so a change only takes effect after a new build.

From then on, anyone opening your live link searches the full TMDB catalog without entering anything. The app has no key screen, so this variable is the only way to switch it on. Without it the app plays on its built-in dataset.

With the CLI, the same thing is `vercel env add VITE_TMDB_KEY` followed by `vercel --prod`.

**Heads up:** any variable starting with `VITE_` is compiled into the JavaScript that visitors download, so someone who inspects the page could read it. TMDB keys are free and read-only, so this is the usual trade-off for a hobby app. If you would rather keep the key fully private, the next step up is a small Vercel serverless function that calls TMDB for the app.

## Install on an iPhone

1. Open your Vercel link in **Safari** (it has to be Safari for Add to Home Screen).
2. Tap the **Share** button, then **Add to Home Screen**, then **Add**.
3. Launch it from the new icon. It opens full screen like a native app.

The installed app keeps its own saved settings, separate from Safari's.

## What is in the project

| File | Purpose |
| --- | --- |
| `src/App.jsx` | The whole game: UI, built-in dataset, TMDB support, solver, rooms |
| `src/main.jsx` | React entry point and service worker registration |
| `src/index.css` | Tailwind layers and mobile basics |
| `public/manifest.json` | Name, colors and icons for installing the app |
| `public/sw.js` | Service worker: offline app shell and asset caching |
| `public/icons/` | 180px iPhone icon plus 192, 512 and maskable PNGs |
| `vercel.json` | Keeps the service worker and manifest from being cached stale |
| `supabase/schema.sql` | Table, policies and realtime setup for multiplayer rooms |
| `.env.example` | Template for the TMDB and Supabase variables |

When you ship an update and want every device to drop old cached files, bump `CACHE_VERSION` at the top of `public/sw.js`.

## Real-time multiplayer with Supabase

Rooms, co-op boards and "Send Sneaky Link Challenge" invite links sync live across phones through Supabase (Postgres plus Realtime). Without Supabase the app still works, but rooms only connect tabs in the same browser.

### 1. Create the project and table
1. Create a free project at supabase.com.
2. Open **SQL Editor > New query**, paste the contents of `supabase/schema.sql`, and click **Run**. It creates the `room_state` table, the access policies, and switches on Realtime for it. It is safe to run again.

### 2. Get your two values
Open **Project Settings > API** and copy:
- **Project URL** (looks like `https://abcdxyz.supabase.co`)
- **anon public** key

Use the `anon` key, never the `service_role` key. The anon key is meant to be public and ends up in the app's JavaScript.

### 3. Add them to Vercel
In your Vercel project open **Settings > Environment Variables** and add, for Production, Preview and Development:

| Key | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | your Project URL |
| `VITE_SUPABASE_ANON_KEY` | your anon public key |

Then go to **Deployments**, open the menu on the latest one and choose **Redeploy**. Vite reads these while building, so they only take effect after a new build. For local development, put the same two lines in `.env.local`.

### How it behaves
- Each room is a handful of small rows in `room_state`: the room, one per player, and the shared co-op board.
- Every phone subscribes to its own room, so a move lands on the other screens within a moment. A slow background refresh (every 8 seconds) is only a safety net.
- Anyone who has the room code can join it. Codes are not secret, which suits a party game. The table's policies let anyone with the anon key read and write room rows, and nothing else.
- Old rooms are not removed automatically. To tidy up, enable the `pg_cron` extension and uncomment the optional cleanup block at the bottom of `supabase/schema.sql`, or delete old rows by hand now and then.
