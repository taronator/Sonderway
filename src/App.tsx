import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './db'
import { useOnline } from './useOnline'
import { NewTripForm } from './components/NewTripForm'
import { TripCard } from './components/TripCard'

export default function App() {
  const online = useOnline()
  const [creating, setCreating] = useState(false)
  // Re-renders automatically whenever the trips table changes.
  const trips = useLiveQuery(() => db.trips.orderBy('updatedAt').reverse().toArray())

  return (
    <div className="shell">
      <header className="top">
        <div className="brand">
          <img src="/icon.svg" alt="" width={32} height={32} />
          <span>Sonderway</span>
        </div>
        <span className={`status ${online ? 'on' : 'off'}`} title="Your trips are saved on this device either way">
          {online ? 'Online' : 'Offline · saving on device'}
        </span>
      </header>

      <main>
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
              <TripCard key={t.id} trip={t} />
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
