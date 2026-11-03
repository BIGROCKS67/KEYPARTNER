import { useEffect } from 'react'

// Which background the dark green bands use. Only switchable on preview
// addresses so Matt and Jack can compare; the live site uses DEFAULT_BAND.
export const BAND_OPTIONS = [
  ['dots', 'Dots'],
  ['rings', 'Radar'],
  ['shift', 'Colour shift'],
  ['words', 'Words'],
]
export const DEFAULT_BAND = 'dots'
const KEY = 'kp-band'

export const canSwitchBand = () =>
  typeof window !== 'undefined' && window.location.hostname !== 'ourkeypartnership.co.uk'

export function readBand() {
  if (!canSwitchBand()) return DEFAULT_BAND
  const fromUrl = new URLSearchParams(window.location.search).get('band')
  if (fromUrl && BAND_OPTIONS.some(([k]) => k === fromUrl)) return fromUrl
  try { return localStorage.getItem(KEY) || DEFAULT_BAND } catch { return DEFAULT_BAND }
}

// The choice lives on <html data-band>, so the CSS does the switching and
// the prerendered HTML (no attribute) shows the default.
export function setBand(value) {
  document.documentElement.dataset.band = value
  try { localStorage.setItem(KEY, value) } catch { /* private mode */ }
  const url = new URL(window.location.href)
  url.searchParams.set('band', value)
  window.history.replaceState(window.history.state, '', url)
}

export function useApplyBand() {
  useEffect(() => { document.documentElement.dataset.band = readBand() }, [])
}
