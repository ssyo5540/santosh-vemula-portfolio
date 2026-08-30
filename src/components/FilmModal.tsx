import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Close } from './icons'
import type { Film } from '../data/videos'

/** Full-bleed player. Uses youtube-nocookie so a visit here isn't tracked. */
export function FilmModal({ film, onClose }: { film: Film | null; onClose: () => void }) {
  useEffect(() => {
    if (!film) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [film, onClose])

  return (
    <AnimatePresence>
      {film && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={film.title}
          className="fixed inset-0 z-[90] grid place-items-center bg-ink/95 p-4 backdrop-blur-md sm:p-8"
        >
          <button
            onClick={onClose}
            aria-label="Close player"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white/80 transition hover:border-white hover:text-white sm:right-8 sm:top-8"
          >
            <Close className="h-5 w-5" />
          </button>

          <motion.div
            initial={{ scale: 0.94, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 200, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl"
          >
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-lift">
              <iframe
                src={
                  film.source === 'drive'
                    ? `https://drive.google.com/file/d/${film.id}/preview`
                    : `https://www.youtube-nocookie.com/embed/${film.id}?autoplay=1&rel=0&modestbranding=1`
                }
                title={film.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
            <p className="mt-4 font-display text-lg text-white/90">{film.title}</p>
            <p className="mt-1 text-xs uppercase tracking-eyebrow text-saffron">
              {film.tags.join(' / ')}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
