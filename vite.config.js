import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration Vite minimale : plugin React (JSX/HMR).
export default defineConfig({
  plugins: [react()],
  server: {
    // Port par defaut 5173 ; respecte la variable d'environnement PORT si fournie.
    port: Number(process.env.PORT) || 5173,
    open: true,
  },
})
