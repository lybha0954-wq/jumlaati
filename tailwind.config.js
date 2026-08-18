/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  safelist: [
    // RoleSelector & Profile dynamic border and background colors
    'border-emerald-500', 'bg-emerald-50', 'dark:bg-emerald-950/30', 'dark:border-emerald-500',
    'hover:border-emerald-300', 'dark:hover:border-emerald-700', 'text-emerald-600', 'dark:text-emerald-400',
    'border-blue-500', 'bg-blue-50', 'dark:bg-blue-950/30', 'dark:border-blue-500',
    'hover:border-blue-300', 'dark:hover:border-blue-700', 'text-blue-600', 'dark:text-blue-400',
    'border-purple-500', 'bg-purple-50', 'dark:bg-purple-950/30', 'dark:border-purple-500',
    'hover:border-purple-300', 'dark:hover:border-purple-700', 'text-purple-600', 'dark:text-purple-400',
    'border-amber-500', 'bg-amber-50', 'dark:bg-amber-950/30', 'dark:border-amber-500',
    'hover:border-amber-300', 'dark:hover:border-amber-700', 'text-amber-600', 'dark:text-amber-400',
    // Topbar & Badges role badge colors
    'bg-purple-100', 'text-purple-800', 'dark:bg-purple-900/40', 'dark:text-purple-300',
    'bg-blue-100', 'text-blue-800', 'dark:bg-blue-900/40', 'dark:text-blue-300',
    'bg-emerald-100', 'text-emerald-800', 'dark:bg-emerald-900/40', 'dark:text-emerald-300',
    'bg-amber-100', 'text-amber-800', 'dark:bg-amber-900/40', 'dark:text-amber-300',
    // SignupForm & Notification warnings
    'bg-amber-50', 'border-amber-200', 'text-amber-700', 'dark:bg-amber-950/40', 'dark:text-amber-300',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
    },
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
        '2xl': 'calc(var(--radius) + 12px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Tajawal', 'sans-serif'],
        arabic: ['Tajawal', 'sans-serif'],
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
        md: '0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.07)',
        lg: '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.08)',
        xl: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};