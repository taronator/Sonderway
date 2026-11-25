import { useState } from 'react'
import { addItem, deleteItem, ITEM_KINDS, updateItem, type Item } from '../db'
import { formatTime } from '../dates'
import { ItemForm, type DayOption } from './ItemForm'

interface Props {
  tripId: string
  /** ISO date, or '' for the Ideas section. */
  day: string
  heading: string
  subheading?: string
  items: Item[]
  dayOptions: DayOption[]
}

export function DaySection({ tripId, day, heading, subheading, items, dayOptions }: Props) {
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <section className="day" aria-label={heading}>
      <header className="day-head">
        <h2>{heading}</h2>
        {subheading && <span className="muted">{subheading}</span>}
      </header>

      {items.length > 0 && (
        <ol className="stops">
          {items.map((item) =>
            editingId === item.id ? (
              <li key={item.id} className="stop editing">
                <ItemForm
                  initial={{ day: item.day, time: item.time, title: item.title, kind: item.kind, notes: item.notes }}
                  dayOptions={dayOptions}
                  submitLabel="Save"
                  onSubmit={async (input) => {
                    await updateItem(item, input)
                    setEditingId(null)
                  }}
                  onCancel={() => setEditingId(null)}
                />
              </li>
            ) : (
              <Stop key={item.id} item={item} onEdit={() => setEditingId(item.id)} />
            ),
          )}
        </ol>
      )}

      {adding ? (
        <ItemForm
          initial={{ day, time: '', title: '', kind: 'place', notes: '' }}
          submitLabel="Add"
          onSubmit={async (input) => {
            await addItem(tripId, input)
            setAdding(false)
          }}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button className="add-stop" onClick={() => setAdding(true)}>
          + Add {items.length ? 'another' : day ? 'a stop' : 'an idea'}
        </button>
      )}
    </section>
  )
}

function Stop({ item, onEdit }: { item: Item; onEdit: () => void }) {
  const kind = ITEM_KINDS.find((k) => k.value === item.kind) ?? ITEM_KINDS[0]

  function remove() {
    if (confirm(`Remove “${item.title}”?`)) void deleteItem(item)
  }

  return (
    <li className={`stop kind-${item.kind}`}>
      <span className="stop-icon" title={kind.label} aria-hidden>
        {kind.icon}
      </span>
      <div className="stop-body">
        <p className="stop-title">
          {item.time && <time className="stop-time">{formatTime(item.time)}</time>}
          {item.title}
        </p>
        {item.notes && <p className="stop-notes">{item.notes}</p>}
      </div>
      <div className="stop-actions">
        <button className="ghost small" onClick={onEdit} aria-label={`Edit ${item.title}`}>
          Edit
        </button>
        <button className="ghost small" onClick={remove} aria-label={`Remove ${item.title}`}>
          ✕
        </button>
      </div>
    </li>
  )
}
