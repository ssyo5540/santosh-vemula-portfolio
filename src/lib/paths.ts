/**
 * Built off Vite's BASE_URL so the two pages still find each other when the
 * site is deployed under a sub-path (GitHub Pages project sites, say).
 */
const base = import.meta.env.BASE_URL

export const paths = {
  home: base,
  videos: `${base}videos/`,
}
