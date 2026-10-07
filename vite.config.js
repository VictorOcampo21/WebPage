import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves this repo at https://victorocampo21.github.io/WebPage/
// If you move the site to a user page (VictorOcampo21.github.io) or Vercel/Netlify, change base to '/'.
export default defineConfig({
  base: '/WebPage/',
  plugins: [vue(), tailwindcss()],
})
