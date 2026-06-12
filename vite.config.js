import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  // Ruta base para GitHub Pages: https://<usuario>.github.io/organizacion-julian/
  // Solo en build, así el dev server sigue sirviendo en localhost:5173/
  base: command === 'build' ? '/organizacion-julian/' : '/',
  plugins: [react(), tailwindcss()],
}))
