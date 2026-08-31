/**
 * One-off asset pipeline.
 *
 * Reads the curated originals out of the legacy `public_html` tree, writes
 * responsive WebP renditions into `public/gallery`, and emits
 * `src/data/gallery.json`, a manifest carrying dimensions plus a tiny inline
 * blur placeholder for every frame so the site can blur-up instead of popping.
 *
 * Re-run with:  SOURCE_ROOT="/path/to/public_html" node scripts/prepare-assets.mjs
 */
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const SOURCE_ROOT =
  process.env.SOURCE_ROOT ??
  '/Users/satwikrudra/Documents/Personal/SVP/public_html (1)'

/** Hero frames come from their own folder, supplied separately. */
const HERO_ROOT =
  process.env.HERO_ROOT ?? '/Users/satwikrudra/Documents/Personal/SVP/carousel-originals'

/** Category folders exported from the studio's Drive, newer than the legacy tree. */
const DRIVE_ROOT =
  process.env.DRIVE_ROOT ?? '/Users/satwikrudra/Documents/Personal/SVP/drive-originals'

const PHOTOS = path.join(SOURCE_ROOT, 'events', 'photos')
const OUT_DIR = path.resolve('public/gallery')
const MANIFEST = path.resolve('src/data/gallery.json')

const WIDTHS = [800, 1600]
const QUALITY = 78

/** Running order for the hero coverflow. */
const HERO = [
  '1.jpg',
  'DSC08950.jpg',
  'Main.jpg',
  '4.jpg',
  'DSC04249.jpg',
  'Main (1).jpg',
  'DSC00193.jpg',
  '341A0491.jpg',
  'DSC09625.jpg',
]

/**
 * Curated running order. First entry of each set doubles as the cover frame.
 *
 * `root` overrides the source tree for a whole collection. Individual entries
 * can override it again with a `drive:` or `legacy:` prefix, which is what
 * lets Birthdays mix the older shoots with the newer Drive export in one
 * ordered list.
 *
 * An entry ending in `/` names a folder rather than a file and pulls in every
 * image inside it, so a whole Drive set can be added without listing each
 * frame. Files named explicitly earlier are not repeated, which keeps a
 * hand-picked cover frame at the front of an otherwise wholesale folder.
 */
