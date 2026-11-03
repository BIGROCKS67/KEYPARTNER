import { useSyncExternalStore } from 'react'

const noop = () => () => {}

// False in the prerender and during hydration, true afterwards. Lets a page
// show browser-only values (today's date, URL filters) without a mismatch.
export const useHydrated = () => useSyncExternalStore(noop, () => true, () => false)
