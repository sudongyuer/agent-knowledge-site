在当前目录（~/work/agent-knowledge-site）从零搭一个中文静态知识网站，内容全部来自 content-source/ 下的 markdown 文件（不要改动 content-source 里的文件，不要编造任何内容）。

内容来源（三个 bot 收集的资料）：
- content-source/agent-practice/：每日「agent 工程实践」简报（briefs/*.md，文件名带日期）、concepts.md（已讲过的概念）、watchlist.md（关注名单）。
- content-source/prompt-collector/：prompts/*.md（28 条 prompt，frontmatter 有 title、category、tags、author、source_url、date、id 等）、sources.md、sources.jsonl、library-README.md。
- content-source/factory-architect/：blueprint.md（工厂蓝图，标题带 {#id} 锚点写法，需要用插件支持或处理掉）、notes/*.md、sources.md。

技术：Astro（静态输出）+ content collections，用 pnpm。用 Pagefind 做全站搜索。代码高亮用 Astro 自带的 Shiki。不需要后端。

站点结构：
1. 首页：三块入口 + 最近 5 期简报 + 最新收录的 prompt。
2. 简报：按日期倒序列表，每期一个详情页；概念库页（来自 concepts.md）；关注名单页。
3. Prompt 库：卡片列表，可以按 category 和 tags 在页面上筛选（客户端 JS 即可），每条详情页显示场景、完整 prompt、坑和改进、来源链接和作者；所有代码块都要有「复制」按钮。来源清单页。
4. 工厂蓝图：完整渲染 blueprint.md，带侧边目录（TOC）和锚点跳转；研究笔记和来源页。
5. 全站搜索页（Pagefind）。

设计：干净、易读，适合长时间阅读中文技术内容；支持深色模式（跟随系统）；移动端友好（手机上也要好读）；代码块横向可滚动不撑破布局。

验收标准（全部满足才算完成）：
- `pnpm build` 成功，无报错；Pagefind 索引在 build 后生成。
- 每个源文件都有对应页面：简报页数量 = briefs/*.md 数量，prompt 详情页数量 = prompts/*.md 数量；在最后的总结里贴出实际数量对比。
- blueprint.md 渲染后不出现字面的 `{#` 文本；TOC 链接能跳转。
- 所有外部链接保留原始 URL。
- 写一个 README.md：如何本地运行（pnpm dev / pnpm build && pnpm preview）、如何更新内容（替换 content-source 后重新 build）。
- 最后启动 `pnpm preview --host 0.0.0.0 --port 4321` 在后台运行（用 nohup，日志写到 preview.log），并用 curl 检查首页、一期简报、一条 prompt、蓝图页都返回 200，贴出结果。
完成后输出简短总结：技术栈、页面数量、预览地址、已知问题。