const COLLECTIONS = [
  {
    slug: 'weddings',
    title: 'Weddings',
    blurb: 'Muhurtham to mangalsutra, the whole day told the way it felt.',
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
    slug: 'engagement',
    title: 'Engagement',
    blurb: 'Coastlines, courthouses and golden hour before the big day.',
    icon: 'heart',
    root: DRIVE_ROOT,
    src: [
      '1 Engagement/DSC03626.jpg',
      '1 Engagement/DSC07961.jpg',
      '1 Engagement/DSC03601.jpg',
      '1 Engagement/DSC01848.jpg',
      '1 Engagement/DSC02717.jpg',
      '1 Engagement/DSC00014.jpg',
      '1 Engagement/DSC03311.jpg',
      '1 Engagement/DSC02647.jpg',
      '1 Engagement/DSC07672.jpg',
      '1 Engagement/DSC03833.jpg',
      '1 Engagement/DSC02492.jpg',
      '1 Engagement/DSC00226.jpg',
      '1 Engagement/DSC00055.jpg',
      '1 Engagement/DSC01767.jpg',
      '1 Engagement/DSC07821.jpg',
      '1 Engagement/DSC03982.jpg',
      '1 Engagement/DSC04249.jpg',
      '1 Engagement/Main.jpg',
      '1 Engagement/DSC09951.jpg',
      '1 Engagement/DSC09953.jpg',
      '1 Engagement/DSC09968.jpg',
      '1 Engagement/DSC09971.jpg',
    ],
  },
  {
    slug: 'housewarmings',
    title: 'Housewarmings',
    blurb: 'Gruhapravesam: first lamp, first meal, first memory.',
    icon: 'home',
    src: [
      'housewarmings/19.jpg',
      'housewarmings/23.jpg',
      'housewarmings/22.jpg',
      'housewarmings/7.jpg',
      'housewarmings/14.jpg',
      'housewarmings/18.jpg',
      // The rest of the set, straight from the Drive export.
      'drive:Housewarming/',
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
      // The rest of the set, straight from the Drive export.
      'drive:Baby Shower/',
      'drive:Seemantham/',
    ],
  },
  {
    slug: 'birthdays',
    title: 'Birthdays',
    blurb: 'First candles through sixteenth, cake smashes to full-scale parties.',
    icon: 'cake',
    src: [
      'birthdays/2.jpg',
      'birthdays/Main.jpg',
      'birthdays/5.jpg',
      'birthdays/1.jpg',
      'birthdays/6.jpg',
      'birthdays/3.jpg',
      'drive:9 16th Birthday/DSC09879.jpg',
      'drive:9 16th Birthday/DSC00077.jpg',
      'drive:9 16th Birthday/DSC09414.jpg',
      'drive:9 16th Birthday/DSC09403.jpg',
      'drive:9 16th Birthday/DSC00193.jpg',
      'drive:9 16th Birthday/DSC09625.jpg',
      'drive:9 16th Birthday/DSC09621.jpg',
      'drive:9 16th Birthday/DSC00074.jpg',
      'drive:9 16th Birthday/DSC09376.jpg',
      'drive:9 16th Birthday/DSC00066.jpg',
      'drive:9 16th Birthday/DSC00161.jpg',
      'drive:9 16th Birthday/DSC09746.jpg',
      'drive:9 16th Birthday/DSC00055.jpg',
      'drive:9 16th Birthday/DSC09369.jpg',
    ],
  },
  {
    slug: 'half-saree',
    title: 'Half Saree',
    blurb: 'Langa voni ceremonies: colour, ritual and a little swagger.',
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
    root: DRIVE_ROOT,
    src: [
      '7 Graduation/341A0837_1.jpg',
      '7 Graduation/Main.jpg',
      '7 Graduation/341A0477.jpg',
      '7 Graduation/DSC04589.jpg',
      '7 Graduation/341A0714.jpg',
      '7 Graduation/DSC04593.jpg',
      '7 Graduation/341A0597.jpg',
      '7 Graduation/341A0496.jpg',
      '7 Graduation/DSC04663.jpg',
      '7 Graduation/DSC04561.jpg',
      '7 Graduation/1.jpg',
    ],
  },
  {
    slug: 'matrimony',
    title: 'Matrimony Photoshoots',
    blurb: 'Portraits that actually look like you, for the profile that matters.',
    icon: 'ring',
    src: [
      'matrimony-photoshoots/1.jpg',
      'matrimony-photoshoots/11.jpg',
      'matrimony-photoshoots/2.jpg',
      'matrimony-photoshoots/3.jpg',
      'matrimony-photoshoots/5.jpg',
      'matrimony-photoshoots/7.jpg',
      // The rest of the set, straight from the Drive export.
      'drive:Matrimony/',
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

/** Entries may name their own tree with a `drive:` or `legacy:` prefix. */
function resolveSrc(rel, collectionRoot) {
  if (rel.startsWith('drive:')) return path.join(DRIVE_ROOT, rel.slice(6))
  if (rel.startsWith('legacy:')) return path.join(PHOTOS, rel.slice(7))
  return path.join(collectionRoot ?? PHOTOS, rel)
}

const IMAGE = /\.(jpe?g|png|webp|tiff?|heic)$/i

/** Compare folder names loosely: case, spacing and punctuation all vary. */
const key = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

/**
 * Find a folder by exact path, else by name alone. The Drive export prefixes
 * each folder with a running number that shifts as sets are added, so
 * `drive:Housewarming/` still finds `2 House Warming`.
 */
function resolveDir(dir) {
  if (existsSync(dir)) return dir
  const parent = path.dirname(dir)
  if (!existsSync(parent)) return null
  const want = key(path.basename(dir))
  const hit = readdirSync(parent, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .find((e) => key(e.name).replace(/^\d+/, '').includes(want))
  return hit ? path.join(parent, hit.name) : null
}

/** Turn a collection's `src` list into real files, expanding any folders. */
function expandSrc(list, collectionRoot) {
  const files = []
  const seen = new Set()
  const add = (file) => {
    if (seen.has(file)) return
    seen.add(file)
    files.push(file)
  }

  for (const rel of list) {
    if (!rel.endsWith('/')) {
      const file = resolveSrc(rel, collectionRoot)
      if (existsSync(file)) add(file)
      else console.warn(`  ! missing ${rel}`)
      continue
    }

    const dir = resolveDir(resolveSrc(rel.slice(0, -1), collectionRoot))
    if (!dir) {
      console.warn(`  ! no folder matching ${rel}`)
      continue
    }
    readdirSync(dir)
      .filter((n) => IMAGE.test(n))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .forEach((n) => add(path.join(dir, n)))
  }

  return files
}

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

  // 20px blur seed, inlined as a data URI, cheap enough to ship in the bundle.
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
    const sources = expandSrc(c.src, c.root)
    for (const file of sources) {
      photos.push(await render(file, c.slug, photos.length + 1))
      process.stdout.write(`\r  ${c.slug} ${photos.length}/${sources.length}   `)
    }
    console.log(`\r  ${c.slug.padEnd(18)} ${photos.length} frames`)
    const { src, root, ...rest } = c
    void root
    collections.push({ ...rest, photos })
  }

  await mkdir(path.join(OUT_DIR, 'hero'), { recursive: true })
  const hero = []
  for (const [i, name] of HERO.entries()) {
    const file = path.join(HERO_ROOT, name)
    if (!existsSync(file)) {
      console.warn(`  ! missing hero/${name}`)
      continue
    }
    hero.push(await render(file, 'hero', i + 1))
    process.stdout.write(`\r  hero ${hero.length}/${HERO.length}   `)
  }
  console.log(`\r  ${'hero'.padEnd(18)} ${hero.length} frames`)

  await writeFile(MANIFEST, JSON.stringify({ collections, hero }, null, 2) + '\n')
  console.log(`\nWrote ${MANIFEST}`)
}

main()
