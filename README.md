# Agent 知识站

把 `content-source/` 下四个 bot 收集的 Markdown 资料渲染成一个中文静态网站：Agent 工程实践简报、Prompt 库、Skill 库、Agent 软件工厂蓝图，外加全站搜索。

- 静态站点生成：Astro 7（`output: 'static'`）+ content collections
- Markdown：Astro 默认的 Sätteri 处理器，开启 `attributes` 特性来解析标题上的 `{#id}`
- 代码高亮：Astro 内置 Shiki（`github-light` / `github-dark` 双主题，跟随系统深色模式）
- 搜索：Pagefind，在 `astro build` 之后生成索引
- 包管理：pnpm

## 本地运行

需要 Node.js 22.23.4 及以上（Astro 7 的要求）和 pnpm。

```sh
pnpm install

# 开发模式（热更新）。注意：开发模式下没有 Pagefind 索引，/search/ 会提示索引尚未生成
pnpm dev

# 生产构建 + 本地预览（搜索可用）
pnpm build && pnpm preview
```

`pnpm build` 会依次执行 `astro build` 和 `pagefind --site dist`，产物在 `dist/`，搜索索引在 `dist/pagefind/`。

局域网访问预览：

```sh
pnpm preview --host 0.0.0.0 --port 4321
```

Astro 7 的 `astro preview` 启动后会转为后台守护进程，停止用 `pnpm astro preview stop`，查看状态用 `pnpm astro preview status`。

## 更新内容

内容全部来自 `content-source/`，站点代码不复制也不修改其中的文件。四个 bot 直接把文件提交到本仓库 main 分支的各自目录，步骤和令牌权限见 [docs/bot-upload.md](docs/bot-upload.md)。提交后线上自动更新（见下一节）。

本地手动更新：替换 `content-source/` 里的文件（保持下面的目录结构），再运行 `pnpm build`（预览中的话，再执行一次 `pnpm preview`）。

新增简报、Prompt 或 Skill 时，把文件放进对应目录，页面会自动生成，不用改代码。

| 源文件 | 页面 |
| --- | --- |
| `agent-practice/briefs/*.md` | `/briefs/<文件名>/`，列表在 `/briefs/`（按文件名里的日期倒序） |
| `agent-practice/concepts.md` | `/briefs/concepts/` |
| `agent-practice/watchlist.md` | `/briefs/watchlist/` |
| `prompt-collector/prompts/*.md` | `/prompts/<文件名>/`，列表在 `/prompts/`（可按分类和标签筛选） |
| `prompt-collector/sources.md` + `sources.jsonl` | `/prompts/sources/` |
| `prompt-collector/library-README.md` | `/prompts/about/` |
| `skill-collector/skills/*.md` | `/skills/<文件名>/`，列表在 `/skills/`（可按分类和标签筛选；格式见 docs/bot-upload.md） |
| `factory-architect/blueprint.md` | `/blueprint/`（带侧边目录） |
| `factory-architect/notes/*.md` | `/blueprint/notes/<文件名>/` |
| `factory-architect/sources.md` | `/blueprint/sources/` |

对内容格式的约定：

- 简报文件名必须以 `YYYY-MM-DD` 开头，日期从文件名取；标题取正文第一个 `# ` 标题，没有就用「日期 · 文件名」。
- Prompt 的 frontmatter 必须有 `title`、`category`、`date`，`tags` 为字符串数组；其余字段（`author`、`source_url`、`additional_sources`、`variants`、`status`）可选。字段缺失或类型不对时 `pnpm build` 会报错并指出文件。
- 源文件之间的相对链接（如 `[xx](kz-red-team-own-plan.md)`、`[xx](sources.md)`）在构建时改写成站内地址，规则在 `src/lib/rewrite-links.mjs`；新增一种源文件时要在那里加一条映射。
- 改了 `astro.config.mjs` 里的 Markdown 插件后，先删掉 `node_modules/.astro/data-store.json` 再构建，否则 Astro 会沿用缓存里的旧渲染结果。线上每次都是全新构建，不受影响。

## 发布到线上

