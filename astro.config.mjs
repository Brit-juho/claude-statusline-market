import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://brit-juho.github.io',
  base: '/claude-statusline-market',
  integrations: [preact({ compat: true })],
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    optimizeDeps: {
      esbuildOptions: {
        plugins: [{
          // @astrojs/preact/server.js imports "astro:preact:opts" (a Vite virtual module).
          // esbuild's dep optimizer doesn't have access to Vite plugins, so it can't
          // resolve virtual modules. Mark it external so optimization proceeds cleanly.
          name: 'external-astro-preact-opts',
          setup(build) {
            build.onResolve({ filter: /^astro:preact:opts$/ }, () => ({ external: true }));
          },
        }],
      },
    },
  },
});
