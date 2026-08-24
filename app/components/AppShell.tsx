'use client'

import type { ReactNode } from 'react'
import { useOrderApp } from './OrderSheet'

const TABS = [
  { href: '#top', label: 'Home' },
  { href: '#menu', label: 'Menu' },
  { href: '#order-app', label: 'Order' },
  { href: '#book', label: 'Book' },
]

export function AppShell({ children }: { children: ReactNode }) {
  const { startOrder } = useOrderApp()

  return (
    <div className="app-root" id="top">
      <header className="app-topbar">
        <span className="display app-wordmark">The Burger House</span>
        <button type="button" className="cta app-top-cta" onClick={() => startOrder()}>
          Order
        </button>
      </header>
      <div className="app-body">{children}</div>
      <nav className="app-tabs" aria-label="App">
        {TABS.map((tab) =>
          tab.href === '#order-app' ? (
            <button key={tab.label} type="button" onClick={() => startOrder()}>
              {tab.label}
            </button>
          ) : (
            <a key={tab.label} href={tab.href}>
              {tab.label}
            </a>
          ),
        )}
      </nav>
    </div>
  )
}
