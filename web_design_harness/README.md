# Design Harness

独立的设计研讨 Web 项目。Next.js App Router + React + TypeScript + Tailwind CSS v4 + shadcn/ui（Base UI）。采用「研究刊物 + 设计师工作台」视觉方向，完整规范见 [DESIGN.md](./DESIGN.md)。

## 本地运行

Node.js 20.9+，使用 pnpm。

```bash
cd web_design_harness
pnpm install
pnpm dev
```

打开 http://localhost:9358 。独立于兄弟目录 `web/`，不共享其依赖或运行时文件。

```bash
pnpm build
pnpm typecheck
pnpm start
```

## 首轮页面

- `/`：研究概览，刊物式问题引导、设计过程示意与三个研究问题。
- `/workbench`：过程研讨，三个可切换的设计阶段，以及可显隐的编辑批注。案例是用于验证版式和交互的示意内容，不代表真实研究结果。

## 结构

- `app/layout.tsx`：元数据、中文语言标记与全局 AppShell。
- `components/app-shell.tsx`：共享顶栏、侧栏、正文与页脚。
- `components/navigation.tsx`：路径感知的章节导航。
- `components/design-draft.tsx`：代码原生示意稿件。
- `components/workbench.tsx`：阶段切换与批注交互。
- `components/ui/button.tsx`：shadcn/ui Base UI 按钮；配置见 `components.json`。
- `app/globals.css`：主题变量、版式、响应式与减少动效规则。

只需本地系统字体，无远程图片、字体、账户或后端配置。
