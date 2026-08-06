import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const essays = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/essays' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    metaTitle: z.string(),
    // Every essay page on the live site ships description="Made with Framer".
    // Left optional so a missing one renders a visible [NEEDS] marker rather
    // than failing the build or getting silently invented.
    description: z.string().optional(),
    contribution: z.string(),
    role: z.string(),
    scope: z.string(),
    takeaway: z.string(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: 'tldr.md', base: './content' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string().optional(),
    summary: z.array(z.string()),
  }),
});

export const collections = { essays, pages };
