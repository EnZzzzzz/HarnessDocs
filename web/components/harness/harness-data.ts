/**
 * Harness 六大运行时职责。
 * 依据 arXiv 2606.20683《From QA to Task Completion: A Survey on Agent System and
 * Harness Design》的形式化定义 A_LLM = ⟨M, I_obs, C, L, I_act, S, V⟩。
 * implementations 中的实现要点来自 docs/harness/ 下两份调研文档：
 * codex-harness.md（openai/codex 源码调研）与 claude-code-harness.md
 * （Claude Code 官方文档 + 逆向源码调研），intro 为机制总述，points 为逐条
 * 机制展开，source 为源码路径或文档出处。
 * detail 为三段式叙事：这一层解决什么问题 → Codex / Claude Code 怎么做 →
 * 自进化引子；evolution 收录真实场景中这一层被改写的公开案例
 * （大厂工程博客 / 研究论文 / 开发者实操），source 为出处 URL。
 */

export interface HarnessImplementation {
  /** 产品名 */
  product: 'Codex' | 'Claude Code'
  /** 机制总述：这一层在该产品的运行流程里如何工作 */
  intro: string
  /** 实现要点：text 为机制级描述，source 为源码文件路径或文档出处 */
  points: { text: string; source?: string }[]
}

export interface HarnessEvolution {
  /** 案例主体，如 OpenAI · Codex */
  name: string
  /** 案例描述：触发场景 → 改法 → 效果 */
  text: string
  /** 出处 URL */
  source?: string
}

export interface HarnessPart {
  /** 形式化符号，如 I_obs */
  symbol: string
  /** 中文名 */
  name: string
  /** 英文名 */
  en: string
  /** 卡片正面的一句话概括 */
  tagline: string
  /** 详情段落：问题 → 大厂做法 → 自进化引子 */
  detail: string[]
  /** 详情：两个产品的真实实现要点 */
  implementations: HarnessImplementation[]
  /** 自进化实践：真实场景中这一层如何被改写 */
  evolution: HarnessEvolution[]
}

