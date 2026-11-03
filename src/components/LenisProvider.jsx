import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function LenisProvider({ children }) {
  useEffect(() => {
    // People who ask for reduced motion get native scrolling and still videos.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduce.matches) {
      const pause = () => document.querySelectorAll('video[autoplay]').forEach(v => v.pause())
      pause()
      const observer = new MutationObserver(pause)
      observer.observe(document.body, { childList: true, subtree: true })
      return () => observer.disconnect()
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // In-page links (e.g. "Apply for this role") glide to their target,
      // stopping below the fixed nav.
      anchors: { offset: -96 },
    })

    const tickerFn = (time) => {
      lenis.raf(time * 1000)
    }

    lenis.on('scroll', ScrollTrigger.update)
    lenis.on('scroll', ({ scroll }) => {
      window.dispatchEvent(new CustomEvent('lenis-scroll', { detail: { scroll } }))
    })

    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tickerFn)
      lenis.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return <>{children}</>
}
