import { useLiveQuery } from 'dexie-react-hooks'
import { db, sortItems, type Item } from '../db'
import { formatDay, formatRange, listDays } from '../dates'
import { DaySection } from './DaySection'
import type { DayOption } from './ItemForm'

export function TripPage({ id }: { id: string }) {
  // null = no such trip; undefined = still loading.
  const trip = useLiveQuery(async () => (await db.trips.get(id)) ?? null, [id])
  const items = useLiveQuery(() => db.items.where('tripId').equals(id).toArray(), [id])

  if (trip === undefined || items === undefined) return null
  if (trip === null) {
    return (
      <div className="empty" style={{ marginTop: 32 }}>
        <p>This trip isn't on this device.</p>
        <p className="muted">
          It may have been deleted. <a href="#/">Back to your trips</a>
        </p>
      </div>
    )
  }

  const days = listDays(trip.startDate, trip.endDate)
  const dayOptions: DayOption[] = [
    { value: '', label: 'Ideas (no day yet)' },
    ...days.map((d, i) => ({ value: d, label: `Day ${i + 1} · ${formatDay(d)}` })),
  ]

  // Stops whose day is no longer part of the trip (dates changed) fall back to Ideas.
  const byDay = new Map<string, Item[]>([['', []], ...days.map((d) => [d, []] as [string, Item[]])])
  for (const item of items) (byDay.get(item.day) ?? byDay.get('')!).push(item)

  return (
    <>
      <nav className="crumbs">
        <a href="#/">← All trips</a>
      </nav>
      <section className="trip-head">
        <h1>{trip.name}</h1>
        <p className="muted">
          {[trip.destination, formatRange(trip.startDate, trip.endDate)].filter(Boolean).join(' · ')}
        </p>
      </section>

      {days.length === 0 && (
        <p className="hint">Add start and end dates to this trip to plan it day by day. Until then, collect ideas below.</p>
      )}

      {days.map((d, i) => (
        <DaySection
          key={d}
          tripId={trip.id}
          day={d}
          heading={`Day ${i + 1}`}
          subheading={formatDay(d)}
          items={sortItems(byDay.get(d)!)}
          dayOptions={dayOptions}
        />
      ))}

      <DaySection
        tripId={trip.id}
        day=""
        heading="Ideas"
        subheading="Not on a day yet"
        items={sortItems(byDay.get('')!)}
        dayOptions={dayOptions}
      />
    </>
  )
}
