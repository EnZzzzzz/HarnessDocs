# Design Harness · RSI 方案研讨

独立 Next.js App Router + React + TypeScript + Tailwind CSS v4 + shadcn/ui（Base UI）汇报站。设计规范见 [DESIGN.md](./DESIGN.md)，三章文案规划见 [CONTENT.md](./CONTENT.md)。

## 本地运行

Node.js 20.9+，使用 pnpm。

```bash
cd web_design_harness
pnpm install
pnpm dev
```

访问 http://localhost:9358，自动进入第一章。

```bash
pnpm build
pnpm typecheck
pnpm start
```

## 章节

- `/skills`：Skill 版本管理，留下改动、快照与派生关系。
- `/cases`：评测用例集，固定任务与比较对象。
- `/review`：评测与人的判断，人工查看、证据保留与下一次迭代；自动评测按需补充。

根路径跳转 `/skills`，旧 `/workbench` 跳转 `/review`。三章共享 AppShell，通过侧栏、手机顶栏及上下章入口导航。

页面为方案汇报，不连接实际 Runner 或评分服务。产品配图来自用户 `rsi-harness/assets`，图片数据均为示例。原始规格快照位于 `public/reference`；人工优先的文案方向依据用户最新讨论要求。

## 核心文件

- `components/app-shell.tsx`：共用框架。
- `lib/chapters.ts`：三个章节的导航信息。
- `components/chapter-layout.tsx`：章节标题、正文段落、旁注与转场。
- `components/proposal-image.tsx`：完整配图与原图链接。
- `components/chapter-figures.tsx`：配图切换。
- `components/ui/button.tsx`：shadcn/ui Base UI 按钮。

独立依赖和端口，不从兄弟项目导入运行时文件。使用本地系统字体与自带配图。
