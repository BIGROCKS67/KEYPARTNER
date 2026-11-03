import { useEffect } from 'react'
import { gsap } from 'gsap'
import { HeroSpotlight } from '../components/HeroSpotlight'
import { HeroMap } from '../components/HeroMap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, CheckCircle2, Users, Search, Star, Clock, BarChart2, Handshake } from 'lucide-react'
import { Testimonials } from '../components/Testimonials'
import { CountUp } from '../components/CountUp'

gsap.registerPlugin(ScrollTrigger)


export function Hire() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set('[data-reveal]', { opacity: 1, y: 0 }); return
    }
    const els = gsap.utils.toArray('[data-reveal]')
    els.forEach(el => {
      gsap.from(el, { opacity: 0, y: 32, duration: 0.8, ease: 'power3.out', immediateRender: false, scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' } })
    })
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero hero--dark hero--map">
        <HeroMap />
        <div className="hero-dark-grain" aria-hidden />
        <HeroSpotlight />
        <div className="container hero-dark-content">
          <p className="eyebrow hero-dark-eyebrow hero-ani-1">For Our Clients</p>
          <h1 className="hero-dark-title hero-ani-2">
            A more focused<br />approach to hiring
          </h1>
          <p className="hero-dark-sub hero-ani-3">
            We partner with a select group of businesses to deliver permanent and fixed-term hires across Technology, Data &amp; AI, and Commercial functions. Fewer clients, more focus, better hires.
          </p>
          <div className="hero-actions hero-ani-4">
            <a href="mailto:info@ourkeypartnership.co.uk?subject=New Vacancy Enquiry" className="btn btn-hero-primary">
              Discuss your hiring needs <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ── WHO WE WORK WITH ── */}
      <section style={{ padding: 'var(--section-pad) 0', background: 'var(--brand-white)' }}>
        <div className="container">
          <div style={{ maxWidth: 800, marginBottom: 56 }} data-reveal>
            <div className="section-divider" />
            <h2 className="section-title">Who We Work With</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1.05rem' }}>
              We support hiring for start-ups building their first teams, scale-ups in growth mode, and established businesses hiring at pace.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', borderTop: '1px solid var(--border)' }}>
            <div style={{ padding: '40px 48px 40px 0', borderRight: '1px solid var(--border)' }} data-reveal>
              <p className="eyebrow" style={{ marginBottom: 24 }}>Business types</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {['Start-ups building their first teams', 'Scale-ups in growth mode', 'Established businesses hiring at pace'].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: '50%', background: 'var(--brand-green)', marginTop: 9 }} />
                    <p style={{ color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.5 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '40px 0 40px 48px' }} data-reveal>
              <p className="eyebrow" style={{ marginBottom: 24 }}>Sectors</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {['SaaS', 'Finance & FinTech', 'Hospitality & Retail', 'Healthcare'].map(item => (
                  <span key={item} style={{ padding: '8px 16px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', background: 'var(--surface-muted)' }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR REACH ── */}
      <section style={{ padding: 'clamp(40px, 6vw, 72px) 0', background: 'var(--brand-green)' }}>
        <div className="container" data-reveal>
          <div style={{ display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 700, color: 'var(--brand-white)', lineHeight: 1.3, flex: '1 1 320px', letterSpacing: '-0.02em' }}>
              Based in Milton Keynes, at the heart of the UK's tech corridor.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, flex: '1 1 280px', fontSize: '1rem' }}>
              Our clients span the UK and internationally, including the UAE, Australia and New Zealand. We work wherever the right hires need to be made.
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW WE WORK ── */}
      <section style={{ padding: 'var(--section-pad) 0', background: 'var(--surface-muted)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
            <div data-reveal>
              <div className="section-divider" />
              <h2 className="section-title">How We Work</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 0 }}>
                We don't rely on job boards or inbound applications. Our time is spent identifying and engaging the right people directly, and we go to them first.
              </p>
              <p style={{ color: 'var(--brand-green)', fontWeight: 700, marginTop: 32, fontSize: '1rem', fontStyle: 'italic' }}>
                We operate as an extension of your team, not an external supplier.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderTop: '1px solid var(--border)' }} data-reveal>
              {[
                { icon: Search, title: 'Headhunting-led', body: 'Every role is worked proactively: we go and find the right people.' },
                { icon: BarChart2, title: 'No job board reliance', body: 'We don\'t post and wait. Our networks are built, not bought.' },
                { icon: Users, title: 'Deep market networks', body: 'Built across Tech, AI and Commercial markets over years of relationship-led work.' },
                { icon: Handshake, title: 'Proper representation', body: 'We represent your business correctly in the market, as if we were part of your team.' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 20, padding: '24px 0', borderBottom: '1px solid var(--border)', alignItems: 'flex-start' }}>
                  <div style={{ minWidth: 20, color: 'var(--brand-green)', marginTop: 3 }}>
                    <item.icon size={18} aria-hidden />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, marginBottom: 4 }}>{item.title}</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT YOU CAN EXPECT ── */}
      <section style={{ padding: 'var(--section-pad) 0', background: 'var(--brand-white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 56px' }} data-reveal>
            <div className="section-divider" style={{ margin: '0 auto 24px' }} />
            <h2 className="section-title">What You Can Expect</h2>
          </div>
          <div className="expect-grid">
            {[
              { icon: Users, title: '3 candidates per role', body: 'Three of the best-suited people, so there is no long list to filter through.' },
              { icon: Clock, title: '7-day CV delivery SLA', body: 'Qualified, engaged candidates within the first week.' },
              { icon: Star, title: 'High-quality shortlists', body: 'Less noise, more relevance.' },
              { icon: Handshake, title: 'On-site time with clients', body: 'We spend time understanding your teams, culture and environment.' },
              { icon: BarChart2, title: 'Market insight', body: 'Annual salary benchmarking to support hiring decisions.' },
            ].map(item => (
              <div key={item.title} className="expect-item" data-reveal>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERSHIP MODELS ── */}
      <section style={{ padding: 'var(--section-pad) 0', background: 'var(--surface-muted)' }}>
        <div className="container">
          <div style={{ maxWidth: 760, marginBottom: 56 }} data-reveal>
            <div className="section-divider" />
            <h2 className="section-title">Partnership Models</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1.05rem' }}>
              We support clients on both contingent and retained models. For clients hiring regularly or building teams, we also offer fixed-fee retainers: a more cost-effective and consistent approach to hiring.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ padding: '36px 40px', background: 'var(--brand-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }} data-reveal>
              <p style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 12 }}>Contingent</p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                No placement, no fee. We work on roles as they arise, with full commitment to quality on every search.
              </p>
            </div>
            <div style={{ padding: '36px 40px', background: 'var(--brand-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }} data-reveal>
              <p style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 12 }}>Retained & Fixed-Fee</p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                For clients hiring regularly or building teams. More cost-effective, more consistent. Our model is lean by design, so you're not paying for volume or overhead.
              </p>
            </div>
          </div>
          <div style={{ marginTop: 32, padding: '32px 40px', background: 'var(--brand-green)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }} data-reveal>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--green-300)', letterSpacing: '-0.04em', lineHeight: 1, whiteSpace: 'nowrap' }}><CountUp value="£30,000+" /></p>
            <p style={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, fontSize: '1rem' }}>
              Saved for one client last year compared to a traditional per-placement model. Our fee structure is built to work with you long-term.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHY CLIENTS WORK WITH US ── */}
      <section style={{ padding: 'var(--section-pad) 0', background: 'var(--brand-white)' }}>
        <div className="container">
          <div style={{ maxWidth: 640, marginBottom: 56 }} data-reveal>
            <div className="section-divider" />
            <h2 className="section-title">Why Clients Work With Us</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', borderTop: '1px solid var(--border)', borderLeft: '1px solid var(--border)' }}>
            {[
              { num: '01', title: 'Headhunting-led', body: 'Every search is driven by proactive outreach, not job board posting.' },
              { num: '02', title: 'Select portfolio', body: 'We keep our client base small so every client gets our full attention.' },
              { num: '03', title: 'Deep networks', body: 'Built over years across Technology, AI and Commercial markets.' },
              { num: '04', title: 'Accountable delivery', body: 'Consistent, honest communication at every stage of the process.' },
              { num: '05', title: 'Long-term thinking', body: 'We build partnerships, not one-off transactions.' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '36px 32px', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)' }} data-reveal>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <Testimonials />

      {/* ── LET'S TALK ── */}
      <section style={{ padding: 'var(--section-pad) 0', background: 'var(--brand-green)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <p className="eyebrow" style={{ color: 'var(--green-300)' }} data-reveal>Let's Talk</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--brand-white)', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '16px 0 20px' }} data-reveal>
            Looking for a more focused approach to hiring?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, marginBottom: 36 }} data-reveal>
            If you're looking for a partnership-led approach that delivers consistently, we should speak.
          </p>
          <a href="mailto:info@ourkeypartnership.co.uk?subject=New Vacancy Enquiry" className="btn btn-hero-primary" data-reveal>
            Discuss your hiring needs <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </>
  )
}
