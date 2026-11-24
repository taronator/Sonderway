# Sonderway

Wanderlog but improved: a trip planner that keeps working when the signal drops.

## What works today

- Create trips (name, destination, start/end dates) and delete them.
- Everything is saved on the device in IndexedDB, so it works with no connection.
- Installable app (PWA) with a service worker that caches the app, so it opens offline after the first visit.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173 (no offline caching in dev)
npm run build && npm run preview   # http://localhost:4173 (offline caching on)
```

To test offline: open the preview URL in Chrome, reload once, then turn on
DevTools → Network → Offline and reload again.

## Stack

React + TypeScript + Vite, [Dexie](https://dexie.org) for IndexedDB, `vite-plugin-pwa` for the service worker.

## Code map

- `src/db.ts`: trip data model and local database
- `src/App.tsx`: trip list screen
- `src/components/NewTripForm.tsx`, `src/components/TripCard.tsx`
- `src/dates.ts`: date range formatting

## Next up

- Accounts and sign-in (Supabase), then syncing trips across devices
- Trip detail page with a day-by-day itinerary
