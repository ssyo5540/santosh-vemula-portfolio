import { useRef, useState } from 'react'
import { SectionHeading } from './SectionHeading'
import { CategoryCard } from './CategoryCard'
import { Lightbox } from './Lightbox'
import { useGSAP } from '../hooks/useGSAP'
import { gsap, ease, prefersReducedMotion } from '../lib/gsap'
import { collections, type Collection } from '../data/site'

export function Categories() {
  const root = useRef<HTMLElement>(null)
  const [open, setOpen] = useState<Collection | null>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      gsap.from('[data-category-card]', {
        y: 80,
        opacity: 0,
        duration: 1.1,
        ease: ease.expo,
        stagger: { each: 0.08, grid: [3, 3], from: 'start' },
        scrollTrigger: { trigger: '[data-category-grid]', start: 'top 84%' },
      })

      // Each cover drifts inside its frame as the grid passes the viewport.
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="work" className="edge relative py-20 sm:py-28">
      <SectionHeading eyebrow="Our Event Categories" title="Every Moment Matters" />

      <div
        data-category-grid
        className="mt-10 grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-3 lg:gap-5"
      >
        {collections.map((c) => (
          <CategoryCard key={c.slug} collection={c} onOpen={setOpen} />
        ))}
      </div>

      <Lightbox collection={open} onClose={() => setOpen(null)} />
    </section>
  )
}
