import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ArrowDown, MapPin, Clock, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react'
import { Testimonials } from '../components/Testimonials'
import { CoverageMap } from '../components/CoverageMap'
import { pillars } from '../data/content'
import { useJobs } from '../data/jobs-context'
import { shortLocation, formatDate } from '../lib/jobs'
import { HeroWords } from '../components/HeroWords'
import { HeroSpotlight } from '../components/HeroSpotlight'
import { CountUp } from '../components/CountUp'
import { SkeletonLine } from '../components/Skeleton'

gsap.registerPlugin(ScrollTrigger)


const CYCLE_WORDS = ['Relationships', 'Trust', 'Experience', 'Success']

// The faint line behind "Recruitment done the right way"
const APPROACH_WORDS = ['Partnership', 'The right hire', 'Long term', 'Honest advice', 'Shortlists', 'Culture fit', 'Follow-up', 'Repeat clients']

function CyclingText() {
  const [wordIdx, setWordIdx] = useState(0)
  // Typing waits until the headline has faded in (hero-ani-2 starts at
  // 0.3s), so the first word is typed in view rather than while hidden.
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState('intro')

  useEffect(() => {
    // Reduced motion: the first word stays put (shown by the hidden text below).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const word = CYCLE_WORDS[wordIdx]
    let t
    if (phase === 'intro') {
      t = setTimeout(() => setPhase('typing'), 650)
    } else if (phase === 'typing') {
      if (displayed.length < word.length) {
        t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80)
      } else {
        t = setTimeout(() => setPhase('deleting'), 1800)
      }
    } else {
      if (displayed.length > 0) {
        t = setTimeout(() => setDisplayed(d => d.slice(0, -1)), 48)
      } else {
        setWordIdx(i => (i + 1) % CYCLE_WORDS.length)
        setPhase('typing')
      }
    }
    return () => clearTimeout(t)
  }, [displayed, phase, wordIdx])

  return (
    <span className="hero-cycle-word">
      <span className="visually-hidden">Relationships</span>
      <span className="hero-cycle-sizer" aria-hidden>Relationships</span>
      <span className="hero-cycle-visible" aria-hidden>
        <span className="hero-cycle-static">Relationships</span>
        <span className="hero-cycle-anim">{displayed}<span className="type-cursor">|</span></span>
      </span>
    </span>
  )
}

function JobsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start', dragFree: true })
  const { jobs: displayJobs, fresh } = useJobs()
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  useEffect(() => {
    if (!emblaApi) return
    const update = () => { setCanPrev(emblaApi.canScrollPrev()); setCanNext(emblaApi.canScrollNext()) }
    update()
    emblaApi.on('select', update).on('reInit', update)
    return () => { emblaApi.off('select', update).off('reInit', update) }
  }, [emblaApi])

  if (displayJobs.length === 0 && !fresh) return (
    <section className="jobs-carousel-section" aria-busy="true">
      <div className="container">
        <div className="jobs-carousel-header">
          <div>
            <h2 className="section-title">Latest Vacancies</h2>
            <p className="section-subtitle">Find your next role, updated regularly with our latest vacancies.</p>
          </div>
        </div>
        <div className="jobs-skeleton-row" aria-label="Loading roles">
          {[0, 1, 2].map(i => (
            <div key={i} className="job-card job-card--skeleton" aria-hidden>
              <SkeletonLine width="40%" height={20} />
              <SkeletonLine width="80%" height={22} />
              <SkeletonLine width="60%" />
              <SkeletonLine width="45%" height={18} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  if (displayJobs.length === 0) return (
    <section className="jobs-carousel-section">
      <div className="container">
        <div className="jobs-carousel-header">
          <div>
            <h2 className="section-title" data-reveal>Latest Vacancies</h2>
            <p className="section-subtitle" data-reveal>Find your next role, updated regularly with our latest vacancies.</p>
          </div>
          <Link to="/jobs" className="btn btn-outline" data-reveal>View all</Link>
        </div>
        <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }} data-reveal>
          No roles live right now. <a href="mailto:info@ourkeypartnership.co.uk?subject=CV%20Submission" style={{ color: 'var(--brand-green)' }}>submit your CV</a> and we'll be in touch when the right role lands.
        </div>
      </div>
    </section>
  )

  return (
    <section className="jobs-carousel-section">
      <div className="container">
        <div className="jobs-carousel-header">
          <div>
            <h2 className="section-title" data-reveal>Latest Vacancies</h2>
            <p className="section-subtitle" data-reveal>Find your next role, updated regularly with our latest vacancies.</p>
          </div>
          <div className="jobs-carousel-controls">
            <button type="button" className="carousel-btn" onClick={() => emblaApi?.scrollPrev()} disabled={!canPrev} aria-label="Previous roles">
              <ChevronLeft size={20} aria-hidden />
            </button>
            <button type="button" className="carousel-btn" onClick={() => emblaApi?.scrollNext()} disabled={!canNext} aria-label="Next roles">
              <ChevronRight size={20} aria-hidden />
            </button>
            <Link to="/jobs" className="btn btn-outline" data-reveal>View all</Link>
          </div>
        </div>
        <div className="embla embla--jobs" ref={emblaRef} data-reveal>
          <div className="embla__container">
            {displayJobs.map(j => (
              <div key={j.id} className="embla__slide embla__slide--job">
                <Link to={`/jobs/${j.id}`} className="job-card job-card--link">
                  <div className="job-badge"><Briefcase size={11} />{j.discipline}</div>
                  <div className="job-title">{j.title}</div>
                  <div className="job-meta">
                    <span><MapPin size={12} aria-hidden />{shortLocation(j.location)}</span>
                    <span><Clock size={12} aria-hidden />{formatDate(j.created_at, { day: 'numeric', month: 'short' })}</span>
                    <span>{j.type}</span>
                  </div>
                  <div className="job-salary tnum">{j.salary}</div>
                  <span className="job-cta">View role <ArrowRight size={14} /></span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const knownFor = [
  {
    title: 'Relationships, Not Transactions',
    body: 'We work as partners, not suppliers. That means honest conversations, clear expectations, and a focus on long-term fit, not quick placements.',
  },
  {
    title: 'A Select Client Portfolio',
    body: 'We intentionally keep our client base small. It allows us to properly understand your business: how you operate, how your teams work, and what "good" really looks like. We don\'t just fill roles. We represent you in the market.',
  },
  {
    title: 'Quality Over Quantity. Every Single Time.',
    body: 'We don\'t rely on job boards or inbound applicants. We proactively identify and approach the talent other recruiters simply cannot reach. Fewer CVs. Better candidates.',
  },
]

export function Home() {
  const { jobs } = useJobs()

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      gsap.set('[data-reveal]', { opacity: 1, y: 0 })
      return
    }
    const reveals = gsap.utils.toArray('[data-reveal]')
    reveals.forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 36,
        duration: 0.8,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      })
    })
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <>
      {/* ── 1. HERO ── */}
      <section className="hero hero--dark hero--map">
        <HeroWords />
        <HeroSpotlight wander />

        <div className="hero-dark-grain" aria-hidden />

        <div className="container hero-dark-content">
          <h1 className="hero-dark-title hero-ani-2">
            A Business Built<br className="hero-title-br" /> On <CyclingText />
          </h1>
          <p className="hero-dark-sub hero-ani-3">
            Key Partnership Recruitment connects IT and commercial talent with high-growth businesses across the UK, UAE &amp; Asia-Pacific.
          </p>
          <p className="hero-dark-intro hero-ani-3">
            We partner with our clients on a retained or exclusive basis, delivering consistently high-quality outcomes:
          </p>

          <div className="hero-actions hero-actions--home hero-ani-4">
            <Link to="/hire" className="btn btn-hero-primary">Submit a vacancy <ArrowRight size={16} aria-hidden /></Link>
            <Link to="/jobs" className="btn btn-hero-pill">View live roles</Link>
          </div>

          <ul className="hero-dark-stats hero-ani-4" aria-label="Key results">
            <li className="hero-dark-stat">
              <span className="hero-dark-stat__num"><CountUp value="95%" delay={900} /></span>
              <span className="hero-dark-stat__label">Offer Acceptance Rate</span>
            </li>
            <li className="hero-dark-stat">
              <span className="hero-dark-stat__num"><CountUp value="90%" delay={1020} /></span>
              <span className="hero-dark-stat__label">12-Month Retention</span>
            </li>
            <li className="hero-dark-stat">
              <span className="hero-dark-stat__num"><CountUp value="80%" delay={1140} /></span>
              <span className="hero-dark-stat__label">Repeat Client Partnerships</span>
            </li>
            <li className="hero-dark-stat">
              <span className="hero-dark-stat__num"><CountUp value="500+" delay={1260} /></span>
              <span className="hero-dark-stat__label">Roles Delivered</span>
            </li>
            <li className="hero-dark-stat">
              <span className="hero-dark-stat__num"><CountUp value="5+" delay={1380} /></span>
              <span className="hero-dark-stat__label">Years in Business</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ── 2. LATEST VACANCIES CAROUSEL ── */}
      <div className="stack-card" style={{zIndex: 2}}>
        <JobsCarousel />
      </div>

      {/* ── 3. VIDEO BREAK ── */}
      <div className="stack-card" style={{zIndex: 3}}>
        <section className="video-break" aria-label="Our approach">
          <HeroWords words={APPROACH_WORDS} rows={1} live={false} className="hero-words--band" />
          <HeroSpotlight wander />
          <div className="container video-break__content">
            <h2 className="video-break__heading" data-reveal>
              Recruitment done<br />the <em>right way.</em>
            </h2>
            <p className="video-break__sub" data-reveal>
              Five years of delivering the right hires for our Clients, with long-term relationships at the core.
            </p>
          </div>
          <div className="video-break__scroll-hint" aria-hidden>
            <ArrowDown size={18} />
          </div>
        </section>
      </div>

      {/* ── 4. WHAT WE'RE KNOWN FOR ── */}
      <div className="stack-card" style={{zIndex: 4}}>
        <section className="known-for-section">
          <div className="container">
            <div className="section-header">
              <div className="section-divider" data-reveal />
              <p className="eyebrow" data-reveal>Our Philosophy</p>
              <h2 className="section-title" data-reveal>What We're Known For</h2>
              <p className="section-subtitle" data-reveal>
                We don't operate like a traditional recruitment agency. No CV blasting. No shortcuts with an aim of generating a 'quick fee'. Most of our time is spent headhunting, identifying and engaging the right people, not just the available ones. It's a more deliberate approach, but it's what delivers better hires.
              </p>
            </div>
            <div className="known-for-grid">
              {knownFor.map((item, i) => (
                <div key={i} className="known-for-card" data-reveal>
                  <h3 className="kf-title">{item.title}</h3>
                  <p className="kf-body">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── 5. WHERE WE EXCEL ── */}
      <div className="stack-card" style={{zIndex: 5}}>
        <section className="excel-section">
          <div className="container">
            <div className="section-divider white" data-reveal />
            <p className="eyebrow excel-eyebrow" data-reveal>Specialisms</p>
            <h2 className="section-title excel-title" data-reveal>Where We Excel</h2>
            <ul className="excel-list">
              {pillars.map(p => {
                const live = jobs.filter(j => j.discipline === p.title).length
                return (
                  <li key={p.slug} className="excel-row" data-reveal>
                    <h3 className="excel-row__title">{p.title}</h3>
                    <div className="excel-row__text">
                      <p>{p.short}</p>
                      {p.tags?.length > 0 && <p className="excel-row__roles">{p.tags.join(' · ')}</p>}
                    </div>
                    <div className="excel-row__links">
                      {live > 0 && (
                        <Link to="/jobs" className="excel-row__live">
                          <span className="tnum">{live}</span> live {live === 1 ? 'role' : 'roles'}
                        </Link>
                      )}
                      <Link to="/hire" className="excel-row__hire">Hire in {p.title}</Link>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      </div>

      {/* ── 6. THE PERSON BEHIND IT ── */}
      <div className="stack-card" style={{zIndex: 6}}>
        <section className="meet-section">
          <div className="container meet-grid">
            <div className="meet-photo-col" data-reveal>
              <div className="meet-photo-frame">
                <img src="/matt.jpg" alt="Matt Stimpson, Founder, Key Partnership Recruitment" width="807" height="1024" loading="lazy" decoding="async" />
              </div>
            </div>
            <div className="meet-text-col">
              <div className="section-divider" data-reveal />
              <p className="eyebrow" data-reveal>The Person Behind It</p>
              <h2 className="meet-name" data-reveal>Matt Stimpson</h2>
              <p className="meet-role" data-reveal>Founder &amp; Managing Director</p>
              <p className="meet-bio" data-reveal>
                Matt brings close to a decade of experience in recruitment and executive search, partnering with ambitious organisations ranging from high-growth SMEs to FTSE 250 and Fortune 500 businesses.
              </p>
              <p className="meet-bio" data-reveal>
                He entered the industry at 16, quickly establishing himself as one of the UK's top-performing early careers recruiters, earning recognition as UK Recruitment Apprentice of the Year by the Recruitment &amp; Employment Confederation (REC).
              </p>
              <p className="meet-bio" data-reveal>
                Matt founded Key Partnership with a clear belief: recruitment delivers better outcomes when built on genuine relationships, not volume. That philosophy continues to define the business today: a selective client base, a headhunting-led approach, and a focus on delivering the right hires, not just the most available candidates.
              </p>
              <div className="meet-actions" data-reveal>
                <a href="mailto:info@ourkeypartnership.co.uk" className="btn btn-green">
                  Say hello <ArrowRight size={15} />
                </a>
                <a href="https://www.linkedin.com/in/mattstimpson/" target="_blank" rel="noreferrer" className="btn btn-outline meet-linkedin">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── 7. COVERAGE MAP ── */}
      <div className="stack-card" style={{zIndex: 7}}>
        <CoverageMap />
      </div>

      {/* ── 8. REVIEWS ── */}
      <div className="stack-card" style={{zIndex: 8}}>
        <Testimonials />
      </div>

      {/* ── CTA / CONTACT ── */}
      <div className="stack-card" style={{zIndex: 9}} id="contact">
        <section className="contact-strip glow-band">
          <HeroSpotlight />
          <div className="container contact-strip__grid">
            <div className="contact-strip__col">
              <p className="eyebrow contact-eyebrow">Hiring?</p>
              <h3 className="contact-col-title">Submit a vacancy</h3>
              <p className="contact-col-body">Tell us what you need. We'll respond the same day.</p>
              <a href="mailto:info@ourkeypartnership.co.uk?subject=New Vacancy" className="btn btn-cta-primary">
                Email us
              </a>
            </div>
            <div className="contact-strip__divider" aria-hidden />
            <div className="contact-strip__col">
              <p className="eyebrow contact-eyebrow">Looking for work?</p>
              <h3 className="contact-col-title">Send your CV</h3>
              <p className="contact-col-body">We'll match you when the right brief lands. No spam, ever.</p>
              <a href="mailto:info@ourkeypartnership.co.uk?subject=CV Submission" className="btn btn-cta-primary">
                Submit your CV
              </a>
            </div>
            <div className="contact-strip__divider" aria-hidden />
            <div className="contact-strip__col">
              <p className="eyebrow contact-eyebrow">Just talk</p>
              <h3 className="contact-col-title">Pick up the phone</h3>
              <p className="contact-col-body">Prefer a conversation? So do we.</p>
              <a href="tel:+441327493143" className="btn btn-cta-primary">01327 493143</a>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
