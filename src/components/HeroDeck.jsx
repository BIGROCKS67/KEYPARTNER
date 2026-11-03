import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Briefcase, ArrowRight } from 'lucide-react'
import { useJobs } from '../data/jobs-context'
import { jobPath, shortLocation } from '../lib/jobs'

const STEP_MS = 3600

// Matt's live roles as a stack of cards beside the headline. The top card
// moves to the back every few seconds; each one links to its role.
export function HeroDeck() {
  const { jobs } = useJobs()
  const [top, setTop] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (jobs.length < 2 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setTop(i => (i + 1) % jobs.length), STEP_MS)
    return () => clearInterval(t)
  }, [jobs.length, paused])

  if (!jobs.length) return null
  const shown = Array.from({ length: Math.min(3, jobs.length) }, (_, i) => jobs[(top + i) % jobs.length])

  return (
    <div className="hero-deck" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <p className="hero-deck__head">
        <span className="hero-deck__dot" aria-hidden /> {jobs.length} live {jobs.length === 1 ? 'role' : 'roles'}
      </p>
      <div className="hero-deck__stack">
        {shown.map((j, i) => (
          <Link
            key={j.id}
            to={jobPath(j)}
            className="hero-deck__card"
            style={{ '--i': i }}
            tabIndex={i === 0 ? 0 : -1}
            aria-hidden={i === 0 ? undefined : true}
          >
            <span className="hero-deck__badge"><Briefcase size={11} aria-hidden /> {j.discipline}</span>
            <span className="hero-deck__title">{j.title}</span>
            <span className="hero-deck__meta"><MapPin size={12} aria-hidden /> {shortLocation(j.location)} · {j.type}</span>
            <span className="hero-deck__salary tnum">{j.salary}</span>
            <span className="hero-deck__cta">View role <ArrowRight size={14} aria-hidden /></span>
          </Link>
        ))}
      </div>
      <Link to="/jobs" className="hero-deck__all">See all roles</Link>
    </div>
  )
}
