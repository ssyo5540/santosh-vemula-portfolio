import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Root by default; `npm run build:events` sets /events/ for the Hostinger
  // sub-path. Runtime asset paths follow it via src/lib/paths.ts.
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  build: {
    target: 'es2020',
    rollupOptions: {
      // Two real pages: the home page and the film catalogue at /videos/.
      // Emitting an actual videos/index.html keeps deep links working on any
      // static host, with no SPA fallback rule to configure.
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        videos: fileURLToPath(new URL('./videos/index.html', import.meta.url)),
      },
      output: {
        // Keep the animation libraries in their own chunks so the shell paints first.
        manualChunks(id) {
          if (id.includes('node_modules/gsap')) return 'gsap'
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion'))
            return 'motion'
        },
      },
    },
  },
})
