import { useRef } from 'react'
import { motion } from 'framer-motion'
import { HeroCarousel } from './HeroCarousel'
import { Wordmark } from './Wordmark'
import { useGSAP } from '../hooks/useGSAP'
import { gsap, ease, prefersReducedMotion } from '../lib/gsap'
import { brand } from '../data/site'

const enter = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 * i, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      // Corner sweeps drift apart and the whole hero eases back as you leave it.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
          },
        })
        .to('[data-sweep="left"]', { xPercent: -10, yPercent: -18, ease: 'none' }, 0)
        .to('[data-sweep="right"]', { xPercent: 10, yPercent: -14, ease: 'none' }, 0)
        .to('[data-hero-copy]', { yPercent: -22, opacity: 0.25, ease: 'none' }, 0)
        .to('[data-hero-stage]', { yPercent: -8, scale: 0.94, ease: 'none' }, 0)

      // Slow idle float on the sweeps keeps the page alive while it sits still.
      gsap.to('[data-sweep="left"]', {
        yPercent: 2.5,
        duration: 11,
        ease: ease.inOut,
        repeat: -1,
        yoyo: true,
      })
      gsap.to('[data-sweep="right"]', {
        xPercent: -2.5,
        duration: 13,
        ease: ease.inOut,
        repeat: -1,
        yoyo: true,
      })
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      className="relative overflow-hidden pb-10 pt-14 sm:pb-14 md:pt-24"
    >
      {/* Brand-gradient corner sweeps, lifted from the logo's swirl. */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <svg
          viewBox="0 0 1440 640"
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-0 h-[46vw] max-h-[640px] w-full"
        >
          <defs>
            <linearGradient id="sweepL" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#C4390C" />
              <stop offset="42%" stopColor="#EF7702" />
              <stop offset="82%" stopColor="#FFB427" />
              <stop offset="100%" stopColor="#FFC64D" />
            </linearGradient>
            <linearGradient id="sweepR" x1="1" y1="0" x2="0.1" y2="1">
              <stop offset="0%" stopColor="#B41A08" />
              <stop offset="48%" stopColor="#E56A03" />
              <stop offset="100%" stopColor="#FFB01A" />
            </linearGradient>
          </defs>
          <path
            data-sweep="left"
            d="M0,0 H492 C404,132 236,246 0,318 Z"
            fill="url(#sweepL)"
          />
          <path
            data-sweep="right"
            d="M1440,0 H846 C964,150 1140,300 1440,404 Z"
            fill="url(#sweepR)"
          />
        </svg>

        {/* Warm halo sitting behind the coverflow. */}
        <div className="absolute left-1/2 top-[48%] h-[44vw] w-[62vw] -translate-x-1/2 rounded-full bg-saffron/15 blur-[90px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-shell" />
      </div>

      {/* Header lockup only — no navigation, by design. */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="edge absolute inset-x-0 top-0 z-20 hidden h-24 items-center md:flex md:pl-[5%]"
      >
        <Wordmark />
      </motion.div>

      <div data-hero-copy className="edge relative z-10 flex flex-col items-center">
        <motion.div variants={enter} custom={0} initial="hidden" animate={ready ? 'show' : 'hidden'}>
          <Wordmark size="lg" />
        </motion.div>

        <motion.p
          variants={enter}
          custom={1}
          initial="hidden"
          animate={ready ? 'show' : 'hidden'}
          className="mt-5 max-w-xl text-balance text-center text-[clamp(0.95rem,1.6vw,1.15rem)] leading-relaxed text-ink-soft"
        >
          {brand.tagline[0]}
          <br className="hidden sm:block" /> {brand.tagline[1]}
        </motion.p>
      </div>

      <motion.div
        data-hero-stage
        variants={enter}
        custom={2}
        initial="hidden"
        animate={ready ? 'show' : 'hidden'}
        className="relative z-10 mt-6 sm:mt-8"
      >
        <HeroCarousel />
      </motion.div>
    </section>
  )
}
