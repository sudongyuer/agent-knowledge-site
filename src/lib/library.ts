import { getCollection, type CollectionEntry } from 'astro:content';
import { getSortedBriefs, getSortedPrompts, promptSummary } from './content';

export interface LibraryItem {
  href: string;
  kind: '简报' | 'Prompt' | '笔记';
  title: string;
  label: string;
  meta: string;
  excerpt: string;
  category?: string;
  tags?: string[];
  hasVariants?: boolean;
}

export function collapseBlankLines(text: string) {
  return text.replace(/\n\s*\n/g, '\n').trim();
}

function plain(text: string) {
  const stripped = text
    .replace(/^---[\s\S]*?\n---\s*\n/, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\{#[^}]*\}/g, '')
    .replace(/[*`>#|]/g, '');
  return collapseBlankLines(stripped).slice(0, 360);
}

function promptExcerpt(entry: CollectionEntry<'prompts'>) {
  const block = (entry.body ?? '').match(/```[^\n]*\n([\s\S]*?)```/)?.[1];
  const summary = promptSummary(entry);
  return plain(block ? `${block}\n${summary}` : summary);
}

function briefExcerpt(body: string, fallback: string) {
  const section = body.split(/^##\s+今日概念.*$/m)[1]?.split(/^##\s/m)[0];
  return plain(section ?? fallback);
}

function firstAuthor(author?: string) {
  return author?.split(/[;；,，(（]/)[0].trim() ?? '';
}

export function countBy(values: string[]) {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-Hans-CN'));
}

export async function promptItems(): Promise<LibraryItem[]> {
  return (await getSortedPrompts()).map((p) => ({
    href: `/prompts/${p.id}/`,
    kind: 'Prompt',
    title: p.data.title,
    label: p.data.category,
    meta: firstAuthor(p.data.author),
    excerpt: promptExcerpt(p),
    category: p.data.category,
    tags: p.data.tags,
    hasVariants: (p.data.variants?.length ?? 0) > 0,
  }));
}

export async function briefItems(): Promise<LibraryItem[]> {
  return (await getSortedBriefs()).map(({ entry, meta }) => ({
    href: `/briefs/${meta.id}/`,
    kind: '简报',
    title: meta.conceptName ?? meta.title,
    label: meta.concept ? '今日概念' : '简报',
    meta: meta.date,
    excerpt: briefExcerpt(entry.body ?? '', meta.summary),
  }));
}

export async function noteItems(): Promise<LibraryItem[]> {
  const notes = await getCollection('factory', (e) => e.id.startsWith('notes/'));
  return notes
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((note) => ({
      href: `/blueprint/${note.id}/`,
      kind: '笔记',
      title: note.data.title ?? note.id,
      label: '研究笔记',
      meta: note.data.date ?? '',
      excerpt: plain((note.body ?? '').replace(/^#\s.*$/m, '')),
    }));
}
