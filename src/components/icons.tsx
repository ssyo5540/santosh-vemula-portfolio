import type { JSX, SVGProps } from 'react'

type Icon = (p: SVGProps<SVGSVGElement>) => JSX.Element

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const ArrowRight: Icon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
)

export const ChevronLeft: Icon = (p) => (
  <svg {...base} {...p}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
)

export const ChevronRight: Icon = (p) => (
  <svg {...base} {...p}>
    <path d="M9 5l7 7-7 7" />
  </svg>
)

export const Close: Icon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export const Play: Icon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M8.6 5.2a1 1 0 0 1 1.52-.86l8.1 6.8a1 1 0 0 1 0 1.72l-8.1 6.8a1 1 0 0 1-1.52-.86z" />
  </svg>
)

/* --- category marks --- */

export const Home: Icon = (p) => (
  <svg {...base} {...p}>
    <path d="M3.5 10.6 12 4l8.5 6.6V20a.9.9 0 0 1-.9.9h-4.4v-5.4H8.8v5.4H4.4a.9.9 0 0 1-.9-.9z" />
  </svg>
)

export const Cake: Icon = (p) => (
  <svg {...base} {...p}>
    <path d="M3.6 20.4h16.8M4.6 20.4v-5.1c0-1 .8-1.8 1.8-1.8h11.2c1 0 1.8.8 1.8 1.8v5.1" />
    <path d="M12 13.5V9.9M8.4 13.5v-2.4M15.6 13.5v-2.4M12 7.5V6M8.4 9V7.7M15.6 9V7.7" />
  </svg>
)

export const Rings: Icon = (p) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="14.5" r="4.8" />
    <circle cx="15.6" cy="14.5" r="4.8" />
    <path d="M13.2 4.6h4.4l2 3-4.2 3.3-4.2-3.3z" />
  </svg>
)

export const Ring: Icon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="15" r="5.4" />
    <path d="M9.6 4.2h4.8l2.2 3.4-4.6 3.2-4.6-3.2z" />
  </svg>
)

export const Lotus: Icon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 4.5c1.9 1.8 2.9 4 2.9 6.7 0 2.7-1 4.9-2.9 6.7-1.9-1.8-2.9-4-2.9-6.7 0-2.7 1-4.9 2.9-6.7z" />
    <path d="M12 17.9c-2.6.6-5-.2-7.2-2.4 1-2.4 2.7-3.8 5-4.2M12 17.9c2.6.6 5-.2 7.2-2.4-1-2.4-2.7-3.8-5-4.2" />
    <path d="M3 17.5c2.4 2.3 5.4 3.4 9 3.4s6.6-1.1 9-3.4" />
  </svg>
)

export const Heart: Icon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 20.2 4.9 13c-1.9-1.9-1.9-4.9 0-6.8a4.6 4.6 0 0 1 6.5 0l.6.6.6-.6a4.6 4.6 0 0 1 6.5 0c1.9 1.9 1.9 4.9 0 6.8z" />
  </svg>
)

export const Sparkle: Icon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3.4 13.9 9l5.6 1.9-5.6 1.9L12 18.4 10.1 12.8 4.5 10.9 10.1 9z" />
    <path d="M18.6 3.6v2.8M20 5h-2.8M5.4 16.6v2.4M6.6 17.8H4.2" />
  </svg>
)

export const Cap: Icon = (p) => (
  <svg {...base} {...p}>
    <path d="M2.8 9.4 12 5.1l9.2 4.3L12 13.7z" />
    <path d="M6.6 11.3v4.6c0 1.6 2.4 2.9 5.4 2.9s5.4-1.3 5.4-2.9v-4.6M21.2 9.4v5.2" />
  </svg>
)

export const Family: Icon = (p) => (
  <svg {...base} {...p}>
    <circle cx="8.2" cy="7.6" r="2.7" />
    <circle cx="16.4" cy="8.6" r="2.2" />
    <path d="M3.4 19.6v-1.4a4.8 4.8 0 0 1 9.6 0v1.4M14.6 19.6v-1.2a4 4 0 0 1 6-3.4" />
  </svg>
)

export const categoryIcons: Record<string, Icon> = {
  home: Home,
  cake: Cake,
  rings: Rings,
  ring: Ring,
  lotus: Lotus,
  heart: Heart,
  sparkle: Sparkle,
  cap: Cap,
  family: Family,
}
