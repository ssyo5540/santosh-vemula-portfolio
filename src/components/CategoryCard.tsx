import { Frame } from './Frame'
import { ArrowRight, categoryIcons } from './icons'
import type { Collection } from '../data/site'

type Props = {
  collection: Collection
  onOpen: (c: Collection) => void
}

export function CategoryCard({ collection, onOpen }: Props) {
  const Icon = categoryIcons[collection.icon] ?? categoryIcons.sparkle

  return (
    <button
      type="button"
      onClick={() => onOpen(collection)}
      data-category-card
      className="card-frame group block aspect-[4/3] w-full text-left"
      aria-label={`Open the ${collection.title} gallery`}
    >
      <div
        data-parallax
        className="absolute inset-0 scale-[1.14] transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.2]"
      >
        <Frame
          photo={collection.photos[0]}
          alt={collection.title}
          sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/5 transition-opacity duration-500 group-hover:from-ink/90" />
      {/* Brand wash that blooms in on hover. */}
      <span className="pointer-events-none absolute inset-0 bg-swirl opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-40" />

      <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
        <span className="min-w-0">
          <Icon className="mb-2 h-5 w-5 text-white/85 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:text-saffron sm:h-6 sm:w-6" />
          <span className="block font-display text-[clamp(1.1rem,2.2vw,1.5rem)] leading-tight text-white">
            {collection.title}
          </span>
          <span className="mt-2 block h-[2px] w-9 origin-left bg-swirl transition-transform duration-500 group-hover:scale-x-[2.2]" />
        </span>

        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/40 text-white transition-all duration-500 group-hover:border-transparent group-hover:bg-white group-hover:text-vermilion">
          <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5" />
        </span>
      </span>
    </button>
  )
}
