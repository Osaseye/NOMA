/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        noma: {
          canvas: '#FFFFFF',
          surface: '#F6F7F9',
          subtle: '#EEF0F4',
          border: '#E5E7EB',
          'border-strong': '#D1D5DB',
          ink: '#0B1220',
          'ink-secondary': '#374151',
          'ink-muted': '#5E6675',
          cobalt: '#1049EB',
          'cobalt-hover': '#0D3BC2',
          'cobalt-tint': '#EEF3FE',
          amber: '#FEB719',
          'amber-text': '#B45309',
          'amber-bg': '#FFFBEB',
          'amber-border': '#FDE68A',
          success: '#15803D',
          'success-bg': '#F0FDF4',
          'success-border': '#BBF7D0',
          danger: '#B91C1C',
          'danger-bg': '#FEF2F2',
          'danger-border': '#FECACA',
        },
      },
    },
  },
  plugins: [],
}
