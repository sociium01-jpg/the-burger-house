'use client'

import { motion, useReducedMotion, useTransform, type MotionValue } from 'framer-motion'
import type { ReactNode } from 'react'
import { useOrderApp } from './OrderSheet'

const enterEase = [0.16, 1, 0.3, 1] as const

function beatOpacity(
  p: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number,
  hold: boolean,
) {
  if (p < inStart) return 0
  if (p < inEnd) return (p - inStart) / Math.max(0.0001, inEnd - inStart)
  if (hold || p <= outStart) return 1
  if (p < outEnd) return 1 - (p - outStart) / Math.max(0.0001, outEnd - outStart)
  return 0
}

function Beat({
  progress,
  inStart,
  inEnd,
  outStart,
  outEnd,
  hold = false,
  className,
  children,
}: {
  progress: MotionValue<number>
  inStart: number
  inEnd: number
  outStart: number
  outEnd: number
  hold?: boolean
  className?: string
  children: ReactNode
}) {
  const opacity = useTransform(progress, (p) =>
    beatOpacity(p, inStart, inEnd, outStart, outEnd, hold),
  )
  const y = useTransform(opacity, [0, 1], [18, 0])
  return (
    <motion.div className={className} style={{ opacity, y, pointerEvents: 'auto' }}>
      {children}
    </motion.div>
  )
}

export function HeroAssemblyCopy({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion()
  const dim = useTransform(progress, [0.86, 0.96, 1], [0, 1, 1])
  const { startOrder } = useOrderApp()

  return (
    <div className="hero-overlay">
      <nav className="hero-nav" aria-label="Primary">
        <a href="#top" className="display hero-nav-mark">
          The Burger House
        </a>
        <div className="hero-nav-links">
          <a href="#menu">Menu</a>
          <a href="#grill">Grill</a>
          <button type="button" onClick={() => startOrder()}>
            Order
          </button>
          <a href="#book">Book</a>
        </div>
      </nav>

      <motion.div className="hero-dim" style={{ opacity: dim }} />

      <Beat progress={progress} inStart={0} inEnd={0} outStart={0.14} outEnd={0.18} className="hero-slot hero-slot-identity">
        <motion.p
          className="label"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.05, ease: enterEase }}
        >
          Est. 2019 · Flame Grilled
        </motion.p>
        <motion.h1
          className="display hero-h1"
          initial={reduce ? false : { opacity: 0, y: 56 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.2, ease: enterEase }}
        >
          The Burger House
        </motion.h1>
        <motion.p
          className="hero-lede"
          initial={reduce ? false : { opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.4, ease: enterEase }}
        >
          Smash, sear, stack. Built on the flat-top, never under a lid.
        </motion.p>
        <motion.a
          href="#menu"
          className="cta"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55, ease: enterEase }}
          whileHover={reduce ? undefined : { scale: 1.04, backgroundColor: '#F58447' }}
          whileTap={reduce ? undefined : { scale: 0.98 }}
        >
          See the Menu
        </motion.a>
      </Beat>

      <Beat progress={progress} inStart={0.18} inEnd={0.24} outStart={0.44} outEnd={0.5} className="hero-slot hero-slot-right">
        <p className="display hero-line">Nine ingredients. No shortcuts.</p>
      </Beat>

      <Beat progress={progress} inStart={0.54} inEnd={0.6} outStart={0.82} outEnd={0.88} className="hero-slot hero-slot-left">
        <p className="display hero-line">Meat, salt, fire. That is the whole recipe.</p>
      </Beat>

      <Beat progress={progress} inStart={0.88} inEnd={0.93} outStart={1} outEnd={1} hold className="hero-slot hero-slot-center">
        <p className="label">The House</p>
        <p className="display hero-close">Built to order.</p>
        <motion.button
          type="button"
          className="cta"
          whileHover={reduce ? undefined : { scale: 1.04, backgroundColor: '#F58447' }}
          whileTap={reduce ? undefined : { scale: 0.98 }}
          onClick={() => startOrder()}
        >
          Order Now
        </motion.button>
      </Beat>
    </div>
  )
}

export function HeroCookingCopy({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="hero-overlay">
      <Beat progress={progress} inStart={0.04} inEnd={0.12} outStart={1} outEnd={1} hold className="hero-slot hero-slot-top">
        <p className="label">The Grill</p>
        <p className="display hero-statement">Smashed, seared, never steamed.</p>
      </Beat>
      <Beat progress={progress} inStart={0.42} inEnd={0.5} outStart={0.82} outEnd={0.9} className="hero-slot hero-slot-bottom">
        <p className="display hero-line">Twenty-four hour cure. Then the flat-top does the rest.</p>
      </Beat>
    </div>
  )
}

export function HeroRoomCopy({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion()
  return (
    <div className="hero-overlay">
      <Beat progress={progress} inStart={0.06} inEnd={0.14} outStart={0.42} outEnd={0.5} className="hero-slot hero-slot-center-early">
        <p className="label">The Room</p>
        <p className="display hero-statement">Come sit in it.</p>
      </Beat>
      <Beat progress={progress} inStart={0.72} inEnd={0.8} outStart={1} outEnd={1} hold className="hero-slot hero-slot-center-high">
        <p className="label">Last call</p>
        <p className="display hero-close">Your table is waiting.</p>
        <motion.a
          href="#book"
          className="cta"
          whileHover={reduce ? undefined : { scale: 1.04, backgroundColor: '#F58447' }}
          whileTap={reduce ? undefined : { scale: 0.98 }}
        >
          Book a Table
        </motion.a>
      </Beat>
    </div>
  )
}
