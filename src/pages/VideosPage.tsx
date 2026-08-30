import { useEffect, useState } from 'react'
import { MotionConfig, motion } from 'framer-motion'
import { Backdrop } from '../components/Backdrop'
import { Preloader } from '../components/Preloader'
import { ScrollProgress } from '../components/ScrollProgress'
import { SectionHeading } from '../components/SectionHeading'
import { FilmLibrary } from '../components/FilmLibrary'
import { Footer } from '../components/Footer'
import { ArrowRight } from '../components/icons'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import { paths } from '../lib/paths'
import { brand } from '../data/site'
import { films } from '../data/videos'

const MAX_HOLD_MS = 1200

export default function VideosPage() {
  const [ready, setReady] = useState(false)
  useSmoothScroll()

  useEffect(() => {
    const reveal = () => setReady(true)
    const cap = window.setTimeout(reveal, MAX_HOLD_MS)
    if (document.readyState === 'complete') {
      const soon = window.setTimeout(reveal, 350)
      return () => {
        window.clearTimeout(cap)
        window.clearTimeout(soon)
      }
    }
    window.addEventListener('load', reveal, { once: true })
    return () => {
      window.clearTimeout(cap)
      window.removeEventListener('load', reveal)
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <Backdrop />
      <Preloader done={ready} />
      <ScrollProgress />

      <main className="relative overflow-hidden pb-8 pt-8 sm:pt-10">
        {/* The same top-left sweep as the home page, so the pages feel of a piece. */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
          <svg
            viewBox="0 0 1440 640"
            preserveAspectRatio="none"
            className="absolute inset-x-0 top-0 h-[26vw] max-h-[360px] w-full"
          >
            <defs>
              <linearGradient id="sweepArchive" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#C4390C" />
                <stop offset="42%" stopColor="#EF7702" />
                <stop offset="82%" stopColor="#FFB427" />
                <stop offset="100%" stopColor="#FFC64D" />
              </linearGradient>
            </defs>
            <path d="M0,0 H336 C276,92 162,172 0,222 Z" fill="url(#sweepArchive)" />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="edge relative z-10"
        >
          <a
            href={paths.home}
            className="group inline-flex items-center gap-2 text-sm font-medium text-ink-soft transition-colors hover:text-vermilion"
          >
            <ArrowRight className="h-4 w-4 rotate-180 transition-transform duration-500 group-hover:-translate-x-1.5" />
            Back to {brand.name}
          </a>
        </motion.div>

        <div className="edge relative z-10 pt-[max(4rem,11vw)]">
          <SectionHeading eyebrow="The Full Catalogue" title="Every Film We've Made" />

          <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-ink-soft">
            {films.length} films: wedding and event stories, short films, music videos and
            commercial work. Filter by kind, then tap any frame to watch.
          </p>

          <div className="mt-12">
            <FilmLibrary />
          </div>
        </div>
      </main>

      <Footer />
    </MotionConfig>
  )
}
