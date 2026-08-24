'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { MENU, rupees, type MenuItem } from '../lib/menu'
import { isCochinServiceable } from '../lib/serviceArea'
import { GoogleBikeMap } from './GoogleBikeMap'

type QtyMap = Record<MenuItem['id'], number>
type Step = 'bag' | 'address' | 'pay' | 'kitchen' | 'rider' | 'live'

type Address = {
  name: string
  phone: string
  line1: string
  city: string
  state: string
  pincode: string
}

const EMPTY_QTY: QtyMap = { chicken: 0, veg: 0, steak: 0, mutton: 0 }

const DEFAULT_ADDRESS: Address = {
  name: 'Guest',
  phone: '9876543210',
  line1: 'Marine Drive',
  city: 'Cochin',
  state: 'Kerala',
  pincode: '682031',
}

type OrderCtx = {
  open: boolean
  startOrder: (id?: MenuItem['id']) => void
  close: () => void
}

const Ctx = createContext<OrderCtx | null>(null)

export function useOrderApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useOrderApp must be used inside OrderAppProvider')
  return ctx
}

export function OrderAppProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [seed, setSeed] = useState<MenuItem['id'] | undefined>()
  const [ticket, setTicket] = useState(0)

  const startOrder = useCallback((id?: MenuItem['id']) => {
    setSeed(id)
    setTicket((n) => n + 1)
    setOpen(true)
  }, [])

  const close = useCallback(() => setOpen(false), [])

  const value = useMemo(() => ({ open, startOrder, close }), [open, startOrder, close])

  useEffect(() => {
    document.body.classList.toggle('order-open', open)
    return () => document.body.classList.remove('order-open')
  }, [open])

  return (
    <Ctx.Provider value={value}>
      {children}
      <AnimatePresence>
        {open ? <OrderSheet key={ticket} seed={seed} onClose={close} /> : null}
      </AnimatePresence>
    </Ctx.Provider>
  )
}

