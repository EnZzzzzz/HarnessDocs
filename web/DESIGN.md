# Harness Docs 前端设计文档

文档可视化站点的前端（`web/`），浅色梦幻风格单页应用：首页 Hero + AI 发展脉络时间线 + Codex 自进化方案 + Harness 六职责解剖 + Skill 即资产 + Agent 自进化四章节。

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

- **里程碑**（`milestone: true`，目前 20 个）：照片墙大相框——白色边框 + 靛蓝内页 + 底部说明，微倾斜（±0.6°），悬停回正放大；带类型徽章、中性灰主题名、「◆ 关键节点」标记、常驻来源链接（论文类显示「论文 ↗」）、**代表性配图**（`public/timeline/`，点击跳来源）
- **次要事件**：紧凑小卡片（半透明底、小标题、淡色说明），作为铺垫

### 滚动焦点（`scroll-focus.tsx`）

rAF 节流监听滚动，每个 `data-fade-row` 按与视口中心的距离实时计算：中心 ±18% 完全清晰，向外渐隐（透明度 + 轻微模糊 + 位移补偿），已滚过顶部的事件加速淡出——焦点始终保持在画面中间。

### 数据（`timeline-data.ts`）

- `EVENTS`：扁平数组，严格按日期排序；每条含 date / title / description / theme / type / milestone / image / source / links（补充阅读，可选）
- `THEME_META`：三条脉络的 keyword / en / range / description（阶段判定用 `stageOf(date)`：≤2023 → prompt，2024–2025 → context，≥2026 → harness）
- 事件日期与来源均经过联网考证（arXiv / 官方博客 / 权威报道）

## Harness 六职责段落（`components/harness/`）

时间线之后继续向下滚动进入，锚点 `#harness`。内容依据 arXiv:2606.20683 综述的形式化定义 `A_LLM = ⟨M, I_obs, C, L, I_act, S, V⟩`。

### 结构

- **上下布局**（`harness-section.tsx`，260vh sticky 轨道）：上方常驻 Harness 介绍（徽章 +「Harness 是什么？」+「Agent = Model + Harness」说明，`max-w-sm`）；六张职责卡片（200×300 竖版）初始**随机堆叠**在介绍文字右侧的空白区域（堆叠点按舞台实测尺寸计算，与标题垂直居中对齐），随滚动逐张**横向平铺**成一整行，每张卡错开 0.05 进度起步，`easeInOutCubic` 快进慢出；展开完成后可点击
- **卡片正面**：形式化符号徽章（I_obs / C / L / I_act / S / V）+ 中文名 + 英文名 + 一句话概括，悬停出现「查看详情 →」
- **详情弹层**：点击卡片打开（backdrop blur 遮罩 + 白卡），含职责详解 + Codex / Claude Code 两个产品的真实实现要点（每条带源码路径或文档出处，数据来自 `docs/harness/` 下两份调研文档）；Esc / 点遮罩关闭，打开时锁定背景滚动。弹层 `article` 必须带 `[transform:translateZ(0)]`——强制独立合成层，否则会被遮罩的 backdrop-blur 一并模糊；关闭按钮弱化（淡色 X）收进卡片头部常规布局，不浮动

### 实现要点

- 滚动驱动用 rAF + getBoundingClientRect 直接写 DOM transform（不经过 React 重渲染），与 `scroll-focus.tsx` 同一套模式
- 卡片位置在 JS 里按舞台实测尺寸计算（堆叠点 → 横向整行位置插值），整体缩放保证整行放进舞台；展开进度 < 0.85 时禁用 pointer-events 防误点
- 详情弹层滚动条自动隐藏：仅滚动中/悬停时显现（`--sb` 自定义属性 + data-scrolling）

### 数据（`harness-data.ts`）

`HARNESS_PARTS`：六个职责各含 symbol / name / en / tagline（卡片正面）/ detail / implementations（弹层详情，按产品分块的实现要点，每条含 text + source 出处）。

## 大纲章节段落（`components/outline/`）

原按 `大纲.md` 一级标题共 11 页；按需求目前仅保留 1 页核心章节（Codex 自进化方案，`sections/05-self-evolution.ts`），由 `sections.ts` 以 `FEATURED_SECTION` 导出，在时间线之后优先展示，其余章节及其数据文件已移除。

