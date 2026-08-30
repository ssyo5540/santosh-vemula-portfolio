import { useEffect, useRef, useState } from 'react'
import type { Photo } from '../data/site'

type Props = {
  photo: Photo
  alt: string
  sizes?: string
  className?: string
  priority?: boolean
}

/**
 * A photograph that fades up out of its own 20px blur seed, so nothing on the
 * page ever pops in from white.
 */
export function Frame({ photo, alt, sizes = '100vw', className = '', priority }: Props) {
  const [loaded, setLoaded] = useState(false)
  const ref = useRef<HTMLImageElement>(null)

  // Cached images can finish before React attaches onLoad.
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true)
  }, [])

  return (
    <span
      className="absolute inset-0 block bg-cover bg-center"
      style={{ backgroundImage: `url("${photo.blur}")` }}
    >
      <img
        ref={ref}
        src={photo.src}
        srcSet={photo.srcset}
        sizes={sizes}
        alt={alt}
        width={photo.width}
        height={photo.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-700 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />
    </span>
  )
}
