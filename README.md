# Harness 工程文档站

一个关于 Agent Harness 工程的中文文档/大纲展示站。Next.js 应用在 `web/` 目录，调研文档与论文笔记在 `docs/`。

## 环境要求

- Node.js ≥ 20（推荐使用最新 LTS）
- pnpm（项目使用 pnpm，含 `pnpm.overrides` 配置；请勿用 npm/yarn 安装）

## 启动开发服务

```bash
cd web
pnpm install
pnpm dev
```

启动后访问 http://localhost:9357 。开发模式支持热更新，改动 `web/components/` 下的内容文件（如大纲章节数据 `web/components/outline/sections/*.ts`）保存后页面自动刷新。

## 其他常用命令

```bash
# 生产构建 + 启动
pnpm build
pnpm start

# 代码检查
pnpm lint

# 类型检查（提交前建议跑一遍）
npx tsc --noEmit -p tsconfig.json
```

## 目录说明

- `web/components/outline/` —— 大纲章节卡片（11 章），内容数据在 `sections/` 下按章节分文件
- `web/components/harness/` —— Harness 六大运行时职责卡片（Codex / Claude Code 实现调研）
- `web/public/outline/` —— 卡片配图
- `docs/harness/` —— Codex 与 Claude Code 的源码调研笔记（卡片实现细节的事实来源）
