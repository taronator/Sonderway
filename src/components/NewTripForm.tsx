import { useState, type FormEvent } from 'react'
import { createTrip, validateTrip, type NewTrip } from '../db'

const empty: NewTrip = { name: '', destination: '', startDate: '', endDate: '' }

export function NewTripForm({ onDone }: { onDone: () => void }) {
  const [trip, setTrip] = useState<NewTrip>(empty)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const set = (key: keyof NewTrip) => (e: { target: { value: string } }) =>
    setTrip((t) => ({ ...t, [key]: e.target.value }))

  async function submit(e: FormEvent) {
    e.preventDefault()
    const problem = validateTrip(trip)
    setError(problem)
    if (problem) return
    setSaving(true)
    try {
      await createTrip(trip)
      setTrip(empty)
      onDone()
    } catch {
      setError("Couldn't save the trip on this device. Check that storage isn't full or blocked.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="card new-trip" onSubmit={submit} noValidate>
      <h2>New trip</h2>
      <label>
        <span>Trip name</span>
        <input value={trip.name} onChange={set('name')} placeholder="Summer in Lisbon" autoFocus required />
      </label>
      <label>
        <span>Where to</span>
        <input value={trip.destination} onChange={set('destination')} placeholder="Lisbon, Portugal" />
      </label>
      <div className="row">
        <label>
          <span>Start</span>
          <input type="date" value={trip.startDate} onChange={set('startDate')} />
        </label>
        <label>
          <span>End</span>
          <input type="date" value={trip.endDate} min={trip.startDate || undefined} onChange={set('endDate')} />
        </label>
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="actions">
        <button type="button" className="ghost" onClick={onDone}>
          Cancel
        </button>
        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Create trip'}
        </button>
      </div>
    </form>
  )
}
