import { useLayoutEffect, type RefObject } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

type Options = {
  /** Scopes selector strings inside the callback and limits cleanup to this subtree. */
  scope?: RefObject<HTMLElement | null>
  deps?: unknown[]
}

/**
 * Runs a GSAP setup function inside a `gsap.context` so every tween and
 * ScrollTrigger it creates is reverted together on unmount. Return a function
 * from the callback for any extra teardown (a SplitText revert, say).
 */
export function useGSAP(
  callback: (self: gsap.Context) => void | (() => void),
  { scope, deps = [] }: Options = {},
) {
  useLayoutEffect(() => {
    const ctx = gsap.context(callback, scope?.current ?? undefined)
    // Fonts and images settle after mount and shift every trigger below them.
    const refresh = () => ScrollTrigger.refresh()
    const id = window.setTimeout(refresh, 300)

    return () => {
      window.clearTimeout(id)
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
