import type { IconName } from '../components/Icon.astro';

interface NavItem {
  href: string;
  label: string;
  icon: IconName;
}

export const briefsNav: NavItem[] = [
  { href: '/briefs/', label: '全部简报', icon: 'briefs' },
  { href: '/briefs/concepts/', label: '概念库', icon: 'lightbulb' },
  { href: '/briefs/watchlist/', label: '关注名单', icon: 'eye' },
];

export const promptsNav: NavItem[] = [
  { href: '/prompts/', label: '全部 Prompt', icon: 'prompts' },
  { href: '/prompts/sources/', label: '来源清单', icon: 'link' },
  { href: '/prompts/about/', label: '关于本库', icon: 'book' },
];

export const blueprintNav: NavItem[] = [
  { href: '/blueprint/', label: '蓝图', icon: 'blueprint' },
  { href: '/blueprint/notes/', label: '研究笔记', icon: 'file' },
  { href: '/blueprint/sources/', label: '来源', icon: 'link' },
];
