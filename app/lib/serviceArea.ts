export type DeliveryAddress = {
  line1: string
  city: string
  state: string
  pincode: string
}

export const KITCHEN = {
  lat: 9.9816,
  lng: 76.2825,
  label: 'The Burger House, Marine Drive',
}

const COCHIN_CITY = /^(cochin|kochi|ernakulam|kochi city|kochi metro)$/i

const PIN_COORDS: Record<string, { lat: number; lng: number; area: string }> = {
  '682001': { lat: 9.9816, lng: 76.2767, area: 'Ernakulam North' },
  '682011': { lat: 9.9668, lng: 76.2911, area: 'Ernakulam South' },
  '682013': { lat: 9.9674, lng: 76.2979, area: 'Kadavanthra' },
  '682015': { lat: 9.9578, lng: 76.2894, area: 'Thevara' },
  '682016': { lat: 9.9592, lng: 76.2975, area: 'Panampilly Nagar' },
  '682018': { lat: 9.9702, lng: 76.2853, area: 'Ravipuram' },
  '682020': { lat: 9.9658, lng: 76.2422, area: 'Fort Kochi' },
  '682031': { lat: 9.9828, lng: 76.2782, area: 'Marine Drive' },
  '682035': { lat: 10.026, lng: 76.308, area: 'Kakkanad' },
}

export function isCochinServiceable(address: DeliveryAddress) {
  const cityOk = COCHIN_CITY.test(address.city.trim())
  const stateOk = /^kerala$/i.test(address.state.trim())
  const pinOk = /^682\d{3}$/.test(address.pincode.trim())
  return cityOk && stateOk && pinOk
}

export function destFromAddress(address: DeliveryAddress) {
  const known = PIN_COORDS[address.pincode]
  if (known) return known
  const n = Number(address.pincode) || 682031
  return {
    lat: 9.97 + ((n % 40) - 20) * 0.0018,
    lng: 76.27 + ((n % 25) - 12) * 0.0022,
    area: 'Cochin',
  }
}
