# 配图生成记录

工具：内置 image_gen。依据：web_design_harness/DESIGN.md。

## 初始提示词

Use case: infographic-diagram
Create a polished Chinese editorial infographic for Design Harness research report, landscape 3:2, very high resolution. This is a finished report illustration, not a screenshot of a website. Theme: how designer feedback becomes reusable machine checks.
Strict design system: flat warm paper #f7f5ef, ink #242521, thin rules #deded4, vermilion #b83d2b for section numerals and annotations only, blue #365bbb for revisions and loop arrows, small pale sticky note #f3e8af. Chinese headline in elegant Songti serif; labels clean PingFang-like sans serif. Generous whitespace, aligned editorial grid, fine dividers. No gradients, glass, 3D, decorative icons, heavy shadows or dashboard cards. All Chinese must be accurate, large and readable. Small rounded corners 4–8px only where papers require them.
Title exact: “从一次标注，到持续检查”
Eyebrow: “DESIGN HARNESS / 01”
Subtitle exact: “设计师提供判断，Agent 提炼规则，机器持续执行”
Composition: three horizontal reading bands with clear arrows and numbered section markers. Top band modest height, middle band main focus, bottom band candidate lifecycle and loop. Tiny schematic UI paper/annotation illustration can accompany Local Review, document sheets can accompany archive, but clarity and text dominate.
Top band label “01 生成与评审”. Four steps left to right connected:
“导入 React 种子” → “泛化到不同场景” → “调试 Skill” → “Local Review 标注”
Below last step small caption “点击元素，记录意见”.
Middle band label “02 从反馈找根因”. Connect last top step into left of middle band via clean outside connector. Four steps left to right:
“原始标注 JSON” (caption “元素快照 · 截图 · 意见”)
→ “按轮归档” (caption “保留反馈来源”)
→ “证据映射与根因归并” (caption “场景 / Profile / 转换器”)
→ “反馈轮次记录”.
A small sticky annotation below this band says exactly “小屏换行后，分割线也应随布局调整” and small “示例”.
Bottom band label “03 让经验持续生效”. From feedback record flow to “跨场景规则候选” → “观察” → “评估”; split from 评估 into prominent “采纳” → “可执行检查” (caption “静态审计 / 渲染门禁 / lint”) → “构建与发布自动检查”; secondary thin branch “废弃 · 保留结论”. Near executable check caption “配套失败样例与适用场景”.
A distinct blue return arrow along the perimeter from automatic checks back to generation band, labeled “约束后续产物，再生成、再评审”. Also feedback record has a slim blue branch returning to 调试 Skill labeled “修正场景、Profile 或转换器”.
Footer separated by fine rule: “一次人工反馈，沉淀为持续执行的机器检查。”
Small footer note: “流程示意；候选规则经评估采纳后，在适用范围内生效。”
Make topology clear with no arrows across text. No extra claims or invented labels.

## 修改提示词

Edit this infographic, preserve accurate Chinese typography, title, three editorial bands and warm-paper palette. Strict corrections:
1 Remove ALL large enclosing rounded rectangles around each process stage. Keep tiny internal document/UI illustrations, but stages themselves sit on open paper with whitespace and thin row dividers. No enclosing cards. No paper grain or gradient, use uniform #f7f5ef.
2 Fix arrow topology: Local Review goes ONLY to 原始标注 JSON. Remove upward spur from that connector to 调试 Skill. Add separate clearly traceable blue return connector FROM 反馈轮次记录 to 调试 Skill labeled 修正场景、Profile 或转换器.
3 Add clearly visible arrow FROM 反馈轮次记录 down then left in the gap between bands 02 and 03 to 跨场景规则候选. This connection is essential. Route around text, never through it.
4 Replace feedback rounds table with simple document icon and three plain lines “逐条对应证据”, “归并共同根因”, “记录归因与结论”. Remove all fabricated numeric counts.
5 Top right remove extra English marketing slogan and replace with small “协作流程示意”.
6 Exact palette blue #365bbb, vermilion #b83d2b, ink #242521, borders #deded4. Keep muted yellow note only as accent. Keep main automatic-check perimeter return arrow.
All other labels and branching 观察→评估→采纳 / 废弃 remain. Polished editorial publication diagram, ample whitespace and legible Chinese.

Edit only connector lines in this image; preserve all typography and illustrations. There are two required fixes. 1 DELETE the blue upward arrow into 调试 Skill and its horizontal line and label 修正场景、Profile 或转换器. Keep the independent Local Review 标注 to 原始标注 JSON arrow, no branches. 2 ADD one blue #365bbb loop connector starting at right edge of bottom-right 构建与发布自动检查 illustration, traveling right into far-right margin, then straight UP along far-right margin, then LEFT along whitespace immediately under subtitle and above row 01 headings, then DOWN arrow pointing at 泛化到不同场景 heading. Label that upper horizontal return line exactly 再生成、再评审 in blue. No other alterations. The return loop must be visible. Keep feedback record down-left arrow to rule candidates unchanged.

## 复核

已检查中文、分区、候选采纳/废弃分支和自动检查回路。采用刊物排版，去除外层卡片和虚构反馈数量。配图为主链路摘要，完整修正分支保留于 CONTENT.md。栅格生成的字体与颜色为视觉近似，非 CSS 变量逐像素实现。

