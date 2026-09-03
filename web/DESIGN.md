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

原按 `大纲.md` 一级标题共 11 页；按需求目前仅保留 1 页核心章节（Codex 自进化方案，`sections/05-self-evolution.ts`），由 `sections.ts` 以 `FEATURED_SECTION` 导出，现挪到整页最后作为压轴，其余章节及其数据文件已移除。

### 结构（`outline-section.tsx`）

- 每章一页：`min-h-screen`，顶部小胶囊（kicker，大纲原标题）+ 大标题（渐变文字）+ 引言 + 卡片网格（≤2 张时两列，否则三列）
- **卡片样式与 Harness 六职责一致**：白色半透明圆角卡 + 靛蓝徽章（01/02…）+ 标题 + 英文副标题 + 一句话概括；有 detail/points 的卡片可点击，悬停出现「查看详情 →」
- **详情弹层**：复用 Harness 板块的弹层结构（含 translateZ(0) 合成层修复、弱化关闭按钮、自动隐藏细滚动条）

### 数据（`outline-data.ts` + `sections/`）

- `OutlineSectionData`：id / kicker / title（大标题）/ intro / cards；`OutlineCard`：badge / title / en / tagline / detail / points（每条含 text + source 出处）
- 每章一个文件（现仅存 `sections/05-self-evolution.ts`），内容经核实：事实优先取自时间线事件卡片，其余按大纲标注的出处（Cordis 论文翻译、tibo 访谈纪要、Continual-Harness PDF、Anthropic/智谱/HarnessEval 原文、知识库 `design-harness/` 笔记）

## 全局详情页卡片规范

所有由页面卡片打开的详情弹层，以 `components/outline/outline-section.tsx` 的 `OutlineSection` 详情卡为全局设计基准。Harness 六职责、Outline、WikiSkill / Hermes 要点、Cordis 等详情组件即使数据结构不同，也应复用下面的视觉层级和交互规则；不要各自发明另一套弹层外观。

通用实现位于 `components/detail-dialog-frame.tsx`：WikiSkill、Hermes 和 Cordis 的详情内容统一通过 `DetailDialogFrame` 渲染；`OutlineSection` 保留为视觉与交互基准。后续新增详情页时优先复用共享骨架，不复制遮罩、滚动锁定、滚动条和关闭逻辑。

### 一、整体骨架

- 弹层在视口中央显示，外层使用全屏半透明深色遮罩与轻量 `backdrop-blur`；点击遮罩或按 `Esc` 关闭，打开期间锁定页面背景滚动。
- 主卡使用白色背景、`rounded-3xl`、细白边框和柔和靛蓝阴影；最大高度统一为 `85vh`，由卡片内部承担滚动，页面本身不能跟随滚动。
- 主卡必须设置 `[transform:translateZ(0)]`，建立独立合成层，避免遮罩的 `backdrop-blur` 把弹层内容一起模糊。
- 有封面或正文配图的详情使用较宽容器，基准为 `max-w-3xl`；纯文字详情使用 `max-w-xl`。移动端保留页面安全边距，不能贴住视口边缘。
- 卡片采用纵向两段结构：顶部封面固定不滚动；下方为 `flex min-h-0 flex-1 flex-col` 的内容区。不要把整个卡片做成单一滚动容器，否则长文滚动后会丢失封面的视觉锚点。

### 二、顶部配图

- 只要详情数据提供封面图，图片必须位于整张详情卡的最顶部、标题和正文之前，不得插在徽章之后或正文中间。
- 封面区域横向铺满卡片，固定为 `h-52 sm:h-64`，使用 `shrink-0`，底部带一条很淡的靛蓝分隔线；图片使用 `h-full w-full object-cover`，不额外增加内边距和圆角。
- 封面沿用卡片正面的同一张图和同一条语义化 `alt`。裁切时必须保住中央核心隐喻；不能为了铺满而拉伸变形。
- 如果没有封面图，直接省略整个封面区域，让徽章、关闭按钮和标题自然成为卡片顶部；不渲染虚线占位框、空白色块或默认装饰图。
- 封面图负责概括主题；正文中的截图、图表和证据图仍按内容顺序穿插，使用 `rounded-xl`、细边框及图注，不能拿第一张证据截图冒充封面。

### 三、头部与正文层级

