import galleryJson from './gallery.json'

export type Photo = {
  src: string
  srcset: string
  width: number
  height: number
  ratio: number
  blur: string
}

export type Collection = {
  slug: string
  title: string
  blurb: string
  icon: string
  photos: Photo[]
}

export const collections = (galleryJson as { collections: Collection[] }).collections

const bySlug = (slug: string) =>
  collections.find((c) => c.slug === slug) ?? collections[0]

/** Frames that ride the hero coverflow, in running order. */
export const heroSlides = [
  { photo: bySlug('pre-wedding').photos[1], caption: 'Pre-Wedding' },
  { photo: bySlug('housewarmings').photos[4], caption: 'Housewarming' },
  { photo: bySlug('weddings').photos[0], caption: 'Wedding' },
  { photo: bySlug('seemantham').photos[1], caption: 'Seemantham' },
  { photo: bySlug('graduations').photos[1], caption: 'Graduation' },
  { photo: bySlug('half-saree').photos[0], caption: 'Half Saree' },
  { photo: bySlug('matrimony').photos[0], caption: 'Matrimony' },
]

/** Shorter labels for the four films in the featured strip. */
export const filmDisplayTitles: Record<string, string> = {
  'Bk7i-m04Gqg': 'Sundari Parichayam',
  tY1mA_U7kOw: 'Hamsaro',
  T8sWmoYAwoI: 'Holi Fest',
  geIngdSgPzc: '352 Creates',
}

export const brand = {
  name: 'Pixels',
  by: 'by Santosh Vemula',
  tagline: ['We tell stories as a filmmaker', 'that captures the moments as they unfold.'],
  credo: ['Real People', 'Real Moments', 'Timeless Stories'],
  email: 'santoshvemula01@gmail.com',
  phone: '(352) 818 3024',
  phoneHref: '+13528183024',
}
