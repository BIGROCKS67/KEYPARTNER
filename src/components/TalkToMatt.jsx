import { useEffect, useState } from 'react'
import { useHydrated } from '../hooks/useHydrated'
import { EMAIL, FOUNDER, PHONE_DISPLAY, PHONE_TEL } from '../lib/site'

const ukTime = (d) => new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit' }).format(d)

// Closing contact: the person, his direct line and the two routes in.
// Drawn from how boutique search firms close (founder named, number as the CTA)
// rather than a generic "Get in touch" button.
export function TalkToMatt({ eyebrow, title, body, links = [] }) {
  const hydrated = useHydrated()
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="container talk">
      <div className="talk__copy">
        {eyebrow && <p className="eyebrow talk__eyebrow" data-reveal>{eyebrow}</p>}
        <h2 className="talk__title" data-reveal>{title}</h2>
        {body && <p className="talk__body" data-reveal>{body}</p>}
      </div>

      <div className="talk__card" data-reveal>
        <div className="talk__who">
          <img src="/matt.jpg" alt="" width="64" height="64" loading="lazy" />
          <div>
            <p className="talk__name">{FOUNDER.name}</p>
            <p className="talk__role">Founder, Key Partnership Recruitment</p>
          </div>
        </div>
        <a className="talk__phone" href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
        <p className="talk__meta">
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <span aria-hidden> · </span>
          <span>{hydrated ? `${ukTime(now)} in Milton Keynes` : 'Milton Keynes'}</span>
        </p>
        {links.length > 0 && (
          <ul className="talk__links">
            {links.map(l => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}
          </ul>
        )}
      </div>
    </div>
  )
}
