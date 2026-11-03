import { useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FORM_ACTION, CV_MAX_MB, SITE_URL, PHONE_DISPLAY, PHONE_TEL, EMAIL } from '../lib/site'

/* ---------- checks: messages follow the GOV.UK pattern ---------- */

export const checks = {
  name: (v) => (v.trim() ? null : 'Enter your full name'),
  email: (v) => {
    if (!v.trim()) return 'Enter your email address'
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : 'Enter an email address in the correct format, like name@example.com'
  },
  phoneOptional: (v) => (!v.trim() || v.replace(/\D/g, '').length >= 10 ? null : 'Enter a phone number, like 07700 900123'),
  required: (msg) => (v) => (v.trim() ? null : msg),
  file: ({ required }) => (_, el) => {
    const f = el.files?.[0]
    if (!f) return required ? 'Select your CV' : null
    if (!/\.(pdf|docx?)$/i.test(f.name)) return 'Your CV must be a PDF or Word document'
    if (f.size > CV_MAX_MB * 1024 * 1024) return `Your file must be smaller than ${CV_MAX_MB}MB`
    return null
  },
}

/* ---------- field ---------- */

export function Field({ name, label, hint, error, as = 'input', width, children, ...rest }) {
  const id = useId()
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  const Tag = as
  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {hint && <p className="field__hint" id={`${id}-hint`}>{hint}</p>}
      {error && <p className="field__error" id={`${id}-error`}><span className="visually-hidden">Error: </span>{error}</p>}
      <Tag
        id={id}
        name={name}
        aria-describedby={describedBy}
        aria-invalid={error ? 'true' : undefined}
        style={width ? { maxInlineSize: width } : undefined}
        {...rest}
      >{children}</Tag>
    </div>
  )
}

/* ---------- form ---------- */

// FormSubmit has outages where it times out (Cloudflare 522) and the
// application is lost. Before posting, check it answers quickly; a healthy
// FormSubmit replies in well under a second, an outage takes about 20s.
const FORM_HOST_TIMEOUT_MS = 8000
async function formHostUp() {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), FORM_HOST_TIMEOUT_MS)
  try {
    await fetch('https://formsubmit.co/', { mode: 'no-cors', cache: 'no-store', signal: ctrl.signal })
    return true
  } catch {
    return false
  } finally {
    clearTimeout(t)
  }
}

// Posts to FormSubmit as a normal multipart form, so it works without
// JavaScript. With JavaScript, fields are checked first and errors are
// listed in a summary that takes focus, and if FormSubmit is down the
// person gets a prefilled email to send instead.
export function EnquiryForm({ subject, next, rules, submitLabel, extra = {}, children, notice }) {
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [fallback, setFallback] = useState(null)
  const summary = useRef(null)
  const form = useRef(null)
  const baseTitle = useRef('')

  const run = (name) => {
    const el = form.current.elements[name]
    return el ? rules[name](el.value || '', el) : null
  }

  const onSubmit = (e) => {
    const found = {}
    for (const name of Object.keys(rules)) {
      const msg = run(name)
      if (msg) found[name] = msg
    }
    setErrors(found)
    if (Object.keys(found).length) {
      e.preventDefault()
      if (!baseTitle.current) baseTitle.current = document.title.replace(/^Error: /, '')
      document.title = `Error: ${baseTitle.current}`
      requestAnimationFrame(() => summary.current?.focus())
      return
    }
    if (baseTitle.current) document.title = baseTitle.current
    form.current.elements._next.value = `${window.location.origin}${next}`
    e.preventDefault()
    setSending(true)
    setFallback(null)
    formHostUp().then(up => {
      if (up) { form.current.submit(); return }
      setSending(false)
      setFallback(mailtoFor(form.current, subject, extra))
    })
  }

  // Once a field has an error, re-check it as the person types.
  const onInput = (e) => {
    const name = e.target.name
    if (!errors[name]) return
    const msg = run(name)
    setErrors(prev => {
      const copy = { ...prev }
      if (msg) copy[name] = msg; else delete copy[name]
      if (!Object.keys(copy).length && baseTitle.current) document.title = baseTitle.current
      return copy
    })
  }

  const list = Object.entries(errors)

  return (
    <form
      ref={form}
      className="enquiry"
      action={FORM_ACTION}
      method="POST"
      encType="multipart/form-data"
      noValidate
      onSubmit={onSubmit}
      onInput={onInput}
      onChange={onInput}
    >
      {list.length > 0 && (
        <div className="error-summary" role="alert" tabIndex={-1} ref={summary}>
          <h3>There is a problem</h3>
          <ul>
            {list.map(([name, msg]) => (
              <li key={name}>
                <a href={`#${name}`} onClick={(e) => { e.preventDefault(); form.current.elements[name]?.focus() }}>{msg}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <input type="hidden" name="_subject" value={subject} />
      <input type="hidden" name="_next" defaultValue={`${SITE_URL}${next}`} />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_template" value="table" />
      {Object.entries(extra).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <div className="hp" aria-hidden="true">
        <label>Leave this empty <input type="text" name="_honey" tabIndex={-1} autoComplete="off" /></label>
      </div>

      {typeof children === 'function' ? children(errors) : children}

      <p className="enquiry__notice">
        {notice} Read the <Link to="/privacy">privacy notice</Link>.
      </p>
      {fallback && (
        <div className="error-summary form-down" role="alert">
          <h3>Our form service isn't responding</h3>
          <p>Nothing has been sent. Please email {extra.Role ? 'your CV' : 'your message'} to Matt instead. We've filled in your details; {extra.Role ? 'attach your CV before sending.' : 'just press send.'}</p>
          <p><a className="btn btn-green" href={fallback}>Email {EMAIL}</a></p>
          <p>Or call Matt on <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>.</p>
        </div>
      )}
      <div className="enquiry__send">
        <button type="submit" className="btn btn-green enquiry__submit" disabled={sending}>{sending ? 'Sending…' : submitLabel}</button>
        <p className="enquiry__alt">Or call Matt on <a href={`tel:${PHONE_TEL}`} className="mono">{PHONE_DISPLAY}</a></p>
      </div>
    </form>
  )
}

// A mailto with the person's answers, for when FormSubmit is down.
function mailtoFor(f, subject, extra) {
  const skip = new Set(['_subject', '_next', '_captcha', '_template', '_honey', 'attachment'])
  const lines = []
  for (const [k, v] of new FormData(f)) {
    if (skip.has(k) || typeof v !== 'string' || !v.trim() || k in extra) continue
    lines.push(`${k.charAt(0).toUpperCase()}${k.slice(1)}: ${v.trim()}`)
  }
  for (const [k, v] of Object.entries(extra)) lines.push(`${k}: ${v}`)
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
}
