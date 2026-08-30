import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionHeading } from './SectionHeading'
import { FilmCard } from './FilmCard'
import { FilmModal } from './FilmModal'
import { ArrowRight } from './icons'
import { useGSAP } from '../hooks/useGSAP'
import { gsap, ease, prefersReducedMotion } from '../lib/gsap'
import { films, featuredFilms, type Film } from '../data/videos'

export function FeaturedFilms() {
  const root = useRef<HTMLElement>(null)
  const [playing, setPlaying] = useState<Film | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [filter, setFilter] = useState('All')

  const tags = useMemo(
    () => ['All', ...Array.from(new Set(films.flatMap((f) => f.tags))).sort()],
    [],
  )
  const library = useMemo(
    () => (filter === 'All' ? films : films.filter((f) => f.tags.includes(filter))),
    [filter],
  )

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('[data-film-card]', {
        y: 64,
        opacity: 0,
        duration: 1,
        stagger: 0.11,
        ease: ease.expo,
        scrollTrigger: { trigger: '[data-film-grid]', start: 'top 85%' },
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="films" className="edge relative bg-linen/45 py-20 sm:py-28">
      <SectionHeading
        eyebrow="Featured Videos"
        title="Watch Our Stories"
        action={
          <button
            onClick={() => setExpanded((v) => !v)}
            className="group inline-flex items-center gap-2 text-sm font-medium text-ember transition-colors hover:text-vermilion"
          >
            {expanded ? 'Show less' : 'View all videos'}
            <ArrowRight
              className={`h-4 w-4 transition-transform duration-500 ${
                expanded ? '-rotate-90' : 'group-hover:translate-x-1.5'
              }`}
            />
          </button>
        }
      />

      <div
        data-film-grid
        className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 xs:grid-cols-2 lg:grid-cols-4"
      >
        {featuredFilms.map((film) => (
          <div data-film-card key={film.id}>
            <FilmCard film={film} onPlay={setPlaying} />
          </div>
        ))}
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="library"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="hairline my-12" />

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilter(tag)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-300 ${
                    filter === tag
                      ? 'border-transparent bg-swirl text-white shadow-frame'
                      : 'border-sand text-ink-soft hover:border-ember hover:text-ember'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <motion.div
              layout
              className="mt-8 grid grid-cols-1 gap-x-5 gap-y-8 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {library.map((film) => (
                  <motion.div
                    key={film.id}
                    layout
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.35 }}
                  >
                    <FilmCard film={film} onPlay={setPlaying} compact />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <p className="mt-8 text-xs text-muted">
              {library.length} of {films.length} films
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <FilmModal film={playing} onClose={() => setPlaying(null)} />
    </section>
  )
}
