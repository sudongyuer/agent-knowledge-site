# Design / UI 方向的 Agent 最佳实践（专题，2026-11-18）

这份专题是因为两件事：知识站上一版被评为丑（Dribbble 风、玻璃导航、渐变卡片）；同时觉得还少了「收集 design skill」这一块。下面只写今天实际读到的原文，star 数是 2026-11-18 从 GitHub API 查到的。

**以前简报已经点过、这次是加深，不是新发现：**
- `frontend-design`：11-17 补课只写了一句「避开一看就是 AI 做的通用审美」和安装命令，没有展开做法。
- `DESIGN.md` 和 `awesome-design-md`：11-17 补课第 5 条已经给过起草 prompt。
- Expo 的 `expo-design-system` / 原生 UI skill：11-17 补课第 2 条。
- Superpowers（含 brainstorming）：11-17 用户问起后补过，但没专门用在设计上。
- 怎么验证一个 skill 好不好（留出验证集、分数严格变高才采纳）：今天（11-18）日常简报的 SkillOpt 条。

**这次新展开的：**官方 Frontend Aesthetics Cookbook 和 Anthropic 文章里的具体做法；官方 skill 里那 5 类「新的 AI 默认长相」（已经不只是紫色渐变了）；截图自我审查；Matt Pocock 的「先做 3 个结构不同的方案」；Taste Skill（11-17 补课文末写过「看过未收」）。

---

先记住一个关键结论：上次让 Claude Code「做成 Dribbble 这种风格」，几乎是在邀请它走官方 frontend-design skill 点名的第 4 种默认长相——内容切成同样圆角的卡片、统一软阴影、用渐变当装饰，再配上玻璃导航。要改好看，先换提问方式，再装对 skill，最后用截图检查，而不是再丢一个更空的形容词。

## 1. 先装官方 frontend-design，写代码前先交一份短设计方案，并对着「AI 默认长相」自查

- **要点**：Anthropic 官方说明，不给指导时模型会收敛到训练数据里最安全的样子，也就是常说的「AI slop」：Inter 字体、白底紫渐变、很少动画。官方 skill 要求先当设计负责人：根据这个产品的题材选定方向，写出 4–6 个颜色、字体角色、布局概念（可用 ASCII 线框）和几条原则；如果这份方案看起来「换成别的同类网站也会长这样」，就先改方案，再写代码。官方 skill 还列出了 2026 年常见的 5 类新默认长相，包括：奶油底 + 衬线标题 + 陶土色点缀、黑底 + 一条亮绿或朱红、报纸排版、**SaaS 卡片套件**（统一圆角卡片 + 同样的浅灰阴影 + 渐变装饰）、以及各种模板配件（全大写眉题、用「·」串起来的元信息、按钮后面加「→」）。这些在某些项目里是合理的，但它们是默认，不是选择。skill 原文写：「一张图值 1000 个 token」，环境允许的话，边做边截图审查。

```
目标：为当前项目的一个页面（或一次视觉改版）先做设计方案，再实现。我确认方案之前，不要改任何文件。

1. 先确认（或向我提议并等我确认）这三件事：这个产品/页面的题材是什么、给谁用、它最主要的工作是什么。没有题材就不要开始选颜色和字体。
2. 读官方 frontend-design skill（如果已安装就加载它；没装先告诉我，用下面的参考文章代替）。写出一份短设计方案，只放在对话里：
   - 颜色：4–6 个有名字的十六进制色值，并说明各自用途；
   - 字体：最多两个家族，写清标题/正文角色，以及为什么选它们而不是 Inter / Roboto / Arial / 系统字体 / Space Grotesk；
   - 布局：用一两句话加上一个 ASCII 线框，说明对齐方式（左对齐 / 居中等）；
   - 原则：这个页面凭什么不像「任意一个同类页面的默认稿」。
3. 对照官方 skill 里的 5 类「AI 默认长相」和 Cookbook 里点名的忌讳（Inter/Roboto/Arial、白底紫渐变、可预测的卡片布局），逐项说明这份方案避开了什么、如果某项看起来像默认，你改了什么、为什么。
4. 把方案给我看。我确认之前不要写或改任何文件。我确认后，严格按方案实现，不要中途换一套没讨论过的审美。
5. 验收：实现后的颜色/字体/间距能在代码里对应到方案中的 token；你能指出至少一处「为这个题材做过的、换成别的网站就不成立」的选择；如果环境能打开页面，请截桌面和手机图，对照方案做一轮自我审查，把截图路径和修改点列出来。

参考：
- https://github.com/anthropics/claude-plugins-official/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md （Prithvi Rajasekaran、Alexander Bricken）
- https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics （Prithvi Rajasekaran，2025-10-21）
- https://claude.com/resources/articles/improving-frontend-design-through-skills （Prithvi Rajasekaran、Justin Wei、Alexander Bricken）
```

