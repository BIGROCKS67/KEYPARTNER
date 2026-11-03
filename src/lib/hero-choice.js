import { useSyncExternalStore } from 'react'

// Which hero design to show. Only switchable on preview addresses, so
// Matt and Jack can compare; the live site always uses DEFAULT_HERO.
export const HERO_OPTIONS = [
  ['words', 'Headhunt'],
  ['deck', 'Live roles'],
  ['matt', 'Matt'],
  ['map', 'Map'],
]
export const DEFAULT_HERO = 'words'
const KEY = 'kp-hero'
const listeners = new Set()

export const canSwitchHero = () =>
  typeof window !== 'undefined' && window.location.hostname !== 'ourkeypartnership.co.uk'

function read() {
  if (!canSwitchHero()) return DEFAULT_HERO
  const fromUrl = new URLSearchParams(window.location.search).get('hero')
  if (fromUrl && HERO_OPTIONS.some(([k]) => k === fromUrl)) return fromUrl
  try { return localStorage.getItem(KEY) || DEFAULT_HERO } catch { return DEFAULT_HERO }
}

export function setHero(value) {
  try { localStorage.setItem(KEY, value) } catch { /* private mode */ }
  const url = new URL(window.location.href)
  url.searchParams.set('hero', value)
  window.history.replaceState(window.history.state, '', url)
  listeners.forEach(l => l())
}

const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l) }
// The server and the first client render both use the default, then the
// saved choice takes over, so hydration always matches.
export const useHeroChoice = () => useSyncExternalStore(subscribe, read, () => DEFAULT_HERO)
