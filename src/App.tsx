import { useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { Backdrop } from './components/Backdrop'
import { Preloader } from './components/Preloader'
import { ScrollProgress } from './components/ScrollProgress'
import { Hero } from './components/Hero'
import { FeaturedFilms } from './components/FeaturedFilms'
import { Categories } from './components/Categories'
import { Footer } from './components/Footer'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { ScrollTrigger } from './lib/gsap'

/** Hold the curtain until the window settles, but never longer than this. */
const MAX_HOLD_MS = 1800

export default function App() {
  const [ready, setReady] = useState(false)
  useSmoothScroll()

  useEffect(() => {
    const reveal = () => setReady(true)
    const cap = window.setTimeout(reveal, MAX_HOLD_MS)

    if (document.readyState === 'complete') {
      const soon = window.setTimeout(reveal, 550)
      return () => {
        window.clearTimeout(cap)
        window.clearTimeout(soon)
      }
    }

    window.addEventListener('load', reveal, { once: true })
    return () => {
      window.clearTimeout(cap)
      window.removeEventListener('load', reveal)
    }
  }, [])

  // The curtain lifting changes every trigger's position on the page.
  useEffect(() => {
    if (!ready) return
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 1000)
    return () => window.clearTimeout(id)
  }, [ready])

  return (
    /* reducedMotion="user" lets the OS setting switch Framer to opacity-only. */
    <MotionConfig reducedMotion="user">
      <Backdrop />
      <Preloader done={ready} />
      <ScrollProgress />

      <main>
        <Hero ready={ready} />
        <FeaturedFilms />
        <Categories />
      </main>

      <Footer />
    </MotionConfig>
  )
}
