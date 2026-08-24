export type MenuItem = {
  id: 'chicken' | 'veg' | 'steak' | 'mutton'
  name: string
  description: string
  price: number
  sequenceKey: 'burgerChicken' | 'burgerVeg' | 'burgerSteak' | 'burgerMutton'
  video: string
}

export const MENU: MenuItem[] = [
  {
    id: 'chicken',
    name: 'Crispy Chicken',
    description: 'Buttermilk-fried thigh, pickle-brine slaw, fermented chilli mayo.',
    price: 349,
    sequenceKey: 'burgerChicken',
    video: '/videos/burger-01-chicken.mp4',
  },
  {
    id: 'veg',
    name: 'Grilled Veg & Halloumi',
    description: 'Charred courgette, smoked halloumi, roasted pepper relish.',
    price: 329,
    sequenceKey: 'burgerVeg',
    video: '/videos/burger-02-veg.mp4',
  },
  {
    id: 'steak',
    name: 'Seared Steak',
    description: 'Dry-aged steak, caramelised onion, bone-marrow butter.',
    price: 499,
    sequenceKey: 'burgerSteak',
    video: '/videos/burger-03-steak.mp4',
  },
  {
    id: 'mutton',
    name: 'Spiced Mutton',
    description: 'Slow-spiced shoulder, mint yoghurt, crisp shallot.',
    price: 449,
    sequenceKey: 'burgerMutton',
    video: '/videos/burger-04-mutton.mp4',
  },
]

export const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}`
