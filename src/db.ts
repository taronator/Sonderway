import Dexie, { type EntityTable } from 'dexie'

export interface Trip {
  id: string
  name: string
  destination: string
  /** ISO date (YYYY-MM-DD), or empty when not decided yet. */
  startDate: string
  endDate: string
  createdAt: number
  updatedAt: number
}

export type NewTrip = Pick<Trip, 'name' | 'destination' | 'startDate' | 'endDate'>

/** Everything lives in IndexedDB on the device, so it works with no connection. */
export const db = new Dexie('sonderway') as Dexie & {
  trips: EntityTable<Trip, 'id'>
}

db.version(1).stores({
  trips: '&id, updatedAt, startDate',
})

export async function createTrip(input: NewTrip): Promise<Trip> {
  const now = Date.now()
  const trip: Trip = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    destination: input.destination.trim(),
    startDate: input.startDate,
    endDate: input.endDate,
    createdAt: now,
    updatedAt: now,
  }
  await db.trips.add(trip)
  return trip
}

export function deleteTrip(id: string) {
  return db.trips.delete(id)
}

/** Returns an error message, or null when the trip is valid. */
export function validateTrip(input: NewTrip): string | null {
  if (!input.name.trim()) return 'Give your trip a name.'
  if (input.startDate && input.endDate && input.endDate < input.startDate) {
    return 'The trip has to end on or after the day it starts.'
  }
  return null
}
