import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { Frame } from './Frame'
import { ChevronLeft, ChevronRight } from './icons'
import { heroSlides } from '../data/site'

const AUTOPLAY_MS = 4800

/** Depth, rotation and scale for a card sitting `offset` places from centre. */
const layout = (offset: number) => {
  const dir = Math.sign(offset)
  const step = Math.abs(offset)
  if (step === 0) return { x: '0%', z: 0, rotateY: 0, scale: 1, opacity: 1, zIndex: 40 }
  if (step === 1)
    return { x: `${dir * 78}%`, z: -170, rotateY: -dir * 32, scale: 0.82, opacity: 1, zIndex: 30 }
  return {
    x: `${dir * 134}%`,
    z: -340,
    rotateY: -dir * 42,
    scale: 0.64,
    opacity: 0.78,
    zIndex: 20,
  }
}

export function HeroCarousel() {
  const count = heroSlides.length
  const [index, setIndex] = useState(2) // open on the wedding frame
  const [paused, setPaused] = useState(false)
  const stage = useRef<HTMLDivElement>(null)

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count])

  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => go(1), AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [paused, go])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    const el = stage.current
    el?.addEventListener('keydown', onKey)
    return () => el?.removeEventListener('keydown', onKey)
  }, [go])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const throw_ = info.offset.x + info.velocity.x * 0.18
    if (throw_ < -60) go(1)
    else if (throw_ > 60) go(-1)
  }

  /** Shortest signed distance from the active card, so the ring wraps cleanly. */
  const offsetOf = (i: number) => {
    const raw = i - index
    const half = Math.floor(count / 2)
    if (raw > half) return raw - count
    if (raw < -half) return raw + count
    return raw
  }

  return (
    <div
      className="relative w-full select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        ref={stage}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Selected frames"
        className="relative mx-auto flex h-[clamp(19rem,31vw,27rem)] items-center justify-center outline-none"
        style={{ perspective: '1700px' }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.14}
          onDragStart={() => setPaused(true)}
          onDragEnd={onDragEnd}
          className="preserve-3d relative aspect-[4/5] w-[clamp(11rem,23vw,20rem)] cursor-grab active:cursor-grabbing"
        >
          {heroSlides.map((slide, i) => {
            const offset = offsetOf(i)
            if (Math.abs(offset) > 2) return null
            const t = layout(offset)
            const active = offset === 0

            return (
              <motion.figure
                key={slide.caption}
                className="preserve-3d backface-hidden absolute inset-0"
                initial={false}
                animate={t}
                transition={{ type: 'spring', stiffness: 120, damping: 22, mass: 0.9 }}
                onClick={() => !active && go(offset)}
                aria-hidden={!active}
              >
                <div
                  className={`card-frame h-full w-full transition-shadow duration-500 ${
                    active ? 'shadow-lift' : ''
                  }`}
                >
                  <Frame
                    photo={slide.photo}
                    alt={`${slide.caption} photography by Santosh Vemula`}
                    sizes="(max-width: 640px) 60vw, 25vw"
                    priority={Math.abs(offset) <= 1}
                  />
                  <span
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/0 to-ink/0 transition-opacity duration-500 ${
                      active ? 'opacity-100' : 'opacity-40'
                    }`}
                  />
                  <AnimatePresence>
                    {active && (
                      <motion.figcaption
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-x-0 bottom-0 p-4 text-left sm:p-5"
                      >
                        <span className="text-[0.6rem] font-bold uppercase tracking-eyebrow text-saffron">
                          {slide.caption}
                        </span>
                      </motion.figcaption>
                    )}
                  </AnimatePresence>
                </div>
              </motion.figure>
            )
          })}
        </motion.div>

        <NavButton side="left" onClick={() => go(-1)} />
        <NavButton side="right" onClick={() => go(1)} />
      </div>

      <div className="mt-6 flex items-center justify-center gap-2.5">
        {heroSlides.map((slide, i) => (
          <button
            key={slide.caption}
            onClick={() => setIndex(i)}
            aria-label={`Show ${slide.caption}`}
            aria-current={i === index}
            className="group grid h-5 w-5 place-items-center"
          >
            <span
              className={`block rounded-full transition-all duration-500 ${
                i === index
                  ? 'h-2 w-2 bg-swirl'
                  : 'h-1.5 w-1.5 bg-sand group-hover:bg-ember/60'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

function NavButton({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      onClick={onClick}
      aria-label={side === 'left' ? 'Previous frame' : 'Next frame'}
      className={`absolute top-1/2 z-50 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-ink shadow-frame backdrop-blur transition duration-300 hover:scale-110 hover:bg-white hover:text-vermilion ${
        side === 'left' ? 'left-1 sm:left-6 lg:left-[6%]' : 'right-1 sm:right-6 lg:right-[6%]'
      }`}
    >
      <Icon className="h-5 w-5" />
    </button>
  )
}