来源：[frontend-design SKILL.md](https://github.com/anthropics/claude-plugins-official/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md)（Prithvi Rajasekaran、Alexander Bricken）；[Prompting for frontend aesthetics](https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics)（Prithvi Rajasekaran）；[Improving frontend design through Skills](https://claude.com/resources/articles/improving-frontend-design-through-skills)（Anthropic Applied AI）

## 2. 不要丢「Dribbble 风」「现代、高级、有质感」这种空词；要给题材、禁止项和具体参考

- **要点**：官方 Cookbook 总结了三件一直比较有效的事：分别盯字体、颜色、动效、背景这几个维度；给具体灵感（比如某种编辑排版、某个 IDE 主题、某个真实网站），但不要规定死每一个像素；并把模型爱用的默认选项明确写进「不要用」。Anthropic 文章还提醒：提示要在合适的「高度」——既不要低到只报一组十六进制就不管原则，也不要高到只说「做得好看一点」。上次知识站改版被评为丑，正是因为「Dribbble 风」太空，模型只能搬最常见的作品集套路。

```
目标：根据我给的题材和参考，为当前项目重做一个页面的视觉方向。先出方案，我确认之前不要改文件。

1. 先用自己的话复述：这个页面是给谁看的、用户来了要完成什么、哪些内容必须保留（不要改文案内容，除非我另说）。
2. 不要使用这些空词当方向：Dribbble 风、现代感、高级感、精致、玻璃拟态、糖果渐变。如果我刚才用了这类词，请把它们翻译成下面这种具体约束后再设计。
3. 请基于这个题材提出一个明确方向（一句话），并列出：
   - 要学习的 1–2 个具体参考（真实网站或我提供的截图：布局/字体/疏密分别学什么，不要整页抄）；
   - 明确禁止：Inter / Roboto / Arial / 系统默认字体、白底紫渐变、所有卡片同一个圆角和同一层软阴影、玻璃导航、每个区块都做上浮悬停、每个标题上面加全大写眉题。
   - 字体、主色、背景、动效各写一条具体决定（动效默认只保留一个有意义的时刻，不要每个卡片都闪）。
4. 把方案和一张 ASCII 线框给我看。我确认后你再改代码。
5. 验收：你能指出方案里至少 3 处是为这个题材做的、不能原样搬到别的网站的选择；实现后截桌面和手机图，对照禁止项做检查清单，每项写「有/无」并指出文件位置。

参考：https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics （Prithvi Rajasekaran）
```

来源：同上 Cookbook；官方文章里「在合适的高度写提示」一节。

## 3. 把视觉规范写成 DESIGN.md（token + 理由），并让 agent 每次做 UI 先读它

- **要点**：这条 11-17 补课已经讲过，这里只补工作流。Google Labs 的 DESIGN.md 分两层：机器能精确执行的 token（颜色、字体、圆角、间距、组件），加上人能读懂的「为什么这样」。格式目前仍是 alpha，规范和 CLI 还会变。配套的 awesome-design-md 收集了大量品牌 DESIGN.md，适合当参考，不适合整份复制成自己的品牌。写好后可用 `npx @google/design.md lint DESIGN.md` 检查坏掉的 token 引用和对比度。第三方指南常见的接法是在 `CLAUDE.md` 里写「做 UI 前先完整读 @DESIGN.md，不要发明文件里没有的颜色、字体和间距」。

```
目标：为当前项目起草一份只属于这个产品的 DESIGN.md。先出草稿，我确认之前不要写入文件。

1. 先读 https://github.com/google-labs-code/design.md 的规范（YAML token + markdown 理由）。再扫一遍项目里现有的颜色、字体、间距、圆角（从样式文件和组件里收集，不要猜），列出「实际在用、但不一致」的清单。
2. 结合产品的题材和受众（先向我确认这三句话：产品是什么、给谁用、视觉上要避免什么），起草 DESIGN.md：token 必须来自现有代码或我确认过的新值；理由部分用大白话写清为什么是这些值。不要整份复制 awesome-design-md 里某个品牌的文件。
3. 草稿和「不一致清单」先给我看。我确认后再写 DESIGN.md。
4. 写完后运行 `npx @google/design.md lint DESIGN.md`，贴出完整 JSON 输出。如果 lint 失败，先修文件再重跑，不要只说「已通过」。
5. 另外给一段建议加进 CLAUDE.md / AGENTS.md 的短文字（先给我看，不要直接改这些文件）：要求做 UI 前先读 @DESIGN.md，只用其中的颜色、字体、间距，不要另起一套。
6. 验收：lint 退出码为 0，或你列出每一条失败及对应修改；文件里每个 token 都能在项目里找到来源或我的确认记录。

参考：https://github.com/google-labs-code/design.md （Google Labs）；https://github.com/VoltAgent/awesome-design-md （VoltAgent，只作范例）
```

来源：[google-labs-code/design.md](https://github.com/google-labs-code/design.md)（Google Labs，28,942 star）；[VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)（VoltAgent，128,098 star）

## 4. 做完必须看像素：用真浏览器截桌面和手机图，再对照清单改，不要只读代码

- **要点**：官方 frontend-design skill 明确说，环境支持的话要截图自我审查，「一张图值 1000 个 token」，并引用香奈儿的建议：出门前照镜子，拿掉一件饰品。只看 CSS 猜观感，很容易漏掉对比度不够、行长过宽、手机上挤成一团、玻璃效果其实没模糊这些问题——上一版知识站的玻璃导航，agent 自己也没在真浏览器里验证过。社区里 Taste Skill 把这件事做成了硬门槛：用无头 Chrome 在 1440 / 1024 / 768 / 390 等宽度渲染，检查对比度、对齐、占位文案等，最多三轮，还有未修完的 FAIL 就不许收工。Anthropic 的 `webapp-testing` skill 则教 agent 用 Playwright 截图和检查本地页面。

```
目标：对当前已经在跑的页面做一轮「看像素」的设计审查，先出报告，我确认之前不要改代码。

1. 确认预览地址（或由我提供）。如果页面没在跑，先按项目已有命令启动，不要另起一套构建。
2. 用 Playwright 或项目里已有的浏览器工具，在至少两个宽度截完整页面图：桌面约 1440×900，手机约 390×844（或 375×812）。如果工具不可用，明确告诉我缺什么、怎么装，等我同意再装；不要假装看过页面。
3. 把截图保存到一个临时目录，路径发给我。然后对照下面清单逐项看图（不要只看代码）：
   - 对比度：正文和背景是否够清楚；弱对比的文字标出大致位置；
   - 行长和层级：正文是否过宽、标题和正文是否分得清；
   - 间距和对齐：是否忽疏忽密、列是否对不齐；
   - 响应式：手机上是否要横滑、字是否过小、点击区域是否过小；
   - AI 默认长相：玻璃导航、统一渐变卡片、同一种软阴影、全大写眉题、每个卡片都悬停浮起、Inter/紫渐变等，有则指出；
   - 动效：是否尊重系统的「减少动效」，是否到处都在动。
4. 每条问题写：截图文件名、问题位置、它为什么不好、你建议改哪几个文件。报告里区分「必须改」和「可选」。
5. 我确认「必须改」的条目后，你再改。每改一轮，重新截同样宽度的图，把前后图放在一起对比，直到必须改的项清掉或你说明清不掉的原因。
6. 验收：前后截图都在；每条已改问题都能在新截图里对上；不要只说「已经好看了」。

参考：frontend-design SKILL.md「Restraint and self-critique」；https://github.com/anthropics/skills/tree/main/skills/webapp-testing ；https://github.com/Leonxlnx/taste-skill （浏览器检查与 finish gate）
```

来源：官方 frontend-design skill；[anthropics/skills webapp-testing](https://github.com/anthropics/skills/tree/main/skills/webapp-testing)；[Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)（Leonxlnx，118,263 star）

## 5. 先做 3 个「结构不同」的方案给你看，再定稿；不要只改配色

- **要点**：Matt Pocock 的 `prototype` skill 专门解决「还没想清楚这个页面该长什么样」。默认做 3 个方案（最多 5 个），它们必须在布局和信息层级上真正不同，而不是同一套卡片换颜色。最好把方案做在已有页面上，用真实内容和真实导航来判断，用 `?variant=` 和一个浮动切换条来回看。选定后再把赢家折进正式代码，其余放到临时分支，不要留在主分支。obra/superpowers 的 brainstorming 也要求：先把做法摆出来让你挑，写短设计文档并得到批准，再写实现计划；需要时可以打开一个浏览器页给你看线框，但先问你同不同意。Simon Willison 转述 Anthropic 设计负责人 Jenny Wen 的观点：现在做东西的成本变低了，更关键的是你选择和筛选的能力，多做原型再挑选，比先走完一套重流程更合适。

```
目标：为当前这个页面探索视觉方向。先做 3 个结构不同的可切换原型，我选定之前不要把任何一版当成正式实现，也不要改生产文案内容。

1. 先读现有页面和样式，用几句话说明它现在怎么排、主要问题是什么（尽量配现有截图或你新截的图）。
2. 提出 3 个方案，每个用一句话说明「和另外两个在结构上有什么不同」（例如：阅读优先的单栏排版 / 左侧目录的工作室排版 / 把检索当主角的工具排版）。不要做「同一套卡片网格只换配色」。
3. 把方案和线框先给我看。我确认这 3 个方向后，再在现有路由或一个明显带 prototype 字样的临时路由上实现，用 ?variant=A|B|C 切换；做一条不会被当成设计一部分的浮动切换条（生产构建里要关掉）。用真实内容，不要编造新的营销文案。
4. 实现后给出预览地址和三个 variant 链接，并截三套桌面/手机图。
5. 我选定一个（或说「要 B 的标题、C 的列表」）之后，先告诉我你打算怎么折进正式页面、会删掉什么。我确认后，再把赢家写入正式样式，删掉切换条和落选方案，不要把原型代码留在主分支。
6. 验收：三个方案的结构差异能在截图里一眼看出；正式代码里不再有 prototype 切换条；内容文件没有被改写。

参考：https://github.com/mattpocock/skills/blob/main/skills/engineering/prototype/UI.md （Matt Pocock）；https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md （Jesse Vincent）；https://simonwillison.net/2026/jan/24/dont-trust-the-process/ （Simon Willison 转述 Jenny Wen）
```

来源：[mattpocock/skills prototype](https://github.com/mattpocock/skills/blob/main/skills/engineering/prototype/UI.md)（Matt Pocock，仓库 327,314 star）；[obra/superpowers brainstorming](https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md)（Jesse Vincent，319,854 star）；[Don't "Trust the Process"](https://simonwillison.net/2026/jan/24/dont-trust-the-process/)（Simon Willison 转述 Jenny Wen）

## 6. 给 agent 看真实参考图或真实网站，而不是只靠文字形容「好看」

- **要点**：Taste Skill 的定位是：靠艺术指导、参考图，再加上浏览器检查，而不是拼一个通用落地页。它会先按业务类型选色和字体、选一种英雄区布局，再用真浏览器检查后才交卷。官方 Cookbook 也把「给出设计灵感」列为三件有效策略之一。注意：Taste Skill 很适合公司官网/产品落地页，默认「一屏一个区块、固定导航」这类套路；知识站、文档站不一定该整套照搬，可以只学它的「先规划、再检查」和「用真实参考」这两步。你自己有喜欢的网站或 App 截图时，直接把图或 URL 交给 agent，并写清「学它的哪一点、不要学哪一点」。

```
目标：按我提供的参考，给当前页面做一个视觉方案。先出方案，我确认之前不要改文件。

1. 认真看我附上的参考（截图、本地图片或 URL）。如果是 URL，打开并截图，不要只凭印象。用条目列出：你从参考里学布局的哪一点、学字体/疏密的哪一点、学颜色的哪一点；同时列出明确不学的部分（例如它的营销口号、它的玻璃效果、它和我们产品无关的插画）。
2. 结合我们自己的题材和现有内容，写一份短设计方案（颜色、字体、布局、原则）。不要把参考站的品牌色或 Logo 直接搬过来，除非我明确要求做一个「长得像某某」的练习。
3. 方案先给我看。我确认后再改代码。
4. 实现后截桌面和手机图，和参考截图并排说明：哪些学到了、哪些故意不同、为什么。
5. 验收：并排对比图或路径在报告里；没有引入参考站的版权图形或整段文案；我们自己的内容没有被改写。

参考：https://github.com/Leonxlnx/taste-skill （Leonxlnx）；https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics
```

来源：[Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)；官方 Cookbook。

## 7. 怎么判断一个 design skill 好不好：用留出的任务 + 截图证据，而不是看 star

- **要点**：今天日常简报介绍的 SkillOpt 纪律，完全适用于 design skill：先准备一批任务并划出验证集；用当前 skill（或不用 skill）跑一遍当基线；只根据训练集上的失败做小改；只有验证集分数严格变高才留下，否则回滚并把被拒的改动记下来。对 UI 来说，「分数」不能只看「输出里有没有某个类名」，否则会变成奖励作弊（11-18 今日概念）。更好的判据是：规定宽度的截图、对比度是否达标、反 slop 清单上的项是否出现、以及你本人是否愿意留下来用。官方 skill 自己也在更新「默认长相」清单——以前是紫渐变，现在又多了陶土奶油风和 SaaS 卡片套件——说明 skill 需要用新样本持续检验，不能装上就认定永远有效。

```
目标：评估我指定的一个 design skill（或对比「装了 vs 没装」）在我们这类页面上到底有没有用。先出任务和评分表，我确认后再跑。只出报告，不要把 skill 的改动写进我的正式项目，除非我另说。

1. 准备 8 个小任务：例如「做一个阅读型列表页」「做一个设置页」「把现有页改得不那么 AI」。其中 5 个训练、3 个验证；验证集全程不能用来改 skill。每个任务写清输入、必须保留的内容、以及「做对」的检查方法。
2. 检查方法必须能防作弊，优先用这些：
   - 在 1440 和 390 宽度截图，人工或视觉模型按同一张清单打分（清单至少包括：是否出现紫渐变/统一渐变卡片/玻璃导航/Inter 等默认项、对比度、手机是否可读）；
   - 机械检查：关键文案在不在、页面能打开、没有明显的水平溢出。
   不要只检查「用了某个 CSS 类名」或「输出里有没有某个词」。
3. 每个任务在干净环境里跑 2 次：一次不加载该 skill，一次加载。记录是否通过、截图路径、清单得分、以及模型是否声称「已经很好了」但清单仍然失分。
4. 只根据训练集失败提出最多 3 条对该 skill 或配套提示的小改建议。不要在验证集上调。如果要试改，必须重新跑验证集；分数没有严格提高就回滚，并把这次被拒的改动和原因记下来。
5. 验收：训练/验证分数分开报告；每个任务都有截图路径；结论里写明这个 skill 适合或不适合我们哪类页面。数字必须来自实际运行。

参考：https://www.microsoft.com/en-us/research/blog/skillopt-agent-skills-as-trainable-parameters/ （Yifan Yang 等，Microsoft Research）；今日概念 Reward hacking；frontend-design 中不断更新的默认长相清单
```

来源：[SkillOpt](https://www.microsoft.com/en-us/research/blog/skillopt-agent-skills-as-trainable-parameters/)（Microsoft Research，已在 11-18 日常简报介绍）；官方 frontend-design skill。

---

## 推荐安装的 design skill 清单

优先装前面几个官方或强相关的；社区高星包放在后面，星多不等于适合你的知识站或 LobeHub 项目。star 数为 2026-11-18 GitHub API 查询结果。

| 名字 | 链接 | 安装命令（如有） | 一句话用途 | Star / 备注 |
| --- | --- | --- | --- | --- |
| frontend-design（官方插件） | [插件源](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/frontend-design) · [市场页](https://claude.com/marketplace/plugins/frontend-design) | `/plugin install frontend-design@claude-plugins-official` | 做或改 UI 时避开通用 AI 审美，先规划再写代码 | 所在官方市场仓库 47,641 star；同一份 skill 也在 [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/frontend-design)（197,087 star）。作者：Prithvi Rajasekaran、Alexander Bricken |
| example-skills 里的 webapp-testing 等 | [anthropics/skills](https://github.com/anthropics/skills) | `/plugin marketplace add anthropics/skills` 然后 `/plugin install example-skills@anthropic-agent-skills` | 用 Playwright 测本地网页、截图；同仓库还有 brand-guidelines、canvas-design、theme-factory | 197,087 star。这是官方范例仓库，11-18 日常简报曾列为「待评估」，设计相关部分今天核对过 |
| Expo skills（尤其 expo-design-system、expo-native-ui） | [expo/skills](https://github.com/expo/skills) | `/plugin install expo@claude-plugins-official` 或 `claude plugin install expo@claude-plugins-official` | 给 RN/Expo 做原生感 UI、主题 token，并检查设计系统有没有漂移（含「native-slop」清单，例如紫色渐变英雄区、什么都做成卡片） | 4,185 star。11-17 已介绍，冻鱼主栈优先 |
| DESIGN.md 规范 + lint（不是 skill，是格式和工具） | [google-labs-code/design.md](https://github.com/google-labs-code/design.md) | `npx @google/design.md lint DESIGN.md` | 把设计 token 和理由写成 agent 能长期遵守的文件 | 28,942 star；格式仍为 alpha。11-17 已介绍 |
| awesome-design-md | [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) | 无需安装，当参考库 | 大量品牌 DESIGN.md 范例 | 128,098 star。不要整份复制成自己的品牌。11-17 已介绍 |
| Matt Pocock skills（用其中的 prototype） | [mattpocock/skills](https://github.com/mattpocock/skills) | `claude plugin install mattpocock-skills@claude-plugins-official` | `/prototype`：在同一路由上做 3 个结构不同的可切换 UI 方案 | 327,314 star。装的是整包 skills，设计相关主要是 prototype |
| Superpowers（用其中的 brainstorming） | [obra/superpowers](https://github.com/obra/superpowers) | `/plugin install superpowers@claude-plugins-official` | 做新东西（包括 UI）前先问清楚、让你挑方案、批准短设计再动手 | 319,854 star。11-17 已介绍 |
| Taste Skill（design-taste-frontend） | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | `/plugin marketplace add Leonxlnx/taste-skill` 然后 `/plugin install taste-skill@taste-skill`；或 `npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"` | 按业务类型做艺术指导，并用无头 Chrome 检查后才交卷 | 118,263 star。11-17 文末「看过未收」。偏公司官网/落地页，知识站不必整套照搬；需要 Node 22+ 和 Chrome |
| apple-design-skill | [dickwu/apple-design-skill](https://github.com/dickwu/apple-design-skill) | 以仓库 README 为准（今天未逐条复核安装命令） | 按 Apple HIG 做跨平台 UI 审查，可用于 RN 等 | 3,550 star。适合做 LobeHub mobile 时当审查参考，使用前先读 README 确认安装方式 |
| ui-ux-pro-max-skill | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | `/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill` 然后 `/plugin install ui-ux-pro-max@ui-ux-pro-max-skill` | 社区里非常高星的综合 UI/UX skill | 151,246 star。11-17 文末「看过未收」。规则很多，我没有逐条核验质量，建议先用上面的官方 skill 和验证方法评估，再决定要不要长期用 |

另外扫到、但优先级较低或未深读：`plugin87/ux-ui-agent-skills`（3,194 star）、`ceorkm/mobile-app-ui-design`（566 star）、`wilwaldon/Claude-Code-Frontend-Design-Toolkit`（1,314 star，一份工具盘点）、`google-labs-code/stitch-skills`（Google Stitch 工作流，依赖 Stitch 产品）。需要的话可以再单独评估。

---

## 把现在这个 Astro 知识站改好看：可以直接贴给 Studio 上 Claude Code 的 prompt

在 Studio 上进入 `~/work/agent-knowledge-site` 后粘贴。如果你已经装了 `frontend-design`，它应会自动参与；没装的话，先跑 `/plugin install frontend-design@claude-plugins-official`。

```
目标：重做这个 Astro 知识站的视觉，让它适合「读简报、复制 prompt、读工厂蓝图」，而不要再做成通用的 Dribbble/SaaS 作品集。先出方案和 3 个结构不同的原型，我确认之前不要改正式样式，也不要改任何内容文件。

项目在 ~/work/agent-knowledge-site。样式主要在 src/styles/，设计 token 集中在 tokens.css。内容在 content collections 里（简报、prompt、蓝图），这些文件一次都不要改，也不要改写首页/卡片上已有的介绍文字。预览命令用项目已有的 pnpm 脚本（先读 package.json，不要猜）。

背景：上一版按「Dribbble 风」改过，已经被判定为丑。具体问题包括：悬浮玻璃导航、三个板块做成带渐变的大卡片、简报和 prompt 变成同一套悬停上浮的卡片网格、紫蓝/青绿/粉紫三套渐变。这正是 frontend-design skill 说的「SaaS 卡片套件」默认长相，不要在这个方向上继续打磨。

请按下面步骤做：

1. 先读现有样式和几个关键页面（首页、一篇简报、一条 prompt、蓝图、搜索）。用自己的话写清：这个站的题材、读者、主要任务。然后截当前首页和一篇简报页的桌面（约 1440）和手机（约 390）图，作为「改之前」的证据。

2. 设计方向必须从题材出发，而不是从「作品集」出发：这是一个给中文初学者用的阅读站，文字才是主角，要安静、容易长时间读、容易复制 prompt。可以参考认真做排版的技术博客或文档站（学疏密、字体层级、阅读宽度），不要参考 Dribbble 上的仪表盘和玻璃拟态落地页。

3. 明确禁止：玻璃拟态导航、统一圆角的渐变卡片网格、每个卡片都悬停浮起、白底紫渐变或三套彩虹渐变点缀、Inter / Roboto / Arial / 系统默认字体、每个标题上的全大写眉题、把统计数字做成英雄区主角、为了「高级」而加的装饰动效。大胆用在一处就够，周围保持克制。

4. 先只在对话里交出：
   - 一份短设计方案（4–6 个命名色、最多两个字体及角色、布局概念和 ASCII 线框、几条原则）；
   - 对照 frontend-design 的 5 类默认长相，说明你避开了什么；
   - 3 个结构真正不同的方向（不要只换配色），例如：阅读优先的单栏排版、带侧栏目录的工作室排版、把搜索和最近更新放在最前面的工具排版。
   我选定方向之前，不要改 src/styles/ 或其他正式文件。

5. 我选定后，可以先做带 ?variant= 的可切换原型（生产构建须能关掉切换条），用真实内容填满。实现后必须用真浏览器截桌面和手机图（首页、一篇简报、一条 prompt、蓝图、搜索都要有），对照第 3 步的禁止项和第 4 步的方案做检查清单。把截图路径发给我。

6. 我看过截图并确认「可以折进正式样式」之后，再改 src/styles/（以及确有必要的布局组件）。不要改内容文件，不要发明新的营销文案。改完跑项目已有的 pnpm build，贴出命令和结尾的通过/失败行；再开预览，重新截同样的页面和宽度，把前后图放在一起。

验收：
- 内容文件无改动（可用 git status 证明）；
- 玻璃导航和「同一套渐变卡片网格」已经不在新截图里；
- 手机宽度下正文可读、不需要横滑；
- 简报和 prompt 页适合阅读和复制，而不是在展示卡片特效；
- build 通过，证据是原始终端输出。
```

---

## 去重用源链接

- https://github.com/anthropics/claude-plugins-official/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md
- https://github.com/anthropics/claude-plugins-official/blob/main/plugins/frontend-design/README.md
- https://claude.com/marketplace/plugins/frontend-design
- https://claude.com/resources/articles/improving-frontend-design-through-skills
- https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics
- https://github.com/anthropics/skills
- https://github.com/anthropics/skills/tree/main/skills/frontend-design
- https://github.com/anthropics/skills/tree/main/skills/webapp-testing
- https://github.com/google-labs-code/design.md
- https://github.com/VoltAgent/awesome-design-md
- https://github.com/expo/skills
- https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md
- https://github.com/mattpocock/skills
- https://github.com/mattpocock/skills/blob/main/skills/engineering/prototype/UI.md
- https://github.com/Leonxlnx/taste-skill
- https://github.com/dickwu/apple-design-skill
- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- https://simonwillison.net/2026/jan/24/dont-trust-the-process/
- https://www.microsoft.com/en-us/research/blog/skillopt-agent-skills-as-trainable-parameters/
- https://x.com/PawelHuryn/status/2034583837351526763 （高赞讨论 DESIGN.md，事实以 Google Labs 仓库为准）
