import { useRef, useState } from 'react'
import { SectionHeading } from './SectionHeading'
import { FilmCard } from './FilmCard'
import { FilmModal } from './FilmModal'
import { ArrowRight } from './icons'
import { useGSAP } from '../hooks/useGSAP'
import { gsap, ease, prefersReducedMotion } from '../lib/gsap'
import { paths } from '../lib/paths'
import { featuredFilms, type Film } from '../data/videos'

export function FeaturedFilms() {
  const root = useRef<HTMLElement>(null)
  const [playing, setPlaying] = useState<Film | null>(null)

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
          <a
            href={paths.videos}
            className="group inline-flex items-center gap-2 text-sm font-medium text-ember transition-colors hover:text-vermilion"
          >
            View all videos
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" />
          </a>
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

      <FilmModal film={playing} onClose={() => setPlaying(null)} />
    </section>
  )
}
