import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// Served from the custom domain https://victorocampomarin.com (GitHub Pages), so the base is the root.
export default defineConfig({
  base: '/',
  plugins: [vue(), tailwindcss()],
})
