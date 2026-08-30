import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FilmCard } from './FilmCard'
import { FilmModal } from './FilmModal'
import { films, type Film } from '../data/videos'

/** The full catalogue with its tag filter. Self-contained, player included. */
export function FilmLibrary() {
  const [playing, setPlaying] = useState<Film | null>(null)
  const [filter, setFilter] = useState('All')

  const tags = useMemo(
    () => ['All', ...Array.from(new Set(films.flatMap((f) => f.tags))).sort()],
    [],
  )
  const library = useMemo(
    () => (filter === 'All' ? films : films.filter((f) => f.tags.includes(filter))),
    [filter],
  )

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            aria-pressed={filter === tag}
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

      <p className="mt-5 text-xs text-muted">
        {library.length} of {films.length} films
      </p>

      <motion.div
        layout
        className="mt-8 grid grid-cols-1 gap-x-5 gap-y-9 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
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

      <FilmModal film={playing} onClose={() => setPlaying(null)} />
    </div>
  )
}
