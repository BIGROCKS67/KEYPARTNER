import { Link } from 'react-router-dom'
import { EMAIL, PHONE_DISPLAY, PHONE_TEL } from '../lib/site'

export function Applied() {
  return (
    <section className="page-hero page-hero--tall">
      <div className="container">
        <p className="eyebrow">Application sent</p>
        <h1>Thanks, Matt has your CV</h1>
        <p>Your details and CV have gone straight to our inbox. We'll be in touch within 24 hours.</p>
        <p className="page-hero__small">Anything else? Call <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a> or email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
        <div className="page-hero-actions">
          <Link to="/jobs" className="btn btn-green">Back to live roles</Link>
        </div>
      </div>
    </section>
  )
}
