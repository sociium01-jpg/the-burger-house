'use client'

import { useEffect, useRef } from 'react'
import { destFromAddress, isCochinServiceable, KITCHEN, type DeliveryAddress } from '../lib/serviceArea'

function project(
  lat: number,
  lng: number,
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  w: number,
  h: number,
) {
  const pad = 0.12
  const x = ((lng - bounds.minLng) / Math.max(0.0001, bounds.maxLng - bounds.minLng)) * (1 - pad * 2) + pad
  const y = ((bounds.maxLat - lat) / Math.max(0.0001, bounds.maxLat - bounds.minLat)) * (1 - pad * 2) + pad
  return { x: x * w, y: y * h }
}

export function GoogleBikeMap({ address }: { address: DeliveryAddress }) {
  const bikeRef = useRef<HTMLDivElement>(null)
  const dest = destFromAddress(address)
  const serviceable = isCochinServiceable(address)
  const src = `https://maps.google.com/maps?saddr=${KITCHEN.lat},${KITCHEN.lng}&daddr=${dest.lat},${dest.lng}&hl=en&z=14&output=embed`

  useEffect(() => {
    const el = bikeRef.current
    const wrap = el?.parentElement
    if (!el || !wrap || !serviceable) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let start = 0
    const duration = 14000

    const bounds = {
      minLat: Math.min(KITCHEN.lat, dest.lat) - 0.012,
      maxLat: Math.max(KITCHEN.lat, dest.lat) + 0.012,
      minLng: Math.min(KITCHEN.lng, dest.lng) - 0.012,
      maxLng: Math.max(KITCHEN.lng, dest.lng) + 0.012,
    }

    const tick = (t: number) => {
      const w = wrap.clientWidth
      const h = wrap.clientHeight
      const a = project(KITCHEN.lat, KITCHEN.lng, bounds, w, h)
      const b = project(dest.lat, dest.lng, bounds, w, h)
      if (reduce) {
        el.style.transform = `translate(${b.x - 18}px, ${b.y - 18}px) rotate(20deg)`
        return
      }
      if (!start) start = t
      const p = Math.min(1, (t - start) / duration)
      const x = a.x + (b.x - a.x) * p
      const y = a.y + (b.y - a.y) * p
      const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
      el.style.transform = `translate(${x - 18}px, ${y - 18}px) rotate(${ang}deg)`
      if (p < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [dest.lat, dest.lng, serviceable])

  return (
    <div className="google-map" aria-label="Live delivery map">
      <iframe
        title="Google Map delivery route"
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      {serviceable ? (
        <div ref={bikeRef} className="map-bike" aria-hidden>
          <BikeIcon />
        </div>
      ) : null}
      <p className="map-caption">
        {KITCHEN.label} → {address.line1}, {address.city} {address.pincode} · {dest.area}
      </p>
    </div>
  )
}

function BikeIcon() {
  return (
    <svg viewBox="0 0 64 40" width="36" height="22">
      <circle cx="14" cy="30" r="8" fill="#0A0908" stroke="#F5EFE7" strokeWidth="2" />
      <circle cx="50" cy="30" r="8" fill="#0A0908" stroke="#F5EFE7" strokeWidth="2" />
      <path d="M14 30 L28 18 H40 L50 30 M28 18 L32 8 H40" fill="none" stroke="#E2622A" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="38" cy="10" r="3" fill="#F5EFE7" />
    </svg>
  )
}
