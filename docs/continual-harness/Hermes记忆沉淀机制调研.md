# Hermes 记忆沉淀机制调研：Agent 怎样把一次经历变成下次可用的经验？

> 调研时间：2026-08-30
> 用途：为网站「Agent 自进化」章节的 `#se-hermes` 页面提供事实依据
> 主要来源：Hermes 官方文档、Continual Harness 论文，以及 git 历史中已删除的 `web/components/outline/sections/06-hermes-loop.ts`（commit `f07290e^`）

## 一、问题不是“记不住对话”，而是“不会积累经验”

今天的 Agent 可以在一次长对话里记住很多东西。可一旦会话结束，它往往又回到原点：昨天被用户纠正过的错误，今天还会再犯；上次摸索出来的工作流，下次仍要重新探索。

所以，真正的问题不是上下文够不够长，而是：**一次任务里获得的经验，怎样变成下一次任务可以直接复用的资产？**

Hermes（Nous Research 开源的 Agent 系统）给出的答案，是一条持续运转的经验闭环：

**Observe → Distill → Reuse → Refine**，也就是**观察、提炼、复用、修订**。

打个比方，一次会话就像一天的工作。Hermes 不只是保存当天的聊天记录，还会在“下班后”做复盘：哪些是应该长期记住的事实，哪些是以后可以照着执行的流程？它把这两类内容分别写进记忆和技能；以后发现旧经验不够好，再回头修改，而不是只管往里堆。

这套机制最值得关注的地方，不是“它有 memory”，而是它让经验形成了一个有容量约束、能复用、也能持续修订的生命周期。

## 二、四步闭环是怎样转起来的？

第一步是**观察（Observe）**。Hermes 保存本轮交互和执行轨迹，把它们当作复盘原料。这里还没有急着下结论，就像先保留会议记录和操作日志。

第二步是**提炼（Distill）**。每轮回复结束后，后台会启动一个异步复盘 Agent（Async Review Agent）。它从三个方向检查刚才发生了什么：有没有值得记住的信息、有没有能固化成技能的流程、执行过程中有没有反复出现的错误。

第三步是**复用（Reuse）**。提炼出的内容会进入后续会话。不过 Hermes 不会把所有材料一次性塞进上下文，而是按需加载。这样既保留经验，又不会让上下文被历史包袱撑满。

第四步是**修订（Refine）**。当后续任务发现更好的做法时，Hermes 会修改已有条目。这里的关键动作是 `patch`：旧经验不是只能追加、不能回头改的档案，而是一份持续维护的工作手册。

问题来了：提炼出的内容都放在一起，不就又会变成一个越来越乱的大文件吗？Hermes 的做法是把“知道什么”和“怎么做”分开保存。

## 三、为什么要分成 Memory 和 Skill？

Hermes 使用两类长期资产。

**Memory 是陈述性记忆（declarative memory）**，负责保存“是什么”。比如用户的长期偏好、项目约束、已经确认的事实。它更像一本随身通讯录或备忘录：内容短、调用频繁，适合直接放进新会话。

**Skill 是程序性记忆（procedural memory）**，负责保存“怎么做”。它更像一份操作手册：遇到什么情况该启用、具体步骤是什么、容易踩哪些坑、最后如何验证。Hermes 的标准 `SKILL.md` 通常包含 `When to Use`、`Procedure`、`Pitfalls` 和 `Verification` 等部分。

Agent 可以通过 `skill_manage` 自己创建、修改和删除技能，对应 `create`、`patch`、`edit`、`delete`、`write_file`、`remove_file` 等操作。官方优先推荐 `patch`，因为它只改必要片段，比整份重写更节省 token。

这项分工看似简单，却解决了一个常见混乱：如果把“用户喜欢简短回复”和“怎样分析财报”都塞进同一块记忆里，文件很快就会既冗长又难检索。拆开以后，Memory 保留短事实，Skill 承载长流程，各自按自己的方式生长。

## 四、记忆写满了怎么办？

无限记忆听起来很美，但对 Agent 来说，越多不一定越好。每次会话都加载一大堆旧信息，不仅花 token，还会让真正重要的内容淹没在噪声里。

因此 Hermes 给记忆设了硬上限：

- `MEMORY.md` 最多 2,200 个字符，约 800 tokens，通常容纳 8–15 条；
- `USER.md` 最多 1,375 个字符，约 500 tokens，通常容纳 5–10 条。

值得注意的是，**Hermes 不会在后台悄悄自动压缩记忆**。写入超限时，`memory` 工具会直接报错，并返回当前条目清单 `current_entries`。Agent 必须在同一轮里决定：哪些重叠内容可以用 `replace` 合并，哪些过期内容应该用 `remove` 删除，然后重新写入。官方建议占用超过 80% 时就主动整理。

这像一个空间有限的登机箱：装不下时，不能再塞一个新袋子了事，只能重新判断什么值得带走。容量上限由此变成了一种质量机制，倒逼 Agent 提高每条记忆的信息密度。

会话开始时，这些记忆会以**冻结快照（frozen snapshot）**的方式进入系统提示。用量头会显示类似 `67% — 1,474/2,200 chars` 的信息。会话过程中，落盘文件可以更新，但当前系统提示不变；新内容要到下一次会话才会出现。这样做是为了保住大模型的前缀缓存，避免每次写记忆都让整段系统提示失效。

## 五、“下班后复盘”会不会太贵？

后台复盘不是免费的。Hermes 默认 fork 一个 self-improvement review 分支，利用主模型已有的提示缓存回看本轮内容。用户不必等待这项工作完成，界面通常只会出现一行 `💾 Memory updated`。

