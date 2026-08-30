import { brand } from '../data/site'

type Props = {
  size?: 'sm' | 'lg'
  className?: string
}

/**
 * The lockup: brand mark, "Pixels" set in the display serif, and the
 * rule-flanked "by Santosh Vemula" line beneath it.
 */
export function Wordmark({ size = 'sm', className = '' }: Props) {
  const large = size === 'lg'

  return (
    <div className={`flex ${large ? 'flex-col items-center' : 'items-center gap-3'} ${className}`}>
      <img
        src="/logo.png"
        alt=""
        width={512}
        height={512}
        className={large ? 'h-16 w-16 sm:h-20 sm:w-20' : 'h-10 w-10 sm:h-11 sm:w-11'}
      />

      <div className={large ? 'mt-4 text-center' : ''}>
        <div
          className={`headline ${
            large
              ? 'text-[clamp(3rem,11vw,6.5rem)] leading-[0.95]'
              : 'text-2xl leading-none sm:text-[1.7rem]'
          }`}
        >
          {brand.name}
        </div>

        {/* Large: rules on both sides. Small: one trailing rule, flush left. */}
        <div
          className={`flex items-center gap-2 ${
            large ? 'mt-2 justify-center sm:mt-3' : 'mt-0.5 justify-start'
          }`}
        >
          {large && <span className="h-px w-8 bg-gradient-to-r from-transparent to-ember sm:w-16" />}
          <span
            className={`whitespace-nowrap font-display italic text-ember ${
              large ? 'text-[clamp(1rem,2.6vw,1.6rem)]' : 'text-xs sm:text-sm'
            }`}
          >
            {brand.by}
          </span>
          <span
            className={`h-px bg-gradient-to-l from-transparent to-ember ${
              large ? 'w-8 sm:w-16' : 'w-5'
            }`}
          />
        </div>
      </div>
    </div>
  )
}
