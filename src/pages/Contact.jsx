import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mail, Phone, MapPin } from 'lucide-react'
import { MapEmbed } from '../components/MapEmbed'

gsap.registerPlugin(ScrollTrigger)

export function Contact() {
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
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Get In Touch</p>
          <h1>Let's start a conversation</h1>
          <p>Whether you're looking to hire, exploring your next move, or just want to find out more, we'd love to hear from you.</p>
        </div>
      </section>

      {/* ── CONTACT + MAP ── */}
      <section style={{ padding: 'var(--section-pad) 0', background: 'var(--brand-white)' }}>
        <div className="container">
          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>

            {/* Contact details */}
            <div data-reveal>
              <div className="section-divider" />
              <h2 className="section-title" style={{ marginBottom: 40 }}>Contact Us</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <div style={{ width: 48, height: 48, minWidth: 48, background: 'var(--green-100)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-green)' }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, marginBottom: 4 }}>Email</p>
                    <a href="mailto:info@ourkeypartnership.co.uk" style={{ color: 'var(--brand-green)', fontWeight: 500, fontSize: '1.05rem' }}>
                      info@ourkeypartnership.co.uk
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <div style={{ width: 48, height: 48, minWidth: 48, background: 'var(--green-100)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-green)' }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, marginBottom: 4 }}>Phone</p>
                    <a href="tel:+441327493143" style={{ color: 'var(--brand-green)', fontWeight: 500, fontSize: '1.05rem' }}>
                      01327 493143
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <div style={{ width: 48, height: 48, minWidth: 48, background: 'var(--green-100)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-green)' }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, marginBottom: 4 }}>Office</p>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      Office 15, 76 High Street<br />
                      Stony Stratford<br />
                      Milton Keynes, MK11 1AH
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div data-reveal style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
              <MapEmbed query="76 High Street, Stony Stratford, Milton Keynes MK11 1AH" zoom={16} height={420} title="Key Partnership Recruitment office" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
