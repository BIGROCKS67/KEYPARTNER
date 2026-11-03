import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { HeroSpotlight } from '../components/HeroSpotlight'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Briefcase, Calendar, ArrowLeft, Mail, Check, Banknote, Share2, Phone, ArrowRight } from 'lucide-react'
import { useJobs } from '../data/jobs-context'
import { hasSupabase, loadSupabase } from '../lib/supabase-lazy'
import { cleanDescription, formatDate, isoDay, jobPath, jobRef, normaliseJob, shortLocation } from '../lib/jobs'
import { EMAIL, PHONE_DISPLAY, PHONE_TEL, SITE_URL } from '../lib/site'
import { ApplyForm } from '../components/ApplyForm'
import { MapEmbed } from '../components/MapEmbed'
import { SkeletonLine } from '../components/Skeleton'

gsap.registerPlugin(ScrollTrigger)

function ShareButton({ job }) {
  const [copied, setCopied] = useState(false)
  const url = `${SITE_URL}${jobPath(job)}`
  const onClick = async (e) => {
    if (navigator.share) {
      e.preventDefault()
      try { await navigator.share({ title: job.title, url }) } catch { /* closed */ }
    } else if (navigator.clipboard) {
      e.preventDefault()
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 4000)
    }
  }
  return (
    <a
      href={`mailto:?subject=${encodeURIComponent(job.title)}&body=${encodeURIComponent(url)}`}
      onClick={onClick}
      className="btn btn-dark-outline job-share-btn"
    >
      <Share2 size={14} aria-hidden /> <span aria-live="polite">{copied ? 'Link copied' : 'Share role'}</span>
    </a>
  )
}

function JobSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading role">
      <section className="job-page-hero-banner job-page-hero-banner--skeleton">
        <div className="container job-page-banner-content">
          <SkeletonLine width={90} height={14} style={{ marginBottom: 20 }} />
          <SkeletonLine width="55%" height={44} style={{ marginBottom: 18 }} />
          <SkeletonLine width="40%" height={16} />
        </div>
      </section>
      <section className="job-page-body">
        <div className="container job-page-grid">
          <div className="job-page-main" style={{ gap: 14 }}>
            {[96, 88, 92, 70, 84, 60].map((w, i) => <SkeletonLine key={i} width={`${w}%`} height={16} />)}
          </div>
          <div className="job-apply-card job-apply-card--skeleton">
            <SkeletonLine width="70%" height={22} style={{ marginBottom: 14 }} />
            <SkeletonLine width="100%" height={44} />
          </div>
        </div>
      </section>
    </div>
  )
}

function Closed() {
  return (
    <section className="page-hero">
      <div className="container">
        <p className="eyebrow">Role closed</p>
        <h1>This role has been filled or closed</h1>
        <p>We have other live roles, and we work on briefs that are never advertised. Send us your CV and we'll be in touch when the right one lands.</p>
        <div className="page-hero-actions">
          <Link to="/jobs" className="btn btn-green">View live roles</Link>
          <a href={`mailto:${EMAIL}?subject=CV Submission`} className="btn btn-dark-outline">Submit your CV</a>
        </div>
      </div>
    </section>
  )
}

