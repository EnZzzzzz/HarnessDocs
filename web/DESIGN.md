# Harness Docs 前端设计文档

文档可视化站点的前端（`web/`），浅色梦幻风格单页应用：首页 Hero + AI 发展脉络时间线。

## 技术栈

- Next.js 16（App Router，静态导出）+ React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui（`components/ui/`）
- 字体：Geist Sans / Geist Mono（next/font）
- 图标：lucide-react + 真实品牌 logo（`public/icons/`）
- 无重型动画库：全部用 CSS keyframes + 原生滚动监听（rAF 节流）

## 全局背景（`app/globals.css`）

`.dream-bg` 三层结构，fixed 铺满全页：

1. **底色**：`#f2f5fd`，非纯白
2. **渐变层** `.dream-bg-blobs`：5 个圆形径向渐变点（天蓝 / 紫罗兰 / 青 / 靛蓝），散布整个画面，多点叠加出梦幻感
3. **方格层** `.dream-bg-grid`：双层网格线（28px 细格 + 140px 粗格，草稿纸质感），radial mask 让边缘淡出

## 布局骨架（`app/layout.tsx`）

- Header：仅左侧 logo（渐变方块 H +「Harness Docs」），无导航
- Footer：一行小字
- 无全局导航——单页滚动叙事，靠页面结构引导

## 首页 Hero（`app/page.tsx`）

左右布局，占满首屏（`min-h-[calc(100svh-130px)]`）：

- **左**：徽章 → 大标题「Harness」（渐变文字，7xl/8xl）→ 中文描述。入场动画 `hero-stagger`：从左向右滑入 + 模糊过渡，逐级 stagger（0.05s 起步）
- **右**：13 个真实 Harness 产品 logo（Claude、ChatGPT、Gemini、Cursor、Copilot、Kimi、Qwen、OpenCode、飞书、Context7、智谱、WorkBuddy，DeepSeek 居中最大），**随手撒布**式布局——每个图标有独立的 x/y 坐标、尺寸、旋转角（±26°）、透明度、虚化程度，定义在 `LOGOS` 数组
- **图标入场**：`orbit-converge`——从外侧 2.1 倍距离向中心聚合，`cubic-bezier(0.16, 1, 0.3, 1)` 快进慢出，逐个 stagger；入场后 `chip-float` 缓慢浮动（各图标周期错开）
- 底部：「向下滚动 · AI 发展脉络」提示

## 时间线段落（`components/timeline/`）

首页向下滚动进入，锚点 `#timeline`。

### 结构

- **引子**：标题「从提示词，到上下文，到 Harness」+ 递进关系说明（会说话 → 有信息 → 有环境）
- **吸顶主题条** `stage-header.tsx`：sticky 玻璃横条，随滚动自动切换当前阶段（提示词工程 2022—2023 / 上下文工程 2024—2025 / Harness 工程 2026—至今）。切换逻辑：焦点线（视口 35% 处）扫过的事件行 `data-stage` 决定当前主题，切换时 `stage-in` 淡入动画
- **事件流**：严格按时间顺序排列（不按主题分组）。左侧时间轴：3px 灰色竖线（slate-400，两端渐隐）+ 日期 + 圆点 + 连接短横线；中间是事件卡片

### 两级卡片体系

- **里程碑**（`milestone: true`，目前 15 个）：照片墙大相框——白色边框 + 靛蓝内页 + 底部说明，微倾斜（±0.6°），悬停回正放大；带类型徽章、中性灰主题名、「◆ 关键节点」标记、常驻来源链接（论文类显示「论文 ↗」）、**代表性配图**（`public/timeline/`，点击跳来源）
- **次要事件**：紧凑小卡片（半透明底、小标题、淡色说明），作为铺垫

### 滚动焦点（`scroll-focus.tsx`）

rAF 节流监听滚动，每个 `data-fade-row` 按与视口中心的距离实时计算：中心 ±18% 完全清晰，向外渐隐（透明度 + 轻微模糊 + 位移补偿），已滚过顶部的事件加速淡出——焦点始终保持在画面中间。

### 数据（`timeline-data.ts`）

- `EVENTS`：扁平数组，严格按日期排序；每条含 date / title / description / theme / type / milestone / image / source
- `THEME_META`：三条脉络的 keyword / en / range / description（阶段判定用 `stageOf(date)`：≤2023 → prompt，2024–2025 → context，≥2026 → harness）
- 事件日期与来源均经过联网考证（arXiv / 官方博客 / 权威报道）

## 动画规范

| 动画 | 用途 | 缓动 |
|---|---|---|
| `hero-title-in` | 标题从左滑入 | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `orbit-converge` | 图标由外向内聚合 | `cubic-bezier(0.16, 1, 0.3, 1)` 快进慢出 |
| `chip-float` | 图标缓慢浮动 | `ease-in-out` 无限循环，各图标错开周期 |
| `stage-in` | 吸顶主题切换 | `cubic-bezier(0.22, 1, 0.36, 1)` |

## 资源

- `public/icons/`：Harness 产品真实 logo（simple-icons / 官网 / Wikimedia）
- `public/timeline/`：里程碑配图（论文原图、官方公告图、网页截图）

## 本地开发

```bash
cd web
npm ci
npm run dev   # http://localhost:3000
```
