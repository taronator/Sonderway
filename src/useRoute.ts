import { useSyncExternalStore } from 'react'

export type Route = { page: 'trips' } | { page: 'trip'; id: string }

function subscribe(cb: () => void) {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

/**
 * Hash-based routing (#/trip/<id>). The server only ever serves index.html,
 * so every page works offline from the service worker's cache.
 */
export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash)
  const match = hash.match(/^#\/trip\/([\w-]+)$/)
  return match ? { page: 'trip', id: match[1] } : { page: 'trips' }
}

export const tripHref = (id: string) => `#/trip/${id}`
