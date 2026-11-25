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

export type ItemKind = 'place' | 'food' | 'stay' | 'transport' | 'activity'

export const ITEM_KINDS: { value: ItemKind; label: string; icon: string }[] = [
  { value: 'place', label: 'Place', icon: '📍' },
  { value: 'food', label: 'Food', icon: '🍽️' },
  { value: 'activity', label: 'Activity', icon: '🎟️' },
  { value: 'stay', label: 'Stay', icon: '🛏️' },
  { value: 'transport', label: 'Transport', icon: '🚆' },
]

/** One stop in a trip's plan. */
export interface Item {
  id: string
  tripId: string
  /** ISO date of the day it's planned for, or empty for "Ideas" (not scheduled yet). */
  day: string
  /** "HH:MM" (24h), or empty when there's no set time. */
  time: string
  title: string
  kind: ItemKind
  notes: string
  createdAt: number
  updatedAt: number
}

export type ItemInput = Pick<Item, 'day' | 'time' | 'title' | 'kind' | 'notes'>

/** Everything lives in IndexedDB on the device, so it works with no connection. */
export const db = new Dexie('sonderway') as Dexie & {
  trips: EntityTable<Trip, 'id'>
  items: EntityTable<Item, 'id'>
}

db.version(1).stores({
  trips: '&id, updatedAt, startDate',
})
db.version(2).stores({
  trips: '&id, updatedAt, startDate',
  items: '&id, tripId, [tripId+day]',
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

/** Deletes the trip and everything planned in it. */
export function deleteTrip(id: string) {
  return db.transaction('rw', db.trips, db.items, async () => {
    await db.items.where('tripId').equals(id).delete()
    await db.trips.delete(id)
  })
}

/** Returns an error message, or null when the trip is valid. */
export function validateTrip(input: NewTrip): string | null {
  if (!input.name.trim()) return 'Give your trip a name.'
  if (input.startDate && input.endDate && input.endDate < input.startDate) {
    return 'The trip has to end on or after the day it starts.'
  }
  return null
}

/** Bumps the trip so recently planned trips sort to the top of the list. */
function touchTrip(tripId: string, now: number) {
  return db.trips.update(tripId, { updatedAt: now })
}

export function addItem(tripId: string, input: ItemInput) {
  const now = Date.now()
  return db.transaction('rw', db.trips, db.items, async () => {
    await db.items.add({
      id: crypto.randomUUID(),
      tripId,
      ...clean(input),
      createdAt: now,
      updatedAt: now,
    })
    await touchTrip(tripId, now)
  })
}

export function updateItem(item: Item, input: ItemInput) {
  const now = Date.now()
  return db.transaction('rw', db.trips, db.items, async () => {
    await db.items.update(item.id, { ...clean(input), updatedAt: now })
    await touchTrip(item.tripId, now)
  })
}

export function deleteItem(item: Item) {
  return db.transaction('rw', db.trips, db.items, async () => {
    await db.items.delete(item.id)
    await touchTrip(item.tripId, Date.now())
  })
}

function clean(input: ItemInput): ItemInput {
  return { ...input, title: input.title.trim(), notes: input.notes.trim() }
}

/** Timed stops first in time order, then untimed ones in the order they were added. */
export function sortItems(items: Item[]): Item[] {
  return [...items].sort((a, b) => {
    if (a.time && b.time) return a.time.localeCompare(b.time) || a.createdAt - b.createdAt
    if (a.time) return -1
    if (b.time) return 1
    return a.createdAt - b.createdAt
  })
}
