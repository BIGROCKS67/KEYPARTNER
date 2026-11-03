import { useState, useEffect, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, MapPin, Calendar, Briefcase, Mail, Check, Banknote, Search, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HeroSpotlight } from '../components/HeroSpotlight'
import { HeroArt } from '../components/HeroArt'
import { useJobs } from '../data/jobs-context'
import { formatDate as fmtDate, plainText } from '../lib/jobs'
import { JobCardSkeleton } from '../components/Skeleton'

gsap.registerPlugin(ScrollTrigger)


export function Jobs() {
  const [search, setSearch] = useState('')
  const [filterLocation, setFilterLocation] = useState('')
  const [filterType, setFilterType] = useState('')

  const { jobs: displayJobs, fresh } = useJobs()

  const locations = useMemo(() => {
    const raw = displayJobs.map(j => j.location).filter(Boolean)
    return [...new Set(raw)].sort()
  }, [displayJobs])

  const types = useMemo(() => {
    const raw = displayJobs.map(j => j.type).filter(Boolean)
    return [...new Set(raw)].sort()
  }, [displayJobs])

  const filteredJobs = useMemo(() => {
    const q = search.toLowerCase().trim()
    return displayJobs.filter(j => {
      const matchSearch = !q ||
        j.title?.toLowerCase().includes(q) ||
        j.description?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q) ||
        j.discipline?.toLowerCase().includes(q)
      const matchLocation = !filterLocation || j.location === filterLocation
      const matchType = !filterType || j.type === filterType
      return matchSearch && matchLocation && matchType
    })
  }, [displayJobs, search, filterLocation, filterType])

  const hasFilters = search || filterLocation || filterType

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set('[data-reveal]', { opacity: 1, y: 0 })
      return
    }
    const els = gsap.utils.toArray('[data-reveal]')
    els.forEach(el => {
      gsap.from(el, {
        opacity: 0, y: 32, duration: 0.8, ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' },
      })
    })
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero hero--dark hero--map">
        <HeroArt />
        <div className="hero-dark-grain" aria-hidden />
        <HeroSpotlight wander />

        <div className="container hero-dark-content">
          <p className="eyebrow hero-dark-eyebrow hero-ani-1">Current Opportunities</p>
          <h1 className="hero-dark-title hero-ani-2">
            Your Next Move<br />Starts Here.
          </h1>
          <p className="hero-dark-sub hero-ani-3">
            Technology, Commercial &amp; Data/AI roles across the UK, UAE and Australia.
          </p>
          <div className="hero-actions hero-ani-4">
            <a href="mailto:info@ourkeypartnership.co.uk?subject=CV Submission" className="btn btn-dark-outline">
              Submit your CV
            </a>
          </div>
        </div>
      </section>

      {/* ── JOB LISTINGS ── */}
      <section
        className="jobs-listings-section"
        id="listings"
      >
        <div className="jobs-listings-overlay" aria-hidden />
        <div className="container jobs-listings-inner">
          <div className="jobs-listings-header" data-reveal>
            <h2 className="section-title" style={{textAlign:'center'}}>Latest Vacancies</h2>
          </div>

          {/* ── Search & filter bar ── */}
          {displayJobs.length > 0 && (
            <div className="jobs-filter-bar" data-reveal>
              <div className="jobs-filter-search">
                <Search size={15} className="jobs-filter-search-icon" />
                <input
                  type="search"
                  aria-label="Search roles"
                  enterKeyHint="search"
                  placeholder="Search roles, skills, keywords…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="jobs-filter-input"
                />
                {search && (
                  <button type="button" className="jobs-filter-clear" onClick={() => setSearch('')} aria-label="Clear search">
                    <X size={13} />
                  </button>
                )}
              </div>
              <select
                className="jobs-filter-select"
                aria-label="Filter by location"
                value={filterLocation}
                onChange={e => setFilterLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <select
                className="jobs-filter-select"
                aria-label="Filter by work type"
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
              >
                <option value="">All Types</option>
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {hasFilters && (
                <button type="button" className="jobs-filter-reset" onClick={() => { setSearch(''); setFilterLocation(''); setFilterType('') }}>
                  Clear filters
                </button>
              )}
            </div>
          )}

          {hasFilters && (
            <p className="jobs-results-count" role="status">
              Showing {filteredJobs.length} of {displayJobs.length} {displayJobs.length === 1 ? 'role' : 'roles'}
            </p>
          )}

          <div className="jobs-list">
            {filteredJobs.length === 0 && displayJobs.length > 0 && (
              <div className="jobs-empty" data-reveal>
                <p>No roles match your filters. <button type="button" className="jobs-filter-reset" onClick={() => { setSearch(''); setFilterLocation(''); setFilterType('') }}>clear filters</button> to see all.</p>
              </div>
            )}
            {displayJobs.length === 0 && !fresh && [0, 1, 2].map(i => <JobCardSkeleton key={i} />)}
            {displayJobs.length === 0 && fresh && (
              <div className="jobs-empty" data-reveal>
                <p>No roles live right now. Check back soon, or <a href="mailto:info@ourkeypartnership.co.uk?subject=CV Submission">submit your CV</a> for future opportunities.</p>
              </div>
            )}
            {filteredJobs.map(j => (
              <Link key={j.id} to={`/jobs/${j.id}`} className="job-listing-card" data-reveal>
                <div className="job-listing-card__top">
                  <div className="job-listing-card__badges">
                    <span className="job-badge"><Briefcase size={11} />{j.discipline}</span>
                    <span className="job-listing-type">{j.type}</span>
                  </div>
                  <h3 className="job-listing-card__title">{j.title}</h3>
                  {j.description && (
                    <p className="job-listing-card__desc">{plainText(j.description, 220)}</p>
                  )}
                </div>
                <div className="job-listing-card__mid">
                  <div className="job-listing-card__meta">
                    {j.location && <span><MapPin size={13} />{j.location}</span>}
                    {j.salary && <span className="tnum"><Banknote size={13} aria-hidden />{j.salary}</span>}
                    <span><Calendar size={13} aria-hidden />{fmtDate(j.created_at, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  {j.benefits?.filter(Boolean).length > 0 && (
                    <div className="job-listing-card__benefits">
                      {j.benefits.filter(Boolean).map((b, i) => (
                        <span key={i} className="benefit-pill"><Check size={10} />{b}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="job-listing-card__apply-row">
                  <span className="btn btn-green job-listing-card__apply">
                    View and apply <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="jobs-cta-section">
        <div className="container jobs-cta-content">
          <p className="eyebrow jobs-cta-eyebrow" data-reveal>Don't see your role?</p>
          <h2 className="jobs-cta-title" data-reveal>
            We also work on exclusive briefs<br />not always advertised publicly.
          </h2>
          <p className="jobs-cta-sub" data-reveal>
            Send us your CV and we'll be in touch the moment the right brief lands.
          </p>
          <div className="jobs-cta-actions" data-reveal>
            <a href="mailto:info@ourkeypartnership.co.uk?subject=CV Submission" className="btn btn-hero-primary">
              <Mail size={15} /> Submit your CV
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
