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
  // Pages that no longer exist but whose published URLs must keep resolving.
  // Two essays were merged into one; the TL;DR page was removed outright and
  // sends readers to the homepage, which now carries what it summarised.
  redirects: {
    '/tldr': '/',
    '/how-i-aligned-formative-vision': '/how-i-translated-design-work',
    '/how-i-built-a-shared-scoring-model': '/how-i-translated-design-work',
    '/how-i-infused-design-roles-with-product-thinking': '/how-i-managed-ux-complexity',
  },
});
