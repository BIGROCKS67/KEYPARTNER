import { HERO_OPTIONS, setHero, useHeroChoice, canSwitchHero } from '../lib/hero-choice'
import { useHydrated } from '../hooks/useHydrated'

// Preview-only control for comparing hero designs. Never shown on the live domain.
export function HeroSwitcher() {
  const choice = useHeroChoice()
  const hydrated = useHydrated()
  if (!hydrated || !canSwitchHero()) return null
  return (
    <div className="hero-switcher" role="group" aria-label="Preview: choose hero style">
      <span className="hero-switcher__label">Hero style</span>
      {HERO_OPTIONS.map(([key, label]) => (
        <button key={key} type="button" aria-pressed={choice === key} onClick={() => setHero(key)}>
          {label}
        </button>
      ))}
    </div>
  )
}
