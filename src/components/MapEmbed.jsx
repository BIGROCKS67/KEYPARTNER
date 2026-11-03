import { useState } from 'react'
import { MapPin } from 'lucide-react'

// Google Maps sets cookies, so the map loads only when someone asks for it.
export function MapEmbed({ query, zoom = 12, height = 220, title }) {
  const [show, setShow] = useState(false)
  const q = encodeURIComponent(query)
  if (show) {
    return (
      <iframe
        title={title}
        src={`https://maps.google.com/maps?q=${q}&output=embed&z=${zoom}`}
        width="100%" height={height}
        style={{ border: 0, display: 'block' }}
        referrerPolicy="no-referrer-when-downgrade"
      />
    )
  }
  return (
    <div className="map-placeholder" style={{ height }}>
      <MapPin size={20} aria-hidden />
      <p>{query}</p>
      <button type="button" className="btn btn-outline map-placeholder__btn" onClick={() => setShow(true)}>
        Show map
      </button>
      <span className="map-placeholder__note">Loads Google Maps, which sets cookies</span>
    </div>
  )
}
