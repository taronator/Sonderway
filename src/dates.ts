const fmt = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
const fmtNoYear = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })
const fmtDay = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
const fmtTime = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })

/** Longest trip we lay out day by day; keeps a typo like 2207 from making thousands of sections. */
const MAX_DAYS = 90

/** Parse YYYY-MM-DD as a local date (new Date('2026-05-01') would be UTC and can shift a day). */
function parse(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function toIso(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function formatRange(start: string, end: string): string {
  if (!start && !end) return 'Dates not set'
  if (start && !end) return `From ${fmt.format(parse(start))}`
  if (!start && end) return `Until ${fmt.format(parse(end))}`
  const s = parse(start)
  const e = parse(end)
  if (start === end) return fmt.format(s)
  const sameYear = s.getFullYear() === e.getFullYear()
  return `${(sameYear ? fmtNoYear : fmt).format(s)} – ${fmt.format(e)}`
}

/** Number of days the trip covers, counting both the first and last day. */
export function dayCount(start: string, end: string): number | null {
  if (!start || !end) return null
  const ms = parse(end).getTime() - parse(start).getTime()
  return Math.round(ms / 86_400_000) + 1
}

/** Every date of the trip as YYYY-MM-DD. With only a start date, just that day. */
export function listDays(start: string, end: string): string[] {
  if (!start) return []
  if (!end || end < start) return [start]
  const days: string[] = []
  const d = parse(start)
  while (days.length < MAX_DAYS) {
    const iso = toIso(d)
    days.push(iso)
    if (iso === end) break
    d.setDate(d.getDate() + 1)
  }
  return days
}

/** "Thu, Jun 10" */
export function formatDay(iso: string): string {
  return fmtDay.format(parse(iso))
}

/** "14:30" → "2:30 PM" (or the 24h form, depending on the device's locale). */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  return fmtTime.format(new Date(2000, 0, 1, h, m))
}
