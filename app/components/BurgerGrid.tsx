'use client'

import { SEQUENCES, framePath } from '../frames'
import { MENU, rupees } from '../lib/menu'
import { LoopVideo } from './LoopVideo'
import { useOrderApp } from './OrderSheet'

const CARDS = MENU.map((item) => ({
  ...item,
  poster: framePath(SEQUENCES[item.sequenceKey].dir, 0),
}))

export function BurgerGrid() {
  const { startOrder } = useOrderApp()

  return (
    <section id="menu" className="menu-section">
      <p className="label">Four Ways</p>
      <div className="fighter-head">
        <h2 className="display menu-title">Pick your fighter.</h2>
        <button type="button" className="cta fighter-order" onClick={() => startOrder()}>
          Order now
        </button>
      </div>
      <div className="burger-grid">
        {CARDS.map((card) => (
          <article key={card.name} className="burger-card">
            <div className="burger-canvas-wrap">
              <LoopVideo src={card.video} poster={card.poster} className="burger-video" />
            </div>
            <div className="burger-card-body">
              <h3 className="display burger-name">{card.name}</h3>
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
    </section>
  )
}
