import { deleteTrip, type Trip } from '../db'
import { dayCount, formatRange } from '../dates'
import { tripHref } from '../useRoute'

export function TripCard({ trip, stops }: { trip: Trip; stops: number }) {
  const days = dayCount(trip.startDate, trip.endDate)

  function remove() {
    if (confirm(`Delete “${trip.name}” and everything planned in it? This can't be undone.`)) {
      void deleteTrip(trip.id)
    }
  }

  return (
    <li className="card trip">
      <a className="trip-main" href={tripHref(trip.id)}>
        <h3>{trip.name}</h3>
        {trip.destination && <p className="dest">{trip.destination}</p>}
        <p className="dates">
          {formatRange(trip.startDate, trip.endDate)}
          {days !== null && <span className="pill">{days === 1 ? '1 day' : `${days} days`}</span>}
          {stops > 0 && <span className="pill">{stops === 1 ? '1 stop' : `${stops} stops`}</span>}
        </p>
      </a>
      <button className="ghost small" onClick={remove} aria-label={`Delete ${trip.name}`}>
        Delete
      </button>
    </li>
  )
}