export function Job() {
  const { id } = useParams()
  const { jobs, fresh } = useJobs()
  const listed = jobs.find(j => String(j.id) === id)
  const [fetched, setFetched] = useState(undefined)

  // A role added after the last site build is not in the baked-in list yet.
  useEffect(() => {
    if (listed || !fresh || !hasSupabase) return
    loadSupabase()
      .then(sb => sb.from('jobs').select('*').eq('id', id).eq('is_active', true).maybeSingle())
      .then(({ data }) => setFetched(data ? normaliseJob(data) : null))
      .catch(() => setFetched(null))
  }, [id, listed, fresh])

  const job = listed || fetched

  // Keyed on the id, not the record: the jobs list refreshes from Supabase
  // after load, and restarting mid-fade used to leave sections invisible.
  // revert() puts every element back to its real styles before a rerun.
  const jobId = job?.id
  useEffect(() => {
    if (!jobId) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach(el => {
        gsap.from(el, {
          opacity: 0, y: 28, duration: 0.75, ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        })
      })
    })
    return () => ctx.revert()
  }, [jobId])

  if (!job) {
    if (!fresh || (hasSupabase && fetched === undefined)) return <JobSkeleton />
    return <Closed />
  }

  const ref = jobRef(job)
  const posted = formatDate(job.created_at)
  const related = jobs.filter(j => j.id !== job.id && j.discipline === job.discipline).slice(0, 3)
  const emailHref = `mailto:${EMAIL}?subject=${encodeURIComponent(`Question about ${job.title} (${ref})`)}`

  return (
    <>
      {/* ── HERO ── */}
      <section className="job-page-hero-banner">
        <div className="hero-dark-grain" aria-hidden />
        <HeroSpotlight />

        <div className="container job-page-banner-content">
          <Link to="/jobs" className="job-page-back hero-ani-1">
            <ArrowLeft size={14} aria-hidden /> All roles
          </Link>
          <div className="job-page-badges hero-ani-1">
            {job.discipline && <span className="job-badge"><Briefcase size={11} aria-hidden />{job.discipline}</span>}
            {job.type && <span className="job-listing-type">{job.type}</span>}
          </div>
          <h1 className="job-page-banner-title hero-ani-2">{job.title}</h1>
          <div className="job-page-meta hero-ani-3">
            {job.location && <span><MapPin size={13} aria-hidden />{job.location}</span>}
            {job.salary && <span className="tnum"><Banknote size={13} aria-hidden />{job.salary}</span>}
            {posted && <span><Calendar size={13} aria-hidden /><time dateTime={isoDay(job.created_at)}>{posted}</time></span>}
          </div>
          <div className="job-page-hero-actions hero-ani-4">
            <a href="#apply" className="btn btn-green">Apply for this role <ArrowRight size={14} aria-hidden /></a>
            <ShareButton job={job} />
          </div>
        </div>
      </section>

      {/* ── BODY ── */}
      <section className="job-page-body">
        <div className="container job-page-grid">
          <div className="job-page-main">
            <div data-reveal>
              <div className="section-divider" />
              <h2 className="section-title" style={{ marginBottom: 28 }}>About the role</h2>
              <div className="job-desc-rendered" dangerouslySetInnerHTML={{ __html: cleanDescription(job.description) }} />
            </div>

            {job.benefits?.length > 0 && (
              <div data-reveal>
                <div className="section-divider" />
                <h2 className="section-title" style={{ marginBottom: 28 }}>Benefits</h2>
                <ul className="job-page-benefits-list">
                  {job.benefits.map(b => <li key={b}><Check size={14} aria-hidden />{b}</li>)}
                </ul>
              </div>
            )}

            <div className="job-apply-section" id="apply" data-reveal>
              <div className="section-divider" />
              <h2 className="section-title" style={{ marginBottom: 12 }}>Apply for this role</h2>
              <p className="job-apply-section__intro">Send your CV and we'll be in touch within 24 hours. It takes about a minute.</p>
              <ApplyForm job={job} />
            </div>

            <p className="job-legal">
              Advertised by Key Partnership Recruitment Ltd, acting as an employment agency. Ref <span className="tnum">{ref}</span>.
            </p>
          </div>

          {/* ── SIDEBAR ── */}
          <aside className="job-page-sidebar">
            <div className="job-apply-card" data-reveal>
              <p className="eyebrow" style={{ color: 'var(--green-300)', marginBottom: 8 }}>Your recruiter</p>
              <div className="job-recruiter">
                <img src="/matt.jpg" alt="" width="56" height="56" loading="lazy" decoding="async" />
                <div>
                  <h3>Matt Stimpson</h3>
                  <p>Founder, Key Partnership</p>
                </div>
              </div>
              <a href="#apply" className="btn btn-green job-apply-card__btn">Apply now</a>
              <div className="job-apply-card__links">
                <a href={`tel:${PHONE_TEL}`}><Phone size={13} aria-hidden /> {PHONE_DISPLAY}</a>
                <a href={emailHref}><Mail size={13} aria-hidden /> Ask about this role</a>
              </div>
              <div className="job-apply-card__details">
                {job.location && <div><span>Location</span><strong>{job.location}</strong></div>}
                {job.salary && <div><span>Salary</span><strong className="tnum">{job.salary}</strong></div>}
                {job.type && <div><span>Work type</span><strong>{job.type}</strong></div>}
                {job.discipline && <div><span>Discipline</span><strong>{job.discipline}</strong></div>}
                {posted && <div><span>Posted</span><strong>{posted}</strong></div>}
                <div><span>Reference</span><strong className="tnum">{ref}</strong></div>
              </div>
            </div>

            {job.location && (
              <div className="job-page-map" data-reveal>
                <MapEmbed query={job.location} title={`Map for ${job.location}`} />
              </div>
            )}
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="job-related">
          <div className="container">
            <div className="section-divider" />
            <h2 className="section-title" style={{ marginBottom: 28 }}>More {job.discipline.toLowerCase()} roles</h2>
            <div className="job-related__grid">
              {related.map(j => (
                <Link key={j.id} to={jobPath(j)} className="job-card job-card--link">
                  <div className="job-badge"><Briefcase size={11} aria-hidden />{j.discipline}</div>
                  <div className="job-title">{j.title}</div>
                  <div className="job-meta">
                    <span><MapPin size={12} aria-hidden />{shortLocation(j.location)}</span>
                    <span>{j.type}</span>
                  </div>
                  <div className="job-salary tnum">{j.salary}</div>
                  <span className="job-cta">View role <ArrowRight size={14} aria-hidden /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="mobile-apply-bar">
        <a href="#apply" className="btn btn-green">Apply now</a>
        <a href={`tel:${PHONE_TEL}`} className="btn btn-outline">Call</a>
      </div>
    </>
  )
}
