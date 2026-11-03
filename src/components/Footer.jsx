import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin } from 'lucide-react'

const base = import.meta.env.BASE_URL

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-simple">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={`${base}logo-white.webp`} alt="Key Partnership Recruitment" width="499" height="100" loading="lazy" />
            </div>
            <p className="footer-tagline">A Business Built on Relationships.</p>
          </div>

          <div className="footer-contact-list">
            <a href="tel:+441327493143" className="footer-contact-item">
              <Phone size={14} aria-hidden /> 01327 493143
            </a>
            <a href="mailto:info@ourkeypartnership.co.uk" className="footer-contact-item">
              <Mail size={14} aria-hidden /> info@ourkeypartnership.co.uk
            </a>
            <span className="footer-contact-item footer-contact-item--text">
              <MapPin size={14} aria-hidden /> Office 15, 76 High Street, Stony Stratford, MK11 1AH
            </span>
          </div>

          <div className="footer-links-col">
            <Link to="/jobs">Jobs</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/hire">Work with us</Link>
            <Link to="/privacy">Privacy notice</Link>
            <a href="https://linkedin.com/company/key-partnership-recruitment" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Key Partnership Recruitment Ltd. Registered in England and Wales, company number 12733360. Registered office: 3 West Street, Leighton Buzzard, Bedfordshire, LU7 1DA.</span>
        </div>
      </div>
    </footer>
  )
}