如果主模型太贵，还可以通过 `auxiliary.background_review` 指定更便宜的模型。这时，后台分支不会拿到完整的缓存上下文，而会读取一份压缩摘要：近期轮次保留原文，更早的轮次保留摘要。

官方测试中，换用便宜模型后，复盘成本降低约 **3–5 倍**；Memory 的捕获结果完全一致，Skill 的捕获结果近乎一致。这个结果说明，经验提炼未必需要每次都调用最贵的主模型。

不过，自动沉淀也带来另一个问题：如果 Agent 把错误理解写进长期记忆，影响会跨会话延续。Hermes 因此提供 `write_approval`，可以先把写入内容放进待审批区，再通过 `/memory pending` 或 `/skills pending` 查看。对高风险场景来说，“先暂存、后确认”比完全自动落盘更稳妥。

## 六、技能很多时，怎样避免全部塞进上下文？

Hermes 使用**渐进式披露（progressive disclosure）**。说白了，就是先给目录，真正需要时再翻正文。

- Level 0：上下文中常驻所有技能的 `name`、`description`、`category` 索引，官方给出的典型规模约为 3k tokens；
- Level 1：Agent 判断某个技能可能有用后，通过 `skill_view(name)` 加载完整的 `SKILL.md`；
- Level 2：如果技能还带有 `references/`，再按需读取其中某个参考文件。

这套设计让“拥有多少知识”和“每次回答要读多少知识”不再是同一个数字。

例如 `/learn` 读入一本书时，不会把整本书复制进一个巨大的技能文件，而是生成“精简主文件 + 每章一个蒸馏文件”的知识库型 Skill。以后回答一个具体问题，只加载相关章节。于是，**查询成本大致跟答案所需的信息量成正比，而不是跟原始资料的总大小成正比。**

## 七、Continual Harness 说明了什么？

Hermes 本身是 Nous Research 的开源工程，并没有一篇同名论文。与这套思路最接近的学术参照之一，是 Continual Harness（arXiv:2605.09998）。论文在相关工作中把 Hermes 列为面向助手任务的 agentic harness，并把类似的经验优化概括为发生在 episode 之间的 harness 改进。

论文的起点是 **人在回路中（human-in-the-loop）**。早期 GPP 由 Agent 玩游戏，人类阅读运行轨迹、发现卡点，再手工改写 harness。这个循环确实能让 Agent 越玩越强，却离不开持续的人力维护。

Continual Harness 又向前走了一步：它用自动 Refiner 接替回路中负责修改 harness 的人。Refiner 每隔 $F$ 步读取最近一段轨迹，对系统提示、子 Agent、技能和记忆四类组件执行 CRUD 修改，而且整个游戏过程不重置。换句话说，它把“做事—由人复盘—由人改工作系统”，变成了“做事—自动复盘—自动改工作系统”。论文最后还把模型权重也接入更新，形成 model + harness co-learning。

实验在《宝可梦 红》和《宝可梦 绿宝石》上展开。Continual Harness 从只有画面、局部文字地图和按钮输入的极简接口起步，没有人工整理的游戏知识、工具和任务脚手架，却收回了与手工专家 harness 之间的大部分效率差距。在 Yellow Legacy 的长期运行记录里，技能和子 Agent 的增删改贯穿 20 多万轮，没有收敛成一套永远不变的架构；修改主要集中在导航和战斗这些最常出问题的组件上。

但论文也给出了必须正视的反例。Gemini 3 Pro 上，Continual Harness 在《绿宝石》中以约 130 美元的中位成本完成 100% 里程碑；极简基线约花 215 美元完成 98%，成本下降约 40%。到了能力较弱的 Flash-Lite，极简基线还能以 11 美元达到 20%，Continual Harness 的各个版本却只有 3%–13%，成本还相当或更高。

这意味着：**自我改进闭环本身也需要能力门槛。** 一个还不会正确使用技能、维护记忆的模型，拿到可编辑的 harness 后，未必变强，反而可能把自己的工作系统越改越乱。

## 写在最后

Hermes 的启发，不是简单地给 Agent 加一个 Memory 文件，而是重新安排经验的去向：先保存轨迹，再异步复盘；把事实写进 Memory，把流程写进 Skill；复用时按需加载；空间写满时强制合并；新证据出现后继续修订。

真正能“工作越久越聪明”的 Agent，需要的不只是记性，还需要一套经验管理制度：什么值得留下，应该放在哪里，什么时候取出来，以及旧经验错了以后怎样改。

而 Continual Harness 的反例又提醒我们，制度不会自动带来能力。只有当模型能够可靠地使用、检查和修订这些外部资产时，经验闭环才会变成飞轮；否则，它也可能只是一个把错误保存得更久的放大器。

## 资料来源

- [Hermes Skills 官方文档](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)
- [Hermes Memory 官方文档](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)
- [Continual Harness：arXiv:2605.09998](https://arxiv.org/abs/2605.09998)
- Hermes Agent GitHub：`NousResearch/hermes-agent`（Apache-2.0）
- 网页章节：`web/components/harness/self-evolution-sections.tsx` 的 `#se-hermes`
- 配图：`web/public/outline/hermes-memory-files.png`，以及同目录的 `hermes-background-review.png`、`hermes-agent-managed-skills.png`、`hermes-progressive-disclosure.png`
- Claude 侧的“睡眠机制”调研：`docs/claude-dreaming调研.md`
