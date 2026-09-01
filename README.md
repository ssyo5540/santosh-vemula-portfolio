# Pixels by Santosh Vemula

Portfolio site for the studio. A scroll-driven, warm-toned build of the supplied
mockup: hero coverflow, featured films, and the event-category grid, closing on the
gradient wave and the *Real People / Real Moments / Timeless Stories* strip.

There is no navigation bar by design. Two pages:

| Page        | Route      | Source                       |
| ----------- | ---------- | ---------------------------- |
| Home        | `/`        | `src/App.tsx`                |
| All films   | `/videos/` | `src/pages/VideosPage.tsx`   |

Both are real HTML entry points in the Vite build (`index.html` and
`videos/index.html`), so deep links work on any static host with no SPA fallback
rule to configure. They share the same JS chunks, so moving between them is a warm
cache hit. Links are built off `import.meta.env.BASE_URL` (`src/lib/paths.ts`), so
they survive a sub-path deploy.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production bundle into dist/
npm run preview    # serve the built bundle
```

## Palette

Every colour is sampled from the brand mark (`public/logo.png`). The swirl runs from
saffron through orange into deep maroon, and that gradient is reused for the hero
sweep, the footer wave, and every accent rule.

| Token       | Hex       | Where it lands                       |
| ----------- | --------- | ------------------------------------ |
| `saffron`   | `#FFA000` | Lightest point of the swirl, accents |
| `amber`     | `#F78B01` | Gradient midpoint                    |
| `orange`    | `#EF7702` | Buttons, hover states                |
| `ember`     | `#E1591A` | Eyebrows, links                      |
| `vermilion` | `#C02907` | Hover text, focus ring               |
| `crimson`   | `#B10D08` | Deep end of the gradient             |
| `maroon`    | `#AA0009` | Darkest stop                         |
| `shell`     | `#FDF8F1` | Page background                      |
| `linen`     | `#F8F0E4` | Alternating section band             |
| `sand`      | `#EFE3D2` | Hairlines, inactive dots             |
| `ink`       | `#241309` | Body text                            |

Type is Playfair Display for display copy and Inter for everything else, both from
Google Fonts.

The PIXEL STORIES logotype in the hero (`src/components/Wordmark.tsx`) is set as live
text in Poppins ExtraBold, with "STORIES" hollowed out via `-webkit-text-stroke`,
rather than shipped as an image. That keeps it sharp at any size, lets it scale with
the viewport and leaves it selectable and readable to search engines. To use the
original artwork instead, drop the file in `public/` and swap the two `<span>`s in
that component for an `<img>`; the surrounding layout does not change.

## Motion

Two libraries, split by what each is good at.

**GSAP** (with `ScrollTrigger` and `SplitText`) owns anything tied to scroll position:

- `SectionHeading`: headlines split into words and swept up behind a mask; the eyebrow
  rule draws itself out from the left.
- `Hero`: the top-left sweep parallaxes out on scrub while the copy recedes; a slow
  idle float keeps the page alive when it is sitting still.
- `Categories`: a grid-aware stagger, plus a per-card cover parallax inside each frame.
- `Footer`: the wave is a shell-coloured cut-out whose path is morphed on `attr: { d }`,
  so the gradient appears to rise into place.

**Framer Motion** owns state and gesture:

- The hero coverflow (spring-driven 3D transforms, drag-to-throw, autoplay, keyboard).
- The film library's filter chips and `layout` reflow on the `/videos/` page.
- Modals, the lightbox, the preloader curtain and the scroll-progress hairline.

**Lenis** provides inertial scrolling, driven off the GSAP ticker (`src/hooks/useSmoothScroll.ts`)
so smoothing and ScrollTrigger never disagree about where the page is.

`prefers-reduced-motion` is honoured throughout: every GSAP timeline bails out early and
`MotionConfig reducedMotion="user"` drops Framer to opacity-only transitions.

## Content

Everything editorial lives in two files.

- `src/data/site.ts`: brand name, tagline, credo, contact details, hero running order.
- `src/data/videos.ts`: the YouTube catalogue (ids, titles, runtimes, tags). Titles and
  runtimes were read from YouTube; thumbnails are served from `i.ytimg.com`, and the
  player embeds via `youtube-nocookie.com`.

Photographs are curated from the studio's existing library. `scripts/prepare-assets.mjs`
resizes the chosen originals into 800w/1600w WebP renditions under `public/gallery`,
and writes `src/data/gallery.json` with dimensions plus a 20px inline blur seed per
frame so images blur up rather than pop in.

To re-curate, edit the `COLLECTIONS` array in that script and run:

```bash
SOURCE_ROOT="/path/to/public_html" npm run assets
```

## Deploying

The build is a static bundle in `dist/` (`index.html` plus `videos/index.html`), so
any static host will do.

**Hostinger, at santoshvemula.com/events:**

```bash
npm run build:events
```

Upload the *contents* of `dist/` into `public_html/events/`. Zipping the contents and
extracting them in Hostinger's file manager beats uploading ~200 files by hand.

**Root of a domain, or anywhere else:**

```bash
npm run build
```

Sub-path deploys need `VITE_BASE`, which sets Vite's `base` and, through
`src/lib/paths.ts`, every runtime asset URL too. That second part matters: Vite
rewrites asset references it can see statically, but the gallery manifest is JSON
read at runtime, so its ~420 paths and the logo would otherwise stay root-absolute
and 404 under a sub-path.

`public/.htaccess` ships with the build: compression, a year on the content-hashed
assets, a month on photos, and no-cache on HTML so a redeploy actually reaches
returning visitors. It deliberately contains no SPA rewrite — both pages are real
HTML files.

If the sub-path ever changes, update `build:events` in `package.json` and the
absolute `og:image` URLs in `index.html` and `videos/index.html`.

## Licences

Application code here is the studio's. Third-party runtime dependencies:

| Package         | Licence                                                    |
| --------------- | ---------------------------------------------------------- |
| react, react-dom | MIT                                                        |
| framer-motion   | MIT                                                        |
| lenis           | MIT                                                        |
| tailwindcss     | MIT                                                        |
| vite, postcss, autoprefixer | MIT                                            |
| typescript      | Apache-2.0                                                 |
| sharp (build only) | Apache-2.0                                              |
| gsap            | GSAP Standard "no charge" licence, see https://gsap.com/standard-license |

GSAP is not MIT. It ships under Webflow's standard licence, which covers this use at no
charge and (from v3.13) includes the formerly Club-only plugins such as `SplitText`.
Read the linked terms before using it in a product you resell.

Photographs and films are the property of the studio and are not covered by any of the
above.
