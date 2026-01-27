// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/icon', '@nuxt/fonts', '@nuxtjs/tailwindcss'],

  runtimeConfig: {
    public: {
      apiUrl: '' // Vide pour utiliser le proxy relatif
    }
  },

  routeRules: {
    '/api/**': {
      proxy: (process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3002') + '/api/**'
    }
  },

  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap' },
        { rel: 'stylesheet', href: 'https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css' }
      ]
    }
  }
})