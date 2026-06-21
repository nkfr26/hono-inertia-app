import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'
import ssrPlugin from 'vite-ssr-components/plugin'
import { inertiaPages } from '@hono/inertia/vite'
import path from "path"

export default defineConfig({
  plugins: [inertiaPages(), cloudflare(), ssrPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },
})
