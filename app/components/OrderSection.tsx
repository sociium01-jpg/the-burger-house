'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useOrderApp } from './OrderSheet'

const ease = [0.25, 0, 0, 1] as const

const routes = [
  {
    title: 'Dine in',
    copy: 'Reserve a booth. We hold the table; you bring the appetite.',
    href: '#book',
    label: 'Reserve',
    primary: true,
  },
  {
    title: 'Takeaway',
    copy: 'Call the pass. Fifteen minutes, wrapped and still hot.',
    href: 'tel:+910000000000',
    label: 'Call the kitchen',
    primary: false,
  },
  {
    title: 'Delivery',
    copy: 'Same smash, sent over. Order online when you cannot wait.',
    href: '#order',
    label: 'Order online',
    primary: false,
  },
]

export function OrderSection() {
  const { startOrder } = useOrderApp()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <section id="order" ref={ref} className="order-section">
      <p className="label">Order</p>
      <h2 className="display order-title">Hungry now?</h2>
      <p className="order-sub">
        Three ways out the door. Pick the one that matches how hungry you are.
      </p>
      <div className="order-grid">
        {routes.map((route, i) => (
          <motion.article
            key={route.title}
            className="order-card"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.55, delay: i * 0.1, ease }}
          >
            <h3 className="display" style={{ fontSize: '1.7rem', margin: '0 0 0.45rem' }}>
              {route.title}
            </h3>
            <p className="order-copy">{route.copy}</p>
            {route.href === '#order' ? (
              <motion.button
                type="button"
                className={route.primary ? 'cta' : 'cta cta-ghost'}
                whileHover={{ scale: 1.04, backgroundColor: route.primary ? '#F58447' : undefined }}
                whileTap={{ scale: 0.98 }}
                style={{ marginTop: '0.4rem' }}
                onClick={() => startOrder()}
              >
                {route.label}
              </motion.button>
            ) : (
              <motion.a
                href={route.href}
                className={route.primary ? 'cta' : 'cta cta-ghost'}
                whileHover={{ scale: 1.04, backgroundColor: route.primary ? '#F58447' : undefined }}
                whileTap={{ scale: 0.98 }}
                style={{ marginTop: '0.4rem' }}
              >
                {route.label}
              </motion.a>
            )}
          </motion.article>
        ))}
      </div>
    </section>
  )
}
