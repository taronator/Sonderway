# Sonderway

Wanderlog but improved: a trip planner that keeps working when the signal drops.

## What works today

- Create trips (name, destination, start/end dates) and delete them.
- Open a trip to plan it day by day: add stops (place, food, activity, stay, transport)
  with an optional time and notes, edit them, move them between days, or park them in Ideas.
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

- `src/db.ts`: trips and stops, and the local database
- `src/App.tsx`: header and page switching (`src/useRoute.ts`, hash URLs like `#/trip/<id>`)
- `src/components/TripList.tsx`, `NewTripForm.tsx`, `TripCard.tsx`: the trip list
- `src/components/TripPage.tsx`, `DaySection.tsx`, `ItemForm.tsx`: the day-by-day plan
- `src/dates.ts`: date and time formatting

## Next up

- Edit a trip's name and dates
- Accounts and sign-in (Supabase), then syncing trips across devices
