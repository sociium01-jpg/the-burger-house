'use client'

import { useEffect, useRef } from 'react'

type Props = {
  src: string
  poster?: string
  className?: string
}

export function LoopVideo({ src, poster, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.play().catch(() => {})
          } else {
            el.pause()
          }
        }
      },
      { root: null, rootMargin: '20% 0px', threshold: 0.15 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      el.pause()
    }
  }, [src])

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
    />
  )
}
