import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Frame } from './Frame'
import { ChevronLeft, ChevronRight, Close } from './icons'
import type { Collection } from '../data/site'

export function Lightbox({
  collection,
  onClose,
}: {
  collection: Collection | null
  onClose: () => void
}) {
  const [i, setI] = useState(0)
  const count = collection?.photos.length ?? 0

  useEffect(() => setI(0), [collection])

  const go = useCallback(
    (d: number) => setI((v) => (count ? (v + d + count) % count : 0)),
    [count],
  )

  useEffect(() => {
    if (!collection) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [collection, onClose, go])

  return (
    <AnimatePresence>
      {collection && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[90] flex flex-col bg-[#140A05]/95 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={`${collection.title} gallery`}
        >
          <header className="flex items-center justify-between px-5 py-5 sm:px-8">
            <div>
              <p className="eyebrow text-saffron">{collection.title}</p>
              <p className="mt-1 text-sm text-white/55">{collection.blurb}</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close gallery"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/25 text-white/80 transition hover:border-white hover:text-white"
            >
              <Close className="h-5 w-5" />
            </button>
          </header>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-2 sm:px-16">
            <AnimatePresence mode="wait">
              {/* A bare <img> here: object-contain wants no blur plate behind it. */}
              <motion.img
                key={i}
                src={collection.photos[i].src}
                srcSet={collection.photos[i].srcset}
                sizes="90vw"
                alt={`${collection.title} ${i + 1} of ${count}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="max-h-full w-auto max-w-full rounded-xl object-contain shadow-frame"
              />
            </AnimatePresence>

            <LightboxNav side="left" onClick={() => go(-1)} />
            <LightboxNav side="right" onClick={() => go(1)} />
          </div>

          <footer className="flex items-center justify-center gap-2 overflow-x-auto px-5 py-6 sm:px-8">
            {collection.photos.map((p, n) => (
              <button
                key={p.src}
                onClick={() => setI(n)}
                aria-label={`Frame ${n + 1}`}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md transition-all duration-300 ${
                  n === i ? 'ring-2 ring-saffron' : 'opacity-45 hover:opacity-90'
                }`}
              >
                <Frame photo={p} alt="" sizes="80px" />
              </button>
            ))}
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function LightboxNav({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      onClick={onClick}
      aria-label={side === 'left' ? 'Previous photo' : 'Next photo'}
      className={`absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 text-white/80 transition hover:border-white hover:bg-white hover:text-ink ${
        side === 'left' ? 'left-1 sm:left-4' : 'right-1 sm:right-4'
      }`}
    >
      <Icon className="h-5 w-5" />
    </button>
  )
}