export const HARNESS_PARTS: HarnessPart[] = [
  {
    symbol: 'I_obs',
    name: '观察接口',
    en: 'Observation Interface',
    tagline: '把环境信号翻译成模型能读懂的观察',
    detail: [
      '模型看不见世界，它只能读上下文。观察接口负责把原始环境信号——终端输出、文件 diff、截图、DOM 状态、性能指标——裁剪、格式化成模型可消费的观察。观察给得是否干净、是否聚焦于当前决策，直接决定推理质量。',
      '两家大厂在这一点上思路一致、手法不同。Codex 讲究「少给、给准」：命令输出首尾对称截断，长命令变成模型按需轮询的拉取，文件改动用 TurnDiffTracker 记净 diff 而不重读磁盘。Claude Code 讲究「快照 + 规矩」：启动时注入一次性的环境快照并明确声明它不会更新，文件读取带行号前缀，每条观察有尺寸分级，subagent 回传的报告还要先过一道防提示注入的扫描。',
      '但当现有的观察通道不够用——比如做前端任务时根本看不到页面渲染结果——最有效的自进化不是换模型，而是让模型给自己接一条新的观察通道。下面两个实践正是这么做的。',
    ],
    implementations: [
      {
        product: 'Codex',
        intro:
          'Codex 的观察接口刻意保持「哑终端」风格：模型每一轮 ReAct 循环里读到的，主要是终端输出、补丁执行结果和环境上下文，全部以 Responses API 的 FunctionCallOutput 或文本消息形式回传——没有 AST 索引，没有 LSP 语义回传，想看代码就老老实实用 exec_command 跑 cat/rg。命令输出不是原样灌进上下文，而是先过一层 head/tail 对称截断缓冲：开头和结尾各保留一半预算、中段丢弃，并显式标注省略了多少字节，因为命令输出最有信息量的通常是开头的报错定位和结尾的最终状态。跑测试、起服务这类长命令走异步路径：默认只等 10 秒就返回一个 session_id，把后续输出留给模型用 write_stdin 按需轮询——观察从一次性推送变成模型主动拉取。文件编辑的反馈也不重读文件系统，而是由 TurnDiffTracker 在本轮内维护 apply_patch 产生的净 diff。整体哲学是把观察的复杂度让渡给模型：harness 只保证输出有界、可续读，看什么、看多少由模型自己决定。',
        points: [
          {
            text: 'exec_command 在 PTY 中执行命令，输出经 HeadTailBuffer 做对称截断：容量首尾各占 50%，超出后丢弃中段，硬上限 1 MiB（UNIFIED_EXEC_OUTPUT_MAX_BYTES），默认另有 10,000 tokens 的输出预算。截断处插入 "... N bytes omitted ..." 标记，让模型知道中间缺了多少内容、可据此决定是否分段重读。这样设计是因为日志类输出的关键信息集中在首尾（开头的编译错误、结尾的测试汇总），中段往往是噪音。',
            source:
              'core/src/unified_exec/head_tail_buffer.rs、core/src/unified_exec/mod.rs',
          },
          {
            text: '长命令默认最多等待 yield_time_ms（默认 10s，可调范围 250–30000ms）就返回一个 session_id，进程继续在后台跑；模型之后用 write_stdin 工具轮询增量输出，甚至向进程喂 stdin 输入（比如交互式 REPL）。这把「等待输出」从阻塞式推送变成模型按需拉取：模型自己决定什么时候回来检查、要不要继续等，控制循环不会被一个长跑进程卡死。',
            source:
              'core/src/tools/handlers/unified_exec/、core/src/tools/handlers/shell_spec.rs',
          },
          {
            text: 'TurnDiffTracker 在内存中跟踪本轮 apply_patch 已提交变更产生的净 diff——按路径维护 baseline 与 current 两份内容快照，编辑完成后直接算 diff，完全不重读工作区文件系统。好处是双重的：省去一次磁盘扫描的 I/O 开销，也避免读到 patch 之外其他进程改动造成的脏观察；模型看到的「本轮改了什么」恰好就是它自己改的那部分。',
            source: 'core/src/turn_diff_tracker.rs',
          },
          {
            text: 'view_image 把本地图片或截图作为 InputImage content 注入下一轮输入，给「哑终端」留了一个视觉观察的口子（截图验证 UI、看设计稿等场景）。除此之外 Codex 没有任何结构化代码观察：无 AST、无 LSP、无语义索引，模型理解代码的唯一途径就是 exec_command 跑 cat/rg。这是明确的设计取舍——把观察层做薄，换取 harness 的简单和模型行为的可预测。',
            source: 'core/src/tools/handlers/view_image.rs',
          },
        ],
      },
      {
        product: 'Claude Code',
        intro:
          'Claude Code 的观察接口走「薄」路线：模型读到的主要是原始文本快照和工具结果回灌，没有向量检索，也没有对环境状态做结构化建模。会话启动构建系统提示词时注入一个 <env> 环境块（工作目录、是否 git 仓库、平台、日期、模型名），紧随其后是两个一次性快照块——目录结构和 git status——且快照文本里明确写着「This snapshot will NOT update during the conversation」，模型要新鲜信息必须主动调 Glob/Grep/Bash 重新观察。之后每轮循环里，工具执行结果以 tool_result 内容块进入对话历史，成为下一次模型调用的观察。观察进入上下文前还有尺寸控制：Read 默认上限 2000 行，每条消息的尺寸上限是 pre-model shapers 的第一级。外部信号（hooks 返回的 additionalContext）统一以 <system-reminder> 包装注入；而 subagent 报告这类不可信观察在回主对话前会被扫描净化，防止间接提示注入。',
        points: [
          {
            text: '环境快照注入：会话开始时把 <env> 块、目录结构快照、git status 快照拼进系统提示词，三者都只采样一次。快照文本明确告知模型「不会更新」，这把「信息过期」的责任转嫁给模型——它需要新状态时必须自己调工具，harness 不做后台刷新，换取实现的极简。',
            source:
              'src/constants/prompts.ts · computeSimpleEnvInfo（v2.1.76 反混淆源码）+ kirshatrov.com mitmproxy 抓包（2025-04）',
          },
          {
            text: '工具结果以 tool_result 块回灌对话历史，文件读取结果带行号前缀。Edit 工具描述专门用命令式规则提醒模型「行号前缀不属于文件内容，old_string/new_string 绝不能包含它」——因为行号同时是观察格式和编辑动作的隐患，harness 选择在提示词层面就地消解这个歧义。',
            source: 'src/tools/FileEditTool/prompt.ts（nadonghuang/claude-code v2.1.76）',
          },
          {
            text: '观察入口的尺寸控制分两档：Read 工具默认只读文件前 2000 行；更底层的是 Budget Reduction——每条消息的尺寸上限，作为每次模型调用前 5 个 pre-model shapers（上下文整形器）的第一级始终生效，超限部分直接丢弃。它只截断单条消息、不改写历史结构，是最便宜的一级压缩。',
            source:
              'Dive-into-Claude-Code · docs/architecture.md；kirshatrov 抓包的 View 工具描述',
          },
          {
            text: 'hooks 等外部信号经 additionalContext 返回后，被包装成 <system-reminder> 注入观察流，官方文档明确「injected as a system reminder that Claude reads as plain text」。系统提示词也预先告知模型 tool results 和 user messages 里可能出现 <system-reminder> 标签，让模型把这类注入当作环境旁白而非用户指令来读。',
            source:
              'code.claude.com/docs/en/hooks-guide；getSystemRemindersSection（v2.1.76）',
          },
          {
            text: '沙箱拒绝命令时，harness 把违规细节（被拦的文件路径或域名）追加到失败命令的输出里。模型在下一轮观察中直接看到「为什么失败」，从而自我修正路径或域名，而不是对着一个无解释的 EPERM 反复重试。',
            source: 'code.claude.com/docs/en/sandboxing',
          },
          {
            text: 'subagent 最终报告回主对话前被扫描净化：模仿 <system-reminder> 标签或 Human:/Assistant: 行首的文本被插入反斜杠转义；提及 bypassPermissions 等权限设置的文本前置一行 [harness: subagent output matched instruction-shaped pattern(s): ...] 标记。这是观察接口层的提示注入防御——隔离上下文只挡历史不挡内容，恶意文本仍可能藏在子代理的输出里。',
            source: 'code.claude.com/docs/en/sub-agents · "Subagent output scanning"',
          },
        ],
      },
    ],
    evolution: [
      {
        name: 'OpenAI · Codex 给自己接「眼睛」',
        text: '触发场景：Codex 做前端任务时只能读代码和日志，视觉问题修了也验证不了。OpenAI 的解法是让它通过 Chrome DevTools MCP 自动验证自己的工作——渲染快照对比、真实触发 UI、收集控制台与网络事件，发现问题就循环修复直到干净。观察接口从「盲改 CSS」进化为「看见页面再改」，验证环节也随之全自动闭环。',
        source: 'https://openai.com/index/harness-engineering/',
      },
      {
        name: 'Anthropic · evaluator 用 Playwright 亲眼看',
        text: '触发场景：设计任务里「代码能跑」和「看起来对」是两回事，纯文本观察判不了视觉质量。Anthropic 给 evaluator 接上 Playwright，把应用真实渲染出来、像用户一样点击游走之后才打分——主观的视觉判断被转成可操作的观察通道，也为 V 层的量化评分提供了输入。',
        source: 'https://www.anthropic.com/engineering/harness-design-long-running-apps',
      },
    ],
  },
  {
    symbol: 'C',
    name: '上下文管理',
    en: 'Context Manager',
    tagline: '决定什么信息、何时、以什么形式进入窗口',
    detail: [
      '上下文管理是 Harness 的性能天花板：窗口越长，推理越慢、越贵、越容易出错——有观察表明窗口用到约 40% 后输出质量就开始下滑（Smart Zone / Dumb Zone）。这一层要在有限窗口里塞进最有效的信息：压缩、分层披露、按需加载，以及在上下文焦虑时直接 reset、用结构化文档交接。Skill 本质上也是这一层的标准化：元数据常驻，命中场景后才加载详细规则。',
      'Codex 把「写交接」交给模型自己：压缩摘要由模型写，重建时保留近期消息、重注入差分后的世界状态；Skills 只常驻元数据清单，命中才读正文。Claude Code 则把压缩做成每次调用前按序执行的五级管线，CLAUDE.md 四层分层加载，再用 Dream 流程定期整合记忆、防止记忆腐烂。共同思路都是：常驻的尽量少，按需的尽量准。',
      '值得注意的是，上下文策略并不只由厂商设计——在真实场景里，使用者和模型自己都在持续改写「怎么记、记什么、何时忘」。',
    ],
    implementations: [
      {
        product: 'Codex',
        intro:
          'Codex 发给模型的每个请求是一个 Prompt 结构（完整会话历史 input + 工具列表 tools + base_instructions），上下文管理的所有产物最终都汇聚到这里。每轮请求里除了历史消息还叠了几层 harness 维护的上下文：275 行的 base instructions 以 developer 角色单独成消息注入；AGENTS.md 从项目根到 cwd 链式拼接，总量限制在 32 KiB；cwd、shell、权限等环境信息走一套「世界状态差分注入」系统——每类片段（环境、权限、AGENTS.md、协作模式）实现 ContextualUserFragment 接口渲染成 XML，harness 把当前渲染结果与上一轮比较，只在发生变化时注入 diff，避免每轮重复塞同样的上下文。Skills 和跨会话记忆也遵守同样的节俭原则：常驻的只有 skill 元数据清单和 memory_summary.md 摘要，全文按需加载。当上下文逼近窗口上限时，压缩流程让模型自己写交接摘要，然后重建历史：只保留近期用户消息（20,000 tokens 预算）、重注入当前世界状态、把摘要作为一条 user 消息放在末尾，工具调用与 reasoning 全部丢弃。',
        points: [
          {
            text: '基础指令是编译进二进制的 markdown 文件 default.md（约 275 行，经 include_str! 嵌入），覆盖人格、AGENTS.md 规范、update_plan 用法、任务执行与测试验证约定等，运行时以 developer 角色单独成消息注入。沙箱边界说明不在其中，而是按当前配置动态生成 developer 消息（sandbox_mode/approval_policy 模板），保证模型读到的权限描述与实际生效的沙箱严格一致。',
            source:
              'codex-rs/protocol/src/prompts/base_instructions/default.md、codex-rs/prompts/src/permissions_instructions.rs',
          },
          {
            text: 'AGENTS.md 链式加载：从 cwd 向上走直到命中 project_root_markers（默认 .git）确定项目根，然后收集从根到 cwd 每一级的 AGENTS.md 按从根到叶的顺序拼接（另有全局层 ~/.codex/AGENTS.md 与 AGENTS.override.md），总量受 project_doc_max_bytes 限制（默认 32 KiB）。注意治理与上下文在此交叉：不受信任的项目会直接跳过项目文档加载，防止恶意仓库借 AGENTS.md 投毒提示词。',
            source: 'core/src/agents_md.rs',
          },
          {
            text: '世界状态差分注入：cwd、shell、网络与文件系统权限等被渲染成 <environment_context> 等 XML 片段的用户消息；context/world_state/ 下每个片段实现 ContextualUserFragment，harness 比较当前与上一轮的渲染结果（render_diff），只在变化时注入 diff。模型每轮读到的环境信息总是最新的，但不变的部分零成本，长会话里省下的重复上下文相当可观。',
            source:
              'core/src/context/world_state/、core/src/context/environment_context.rs',
          },
          {
            text: '压缩的本质是让模型自己写交接摘要：克隆当前历史并追加压缩指令（prompt.md 要求覆盖进展、关键决策、约束、下一步），用一个无工具的 Prompt 产出摘要。重建时新历史 = 近期用户消息（从最新往最旧挑，预算 20,000 tokens，最早一条可截断，旧摘要消息被排除防套娃）+ 重新注入的当前世界状态 + 末尾一条带 SUMMARY_PREFIX 的摘要 user 消息；全部工具调用、工具输出、reasoning、中间 assistant 消息一律丢弃。若压缩请求本身超窗，则从头部逐条删最老历史项重试（保持前缀稳定以保住 KV cache）。',
            source:
              'core/src/compact.rs、codex-rs/prompts/templates/compact/prompt.md、codex-rs/prompts/templates/compact/summary_prefix.md',
          },
          {
            text: 'Skills 渐进式披露：常驻上下文的只有元数据清单（每个 skill 一行：name + description + 路径），以 developer 片段注入；选中后才读 SKILL.md 全文包成 SkillInstructions 片段，plugin 来源的正文截断到 8,000 字节。触发方式有用户显式 $SkillName、提示词规则（任务明显匹配 description 时本轮必须用）和一个仍在实验中的动态选择器（BM25、n-gram 等多种打分实现）。模型也可用内建 skills.list / skills.read 工具分页按需读取。',
            source:
              'codex-rs/ext/skills/src/render.rs、codex-rs/ext/skills/src/catalog_prompt.rs、codex-rs/skills/src/model.rs',
          },
          {
            text: '跨会话记忆是两阶段后台流水线：Phase 1 从 state DB 认领近期 rollout，让模型从中提炼结构化 raw_memory 与 rollout_summary；Phase 2 在全局锁下派一个无审批、无网络、仅本地写的整合子 agent，把 top-N 结果整合成 ~/.codex/memories/ 下的 MEMORY.md（该目录是 git 基线目录）。读路径把 memory_summary.md 嵌进 developer 指令，规定快速检索流程（看摘要 → 搜 MEMORY.md → 必要时开 1–2 个 rollout_summaries/，预算 ≤4–6 次搜索），引用必须附 <oai-mem-citation> 供程序解析与使用率统计。加上 ~/.codex/AGENTS.md（人工写）和 rollout 本身（原始证据），Codex 的记忆实际分三层。',
            source:
              'codex-rs/memories/、codex-rs/ext/memories/、codex-rs/memories/write/templates/memories/stage_one_system.md',
          },
        ],
      },
      {
        product: 'Claude Code',
        intro:
          'Claude Code 的上下文管理是「做厚」的一层。每次模型调用前，5 级压缩管线按从便宜到昂贵的顺序执行：Budget Reduction（每条消息尺寸上限，始终生效）→ Snip（裁剪较老历史，feature-gated）→ Microcompact（把老工具结果替换成占位符）→ Context Collapse（读取时的非破坏虚拟投影，feature-gated）→ Auto-Compact（模型生成完整摘要，最后手段），前面级别腾出的空间够了就不走后面。系统提示词本身由多个 section 分段组装，用显式的静态/动态边界标记分开可缓存前缀与每轮变化的内容，精细维护 prompt cache 命中率。长期上下文靠文件化的记忆生态：CLAUDE.md 四层分层加载并以 user message 注入，auto memory 用 MEMORY.md 索引加主题文件，Skill 只常驻元数据、正文按用加载。还有 Dream 记忆整合机制——一个后台 subagent 在「会话间隙」对记忆目录做四阶段反思整理，解决记忆腐烂。',
        points: [
          {
            text: '5 级压缩管线每次模型调用前按序执行，Auto-Compact 是最后手段。其阈值在 autoCompact.ts 中计算：有效窗口 = 上下文窗口 − 模型 max output tokens，取窗口百分比阈值与配置值 autoCompactWindow 的较小者，并预留 20,000 token 的预警/错误缓冲；触发后用模型生成摘要替换历史。日志里还能看到 snipTokensFreed 字段，说明 Snip 先于 auto-compact 尝试腾空间。',
            source:
              'src/services/compact/（v2.1.76）+ Dive-into-Claude-Code · docs/architecture.md',
          },
          {
            text: 'Microcompact 把老的工具结果替换为占位符 [Old tool result content cleared]，保留消息结构只清内容。它有两条路径：时间触发（距上条 assistant 消息超过阈值——注释说明因为服务端缓存已冷、前缀反正要重写，趁机瘦身）；缓存编辑路径 CACHED_MICROCOMPACT 则通过 API 的 cache editing 能力在不使缓存前缀失效的前提下删除工具结果，阈值来自 GrowthBook 服务端配置，且只对主线程生效避免污染 fork 出的辅助 agent。',
            source: 'src/services/compact/microCompact.ts（v2.1.76）',
          },
          {
            text: '系统提示词由 section 数组拼装，getSystemPrompt 的返回明确分两段：边界标记之前是可跨组织缓存的静态内容（scope: global），之后是 user/session 相关的动态段（session_guidance、memory、env_info、mcp_instructions 等）。易变 section 用 DANGEROUS_uncachedSystemPromptSection 显式命名并要求写明理由——比如 mcp_instructions 每轮重算是因为 MCP 服务器会在 turn 之间连接/断开，宁可打破缓存也要保证指令与真实工具集一致。',
            source: 'src/constants/prompts.ts + systemPromptSections.ts（v2.1.76）',
          },
          {
            text: 'CLAUDE.md 四层体系：managed policy（/Library/Application Support/ClaudeCode/ 或 /etc/claude-code/）、user（~/.claude/）、project（./CLAUDE.md）、local（./CLAUDE.local.md），从 cwd 向上遍历祖先目录全部拼接，支持 @import 递归导入最深 4 跳。关键设计是以 user message 注入系统提示词之后而非并入系统提示词——是「概率性遵从」的上下文而非确定性强制；压缩后项目根 CLAUDE.md 从磁盘重新读取注入，保证它活过 /compact。',
            source: 'code.claude.com/docs/en/memory',
          },
          {
            text: 'Skill 渐进式披露：常驻上下文的只有元数据——description 与 when_to_use 拼接后在 skill 列表中截断至 1,536 字符；正文只在被调用时作为一条消息进入上下文，且驻留后续所有 turn。auto-compact 后会重新附上每个已调用 skill 最近一次内容的前 5,000 token（合计预算 25,000 token，从最近调用往前填充，老 skill 可能整体被丢弃），让被压缩掉的技能说明「按需复活」。',
            source: 'code.claude.com/docs/en/skills',
          },
          {
            text: 'Dream / Auto Dream 是「睡眠式」记忆整合：一个后台 subagent 对 auto memory 目录做定期反思整理，触发门槛为距上次整合 ≥24h 且累积 ≥5 个会话（服务端 flag tengu_onyx_plover 灰度控制）。四阶段流程：Orient（ls 记忆目录摸清现状）→ Gather（按优先级收集新信号：会话日志、与代码现状矛盾的旧记忆、对 JSONL 转录的定向 grep）→ Consolidate（合并近似条目、相对日期转绝对日期、删除被证伪的事实）→ 修剪索引（保持 MEMORY.md 在 200 行启动阈值以内）。它复用 append-only 会话日志与转录作为信号源，解决相对日期失效、条目矛盾、重复的记忆腐烂问题。',
            source:
              'Piebald-AI/claude-code-system-prompts · agent-prompt-dream-memory-consolidation.md（v2.1.235 提取）+ SFEIR 分析文章',
          },
          {
            text: 'subagent 在独立上下文窗口运行，只携带自己的系统提示词（frontmatter 的 markdown body）加基本环境信息，不继承父对话历史；内置 Explore 和 Plan 甚至跳过 CLAUDE.md 与 git status 以保持轻量。只有最终摘要返回父对话——这既是上下文隔离也是上下文预算控制，subagent 描述字段合计超过 15,000 token 时启动会警告。',
            source: 'code.claude.com/docs/en/sub-agents',
          },
        ],
      },
    ],
    evolution: [
      {
        name: 'Manus · 文件系统即上下文',
        text: '触发场景：通用 agent 动辄 50+ 步工具调用，网页、PDF 这类观察轻松超过窗口上限，不可逆压缩又会丢掉后面要用的信息。Manus 的做法是把文件系统当作无限的外置上下文——丢网页正文但留 URL，丢文档内容但留路径，需要时重新读取；agent 还会反复重写 todo.md，把全局计划「背诵」到上下文尾部对抗遗忘。换来的是上下文策略以小时为单位迭代上线，而不是等端到端训练的数周。',
        source:
          'https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus',
      },
      {
        name: 'MemGPT / Letta · 模型自己当内存管理员',
        text: '触发场景：固定窗口装不下长期任务的全部历史。MemGPT 借鉴操作系统的虚拟内存，把上下文分为主上下文与外置存储；记什么、删什么、何时把对话归档，全部由模型通过函数调用自主决定——上下文管理从「Harness 替模型管」进化为「模型自己管」，这也是后来 Letta 产品化的核心。',
        source: 'https://arxiv.org/abs/2310.08560',
      },
    ],
  },
  {
    symbol: 'L',
    name: '控制循环',
    en: 'Control Loop',
    tagline: '编排「观察—推理—行动—反馈」的循环',
    detail: [
      '模型每次只输出下一个动作，「观察—推理—行动—反馈」的循环本身由 Harness 提供：步骤调度、停止条件、重试、反思、子代理委派。好的编排是该确定的地方确定、该灵活的地方灵活——确定性步骤走流水线，需要判断的步骤交给模型。',
      'Codex 刻意把循环做薄：run_turn 内层循环并发执行工具，停止条件朴素（无工具调用即收工），子任务做成外挂工具，没有内建规划器或反思器。Claude Code 反过来把循环做成标准件：单一 async generator 支撑 CLI、SDK、IDE 全端，每轮走固定流水线，并开放 27+ 个 hooks 生命周期事件作为确定性编排点，补充模型的自主循环。',
      '循环的形态更不是厂商专利——真实场景里最激进的循环改造恰恰来自使用者：有人用五行 shell 重写了整个编排层，也有开源系统给循环加上了自己长出来的复盘环节。',
    ],
    implementations: [
      {
        product: 'Codex',
        intro:
          'Codex 的控制循环刻意做薄：每个用户输入被包装成 SessionTask，普通对话由 RegularTask 承担，它反复调用 run_turn() 驱动「观察—推理—行动—反馈」循环，期间用户追加输入就再开一轮，整个过程可被 CancellationToken 打断。run_turn 内层（约 2800 行）先做预防性压缩、捕获本轮的上下文与工具列表快照，然后进入流式循环：消费 Responses 事件流，每收到一个 OutputItemDone 就把工具调用丢进 FuturesOrdered 并发执行，流结束后把结果追加进历史，若模型本轮产生过工具调用或有排队输入就带着新观察再采样。停止条件朴素到底：模型这一轮没发起任何工具调用且没有排队输入，本轮即结束；token 触顶不是硬失败，而是 rollover 到压缩继续跑。循环里没有内建的规划器、反思器或预算控制器——连子 agent 都是通过 multi_agents 工具外挂的，「下一步做什么」完全交给模型，harness 只负责把循环转下去、把错误重试掉。',
        points: [
          {
            text: '每个用户输入包装成 SessionTask，种类有 Regular（普通对话）、Compact、Review、UserShell 等，由 Session 串行调度。RegularTask::run 的外层循环负责「排干用户输入」：run_turn 返回后若输入队列里还有待处理输入（用户在模型运行期间又发了消息），就带着新输入再开一轮，直到队列清空任务才结束；终态错误则直接返回，不会拿同一份输入重开失败的轮次。',
            source: 'core/src/tasks/regular.rs、core/src/tasks/mod.rs',
          },
          {
            text: 'run_turn 内层循环（约 2800 行）的结构：先做 pre-sampling compaction 与 step context 快照（本轮上下文、工具列表），进入循环后消费流式事件，每收到 OutputItemDone 立即把工具调用丢进 FuturesOrdered 并发执行（不等流结束，工具间也并发），流结束后把工具结果追加进历史，再按 needs_follow_up（本轮产生过工具调用）或排队输入决定是否再采样。流式边收边执行，把模型生成与工具执行的等待时间重叠了起来。',
            source: 'core/src/session/turn.rs',
          },
          {
            text: '停止条件是典型的 ReAct loop-until-done：本轮无工具调用且无排队输入即结束，记录 last_agent_message。token 触顶不硬失败，而是 rollover：轮中采样结束后发现触顶就触发 run_auto_compact，压缩后带着新上下文窗口继续当前轮。与提示词层「keep going until the query is completely resolved」的约定互为表里——循环结构不设上限，靠模型自觉收尾。',
            source:
              'core/src/session/turn.rs、codex-rs/protocol/src/prompts/base_instructions/default.md',
          },
          {
            text: '流式请求的错误重试集中在 responses_retry.rs：指数退避（初始 5s，上限 60s），区分连接错误与采样错误分别处理；同一 turn 内复用 ModelClientSession，保住 WebSocket 连接与路由状态，重试不必重建会话。这让一次网络抖动对模型基本不可见，是长 turn 稳定性的兜底。',
            source: 'core/src/responses_retry.rs',
          },
          {
            text: '控制循环做薄、子任务做成工具：spawn 子 agent 不是循环的内建概念，而是经 multi_agents 工具（spawn.rs/wait.rs/close_agent.rs）暴露给模型，agent 注册表与内建角色（如 explorer.toml）在 core/src/agent/ 维护。没有内建规划器、反思器——harness 只提供「开一个子 agent 并等结果」这个动作，何时开、开几个、结果怎么用，都是模型的决策。',
            source: 'core/src/tools/handlers/multi_agents/、core/src/agent/',
          },
        ],
      },
      {
        product: 'Claude Code',
        intro:
          '控制循环是 Claude Code 做得最薄的一层：核心就是 src/query.ts 里一个 queryLoop async generator——model call → tool dispatch → result collection → repeat，交互式 CLI、headless claude -p、Agent SDK、IDE 插件全部汇聚到这同一个代码路径。每个 turn 走 9 步流水线：Settings 解析 → 状态初始化 → 上下文组装 → 5 个 pre-model shapers → 模型调用 → 工具分发 → 权限门 → 执行 → 停止检查。停止逻辑克制且有明确上限：模型不再发起 tool call 即结束 turn，Stop hook 可以阻止停止并把原因反馈给模型，但连续 block 8 次后强制放行以防死循环。重试与恢复也是有限策略：max output token 逐级上调（每 turn 至多 3 次）、reactive compaction 每 turn 至多触发一次、prompt-too-long 按 context-collapse → reactive compaction → 终止的顺序降级。模型自主循环之外，hooks 在 27+ 生命周期事件提供确定性编排点，AgentTool 则把委派给 subagent 也变成循环内的一次普通工具调用。',
        points: [
          {
            text: '单一 queryLoop 承载全部接口形态：逆向分析确认交互 CLI、headless、SDK、IDE 共享同一执行引擎，反混淆仓库中 src/query.ts 约 68K 行。这让「模型推理、harness 执行与约束」的分工有一处确定的落点——全部代码中仅约 1.6% 是 AI 决策逻辑，其余 98.4% 是围绕这个循环的确定性基础设施。',
            source: 'Dive-into-Claude-Code · docs/architecture.md；nadonghuang/claude-code',
          },
          {
            text: '每个 turn 的 9 步流水线把「一次循环」拆成可审计的固定阶段：Settings resolution → State initialization → Context assembly → Five pre-model shapers → Model call → Tool dispatch → Permission gate → Tool execution → Stop condition check。pre-model shapers 即 C 层的 5 级压缩管线——压缩不是异步后台任务，而是嵌在每次模型调用前的同步步骤。',
            source: 'Dive-into-Claude-Code · docs/architecture.md',
          },
          {
            text: '停止条件分几条路径：模型不再发起 tool call 是常规停止；Stop hook 可阻止停止并把原因反馈给模型让它继续工作，但连续 block 8 次后 harness 强制放行（可用 CLAUDE_CODE_STOP_HOOK_BLOCK_CAP 调整），防止 hook 造成死循环。API 错误走 StopFailure 事件而非 Stop，用户 Esc/Ctrl+C 中断则不触发 Stop hook——三类结束方式语义各不混淆。',
            source: 'code.claude.com/docs/en/hooks-guide',
          },
          {
            text: '重试与恢复是有限降级链：max output token escalation 每 turn 至多 3 次重试；reactive compaction 每 turn 至多触发一次；prompt-too-long 依次尝试 context-collapse overflow → reactive compaction → terminate；另有 streaming fallback 与 fallback 模型切换，subagent 遇到模型不可用等可切换错误时沿 fallback 模型链继续。每条路径都有次数上限，不存在无限重试。',
            source: 'Dive-into-Claude-Code · docs/architecture.md；code.claude.com/docs/en/sub-agents',
          },
          {
            text: 'AgentTool 委派 subagent：前台 subagent 阻塞主对话，后台 subagent 并发执行、完成通知在后续 turn 以 completion notification 形式到达。maxTurns 限制子代理的最大 agentic 轮数，超限返回标记为 partial 的输出、主对话可 resume 继续；嵌套深度达限后 Agent 工具从子代理工具池直接移除——循环的递归有硬边界。',
            source: 'code.claude.com/docs/en/sub-agents；src/tools/AgentTool/',
          },
          {
            text: 'hooks 在循环生命周期的固定点位执行用户 shell 命令，官方列出 27+ 事件（SessionStart、UserPromptSubmit、PreToolUse、PostToolUse、SubagentStart/Stop、Stop、PreCompact/PostCompact、SessionEnd 等）。官方定位是「确定性控制」对「模型自主循环」的补充：certain actions always happen rather than relying on the LLM to choose to run them。',
            source: 'code.claude.com/docs/en/hooks-guide',
          },
        ],
      },
    ],
    evolution: [
      {
        name: 'Geoffrey Huntley · Ralph 循环',
        text: '触发场景：单次会话跑不完真实 backlog，人一走 agent 就停。澳洲开发者 Geoffrey Huntley 的 Ralph 技术纯粹形态只有五行 bash——while 循环反复把同一个 PROMPT.md 喂给 Claude Code，每轮换一个干净上下文，状态靠 git 和 progress.txt 传递。YC hackathon 上「把一个编程 agent 塞进 while 循环，它一晚上发了 6 个 repo」；半年内它从聚会趣谈变成 Anthropic 官方插件，有 Anthropic 资深工程师评价它胜过自己试过的一切编排方案。',
        source:
          'https://blog.iaieye.com/posts/agentic-coding-classics/ralph-wiggum-fulltext/',
      },
      {
        name: 'Nous Research · Hermes 给循环加复盘环节',
        text: '触发场景：复盘若卡在回复链路里用户就得干等，全量回放又让成本线性上涨。Hermes 在控制循环里加了一个异步分支：每轮回复结束后 fork 一个 self-improvement review，从记忆、技能、执行过程三个维度复盘刚结束的会话；默认复用主模型的 prompt 缓存，也可配置更便宜的模型走压缩 digest。官方测试成本降 3–5 倍而经验捕获基本一致——循环自己长出了「复盘」这个新环节。',
        source: 'https://hermes-agent.nousresearch.com/docs/user-guide/features/memory',
      },
    ],
  },
  {
    symbol: 'I_act',
    name: '动作接口',
    en: 'Action Interface',
    tagline: '把模型输出映射成可执行的操作',
    detail: [
      '函数调用、MCP 工具、shell、代码执行、文件系统抽象——模型的一切意图都要经过动作接口落地。接口提供了什么操作、怎样返回结果、错误能否被下一步利用，直接改变任务完成率。',
      'Codex 把文件编辑收敛成自定义的 apply_patch 工具，带副作用的动作统一过 ToolOrchestrator 的「审批 → 沙箱 → 升级」链。Claude Code 则用精确字符串替换代替 diff（old_string 不唯一就报错，逼模型补足上下文）、强制先读后写、工具描述不一次塞满而是延迟发现。共同思路：动作要少而可靠，报错本身也是给模型下一步的观察。',
      '而当现成工具解决不了问题，动作接口的终极形态是让模型现场把新动作造出来——动作集从此可以生长。',
    ],
    implementations: [
      {
        product: 'Codex',
        intro:
          'Codex 的动作接口把模型的输出收敛到一组明确定义的工具上：每个工具是一张 JSON Schema（ToolSpec），在 spec_plan.rs 按特性开关组装，经 router/registry 分发到 handlers/ 下的 handler。文件编辑不允许模型裸写 sed/cat >，而是定义了自定义的 V4A patch 格式，对支持的模型以 freeform custom tool + Lark 语法约束解码的方式暴露——patch 的语法结构在解码层就被强制合法，解析失败的整类错误在采样时就消失了；对不支持 custom tool 的模型，同一个解析器打包成 codex-apply-patch 独立可执行文件走 shell 调用。所有带副作用的工具都必须经过 ToolOrchestrator 的「审批 → 选沙箱 → 尝试 → 拒绝后按策略升级重试」序列，动作接口与治理在这里交汇。外部能力则通过 MCP 客户端聚合进来，与内建工具同等并入 Prompt.tools——对模型而言，内建工具和 MCP 工具没有任何区别。',
        points: [
          {
            text: '文件编辑走自定义 apply_patch 工具（V4A patch 格式），对支持的模型以 freeform custom tool + Lark 语法约束解码暴露：apply_patch.lark 定义了 begin_patch/add/delete/update hunk 的完整文法，解码器只接受符合文法的输出，patch 格式错误这类失败在生成阶段就不可能发生。这比让模型自由生成 sed 脚本可靠得多，也让落盘前的安全评估有结构化输入可用。',
            source: 'core/src/tools/handlers/apply_patch.lark',
          },
          {
            text: 'patch 解析与落盘在独立 crate codex-rs/apply-patch/：parser.rs 把 patch 解析为 Hunk::{AddFile, DeleteFile, UpdateFile}，file_update.rs 应用变更；main.rs 还提供 codex-apply-patch 独立可执行文件，供不支持 custom tool 的模型经 shell 调用——同一份解析逻辑两种暴露方式，能力按模型支持度优雅降级。',
            source: 'codex-rs/apply-patch/、core/src/tools/handlers/apply_patch.rs',
          },
          {
            text: '每个工具是一张 JSON Schema（ToolSpec），在 spec_plan.rs 按特性开关组装本次会话暴露哪些工具，经 router/registry 分发到 handler。核心 shell 工具 exec_command 的参数（cmd、workdir、tty、yield_time_ms、max_output_tokens）本身就是观察接口行为的控制面：模型可以要求分配 PTY、调整等待时长和输出预算。',
            source: 'core/src/tools/spec_plan.rs、core/src/tools/handlers/shell_spec.rs',
          },
          {
            text: '带副作用的工具都过 ToolOrchestrator，模块注释即算法：approval → select sandbox → attempt → retry with an escalated sandbox strategy on denial（审批结果有缓存，升级重试不需要再问一次）。沙箱内执行被 OS 拒绝后按审批策略决定是否脱沙箱重试；Never/OnRequest 下不静默升级，把简洁的沙箱拒绝信息连原始输出一起回给模型——拒绝本身也成为给模型的观察信号。',
            source: 'core/src/tools/orchestrator.rs',
          },
          {
            text: '作为 MCP 客户端聚合外部工具：连接管理在 core/src/mcp.rs 与 session/mcp_runtime.rs，协议客户端是 codex-rs/rmcp-client/（基于 rmcp，含 OAuth），MCP 工具被并入 Prompt.tools，与内建工具同等走 ToolSpec 分发和 orchestrator 治理。反向地，codex-rs/mcp-server/ 把 Codex 自身暴露为 MCP server，供其他 agent 把 Codex 当工具调用。',
            source: 'codex-rs/rmcp-client/、core/src/mcp.rs、codex-rs/mcp-server/',
          },
        ],
      },
      {
        product: 'Claude Code',
        intro:
          '动作接口把模型的 tool_use 块映射成可执行操作，全链路是：Zod schema 校验输入 → deny 规则预过滤 → PreToolUse hooks → 权限规则评估（deny > ask > allow）→ 权限模式/分类器 →（Bash 进沙箱）执行 → tool_result 回灌。所有工具实现统一的 Tool 接口（src/tools/Tool.ts），输入用 Zod schema 校验（lazySchema() 延迟初始化），权限检查经 canUseTool() 并带缓存。工具池本身是 5 步组装管线：枚举至多 54 个基础工具 → 模式过滤 → deny 预过滤 → MCP 接入 → 去重；ToolSearchTool 还支持延迟工具发现，不把所有工具描述一次性塞进上下文。文件编辑故意选择精确字符串替换而非 diff/patch，并配套「先读后写」的强制约束；外部能力经 MCP 以 mcp__<server>__<tool> 命名接入，与内置工具走同一权限体系。',
        points: [
          {
            text: 'Edit 工具用精确字符串替换而非 diff/patch：old_string 在文件中不唯一即失败，要求提供更大上下文字符串使其唯一，或用 replace_all。选择精确替换的理由在工具描述里就有体现——它把歧义消解的责任前置给模型，harness 只需做字符串匹配，避免 patch 应用失败后的脆弱恢复逻辑。',
            source: 'src/tools/FileEditTool/prompt.ts（v2.1.76）',
          },
          {
            text: '先读后写由 harness 强制：工具描述明确「You must use your Read tool at least once in the conversation before editing. This tool will error if you attempt an edit without reading the file」。并发文件编辑用「时间戳 + 内容变化检测」防止冲突——编辑动作基于的是观察过的状态，读取与写入之间文件被改动就能被发现，而不是静默覆盖。',
            source: 'src/tools/FileEditTool/prompt.ts + nadonghuang/claude-code README',
          },
          {
            text: '统一 Tool 接口 + Zod schema 校验输入；工具池组装为 5 步管线：Base enumeration（至多 54 个）→ Mode filtering → Deny rule pre-filtering → MCP integration → Deduplication。deny 预过滤发生在工具池层面意味着被裸工具名 deny 的工具根本不进模型可见上下文——动作接口的约束从「模型能看到哪些动作」就开始了。',
            source: 'src/tools/Tool.ts + Dive-into-Claude-Code · docs/architecture.md',
          },
          {
            text: 'ToolSearchTool 支持延迟工具发现：不把所有工具描述一次性塞进上下文，模型按需要搜索工具。这与 Skill 的渐进式披露是同一思路——工具元数据也是上下文预算，动作接口自身也要省着用。',
            source: 'Dive-into-Claude-Code · docs/architecture.md',
          },
          {
            text: 'MCP 扩展工具命名规范 mcp__<server>__<tool>（如 mcp__github__search_repositories），支持 stdio/SSE/HTTP/WebSocket 等多种 transport，与内置工具走同一权限/规则体系。MCP 服务器指令注入系统提示词的 mcp_instructions 段是唯一默认每轮重算的 uncached 段，因为服务器会在 turn 之间连接/断开——动作集合的动态性被显式反映在提示词缓存策略里。',
            source:
              'code.claude.com/docs/en/hooks-guide + Dive-into-Claude-Code（"External tools via 7 transport types"）+ systemPromptSections.ts 注释',
          },
          {
            text: 'Bash 工具在持久 shell 会话中执行命令，当前版本支持 run_in_background 后台执行与完成通知、输出截断、沙箱执行（prompt 中引用 SandboxManager 与 timeout 配置）。后台任务的完成通知在后续 turn 到达主对话，与后台 subagent 的通知机制一致——异步动作的结果统一回灌为观察。',
            source: 'src/tools/BashTool/prompt.ts（v2.1.76）+ kirshatrov 抓包',
          },
        ],
      },
    ],
    evolution: [
      {
        name: 'NVIDIA · Voyager 的技能库',
        text: '触发场景：Minecraft 开放世界没有现成动作可用，ReAct、AutoGPT 几乎原地踏步。Voyager 让冻结的 GPT-4 自己定目标、自己写 Mineflayer 控制代码，跑通的程序收进可检索的技能库，遇到相关任务直接调用组合、不再从头推理。结果是独有物品收集 3.3 倍、科技树解锁快 15.3 倍——模型权重一行没动，能力全长在动作接口上。',
        source: 'https://arxiv.org/abs/2305.16291',
      },
      {
        name: 'DeepSeek Harness · 现场造插件',
        text: '触发场景：鱼皮实测 DeepSeek Harness 时遇到「AI 只会阿巴阿巴，没有工具动不了手」。Creator 模式让模型现场编写 Cordis 插件并内存热加载：一个 word_count 插件从加载技能、编写代码到 cordis_run 真实注册全流程跑通。动作接口变成可生长的面——用完的插件还能沉淀进市场复用。',
        source: 'https://www.codefather.cn/post/2092472825448239106',
      },
    ],
  },
  {
    symbol: 'S',
    name: '状态与产物存储',
    en: 'State & Artifact Store',
    tagline: '持久化执行状态与中间产物',
    detail: [
      '模型没有跨会话记忆。对话历史、计划、进度文件、检查点、日志、轨迹、diff，都要由这一层独立持久化，长任务才能在中断、压缩、交接之后继续推进。',
      'Codex 把每个会话的 rollout 落成 append-only JSONL，resume 等于逐条无损回放，另有 SQLite 存索引与审计日志。Claude Code 同样用 JSONL 转录，compaction 边界以链式补丁记录保证可重建，并立下安全不变式：resume 只恢复对话状态，权限授权绝不随会话继承，信任每次重新建立。',
      '实践中最深刻的共识是：结构化文件比对话历史可靠得多——自由文本的进度记录容易被 Agent 自己改乱，JSON 契约不会。「状态外置」由此成为长任务 Harness 的标准做法：上下文可以随时清零，状态分毫不丢。',
    ],
    implementations: [
      {
        product: 'Codex',
        intro:
          'Codex 把会话轨迹做成了一等基础设施：每个会话一个 append-only 的 JSONL rollout 文件，按日期归档到 ~/.codex/sessions/YYYY/MM/DD/，文件首行是 SessionMeta（会话 id、时间戳、cwd、originator、base instructions、git 信息），之后逐条记录 ResponseItem 与 TurnContext 快照——这份文件就是 resume/fork/revert 的事实来源。写入走 actor 模式：RolloutRecorder 持 channel，后台 writer 先缓冲再批量落盘，flush 失败可重试，持久化不阻塞控制循环。落盘内容有明确的策略白名单：消息的完整轨迹（reasoning、工具调用与输出、压缩标记、turn context 快照）都持久化，纯 UI 事件不落，保证 rollout 恰好是「重建会话所需的最小全集」。resume 时逐条重建历史，等于无损回放；fork/revert 通过复制 rollout 文件实现。结构化的索引类状态（线程元数据、审计日志、memories）则放在 SQLite 的 state.db，与面向轨迹回放的 rollout 分工成两层。',
        points: [
          {
            text: 'Rollout JSONL 每会话一个 append-only 文件，实际路径 ~/.codex/sessions/YYYY/MM/DD/rollout-<timestamp>-<uuid>.jsonl；revert 保持 thread id 稳定但生成带 rollout_id 后缀的新文件——旧轨迹不被覆盖，每次分叉都留下不可变的历史。它是 resume/fork/revert/复盘唯一的事实来源，「轨迹记录」在这里是系统设施而非附属日志。',
            source: 'codex-rs/rollout/src/recorder.rs',
          },
          {
            text: '持久化策略白名单在 policy.rs：Message、Reasoning、FunctionCall、FunctionCallOutput、CustomToolCall、WebSearchCall、两种 Compaction 条目都落盘，AdditionalTools、CompactionTrigger、纯 UI 事件不落。取舍标准是「重建会话需要什么就存什么」——UI 事件可以从轨迹重新推导，没必要占用磁盘和回放时间。',
            source: 'codex-rs/rollout/src/policy.rs',
          },
          {
            text: '写入走 actor 模式：RolloutRecorder 持有 channel，后台 writer task 先把条目缓冲到 pending_items 再批量落盘，flush 失败走 write_pending_with_recovery 重试，持久化开销不阻塞控制循环。resume 走 RolloutRecorderParams::Resume { path }，历史重建在 rollout_reconstruction.rs 逐条回放——rollout 因此同时充当「检查点」和「轨迹」两个角色。',
            source: 'core/src/session/rollout_reconstruction.rs、codex-rs/rollout/src/recorder.rs',
          },
          {
            text: 'state.db（SQLite）存线程元数据、审计日志、memories 等结构化状态，另有 message-history 记录用户输入历史。分工清晰：rollout 是 append-only、面向轨迹回放的日志层；state.db 是面向索引与查询的关系层。记忆流水线也从 state.db 认领 rollout 再回链到原始 JSONL 文件，两层各取所长。',
            source: 'codex-rs/state/、codex-rs/message-history/',
          },
        ],
      },
      {
        product: 'Claude Code',
        intro:
          '状态存储偏厚但极简单：不引入任何数据库，一切以人类可读的 append-only 文件为载体。会话完整转录为 ~/.claude/projects/<编码后的项目路径>/<session-id>.jsonl，每行一个自包含 JSON 事件（user turn / assistant 响应 / tool call / tool result / system 事件），含 token 用量、subagent 轨迹与 hook 事件。持久化分三条通道：主转录、~/.claude/history.jsonl 全局输入历史（反向读取供上箭头召回）、每个 subagent 的独立 sidechain JSONL——sidechain 即子代理的完整历史文件，只把摘要返回父对话，完整历史永不进入父上下文。compaction 边界以链式补丁方式记录在转录中保证可重建，claude --resume 直接从 JSONL 恢复会话。设计取舍很明确：append-only JSONL 牺牲查询能力，换取可审计与极简——每个事件可读、可版本控制、无需专门工具即可重建。',
        points: [
          {
            text: '会话转录是 append-only JSONL：每行一个自包含事件，涵盖 user/assistant/tool/system 各类，含 token 用量与 hook 事件。append-only 意味着历史只增不改，任何时刻的状态都能从头重放出来，审计和调试都不依赖专有工具。',
            source: 'claude-dev.tools · docs/jsonl-format；frederick-douglas-pearce/claude-code-sessions',
          },
          {
            text: '三条持久化通道分工：Session transcripts（append-only JSONL，完整对话 + 链式补丁的 compaction 边界）、Global prompt history（history.jsonl，跨会话输入召回，反向读取供上箭头）、Subagent sidechains（每个 subagent 一个独立 JSONL，隔离的子代理历史）。sidechain 让子代理跑得再深也不污染父上下文——只有摘要返回，完整历史永不进入父上下文。多实例协调用 POSIX flock()，零外部依赖。',
            source: 'Dive-into-Claude-Code · docs/architecture.md',
          },
          {
            text: 'compaction 边界以链式补丁方式记录在转录中：压缩发生后，「哪段历史被哪份摘要替换」本身作为事件留在 JSONL 里，保证转录可重建。claude --resume 直接从 ~/.claude/projects/<project>/<session-id>.jsonl 恢复会话——恢复机制就是重读这份 append-only 日志，没有独立的状态数据库。',
            source: 'Dive-into-Claude-Code · docs/architecture.md',
          },
          {
            text: 'resume 的安全不变式：权限授权绝不随会话恢复，trust 永远在当前会话重新建立。harness 宁可牺牲恢复时的便利，也要保证「上次同意过」不能成为这次放行的理由——这条不变式同时是状态层与治理层的交界。',
            source: 'Dive-into-Claude-Code · docs/architecture.md',
          },
          {
            text: '~/.claude.json 存登录会话、MCP 配置与 per-project 状态（如 trust 决策）；损坏时自动备份到 ~/.claude/backups/，可从最近 5 份备份恢复。另有分层 settings 文件：~/.claude/settings.json（用户）、.claude/settings.json（项目共享）、.claude/settings.local.json（项目本地）、managed settings（组织），策略本身也是文件化、分层、可审计的。',
            source: 'code.claude.com/docs/en/settings',
          },
          {
            text: '记忆产物同样文件化：auto memory 存于 ~/.claude/projects/<project>/memory/（MEMORY.md 索引 + 每主题一个文件），会话转录按 cleanupPeriodDays 保留期清理但 memory 目录豁免；subagent 可用 frontmatter memory 字段获得独立记忆目录（~/.claude/agent-memory/<name>/ 等三级作用域）。',
            source: 'code.claude.com/docs/en/memory',
          },
        ],
      },
    ],
    evolution: [
      {
        name: 'Anthropic · 「失忆工程师」交接',
        text: '触发场景：多小时任务必然跨会话，而 agent 跑久了会出现 context anxiety——感觉上下文快满就提前收摊。Anthropic 三智能体 harness 的解法不是压缩而是重置：Feature List 落成 JSON，每个 sprint 先签「完成定义」契约，状态全走结构化交接文件——「每个新 session 都是一位失忆的新工程师，靠交接文档恢复状态」。对照实验里，solo agent 20 分钟 $9 做出的游戏核心玩法坏掉，三智能体 6 小时 $200 做出的真正能玩。',
        source: 'https://www.anthropic.com/engineering/harness-design-long-running-apps',
      },
      {
        name: 'Ralph 生态 · 状态全在仓库里',
        text: '触发场景：Ralph 循环每轮换一个全新上下文，模型对之前的一切零记忆。它能过夜跑通的秘密恰在 S 层：prd.json 记 backlog、progress.txt 记进展、git history 记每次变更——上下文每轮清零，状态由 Harness 分毫不差地交接给下一个「自己」。控制循环与状态存储在这里是同一件事的两面。',
        source:
          'https://blog.iaieye.com/posts/agentic-coding-classics/ralph-wiggum-fulltext/',
      },
    ],
  },
  {
    symbol: 'V',
    name: '验证与治理',
    en: 'Verification & Governance',
    tagline: '检查、约束并修复执行',
    detail: [
      '验证与治理要让 Agent 知道自己做没做对，并在出错时拦住它：测试、断言、linter、验证器模型、沙箱、权限门。约束必须可机械执行——只写在文档里的规矩，Agent 迟早偏离。软件工程场景的主要瓶颈就压在这一层。',
      'Codex 叠了三层防线：四级审批策略、execpolicy 前缀规则引擎、OS 级沙箱，全部在 Harness 内强制执行；auto_review 还能把「人审」换成「模型审」。Claude Code 更细：七层相互独立的安全层，PreToolUse hook 先于一切权限模式、只能收紧不能放松，auto 模式还有独立分类器两阶段审查动作与用户意图是否一致。',
      '而在「好不好」没有二元答案的领域——设计、文案、开放式任务——现成的验证器不存在，裁判只能在使用中自造并持续调教。这正是自进化最深的一层。',
    ],
    implementations: [
      {
        product: 'Codex',
        intro:
          '治理是 Codex 做得最厚的一层，由三道防线叠加且全部在 harness 内强制执行，不依赖模型自觉：审批策略（AskForApproval 四级）决定「何时必须停下来问」，execpolicy 前缀规则引擎把 shell 命令解析成 token 序列做自动裁决，OS 级沙箱（macOS Seatbelt / Linux Landlock+bubblewrap / Windows 受限令牌）决定「技术上能做什么」。三者经由 ToolOrchestrator 串成一条流水线：任何带副作用的工具都先过审批判定，再选沙箱执行，被沙箱拒绝后按策略决定是否升级重试——Never/OnRequest 下不静默升级，拒绝结果直接回给模型，让安全边界本身成为模型的观察信号。apply_patch 因为不走 shell，有独立的安全评估：写入路径全部落在可写根内且沙箱可用才 AutoApprove。与之对照，「验证」的另一半刻意做薄：harness 从不主动跑测试，跑不跑、怎么跑完全由 base instructions 与 AGENTS.md 的提示词约定引导模型完成，另有一个可选的 auto_review 把审批请求路由给 reviewer agent，把「人审」换成「模型审」。',
        points: [
          {
            text: '三层防线叠加：审批策略 untrusted/on-request/granular/never 四级（枚举在 protocol.rs，on-failure 已并入 on-request）+ execpolicy 前缀规则引擎 + OS 级沙箱，全部在 harness 内强制执行。分工是「sandbox 决定技术上能做什么，approval policy 决定何时必须停下来问」，execpolicy 则作为审批的自动裁决器减少打扰。',
            source: 'codex-rs/protocol/src/protocol.rs、codex-rs/execpolicy/',
          },
          {
            text: '沙箱模式分 read-only / workspace-write / danger-full-access，三平台各有原生实现：macOS 生成 .sbpl 策略用 sandbox-exec 包裹命令（基线策略开头即 (deny default)，默认拒绝、按需放行，灵感来自 Chrome sandbox）；Linux 通过自调用的 codex-linux-sandbox helper 落地，现代路径用 bubblewrap 建隔离挂载/网络命名空间，保留 --use-legacy-landlock 旧路径；Windows 用受限令牌 + 写授权目录。可写根、网络开关、受保护路径都被翻译成各平台的原生规则。',
            source:
              'codex-rs/sandboxing/、codex-rs/linux-sandbox/、codex-rs/windows-sandbox-rs/',
          },
          {
            text: 'execpolicy 让用户/管理员写 prefix_rule(pattern=[...], decision="allow|prompt|forbid") 规则，引擎把 shell 命令解析成 token 序列做前缀匹配，自动裁决 allow/prompt/forbid。审批时用户选「以后都允许」会生成 ExecPolicyAmendment 持久化追加规则；on-request 的提示词模板还教模型自救——沙箱拒绝后带 sandbox_permissions="require_escalated" + justification 重发命令并可附 prefix_rule，同时明确禁止为 rm 等破坏性命令或过宽前缀（如 ["python3"]）申请放行。',
            source:
              'codex-rs/execpolicy/、codex-rs/protocol/src/approvals.rs、codex-rs/prompts/templates/permissions/approval_policy/on_request.md',
          },
          {
            text: 'apply_patch 不经过 shell，有独立安全评估：assess_patch_safety 检查 patch 的所有写入路径是否都落在可写根内且平台沙箱可用，满足则 AutoApprove，否则 AskUser 或直接 Reject（SafetyCheck 三态）。审批的默认判定逻辑也类似：Never 不问，OnRequest/Granular 仅当文件系统沙箱为 Restricted（命令可能越界）时问，UnlessTrusted 总是问。',
            source: 'core/src/safety.rs、core/src/tools/sandboxing.rs',
          },
          {
            text: '测试验证刻意做薄：harness 从不主动跑测试或做静态检查，正确性验证完全委托给提示词约定（base instructions 的 ## Validating your work 章节按审批模式区分主动性）和 AGENTS.md 引导模型自行完成。治理侧另有可选的自动审查者：approvals_reviewer = "auto_review" 把审批请求路由给一个 reviewer agent，把「人审」换成「模型审」。',
            source:
              'core/src/guardian/、codex-rs/protocol/src/prompts/base_instructions/default.md',
          },
        ],
      },
      {
        product: 'Claude Code',
        intro:
          '验证与治理是 Claude Code 做得最厚的一层：Dive 从源码归纳出 7 个相互独立的安全层——工具预过滤 → deny-first 规则 → 权限模式 → auto 模式 ML 分类器 → OS 沙箱 → resume 不继承权限 → hooks 拦截，任何一层都可单独阻断一次操作。权限规则是三列表 allow/ask/deny，评估顺序固定为 deny → ask → allow、首个匹配生效、规则特异性不改变顺序；裸工具名 deny 会把工具整体移出模型可见上下文。PreToolUse hook 在任何权限模式（包括 bypassPermissions）之前触发，返回 deny 可阻断一切，且 hook 只能收紧不能放松。auto 模式由 yoloClassifier 这个独立 LLM 两阶段评估兜底，Bash 命令还有 harness 内置的确定性语法分析。最外层是 OS 级沙箱（macOS Seatbelt / Linux bubblewrap + socat），把文件系统与网络隔离落到内核强制。整体上把「概率性引导」（CLAUDE.md）与「确定性强制」（settings 规则）分得很清。',
        points: [
          {
            text: '7 层相互独立的安全层：①工具预过滤（被整体 deny 的工具从模型视野移除）②deny-first 规则评估（deny 永远覆盖 allow，即使 allow 更具体）③权限模式决定基线处理 ④auto 模式 ML 分类器（独立 LLM 调用独立评估安全性）⑤shell 沙箱（文件系统 + 网络隔离）⑥resume 不恢复权限 ⑦PreToolUse hooks 可修改或阻断动作。层层独立意味着单点失效不破防。',
            source: 'Dive-into-Claude-Code · docs/architecture.md · "Seven Independent Safety Layers"',
          },
          {
            text: '权限规则评估顺序固定为 deny → ask → allow，首个匹配生效，规则特异性不改变顺序；语法为 Tool(specifier)，如 Bash(npm run *)、Read(./.env)、WebFetch(domain:example.com)。裸工具名 deny（如 Bash）会把该工具从模型可见上下文中整体移除；项目级 allow 规则要等 workspace trust 对话框确认后才生效，deny/ask 则立即生效——收紧永远比放松更早生效。',
            source: 'code.claude.com/docs/en/permissions',
          },
          {
            text: 'PreToolUse hook 先于任何权限模式触发——包括 bypassPermissions / --dangerously-skip-permissions——返回 permissionDecision: deny 可阻断一切。hook 经 stdin 收 JSON（session_id/tool_name/tool_input），用 exit code（0 放行 / 2 阻断并把 stderr 反馈给模型）或结构化 JSON 表态；多个匹配 hook 并行执行，最严结果胜出（deny > defer > ask > allow）。反向不成立：hook 的 allow 不能绕过 settings 里的 deny——「hooks can tighten restrictions but not loosen them」。',
            source: 'code.claude.com/docs/en/hooks-guide',
          },
          {
            text: 'auto 模式后台分类器 yoloClassifier.ts：独立 LLM 调用，加载 base system prompt + 权限模板（区分内部/外部），两阶段评估——fast-filter + chain-of-thought——并把预算好的分类结果与超时赛跑。它与官方 auto 模式描述一致：后台分类器审查动作与用户意图是否一致，把「该不该放行」从规则匹配升级为语义判断。',
            source: 'Dive-into-Claude-Code · docs/architecture.md（yoloClassifier.ts）',
          },
          {
            text: 'Bash 命令做确定性 + 模型双重分析：harness 内置语法分析识别只读命令集（ls/cat/grep/git status 免询问）、剥离 timeout/nice/nohup 等 wrapper、复合命令拆成子命令逐个匹配规则、重定向目标按文件写检查。早期版本还对每条待批准命令跑两次小模型调用（前缀提取含命令注入检测、文件路径提取），policy_spec 明确：疑似注入即返回 command_injection_detected 转人工确认，防止「用户以为白名单了命令 A，恶意命令顶着同样前缀混进来」。',
            source: 'code.claude.com/docs/en/permissions；kirshatrov 抓包（2025-04）',
          },
          {
            text: 'OS 沙箱：macOS 用 Seatbelt，Linux/WSL2 用 bubblewrap + socat 代理，对 Bash 命令及其全部子进程做文件系统隔离（默认只写 cwd 与会话临时目录）+ 网络隔离（域名白名单经沙箱外代理强制）；Read/Edit deny 规则与 WebFetch 域名规则会并入沙箱配置形成最终边界。Protected paths（.claude/、.mcp.json、shell 启动文件、.git/hooks、~/.claude）即使在可写目录内也始终禁写，防止运行中的命令自我提权；凭证支持 deny 与 mask（沙箱内只见 sentinel 占位值，代理出网时换真值）。官方自己定调：「Sandboxing reduces risk but is not a complete isolation boundary.」',
            source: 'code.claude.com/docs/en/sandboxing',
          },
          {
            text: '治理的边界意识：CLAUDE.md 不是强制层——官方明说 settings 规则由客户端强制执行、与模型的决定无关，而 CLAUDE.md 只是塑造行为的概率性引导。Workspace trust 保证仓库自带的 allow 规则、hooks、MCP 服务器在用户信任文件夹前不生效；managed settings 组织级策略优先级最高，用户/项目设置无法覆盖。这三条共同划出「谁的话算数」的确定性秩序。',
            source: 'code.claude.com/docs/en/memory；code.claude.com/docs/en/settings',
          },
        ],
      },
    ],
    evolution: [
      {
        name: 'Anthropic · 设计师调教出的 evaluator',
        text: '触发场景：生成的应用「看起来惊艳、一用全是 bug」，而开箱的 Claude 是个糟糕的 QA——发现问题也会说服自己放行。解法是借 GAN 思路设独立 evaluator：设计师先写四条评分准则（设计质量、原创性、工艺、功能），用 few-shot 示例校准口味，evaluator 用 Playwright 实操运行中的应用后打分，FAIL 精确到行号。5–15 轮迭代里评分单调抬升——美学这种主观维度被拆成了可机械检查的指标。',
        source: 'https://www.anthropic.com/engineering/harness-design-long-running-apps',
      },
      {
        name: 'MirroS · HarnessEval 证据树',
        text: '触发场景：固定 rubric 覆盖得全就混入大量无关检查，为自动化简化又漏掉依赖上下文的关键判断。HarnessEval 把评测组织成 Plan–Route–Decompose–Verify 工作流：先理解案例再决定测什么，从技能库路由适用技能，把抽象判断拆成可验证子问题，审计证据充分性后才聚合评分——评测本身成了一个产出可追溯证据树的 Harness。',
        source: 'https://mp.weixin.qq.com/s/T_fBh7p82OHaKw75oq-5cQ',
      },
    ],
  },
]
