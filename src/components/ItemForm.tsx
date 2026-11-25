import { useState, type FormEvent } from 'react'
import { ITEM_KINDS, type ItemInput } from '../db'

export interface DayOption {
  value: string
  label: string
}

interface Props {
  initial: ItemInput
  /** When given, shows a "Day" picker so the stop can be moved. */
  dayOptions?: DayOption[]
  submitLabel: string
  onSubmit: (input: ItemInput) => Promise<void>
  onCancel: () => void
}

export function ItemForm({ initial, dayOptions, submitLabel, onSubmit, onCancel }: Props) {
  const [item, setItem] = useState<ItemInput>(initial)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const set = (key: keyof ItemInput) => (e: { target: { value: string } }) =>
    setItem((i) => ({ ...i, [key]: e.target.value }))

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!item.title.trim()) {
      setError('Add a name for this stop.')
      return
    }
    setError(null)
    setSaving(true)
    try {
      await onSubmit(item)
    } catch {
      setError("Couldn't save on this device. Check that storage isn't full or blocked.")
      setSaving(false)
    }
  }

  return (
    <form className="item-form" onSubmit={submit} noValidate>
      <div className="kinds" role="radiogroup" aria-label="Type">
        {ITEM_KINDS.map((k) => (
          <button
            key={k.value}
            type="button"
            role="radio"
            aria-checked={item.kind === k.value}
            className={`chip ${item.kind === k.value ? 'on' : ''}`}
            onClick={() => setItem((i) => ({ ...i, kind: k.value }))}
          >
            <span aria-hidden>{k.icon}</span> {k.label}
          </button>
        ))}
      </div>
      <div className="row title-row">
        <label>
          <span>Name</span>
          <input value={item.title} onChange={set('title')} placeholder="Pastéis de Belém" autoFocus />
        </label>
        <label className="time">
          <span>Time</span>
          <input type="time" value={item.time} onChange={set('time')} />
        </label>
      </div>
      {dayOptions && (
        <label>
          <span>Day</span>
          <select value={item.day} onChange={set('day')}>
            {dayOptions.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
      )}
      <label>
        <span>Notes</span>
        <textarea value={item.notes} onChange={set('notes')} rows={2} placeholder="Address, booking number, tips…" />
      </label>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="actions">
        <button type="button" className="ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
