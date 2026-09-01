/**
 * Built off Vite's BASE_URL so the site works both at a domain root and under
 * a sub-path (santoshvemula.com/events, a GitHub Pages project site).
 */
const base = import.meta.env.BASE_URL

/**
 * Prefix a file that lives in `public/`. Vite rewrites asset URLs it can see
 * statically, but not literal strings in JSON or JSX, so anything referenced
 * at runtime has to go through here or it breaks on a sub-path deploy.
 */
export const asset = (path: string) => base + path.replace(/^\//, '')

export const paths = {
  home: base,
  videos: `${base}videos/`,
}
