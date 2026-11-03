import { useEffect, useState } from 'react'
import { useHydrated } from '../hooks/useHydrated'

// Local time where Matt's clients are. Times appear once the page is running
// in the browser, so the built HTML never holds a stale clock.
const PLACES = [
  ['Milton Keynes', 'Europe/London'],
  ['Dubai', 'Asia/Dubai'],
  ['Sydney', 'Australia/Sydney'],
  ['Auckland', 'Pacific/Auckland'],
]

const fmt = (tz, d) => new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit' }).format(d)

export function WorldTimes() {
  const hydrated = useHydrated()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(id)
  }, [])

  return (
    <ul className="world-times" aria-label="Local time where our clients are">
      {PLACES.map(([place, tz]) => (
        <li key={place}>
          <span className="world-times__place">{place}</span>
          <span className="world-times__time">{hydrated ? fmt(tz, now) : '--:--'}</span>
        </li>
      ))}
    </ul>
  )
}