- 内容区基准内边距为 `p-8`。顶部第一行只放编号/类别徽章和弱化的关闭按钮；二者使用常规 `flex items-center justify-between` 布局，关闭按钮不能绝对定位悬浮在封面或标题上。
- 关闭按钮使用淡灰色小尺寸 X，默认不抢视觉焦点，悬停时才加深；仍须保留清晰的 `aria-label` 和键盘焦点状态。
- 中文标题使用 `text-2xl font-bold tracking-tight text-slate-900`；英文副标题紧跟中文标题，使用更小、更淡的文字，不能与主标题争夺层级。
- 正文使用 `text-sm leading-relaxed text-slate-600`，自然段之间保持稳定间距。详情按“问题 → 做法 → 效果”或 Q&A 顺序组织；来源、URL 与图注使用更小、更淡的辅助文字。
- 详情中的图片必须有语义化 `alt`。有说明或来源时使用紧邻图片的 `figcaption`；长 URL 允许 `break-all`，但不得挤压正文宽度。

### 四、滚动区与滚动条

- 只有标题、正文、正文配图和来源所在的内容主体滚动；顶部封面、徽章与关闭按钮固定在原位。滚动容器使用 `min-h-0 flex-1 overflow-y-auto pr-2`。
- 滚动条默认透明隐藏，鼠标悬停滚动区或用户正在滚动时才显示。使用 CSS 变量 `--sb` 控制颜色：默认 `transparent`，hover 或 `[data-scrolling]` 时切换为 `#e2e8f0`。
- Firefox 使用 `[scrollbar-color:var(--sb)_transparent] [scrollbar-width:thin]`；WebKit 使用 1.5 宽度、透明轨道和圆角滑块。不要使用浏览器默认的宽重滚动条。
- `scroll` 事件触发 `data-scrolling`，停止滚动约 800ms 后自动隐藏；计时器在弹层关闭和组件卸载时清理。
- 滚动到底部后，遮罩与页面仍保持静止；滚轮事件不能穿透到底层页面。

### 五、验收标准

- 在桌面视口下，封面完整占据卡片顶部，正文再长也不会让弹层超过 `85vh`。
- 在窄屏下，卡片保留安全边距，封面不变形，标题不与关闭按钮重叠，正文可以独立滚动。
- 分别验证：有封面、无封面、纯文字、包含多张正文证据图四种状态。
- 验证点击遮罩、关闭按钮、`Esc` 三种退出方式，以及弹层开关前后背景滚动锁定是否正确恢复。
- 检查滚动条默认不可见、hover/滚动时出现、停止约 800ms 后淡出；同时检查 Firefox 与 Chromium 的细滚动条表现。

## Agent 自进化章节（`components/harness/self-evolution-sections.tsx`）

「Skill 即资产」之后先是提问页 `#se-questions`（`components/harness/se-questions-section.tsx`，版式与 `#skill-questions` 一致：大标题「Agent 的自进化，是进化什么？」+ 四个散落问题气泡），随后进入自进化章节。内容来自 `docs/agent自进化-字幕整理.md`（抖音视频字幕）。WikiSkill 部分先用 `#se-wikiskill-flow` 总览完整循环：Infer Agent 只读取当前 Skill 执行并留下 Raw Trace；Skill Manager 内的 Wiki Maintainer 复盘成败轨迹、Skill Proposer 根据 Wiki 与原始证据提出单次修改；验证门接受或回滚后进入下一轮。右侧带标注流程图为 `public/outline/wikiskill-overview-flow.png`。下一页 `#se-wikiskill` 再展开 Raw → Wiki → Skills 三层架构、知识永不回滚、角色分工和消融证据，内容见 `docs/wikiskill/WikiSkill论文解读.md`。

WikiSkill 之后是 WebGrader 三页（`#webgrader-problem` / `#webgrader-solution` / `#webgrader-results`，内容见 `docs/webgrader/WebGrader论文解读.md`），按「问题 → 方案 → 效果」展开：第一页讲 RL 网页开发的奖励难题（手写脚本写不起、大模型裁判没走到决定性一步就下结论、「网站说谎」案例）；第二页讲四层解法（WebGen-Verifier-100 考场、需求先行的流程契约、规划→落地→取证→判决四段流水线、残差驱动进化 + SkillGraph 路由、冻结后发奖励）；第三页讲效果（52.01% FSR、+7.88 点、分数涨在取证环节、长流程仍是盲区）。三页右侧暂用配图占位框，待补编辑部手绘插画。