### 结构（`outline-section.tsx`）

- 每章一页：`min-h-screen`，顶部小胶囊（kicker，大纲原标题）+ 大标题（渐变文字）+ 引言 + 卡片网格（≤2 张时两列，否则三列）
- **卡片样式与 Harness 六职责一致**：白色半透明圆角卡 + 靛蓝徽章（01/02…）+ 标题 + 英文副标题 + 一句话概括；有 detail/points 的卡片可点击，悬停出现「查看详情 →」
- **详情弹层**：复用 Harness 板块的弹层结构（含 translateZ(0) 合成层修复、弱化关闭按钮、自动隐藏细滚动条）

### 数据（`outline-data.ts` + `sections/`）

- `OutlineSectionData`：id / kicker / title（大标题）/ intro / cards；`OutlineCard`：badge / title / en / tagline / detail / points（每条含 text + source 出处）
- 每章一个文件（现仅存 `sections/05-self-evolution.ts`），内容经核实：事实优先取自时间线事件卡片，其余按大纲标注的出处（Cordis 论文翻译、tibo 访谈纪要、Continual-Harness PDF、Anthropic/智谱/HarnessEval 原文、知识库 `design-harness/` 笔记）

## Agent 自进化四章节（`components/harness/self-evolution-sections.tsx`）

「Skill 即资产」之后插入，内容来自 `docs/agent自进化-字幕整理.md`（抖音视频字幕），共 4 页：`#se-what`（自进化是什么）/ `#se-vs-reflection`（Reflection vs 自进化）/ `#se-layers`（进化的五层）/ `#se-flywheel`（经验飞轮）。

- 布局：标题区（eyebrow + 渐变标题 + 引言）通栏横跨整页（`md:col-span-2`），其下两列——左侧编号要点卡片、右侧 3:2 配图（`public/harness/`，含图注），两列互相垂直居中（`md:self-center`）
- 同样的通栏布局也应用于「Skill 即资产」页（`skill-asset-section.tsx`），保证两类章节版式统一

## 章节配图：编辑部手绘风

自进化章节的卡片封面采用统一的**科技编辑部手绘插画**。它不是写实产品渲染，也不是扁平科技矢量图，而是把抽象的 Harness 概念画成一张正在被研究、拆解和批注的工程草图。基准图为 `public/outline/universal-harness-editorial.png`，后续同类配图应以它作为风格参考。

### 视觉语言

- **媒介**：铅笔与针管笔式灰蓝线稿，叠加半透明水彩晕染；保留纸张纤维、轻微擦痕、重复描线和不完全规整的手工感
- **造型**：用可辨认的机器、模块、齿轮、接口、机械臂、工作台和连线表现抽象软件系统；结构复杂但主隐喻必须一眼可读
- **透视**：略带俯视的轴测工程图视角，主体有空间体积，但不追求照片级材质和严格工业制图精度
- **线条**：石墨灰与低饱和靛蓝为主，轮廓纤细、有深浅变化；辅助箭头、虚线、圈注和草图纸散落在主体周围
- **质感**：大面积留白，背景为温和的冷白纸张；淡蓝、淡紫水彩只作局部空气感和视觉分组，不铺满画面
- **人物**：如需出现人物，应保持小比例、研究员式手绘剪影，用来说明人与系统的关系，不能抢过主体

### 色彩与氛围

- 主色：冷白、石墨灰、雾霾蓝、靛蓝
- 辅色：少量青绿和薰衣草紫，用于区分模块或强调数据流
- 点睛色：可使用极少量红色批注圈线，模拟编辑审阅痕迹
- 整体低饱和、明亮、克制、理性，和页面的浅色梦幻背景及 indigo UI 强调色保持一致
- 避免纯黑大色块、高饱和霓虹、强烈赛博朋克光效、深色背景与塑料感 3D 渲染

### 构图原则

