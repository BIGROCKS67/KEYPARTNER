import { useEffect, useRef } from 'react'

// A soft light that follows the mouse across a dark hero and lifts whatever
// sits beneath it. With `wander`, the light drifts on its own whenever the
// mouse isn't over the hero (and always on touch screens). Still and centred
// for people who ask for reduced motion.
export function HeroSpotlight({ wander = false }) {
  const ref = useRef(null)

  useEffect(() => {
    const hero = ref.current?.parentElement
    if (!hero) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const set = (x, y, on) => {
      hero.style.setProperty('--spot-x', `${x.toFixed(1)}px`)
      hero.style.setProperty('--spot-y', `${y.toFixed(1)}px`)
      hero.style.setProperty('--spot-on', on.toFixed(3))
    }

    if (reduce) {
      if (!wander) return
      hero.classList.add('has-spotlight')
      const r = hero.getBoundingClientRect()
      set(r.width * 0.72, r.height * 0.45, 1)
      return () => hero.classList.remove('has-spotlight')
    }
    if (!fine && !wander) return

    hero.classList.add('has-spotlight')
    let pointer = null
    let x = -999, y = -999, on = 0, frame = 0
    const start = performance.now()

    const tick = (now) => {
      const r = hero.getBoundingClientRect()
      let tx, ty, onTarget
      if (pointer) {
        tx = pointer.x; ty = pointer.y; onTarget = 1
      } else if (wander) {
        // A slow figure-of-eight over the right half of the hero
        const t = (now - start) / 1000
        tx = r.width * (0.62 + 0.24 * Math.sin(t * 0.32))
        ty = r.height * (0.48 + 0.26 * Math.sin(t * 0.47 + 1.2))
        onTarget = 1
      } else {
        tx = x; ty = y; onTarget = 0
      }
      if (x < -900) { x = tx; y = ty }
      x += (tx - x) * (pointer ? 0.14 : 0.05)
      y += (ty - y) * (pointer ? 0.14 : 0.05)
      on += (onTarget - on) * 0.08
      set(x, y, on)
      frame = requestAnimationFrame(tick)
    }

    const move = (e) => {
      if (e.pointerType !== 'mouse') return
      const r = hero.getBoundingClientRect()
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const leave = () => { pointer = null }
    const io = new IntersectionObserver(([en]) => {
      cancelAnimationFrame(frame)
      if (en.isIntersecting) frame = requestAnimationFrame(tick)
    })
    io.observe(hero)
    hero.addEventListener('pointermove', move)
    hero.addEventListener('pointerleave', leave)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
      hero.removeEventListener('pointermove', move)
      hero.removeEventListener('pointerleave', leave)
      hero.classList.remove('has-spotlight')
    }
  }, [wander])

  return <div ref={ref} className="hero-spotlight" aria-hidden />
}