线上地址 [kb.tapiro.app](https://kb.tapiro.app)，托管在 Cloudflare Workers（静态资源，访问免费不限量）。配置在 `wrangler.jsonc`：发布 `dist/`，绑定自定义域名 `kb.tapiro.app`，不存在的地址返回 `src/pages/404.astro`。

- 自动发布：Cloudflare Workers Builds 连接本仓库，main 分支每次提交执行 `pnpm build` 和 `npx wrangler deploy`。构建失败不发布，线上保持上一版；构建日志在 Cloudflare 后台 Workers & Pages → agent-knowledge-site → Deployments。
- 手动发布：`pnpm build && npx wrangler deploy`（需先 `npx wrangler login`）。
- pnpm 版本由 `package.json` 的 `packageManager` 固定，构建环境默认 Node 24。
- `/dev/library/*` 只在开发模式生成，不会发布。

## 界面设计约定

视觉参考 [Mobbin](https://mobbin.com/)：把站点做成「浏览资料库」，而不是「读文档」。不加载外部字体、图片或图标库。

- **配色与 token**：纯黑白，没有强调色。白底（深色模式 `#0a0a0a`），卡片画布是浅灰 `--canvas`，主按钮是黑色胶囊。所有颜色都在 `src/styles/tokens.css`，用 `light-dark()` 一次写好深浅两套。浅色模式的弱化文字 `--text-muted` 是 `#666666`，在所有浅灰底上对比度都不低于 4.5:1（WCAG AA）。
- **深浅色**：默认跟随系统；顶栏右侧按钮可手动切换，选择存在 `localStorage`，页面加载前由 `Base.astro` 里的内联脚本应用，不闪。
- **字体**：系统无衬线字体栈（SF / PingFang SC），标题字距收紧（-0.035em 到 -0.045em），正文字号用 `rem`，跟随用户的系统字号设置。
- **顶栏**：左边是标志和「简报 / Prompt / Skill / 蓝图」，中间是胶囊搜索框（提交到 `/search/?q=`），右边是深浅色切换。窄屏时搜索框单独占第二行。
- **卡片（`LibraryCard.astro`）**：灰色圆角画布里放一张白色「缩略页」，缩略页上方是分类，下面排出这条内容的真实开头（Prompt 原文、今日概念段落或笔记开头），摘录为空时才显示标题。画布下面是标题，以及「前两个标签 · 作者」（跳过和分类相同的标签；没有标签时显示分类）。摘录由 `src/lib/library.ts` 生成，最多 360 字（按字形截断，不会切开 emoji）。
- **首页**：紧凑的标题区（一句身份说明和「最新简报」入口），让卡片进入首屏；工具栏可切换 Prompt / 简报 / Skill，按「最新 / 按分类 / 有变体」排序，「筛选」展开分类按钮；网格下方是「按主题浏览」五列索引（Prompt 分类 / Prompt 标签 / Skill 分类 / 近期概念 / 蓝图章节）。
- **列表页**：Prompt、Skill、简报、研究笔记都用同一种卡片网格。Prompt 页和 Skill 页支持 `?category=`、`?tag=` 和 `?sort=`，首页另有 `?kind=`（Prompt / 简报 / Skill），筛选状态都同步到网址。
- **详情页**：阅读宽度 `44rem`；引用块和信息卡是浅灰圆角块；代码块里的纯文本 Prompt 自动换行。代码块的语言标签和复制按钮在构建时由 `src/lib/code-block.mjs` 生成，页面加载后不会跳动；表格可以用键盘聚焦后横向滚动。蓝图正文里重复的手写目录被隐藏，侧边目录高亮当前章节。
- **交互与动效**：悬停只改变颜色或底色，并且只在有鼠标的设备上生效（`@media (hover: hover) and (pointer: fine)`）；按钮按下缩到 0.97（160 ms）。开启「减少动态效果」时去掉位移和缩放。
- **手机**：设置了安全区边距、`touch-action: manipulation`，输入框字号 16 px，避免 iOS 自动放大。
- **开发时的极端数据检查**：`pnpm dev` 后打开 `/dev/library/worst/`（还有 `demo`、`empty`、`one`、`huge`），用 `src/lib/library.fixtures.ts` 里的极端数据渲染卡片网格。这个路由只在开发模式下生成，`pnpm build` 不会产出它。

## 目录结构

```text
content-source/          原始资料（只读）
src/content.config.ts    content collections 定义
src/lib/                 链接改写和代码块等 Markdown 插件、内容排序与摘要、资料库卡片数据、复制按钮和深浅色切换脚本
src/components/          资料库卡片和工具栏、分段导航、代码块、图标、Markdown 页面外壳
src/pages/               路由
src/styles/tokens.css    设计 token（颜色、圆角、阴影、渐变、动效，含深色模式）
src/styles/base.css      基础样式、顶部导航、页脚
src/styles/components.css 页头、胶囊按钮、标签、卡片网格、分段导航
src/styles/prose.css     正文排版、代码块、表格
docs/bot-upload.md       bot 上传指南
wrangler.jsonc           Cloudflare Workers 部署配置
```
