import { useEffect, useRef } from 'react'

// Matt's portrait beside the headline in brand-green duotone; under the
// spotlight the real colour shows through.
export function HeroMatt() {
  const frame = useRef(null)

  // The spotlight position is measured from the hero, so tell the frame
  // where it sits inside the hero to line the reveal up.
  useEffect(() => {
    const el = frame.current
    const hero = el?.closest('.hero')
    if (!el || !hero) return
    const measure = () => {
      const a = el.getBoundingClientRect(), b = hero.getBoundingClientRect()
      el.style.setProperty('--fx', `${a.left - b.left}px`)
      el.style.setProperty('--fy', `${a.top - b.top}px`)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <figure className="hero-matt">
      <div className="hero-matt__frame" ref={frame}>
        <img className="hero-matt__img" src="/matt.jpg" alt="Matt Stimpson, founder of Key Partnership Recruitment" width="807" height="1024" />
        <img className="hero-matt__img hero-matt__img--lit" src="/matt.jpg" alt="" width="807" height="1024" aria-hidden />
      </div>
      <figcaption className="hero-matt__card">
        <strong>Matt Stimpson</strong>
        <span>Founder and Managing Director. REC UK Recruitment Apprentice of the Year.</span>
      </figcaption>
    </figure>
  )
}
