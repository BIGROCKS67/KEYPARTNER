import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Briefcase, Calendar, ArrowLeft, Mail, Check, Banknote } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { jobs as hardcodedJobs } from '../data/content'

gsap.registerPlugin(ScrollTrigger)

const JOB_HERO_VIDEO = 'https://assets.mixkit.co/videos/6779/6779-720.mp4'

/* ── description renderer ── */
// Detect whether description is HTML (from new WYSIWYG editor) or legacy plain text
function isHtml(str) {
  return str && /<[a-z][\s\S]*>/i.test(str)
}

function parseInline(text) {
  const parts = []
  const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)/g
  let last = 0, m
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    if (m[1]) parts.push(<strong key={m.index}>{m[2]}</strong>)
    else if (m[3]) parts.push(<em key={m.index}>{m[4]}</em>)
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

function renderDesc(text) {
  if (!text) return null
  // New jobs: render HTML from WYSIWYG editor
  if (isHtml(text)) {
    return <div dangerouslySetInnerHTML={{ __html: text }} />
  }
  // Legacy: parse markdown-style plain text
  const lines = text.split('\n')
  const result = []
  let bullets = []
  const flush = (key) => {
    if (bullets.length) { result.push(<ul key={key}>{bullets}</ul>); bullets = [] }
  }
  lines.forEach((raw, i) => {
    const t = raw.trim()
    if (!t) { flush(`br${i}`); return }
    const isBullet = t.startsWith('•') || t.startsWith('-')
    const content = isBullet ? t.replace(/^[•\-]\s*/, '') : t
    const inline = parseInline(content)
    if (isBullet) bullets.push(<li key={i}>{inline}</li>)
    else { flush(`ul${i}`); result.push(<p key={i}>{inline}</p>) }
  })
  flush('last')
  return result
}

export function Job() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (supabase) {
      supabase.from('jobs').select('*').eq('id', id).eq('is_active', true).single()
        .then(({ data }) => { setJob(data || null); setLoading(false) })
    } else {
      setJob(hardcodedJobs.find(j => String(j.id) === id) || null)
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (!job) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set('[data-reveal]', { opacity: 1, y: 0 }); return
    }
    const els = gsap.utils.toArray('[data-reveal]')
    els.forEach(el => {
      gsap.from(el, {
        opacity: 0, y: 28, duration: 0.75, ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      })
    })
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [job])

  if (loading) return (
    <div className="job-page-loading">Loading role...</div>
  )

  if (!job) return (
    <div className="job-page-loading">
      <p style={{ marginBottom: 16, color: 'var(--text-muted)' }}>This role is no longer available.</p>
      <Link to="/jobs" className="btn btn-green">View all roles</Link>
    </div>
  )

  const applyHref = `mailto:info@ourkeypartnership.co.uk?subject=Application: ${encodeURIComponent(job.title)}&body=Hi Matt,%0D%0A%0D%0AI'd like to apply for the ${encodeURIComponent(job.title)} role.%0D%0A%0D%0APlease find my CV attached.%0D%0A%0D%0AKind regards`
  const mapQuery = encodeURIComponent(job.location || 'Milton Keynes, UK')
  const rawDate = job.created_at ? new Date(job.created_at) : null
  const postedDate = job.posted ?? (rawDate && !isNaN(rawDate) ? rawDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null)

  return (
    <>
      {/* ── HERO — compact banner ── */}
      <section className="job-page-hero-banner">
        <div className="hero-video-bg" aria-hidden>
          <video autoPlay muted loop playsInline preload="auto" className="hero-video-bg__vid">
            <source src={JOB_HERO_VIDEO} type="video/mp4" />
          </video>
          <div className="hero-video-bg__overlay" />
        </div>
        <div className="hero-dark-grain" aria-hidden />

        <div className="container job-page-banner-content">
          <Link to="/jobs" className="job-page-back hero-ani-1">
            <ArrowLeft size={14} /> All roles
          </Link>
          <div className="job-page-badges hero-ani-1">
            <span className="job-badge"><Briefcase size={11} />{job.discipline}</span>
            <span className="job-listing-type">{job.type}</span>
          </div>
          <h1 className="job-page-banner-title hero-ani-2">{job.title}</h1>
          <div className="job-page-meta hero-ani-3">
            {job.location && <span><MapPin size={13} />{job.location}</span>}
            {job.salary && <span><Banknote size={13} />{job.salary}</span>}
            <span><Calendar size={13} />{postedDate}</span>
          </div>
        </div>
      </section>

      {/* ── BODY ── */}
      <section style={{ padding: 'var(--section-pad) 0', background: 'var(--brand-white)' }}>
        <div className="container job-page-grid">

          {/* ── LEFT: description + benefits ── */}
          <div className="job-page-main">

            {job.description && (
              <div data-reveal>
                <div className="section-divider" />
                <h2 className="section-title" style={{ marginBottom: 28 }}>About the Role</h2>
                <div className="job-desc-rendered">
                  {renderDesc(job.description)}
                </div>
              </div>
            )}

            {job.benefits?.filter(Boolean).length > 0 && (
              <div data-reveal style={{ marginTop: 48 }}>
                <div className="section-divider" />
                <h2 className="section-title" style={{ marginBottom: 28 }}>Benefits</h2>
                <ul className="job-page-benefits-list">
                  {job.benefits.filter(Boolean).map((b, i) => (
                    <li key={i}><Check size={14} />{b}</li>
                  ))}
                </ul>
              </div>
            )}

            <div data-reveal style={{ marginTop: 48, padding: '32px', background: 'var(--green-100)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              <p style={{ fontWeight: 700, color: 'var(--green-900)', fontSize: '1.05rem', flex: 1, margin: 0 }}>
                Sound like the right fit?
              </p>
              <a href={applyHref} className="btn btn-green">
                <Mail size={14} /> Apply for this Role
              </a>
            </div>
          </div>

          {/* ── RIGHT: apply card + map ── */}
          <aside className="job-page-sidebar">
            <div className="job-apply-card" data-reveal>
              <p className="eyebrow" style={{ color: 'var(--green-300)', marginBottom: 8 }}>Ready to apply?</p>
              <h3>Interested in this role?</h3>
              <p>Send your CV and we'll be in touch within 24 hours.</p>
              <a href={applyHref} className="btn btn-green job-apply-card__btn">
                <Mail size={14} /> Apply Now
              </a>
              <div className="job-apply-card__details">
                {job.location && <div><span>Location</span><strong>{job.location}</strong></div>}
                {job.salary && <div><span>Salary</span><strong>{job.salary}</strong></div>}
                {job.type && <div><span>Work Type</span><strong>{job.type}</strong></div>}
                {job.discipline && <div><span>Discipline</span><strong>{job.discipline}</strong></div>}
                <div><span>Posted</span><strong>{postedDate}</strong></div>
              </div>
            </div>

            {job.location && (
              <div className="job-page-map" data-reveal>
                <iframe
                  title={`Map for ${job.location}`}
                  src={`https://maps.google.com/maps?q=${mapQuery}&output=embed&z=12`}
                  width="100%" height="220"
                  style={{ border: 0, display: 'block' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  )
}
