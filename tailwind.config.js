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
                // Fond "Crépuscule d'Améthyste"
                night: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                    700: '#4c1d95', // Violet royal
                    800: '#2d1b4e', // Prune profond
                    900: '#1a0e2e', // Noir améthyste
                    950: '#0f0721',
                },
                // Accent "Étincelle" (Magenta/Lavande)
                spark: {
                    light: '#f0abfc',
                    DEFAULT: '#d946ef',
                    pink: '#f472b6',
                },
                // Accent "Lueur" (Or/Champagne)
                glow: {
                    light: '#fef3c7',
                    DEFAULT: '#fcd34d',
                    orange: '#fbbf24',
                },
                primary: {
                    50: '#faf5ff',
                    100: '#f3e8ff',
                    200: '#e9d5ff',
                    300: '#d8b4fe',
                    400: '#c084fc',
                    500: '#a855f7',
                    600: '#9333ea',
                    700: '#7e22ce',
                    800: '#6b21a8',
                    900: '#581c87',
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
                'gradient-night': 'linear-gradient(to bottom right, #1a0e2e, #2d1b4e, #0f0721)',
                // Accents
                'gradient-spark': 'linear-gradient(to right, #d946ef, #a855f7)', // Magenta -> Violet
                'gradient-glow': 'linear-gradient(to right, #fcd34d, #d946ef, #f472b6)', // Or -> Magenta -> Rose
                'gradient-btn': 'linear-gradient(to right, #7e22ce, #d946ef)', // Violet royal -> Magenta
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                zen: ['amandine', 'sans-serif'],
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.6s ease-out',
                'fade-in-down': 'fadeInDown 0.6s ease-out',
                'slide-up': 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            },
            fontSize: {
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
    plugins: [
        function ({ addBase }) {
            addBase({
                'html': { fontSize: '16px' },
                'body': { fontSize: '16px', lineHeight: '1.5' },
            })
        }
    ],
}
