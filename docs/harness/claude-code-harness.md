# Claude Code Harness 六大运行时职责调研

> 调研对象：Anthropic Claude Code（`@anthropic-ai/claude-code` npm 包）。本文按 arXiv:2606.20683 综述提出的 Agent Harness 六大运行时职责（观察接口 I_obs、上下文管理 C、控制循环 L、动作接口 I_act、状态与产物存储 S、验证与治理 V）逐节剖析 Claude Code 的实现方式。

## 总述：整体架构定位

Claude Code 是一个单进程 Node.js/TypeScript 应用（终端 UI 用 React + Ink 实现），官方 npm 包以单个压缩混淆的 `cli.js`（约 12MB）分发。2025 年以来网上出现多份逆向工程成果，其中较完整的有 [nadonghuang/claude-code](https://github.com/nadonghuang/claude-code)（v2.1.76 反混淆源码，1,884 个 TS 文件）和基于此的系统性架构分析 [VILA-Lab/Dive-into-Claude-Code](https://github.com/VILA-Lab/Dive-into-Claude-Code)（针对 v2.1.88，约 512K 行代码）。

其核心结论可以作为理解 Claude Code Harness 的总纲：**agent 循环本身是一个简单的 while 循环（`queryLoop`，位于 `src/query.ts`），模型负责推理、harness 负责执行与约束；全部代码中仅约 1.6% 是 AI 决策逻辑，其余 98.4% 是确定性基础设施**——权限门、上下文管理、工具路由、状态持久化与恢复逻辑（[Dive-into-Claude-Code README](https://github.com/VILA-Lab/Dive-into-Claude-Code)）。所有接口形态（交互式 CLI、headless `claude -p`、Agent SDK、IDE 插件）都汇聚到同一个 `queryLoop`。

**资料来源与可信度说明**：官方文档（code.claude.com/docs）为权威来源；逆向分析（反混淆仓库、mitmproxy 抓包分析）与官方版本存在版本差，文中均标注所依据的版本；个别细节无法核实的明确标注「未确认」。

---

## 1. 观察接口（I_obs）：环境信号 → 模型观察

### 1.1 会话启动时的环境快照注入

Claude Code 在会话开始构建系统提示词时注入环境信息块。逆向抓包（mitmproxy 拦截 API 请求，2025-04，[kirshatrov.com](https://kirshatrov.com/posts/claude-code-internals)）得到的原文：

```
Here is useful information about the environment you are running in:
<env>
Working directory: /Users/kir/src/github.com/kirs/kirshatrov-com
Is directory a git repo: Yes
Platform: macos
Today's date: 2025-04-13
Model: claude-3-7-sonnet-20250219
</env>
```

紧随其后是两个**一次性快照**式上下文块：

```
<context name="directoryStructure">Below is a snapshot of this project's file
structure at the start of the conversation. This snapshot will NOT update during
the conversation. It skips over .gitignore patterns. ...</context>
<context name="gitStatus">This is the git status at the start of the conversation.
Note that this status is a snapshot in time, and will not update during the
conversation. Current branch: master ... Recent commits: ...</context>
```

即：目录树与 git 状态只在会话开头采样一次，harness 明确告知模型「这是快照、不会更新」，模型需要新鲜信息时必须主动调工具（Glob/Grep/Bash）去重新观察。来源同上（kirshatrov 逆向，对应 2025 年初版本；当前版本 env 块格式经官方文档与反混淆源码确认仍存在，见 `src/constants/prompts.ts` 中 `computeSimpleEnvInfo`）。

### 1.2 工具结果作为观察回灌

每次工具执行后，结果以 `tool_result` 内容块的形式进入对话历史，成为下一轮模型调用的观察。会话 JSONL 转录中每行就是一个事件：user turn、assistant 响应、tool call、tool result 或 system 事件（[claude-dev.tools JSONL 格式文档](https://claude-dev.tools/docs/jsonl-format)）。文件读取结果带行号前缀，Edit 工具描述专门提醒模型「行号前缀不属于文件内容」：

```
When editing text from Read tool output, ensure you preserve the exact
indentation (tabs/spaces) as it appears AFTER the line number prefix. ...
Never include any part of the line number prefix in the old_string or new_string.
```

（出处：反混淆源码 `src/tools/FileEditTool/prompt.ts`，[nadonghuang/claude-code](https://github.com/nadonghuang/claude-code) v2.1.76）

### 1.3 观察的尺寸控制

观察在进入上下文前会被截断/压缩：

- 每个 message 有尺寸上限（"Budget Reduction — Per-message size caps — Always active"），这是每次模型调用前执行的 5 个上下文整形器（pre-model shapers）的第一级（[Dive-into-Claude-Code architecture.md](https://github.com/VILA-Lab/Dive-into-Claude-Code/blob/main/docs/architecture.md)）。
- Read 工具默认读取上限 2000 行（kirshatrov 抓取的 `View` 工具描述："By default, reads up to 2000 lines starting from the beginning of the file."）。
- 沙箱拒绝命令时，harness 把违规细节（被拦的文件路径/域名）**追加到失败命令的输出里**，让模型看到为什么失败并自我修正（[官方沙箱文档](https://code.claude.com/docs/en/sandboxing)："Claude Code appends the violation details to the failed command's output, so Claude sees which file path or network host the sandbox blocked"）。

### 1.4 system-reminder 注入通道

hooks、系统事件等外部信号通过 `<system-reminder>` 包装注入观察流。官方 hooks 文档明确："Text returned via `additionalContext` is injected as a system reminder that Claude reads as plain text"（[hooks-guide](https://code.claude.com/docs/en/hooks-guide)）。

### 1.5 对不可信观察的净化

subagent 的最终报告在送回主对话前会被 harness 扫描：对模仿 `<system-reminder>` 标签、`Human:`/`Assistant:` 行首的文本插入反斜杠转义；对提及 `bypassPermissions` 等权限设置的文本前置一行 `[harness: subagent output matched instruction-shaped pattern(s): ...]` 标记。这是观察接口层的提示注入防御（[官方 sub-agents 文档 "Subagent output scanning"](https://code.claude.com/docs/en/sub-agents)）。

**小结**：I_obs 走「薄」路线——以原始文本快照 + 工具结果回灌为主，辅以尺寸截断与注入净化，没有向量检索或结构化环境模型。

---

## 2. 上下文管理（C）：什么、何时、以何形式进入上下文窗口

### 2.1 有序的上下文来源

Dive-into-Claude-Code 从源码归纳出 9 个有序上下文来源：

> System prompt → Environment info → CLAUDE.md hierarchy → Path-scoped rules → Auto-memory → Tool metadata → Conversation history → Tool results → Compact summaries

（[architecture.md, "Context Construction and Memory"](https://github.com/VILA-Lab/Dive-into-Claude-Code/blob/main/docs/architecture.md)）

### 2.2 系统提示词的分段组装与缓存意识

官方明确不公开系统提示词："Claude Code's system prompt isn't published. To give Claude standing instructions, use CLAUDE.md files or the --append-system-prompt flag."（[settings 文档](https://code.claude.com/docs/en/settings)）

反混淆源码显示系统提示词由多个 section 拼装（`src/constants/prompts.ts` 的 `getSystemPrompt`），每个 section 带缓存语义——普通 section 缓存到 `/clear` 或 `/compact`，而易变 section 用显式命名标记：

```ts
/**
 * Create a volatile system prompt section that recomputes every turn.
 * This WILL break the prompt cache when the value changes.
 * Requires a reason explaining why cache-breaking is necessary.
 */
export function DANGEROUS_uncachedSystemPromptSection(
  name: string, compute: ComputeFn, _reason: string,
): SystemPromptSection { ... }
```

（出处：`src/constants/systemPromptSections.ts`，nadonghuang/claude-code v2.1.76。注释说明 MCP instructions 段每轮重算的原因是 "MCP servers connect/disconnect between turns"）

这体现了 harness 对 **prompt cache 命中率**的精细管理：把变化频率不同的内容拆成不同 section，尽量保住前缀缓存。

**组装顺序与静态/动态分界**。`getSystemPrompt` 的返回数组明确分两段（`src/constants/prompts.ts`，v2.1.76）：

```ts
return [
  // --- Static content (cacheable) ---
  getSimpleIntroSection(outputStyleConfig),
  getSimpleSystemSection(),
  ... getSimpleDoingTasksSection() ...,
  getActionsSection(),
  getUsingYourToolsSection(enabledTools),
  getSimpleToneAndStyleSection(),
  getOutputEfficiencySection(),
  // === BOUNDARY MARKER - DO NOT MOVE OR REMOVE ===
  ...(shouldUseGlobalCacheScope() ? [SYSTEM_PROMPT_DYNAMIC_BOUNDARY] : []),
  // --- Dynamic content (registry-managed) ---
  ...resolvedDynamicSections,
]
```

边界标记的注释写得很直白："Boundary marker separating static (cross-org cacheable) content from dynamic content. Everything BEFORE this marker ... can use scope: 'global'. Everything AFTER contains user/session-specific content and should not be cached." 动态段注册表依次包括：`session_guidance`、`memory`（CLAUDE.md/MEMORY.md）、`env_info_simple`、`language`、`output_style`、`mcp_instructions`（唯一默认每轮重算的 `DANGEROUS_uncached` 段）、`scratchpad`、`summarize_tool_results` 等。

**关键段原文摘录**。社区仓库 [Piebald-AI/claude-code-system-prompts](https://github.com/Piebald-AI/claude-code-system-prompts) 用脚本从每个版本的官方 npm 包中提取全部提示词并逐版本维护 CHANGELOG（截至 v2.1.247 共 500+ 段），可视为「编译产物直出」的可靠来源。几段代表性原文：

身份与 harness 行为约定（`system-prompt-harness-instructions.md`，v2.1.239 提取）：

```
You are an interactive agent that helps users with software engineering tasks.

# Harness
 - Text you output outside of tool use is displayed to the user as Github-flavored markdown in a terminal.
 - Tools run behind a user-selected permission mode; a denied call means the user declined it — adjust, don't retry verbatim.
 - ... Hooks may intercept tool calls; treat hook output as user feedback.
 - Prefer the dedicated file/search tools over shell commands when one fits. Independent tool calls can run in parallel in one response.
 - Reference code as `file_path:line_number` — it's clickable.
```

权限交互约定（`system-prompt-system-section.md`，v2.1.173 提取）：

```
Tools are executed in a user-selected permission mode. When you attempt to call a tool that is not automatically allowed by the user's permission mode or permission settings, the user will be prompted so that they can approve or deny the execution. If the user denies a tool you call, do not re-attempt the exact same tool call. Instead, think about why the user has denied the tool call and adjust your approach.
```

环境信息段的当前形态（`computeSimpleEnvInfo`，v2.1.76 源码）——注意 worktree 场景直接写进 env 块约束模型行为：

```
Here is useful information about the environment you are running in:
<env>
Primary working directory: ${cwd}
This is a git worktree — an isolated copy of the repository. Run all commands
from this directory. Do NOT `cd` to the original repository root.
Is a git repository: ${isGit}
Platform: ... / OS Version: ...
</env>
```

以及贯穿全文的「上下文无限」心智设定（`getSystemRemindersSection`，v2.1.76 源码）：

```
- Tool results and user messages may include <system-reminder> tags. ...
- The conversation has unlimited context through automatic summarization.
```

### 2.3 CLAUDE.md 分层加载

CLAUDE.md 是用户写的持久指令文件，按层级加载（[官方 memory 文档](https://code.claude.com/docs/en/memory)）：

| 层级 | 位置 | 作用域 |
|---|---|---|
| Managed policy | `/Library/Application Support/ClaudeCode/CLAUDE.md`（macOS）、`/etc/claude-code/CLAUDE.md`（Linux） | 全组织 |
| User | `~/.claude/CLAUDE.md` | 个人全部项目 |
| Project | `./CLAUDE.md` 或 `./.claude/CLAUDE.md` | 项目团队（入库共享） |
| Local | `./CLAUDE.local.md` | 个人单项目（gitignore） |

加载规则的关键细节（同文档）：

- 从当前工作目录**向上遍历**每一级祖先目录的 CLAUDE.md/CLAUDE.local.md，全部拼接进上下文（不是覆盖）；根方向的内容在前、离 cwd 最近的在后。
- 子目录中的 CLAUDE.md **懒加载**：只在模型读取该目录下文件时才注入。
- 支持 `@path/to/import` 语法递归导入，最深 4 跳；块级 HTML 注释在注入前被剥离。
- **关键设计**：CLAUDE.md 以 user message 形式注入系统提示词之后，而非并入系统提示词——"CLAUDE.md content is delivered as a user message after the system prompt, not as part of the system prompt itself"，因此是「概率性遵从」的上下文而非确定性强制（Dive 的解读："user context (probabilistic compliance), NOT system prompt (deterministic)"）。
- 另有 `.claude/rules/*.md` 可按 YAML frontmatter 的 `paths` glob 做路径作用域，只在模型操作匹配文件时加载，节省上下文。

### 2.4 Auto memory（自动记忆）

除人工 CLAUDE.md 外，harness 提供模型自维护的记忆（官方 memory 文档）：

- 存于 `~/.claude/projects/<project>/memory/`，一个 `MEMORY.md` 索引 + 每主题一个文件；笔记分 4 类（`user` / `feedback` / `project` / `reference`，记在 frontmatter 的 `type` 字段）。
- 每次会话启动只加载 MEMORY.md 的**前 200 行或 25KB**（先到为准）；超限的写操作会报错要求模型重写索引。主题文件不预载，模型按需用普通文件工具读取。
- 主对话的 auto memory 不注入 subagent（fork 除外）。
- 文件化、无 embedding/向量库：Dive 归纳为 "No embeddings, no vector DB — uses LLM-based scan of memory-file headers"。

### 2.5 Compaction（压缩）

Claude Code 的压缩不是单一的 `/compact`，而是**每次模型调用前按序执行的多级管线**（Dive architecture.md，「5 compaction stages」，从便宜到昂贵）：

| 阶段 | 策略 | 触发条件 |
|---|---|---|
| Budget Reduction | 每条消息尺寸上限 | 始终启用 |
| Snip | 裁剪较老历史 | feature-gated（`HISTORY_SNIP`） |
| Microcompact | 缓存感知的细粒度压缩 | 始终（基于时间），有可选 cache-aware 路径 |
| Context Collapse | 读取时的虚拟投影（非破坏） | feature-gated（`CONTEXT_COLLAPSE`） |
| Auto-Compact | 完整的模型生成摘要（最后手段） | 以上都不够时 |

结合反混淆源码（v2.1.76 `src/services/compact/`）逐级展开：

- **Budget Reduction**：每条消息的尺寸上限，始终生效，丢弃超限部分——属于「观察入口处的截断」，不改写历史结构。
- **Snip**：裁剪较老的历史消息，feature-gated（`HISTORY_SNIP`）；autoCompact.ts 的日志字段可见 `snipFreed` 计数（`snipTokensFreed`），说明它先于 auto-compact 尝试腾空间。
- **Microcompact**：把**老的工具结果**替换为占位符 `[Old tool result content cleared]`（`TIME_BASED_MC_CLEARED_MESSAGE`），保留消息结构只清内容。有两条路径（`microCompact.ts`）：
  - 时间触发：距上一条 assistant 消息的间隔超过阈值即触发——注释说明理由是 "the server cache has expired and the full prefix will be rewritten regardless — so content-clear old tool results now, before the request, to shrink what gets rewritten"（缓存已冷，重写前缀反正要发生，趁机瘦身）。
  - 缓存编辑路径（`CACHED_MICROCOMPACT`）：通过 API 的 cache editing 能力**在不使缓存前缀失效的前提下删除工具结果**——"Uses cache editing API to remove tool results without invalidating the cached prefix"，触发/保留阈值来自 GrowthBook 服务端配置；只对主线程生效，避免 fork 出的辅助 agent 污染全局状态。图片/文档按约 2000 token 估算。
- **Context Collapse**：feature-gated（`CONTEXT_COLLAPSE`），读取时的非破坏「虚拟投影」；该服务目录在 v2.1.76 反混淆中缺失（`services/contextCollapse/` 列入 Known Missing Files），细节**未确认**。
- **Auto-Compact**：最后手段。阈值计算见 `autoCompact.ts`：有效窗口 = 上下文窗口 − 模型 max output tokens；阈值取「窗口百分比阈值」与配置值 `autoCompactWindow` 的较小者，并在阈值前留 20,000 token 的预警/错误缓冲（`WARNING_THRESHOLD_BUFFER_TOKENS` / `ERROR_THRESHOLD_BUFFER_TOKENS`）。触发后用模型生成摘要替换历史。

完整 compact 的提示词要求模型先写 `<analysis>` 草稿块、再写 9 节结构的 `<summary>`（Primary Request and Intent / Key Technical Concepts / Files and Code Sections / Errors and fixes / All user messages / Pending Tasks / Current Work / Optional Next Step 等），并有强硬的防跑偏前言（注释解释其动机：Sonnet 4.6+ 模型有时会无视弱结尾指令尝试调工具，一旦 tool call 被拒就浪费唯一一轮，"With maxTurns: 1, a denied tool call means no text output → falls through to the streaming fallback (2.79% on 4.6 vs 0.01% on 4.5)"）：

```
CRITICAL: Respond with TEXT ONLY. Do NOT call any tools.
- Do NOT use Read, Bash, Grep, Glob, Edit, Write, or ANY other tool.
- Tool calls will be REJECTED and will waste your only turn ...
```

（出处：反混淆源码 `src/services/compact/prompt.ts`）

压缩后的上下文恢复也有治理配套：`PreCompact`/`PostCompact` hook 事件；`SessionStart` hook 的 `compact` matcher 可在每次压缩后重注入关键上下文；项目根 CLAUDE.md 在压缩后从磁盘**重新读取注入**（官方 memory 文档："Project-root CLAUDE.md survives compaction: after /compact, Claude re-reads it from disk and re-injects it into the session"）。

### 2.6 Subagent 上下文隔离

每个 subagent 在**独立上下文窗口**运行：只携带自己的系统提示词（frontmatter 的 markdown body）+ 基本环境信息（如工作目录），"not the full Claude Code system prompt"，也不继承父对话历史；内置 Explore 和 Plan 甚至跳过 CLAUDE.md 与 git status 以保持轻量。只有最终摘要返回父对话（[官方 sub-agents 文档](https://code.claude.com/docs/en/sub-agents)；sidechain 机制见第 5 节）。subagent 描述字段也占主对话上下文，合计超过 15,000 token 时启动会警告。

### 2.7 Skill 的渐进式披露（progressive disclosure）

Claude Code 的 Skills 遵循 Agent Skills 开放标准，是「按用加载」的上下文机制（[官方 skills 文档](https://code.claude.com/docs/en/skills)）：

- **常驻上下文的只有元数据**：每个 skill 是 `<skills 目录>/<skill-name>/SKILL.md`，YAML frontmatter 中 `description`（可加 `when_to_use`）是模型决定何时启用的依据；二者拼接后在 skill 列表中**截断至 1,536 字符**——"the combined description and when_to_use text is truncated at 1,536 characters in the skill listing to reduce context usage"。正文（markdown body）只在被调用时才作为一条消息进入上下文："Unlike CLAUDE.md content, a skill's body loads only when it's used, so long reference material costs almost nothing until you need it."
- **命中触发**：模型依据 description 自动调用，或用户 `/skill-name` 显式触发；`disable-model-invocation: true` 则连描述都从模型上下文移除（只能人调）；`user-invocable: false` 反之。还可用 frontmatter `paths` glob 做路径作用域（与 `.claude/rules/` 同格式），只在操作匹配文件时激活。
- **目录发现与懒加载**：skill 来自四级位置（enterprise managed / `~/.claude/skills/` / 项目 `.claude/skills/` / plugin），同名冲突按 enterprise > personal > project 解析；**嵌套子目录的 `.claude/skills/` 不在启动时加载**——"They load the first time Claude reads or edits a file inside that subdirectory, and stay available for the rest of the session"（与嵌套 CLAUDE.md 的懒加载策略一致）；同名嵌套 skill 以目录限定名出现（如 `apps/web:deploy`）。skill 目录有文件监听，会话内热更新生效。
- **加载后的生命周期**：渲染后的 SKILL.md 内容作为单条消息**驻留后续所有 turn**（"its content stays in context across turns, so every line is a recurring token cost"）；重复调用内容相同则只加一条「已加载」短注；**auto-compaction 会带回已调用的 skill**——摘要后重新附上每个 skill 最近一次调用内容的前 5,000 token，合计预算 25,000 token，从最近调用往前填充，老 skill 可能被整体丢弃。
- skill 目录可放支撑文件供按需读取（"Large reference docs ... don't need to load into context every time"）；`` !`command` `` 语法可在注入前执行 shell 命令把实时输出嵌入正文；`context: fork` 可让 skill 在独立 subagent 上下文中运行。
- 逆向侧佐证：反混淆源码中 skills 经 `SkillTool` 这个 meta-tool 注入（Dive："SkillTool: Injects instructions into current context (cheap, same window)"，与 AgentTool 的「开新窗口」形成成本对照）；系统提示词的 `session_guidance` 段会按启用的工具动态拼装 skill 相关指引（`getSkillToolCommands(cwd)`，`src/constants/prompts.ts`）。

### 2.8 长期记忆的「睡眠式」整合：Dream / Auto Dream

用户提到的「睡眠式记忆管理」确有其物：它是 Claude Code 的 **Dream / Auto Dream** 记忆整合机制，名字借自神经科学的 REM 睡眠记忆巩固，设计上承袭 2025 年 4 月的论文 *Sleep-time Compute: Beyond Inference Scaling at Test-time*——在会话间隙（"sleep time"）做预处理，而不是在工作时维护记忆（[SFEIR 的分析文章](https://institute.sfeir.com/en/articles/claude-code-dream-auto-dream-memory-consolidation/)；该文引用的提取来源为 [Piebald-AI/claude-code-system-prompts](https://github.com/Piebald-AI/claude-code-system-prompts)，其中 `agent-prompt-dream-memory-consolidation.md` 对应 v2.1.235 提取，共 1,573 token）。

**机制要点**（SFEIR 文章 + Piebald 提取的提示词原文互证）：

- **定位**：一个后台 subagent，对 auto memory 目录（`~/.claude/projects/<project>/memory/`）做定期「反思性」整理，解决记忆腐烂（memory rot）问题——相对日期失效、条目互相矛盾、重复、MEMORY.md 索引超过 200 行启动阈值。
- **触发**：双重门槛——距上次整合 ≥24 小时**且**累积 ≥5 个会话；由服务端 feature flag 控制灰度（社区逆向称 flag 为 `tengu_onyx_plover`，2026 年 3 月起逐步放开，本地设置无法覆盖；见 [FlorianBruniaux/claude-code-ultimate-guide](https://github.com/FlorianBruniaux/claude-code-ultimate-guide/blob/main/guide/core/memory-systems.md)）。也可在对话中说 "dream" / "consolidate my memory files" 手动触发。
- **安全约束**：子代理只能改记忆文件、只读代码；有锁文件防并发；后台执行不阻塞当前会话。

Dream 提示词原文（Piebald 提取，v2.1.235）显示其四阶段流程：

```
# Dream: Memory Consolidation

You are performing a dream — a reflective pass over your memory files.
Synthesize what you've learned recently into durable, well-organized memories
so that future sessions can orient quickly.

## Phase 1 — Orient
- `ls` the memory directory to see what already exists ...

## Phase 2 — Gather recent signal
Look for new information worth persisting. Sources in rough priority order:
1. **Session logs** (`logs/YYYY/MM/DD/<id>-<title>.md`) — the append-only
   activity stream ... each line is prefix-coded (`>` user, `<` assistant, `.` tool call)
2. **Existing memories that drifted** — facts that contradict something you see
   in the codebase now
3. **Transcript search** — ... grep the JSONL transcripts for narrow terms ...
Don't exhaustively read transcripts. Look only for things you already suspect matter.

## Phase 3 — Consolidate
- Merging new signal into existing topic files rather than creating near-duplicates
- Converting relative dates ("yesterday", "last week") to absolute dates ...
- Deleting contradicted facts — if today's investigation disproves an old memory, fix it at the source
```

（第四阶段为修剪与重建索引，保持 MEMORY.md 在 200 行加载阈值以内。注意它复用第 5 节的 append-only 产物——会话日志与 JSONL 转录——作为整合信号源。）

**与 CLAUDE.md 的分工**（官方 memory 文档 + SFEIR 的四系统对照）：

| 系统 | 角色 | 写入者 | 时机 |
|---|---|---|---|
| CLAUDE.md | 持久项目指令（规则） | 人 | 手动 |
| Auto memory | 跨会话学习笔记（user/feedback/project/reference 四类） | 模型 | 会话中持续 |
| 会话转录（JSONL） | 会话连续性 | harness | 自动 |
| Dream / Auto Dream | 记忆的整合与维护（去重、消矛盾、日期绝对化、索引修剪） | 模型（后台 subagent） | 24h + 5 会话阈值 |

一句话：CLAUDE.md 定规则、auto memory 记笔记、Dream 在「睡眠」时做扫除。另有 Piebald 提取的 `system-prompt-dream-claude-md-memory-reconciliation.md` 与 `system-prompt-dream-team-memory-handling.md`，表明 Dream 还处理记忆与 CLAUDE.md 的对账及团队记忆，细节本文未展开核实。

---

## 3. 控制循环（L）：观察—推理—行动—反馈的编排

### 3.1 单一 queryLoop

逆向分析确认所有接口共享一个执行引擎：

> **Agent Loop** — `queryLoop` async generator in `query.ts`: model call → tool dispatch → result collection → repeat. … All interfaces converge on the same `queryLoop` — the interactive CLI, headless mode, SDK, and IDE all share the same code path.

（[Dive architecture.md](https://github.com/VILA-Lab/Dive-into-Claude-Code/blob/main/docs/architecture.md)；反混淆仓库中 `src/query.ts` 约 68K 行）

每个 turn 走 9 步流水线：

> Settings resolution → State initialization → Context assembly → Five pre-model shapers → Model call → Tool dispatch → Permission gate → Tool execution → Stop condition check

### 3.2 停止条件

- 模型不再发起 tool call 即结束 turn（常规停止）；`Stop` hook 可阻止停止并把原因反馈给模型继续工作，但**连续 block 8 次后 harness 强制放行**（可用 `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP` 调整）——防止 hook 造成死循环（[hooks-guide](https://code.claude.com/docs/en/hooks-guide)）。
- API 错误走 `StopFailure` 事件而非 `Stop`。
- 用户 Esc/Ctrl+C 中断不触发 Stop hook。

### 3.3 重试与恢复

Dive 从源码归纳的恢复机制：

> - Max output token escalation (up to 3 retries per turn)
> - Reactive compaction (fires at most once per turn)
> - Prompt-too-long: tries context-collapse overflow → reactive compaction → terminate
> - Streaming fallback and fallback model switching

subagent 遇到可切换的错误（如模型不可用）时沿 fallback 模型链切换继续工作（官方 sub-agents 文档）。

### 3.4 Subagent / Task 委派

`AgentTool`（反混淆源码 `src/tools/AgentTool/`）负责 spawn 子代理：

- 前台 subagent 阻塞主对话；后台 subagent 并发执行，完成通知在后续 turn 以 completion notification 形式到达主对话（官方 sub-agents 文档："A background subagent's results reach Claude as a completion notification in a later turn"）。
- `maxTurns` 限制子代理的最大 agentic 轮数，超限返回标记为 partial 的输出，主对话可 resume 继续。
- 有嵌套深度限制（达限后 Agent 工具从子代理工具池移除）。
- 委派决策由模型依据 subagent 的 `description` 字段做出；TaskCreate/TaskGet/TaskList/TaskUpdate/TaskStop 等任务工具供 agent teams 协调（反混淆源码 `src/tools/` 目录列表 + 官方 sub-agents 文档）。

### 3.5 Hooks 作为循环的外部编排点

hooks 在循环生命周期的固定点位执行用户 shell 命令，官方文档列出 27+ 事件（SessionStart、UserPromptSubmit、PreToolUse、PostToolUse、PostToolBatch、SubagentStart/Stop、Stop、StopFailure、PreCompact/PostCompact、SessionEnd 等），是「确定性编排」对「模型自主循环」的补充："Hooks are user-defined shell commands... which gives you deterministic control: certain actions always happen rather than relying on the LLM to choose to run them"（[hooks-guide](https://code.claude.com/docs/en/hooks-guide)）。

### 3.6 题外：话题检测

每个用户输入都会先经一次轻量模型调用判断是否新话题并生成会话标题（kirshatrov 抓包，2025-04 版本）：

```
Analyze if this message indicates a new conversation topic. If it does, extract
a 2-3 word title ... respond as JSON with 'isNewTopic' (boolean) and 'title' ...
```

（该行为在当前版本是否存在未确认，但体现了 harness 在主循环之外编排辅助模型调用的做法。）

---

## 4. 动作接口（I_act）：模型输出 → 可执行操作

### 4.1 统一工具接口与组装管线

所有工具实现统一的 `Tool` 接口（`src/tools/Tool.ts`），输入用 **Zod** schema 校验（`lazySchema()` 延迟初始化），权限检查经 `canUseTool()` 并带缓存（[反混淆仓库 README "Tool System"](https://github.com/nadonghuang/claude-code)）。工具池组装是 5 步管线：

> Base enumeration (up to 54 tools) → Mode filtering → Deny rule pre-filtering → MCP integration → Deduplication

（Dive architecture.md）。还有 `ToolSearchTool` 支持延迟工具发现——不把所有工具描述一次性塞进上下文。

### 4.2 内置工具集

反混淆源码 `src/tools/` 目录（v2.1.76）列出 40+ 工具实现，核心包括：

- **Shell**：`BashTool`（含 sandbox 适配、timeout、`run_in_background`）、`PowerShellTool`
- **文件**：`FileReadTool`（文本/PDF/图片）、`FileEditTool`（字符串替换编辑）、`FileWriteTool`、`GlobTool`、`GrepTool`（ripgrep 实现）、`NotebookEditTool`
- **网络**：`WebFetchTool`、`WebSearchTool`
- **编排**：`AgentTool`、`SkillTool`、`TodoWriteTool`、`TaskCreate/Get/List/Update/Stop`、`EnterPlanMode/ExitPlanMode`、`EnterWorktree/ExitWorktree`
- **其他**：`MCPTool`、`LSPTool`、`ToolSearchTool`、`AskUserQuestionTool`、`SendMessageTool`、`ScheduleCronTool` 等

（出处：[nadonghuang/claude-code](https://github.com/nadonghuang/claude-code) 项目结构；早期版本工具名为 View/Replace/GlobTool 等，见 kirshatrov 抓包）

### 4.3 文件编辑策略：精确字符串替换

Edit 工具不走 diff/patch，而是**精确字符串替换**，且在描述中用命令式规则约束模型行为：

```
Performs exact string replacements in files.
- You must use your `Read` tool at least once in the conversation before editing.
  This tool will error if you attempt an edit without reading the file.
- The edit will FAIL if `old_string` is not unique in the file. Either provide a
  larger string with more surrounding context to make it unique or use
  `replace_all` ...
- ALWAYS prefer editing existing files in the codebase. NEVER write new files
  unless explicitly required.
```

（出处：`src/tools/FileEditTool/prompt.ts`）

配套保护：先读后写由 harness 强制（不读就 edit 直接报错）；并发文件编辑用「时间戳 + 内容变化检测」防止冲突（反混淆仓库 README："Concurrent file edit protection via timestamp + content change detection"）。

### 4.4 Bash 工具

从 kirshatrov 抓包的工具描述（2025 版）："Executes a given bash command in a persistent shell session with optional timeout, ensuring proper handling and security measures." 当前版本增加：`run_in_background` 后台执行与完成通知、输出截断、沙箱执行（`src/tools/BashTool/prompt.ts` 中引用 `SandboxManager` 与 timeout 配置）。

### 4.5 MCP 扩展

外部工具经 MCP 接入，命名规范 `mcp__<server>__<tool>`（如 `mcp__github__search_repositories`），支持 stdio/SSE/HTTP/WebSocket 等多种 transport（官方 hooks 文档 matcher 一节 + Dive："MCP Servers — External tools via 7 transport types"）。MCP 工具与内置工具走同一权限/规则体系。MCP 服务器指令注入系统提示词时也考虑了缓存（见 2.2 的 `mcp_instructions` 段注释）。

### 4.6 输出 → 动作的完整映射链

综合以上：模型产生 `tool_use` 块 → Zod schema 校验输入 → deny 规则预过滤 → PreToolUse hooks → 权限规则评估（deny > ask > allow）→ 权限模式/分类器 → （Bash 则进沙箱）执行 → `tool_result` 回灌。权限门细则见第 6 节。

---

## 5. 状态与产物存储（S）：会话历史与产物持久化

### 5.1 会话转录：append-only JSONL

每个会话完整记录为 `~/.claude/projects/<编码后的项目路径>/<session-id>.jsonl`，**每行一个自包含 JSON 事件**（user turn / assistant 响应 / tool call / tool result / system 事件），含 token 用量、subagent 轨迹、hook 事件（[claude-code-sessions 格式参考仓库](https://github.com/frederick-douglas-pearce/claude-code-sessions)；[claude-dev.tools](https://claude-dev.tools/docs/jsonl-format)）。Dive 归纳为三条持久化通道：

> | Channel | Format | Purpose |
> |---|---|---|
> | Session transcripts | Append-only JSONL | Full conversation, chain-patched compaction boundaries |
> | Global prompt history | `history.jsonl` | Cross-session prompt recall (reverse-read for Up-arrow) |
> | Subagent sidechains | Separate JSONL per subagent | Isolated subagent histories |

`~/.claude/history.jsonl` 的存在有官方 issue 佐证（[anthropics/claude-code#41263](https://github.com/anthropics/claude-code/issues/41263)，指出交互模式文档遗漏了该文件的说明）。compaction 边界以链式补丁方式记录在转录中，保证可重建。`claude --resume` 从 JSONL 恢复会话。

设计取舍（Dive 原文）：

> Append-only JSONL favors **auditability and simplicity over query power**. Every event is human-readable, version-controllable, and reconstructable without specialized tooling.

### 5.2 Subagent sidechain 隔离

每个 subagent 写自己的独立 `.jsonl` 文件，只有摘要返回父对话，完整历史**永不进入父上下文**（Dive："Only summary returns to parent. Full history never enters parent context."）。多实例协调用 POSIX `flock()`，零外部依赖。

### 5.3 配置与全局状态

- `~/.claude.json`：登录会话、MCP 服务器配置、per-project 状态（如 trust 决策）。损坏时自动备份到 `~/.claude/backups/` 并可从最近 5 份备份恢复（[官方 settings 文档](https://code.claude.com/docs/en/settings)）。
- 分层 settings 文件：`~/.claude/settings.json`（用户）、`.claude/settings.json`（项目共享）、`.claude/settings.local.json`（项目本地）、managed settings（组织），以及 permissions、hooks 等运行策略——详见第 6 节。

### 5.4 Todos 与记忆产物

- **TodoWrite 的存储**：v2.1.76 反混淆源码（`src/tools/TodoWriteTool/TodoWriteTool.ts`）显示 todo 列表保存在内存态的 appState 中，按 `agentId ?? sessionId` 分键，全部完成即清空："No permission checks required for todo operations"。早期泄露版本曾写 `~/.claude/todos/`，当前版本是否仍落盘**未确认**。
- **Auto memory**：`~/.claude/projects/<project>/memory/`（MEMORY.md + 主题文件，见 2.4）；会话转录按 `cleanupPeriodDays` 保留期清理，但 memory 目录豁免（官方 memory 文档）。
- **Subagent 持久记忆**：frontmatter `memory` 字段可给 subagent 独立记忆目录（`~/.claude/agent-memory/<name>/` 等三级作用域）。

### 5.5 Checkpoint / 恢复时的安全不变式

Dive 指出一条重要设计："**Non-restoration on resume** — Permissions never persist across session boundaries. Trust is always re-established in the current session." 即 resume 只恢复对话状态，权限授权不随会话恢复——宁可牺牲便利也要维持安全不变式。文件快照（file snapshots）机制在 [Milvus 的存储分析文章](https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md)中被提及，细节本文未进一步核实。

---

## 6. 验证与治理（V）：权限、拦截、沙箱与约束执行

### 6.1 纵深防御：七层安全

Dive 从源码归纳出 7 个相互独立的安全层，任何一层都可单独阻断一次操作：

> 1. **Tool pre-filtering** — Blanket-denied tools removed from model's view entirely
> 2. **Deny-first rule evaluation** — Deny always overrides allow, even when allow is more specific
> 3. **Permission mode constraints** — Active mode determines baseline handling
> 4. **Auto-mode ML classifier** — Separate LLM call evaluating safety independently
> 5. **Shell sandboxing** — Filesystem + network isolation for shell commands
> 6. **Non-restoration on resume** — Permissions never persist across session boundaries
> 7. **Hook-based interception** — PreToolUse hooks can modify or block actions

（[Dive architecture.md, "Seven Independent Safety Layers"](https://github.com/VILA-Lab/Dive-into-Claude-Code/blob/main/docs/architecture.md)）

### 6.2 权限模式与规则语法

官方 [permissions 文档](https://code.claude.com/docs/en/permissions)确认的模式：

| 模式 | 行为 |
|---|---|
| `default`（Manual） | 首次使用每类工具时询问 |
| `plan` | 只读探索，不改文件，先出计划 |
| `acceptEdits` | 自动接受文件编辑与工作目录内的常见文件系统命令 |
| `auto` | 后台分类器审查动作与用户意图是否一致 |
| `dontAsk` | 未经 allow 规则预批准的一律自动拒绝（不询问） |
| `bypassPermissions` | 跳过权限询问（少数"任何模式都不自动批准"的动作除外） |

规则为三列表 `permissions.allow / ask / deny`，**评估顺序固定为 deny → ask → allow，首个匹配生效，规则特异性不改变顺序**。语法 `Tool(specifier)`：`Bash(npm run *)`、`Read(./.env)`、`WebFetch(domain:example.com)`、`Agent(Explore)` 等；裸工具名 deny（如 `Bash`）会把该工具**从模型可见上下文中整体移除**。项目级 allow 规则要等 workspace trust 对话框确认后才生效，deny/ask 立即生效。

### 6.3 Bash 命令的确定性 + 模型双重分析

- harness 内置语法分析：识别只读命令集（`ls/cat/grep/git status` 等免询问）、剥离 `timeout/nice/nohup` 等 wrapper、复合命令拆成子命令逐个匹配规则、重定向目标按文件写检查（官方 permissions 文档）。
- 早期版本（kirshatrov 抓包，2025-04）还对每条待批准命令跑两次小模型调用：**前缀提取**（含命令注入检测）与**文件路径提取**：

```
<policy_spec>
# Claude Code Code Bash command prefix detection
...
- git diff $(pwd) => command_injection_detected
...
IMPORTANT: ... if the command seems to contain command injection, you must
return "command_injection_detected". (This will help protect the user: if they
think that they're allowlisting command A, but the AI coding agent sends a
malicious command that technically has the same prefix as A, then the safety
system will see that you said "command_injection_detected" and ask the user
for manual confirmation.)
</policy_spec>
```

### 6.4 auto 模式分类器

逆向分析定位到 `yoloClassifier.ts`：独立的 LLM 调用，"loads base system prompt + permission templates (separate internal/external). Two-stage evaluation: fast-filter + chain-of-thought. Races pre-computed classification against a timeout."（Dive architecture.md）。这与官方 auto 模式描述（"a background classifier reviews commands and protected-directory writes"）一致。

### 6.5 Hooks 拦截

- `PreToolUse` 在**任何权限模式（包括 bypassPermissions / --dangerously-skip-permissions）之前**触发，hook 返回 deny 可阻断一切："A hook that returns permissionDecision: "deny" blocks the tool even in bypassPermissions mode"（[hooks-guide](https://code.claude.com/docs/en/hooks-guide)）。
- hook 经 stdin 收 JSON（`session_id`/`tool_name`/`tool_input`），用 exit code（0 放行 / 2 阻断并把 stderr 反馈给模型）或 stdout 结构化 JSON（`permissionDecision: allow/deny/ask/defer`）表态；多个匹配 hook 并行执行，**最严的结果胜出**（deny > defer > ask > allow）。
- 反向不成立：hook 的 allow 不能绕过 settings 里的 deny 规则——"Hooks can tighten restrictions but not loosen them past what permission rules allow."

### 6.6 沙箱（OS 级强制）

官方 [sandboxing 文档](https://code.claude.com/docs/en/sandboxing)：macOS 用 **Seatbelt**，Linux/WSL2 用 **bubblewrap + socat** 代理；对 Bash 命令及其全部子进程做文件系统隔离（默认只写 cwd 与会话临时目录）+ 网络隔离（域名白名单，经沙箱外代理强制）。两层可独立开关；与权限规则合并成最终边界（Read/Edit deny 规则与 WebFetch 域名规则都会并入沙箱配置）。另有：

- **Protected paths**：即使可写目录内，`.claude/`、`.mcp.json`、shell 启动文件、`.git/hooks`、`~/.claude` 等配置与代码加载路径始终禁写——防止运行中的命令自我提权。
- **凭证保护**：`sandbox.credentials` 支持 deny（沙箱内不可读/环境变量卸载）与 mask（沙箱内看到 sentinel 占位值，代理在出网请求时换真值）。
- **逃生舱**：命令因沙箱失败时模型可用 `dangerouslyDisableSandbox` 重试，但走常规权限流程；`allowUnsandboxedCommands: false` 可关闭。
- 官方明确其定位是减负而非硬边界："Sandboxing reduces risk but is not a complete isolation boundary."

### 6.7 其他治理机制

- **Workspace trust**：仓库提供的 allow 规则、hooks、MCP 服务器等在用户信任该文件夹前不生效；Dive 提到 2 个 CVE 揭示了"pre-trust window"（扩展在信任对话框出现前执行）问题。
- **CLAUDE.md ≠ 强制层**：官方明说 "Settings rules are enforced by the client regardless of what Claude decides to do. CLAUDE.md instructions shape Claude's behavior but are not a hard enforcement layer."（[memory 文档](https://code.claude.com/docs/en/memory)）——治理上把「概率性引导」与「确定性强制」分得很清。
- **Managed settings**：组织级策略优先级最高，用户/项目设置无法覆盖（少数安全敏感键反而允许更严的下级值生效）。
- **Subagent 输出扫描**：见 1.5，防间接提示注入。

---

## 7. 小结：Claude Code Harness 的设计特点

**做厚的部分**：

1. **验证与治理（V）最厚**：7 层独立安全机制（工具预过滤、deny-first 规则、权限模式、ML 分类器、OS 级沙箱、会话边界不继承权限、hooks 拦截），且层层可编程（settings/hooks/managed policy）。「deny 永远赢」「hook 只能收紧不能放松」「权限不随 resume 恢复」等不变式体现了 deny-first 的默认姿态。
2. **上下文管理（C）厚**：5 级压缩管线在每次模型调用前按序执行；CLAUDE.md 四层体系 + 路径作用域 rules + auto memory 构成「文件化、可审计、无向量库」的记忆生态；系统提示词分段组装并精细管理 prompt cache。
3. **状态存储（S）偏厚但极简单**：append-only JSONL 三通道（主转录/输入历史/subagent sidechain），用可审计性换查询能力，不引入任何数据库。
4. **可扩展性厚**：hooks（27+ 事件、4 种执行类型）、skills、plugins、MCP 四种机制按上下文成本分级（Dive："Graduated Context Cost"）。

**做薄的部分**：

1. **控制循环（L）最薄**：核心就是一个 `queryLoop` while 循环（model call → tool dispatch → result → repeat），所有接口复用；停止、重试、恢复逻辑克制且有明确上限（如 Stop hook 连续 8 次阻断即放行）。
2. **观察接口（I_obs）薄**：环境信号以纯文本快照（`<env>`/目录树/git status）和原始 tool_result 回灌为主，不做环境状态的结构化建模，只附加截断与注入净化。
3. **智能决策薄**：98.4% 代码是确定性基础设施，分类器、compaction 摘要、话题检测等少量 AI 调用被严格限定在「主循环之外、有固定输入输出契约」的辅助位置上。

一句话概括：**Claude Code 把「让模型自由发挥」的部分压到最小（一个循环 + 一组工具），把「约束模型不出事」的部分做到最厚（规则、hooks、分类器、沙箱四层叠加），其余一切（上下文、记忆、会话）都用人类可读的文件做载体。**

---

## 附：主要资料来源

**官方文档（code.claude.com/docs）**
- [Settings](https://code.claude.com/docs/en/settings)（分层设置、优先级、workspace trust）
- [Configure permissions](https://code.claude.com/docs/en/permissions)（权限模式、规则语法、Bash 命令分析）
- [Hooks guide](https://code.claude.com/docs/en/hooks-guide)（27+ 事件、输入输出协议、决策合并）
- [Memory / CLAUDE.md](https://code.claude.com/docs/en/memory)（分层加载、auto memory、compaction 存活规则）
- [Subagents](https://code.claude.com/docs/en/sub-agents)（内置/自定义 subagent、隔离、输出扫描）
- [Skills](https://code.claude.com/docs/en/skills)（SKILL.md frontmatter、渐进式披露、嵌套懒加载、skill 内容生命周期）
- [Sandboxing](https://code.claude.com/docs/en/sandboxing)（Seatbelt/bubblewrap、protected paths、凭证 mask）

**逆向工程**
- [nadonghuang/claude-code](https://github.com/nadonghuang/claude-code) — v2.1.76 反混淆源码（1,884 TS 文件；本文引用 `src/constants/prompts.ts`、`systemPromptSections.ts`、`src/services/compact/` 各文件）
- [Piebald-AI/claude-code-system-prompts](https://github.com/Piebald-AI/claude-code-system-prompts) — 从各版本官方 npm 包逐版提取的全部系统提示词（截至 v2.1.247，含 Dream 记忆整合提示词与 CHANGELOG）
- [VILA-Lab/Dive-into-Claude-Code](https://github.com/VILA-Lab/Dive-into-Claude-Code) — v2.1.88 系统性架构分析（1.6% AI / 98.4% 基础设施、7 安全层、5 压缩级、9 步 turn 流水线）
- [kirshatrov.com: Reverse engineering Claude Code](https://kirshatrov.com/posts/claude-code-internals) — 2025-04 mitmproxy 抓包（系统提示词、工具清单、Bash policy_spec）

**记忆整合（Dream / Auto Dream）**
- [SFEIR Institute: Claude Code Dream & Auto Dream](https://institute.sfeir.com/en/articles/claude-code-dream-auto-dream-memory-consolidation/)（机制、触发门槛、与 Sleep-time Compute 的关系）
- [FlorianBruniaux/claude-code-ultimate-guide: memory-systems.md](https://github.com/FlorianBruniaux/claude-code-ultimate-guide/blob/main/guide/core/memory-systems.md)（服务端 flag `tengu_onyx_plover` 的社区逆向记录）

**会话格式**
- [frederick-douglas-pearce/claude-code-sessions](https://github.com/frederick-douglas-pearce/claude-code-sessions)、[claude-dev.tools JSONL 文档](https://claude-dev.tools/docs/jsonl-format)
- [anthropics/claude-code#41263](https://github.com/anthropics/claude-code/issues/41263)（`~/.claude/history.jsonl`）
