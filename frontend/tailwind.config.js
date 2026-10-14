/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#090a10',
          card: '#121422',
          cardHover: '#181b2e',
          border: 'rgba(255, 255, 255, 0.08)',
          subtle: '#1e2238'
        },
        vibe: {
          purple: '#a855f7',
          purpleDark: '#7e22ce',
          purpleLight: '#c084fc',
          cyan: '#06b6d4',
          cyanDark: '#0891b2',
          cyanLight: '#22d3ee',
          pink: '#ec4899',
          green: '#10b981',
          amber: '#f59e0b'
        }
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'glow-pink': '0 0 25px -5px rgba(236, 72, 153, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