WebGrader 之后是 `#eval-dataset`（评测集如何构建）：以一次真实的设计迭代为例——同一个 Expenses Report 仪表盘从最初版（60 分）→ 设计师红框标注（70 分）→ 改版后再评审（80 分）→ 最终版（90 分），说明带顺序、带分数的种子数据如何收集，以及如何据此构建一个至少能区分好坏效果的评测 Agent。右侧四张真实设计稿截图（`public/harness/eval-dataset-v*.png`，已统一补白到 3:2），点击左侧步骤卡切换。

`#se-hermes` 继续介绍 Hermes 的 Learning Loop、Skill+Memory 双资产制、容量约束和后台异步复盘；`#se-flywheel` 单独由 `SelfEvolutionFlywheelSection` 渲染，放在 Cordis 之后作为收尾。

- 布局：标题区（eyebrow + 渐变标题 + 引言）通栏横跨整页（`md:col-span-2`），其下两列——左侧编号要点卡片、右侧 3:2 配图（`public/harness/`，含图注），两列互相垂直居中（`md:self-center`）
- 同样的通栏布局也应用于「Skill 即资产」页（`skill-asset-section.tsx`），保证两类章节版式统一
- 整页最后另有一页 `#design-harness-assets`（DesignHarness 的自增长要沉淀什么资产：组件+使用 Skill、设计师真实使用轨迹），复用同一 `SeSection` 版式，右侧配科技编辑部手绘插画 `public/harness/design-harness-assets.png`：左侧组件与 Skill 成对沉淀，右侧呈现设计师选择、调整、采纳与放弃的真实使用轨迹，并通过反馈箭头回流 Harness
- `#data-flywheel` 右侧配双层、双环手绘插画 `public/harness/data-flywheel-two-layer.png`：下层蓝色 Harness 环积累 Skill、组件和专家反馈，上层紫色 Model 环完成轨迹增广、验证与训练；种子轨迹向上输送，增强后的模型能力向下回流
- 4 页数据增广章节：`#trajectory-augmentation`（轨迹多次 rollout、任务变体、故障恢复、前缀分叉）/ `#cot-sft-augmentation`（CoT 多路径采样、过程验证、错误链与风格配比）/ `#industry-augmentation-pipeline`（公开的大厂共同流水线）/ `#augmentation-quality-gates`（五层门禁、独立审核、去重配平与隔离评测）。每页继续采用左侧要点卡 + 右侧 3:2 编辑部手绘插画。
- 最后是 `#delivery-models`（Design Harness 的多种落地方式：对基模团队只交付数据、对业务团队交付 Skill 或 Harness、资产本身 × 飞轮能力两种粒度自由组合），同版式 + 配图占位框

## Cordis 时空可组合性段落（`components/harness/cordis-section.tsx`）

全页最后一章（`#cordis`），总结论文 *A Programming Paradigm for Spatiotemporal Composability*（DeepSeek Harness 底层插件框架 Cordis 的理论基础；原文与全文翻译在 `docs/deepseek-harness/`）。复用「Skill 即资产」的通栏版式：左侧五张编号要点卡（动态组合问题 → 时间×空间两维度 → 可逆效应/响应式共效应 → 上下文范式 → Cordis 实现与 Koishi 验证），右侧显示当前要点对应的 3:2 配图和论文信息卡片（作者、发布、外链）；点击要点后，详情弹层顶部复用该要点的配图。

「时间 × 空间」详情的首个问答另配一张双栏解释图 `public/outline/cordis-temporal-spatial-metaphor.png`：时间侧用雪地脚印表示副作用按 LIFO 原路撤销，空间侧用显式依赖网络表示上游供给下线后依赖组件联动失活、无关支路继续运行。

## 上下文纯净度对比段落（`components/harness/harness-purity-section.tsx`）

紧跟 `#cordis` 之后（`#purity`）：DeepSeek Harness 的另一大优势「纯净」。左侧列出极简模式的全部上下文——系统提示词全文一句话（"You are a helpful software engineer assistant."）+ bash / str_replace_editor 两张工具卡（含关键使用约束与精简 schema）；右侧三张对照卡：Codex CLI（系统提示词 275 行 / ≈5k tokens、基线 4–6 工具、AGENTS.md ≤32 KiB 等）、Claude Code（首请求 38K–119K tokens、≈27 内置工具、CLAUDE.md 四级分层等）、OpenCode（9 套厂商提示词 7.4–15.4 KB、默认 12–14 工具、改文件后 LSP 诊断回灌 tool result 等）。数据来源：`docs/harness/codex-harness.md`、`docs/harness/claude-code-harness.md` 与 openai/codex、anomalyco/opencode 仓库源码核对（2026-08 快照）。

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
