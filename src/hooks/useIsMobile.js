import { useSyncExternalStore } from 'react'

// Reads the viewport after hydration so prerendered HTML (desktop) and the
// first client render match; phones switch on the next render.
export function useIsMobile(breakpoint = 768) {
  const query = `(max-width: ${breakpoint}px)`
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
