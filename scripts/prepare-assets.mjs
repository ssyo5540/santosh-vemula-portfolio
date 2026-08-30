/**
 * One-off asset pipeline.
 *
 * Reads the curated originals out of the legacy `public_html` tree, writes
 * responsive WebP renditions into `public/gallery`, and emits
 * `src/data/gallery.json` — a manifest carrying dimensions plus a tiny inline
 * blur placeholder for every frame so the site can blur-up instead of popping.
 *
 * Re-run with:  SOURCE_ROOT="/path/to/public_html" node scripts/prepare-assets.mjs
 */
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const SOURCE_ROOT =
  process.env.SOURCE_ROOT ??
  '/Users/satwikrudra/Documents/Personal/SVP/public_html (1)'

const PHOTOS = path.join(SOURCE_ROOT, 'events', 'photos')
const OUT_DIR = path.resolve('public/gallery')
const MANIFEST = path.resolve('src/data/gallery.json')

const WIDTHS = [800, 1600]
const QUALITY = 78

/** Curated running order. First entry of each set doubles as the cover frame. */
const COLLECTIONS = [
  {
    slug: 'weddings',
    title: 'Weddings',
    blurb: 'Muhurtham to mangalsutra — the whole day, told the way it felt.',
    icon: 'rings',
    src: [
      'main/2.jpeg',
      'wedding/9.jpg',
      'wedding/8.jpg',
      'wedding/4.jpg',
      'wedding/5.jpg',
      'wedding/6.jpg',
    ],
  },
  {
    slug: 'pre-wedding',
    title: 'Pre-Wedding',
    blurb: 'Coastlines, courthouses and golden hour before the big day.',
    icon: 'heart',
    src: [
      'pre-wedding/10.jpg',
      'pre-wedding/6.jpg',
      'pre-wedding/16.jpg',
      'pre-wedding/15.jpg',
      'pre-wedding/4.jpg',
      'pre-wedding/8.jpg',
    ],
  },
  {
    slug: 'housewarmings',
    title: 'Housewarmings',
    blurb: 'Gruhapravesam — first lamp, first meal, first memory.',
    icon: 'home',
    src: [
      'housewarmings/19.jpg',
      'housewarmings/23.jpg',
      'housewarmings/22.jpg',
      'housewarmings/7.jpg',
      'housewarmings/14.jpg',
      'housewarmings/18.jpg',
    ],
  },
  {
    slug: 'seemantham',
    title: 'Seemantham',
    blurb: 'Baby showers and bump portraits, glowing and unhurried.',
    icon: 'lotus',
    src: [
      'baby-showers-seemantham/3.jpg',
      'baby-showers-seemantham/Main.jpg',
      'baby-showers-seemantham/13.jpg',
      'baby-showers-seemantham/30.jpg',
      'baby-showers-seemantham/29.jpg',
      'baby-showers-seemantham/1.jpg',
    ],
  },
  {
    slug: 'birthdays',
    title: 'Birthdays',
    blurb: 'Cake smashes, balloon arches and the faces in between.',
    icon: 'cake',
    src: [
      'birthdays/2.jpg',
      'birthdays/Main.jpg',
      'birthdays/5.jpg',
      'birthdays/1.jpg',
      'birthdays/6.jpg',
      'birthdays/3.jpg',
    ],
  },
  {
    slug: 'half-saree',
    title: 'Half Saree',
    blurb: 'Langa voni ceremonies — colour, ritual and a little swagger.',
    icon: 'sparkle',
    src: [
      'half-saree/2.jpg',
      'half-saree/Main.jpg',
      'half-saree/9.jpg',
      'half-saree/6.jpg',
      'half-saree/4.jpg',
      'half-saree/5.jpg',
    ],
  },
  {
    slug: 'graduations',
    title: 'Graduations',
    blurb: 'Years of work, one tassel, and the campus that carried you.',
    icon: 'cap',
    src: [
      'graduation/4.jpg',
      'graduation/11.jpg',
      'graduation/6.jpg',
      'graduation/2.jpg',
      'graduation/7.jpg',
      'graduation/9.jpg',
    ],
  },
  {
    slug: 'matrimony',
    title: 'Matrimony Photoshoots',
    blurb: 'Portraits that actually look like you — for the profile that matters.',
    icon: 'ring',
    src: [
      'matrimony-photoshoots/1.jpg',
      'matrimony-photoshoots/11.jpg',
      'matrimony-photoshoots/2.jpg',
      'matrimony-photoshoots/3.jpg',
      'matrimony-photoshoots/5.jpg',
      'matrimony-photoshoots/7.jpg',
    ],
  },
  {
    slug: 'family-portraits',
    title: 'Family Portraits',
    blurb: 'Everyone in one frame, before everyone grows up again.',
    icon: 'family',
    src: [
      'family-portraits/1.jpg',
      'family-portraits/6.jpg',
      'family-portraits/3.jpg',
      'family-portraits/2.jpg',
      'family-portraits/5.jpg',
      'family-portraits/7.jpg',
    ],
  },
]

async function render(srcFile, slug, index) {
  const input = sharp(srcFile, { failOn: 'none' }).rotate()
  const meta = await input.metadata()
  const base = `${slug}/${index}`

  const renditions = await Promise.all(
    WIDTHS.map(async (w) => {
      const rel = `${base}-${w}.webp`
      const out = path.join(OUT_DIR, rel)
      await sharp(srcFile, { failOn: 'none' })
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(out)
      return [w, `/gallery/${rel}`]
    }),
  )

  // 20px blur seed, inlined as a data URI — cheap enough to ship in the bundle.
  const lqip = await sharp(srcFile, { failOn: 'none' })
    .rotate()
    .resize({ width: 20 })
    .webp({ quality: 40 })
    .toBuffer()

  return {
    src: renditions[renditions.length - 1][1],
    srcset: renditions.map(([w, url]) => `${url} ${w}w`).join(', '),
    width: meta.width ?? 0,
    height: meta.height ?? 0,
    ratio: +((meta.width ?? 1) / (meta.height ?? 1)).toFixed(4),
    blur: `data:image/webp;base64,${lqip.toString('base64')}`,
  }
}

async function main() {
  if (!existsSync(PHOTOS)) {
    console.error(`Source photos not found at: ${PHOTOS}`)
    process.exit(1)
  }

  await rm(OUT_DIR, { recursive: true, force: true })

  const collections = []
  for (const c of COLLECTIONS) {
    await mkdir(path.join(OUT_DIR, c.slug), { recursive: true })
    const photos = []
    for (const [i, rel] of c.src.entries()) {
      const file = path.join(PHOTOS, rel)
      if (!existsSync(file)) {
        console.warn(`  ! missing ${rel}`)
        continue
      }
      photos.push(await render(file, c.slug, i + 1))
      process.stdout.write(`\r  ${c.slug} ${photos.length}/${c.src.length}   `)
    }
    console.log(`\r  ${c.slug.padEnd(18)} ${photos.length} frames`)
    const { src, ...rest } = c
    collections.push({ ...rest, photos })
  }

  await writeFile(MANIFEST, JSON.stringify({ collections }, null, 2) + '\n')
  console.log(`\nWrote ${MANIFEST}`)
}

main()
