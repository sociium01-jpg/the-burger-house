'use client'

import { AppShell } from './components/AppShell'
import { BurgerGrid } from './components/BurgerGrid'
import { Footer } from './components/Footer'
import { HeroAssemblyCopy, HeroCookingCopy, HeroRoomCopy } from './components/HeroCopy'
import { OrderSection } from './components/OrderSection'
import { OrderAppProvider } from './components/OrderSheet'
import { ScrollHero } from './components/ScrollHero'
import { SEQUENCES } from './frames'

export default function HomePage() {
  return (
    <OrderAppProvider>
      <AppShell>
        <main>
          <ScrollHero sequence={SEQUENCES.heroAssembly} heightVh={500} eager>
            {(progress) => <HeroAssemblyCopy progress={progress} />}
          </ScrollHero>

          <BurgerGrid />

          <ScrollHero sequence={SEQUENCES.heroCooking} heightVh={400} id="grill">
            {(progress) => <HeroCookingCopy progress={progress} />}
          </ScrollHero>

          <div id="book">
            <OrderSection />
          </div>

          <ScrollHero sequence={SEQUENCES.heroRestaurant} heightVh={400}>
            {(progress) => <HeroRoomCopy progress={progress} />}
          </ScrollHero>

          <Footer />
        </main>
      </AppShell>
    </OrderAppProvider>
  )
}
