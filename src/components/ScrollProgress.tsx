import { motion, useScroll, useSpring } from 'framer-motion'

/** Hairline read-out of how far down the page you are. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const width = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 })

  return (
    <motion.div
      style={{ scaleX: width }}
      className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-swirl"
      aria-hidden
    />
  )
}
