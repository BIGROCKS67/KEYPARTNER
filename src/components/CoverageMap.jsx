import { useEffect, useRef } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { geoNaturalEarth1 } from 'd3-geo'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const MAP_W = 960
const MAP_H = 460
const PROJ_SCALE = 148
const PROJ_CENTER = [81, 5]

const HIGHLIGHTED = new Set([
  'United Kingdom',
  'Australia',
  'New Zealand',
  'Singapore',
  'United Arab Emirates',
])

const MARKERS = [
  { name: 'UK',        coordinates: [-1.5,   52.5],  label: 'United Kingdom', anchor: 'middle', dy: -13 },
  { name: 'UAE',       coordinates: [55.3,   25.2],  label: 'UAE',            anchor: 'middle', dy: -13 },
  { name: 'Singapore', coordinates: [103.8,   1.3],  label: 'Singapore',      anchor: 'middle', dy: -13 },
  { name: 'Sydney',    coordinates: [151.2, -33.9],  label: 'Sydney',         anchor: 'middle', dy: -13 },
  { name: 'Auckland',  coordinates: [174.8, -36.9],  label: 'Auckland',       anchor: 'start',  dy: -13 },
]

const proj = geoNaturalEarth1()
  .scale(PROJ_SCALE)
  .center(PROJ_CENTER)
  .translate([MAP_W / 2, MAP_H / 2])

const pts = MARKERS.map(m => {
  const [x, y] = proj(m.coordinates)
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }
})

let PLANE_PATH = `M ${pts[0].x},${pts[0].y}`
for (let i = 1; i < pts.length; i++) {
  const p = pts[i - 1], c = pts[i]
  const cpx = (p.x + c.x) / 2
  PLANE_PATH += ` C ${cpx},${p.y} ${cpx},${c.y} ${c.x},${c.y}`
}

const PLANE_SHAPE = 'M 12 0 L 4 -3 L -2 -10 L -5 -2 L -9 -3 L -11 -1 L -9 0 L -11 1 L -9 3 L -5 2 L -2 10 L 4 3 Z'
const FLIGHT_MS = 9000
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

// Flies the plane along the same path the dashed route is drawn on, using
// getPointAtLength so it behaves the same in every browser (Safari included).
function usePlane(routeRef, planeRef) {
  useEffect(() => {
    const route = routeRef.current
    const plane = planeRef.current
    if (!route || !plane) return
    const len = route.getTotalLength()
    const place = (d, alpha) => {
      const p = route.getPointAtLength(d)
      const q = route.getPointAtLength(Math.min(d + 1, len))
      const back = route.getPointAtLength(Math.max(d - 1, 0))
      const angle = Math.atan2(q.y - back.y, q.x - back.x) * 180 / Math.PI
      plane.setAttribute('transform', `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) rotate(${angle.toFixed(1)}) scale(0.85)`)
      plane.style.opacity = alpha
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { place(0, 1); return }

    let frame = 0, start = 0, visible = false
    const tick = (now) => {
      if (!start) start = now
      const t = ((now - start) % FLIGHT_MS) / FLIGHT_MS
      // fade in at take-off and out on landing
      const alpha = Math.min(1, t / 0.05, (1 - t) / 0.05)
      place(easeInOut(t) * len, alpha.toFixed(3))
      if (visible) frame = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      cancelAnimationFrame(frame)
      if (visible) frame = requestAnimationFrame(tick)
    })
    io.observe(route)
    return () => { io.disconnect(); cancelAnimationFrame(frame) }
  }, [routeRef, planeRef])
}

export function CoverageMap() {
  const routeRef = useRef(null)
  const planeRef = useRef(null)
  usePlane(routeRef, planeRef)

  return (
    <section className="coverage-section">

      <div className="container coverage-header">
        <div className="section-divider white" data-reveal />
        <p className="eyebrow coverage-eyebrow" data-reveal>Our Reach</p>
        <h2 className="section-title coverage-title" data-reveal>Where We Place Talent</h2>
        <p className="coverage-sub" data-reveal>
          Based in Milton Keynes, positioned within the UK's tech corridor, we partner with clients across the UK and international markets.
        </p>
      </div>

      <div className="coverage-map-wrap" data-reveal>
        <ComposableMap
          projection="geoNaturalEarth1"
          projectionConfig={{ scale: PROJ_SCALE, center: PROJ_CENTER }}
          width={MAP_W}
          height={MAP_H}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map(geo => {
                const hi = HIGHLIGHTED.has(geo.properties?.name)
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={hi ? 'rgba(52,168,101,0.85)' : 'rgba(0,40,20,0.45)'}
                    stroke={hi ? 'rgba(93,198,138,0.5)' : 'rgba(93,198,138,0.15)'}
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover:   { outline: 'none', fill: hi ? '#5dc68a' : 'rgba(0,50,25,0.55)' },
                      pressed: { outline: 'none' },
                    }}
                  />
                )
              })
            }
          </Geographies>

          {/* One path for both the dashed route and the plane's flight */}
          <path
            ref={routeRef}
            d={PLANE_PATH}
            fill="none"
            stroke="rgba(93,198,138,0.55)"
            strokeWidth={1.4}
            strokeDasharray="5 4"
            strokeLinecap="round"
            className="coverage-arc"
          />

          <path
            ref={planeRef}
            d={PLANE_SHAPE}
            fill="#fff"
            stroke="rgba(10,46,26,0.6)"
            strokeWidth="0.6"
            className="coverage-plane"
            transform={`translate(${pts[0].x} ${pts[0].y}) scale(0.85)`}
            style={{ opacity: 0 }}
          />

          {MARKERS.map(({ name, coordinates, label, anchor, dy }) => (
            <Marker key={name} coordinates={coordinates}>
              <circle r={9} fill="rgba(52,168,101,0.18)" className="coverage-pulse-ring" />
              <circle r={4} fill="#34a865" stroke="#fff" strokeWidth={1.5} />
              <text
                textAnchor={anchor}
                y={dy}
                style={{
                  fontFamily: 'inherit',
                  fontSize: 9,
                  fill: 'rgba(255,255,255,0.75)',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  pointerEvents: 'none',
                }}
              >
                {label}
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </div>

      
    </section>
  )
}
