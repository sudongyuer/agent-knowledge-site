import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const dateString = z.union([z.string(), z.date()]).transform((d) =>
  typeof d === 'string' ? d : d.toISOString().slice(0, 10),
);

const briefs = defineCollection({
  loader: glob({ pattern: '*.md', base: './content-source/agent-practice/briefs' }),
});

const agentPages = defineCollection({
  loader: glob({ pattern: ['concepts.md', 'watchlist.md'], base: './content-source/agent-practice' }),
});

const prompts = defineCollection({
  loader: glob({ pattern: '*.md', base: './content-source/prompt-collector/prompts' }),
  schema: z.looseObject({
    title: z.string(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    author: z.string().optional(),
    source_url: z.string().optional(),
    additional_sources: z.array(z.string()).optional(),
    variants: z.array(z.string()).optional(),
    date: dateString,
    status: z.string().optional(),
  }),
});

const promptPages = defineCollection({
  loader: glob({ pattern: ['sources.md', 'library-README.md'], base: './content-source/prompt-collector' }),
});

const promptSources = defineCollection({
  loader: file('./content-source/prompt-collector/sources.jsonl', {
    parser: (text) =>
      text
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => JSON.parse(line)),
  }),
  schema: z.looseObject({
    name: z.string(),
    url: z.string(),
    type: z.string().optional(),
    domains: z.array(z.string()).optional(),
    priority: z.string().optional(),
    cadence: z.string().optional(),
    why: z.string().optional(),
    lang: z.string().optional(),
    last_verified: z.string().optional(),
  }),
});

const factory = defineCollection({
  loader: glob({ pattern: ['blueprint.md', 'sources.md', 'notes/*.md'], base: './content-source/factory-architect' }),
  schema: z.looseObject({
    title: z.string().optional(),
    date: dateString.optional(),
    tags: z.array(z.string()).optional(),
    source: z.string().optional(),
  }),
});

export const collections = { briefs, agentPages, prompts, promptPages, promptSources, factory };
