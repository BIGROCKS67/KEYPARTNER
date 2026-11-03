import { useEffect, useMemo, useState } from 'react'
import { geoMercator } from 'd3-geo'
import map from '../data/uk-dots.json'
import { useJobs } from '../data/jobs-context'
import { parseSalary, shortLocation } from '../lib/jobs'

// The office the lines start from: 76 High Street, Stony Stratford.
const HUB = [-0.8526, 52.0565]

// Towns that come up in Matt's adverts. A role in a town not listed here
// is still on the site, it just doesn't get a line on the map.
const PLACES = {
  'london': [-0.1276, 51.5072], 'manchester': [-2.2426, 53.4808], 'birmingham': [-1.8904, 52.4862],
  'leeds': [-1.5491, 53.8008], 'bristol': [-2.5879, 51.4545], 'bath': [-2.3590, 51.3811],
  'oxford': [-1.2577, 51.7520], 'cambridge': [0.1218, 52.2053], 'milton keynes': [-0.7594, 52.0406],
  'reading': [-0.9781, 51.4543], 'northampton': [-0.9027, 52.2405], 'bedford': [-0.4668, 52.1360],
  'luton': [-0.4200, 51.8787], 'leicester': [-1.1398, 52.6369], 'nottingham': [-1.1581, 52.9548],
  'sheffield': [-1.4701, 53.3811], 'liverpool': [-2.9916, 53.4084], 'newcastle': [-1.6178, 54.9783],
  'edinburgh': [-3.1883, 55.9533], 'glasgow': [-4.2518, 55.8642], 'cardiff': [-3.1791, 51.4816],
  'southampton': [-1.4044, 50.9097], 'brighton': [-0.1372, 50.8225], 'coventry': [-1.5197, 52.4068],
  'bicester': [-1.1533, 51.8998], 'swindon': [-1.7797, 51.5558], 'gloucester': [-2.2431, 51.8642],
  'cheltenham': [-2.0783, 51.8994], 'exeter': [-3.5339, 50.7184], 'plymouth': [-4.1427, 50.3755],
  'norwich': [1.2974, 52.6309], 'ipswich': [1.1555, 52.0567], 'york': [-1.0815, 53.9600],
  'hull': [-0.3367, 53.7457], 'belfast': [-5.9301, 54.5973], 'aberdeen': [-2.0943, 57.1497],
  'watford': [-0.3963, 51.6565], 'stevenage': [-0.2023, 51.9038], 'peterborough': [-0.2402, 52.5695],
  'banbury': [-1.3398, 52.0629], 'towcester': [-0.9888, 52.1336], 'warrington': [-2.5970, 53.3900],
  'stockport': [-2.1575, 53.4106], 'derby': [-1.4746, 52.9225], 'stoke': [-2.1794, 53.0027],
  'wolverhampton': [-2.1288, 52.5870], 'portsmouth': [-1.0880, 50.8198], 'guildford': [-0.5704, 51.2362],
  'slough': [-0.5950, 51.5105], 'basingstoke': [-1.0873, 51.2665], 'newbury': [-1.3230, 51.4014],
  'high wycombe': [-0.7487, 51.6287], 'aylesbury': [-0.8130, 51.8156], 'st albans': [-0.3360, 51.7520],
  'chelmsford': [0.4691, 51.7356], 'colchester': [0.9019, 51.8959], 'swansea': [-3.9436, 51.6214],
  'newport': [-2.9984, 51.5842], 'dundee': [-2.9707, 56.4620], 'sunderland': [-1.3822, 54.9069],
  'middlesbrough': [-1.2348, 54.5742], 'bradford': [-1.7594, 53.7960], 'huddersfield': [-1.7850, 53.6458],
  'preston': [-2.7035, 53.7632], 'lancaster': [-2.8007, 54.0466], 'chester': [-2.8931, 53.1934],
  'worcester': [-2.2216, 52.1936], 'hereford': [-2.7160, 52.0565], 'lincoln': [-0.5402, 53.2307],
  'kettering': [-0.7270, 52.3990], 'wellingborough': [-0.6940, 52.3020], 'corby': [-0.6936, 52.4880],
  'harrogate': [-1.5373, 53.9921], 'wakefield': [-1.4977, 53.6833], 'farnborough': [-0.7550, 51.2869],
  'crawley': [-0.1872, 51.1092], 'maidstone': [0.5242, 51.2704], 'canterbury': [1.0789, 51.2802],
}

