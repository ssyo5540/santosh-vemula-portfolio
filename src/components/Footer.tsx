import { useRef } from 'react'
import { useGSAP } from '../hooks/useGSAP'
import { gsap, ease, prefersReducedMotion } from '../lib/gsap'
import { brand } from '../data/site'

export function Footer() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      // The cut-out starts flat and peels back, so the gradient appears to rise.
      gsap.from('[data-wave] path', {
        attr: { d: 'M0,-4 H1440 V120 C1080,120 360,120 0,120 Z' },
        duration: 1.4,
        ease: ease.expo,
        scrollTrigger: { trigger: root.current, start: 'top 92%' },
      })

      gsap.from('[data-credo] > *', {
        y: 26,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: ease.out,
        scrollTrigger: { trigger: '[data-credo]', start: 'top 92%' },
      })

      gsap.from('[data-footer-body] > *', {
        y: 34,
        opacity: 0,
        duration: 0.9,
        stagger: 0.09,
        ease: ease.expo,
        scrollTrigger: { trigger: '[data-footer-body]', start: 'top 95%' },
      })
    },
    { scope: root },
  )

  return (
    /* One gradient runs the full height; the wave is a shell-coloured bite out of its top. */
    <footer ref={root} className="relative bg-swirl">
      <svg
        data-wave
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden
        className="block h-[9vw] min-h-[54px] w-full"
      >
        <path d="M0,-4 H1440 V70 C1080,2 360,22 0,98 Z" fill="#FDF8F1" />
      </svg>

      <div>
        <div className="edge pb-10 pt-4 sm:pb-14">
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
              Weddings, housewarmings, seemantham, graduations — if it matters to you, it is
              worth filming properly.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
              <a
                href={`mailto:${brand.email}`}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-vermilion transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lift"
              >
                {brand.email}
              </a>
              <a
                href={`tel:${brand.phoneHref}`}
                className="rounded-full border border-white/55 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/10"
              >
                {brand.phone}
              </a>
            </div>

            <p className="mt-12 text-[0.7rem] text-white/60">
              © {new Date().getFullYear()} {brand.name} {brand.by}. All photographs and films
              are the property of the studio.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
