import galleryJson from './gallery.json'
import { asset } from '../lib/paths'

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

/** The manifest stores root-absolute paths; rebase them for sub-path deploys. */
const rebase = (photo: Photo): Photo => ({
  ...photo,
  src: asset(photo.src),
  srcset: photo.srcset
    .split(',')
    .map((entry) => {
      const [url, width] = entry.trim().split(' ')
      return `${asset(url)} ${width}`
    })
    .join(', '),
})

export const collections = manifest.collections.map((c) => ({
  ...c,
  photos: c.photos.map(rebase),
}))

/** Frames that ride the hero coverflow, in running order. */
export const heroSlides = manifest.hero.map(rebase)

/** Shorter labels for films in the featured strip. */
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