function placeFor(location) {
  const text = (location || '').toLowerCase()
  const key = Object.keys(PLACES).find(k => text.includes(k))
  return key ? PLACES[key] : null
}

const k = (n) => `£${Math.round(n / 1000)}k`
function salaryShort(salary) {
  const s = parseSalary(salary)
  if (!s) return ''
  if (s.unit !== 'YEAR') return salary
  return s.max ? `${k(s.min)} to ${k(s.max)}` : k(s.min)
}

const dotsPath = (keep) => map.dots.filter(d => d[2] === keep).map(([x, y]) => `M${x} ${y}h0`).join('')
const UK_DOTS = dotsPath(1)
const IE_DOTS = dotsPath(0)

const STEP_MS = 3200

// A dotted map of Britain with a line drawn from Matt's office to the town
// of each live role in turn, labelled with the role and salary. Built from
// the jobs in Supabase, so it changes as roles are added or filled.
export function HeroMap() {
  const { jobs } = useJobs()
  const projection = useMemo(
    () => geoMercator().scale(map.projection.scale).translate(map.projection.translate),
    [],
  )
  const hub = projection(HUB)

  const routes = useMemo(() => {
    const seen = new Set()
    return jobs.flatMap(j => {
      const place = placeFor(j.location)
      if (!place) return []
      const [x, y] = projection(place)
      // Bend each line away from the straight path so it reads as a route
      const mx = (hub[0] + x) / 2, my = (hub[1] + y) / 2
      const dx = x - hub[0], dy = y - hub[1]
      const len = Math.hypot(dx, dy) || 1
      const bend = Math.min(60, len * 0.28)
      const cx = mx - (dy / len) * bend, cy = my + (dx / len) * bend
      const key = `${Math.round(x)},${Math.round(y)}`
      const first = !seen.has(key)
      seen.add(key)
      return [{ id: j.id, x, y, first, d: `M${hub[0]} ${hub[1]} Q${cx} ${cy} ${x} ${y}`, title: j.title, where: shortLocation(j.location), pay: salaryShort(j.salary) }]
    })
  }, [jobs, projection, hub])

  const [active, setActive] = useState(0)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) { setReduce(true); return }
    if (routes.length < 2) return
    const t = setInterval(() => setActive(i => (i + 1) % routes.length), STEP_MS)
    return () => clearInterval(t)
  }, [routes.length])

  const current = routes[active % Math.max(routes.length, 1)]
  // Keep the label inside the map on whichever side has room
  const labelLeft = current && current.x > map.width * 0.62

  const svg = (lit) => (
    <svg className="hero-map__svg" viewBox={`0 0 ${map.width} ${map.height}`} aria-hidden focusable="false">
      <path d={IE_DOTS} className={lit ? 'hero-map__dots hero-map__dots--lit-ie' : 'hero-map__dots hero-map__dots--ie'} />
      <path d={UK_DOTS} className={lit ? 'hero-map__dots hero-map__dots--lit' : 'hero-map__dots'} />
      {!lit && (
        <>
          {routes.map((r, i) => (
            <path
              key={r.id}
              d={r.d}
              pathLength="1"
              className={`hero-map__route${reduce || i === active % routes.length ? ' is-on' : ''}`}
            />
          ))}
          {routes.filter(r => r.first).map(r => (
            <circle key={`p${r.id}`} cx={r.x} cy={r.y} r="4" className="hero-map__town" />
          ))}
          {current && !reduce && (
            <g key={current.id} className="hero-map__ping">
              <circle cx={current.x} cy={current.y} r="5" />
            </g>
          )}
          <circle cx={hub[0]} cy={hub[1]} r="14" className="hero-map__hub-ring" />
          <circle cx={hub[0]} cy={hub[1]} r="5.5" className="hero-map__hub" />
          {current && !reduce && (
            <g key={`l${current.id}`} className="hero-map__label" transform={`translate(${current.x + (labelLeft ? -14 : 14)} ${current.y - 8})`}>
              <text textAnchor={labelLeft ? 'end' : 'start'} className="hero-map__label-title">{current.title}</text>
              <text textAnchor={labelLeft ? 'end' : 'start'} y="20" className="hero-map__label-meta">
                {[current.where, current.pay].filter(Boolean).join(' · ')}
              </text>
            </g>
          )}
        </>
      )}
    </svg>
  )

  return (
    <>
      <div className="hero-map">{svg(false)}</div>
      {/* A brighter copy of the dots, shown only under the mouse spotlight */}
      <div className="hero-map hero-map--lit">{svg(true)}</div>
    </>
  )
}
