import { fileURLToPath, URL } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  css: [
    '~/assets/main.css'
  ],
  app: {
      head: {
        title: '实习两年半-个人主页',
        meta: [
          { name: 'description', content: '一个基于 Nuxt 的,windows 风格个人主页' }
        ]
      }
    },
  alias: {
    '@': fileURLToPath(new URL('./app', import.meta.url))
  },

  nitro: {
    preset: "cloudflare_module",

    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  },

  modules: ["nitro-cloudflare-dev", "@pinia/nuxt"]
})