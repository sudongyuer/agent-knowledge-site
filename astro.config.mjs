import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { rewriteSourceLinks } from './src/lib/rewrite-links.mjs';
import { codeBlockBar } from './src/lib/code-block.mjs';
import { scrollableTables } from './src/lib/scrollable-tables.mjs';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  markdown: {
    processor: satteri({
      features: { attributes: true },
      mdastPlugins: [rewriteSourceLinks],
      hastPlugins: [codeBlockBar, scrollableTables],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});
