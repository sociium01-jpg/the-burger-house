'use client'

import type { ReactNode } from 'react'
import { LoopVideo } from './LoopVideo'

export function VideoHero({
  id,
  src,
  poster,
  children,
}: {
  id?: string
  src: string
  poster?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="video-hero">
      <LoopVideo src={src} poster={poster} className="video-hero-media" />
      <div className="video-hero-copy">{children}</div>
    </section>
  )
}
