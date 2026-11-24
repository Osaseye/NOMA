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
        mono: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        noma: {
          canvas: '#F8FAFC',
          surface: '#FFFFFF',
          subtle: '#F1F5F9',
          border: '#E2E8F0',
          'border-strong': '#CBD5E1',
          ink: '#0F172A',
          'ink-secondary': '#334155',
          'ink-muted': '#64748B',
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
