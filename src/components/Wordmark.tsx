import { brand } from '../data/site'

/**
 * The hero lockup: brand mark, the PIXEL STORIES logotype, and a rule-flanked
 * "by Santosh Vemula" beneath it.
 *
 * The logotype is set as live text rather than an image so it stays sharp at
 * any size, scales with the viewport and remains selectable. "STORIES" is
 * hollow via text-stroke. To swap in the original artwork instead, replace the
 * <span> pair below with an <img> and keep the surrounding layout.
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

      <div className="mt-5 flex flex-col items-center">
        <h1 className="flex items-baseline gap-[0.22em] font-wordmark text-[clamp(2.25rem,5.4vw,4.4rem)] font-extrabold uppercase leading-none tracking-[-0.005em]">
          <span className="text-vermilion">Pixel</span>
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: '0.035em #EF7702' }}
          >
            Stories
          </span>
        </h1>

        <span className="mt-3 flex items-center gap-2 sm:mt-4">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-ember sm:w-16" />
          <span className="whitespace-nowrap font-display italic text-ember text-[clamp(0.9rem,2.1vw,1.35rem)]">
            {brand.by}
          </span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-ember sm:w-16" />
        </span>
      </div>
    </div>
  )
}
