import { useEffect, useRef } from 'react'

const easeOut = (t) => 1 - Math.pow(1 - t, 4)

// Counts a figure like "95%" or "500+" up from zero once it is on screen.
// The prerendered HTML shows the final figure, and a hidden copy of it
// holds the width so nothing shifts while the digits change. Digits are
// written straight to the DOM so React does not re-render every frame.
export function CountUp({ value, delay = 0, duration = 1600 }) {
  const wrap = useRef(null)
  const out = useRef(null)

  useEffect(() => {
    const match = String(value).match(/^(\D*)(\d[\d,]*)(.*)$/)
    if (!match || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const [, pre, num, post] = match
    const target = Number(num.replace(/,/g, ''))
    const grouped = num.includes(',')
    const write = (n) => {
      // The span is gone once the page has navigated away
      if (!out.current) return
      out.current.textContent = `${pre}${grouped ? n.toLocaleString('en-GB') : n}${post}`
    }
    let frame = 0
    let timer = 0
    write(0)

    const run = () => {
      const start = performance.now()
      const step = (now) => {
        const t = Math.min((now - start) / duration, 1)
        write(Math.round(easeOut(t) * target))
        if (t < 1) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    }

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      timer = setTimeout(run, delay)
    }, { threshold: 0.4 })
    io.observe(wrap.current)

    return () => { io.disconnect(); clearTimeout(timer); cancelAnimationFrame(frame); write(target) }
  }, [value, delay, duration])

  return (
    <span ref={wrap} className="count-up">
      <span className="count-up__sizer" aria-hidden>{value}</span>
      <span ref={out} className="count-up__value" aria-hidden>{value}</span>
      <span className="visually-hidden">{value}</span>
    </span>
  )
}
