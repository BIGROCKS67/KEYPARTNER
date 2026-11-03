import { useHeroChoice } from '../lib/hero-choice'
import { HeroWords } from './HeroWords'
import { HeroDeck } from './HeroDeck'
import { HeroMatt } from './HeroMatt'
import { HeroMap } from './HeroMap'

// The artwork behind or beside the hero text: one of four designs.
export function HeroArt() {
  const choice = useHeroChoice()
  if (choice === 'deck') return <HeroDeck />
  if (choice === 'matt') return <HeroMatt />
  if (choice === 'map') return <HeroMap />
  return <HeroWords />
}
