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
import { pathToFileURL } from 'node:url'
import { existsSync } from 'node:fs'
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
 */
const COLLECTIONS = [
  ,
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
  ,
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
  ,
  {
    slug: 'housewarmings',
    title: 'Housewarmings',
    blurb: 'Gruhapravesam: first lamp, first meal, first memory.',
    icon: 'home',
    src: [
      'drive:3 Housewarmings/Main.jpg',
      'drive:3 Housewarmings/1.jpg',
      'drive:3 Housewarmings/10.jpg',
      'drive:3 Housewarmings/11.jpg',
      'drive:3 Housewarmings/12.jpg',
      'drive:3 Housewarmings/13.jpg',
      'drive:3 Housewarmings/14.jpg',
      'drive:3 Housewarmings/15.jpg',
      'drive:3 Housewarmings/16.jpg',
      'drive:3 Housewarmings/17.jpg',
      'drive:3 Housewarmings/18.jpg',
      'drive:3 Housewarmings/19.jpg',
      'drive:3 Housewarmings/2.1.jpg',
      'drive:3 Housewarmings/3.jpg',
      'drive:3 Housewarmings/4.jpg',
      'drive:3 Housewarmings/5.jpg',
      'drive:3 Housewarmings/6.jpg',
      'drive:3 Housewarmings/7.5.jpg',
      'drive:3 Housewarmings/7.jpg',
      'drive:3 Housewarmings/8.jpg',
      'drive:3 Housewarmings/9.5.jpg',
      'drive:3 Housewarmings/9.jpg',
      'drive:3 Housewarmings/DJI_0145.jpg',
      'drive:3 Housewarmings/DSC00566.jpg',
      'drive:3 Housewarmings/DSC00640.jpg',
      'drive:3 Housewarmings/DSC00652.jpg',
      'drive:3 Housewarmings/DSC00675.jpg',
      'drive:3 Housewarmings/DSC00749.jpg',
      'drive:3 Housewarmings/DSC00910.jpg',
      'drive:3 Housewarmings/DSC01091.jpg',
      'drive:3 Housewarmings/DSC01115.jpg',
      'drive:3 Housewarmings/DSC01133.jpg',
      'drive:3 Housewarmings/DSC01215.jpg',
      'drive:3 Housewarmings/DSC01279.jpg',
      'drive:3 Housewarmings/DSC03304.jpg',
      'drive:3 Housewarmings/DSC03503.jpg',
      'drive:3 Housewarmings/DSC03667.jpg',
      'drive:3 Housewarmings/DSC04108.jpg',
      'drive:3 Housewarmings/DSC04303.jpg',
      'drive:3 Housewarmings/DSC04395.jpg',
      'drive:3 Housewarmings/DSC04893.jpg',
      'drive:3 Housewarmings/DSC05078.jpg',
      'drive:3 Housewarmings/DSC05084.jpg',
      'drive:3 Housewarmings/DSC05184.jpg',
      'drive:3 Housewarmings/DSC05268.jpg',
      'drive:3 Housewarmings/DSC05304.jpg',
      'drive:3 Housewarmings/DSC05379.jpg',
      'drive:3 Housewarmings/DSC06290.jpg',
      'drive:3 Housewarmings/DSC06299.jpg',
      'drive:3 Housewarmings/DSC06302.jpg',
      'drive:3 Housewarmings/DSC06371.jpg',
      'drive:3 Housewarmings/DSC06372.jpg',
      'drive:3 Housewarmings/DSC06395.jpg',
      'drive:3 Housewarmings/DSC06398.jpg',
      'drive:3 Housewarmings/DSC06411.jpg',
      'drive:3 Housewarmings/DSC06414.jpg',
      'drive:3 Housewarmings/DSC06446.jpg',
      'drive:3 Housewarmings/DSC06502.jpg',
      'drive:3 Housewarmings/DSC06546.jpg',
      'drive:3 Housewarmings/DSC06564.jpg',
      'drive:3 Housewarmings/DSC06701.jpg',
      'drive:3 Housewarmings/DSC06746.jpg',
      'drive:3 Housewarmings/DSC06765.jpg',
      'drive:3 Housewarmings/DSC06904.jpg',
      'drive:3 Housewarmings/DSC06927.jpg',
      'drive:3 Housewarmings/DSC07141.jpg',
      'drive:3 Housewarmings/DSC07230.jpg',
      'drive:3 Housewarmings/DSC07342.jpg',
      'drive:3 Housewarmings/DSC07582.jpg',
      'drive:3 Housewarmings/DSC07615.jpg',
      'drive:3 Housewarmings/DSC07742.jpg',
      'drive:3 Housewarmings/DSC07811.jpg',
      'drive:3 Housewarmings/DSC08723.jpg',
      'drive:3 Housewarmings/DSC08724.jpg',
      'drive:3 Housewarmings/DSC08744.jpg',
      'drive:3 Housewarmings/DSC08776.jpg',
      'drive:3 Housewarmings/DSC08866.jpg',
      'drive:3 Housewarmings/DSC08884.jpg',
      'drive:3 Housewarmings/DSC08890.jpg',
      'drive:3 Housewarmings/DSC08927.jpg',
      'drive:3 Housewarmings/DSC08950.jpg',
    ],
  },
  ,
  {
    slug: 'seemantham',
    title: 'Seemantham',
    blurb: 'Baby showers and bump portraits, glowing and unhurried.',
    icon: 'lotus',
    src: [
      'drive:5 Baby Showers-Seemantham/Main.jpg',
      'drive:5 Baby Showers-Seemantham/2.jpg',
      'drive:5 Baby Showers-Seemantham/341A9576.jpg',
      'drive:5 Baby Showers-Seemantham/341A9594.jpg',
      'drive:5 Baby Showers-Seemantham/341A9602.jpg',
      'drive:5 Baby Showers-Seemantham/AKI09323.jpg',
      'drive:5 Baby Showers-Seemantham/DSC00002.jpg',
      'drive:5 Baby Showers-Seemantham/DSC00004.jpg',
      'drive:5 Baby Showers-Seemantham/DSC00020.jpg',
      'drive:5 Baby Showers-Seemantham/DSC00023.jpg',
      'drive:5 Baby Showers-Seemantham/DSC00028.jpg',
      'drive:5 Baby Showers-Seemantham/DSC00052.jpg',
      'drive:5 Baby Showers-Seemantham/DSC00060.jpg',
      'drive:5 Baby Showers-Seemantham/DSC00300.jpg',
      'drive:5 Baby Showers-Seemantham/DSC00310.jpg',
      'drive:5 Baby Showers-Seemantham/DSC00356.jpg',
      'drive:5 Baby Showers-Seemantham/DSC00357.jpg',
      'drive:5 Baby Showers-Seemantham/DSC01557.jpg',
      'drive:5 Baby Showers-Seemantham/DSC01620.jpg',
      'drive:5 Baby Showers-Seemantham/DSC01832.jpg',
      'drive:5 Baby Showers-Seemantham/DSC01846.jpg',
      'drive:5 Baby Showers-Seemantham/DSC01857.jpg',
      'drive:5 Baby Showers-Seemantham/DSC01873.jpg',
      'drive:5 Baby Showers-Seemantham/DSC01982.jpg',
      'drive:5 Baby Showers-Seemantham/DSC02095.jpg',
      'drive:5 Baby Showers-Seemantham/DSC04429.jpg',
      'drive:5 Baby Showers-Seemantham/DSC04473.jpg',
      'drive:5 Baby Showers-Seemantham/DSC05369.jpg',
      'drive:5 Baby Showers-Seemantham/DSC05372.jpg',
      'drive:5 Baby Showers-Seemantham/DSC05439.jpg',
      'drive:5 Baby Showers-Seemantham/DSC05445.jpg',
      'drive:5 Baby Showers-Seemantham/DSC05691.jpg',
      'drive:5 Baby Showers-Seemantham/DSC05756.jpg',
      'drive:5 Baby Showers-Seemantham/DSC05761.jpg',
      'drive:5 Baby Showers-Seemantham/DSC09979.jpg',
      'drive:5 Baby Showers-Seemantham/DSC09983.jpg',
      'drive:5 Baby Showers-Seemantham/DSC09992.jpg',
      'drive:5 Baby Showers-Seemantham/DSC09998.jpg',
    ],
  },
  ,
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
  ,
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
  ,
  {
    slug: 'matrimony',
    title: 'Matrimony Photoshoots',
    blurb: 'Portraits that actually look like you, for the profile that matters.',
    icon: 'ring',
    src: [
      'drive:8 Matrimony Photoshoots/Main.jpg',
      'drive:8 Matrimony Photoshoots/DSC09122.jpg',
      'drive:8 Matrimony Photoshoots/DSC09140.jpg',
      'drive:8 Matrimony Photoshoots/DSC09157.jpg',
      'drive:8 Matrimony Photoshoots/DSC09182.jpg',
      'drive:8 Matrimony Photoshoots/DSC09200.jpg',
      'drive:8 Matrimony Photoshoots/DSC09241.jpg',
      'drive:8 Matrimony Photoshoots/DSC09284.jpg',
      'drive:8 Matrimony Photoshoots/DSC09297.jpg',
      'drive:8 Matrimony Photoshoots/DSC09314.jpg',
      'drive:8 Matrimony Photoshoots/DSC09316.jpg',
      'drive:8 Matrimony Photoshoots/DSC09329.jpg',
    ],
  },
  ,
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
    for (const [i, rel] of c.src.entries()) {
      const file = resolveSrc(rel, c.root)
      if (!existsSync(file)) {
        console.warn(`  ! missing ${rel}`)
        continue
      }
      photos.push(await render(file, c.slug, i + 1))
      process.stdout.write(`\r  ${c.slug} ${photos.length}/${c.src.length}   `)
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

// Only run when invoked directly. main() clears the output directory, so a
// stray `import` of this module would delete every rendition.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
}
