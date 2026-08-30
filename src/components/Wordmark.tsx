import { brand } from '../data/site'

/**
 * The hero lockup: brand mark, "Pixels" in the display serif, and a
 * rule-flanked "by Santosh Vemula" centred beneath it.
 *
 * The text column is `items-center`, so it sizes to the by-line and the
 * wordmark centres over it.
 */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img
        src="/logo.png"
        alt=""
        width={512}
        height={512}
        className="h-16 w-16 sm:h-20 sm:w-20"
      />

      <div className="mt-4 flex flex-col items-center">
        <span className="headline text-[clamp(3rem,11vw,6.5rem)] leading-[0.95]">
          {brand.name}
        </span>

        <span className="mt-2 flex items-center gap-2 sm:mt-3">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-ember sm:w-16" />
          <span className="whitespace-nowrap font-display italic text-ember text-[clamp(1rem,2.6vw,1.6rem)]">
            {brand.by}
          </span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-ember sm:w-16" />
        </span>
      </div>
    </div>
  )
}
