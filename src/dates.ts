const fmt = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
const fmtNoYear = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })

/** Parse YYYY-MM-DD as a local date (new Date('2026-05-01') would be UTC and can shift a day). */
function parse(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
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
