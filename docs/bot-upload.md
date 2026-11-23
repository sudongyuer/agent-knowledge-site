# bot 上传指南

四个 bot 把资料提交到 GitHub 仓库 `sudongyuer/agent-knowledge-site` 的 main 分支。提交后 Cloudflare 自动构建，大约 2 分钟后 [kb.tapiro.app](https://kb.tapiro.app) 更新。

## 每个 bot 只写自己的目录

| bot | 目录 |
| --- | --- |
| agent-practice | `content-source/agent-practice/` |
| prompt-collector | `content-source/prompt-collector/` |
| factory-architect | `content-source/factory-architect/` |
| skill-collector | `content-source/skill-collector/skills/` |

不要改自己目录以外的文件，也不要改别的 bot 的目录。

## 访问令牌

每个 bot 一个 fine-grained personal access token，由仓库主人在 GitHub 的 Settings → Developer settings → Fine-grained tokens 里创建：

- Repository access：只选 `sudongyuer/agent-knowledge-site`
- Permissions：Contents 设为 Read and write，其余保持 No access

令牌放在 bot 的环境变量 `GITHUB_TOKEN` 里，不要写进仓库。

## 上传步骤

下面的命令以 prompt-collector 为例。其他 bot 要把 `BOT` 换成自己的名字（agent-practice、factory-architect 或 skill-collector），`DIR` 换成上表里自己的目录。

首次：

```sh
BOT=prompt-collector
git clone https://x-access-token:${GITHUB_TOKEN}@github.com/sudongyuer/agent-knowledge-site.git
cd agent-knowledge-site
git config user.name "${BOT}-bot"
git config user.email "${BOT}-bot@users.noreply.github.com"
```

每次上传分三步。先拉取最新版本：

```sh
git pull --rebase
```

然后把新文件写进自己的目录，最后提交并推送：

```sh
BOT=prompt-collector
DIR=content-source/prompt-collector
git add "$DIR"
git commit -m "${BOT}: 新增 3 条 Prompt"
git pull --rebase && git push
```

`git push` 被拒绝（另一个 bot 刚推送过）时，重新执行最后一行。

## 文件格式

- 简报文件名以 `YYYY-MM-DD` 开头，例如 `briefs/2026-11-21-agent-engineering.md`。
- Prompt 的 frontmatter 必须有 `title`、`category`、`date`，`tags` 是字符串数组；可选 `author`、`source_url`、`additional_sources`、`variants`、`status`。
- Skill 一个文件一条，放在 `skill-collector/skills/<作者>-<Skill 名>.md`，格式见下文。
- 文件之间的相对链接（如 `[xx](sources.md)`）会自动改写成站内地址。

格式不对时构建失败，网站保持上一版，不会上线坏内容。失败原因在 Cloudflare 后台 Workers & Pages → agent-knowledge-site → Deployments 的构建日志里。完整约定见仓库根目录 README 的「更新内容」一节。

## Skill 文件格式

只存介绍和链接，不转载 Skill 原文。

```markdown
---
name: break-ui
title: 用最坏的真实数据压测 UI
author: Emil Kowalski
source_url: https://github.com/emilkowalski/skills/tree/main/skills/break-ui
install: npx skills@latest add emilkowalski/skills
category: 设计
tags:
- UI
- 测试
date: '2026-11-21'
license: MIT
---

第一段：一两句话说清这个 Skill 做什么，会显示在卡片和搜索结果里。

## 什么时候用

## 核心规则
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `name` | 是 | Skill 原名，与它的 `SKILL.md` 一致 |
| `title` | 是 | 中文标题 |
| `source_url` | 是 | 原文地址 |
| `category` | 是 | 分类 |
| `date` | 是 | 收录日期，加引号写成 `'YYYY-MM-DD'` |
| `author` | 否 | 作者 |
| `install` | 否 | 安装命令，照抄来源页 |
| `license` | 否 | 来源仓库的授权 |
| `tags` | 否 | 字符串数组 |

`source_url` 是 GitHub 地址时，网站会把同一仓库来源的 Prompt 和 Skill 互相链接。
