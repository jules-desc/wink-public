// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  // SSR activé (contrairement à Wink ATS qui est en SPA)
  ssr: true,

  devtools: {
    enabled: true
  },

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      titleTemplate: '%s | Mon Employeur Public',
      meta: [
        { name: 'description', content: 'Découvrez les collectivités territoriales qui recrutent. Offres d\'emploi, marque employeur et informations pratiques.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  // Le design system est conçu en thème clair uniquement.
  ui: {
    colorMode: false
  },

  runtimeConfig: {
    brandingApiKey: '',
    public: {
      siteUrl: ''
    }
  },

  routeRules: {
    '/': { prerender: true },
    '/sitemap.xml': { swr: 3600 },
    '/robots.txt': { swr: 86400 },
    // Pages établissements : ISR avec revalidation toutes les 24h
    '/etablissement/**': { swr: 86400 },
    // Pages listing : ISR avec revalidation toutes les heures
    '/departement/**': { swr: 3600 },
    '/region/**': { swr: 3600 },
    // API : pas de cache côté CDN
    '/api/**': { cors: true }
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  fonts: {
    defaults: {
      weights: [400, 500, 600, 700, 800],
      styles: ['normal', 'italic']
    }
  }
})
