import { useEffect, useRef } from 'react'
import { HeroSpotlight } from './HeroSpotlight'

// Background for the dark green bands. Every style is in the markup and the
// CSS shows the chosen one (see lib/band-choice.js).
export function BandArt() {
  const shift = useRef(null)

  // Colour shift: settle to the dark green once the band is well in view,
  // and reset once it has fully left so it plays again next time.
  useEffect(() => {
    const el = shift.current
    const band = el?.parentElement?.parentElement
    if (!band) return
    const io = new IntersectionObserver(([en]) => {
      if (en.intersectionRatio >= 0.35) el.classList.add('is-in')
      else if (!en.isIntersecting) el.classList.remove('is-in')
    }, { threshold: [0, 0.35] })
    io.observe(band)
    return () => io.disconnect()
  }, [])

  return (
    <>
      <div className="band-art" aria-hidden>
        <div className="band-dots" />
        <div className="band-dots band-dots--lit" />
        <svg className="band-rings" viewBox="0 0 1000 1000" preserveAspectRatio="xMaxYMax slice">
          {[120, 240, 360, 480, 600, 720, 840].map(r => <circle key={r} cx="1000" cy="1000" r={r} />)}
          <circle className="band-rings__pulse" cx="1000" cy="1000" r="840" />
        </svg>
        <div ref={shift} className="band-shift" />
      </div>
      <HeroSpotlight wander />
    </>
  )
}
