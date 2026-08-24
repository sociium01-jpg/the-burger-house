'use client'

import { useLayoutEffect, useRef } from 'react'
import { useMotionValue } from 'framer-motion'
import { SEQUENCES, framePath, type Sequence } from '../frames'
import { MENU, rupees } from '../lib/menu'
import { drawCover, scrollProgress } from '../lib/sequenceDraw'
import { useOrderApp } from './OrderSheet'

const CARDS = MENU.map((item) => ({
  ...item,
  sequence: SEQUENCES[item.sequenceKey] as Sequence,
}))

type Slot = {
  canvas: HTMLCanvasElement
  sequence: Sequence
  images: (HTMLImageElement | null)[]
  wanted: number
  painted: number
  preloadStarted: boolean
}

export function BurgerGrid() {
  const { startOrder } = useOrderApp()
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([])
  const slotsRef = useRef<Slot[]>([])
  const rafRef = useRef(0)
  const loopingRef = useRef(false)
  const progress = useMotionValue(0)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let cancelled = false
    let preloadObs: IntersectionObserver | null = null
    let loopObs: IntersectionObserver | null = null

    slotsRef.current = CARDS.flatMap((card, i) => {
      const canvas = canvasRefs.current[i]
      if (!canvas) return []
      return [
        {
          canvas,
          sequence: card.sequence,
          images: [] as (HTMLImageElement | null)[],
          wanted: 0,
          painted: -1,
          preloadStarted: false,
        },
      ]
    })

    const paintSlot = (slot: Slot, index: number) => {
      const img = slot.sequence.frameCount > 0 ? slot.images[index] : null
      return drawCover(slot.canvas, img)
    }

    const attach = (slot: Slot, i: number) => {
      if (slot.images[i]) return
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        if (cancelled) return
        if (i === slot.wanted) {
          if (paintSlot(slot, i)) slot.painted = i
        }
      }
      img.src = framePath(slot.sequence.dir, i)
      slot.images[i] = img
    }

    const preloadAll = () => {
      for (const slot of slotsRef.current) {
        if (slot.preloadStarted || slot.sequence.frameCount === 0) continue
        slot.preloadStarted = true
        attach(slot, 0)
        for (let i = 1; i < slot.sequence.frameCount; i++) attach(slot, i)
      }
    }

    const tick = () => {
      if (!loopingRef.current || cancelled) return
      const p = scrollProgress(section)
      progress.set(p)
      for (const slot of slotsRef.current) {
        const n = slot.sequence.frameCount
        if (n === 0) {
          paintSlot(slot, 0)
          continue
        }
        slot.wanted = Math.round(p * (n - 1))
        if (paintSlot(slot, slot.wanted)) slot.painted = slot.wanted
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

    const onResize = () => {
      for (const slot of slotsRef.current) {
        if (paintSlot(slot, slot.wanted)) slot.painted = slot.wanted
        else slot.painted = -1
      }
    }

    for (const slot of slotsRef.current) paintSlot(slot, 0)

    window.addEventListener('resize', onResize)

    const anyFrames = slotsRef.current.some((s) => s.sequence.frameCount > 0)
    if (!anyFrames) {
      return () => window.removeEventListener('resize', onResize)
    }

    preloadObs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) preloadAll()
      },
      { root: null, rootMargin: '100% 0px 100% 0px', threshold: 0 },
    )
    preloadObs.observe(section)

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
      for (const slot of slotsRef.current) {
        for (const img of slot.images) {
          if (img) img.onload = null
        }
        slot.images = []
      }
    }
  }, [progress])

  return (
    <section
      id="menu"
      ref={sectionRef}
      style={{ height: '250vh', position: 'relative', background: '#12100E' }}
    >
      <div
        className="burger-sticky"
        style={{
          position: 'sticky',
          top: 0,
          minHeight: '100dvh',
          padding: '4.5rem 6vw 3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <p className="label">Four Ways</p>
        <div className="fighter-head">
          <h2
            className="display"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)', margin: '0.4rem 0 0' }}
          >
            Pick your fighter.
          </h2>
          <button type="button" className="cta fighter-order" onClick={() => startOrder()}>
            Order now
          </button>
        </div>
        <div className="burger-grid">
          {CARDS.map((card, i) => (
            <article key={card.name} className="burger-card">
              <div className="burger-canvas-wrap">
                <canvas
                  ref={(el) => {
                    canvasRefs.current[i] = el
                  }}
                  aria-hidden
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                />
              </div>
              <div style={{ padding: '1rem 1.1rem 1.2rem' }}>
                <h3 className="display" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', margin: 0 }}>
                  {card.name}
                </h3>
                <p className="burger-copy">{card.description}</p>
                <div className="burger-card-actions">
                  <p className="burger-price">{rupees(card.price)}</p>
                  <button type="button" className="cta burger-order" onClick={() => startOrder(card.id)}>
                    Order now
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
