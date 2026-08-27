/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  safelist: [
    // RoleSelector dynamic colors
    'border-emerald-500', 'bg-emerald-50', 'dark:bg-emerald-950/30', 'dark:border-emerald-500',
    'hover:border-emerald-300', 'dark:hover:border-emerald-700', 'text-emerald-600', 'dark:text-emerald-400',
    'border-blue-500', 'bg-blue-50', 'dark:bg-blue-950/30', 'dark:border-blue-500',
    'hover:border-blue-300', 'dark:hover:border-blue-700', 'text-blue-600', 'dark:text-blue-400',
    'border-purple-500', 'bg-purple-50', 'dark:bg-purple-950/30', 'dark:border-purple-500',
    'hover:border-purple-300', 'dark:hover:border-purple-700', 'text-purple-600', 'dark:text-purple-400',
    // Topbar role badge colors
    'bg-purple-100', 'text-purple-700', 'dark:bg-purple-900/40', 'dark:text-purple-300',
    'bg-blue-100', 'text-blue-700', 'dark:bg-blue-900/40', 'dark:text-blue-300',
    'bg-emerald-100', 'text-emerald-700', 'dark:bg-emerald-900/40', 'dark:text-emerald-300',
    // SignupForm supplier warning
    'bg-amber-50', 'border-amber-200', 'text-amber-700',
  ],
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        warning: {
          DEFAULT: 'var(--warning)',
          foreground: 'var(--warning-foreground)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          foreground: 'var(--danger-foreground)',
        },
        success: {
          DEFAULT: 'var(--success)',
          foreground: 'var(--success-foreground)',
        },
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'calc(var(--radius) - 4px)',
        md: 'var(--radius)',
        lg: 'calc(var(--radius) + 4px)',
        xl: 'calc(var(--radius) + 8px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Tajawal', 'sans-serif'],
        arabic: ['Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};