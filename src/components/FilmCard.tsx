import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play } from './icons'
import { filmDisplayTitles } from '../data/site'
import type { Film } from '../data/videos'

export const runtime = (s: number | null) => {
  if (!s) return null
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}

const thumbUrl = (id: string, size: 'maxres' | 'hq') =>
  `https://i.ytimg.com/vi/${id}/${size}default.jpg`

/**
 * Only hqdefault is guaranteed. maxresdefault either 404s or quietly serves
 * YouTube's 120px grey placeholder, so we watch for both and step down.
 */
function Thumb({ id, alt, small }: { id: string; alt: string; small?: boolean }) {
  const [src, setSrc] = useState(thumbUrl(id, small ? 'hq' : 'maxres'))
  const fallback = () => setSrc((s) => (s.includes('maxres') ? thumbUrl(id, 'hq') : s))

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={fallback}
      onLoad={(e) => e.currentTarget.naturalWidth <= 120 && fallback()}
      className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
    />
  )
}

type Props = {
  film: Film
  onPlay: (film: Film) => void
  compact?: boolean
}

export function FilmCard({ film, onPlay, compact }: Props) {
  const title = filmDisplayTitles[film.id] ?? film.title
  const time = runtime(film.seconds)

  return (
    <motion.button
      type="button"
      onClick={() => onPlay(film)}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="group block w-full text-left"
    >
      <div className="card-frame aspect-[16/10] w-full bg-ink/10">
        <Thumb id={film.id} alt={title} small={compact} />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

        <span className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="grid h-14 w-14 place-items-center rounded-full border border-white/70 bg-white/15 text-white backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:border-white group-hover:bg-swirl group-hover:shadow-lift">
            <Play className="ml-0.5 h-5 w-5" />
          </span>
        </span>

        {time && (
          <span className="pointer-events-none absolute bottom-2.5 right-2.5 rounded bg-ink/80 px-1.5 py-0.5 font-sans text-[0.65rem] font-medium tabular-nums text-white">
            {time}
          </span>
        )}
      </div>

      <h3
        className={`mt-3.5 font-display leading-snug text-ink transition-colors duration-300 group-hover:text-vermilion ${
          compact ? 'line-clamp-2 text-[0.95rem]' : 'text-lg'
        }`}
      >
        {title}
      </h3>

      <div className="mt-1.5 flex items-center gap-2 text-xs text-muted">
        {film.tags.map((tag, i) => (
          <span key={tag} className="flex items-center gap-2">
            {i > 0 && <span className="text-sand">/</span>}
            {tag}
          </span>
        ))}
      </div>

      <span className="mt-2.5 block h-[2px] w-8 origin-left bg-swirl transition-transform duration-500 group-hover:scale-x-[2.6]" />
    </motion.button>
  )
}
