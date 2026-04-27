import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://netriogit.github.io',
  base: '/claude-statusline-market',
  integrations: [],
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
