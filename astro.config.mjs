import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { rewriteSourceLinks } from './src/lib/rewrite-links.mjs';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  markdown: {
    processor: satteri({
      features: { attributes: true },
      mdastPlugins: [rewriteSourceLinks],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});
