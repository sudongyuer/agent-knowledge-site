import type { LibraryItem } from './library';

const base = { kind: 'Prompt' as const, tags: ['方案评审'], hasVariants: false };

export const worstItems: LibraryItem[] = [
  {
    ...base,
    href: '/prompts/',
    title: '把一个跨越三个仓库、涉及支付与退款回滚的大型重构拆成可以独立合并的小 PR，并为每一步写好验收标准、灰度计划和回滚预案',
    label: '重构/降复杂度/遗留代码迁移与依赖升级',
    category: '重构/降复杂度/遗留代码迁移与依赖升级',
    meta: 'Christopher Alexander Montgomery III',
    excerpt:
      '先读 https://example.com/workspaces/acme/projects/q3-launch/docs/9f8e7d6c5b4a?tab=comments&filter=unresolved 里的评论，再列出每个仓库的依赖图。\n不要一次改完；每个 PR 只动一个边界。',
  },
  {
    ...base,
    href: '/prompts/',
    title: 'review-against-SPEC.md-and-report-only-correctness-affecting-gaps',
    label: '验证/自审',
    category: '验证/自审',
    meta: '@thisisaverylongusernamethatisallowed',
    excerpt: 'use a subagent to review bartholomew.fitzgerald.northwind.industries@example.com/rate-limiter/diff against SPEC.md',
  },
  { ...base, href: '/prompts/', title: 'UI', label: 'UI', category: 'UI', meta: '', excerpt: '' },
  {
    ...base,
    href: '/prompts/',
    title: '👩🏽‍💻 让 agent 先写 <script>alert(1)</script> 的转义测试 &amp; **再改**',
    label: '安全',
    category: '安全',
    meta: '陈美玲 (Tan Mei Ling)',
    excerpt: '<b>不要</b>直接渲染用户输入。\n\n\n\n连续空行之后的这一行应该还在。',
    hasVariants: true,
  },
  {
    ...base,
    href: '/prompts/',
    title: '已过期的邀请将在三十天后自动删除已过期的邀请将在三十天后自动删除',
    label: '运营',
    category: '运营',
    meta: 'Jo',
    excerpt: '已过期的邀请将在三十天后自动删除'.repeat(24),
  },
  {
    ...base,
    href: '/prompts/',
    title: 'Đặng Thị Ngọc Hân 的 Ólafur 式复盘：把返工沉淀成规则',
    label: '复盘沉淀',
    category: '复盘沉淀',
    meta: 'Nurul Aisyah binti Abdul Rahman',
    excerpt: 'Đặng Thị Ngọc Hân — Ólafur Darri Ólafsson — Seán O’Brien-Ó Súilleabháin',
  },
];

export function hugeItems(items: LibraryItem[]) {
  return Array.from({ length: 1000 }, (_, i) => ({ ...items[i % items.length], title: `${items[i % items.length].title} #${i + 1}` }));
}