function OrderSheet({ seed, onClose }: { seed?: MenuItem['id']; onClose: () => void }) {
  const reduce = useReducedMotion()
  const [step, setStep] = useState<Step>('bag')
  const [qty, setQty] = useState<QtyMap>(() => ({
    ...EMPTY_QTY,
    ...(seed ? { [seed]: 1 } : { chicken: 1 }),
  }))
  const [address, setAddress] = useState<Address>(DEFAULT_ADDRESS)
  const [payMethod, setPayMethod] = useState<'upi' | 'card' | 'cod'>('upi')
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [payBusy, setPayBusy] = useState(false)
  const [kitchenDone, setKitchenDone] = useState(false)
  const [rider, setRider] = useState('Finding a rider…')
  const [orderId] = useState(() => `BH-${Math.floor(1000 + Math.random() * 9000)}`)
  const [serviceError, setServiceError] = useState('')
  const serviceable = isCochinServiceable(address)

  const lines = MENU.filter((item) => qty[item.id] > 0)
  const total = lines.reduce((sum, item) => sum + item.price * qty[item.id], 0)

  const bump = (id: MenuItem['id'], delta: number) => {
    setQty((prev) => ({ ...prev, [id]: Math.max(0, prev[id] + delta) }))
  }

  const goPay = () => {
    if (!address.name.trim() || address.phone.length < 10 || address.pincode.length !== 6) return
    if (!isCochinServiceable(address)) {
      setServiceError('Not serviceable. We only deliver in Cochin, Kerala (PIN 682xxx).')
      return
    }
    setServiceError('')
    setStep('pay')
  }

  const pay = () => {
    setPayBusy(true)
    window.setTimeout(() => {
      setPayBusy(false)
      setStep('kitchen')
      window.setTimeout(() => setKitchenDone(true), 1600)
      window.setTimeout(() => {
        setStep('rider')
        const names = ['Arun K.', 'Meera S.', 'Vishnu P.', 'Nisha R.']
        let i = 0
        const timer = window.setInterval(() => {
          i += 1
          setRider(names[i % names.length])
          if (i >= 6) {
            window.clearInterval(timer)
            setRider(names[2])
            window.setTimeout(() => setStep('live'), 700)
          }
        }, 380)
      }, 2800)
    }, 1100)
  }

  return (
    <motion.div
      className="order-app"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-app-title"
      initial={reduce ? false : { y: '100%' }}
      animate={{ y: 0 }}
      exit={reduce ? undefined : { y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
    >
      <header className="order-app-bar">
        <button type="button" className="order-app-back" onClick={step === 'bag' ? onClose : () => setStep(backStep(step))}>
          {step === 'bag' ? 'Close' : 'Back'}
        </button>
        <div>
          <p className="label" style={{ margin: 0 }}>
            The Burger House
          </p>
          <h2 id="order-app-title" className="display" style={{ fontSize: '1.5rem', margin: '0.15rem 0 0' }}>
            {titleFor(step)}
          </h2>
        </div>
        <span className="order-app-id">{orderId}</span>
      </header>

      <div className="order-app-dots" aria-hidden>
        {(['bag', 'address', 'pay', 'kitchen', 'live'] as const).map((s) => (
          <span key={s} className={dotActive(step, s) ? 'on' : ''} />
        ))}
      </div>

      <div className="order-app-body" data-step={step}>
        {step === 'bag' && (
          <>
            {MENU.map((item) => (
              <div key={item.id} className="order-line">
                <div>
                  <p className="display" style={{ fontSize: '1.35rem', margin: 0 }}>
                    {item.name}
                  </p>
                  <p className="burger-copy" style={{ margin: '0.2rem 0 0' }}>
                    {rupees(item.price)}
                  </p>
                </div>
                <div className="qty">
                  <button type="button" onClick={() => bump(item.id, -1)} aria-label={`Fewer ${item.name}`}>
                    −
                  </button>
                  <span>{qty[item.id]}</span>
                  <button type="button" onClick={() => bump(item.id, 1)} aria-label={`More ${item.name}`}>
                    +
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {step === 'address' && (
          <form className="order-form" onSubmit={(e) => { e.preventDefault(); goPay() }}>
            <Field label="Name" value={address.name} onChange={(v) => setAddress({ ...address, name: v })} />
            <Field label="Phone" value={address.phone} onChange={(v) => setAddress({ ...address, phone: v.replace(/\D/g, '').slice(0, 10) })} inputMode="tel" />
            <Field label="Street" value={address.line1} onChange={(v) => setAddress({ ...address, line1: v })} />
            <div className="order-form-row">
              <Field
                label="City"
                value={address.city}
                onChange={(v) => {
                  setAddress({ ...address, city: v })
                  setServiceError('')
                }}
              />
              <Field
                label="State"
                value={address.state}
                onChange={(v) => {
                  setAddress({ ...address, state: v })
                  setServiceError('')
                }}
              />
            </div>
            <Field
              label="Pincode"
              value={address.pincode}
              onChange={(v) => {
                setAddress({ ...address, pincode: v.replace(/\D/g, '').slice(0, 6) })
                setServiceError('')
              }}
              inputMode="numeric"
            />
            {!serviceable ? (
              <p className="order-error" role="alert">
                {serviceError || 'Not serviceable. We only deliver in Cochin, Kerala (PIN 682xxx).'}
              </p>
            ) : (
              <p className="order-hint">Delivery only in Cochin. Default drop: Marine Drive, 682031.</p>
            )}
          </form>
        )}

        {step === 'pay' && (
          <div className="pay-block">
            <p className="pay-total">{rupees(total)}</p>
            <p className="order-hint">Dummy gateway — no charge is taken.</p>
            <div className="pay-methods">
              {(['upi', 'card', 'cod'] as const).map((m) => (
                <button key={m} type="button" className={payMethod === m ? 'on' : ''} onClick={() => setPayMethod(m)}>
                  {m === 'upi' ? 'UPI' : m === 'card' ? 'Card' : 'Cash'}
                </button>
              ))}
            </div>
            {payMethod === 'card' && (
              <form className="order-form" onSubmit={(e) => e.preventDefault()}>
                <Field label="Name on card" value={card.name} onChange={(v) => setCard({ ...card, name: v })} />
                <Field label="Card number" value={card.number} onChange={(v) => setCard({ ...card, number: v.replace(/\D/g, '').slice(0, 16) })} inputMode="numeric" />
                <div className="order-form-row">
                  <Field label="MM/YY" value={card.expiry} onChange={(v) => setCard({ ...card, expiry: v.slice(0, 5) })} />
                  <Field label="CVV" value={card.cvv} onChange={(v) => setCard({ ...card, cvv: v.replace(/\D/g, '').slice(0, 3) })} inputMode="numeric" />
                </div>
              </form>
            )}
            {payMethod === 'upi' && <p className="upi-id">burgerhouse@okaxis</p>}
            {payMethod === 'cod' && <p className="order-hint">Pay the rider in cash on arrival.</p>}
          </div>
        )}

        {step === 'kitchen' && (
          <div className="stage-block">
            <motion.div
              className="kitchen-ring"
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ repeat: kitchenDone ? 0 : Infinity, duration: 1.4, ease: 'linear' }}
            />
            <p className="display" style={{ fontSize: '2.4rem', margin: '1rem 0 0.4rem' }}>
              {kitchenDone ? 'Accepted' : 'Kitchen ping'}
            </p>
            <p className="order-hint">
              {kitchenDone
                ? 'The pass just punched your ticket. Smash going on the iron.'
                : 'Waiting for The Burger House to accept…'}
            </p>
            <ul className="stage-list">
              <li className="on">Order received</li>
              <li className={kitchenDone ? 'on' : ''}>Restaurant accepted</li>
              <li>Assigning rider</li>
            </ul>
          </div>
        )}

        {step === 'rider' && (
          <div className="stage-block">
            <p className="label">Live dispatch</p>
            <p className="display" style={{ fontSize: '2.2rem', margin: '0.4rem 0' }}>
              {rider}
            </p>
            <p className="order-hint">Matching a rider near Marine Drive.</p>
          </div>
        )}

        {step === 'live' && (
          <div className="live-block">
            <GoogleBikeMap address={address} />
            <p className="display" style={{ fontSize: '1.8rem', margin: '1rem 0 0.3rem' }}>
              On the way
            </p>
            <p className="order-hint">
              Rider Vishnu P. · bike live on Google Maps · {address.line1}, {address.city} {address.pincode}
            </p>
            <ul className="stage-list">
              {lines.map((item) => (
                <li key={item.id} className="on">
                  {qty[item.id]} × {item.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <footer className="order-app-foot">
        {step === 'bag' && (
          <button type="button" className="cta order-app-cta" disabled={total === 0} onClick={() => setStep('address')}>
            Continue · {rupees(total)}
          </button>
        )}
        {step === 'address' && (
          <button type="button" className="cta order-app-cta" disabled={!serviceable} onClick={goPay}>
            {serviceable ? `Deliver to ${address.pincode || 'pin'}` : 'Not serviceable'}
          </button>
        )}
        {step === 'pay' && (
          <button type="button" className="cta order-app-cta" disabled={payBusy} onClick={pay}>
            {payBusy ? 'Authorising…' : `Pay ${rupees(total)}`}
          </button>
        )}
        {step === 'live' && (
          <button type="button" className="cta order-app-cta" onClick={onClose}>
            Done
          </button>
        )}
      </footer>
    </motion.div>
  )
}

function Field({
  label,
  value,
  onChange,
  inputMode,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  inputMode?: 'tel' | 'numeric'
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} inputMode={inputMode} autoComplete="off" />
    </label>
  )
}

function titleFor(step: Step) {
  switch (step) {
    case 'bag':
      return 'Your bag'
    case 'address':
      return 'Address'
    case 'pay':
      return 'Pay'
    case 'kitchen':
      return 'Kitchen'
    case 'rider':
      return 'Rider'
    case 'live':
      return 'Tracking'
  }
}

function backStep(step: Step): Step {
  if (step === 'address') return 'bag'
  if (step === 'pay') return 'address'
  if (step === 'kitchen' || step === 'rider' || step === 'live') return 'pay'
  return 'bag'
}

function dotActive(step: Step, s: 'bag' | 'address' | 'pay' | 'kitchen' | 'live') {
  const order: Step[] = ['bag', 'address', 'pay', 'kitchen', 'rider', 'live']
  const map: Record<typeof s, Step[]> = {
    bag: ['bag'],
    address: ['address'],
    pay: ['pay'],
    kitchen: ['kitchen', 'rider'],
    live: ['live'],
  }
  return map[s].includes(step) || order.indexOf(step) > order.indexOf(map[s][0])
}
