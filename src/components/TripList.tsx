import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { NewTripForm } from './NewTripForm'
import { TripCard } from './TripCard'

export function TripList() {
  const [creating, setCreating] = useState(false)
  // Re-renders automatically whenever the trips table changes.
  const trips = useLiveQuery(() => db.trips.orderBy('updatedAt').reverse().toArray())
  const counts = useLiveQuery(async () => {
    const byTrip: Record<string, number> = {}
    await db.items.each((i) => {
      byTrip[i.tripId] = (byTrip[i.tripId] ?? 0) + 1
    })
    return byTrip
  })

  return (
    <>
      <section className="intro">
        <h1>Your trips</h1>
        {!creating && <button onClick={() => setCreating(true)}>+ New trip</button>}
      </section>

      {creating && <NewTripForm onDone={() => setCreating(false)} />}

      {trips === undefined ? null : trips.length === 0 ? (
        !creating && (
          <div className="empty">
            <p>No trips yet.</p>
            <p className="muted">Create one. It's saved right on this device, so it works with no signal.</p>
          </div>
        )
      ) : (
        <ul className="trips">
          {trips.map((t) => (
            <TripCard key={t.id} trip={t} stops={counts?.[t.id] ?? 0} />
          ))}
        </ul>
      )}
    </>
  )
}
