import { AnimatePresence, motion } from 'framer-motion'
import { brand } from '../data/site'

const easeOut = [0.76, 0, 0.24, 1] as const

/** Cream curtain that holds the first paint, then lifts off the hero. */
export function Preloader({ done }: { done: boolean }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.95, ease: easeOut }}
          className="fixed inset-0 z-[100] grid place-items-center bg-shell"
        >
          <div className="flex flex-col items-center">
            <motion.img
              src="/logo.png"
              alt=""
              width={512}
              height={512}
              className="h-16 w-16"
              initial={{ scale: 0.8, opacity: 0, rotate: -35 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="mt-5 font-display text-xl text-ink"
            >
              {brand.name}
            </motion.p>

            <div className="mt-5 h-px w-32 overflow-hidden bg-sand">
              <motion.span
                className="block h-full w-full bg-swirl"
                initial={{ scaleX: 0, transformOrigin: 'left center' }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.4, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
