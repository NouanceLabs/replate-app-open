import { defineConfig } from '@solidjs/start/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  vite: {
    plugins: [tsConfigPaths()],
    define: {
      'process.env.VITE_API_ENDPOINT': process.env.VITE_API_ENDPOINT,
      'process.env.VITE_CDN': process.env.VITE_CDN,
    },
  },
  server: {
    prerender: {
      crawlLinks: true,
    },
  },
})
