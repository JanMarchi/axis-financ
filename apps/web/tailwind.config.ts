import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1DB954',
          secondary: '#121212',
          accent: '#F0A500',
          danger: '#E53E3E',
          warning: '#F6AD55',
          success: '#48BB78',
          muted: '#718096',
        },
        envelope: {
          essential: '#4299E1',
          'non-essential': '#ED8936',
          growth: '#48BB78',
          investment: '#9F7AEA',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
}

export default config
