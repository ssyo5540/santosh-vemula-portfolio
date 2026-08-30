/**
 * Page ground. Flat cream read as cheap, so this layers three things behind
 * everything: warm light washes drawn from the brand gradient, a fine film
 * grain to give the paper some tooth, and a soft vignette to settle the edges.
 *
 * Deliberately gradients-and-a-tile only. An earlier pass used big blurred
 * orbs and a mix-blend grain, which forced the whole fixed layer to
 * recomposite against the page on every scroll frame and stalled painting.
 * Radial gradients cost nothing by comparison and read the same.
 */

// feTurbulence rendered into a small tile, inlined so it costs no request.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const WASHES = [
  'radial-gradient(75rem 48rem at 6% -12%, rgba(255, 160, 0, 0.20), transparent 60%)',
  'radial-gradient(58rem 40rem at 98% 4%, rgba(192, 41, 7, 0.09), transparent 58%)',
  'radial-gradient(85rem 58rem at 46% 46%, rgba(255, 176, 26, 0.09), transparent 64%)',
  'radial-gradient(62rem 42rem at 2% 88%, rgba(225, 89, 26, 0.08), transparent 60%)',
  'radial-gradient(55rem 38rem at 100% 96%, rgba(255, 160, 0, 0.10), transparent 60%)',
].join(', ')

const VIGNETTE =
  'radial-gradient(125% 105% at 50% 38%, transparent 52%, rgba(36, 19, 9, 0.09) 100%)'

export function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-50 bg-shell" aria-hidden>
      <div className="absolute inset-0" style={{ backgroundImage: WASHES }} />
      <div className="absolute inset-0" style={{ backgroundImage: VIGNETTE }} />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: GRAIN, backgroundSize: '160px 160px' }}
      />
    </div>
  )
}
