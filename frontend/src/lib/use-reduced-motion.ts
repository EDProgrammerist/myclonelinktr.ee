import { useSyncExternalStore } from 'react'

const query = '(prefers-reduced-motion: reduce)'
const snapshot = () => window.matchMedia(query).matches
const serverSnapshot = () => false
function subscribe(onChange: () => void) {
  const media = window.matchMedia(query)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

// The installed Motion hook snapshots the preference only once. Keep JS effects
// in sync with CSS when the visitor changes the system preference while open.
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot)
}
