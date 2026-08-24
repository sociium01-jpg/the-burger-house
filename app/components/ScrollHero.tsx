'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useMotionValue, type MotionValue } from 'framer-motion'
import { framePath, type Sequence } from '../frames'
import { drawCover, scrollProgress } from '../lib/sequenceDraw'

type Props = {
  sequence: Sequence
  heightVh?: number
  eager?: boolean
  children: (progress: MotionValue<number>) => ReactNode
}

export function ScrollHero({ sequence, heightVh = 500, eager = false, children }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progress = useMotionValue(0)
  const imagesRef = useRef<(HTMLImageElement | null)[]>([])
  const wantedRef = useRef(0)
  const paintedRef = useRef(-1)
  const rafRef = useRef(0)
  const loopingRef = useRef(false)

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return

    const { dir, frameCount } = sequence
    let cancelled = false
    let preloadStarted = false
    let preloadObs: IntersectionObserver | null = null
    let loopObs: IntersectionObserver | null = null

    const paint = (index: number) => {
      const img = frameCount > 0 ? imagesRef.current[index] : null
      return drawCover(canvas, img)
    }

    const paintWanted = () => {
      const ok = paint(wantedRef.current)
      if (ok) paintedRef.current = wantedRef.current
      return ok
    }

    const onResize = () => {
      const ok = paint(wantedRef.current)
      if (ok) paintedRef.current = wantedRef.current
      else paintedRef.current = -1
    }

    const tick = () => {
      if (!loopingRef.current || cancelled) return
      progress.set(scrollProgress(section))
      if (frameCount > 0) {
        wantedRef.current = Math.round(progress.get() * (frameCount - 1))
        paintWanted()
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    const startLoop = () => {
      if (loopingRef.current || cancelled) return
      loopingRef.current = true
      rafRef.current = requestAnimationFrame(tick)
    }

    const stopLoop = () => {
      loopingRef.current = false
      cancelAnimationFrame(rafRef.current)
    }

    const attachFrame = (i: number) => {
      if (imagesRef.current[i]) return
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        if (cancelled) return
        if (i === wantedRef.current) {
          const ok = paint(i)
          if (ok) paintedRef.current = i
        }
      }
      img.src = framePath(dir, i)
      imagesRef.current[i] = img
    }

    const preload = () => {
      if (preloadStarted || frameCount === 0 || cancelled) return
      preloadStarted = true
      attachFrame(0)
      for (let i = 1; i < frameCount; i++) attachFrame(i)
    }

    paint(0)
    window.addEventListener('resize', onResize)

    if (frameCount === 0) {
      return () => {
        cancelled = true
        window.removeEventListener('resize', onResize)
      }
    }

    if (eager) preload()
    else {
      preloadObs = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) preload()
        },
        { root: null, rootMargin: '100% 0px 100% 0px', threshold: 0 },
      )
      preloadObs.observe(section)
    }

    loopObs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) startLoop()
        else stopLoop()
      },
      { root: null, rootMargin: '150% 0px 150% 0px', threshold: 0 },
    )
    loopObs.observe(section)

    return () => {
      cancelled = true
      stopLoop()
      preloadObs?.disconnect()
      loopObs?.disconnect()
      window.removeEventListener('resize', onResize)
      for (const img of imagesRef.current) {
        if (img) img.onload = null
      }
      imagesRef.current = []
    }
  }, [eager, progress, sequence])

  return (
    <section ref={sectionRef} style={{ height: `${heightVh}vh`, position: 'relative' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100dvh',
          overflow: 'hidden',
          background: '#12100E',
        }}
      >
        <canvas
          ref={canvasRef}
          aria-hidden
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          {children(progress)}
        </div>
      </div>
    </section>
  )
}
