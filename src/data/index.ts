export interface Listing {
  id: number
  address: string
  neighborhood: string
  price: number
  beds: number
  baths: number
  sqft: number
  status: 'active' | 'under_contract'
  img: string
  highlight: string
}

export interface SoldHome {
  id: number
  address: string
  neighborhood: string
  salePrice: number
  listPrice: number
  daysOnMarket: number
  soldDate: string
}

export interface Testimonial {
  id: number
  name: string
  role: string
  quote: string
  stars: number
  neighborhood: string
}

export const LISTINGS: Listing[] = [
  {
    id: 1,
    address: '1722 Park Ave',
    neighborhood: 'Bolton Hill',
    price: 449_000,
    beds: 3,
    baths: 2.5,
    sqft: 1920,
    status: 'active',
    img: '',
    highlight: "Restored Victorian rowhouse with original pocket doors & chef's kitchen.",
  },
  {
    id: 2,
    address: '321 S. Charles St',
    neighborhood: 'Federal Hill',
    price: 379_000,
    beds: 2,
    baths: 2,
    sqft: 1480,
    status: 'under_contract',
    img: '',
    highlight: 'Panoramic harbor views from a private rooftop deck.',
  },
  {
    id: 3,
    address: '2210 Maryland Ave',
    neighborhood: 'Charles Village',
    price: 325_000,
    beds: 4,
    baths: 2,
    sqft: 2100,
    status: 'active',
    img: '',
    highlight: 'Oversized end-unit steps from Hopkins campus.',
  },
]

export const SOLD_HOMES: SoldHome[] = [
  {
    id: 1,
    address: '1604 Bolton St',
    neighborhood: 'Bolton Hill',
    salePrice: 512_000,
    listPrice: 499_000,
    daysOnMarket: 6,
    soldDate: 'Jan 2025',
  },
  {
    id: 2,
    address: '28 E. Cross St',
    neighborhood: 'Federal Hill',
    salePrice: 415_000,
    listPrice: 410_000,
    daysOnMarket: 4,
    soldDate: 'Nov 2024',
  },
  {
    id: 3,
    address: '1905 Guilford Ave',
    neighborhood: 'Greenmount West',
    salePrice: 285_000,
    listPrice: 275_000,
    daysOnMarket: 11,
    soldDate: 'Oct 2024',
  },
  {
    id: 4,
    address: '3311 Keswick Rd',
    neighborhood: 'Hampden',
    salePrice: 358_000,
    listPrice: 349_000,
    daysOnMarket: 5,
    soldDate: 'Sep 2024',
  },
  {
    id: 5,
    address: '512 N. Calvert St',
    neighborhood: 'Mount Vernon',
    salePrice: 472_000,
    listPrice: 465_000,
    daysOnMarket: 8,
    soldDate: 'Aug 2024',
  },
  {
    id: 6,
    address: '2042 Maryland Ave',
    neighborhood: 'Charles Village',
    salePrice: 299_000,
    listPrice: 289_000,
    daysOnMarket: 9,
    soldDate: 'Jul 2024',
  },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Marcus & Priya Chen',
    role: 'First-time buyers',
    quote:
      'Nick found us a Bolton Hill gem we never would have discovered on our own. He negotiated $25k below ask and had us in contract in a week. We feel like we stole it.',
    stars: 5,
    neighborhood: 'Bolton Hill',
  },
  {
    id: 2,
    name: 'Sarah Kowalski',
    role: 'Seller',
    quote:
      "Listed on a Tuesday, had 9 showings by Thursday, accepted an over-ask offer by Friday. Nick's staging advice and pricing strategy were spot-on.",
    stars: 5,
    neighborhood: 'Federal Hill',
  },
  {
    id: 3,
    name: 'James & Tanya Brooks',
    role: 'Investors',
    quote:
      "We've done three deals with Nick now. He knows which blocks are turning, what the ARV will be, and which contractors to call. Invaluable.",
    stars: 5,
    neighborhood: 'Remington',
  },
  {
    id: 4,
    name: 'Danielle Osei',
    role: 'Relocation buyer',
    quote:
      'Moving from NYC, I needed someone who could move fast and know the city deeply. Nick did three virtual tours, explained every neighborhood, and had me in contract before I even flew out.',
    stars: 5,
    neighborhood: 'Mount Vernon',
  },
]
