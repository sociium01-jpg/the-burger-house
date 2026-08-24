export type MenuItem = {
  id: 'chicken' | 'veg' | 'steak' | 'mutton'
  name: string
  description: string
  price: number
  sequenceKey: 'burgerChicken' | 'burgerVeg' | 'burgerSteak' | 'burgerMutton'
}

export const MENU: MenuItem[] = [
  {
    id: 'chicken',
    name: 'Crispy Chicken',
    description: 'Buttermilk-fried thigh, pickle-brine slaw, fermented chilli mayo.',
    price: 349,
    sequenceKey: 'burgerChicken',
  },
  {
    id: 'veg',
    name: 'Grilled Veg & Halloumi',
    description: 'Charred courgette, smoked halloumi, roasted pepper relish.',
    price: 329,
    sequenceKey: 'burgerVeg',
  },
  {
    id: 'steak',
    name: 'Seared Steak',
    description: 'Dry-aged steak, caramelised onion, bone-marrow butter.',
    price: 499,
    sequenceKey: 'burgerSteak',
  },
  {
    id: 'mutton',
    name: 'Spiced Mutton',
    description: 'Slow-spiced shoulder, mint yoghurt, crisp shallot.',
    price: 449,
    sequenceKey: 'burgerMutton',
  },
]

export const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}`
