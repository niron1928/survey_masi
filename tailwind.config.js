/** @type {import('tailwindcss').Config} */
// Palette "terminal financier" (voir cahier des charges, section 2).
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Fonds
        night: '#0B1220',       // fond principal (bleu nuit / charbon)
        surface: '#131C2E',     // cartes / surfaces
        edge: '#243049',        // bordures fines
        // Accents marche
        up: '#16A34A',          // HAUSSE (vert)
        down: '#DC2626',        // BAISSE (rouge)
        info: '#3B82F6',        // neutre / info (bleu)
        // Textes
        ink: '#E5E9F0',         // texte principal (blanc casse)
        muted: '#9AA6B8',       // texte secondaire (gris)
      },
      fontFamily: {
        // Chiffres / cotations en monospace ; titres en sans-serif moderne.
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
        sans: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        flash: {
          '0%': { boxShadow: '0 0 0 0 rgba(59,130,246,0.7)' },
          '100%': { boxShadow: '0 0 0 14px rgba(59,130,246,0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        ticker: 'ticker 40s linear infinite',
        flash: 'flash 400ms ease-out',
        fadeUp: 'fadeUp 250ms ease-out both',
      },
    },
  },
  plugins: [],
}
