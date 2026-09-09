# web_design_harness

独立 Next.js + shadcn/ui 研究汇报网站。前端变更前先读 `DESIGN.md`，遵守其色彩、AppShell、排版和交互约定。

使用 pnpm，开发端口 9358。不要从 `../web/` 导入运行时组件或资源。新增章节复用 AppShell，默认采用 Server Components，交互仅在必要位置使用 Client Components。

提交前执行 `pnpm build` 和 `pnpm typecheck`。示意案例与真实调研证据必须区分标注。
