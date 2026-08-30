import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, type PanInfo } from 'framer-motion'
import { Frame } from './Frame'
import { ChevronLeft, ChevronRight } from './icons'
import { heroSlides } from '../data/site'

const AUTOPLAY_MS = 4800

/**
 * Depth, rotation and scale for a card sitting `offset` places from centre.
 * The spread widens on desktop so the ring reaches close to the full viewport;
 * phones keep it tighter, or the outer cards fall off-screen entirely.
 */
const layout = (offset: number, wide: boolean) => {
  const dir = Math.sign(offset)
  const step = Math.abs(offset)
  const near = wide ? 88 : 76
  const far = wide ? 156 : 132

  const [x, z, rot, scale, opacity, zIndex] =
    step === 0
      ? [0, 0, 0, 1, 1, 40]
      : step === 1
        ? [dir * near, -170, -dir * 30, 0.84, 1, 30]
        : [dir * far, -340, -dir * 40, 0.66, 0.8, 20]

  return {
    opacity,
    zIndex,
    transform: `translateX(${x}%) translateZ(${z}px) scale(${scale}) rotateY(${rot}deg)`,
  }
}

export function HeroCarousel() {
  const count = heroSlides.length
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [wide, setWide] = useState(true)
  const stage = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const sync = () => setWide(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

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
    const thrown = info.offset.x + info.velocity.x * 0.18
    if (thrown < -60) go(1)
    else if (thrown > 60) go(-1)
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
        className="relative mx-auto flex h-[clamp(21rem,34vw,32rem)] items-center justify-center outline-none"
        style={{ perspective: '2000px' }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.14}
          onDragStart={() => setPaused(true)}
          onDragEnd={onDragEnd}
          className="preserve-3d relative aspect-[4/5] w-[clamp(13rem,26vw,24rem)] cursor-grab active:cursor-grabbing"
        >
          {heroSlides.map((photo, i) => {
            const offset = offsetOf(i)
            if (Math.abs(offset) > 2) return null
            const t = layout(offset, wide)
            const active = offset === 0

            return (
              <figure
                key={photo.src}
                className="preserve-3d backface-hidden absolute inset-0 will-change-transform"
                style={{
                  ...t,
                  transition:
                    'transform 760ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease',
                }}
                onClick={() => !active && go(offset)}
                aria-hidden={!active}
              >
                <div
                  className={`card-frame h-full w-full transition-shadow duration-500 ${
                    active ? 'shadow-lift' : ''
                  }`}
                >
                  <Frame
                    photo={photo}
                    alt="Photograph by Santosh Vemula"
                    sizes="(max-width: 768px) 60vw, 26vw"
                    priority={Math.abs(offset) <= 1}
                  />
                  {/* Only the off-centre frames are shaded, so the active one stays clean. */}
                  <span
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 to-transparent transition-opacity duration-500 ${
                      active ? 'opacity-0' : 'opacity-70'
                    }`}
                  />
                </div>
              </figure>
            )
          })}
        </motion.div>

        <NavButton side="left" onClick={() => go(-1)} />
        <NavButton side="right" onClick={() => go(1)} />
      </div>

      <div className="mt-7 flex items-center justify-center gap-2.5">
        {heroSlides.map((photo, i) => (
          <button
            key={photo.src}
            onClick={() => setIndex(i)}
            aria-label={`Show frame ${i + 1}`}
            aria-current={i === index}
            className="group grid h-5 w-5 place-items-center"
          >
            <span
              className={`block rounded-full transition-all duration-500 ${
                i === index ? 'h-2 w-2 bg-swirl' : 'h-1.5 w-1.5 bg-sand group-hover:bg-ember/60'
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
        side === 'left' ? 'left-1 sm:left-3' : 'right-1 sm:right-3'
      }`}
    >
      <Icon className="h-5 w-5" />
    </button>
  )
}
