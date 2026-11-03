import { useEffect, useRef } from 'react'

// A soft light that follows the mouse across a dark hero and lifts the
// tint over the video beneath it. Mouse and trackpad only; switched off
// for touch screens and for people who ask for reduced motion.
export function HeroSpotlight() {
  const ref = useRef(null)

  useEffect(() => {
    const light = ref.current
    const hero = light?.parentElement
    if (!hero) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    hero.classList.add('has-spotlight')
    let target = null
    let x = 0, y = 0, frame = 0, on = 0, onTarget = 0

    const tick = () => {
      if (target) {
        x += (target.x - x) * 0.14
        y += (target.y - y) * 0.14
      }
      on += (onTarget - on) * 0.1
      hero.style.setProperty('--spot-x', `${x.toFixed(1)}px`)
      hero.style.setProperty('--spot-y', `${y.toFixed(1)}px`)
      hero.style.setProperty('--spot-on', on.toFixed(3))
      const settled = Math.abs(onTarget - on) < 0.002 && (!target || (Math.abs(target.x - x) < 0.3 && Math.abs(target.y - y) < 0.3))
      frame = settled ? 0 : requestAnimationFrame(tick)
    }
    const wake = () => { if (!frame) frame = requestAnimationFrame(tick) }

    const move = (e) => {
      const r = hero.getBoundingClientRect()
      const p = { x: e.clientX - r.left, y: e.clientY - r.top }
      if (!target) { x = p.x; y = p.y }
      target = p
      onTarget = 1
      wake()
    }
    const leave = () => { onTarget = 0; wake() }

    hero.addEventListener('pointermove', move)
    hero.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      hero.removeEventListener('pointermove', move)
      hero.removeEventListener('pointerleave', leave)
      hero.classList.remove('has-spotlight')
    }
  }, [])

  return <div ref={ref} className="hero-spotlight" aria-hidden />
}
