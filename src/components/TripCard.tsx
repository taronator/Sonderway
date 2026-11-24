import { deleteTrip, type Trip } from '../db'
import { dayCount, formatRange } from '../dates'

export function TripCard({ trip }: { trip: Trip }) {
  const days = dayCount(trip.startDate, trip.endDate)

  function remove() {
    if (confirm(`Delete “${trip.name}”? This can't be undone.`)) void deleteTrip(trip.id)
  }

  return (
    <li className="card trip">
      <div className="trip-main">
        <h3>{trip.name}</h3>
        {trip.destination && <p className="dest">{trip.destination}</p>}
        <p className="dates">
          {formatRange(trip.startDate, trip.endDate)}
          {days !== null && <span className="pill">{days === 1 ? '1 day' : `${days} days`}</span>}
        </p>
      </div>
      <button className="ghost small" onClick={remove} aria-label={`Delete ${trip.name}`}>
        Delete
      </button>
    </li>
  )
}
