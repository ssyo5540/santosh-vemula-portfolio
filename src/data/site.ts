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

const manifest = galleryJson as { collections: Collection[]; hero: Photo[] }

export const collections = manifest.collections

/** Frames that ride the hero coverflow, in running order. */
export const heroSlides = manifest.hero

/** Shorter labels for the four films in the featured strip. */
export const filmDisplayTitles: Record<string, string> = {
  iKSRc_Ld2fQ: 'Kaitlyn & Aaron',
  '6WmkbXM5sVQ': "Navya's Seemantham",
  '-eZpbxxDUP8': 'Subhash & Priya',
  Qs5RUXw5Um0: 'Senthilkumar & Lakshmi',
  'Bk7i-m04Gqg': 'Sundari Parichayam',
  tY1mA_U7kOw: 'Hamsaro',
}

export const brand = {
  name: 'Pixels',
  by: 'by Santosh Vemula',
  tagline: ['We tell stories as a filmmaker', 'that captures the moments as they unfold.'],
  credo: ['Real People', 'Real Moments', 'Timeless Stories'],
  email: 'pixelstoriesbysv@gmail.com',
}
