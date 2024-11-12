import { defineConfig } from '@solidjs/start/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  vite: {
    plugins: [tsConfigPaths()],
    ssr: {
      external: ['@payload/*', '../api/*', 'payload', '@payloadcms/*', 'lexical', '@lexical/*', 'sharp', 'valibot'],
    },
    define: {
      'process.env.VITE_API_ENDPOINT': process.env.VITE_API_ENDPOINT,
      'process.env.VITE_CDN': process.env.VITE_CDN,
    },
    esbuild: {
      exclude: ['@payload/*', '../api/*', 'payload', '@payloadcms/*', 'lexical', '@lexical/*', 'sharp', 'valibot'],
    },
  },

  server: {
    prerender: {
      crawlLinks: false,
    },
  },
})
