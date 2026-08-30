import { brand } from '../data/site'

type Props = {
  size?: 'sm' | 'lg'
  className?: string
}

/**
 * The lockup, as drawn in the mockup: brand mark on the left, "Pixels" in the
 * display serif, and a rule-flanked "by Santosh Vemula" centred beneath it.
 *
 * The text column is `items-center`, so it sizes to the by-line and the wordmark
 * centres over it — the same relationship at both scales.
 */
export function Wordmark({ size = 'sm', className = '' }: Props) {
  const large = size === 'lg'

  return (
    <div
      className={`flex ${large ? 'flex-col items-center' : 'items-center gap-3 sm:gap-3.5'} ${className}`}
    >
      <img
        src="/logo.png"
        alt=""
        width={512}
        height={512}
        className={large ? 'h-16 w-16 sm:h-20 sm:w-20' : 'h-10 w-10 md:h-12 md:w-12'}
      />

      <div className={`flex flex-col items-center ${large ? 'mt-4' : ''}`}>
        <span
          className={`headline ${
            large
              ? 'text-[clamp(3rem,11vw,6.5rem)] leading-[0.95]'
              : 'text-[1.4rem] leading-none md:text-[1.75rem]'
          }`}
        >
          {brand.name}
        </span>

        <span className={`flex items-center ${large ? 'mt-2 gap-2 sm:mt-3' : 'mt-1.5 gap-2'}`}>
          <span
            className={`h-px bg-gradient-to-r from-transparent ${
              large ? 'w-8 to-ember sm:w-16' : 'w-4 to-crimson md:w-5'
            }`}
          />
          <span
            className={`whitespace-nowrap font-display italic ${
              large
                ? 'text-[clamp(1rem,2.6vw,1.6rem)] text-ember'
                : 'text-[0.68rem] text-crimson md:text-[0.78rem]'
            }`}
          >
            {brand.by}
          </span>
          <span
            className={`h-px bg-gradient-to-l from-transparent ${
              large ? 'w-8 to-ember sm:w-16' : 'w-4 to-crimson md:w-5'
            }`}
          />
        </span>
      </div>
    </div>
  )
}
