import { useEffect } from 'react'
import Lenis from 'lenis'
import { ScrollTrigger, gsap, prefersReducedMotion } from '../lib/gsap'

/**
 * Lenis inertial scrolling, driven off the GSAP ticker so ScrollTrigger and the
 * smoothing never disagree about where the page is.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
}
