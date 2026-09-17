# 五阶段产物配图生成记录

使用内置 image_gen，依据 DESIGN.md 的研究刊物风格。

## 初始提示词

Create a Chinese editorial infographic, landscape 1536x1024 or larger same ratio, for Design Harness report. Exact style: flat warm white #f7f5ef paper, ink #242521, vermilion #b83d2b section numbers, revision blue #365bbb, thin #deded4 horizontal rules, very limited pale yellow #f3e8af annotation. Songti Chinese serif headline, PingFang style sans-serif body. Spacious research publication layout, NOT dashboard, no enclosing stage cards, no gradients, no heavy shadows. Sharp readable Chinese. Five horizontal rows with small red numerals left, heading and '留下什么' summary in center-left, artifact example on right, like an editorial evidence dossier, not a spreadsheet. Mini document illustration only where helpful. No invented data, checkmarks suggesting adopted status, or additional claims.
Title “一条标注，留下了哪些产物？”
Subtitle “以「小屏出现孤立分割线」为例”
Eyebrow “DESIGN HARNESS / 反馈沉淀”
Each row exact content:
01 原始标注
“留下：元素位置、快照、截图、意见与时间”
Right show small schematic three metadata items wrapping 2+1 with a red circled orphan vertical divider. Accompany exact text “.hero-meta · 390×844” and “3 条元数据排成 2+1，留下孤立竖线”
Tiny path “.ddb-cache/local-review/<会话>/annotations/<方案>.json”
02 按轮归档
“留下：当轮原始标注与反馈来源”
Right document folder “annotation-round-10/”
“JSON 原样归档到需求仓库”
“截图等可弃证据留在 _local/，不进仓库”
03 根因归并
“留下：观察、证据、根因、归因层、置信度与结论”
Right “断点改变了列数，却沿用桌面边框”
“换行后出现 L 形分割线”
“当前归因：场景；可能涉及 Profile”
04 规则候选
“留下：适用范围、跨场景依据与生命周期”
Right “RTS-004 · 响应式分割线拓扑”
“布局重排时，分割线也应随之调整”
Blue status label “观察 observe”
“待第二个正式场景复现，再评估通用规则”
05 机器检查
“留下：可执行检查、失败样例与受影响场景清单”
Right prominent conditional label “采纳后”
“转换器扫描 / 渲染门禁 / registry lint”
“构建与发布时自动执行，用失败样例验证检查”
Footer exact “候选生命周期：观察 → 评估 → 采纳 / 废弃”
Second small footer “Demo 示意：分割线规则仍在观察阶段，第 05 阶段展示采纳后的目标产物。”
Do not show this candidate as already adopted or checks already implemented. Prioritize legibility over decoration. Use horizontal dividers and whitespace rather than boxed cards.

## 修正提示词

Edit this infographic precisely, retain all Chinese text and editorial design except corrections specified. In row 01 remove phone illustration entirely, replace with a clean simple 2-column grid of THREE metadata items: top row “类型” at left and “时间” at right, bottom row “来源” at left with empty right cell. Show one short orphan vertical red line to left of bottom 来源, circled red. No outer cell borders. This MUST visibly be two items on first row and one on second row. In row 03 remove both existing tiny desktop/mobile sketches and replace with a plain two-line typographic cause annotation: “列数已变” then “边框未变”, joined by a small red editorial bracket. Existing explanatory text at right unchanged. Row 02 remove screenshots/ and _local/ from the folder illustration; folder annotation-round-10/ contains ONLY one document named annotations.json. Right explanatory text already explains _local/ and must remain. Make observe badge flat muted blue #365bbb with small 4px corners, no gradient pill. All background uniform warm paper #f7f5ef, no texture. Everything else unchanged.

## 复核

已检查五阶段内容、2+1 示意、截图不入仓库的表述，以及观察状态与采纳后目标的区别。图片为栅格生成，字体和色值是视觉近似。

