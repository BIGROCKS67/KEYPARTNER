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
  showBand()
  try { localStorage.setItem(KEY, value) } catch { /* private mode */ }
  const url = new URL(window.location.href)
  url.searchParams.set('band', value)
  window.history.replaceState(window.history.state, '', url)
}

export function useApplyBand() {
  useEffect(() => { document.documentElement.dataset.band = readBand() }, [])
}

// Preview helper: bring a green band into view so the change can be seen,
// and replay the colour shift.
function showBand() {
  const bands = [...document.querySelectorAll('.glow-band')]
  if (!bands.length) return
  const inView = bands.find(b => {
    const r = b.getBoundingClientRect()
    return r.top < window.innerHeight * 0.8 && r.bottom > window.innerHeight * 0.2
  })
  if (!inView) {
    const next = bands.find(b => b.getBoundingClientRect().top > 0) || bands[bands.length - 1]
    // Lenis runs the page scroll, so go through it when it is there
    if (window.__kpLenis) window.__kpLenis.scrollTo(next, { offset: -80, duration: 1.2 })
    else window.scrollTo({ top: next.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' })
  }
  document.querySelectorAll('.band-shift').forEach(el => {
    el.classList.remove('is-in')
    setTimeout(() => el.classList.add('is-in'), 900)
  })
}
