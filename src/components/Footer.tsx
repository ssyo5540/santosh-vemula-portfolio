import { useRef } from 'react'
import { useGSAP } from '../hooks/useGSAP'
import { gsap, ease, prefersReducedMotion } from '../lib/gsap'
import { brand } from '../data/site'

/**
 * The wave used to be a page-coloured shape painted over the gradient. That
 * only works while the page behind it is a flat colour; against the warm
 * backdrop it seamed. So the gradient is masked into the wave instead, and
 * the real page shows through above it.
 *
 * Two mask layers: the wave across the top strip, and a solid block for
 * everything below it.
 */
const WAVE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none' viewBox='0 0 1440 120'%3E%3Cpath d='M0,98 C360,22 1080,2 1440,70 L1440,120 L0,120 Z' fill='%23fff'/%3E%3C/svg%3E\")"

const WAVE_H = 'max(54px, 9vw)'

const maskStyle = {
  maskImage: `${WAVE}, linear-gradient(#000, #000)`,
  WebkitMaskImage: `${WAVE}, linear-gradient(#000, #000)`,
  // The extra pixel closes the hairline where the two layers meet.
  maskSize: `100% ${WAVE_H}, 100% calc(100% - ${WAVE_H} + 1px)`,
  WebkitMaskSize: `100% ${WAVE_H}, 100% calc(100% - ${WAVE_H} + 1px)`,
  maskPosition: 'top, bottom',
  WebkitMaskPosition: 'top, bottom',
  maskRepeat: 'no-repeat, no-repeat',
  WebkitMaskRepeat: 'no-repeat, no-repeat',
} as const

export function Footer() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      gsap.from('[data-credo] > *', {
        y: 26,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: ease.out,
        scrollTrigger: { trigger: '[data-credo]', start: 'top 95%' },
      })

      gsap.from('[data-footer-body] > *', {
        y: 34,
        opacity: 0,
        duration: 0.9,
        stagger: 0.09,
        ease: ease.expo,
        scrollTrigger: { trigger: '[data-footer-body]', start: 'top 97%' },
      })
    },
    { scope: root },
  )

  return (
    <footer ref={root} className="relative bg-swirl" style={maskStyle}>
      {/* Clears the masked wave strip so no content lands inside the curve. */}
      <div style={{ height: WAVE_H }} aria-hidden />

      <div className="edge pb-10 pt-2 sm:pb-14">
        {/* The credo strip, exactly as it sits under the fold in the design. */}
        <div
          data-credo
          className="flex items-center justify-center gap-2 xs:gap-3 sm:gap-6"
          aria-label="Real people, real moments, timeless stories"
        >
          <span className="hidden h-px w-10 bg-white/45 sm:block lg:w-24" />
          {brand.credo.map((word, i) => (
            <span key={word} className="flex items-center gap-2 xs:gap-3 sm:gap-6">
              {i > 0 && <span className="text-white/45">/</span>}
              <span className="whitespace-nowrap text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-white/85 xs:text-[0.58rem] xs:tracking-eyebrow sm:text-[0.7rem]">
                {word}
              </span>
            </span>
          ))}
          <span className="hidden h-px w-10 bg-white/45 sm:block lg:w-24" />
        </div>

        <div className="mx-auto mt-14 h-px max-w-5xl bg-white/20" />

        <div
          data-footer-body
          className="mx-auto mt-12 flex max-w-5xl flex-col items-center text-center"
        >
          <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 shadow-lift">
            <img src="/logo.png" alt="" width={512} height={512} className="h-11 w-11" />
          </span>

          <h2 className="headline mt-6 text-[clamp(1.8rem,4.6vw,3rem)] text-white">
            Let&rsquo;s tell your story
          </h2>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75">
            Weddings, housewarmings, seemantham, graduations. If it matters to you, it is
            worth filming properly.
          </p>

          <div className="mt-8">
            <a
              href={`mailto:${brand.email}`}
              className="inline-block rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-vermilion transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lift"
            >
              {brand.email}
            </a>
          </div>

          <p className="mt-12 text-[0.7rem] text-white/60">
            © {new Date().getFullYear()} {brand.name} {brand.by}. All photographs and films
            are the property of the studio.
          </p>
        </div>
      </div>
    </footer>
  )
}
