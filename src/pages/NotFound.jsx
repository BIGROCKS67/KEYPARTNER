import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <section className="page-hero page-hero--tall">
      <div className="container">
        <p className="eyebrow">Page not found</p>
        <h1>We can't find that page</h1>
        <p>The link may be old, or the role it pointed to has been filled.</p>
        <div className="page-hero-actions">
          <Link to="/jobs" className="btn btn-green">View live roles</Link>
          <Link to="/" className="btn btn-dark-outline">Home page</Link>
        </div>
      </div>
    </section>
  )
}
