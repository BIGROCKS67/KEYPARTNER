import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EMAIL, PHONE_DISPLAY, PHONE_TEL } from '../lib/site'
import { jobRef } from '../lib/jobs'

// Applications go straight to Matt's inbox as an ordinary email, so there is
// no form service in between to fail. The subject carries the role and
// reference so he can sort them.
export function EmailApply({ job }) {
  const ref = jobRef(job)
  const subject = `Application: ${job.title} (${ref})`
  const body = 'Hi Matt,\n\nI\'d like to apply for this role. My CV is attached.\n\nName:\nPhone:\nNotice period:\n\n'
  const href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard blocked: the address is on screen to select */ }
  }

  return (
    <div className="email-apply">
      <ol className="email-apply__steps">
        <li>Email your CV to <a href={href} className="email-apply__address">{EMAIL}</a></li>
        <li>Put <strong>{ref}</strong> in the subject so Matt knows which role it's for</li>
      </ol>
      <div className="email-apply__actions">
        <a href={href} className="btn btn-green">Email my CV to Matt</a>
        <button type="button" className="btn email-apply__copy" onClick={copy}>
          {copied ? 'Copied' : 'Copy email address'}
        </button>
      </div>
      <p className="email-apply__alt">Prefer to talk first? Call Matt on <a href={`tel:${PHONE_TEL}`} className="tnum">{PHONE_DISPLAY}</a>.</p>
      <p className="email-apply__notice">
        Matt uses your CV to put you forward for this role and similar ones, and keeps it for up to 2 years unless you ask him to delete it sooner. Read the <Link to="/privacy">privacy notice</Link>.
      </p>
    </div>
  )
}
