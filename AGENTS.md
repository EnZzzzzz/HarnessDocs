# AGENTS.md

## 项目概览

Agent Harness 工程的中文文档/大纲展示站：

- `web/` — Next.js 文档站（环境要求与启动命令见根目录 `README.md`，使用 pnpm，开发端口 9357）
- `docs/` — 调研文档、论文笔记与译文

## 写作规范

在 `docs/` 下撰写或翻译调研文档、论文解读、技术笔记时，**文风必须使用 `.kimi-code/skills/narrative-tech-writing/` 这个 skill**：叙事风格符合人的阅读习惯，少用术语（术语首次出现附英文原文并配比喻解释），在适当处设问引导读者思考，再讲解决过程。文风基准参考 `docs/agent自进化-字幕整理.md`，成品实例参考 `docs/wikiskill/WikiSkill论文解读.md`。

## 前端设计规范

`web/` 下的前端开发（页面、组件、样式、动效）**必须遵循 `web/DESIGN.md`** 中的设计规范，动手前先读该文件。