1. 每张图只表达一个核心命题，并把命题转成明确的空间关系或动作关系，例如「外部 Skill 被吸收进 Harness」或「执行—观察—改写—验证的闭环」。
2. 主体位于画面中央安全区，四周用模块、箭头和批注补充语义；即使卡片以 `object-cover` 横向裁切，核心隐喻仍须完整。
3. 优先使用可视化因果关系：输入/输出、内外、吸收、循环、扩展、云端连接。不要只堆砌相关图标。
4. 信息密度由中心向边缘递减，边缘保持浅淡，避免裁切后出现无意义的半个主体。
5. 装饰性章节图内部不放标题、品牌 logo、可阅读的 UI 文案或大段文字，完整说明仍由页面承担。
6. 插画默认不加入任何文字标签或说明。只有需求中明确提出需要文字标注时，架构图、流程图和闭环图才加入少量必要的节点标签；优先使用 1–2 个英文单词的短标签，以手写工程批注的形式放在主体外侧，并用纤细、略不规则的虚线明确指向对应对象。标签不能遮挡主体，缩小到页面实际展示尺寸后仍须可读。

### 生成提示词模板

```text
用途：Harness Docs 章节卡片封面，横向科技编辑插画。
主题：用一个清晰的视觉隐喻表现「{本卡片的唯一核心命题}」。
场景：{主体机器或系统} 位于画面中央，{关键模块、动作和因果关系}；周围仅用少量工程草图、虚线箭头、批注圈线和数据流补充说明。
风格：高端科技杂志的编辑部手绘插画；精细铅笔与针管笔线稿，半透明水彩晕染，略带俯视的轴测工程图，真实冷白纸张纹理，保留轻微不规则的手工笔触。
配色：低饱和石墨灰、雾霾蓝和靛蓝，少量青绿与薰衣草紫，极少量红色批注；明亮、大面积留白。
构图：3:2 横幅，核心主体和关键动作集中在中央 70% 安全区，缩小到卡片尺寸仍能一眼读懂，边缘元素轻淡并可安全裁切。
约束：概念清晰优先于装饰复杂度；默认无标题、无文字标签、无大段文字、无品牌 logo、无水印；仅当需求明确要求文字说明时，说明型架构图才加入少量短标签和手绘虚线指引；不要写实摄影、扁平矢量、卡通贴纸、塑料 3D、深色赛博朋克或霓虹光效。
风格参考：public/outline/universal-harness-editorial.png，只参考媒介、配色、纸张质感和视觉密度，不复制其具体构图。
```

### 页面使用规则

- 源图使用 3:2 横图，建议 1536×1024 PNG，文件名采用小写 kebab-case，并放入 `public/outline/`
- 卡片封面固定在内容上方，使用 `object-cover`；详情弹层复用同一张图并放在正文上方
- `alt` 描述图片表达的概念关系，而不是重复卡片标题，例如「外部 Skills 被吸收进 Harness 并转化为内部能力的手绘插画」
- 仅在需求明确提出文字说明时制作带标注的说明图；此时应检查每条虚线是否唯一指向正确节点，并确保标签在页面实际宽度下无需放大即可辨认。标签只承担节点命名，解释性句子仍放在图注或正文中
- 新增一组封面时应使用同一张基准图作风格参考，并在实际卡片尺寸与详情弹层尺寸各检查一次可读性和裁切结果

## 动画规范

| 动画 | 用途 | 缓动 |
|---|---|---|
| `hero-title-in` | 标题从左滑入 | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `orbit-converge` | 图标由外向内聚合 | `cubic-bezier(0.16, 1, 0.3, 1)` 快进慢出 |
| `chip-float` | 图标缓慢浮动 | `ease-in-out` 无限循环，各图标错开周期 |
| `stage-in` | 吸顶主题切换 | `cubic-bezier(0.22, 1, 0.36, 1)` |
| 滚动插值（非 keyframes） | 六职责卡片堆叠→展开 | `easeInOutCubic`，逐张 stagger |

## 资源

- `public/icons/`：Harness 产品真实 logo（simple-icons / 官网 / Wikimedia）
- `public/timeline/`：里程碑配图（论文原图、官方公告图、网页截图）
- `public/outline/`：大纲章节配图；自进化章节统一使用上文定义的科技编辑部手绘风

## 本地开发

```bash
cd web
npm ci
npm run dev   # http://localhost:3000
```
