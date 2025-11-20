import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  // fallback explicit alias if tsconfigPaths doesn't pick it up
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
