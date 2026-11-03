import { useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FORM_ACTION, CV_MAX_MB, SITE_URL, PHONE_DISPLAY, PHONE_TEL } from '../lib/site'

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

// Posts to FormSubmit as a normal multipart form, so it works without
// JavaScript. With JavaScript, fields are checked first and errors are
// listed in a summary that takes focus.
export function EnquiryForm({ subject, next, rules, submitLabel, extra = {}, children, notice }) {
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
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
    setSending(true)
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
      <div className="enquiry__send">
        <button type="submit" className="btn btn-green enquiry__submit" disabled={sending}>{sending ? 'Sending…' : submitLabel}</button>
        <p className="enquiry__alt">Or call Matt on <a href={`tel:${PHONE_TEL}`} className="mono">{PHONE_DISPLAY}</a></p>
      </div>
    </form>
  )
}
