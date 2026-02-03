// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/icon', '@nuxt/fonts', '@nuxtjs/tailwindcss'],
  css: ['~/assets/css/fonts.css'],

  // Configuration des variables accessibles côté client
  runtimeConfig: {
    public: {
      // Cette clé sera remplacée par la valeur définie dans Vercel (NUXT_PUBLIC_API_BASE)
      // En local, elle utilisera http://localhost:3002
      apiBase: '',
      // J'ai vidé cette valeur pour forcer l'utilisation du proxy local (/api)
      // Cela évite les erreurs CORS. Si besoin d'une URL absolue, utilisez NUXT_PUBLIC_API_BASE.
      cloudinaryCloudName: process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
      cloudinaryUploadPreset: process.env.NUXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''
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
        { rel: 'stylesheet', href: 'https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css' },
        { rel: 'stylesheet', href: 'https://cdn-uicons.flaticon.com/uicons-solid-rounded/css/uicons-solid-rounded.css' },
        { rel: 'stylesheet', href: 'https://use.typekit.net/srk1caa.css' },
        { rel: 'icon', type: 'image/x-icon', href: '/faviconEtincelle.ico' } // Le "/" pointe vers le dossier public
      ]
    }
  }
})