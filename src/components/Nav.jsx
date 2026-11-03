import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const base = import.meta.env.BASE_URL

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const menuBtn = useRef(null)
  const closeBtn = useRef(null)

  function close() {
    setOpen(false)
    menuBtn.current?.focus()
  }

  useEffect(() => {
    const onLenis = (e) => setScrolled(e.detail.scroll > 12)
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('lenis-scroll', onLenis)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('lenis-scroll', onLenis)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    setOpen(false)
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) return () => { document.body.style.overflow = '' }
    closeBtn.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <header className={`nav${scrolled ? ' nav--float' : ''}`}>
        <div className="nav-shell">
          <div className="nav-inner">
            <Link to="/" className="nav-logo" aria-label="Key Partnership home">
              <img src={`${base}logo-white.webp`} alt="Key Partnership Recruitment" width="499" height="100" />
            </Link>

            <nav className="nav-links" aria-label="Primary">
              <div className="nav-rail">
                <Link to="/jobs" className={pathname.startsWith('/jobs') ? 'active' : ''} aria-current={pathname === '/jobs' ? 'page' : undefined}>Jobs</Link>
                <Link to="/hire" className={pathname === '/hire' ? 'active' : ''} aria-current={pathname === '/hire' ? 'page' : undefined}>Work With Us</Link>
              </div>
              <Link to="/contact" className="btn btn-green nav-cta">Get In Touch</Link>
            </nav>

            <button type="button" ref={menuBtn} className="nav-menu-btn" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} aria-controls="mobile-menu">
              <Menu size={24} aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={`mobile-drawer${open ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="Menu" inert={!open}>
        <div className="drawer-overlay" onClick={close} />
        <div className="drawer-panel">
          <div className="drawer-header">
            <img src={`${base}logo-white.webp`} alt="" style={{ height: 28, filter: 'brightness(0) saturate(100%) invert(21%) sepia(60%) saturate(600%) hue-rotate(110deg) brightness(80%)' }} />
            <button type="button" ref={closeBtn} className="drawer-close" onClick={close} aria-label="Close menu">
              <X size={22} aria-hidden />
            </button>
          </div>
          <div className="drawer-links">
            <Link to="/jobs" onClick={() => setOpen(false)}>Jobs</Link>
            <Link to="/hire" onClick={() => setOpen(false)}>Work With Us</Link>
          </div>
          <Link to="/contact" className="btn btn-green drawer-cta" onClick={() => setOpen(false)}>Get In Touch</Link>
        </div>
      </div>
    </>
  )
}
