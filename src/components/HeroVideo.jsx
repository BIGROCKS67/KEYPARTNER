import { useEffect, useRef, useState } from 'react'

// Background video that fades in once it can play (no flash of a blank
// frame) and stays still for people who ask for reduced motion.
export function HeroVideo({ src, sources, className = 'hero-video-bg', vidClass = 'hero-video-bg__vid', overlayClass = 'hero-video-bg__overlay', preload = 'auto', style }) {
  const ref = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (v.readyState >= 3) setReady(true)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) v.pause()
  }, [])

  const list = sources || [src]
  return (
    <div className={className} aria-hidden>
      <video
        ref={ref}
        autoPlay muted loop playsInline preload={preload}
        className={`${vidClass} video-fade${ready ? ' is-ready' : ''}`}
        style={style}
        onCanPlay={() => setReady(true)}
      >
        {list.map(s => <source key={s} src={s} type="video/mp4" />)}
      </video>
      <div className={overlayClass} />
    </div>
  )
}
