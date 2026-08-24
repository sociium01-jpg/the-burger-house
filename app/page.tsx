'use client'

import { AppShell } from './components/AppShell'
import { BurgerGrid } from './components/BurgerGrid'
import { Footer } from './components/Footer'
import { HeroAssemblyCopy, HeroCookingCopy, HeroRoomCopy } from './components/HeroCopy'
import { OrderSection } from './components/OrderSection'
import { OrderAppProvider } from './components/OrderSheet'
import { ScrollHero } from './components/ScrollHero'
import { VideoHero } from './components/VideoHero'
import { SEQUENCES, framePath } from './frames'

export default function HomePage() {
  return (
    <OrderAppProvider>
      <AppShell>
        <main>
          <ScrollHero sequence={SEQUENCES.heroAssembly} heightVh={500} eager>
            {(progress) => <HeroAssemblyCopy progress={progress} />}
          </ScrollHero>

          <BurgerGrid />

          <VideoHero
            id="grill"
            src="/videos/hero-02-cooking.mp4"
            poster={framePath(SEQUENCES.heroCooking.dir, 0)}
          >
            <HeroCookingCopy />
          </VideoHero>

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
