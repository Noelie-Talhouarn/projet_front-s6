/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
    ],
    theme: {
        extend: {
            colors: {
                // Fond "Nuit Profonde"
                night: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#302b63', // Violet sombre
                    800: '#24243e', // Bleu gris foncé
                    900: '#0f0c29', // Noir profond
                    950: '#050414',
                },
                // Accent "Étincelle" (Violet/Rose)
                spark: {
                    light: '#c084fc',
                    DEFAULT: '#7c3aed',
                    pink: '#ec4899',
                },
                // Accent "Lueur" (Orange/Ambre)
                glow: {
                    light: '#fbbf24',
                    DEFAULT: '#f59e0b',
                    orange: '#f97316',
                },
                primary: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                },
                dark: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                }
            },
            backgroundImage: {
                // Fond global
                'gradient-night': 'linear-gradient(to bottom right, #0f0c29, #302b63, #24243e)',
                // Accents
                'gradient-spark': 'linear-gradient(to right, #7c3aed, #ec4899)', // Violet -> Pink
                'gradient-glow': 'linear-gradient(to right, #c084fc, #ec4899, #f97316)', // Violet -> Pink -> Orange
                'gradient-btn': 'linear-gradient(to right, #6366f1, #ec4899)', // Indigo -> Pink
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.6s ease-out',
                'fade-in-down': 'fadeInDown 0.6s ease-out',
                'slide-up': 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
