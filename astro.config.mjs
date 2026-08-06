// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.tyleryoung.design',
  integrations: [react(), mdx(), sitemap()],
  vite: { plugins: [tailwindcss()] },
  // 'directory' keeps the live site's extensionless URLs (/how-i-... ) intact.
  build: { format: 'directory' },
  // Two essays merged into one; their published URLs must keep resolving.
  redirects: {
    '/how-i-aligned-formative-vision': '/how-i-translated-design-work',
    '/how-i-built-a-shared-scoring-model': '/how-i-translated-design-work',
  },
});
