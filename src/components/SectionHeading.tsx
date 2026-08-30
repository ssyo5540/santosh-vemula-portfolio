import { useRef, type ReactNode } from 'react'
import { useGSAP } from '../hooks/useGSAP'
import { gsap, SplitText, ease, prefersReducedMotion } from '../lib/gsap'

type Props = {
  eyebrow: string
  title: string
  action?: ReactNode
  className?: string
}

/**
 * The eyebrow + serif headline pairing that opens each section. The headline is
 * split into words and swept up on scroll; the eyebrow rule draws itself out.
 */
export function SectionHeading({ eyebrow, title, action, className = '' }: Props) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const heading = root.current?.querySelector<HTMLElement>('[data-heading]')
      if (!heading) return

      const split = new SplitText(heading, { type: 'words,lines', linesClass: 'split-line' })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 82%' },
      })

      tl.from(root.current!.querySelectorAll('[data-eyebrow] > *'), {
        yPercent: 120,
        opacity: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: ease.out,
      })
        .from(
          root.current!.querySelector('[data-rule]'),
          { scaleX: 0, transformOrigin: 'left center', duration: 0.7, ease: ease.expo },
          '-=0.4',
        )
        .from(
          split.words,
          { yPercent: 108, opacity: 0, duration: 0.9, stagger: 0.045, ease: ease.expo },
          '-=0.5',
        )


      const actionEl = root.current!.querySelector('[data-action]')
      if (actionEl) {
        tl.from(actionEl, { x: 24, opacity: 0, duration: 0.6, ease: ease.out }, '-=0.6')
      }

      return () => split.revert()
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      className={`flex flex-wrap items-end justify-between gap-x-8 gap-y-4 ${className}`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <span data-eyebrow className="eyebrow flex overflow-hidden">
            <span className="block">{eyebrow}</span>
          </span>
          <span data-rule className="eyebrow-rule" />
        </div>
        <h2
          data-heading
          className="headline mt-3 text-[clamp(2rem,5.4vw,3.6rem)] text-balance"
        >
          {title}
        </h2>
      </div>
      {action ? (
        <div data-action className="pb-1">
          {action}
        </div>
      ) : null}
    </div>
  )
}
