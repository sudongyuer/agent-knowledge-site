import { getCollection, type CollectionEntry } from 'astro:content';

export interface BriefMeta {
  id: string;
  date: string;
  title: string;
  hasOwnTitle: boolean;
  concept?: string;
  conceptName?: string;
  conceptDesc?: string;
  summary: string;
}

function firstHeading(body: string) {
  return body.match(/^#\s+(.+)$/m)?.[1].trim();
}

function firstParagraph(body: string) {
  for (const block of body.split(/\n\s*\n/)) {
    const text = block.trim();
    if (!text || /^(#|```|\||---|-\s|\d+\.\s)/.test(text)) continue;
    return text
      .replace(/^>\s?/gm, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  return '';
}

function conceptLine(body: string) {
  return body.match(/^##\s+今日概念[:：]\s*(.+)$/m)?.[1].trim();
}

export function briefMeta(entry: CollectionEntry<'briefs'>): BriefMeta {
  const body = entry.body ?? '';
  const date = entry.id.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? '';
  const heading = firstHeading(body);
  const concept = conceptLine(body);
  const [, conceptName, conceptDesc] = concept?.match(/^(.+?)[：:]\s*(.+)$/) ?? [undefined, concept];
  return {
    id: entry.id,
    date,
    title: heading ?? `${date} · ${entry.id.slice(date.length + 1)}`,
    hasOwnTitle: Boolean(heading),
    concept,
    conceptName,
    conceptDesc,
    summary: concept ? `今日概念：${concept}` : firstParagraph(body),
  };
}

export async function getSortedBriefs() {
  const entries = await getCollection('briefs');
  return entries
    .map((entry) => ({ entry, meta: briefMeta(entry) }))
    .sort((a, b) => b.meta.date.localeCompare(a.meta.date) || b.meta.id.localeCompare(a.meta.id));
}

export async function getSortedPrompts() {
  const entries = await getCollection('prompts');
  return entries.sort(
    (a, b) => b.data.date.localeCompare(a.data.date) || a.data.title.localeCompare(b.data.title, 'zh-Hans-CN'),
  );
}

export function promptSummary(entry: CollectionEntry<'prompts'>) {
  const section = (entry.body ?? '').split(/^##\s+解决什么问题\s*$/m)[1] ?? '';
  return firstParagraph(section.split(/^##\s/m)[0]);
}

export function hasLeadingH1(body: string | undefined) {
  return /^\s*#\s+/.test((body ?? '').replace(/^---[\s\S]*?\n---\s*\n/, ''));
}
