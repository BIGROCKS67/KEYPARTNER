import { useState } from 'react'
import { BAND_OPTIONS, canSwitchBand, readBand, setBand, useApplyBand } from '../lib/band-choice'
import { useHydrated } from '../hooks/useHydrated'

// Preview-only control for comparing green band backgrounds. Never shown on the live domain.
export function BandSwitcher() {
  useApplyBand()
  const hydrated = useHydrated()
  const [choice, setChoice] = useState(readBand)
  if (!hydrated || !canSwitchBand()) return null
  return (
    <div className="hero-switcher" role="group" aria-label="Preview: choose green band style">
      <span className="hero-switcher__label">Green bands</span>
      {BAND_OPTIONS.map(([key, label]) => (
        <button key={key} type="button" aria-pressed={choice === key} onClick={() => { setBand(key); setChoice(key) }}>
          {label}
        </button>
      ))}
    </div>
  )
}
