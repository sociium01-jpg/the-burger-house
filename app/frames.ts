export type Sequence = { dir: string; frameCount: number }

export const SEQUENCES = {
  heroAssembly: { dir: 'hero-01-assembly', frameCount: 241 },
  heroCooking: { dir: 'hero-02-cooking', frameCount: 241 },
  heroRestaurant: { dir: 'hero-03-restaurant', frameCount: 241 },
  burgerChicken: { dir: 'burger-01-chicken', frameCount: 61 },
  burgerVeg: { dir: 'burger-02-veg', frameCount: 61 },
  burgerSteak: { dir: 'burger-03-steak', frameCount: 61 },
  burgerMutton: { dir: 'burger-04-mutton', frameCount: 61 },
} satisfies Record<string, Sequence>

export const framePath = (dir: string, i: number) =>
  `/frames/${dir}/frame_${String(i + 1).padStart(4, '0')}.jpg`
