module.exports = {
  content: ["./pages/*.{html,js}", "./index.html", "./js/*.js"],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          50: "#E0FFFF", // lightcyan
          100: "#B0FFFF", // paleturquoise
          200: "#87CEEB", // skyblue
          300: "#48CAE4", // custom teal-300
          400: "#00B4D8", // custom teal-400
          500: "#00CED1", // darkturquoise
          600: "#20B2AA", // lightseagreen
          700: "#008B8B", // darkcyan
          800: "#006666", // custom teal-800
          900: "#004444", // custom teal-900
          DEFAULT: "#00CED1", // darkturquoise
        },
        
        // Secondary Colors
        secondary: {
          DEFAULT: "#20B2AA", // lightseagreen
          dark: "#008B8B", // darkcyan
        },
        
        // Accent Colors
        accent: {
          DEFAULT: "#8B5CF6", // violet-500
          50: "#F5F3FF", // violet-50
          100: "#EDE9FE", // violet-100
          200: "#DDD6FE", // violet-200
          300: "#C4B5FD", // violet-300
          400: "#A78BFA", // violet-400
          500: "#8B5CF6", // violet-500
          600: "#7C3AED", // violet-600
          700: "#6D28D9", // violet-700
          800: "#5B21B6", // violet-800
          900: "#4C1D95", // violet-900
        },
        
        // Background Colors
        background: {
          DEFAULT: "#020617", // slate-950
          light: "#0F172A", // slate-900
        },
        
        // Surface Colors
        surface: {
          50: "#F8FAFC", // slate-50
          100: "#F1F5F9", // slate-100
          200: "#E2E8F0", // slate-200
          300: "#CBD5E1", // slate-300
          400: "#94A3B8", // slate-400
          500: "#64748B", // slate-500
          600: "#475569", // slate-600
          700: "#334155", // slate-700
          800: "#1F2937", // gray-800
          900: "#0F172A", // slate-900
          DEFAULT: "#1F2937", // gray-800
        },
        
        // Text Colors
        text: {
          primary: "#FFFFFF", // white
          secondary: "#9CA3AF", // gray-400
          muted: "#6B7280", // gray-500
        },
        
        // Status Colors
        success: {
          50: "#ECFDF5", // green-50
          100: "#D1FAE5", // green-100
          200: "#A7F3D0", // green-200
          300: "#6EE7B7", // green-300
          400: "#34D399", // green-400
          500: "#10B981", // emerald-500
          600: "#059669", // emerald-600
          700: "#047857", // emerald-700
          800: "#065F46", // emerald-800
          900: "#064E3B", // emerald-900
          DEFAULT: "#10B981", // emerald-500
        },
        
        warning: {
          50: "#FFFBEB", // amber-50
          100: "#FEF3C7", // amber-100
          200: "#FDE68A", // amber-200
          300: "#FCD34D", // amber-300
          400: "#FBBF24", // amber-400
          500: "#F59E0B", // amber-500
          600: "#D97706", // amber-600
          700: "#B45309", // amber-700
          800: "#92400E", // amber-800
          900: "#78350F", // amber-900
          DEFAULT: "#F59E0B", // amber-500
        },
        
        error: {
          50: "#FEF2F2", // red-50
          100: "#FEE2E2", // red-100
          200: "#FECACA", // red-200
          300: "#FCA5A5", // red-300
          400: "#F87171", // red-400
          500: "#EF4444", // red-500
          600: "#DC2626", // red-600
          700: "#B91C1C", // red-700
          800: "#991B1B", // red-800
          900: "#7F1D1D", // red-900
          DEFAULT: "#EF4444", // red-500
        },
      },
      
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        data: ['JetBrains Mono', 'monospace'],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      
      boxShadow: {
        'medical': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'medical-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'medical-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      
      animation: {
        'fade-in': 'fadeIn 200ms ease-in-out',
        'slide-up': 'slideUp 300ms ease-out',
        'scale-in': 'scaleIn 200ms ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
      
      transitionTimingFunction: {
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'out': 'cubic-bezier(0, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}