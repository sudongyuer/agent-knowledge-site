import path from 'node:path';
import { fileURLToPath } from 'node:url';

const contentRoot = fileURLToPath(new URL('../../content-source/', import.meta.url));

const routes = [
  [/^agent-practice\/briefs\/(.+)\.md$/, (m) => `/briefs/${m[1]}/`],
  [/^agent-practice\/concepts\.md$/, () => '/briefs/concepts/'],
  [/^agent-practice\/watchlist\.md$/, () => '/briefs/watchlist/'],
  [/^prompt-collector\/(?:prompts|entries)\/(.+)\.md$/, (m) => `/prompts/${m[1]}/`],
  [/^prompt-collector\/sources\.md$/, () => '/prompts/sources/'],
  [/^prompt-collector\/sources\.jsonl$/, () => '/prompts/sources/#sources-jsonl'],
  [/^prompt-collector\/library-README\.md$/, () => '/prompts/about/'],
  [/^factory-architect\/blueprint\.md$/, () => '/blueprint/'],
  [/^factory-architect\/notes\/(.+)\.md$/, (m) => `/blueprint/notes/${m[1]}/`],
  [/^factory-architect\/sources\.md$/, () => '/blueprint/sources/'],
];

function toRoute(url, fileURL) {
  if (!fileURL || /^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('#') || url.startsWith('/')) return null;
  const [target, hash = ''] = url.split('#');
  const absolute = path.resolve(path.dirname(fileURLToPath(fileURL)), target);
  const relative = path.relative(contentRoot, absolute).split(path.sep).join('/');
  for (const [pattern, build] of routes) {
    const match = relative.match(pattern);
    if (match) {
      const route = build(match);
      return hash && !route.includes('#') ? `${route}#${hash}` : route;
    }
  }
  return null;
}

export const rewriteSourceLinks = {
  name: 'rewrite-source-links',
  link(node, ctx) {
    const route = toRoute(node.url, ctx.fileURL);
    if (route) ctx.setProperty(node, 'url', route);
  },
};
