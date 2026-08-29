/**
 * Harness 六大运行时职责。
 * 依据 arXiv 2606.20683《From QA to Task Completion: A Survey on Agent System and
 * Harness Design》的形式化定义 A_LLM = ⟨M, I_obs, C, L, I_act, S, V⟩。
 * implementations 中的实现要点来自 docs/harness/ 下两份调研文档：
 * codex-harness.md（openai/codex 源码调研）与 claude-code-harness.md
 * （Claude Code 官方文档 + 逆向源码调研），source 为源码路径或文档出处。
 */

export interface HarnessImplementation {
  /** 产品名 */
  product: 'Codex' | 'Claude Code'
  /** 实现要点：text 为简洁描述，source 为源码文件路径或文档出处 */
  points: { text: string; source?: string }[]
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
  /** 详情：这个职责解决什么问题 */
  detail: string
  /** 详情：两个产品的真实实现要点 */
  implementations: HarnessImplementation[]
}

export const HARNESS_PARTS: HarnessPart[] = [
  {
    symbol: 'I_obs',
    name: '观察接口',
    en: 'Observation Interface',
    tagline: '把环境信号翻译成模型能读懂的观察',
    detail:
      '模型看不见世界，它只能读上下文。观察接口负责把原始环境信号——终端输出、文件 diff、截图、DOM 状态、性能指标——裁剪、格式化成模型可消费的观察。观察给得是否干净、是否聚焦于当前决策，直接决定推理质量。',
    implementations: [
      {
        product: 'Codex',
        points: [
          {
            text: 'exec_command 输出经 head/tail 对称截断：首尾各占 50% 预算、丢弃中段，上限 1 MiB，并标注省略字节数',
            source: 'core/src/unified_exec/head_tail_buffer.rs',
          },
          {
            text: '长命令默认 10s（yield_time_ms）即返回 session_id，模型用 write_stdin 按需轮询增量输出——观察变成拉取而非推送',
            source: 'core/src/tools/handlers/unified_exec/',
          },
          {
            text: 'TurnDiffTracker 跟踪本轮 apply_patch 产生的净 diff，不重读文件系统',
            source: 'core/src/turn_diff_tracker.rs',
          },
          {
            text: 'view_image 把本地图片/截图作为 InputImage 注入下一轮输入；此外刻意保持「哑终端」风格，无 AST/LSP 结构化观察，看代码就走 cat/rg',
            source: 'core/src/tools/handlers/view_image.rs',
          },
        ],
      },
      {
        product: 'Claude Code',
        points: [
          {
            text: '会话启动注入 <env> 环境块 + 目录结构/git status 一次性快照，并明确告知模型「快照不会更新」，要新鲜信息需主动调工具',
            source: 'src/constants/prompts.ts · computeSimpleEnvInfo',
          },
          {
            text: '工具结果以 tool_result 块回灌；文件读取带行号前缀，Edit 工具描述专门提醒「行号前缀不属于文件内容」',
            source: 'src/tools/FileEditTool/prompt.ts',
          },
          {
            text: '观察入口有尺寸控制：Read 默认上限 2000 行；每条消息尺寸上限是 5 个 pre-model shapers 的第一级',
            source: 'Dive-into-Claude-Code · docs/architecture.md',
          },
          {
            text: 'hooks 的外部信号经 additionalContext 以 <system-reminder> 包装注入观察流',
            source: 'code.claude.com/docs/en/hooks-guide',
          },
          {
            text: 'subagent 报告回主对话前被扫描：模仿 system-reminder / Human: 行首的文本被转义，提及权限设置的文本前置 [harness: ...] 标记，防提示注入',
            source: 'code.claude.com/docs/en/sub-agents',
          },
        ],
      },
    ],
  },
  {
    symbol: 'C',
    name: '上下文管理',
    en: 'Context Manager',
    tagline: '决定什么信息、何时、以什么形式进入窗口',
    detail:
      'Harness 的性能天花板。上下文越长，推理越慢、越贵、越容易出错——有观察表明窗口用到约 40% 后输出质量就开始下滑（Smart Zone / Dumb Zone）。上下文管理要在有限窗口里塞进最有效的信息：压缩、分层披露、按加载、以及在上下文焦虑时直接 reset 并用结构化文档交接。Skill 本质上也是这一层的标准化：元数据常驻，命中场景后才加载详细规则。',
    implementations: [
      {
        product: 'Codex',
        points: [
          {
            text: 'AGENTS.md 链式加载：从项目根到 cwd 逐级拼接，总量受 project_doc_max_bytes 限制（默认 32 KiB）；不受信任的项目跳过加载',
            source: 'core/src/agents_md.rs',
          },
          {
            text: '世界状态差分注入：环境/权限/AGENTS.md 等片段渲染成 XML，与上一轮比较后只在变化时注入 diff',
            source: 'core/src/context/world_state/',
          },
          {
            text: '压缩让模型自己写交接摘要；重建时保留近期用户消息（预算 20,000 tokens）并重注入世界状态，工具调用与 reasoning 全部丢弃',
            source: 'core/src/compact.rs',
          },
          {
            text: 'Skills 渐进式披露：常驻上下文的只有元数据清单，选中后才读 SKILL.md 全文，正文截断到 8,000 字节',
            source: 'codex-rs/ext/skills/src/render.rs',
          },
          {
            text: '跨会话记忆两阶段流水线：rollout 抽取 → 全局整合子 agent 产出 MEMORY.md；读路径预算 ≤4–6 次搜索，引用须附 <oai-mem-citation>',
            source: 'codex-rs/memories/',
          },
        ],
      },
      {
        product: 'Claude Code',
        points: [
          {
            text: '5 级压缩管线在每次模型调用前按序执行：Budget Reduction → Snip → Microcompact → Context Collapse → Auto-Compact（最后手段）',
            source: 'src/services/compact/',
          },
          {
            text: 'CLAUDE.md 四层分层加载 + @import 递归导入；以 user message 注入（概率性遵从而非强制），压缩后从磁盘重读注入',
            source: 'code.claude.com/docs/en/memory',
          },
          {
            text: '系统提示词分段组装并有静态/动态边界标记，变化频率不同的内容拆成不同 section，精细管理 prompt cache 命中率',
            source: 'src/constants/systemPromptSections.ts',
          },
          {
            text: 'Skill 渐进式披露：description 在列表中截断至 1,536 字符，正文按用加载；auto-compact 后带回每个已调用 skill 最近内容的前 5,000 token',
            source: 'code.claude.com/docs/en/skills',
          },
          {
            text: 'Dream 记忆整合：距上次 ≥24h 且累积 ≥5 个会话才触发，四阶段流程（Orient → Gather → Consolidate → 修剪索引），解决记忆腐烂',
            source: 'Piebald · agent-prompt-dream-memory-consolidation.md',
          },
        ],
      },
    ],
  },
  {
    symbol: 'L',
    name: '控制循环',
    en: 'Control Loop',
    tagline: '编排「观察—推理—行动—反馈」的循环',
    detail:
      '模型只输出下一个动作，循环本身由 Harness 提供：步骤调度、停止条件、重试、反思、子代理委派。好的编排是该确定的地方确定、该灵活的地方灵活——确定性步骤走流水线，需要判断的步骤交给模型。',
    implementations: [
      {
        product: 'Codex',
        points: [
          {
            text: '每个用户输入包装成 SessionTask，RegularTask 反复调 run_turn() 驱动循环，可被 CancellationToken 打断',
            source: 'core/src/tasks/regular.rs',
          },
          {
            text: 'run_turn 内层循环（约 2800 行）：消费流式事件 → 工具调用丢进 FuturesOrdered 并发执行 → 结果追加历史 → 再采样',
            source: 'core/src/session/turn.rs',
          },
          {
            text: '停止条件朴素：本轮无工具调用且无排队输入即结束；token 触顶不硬失败，而是 rollover 到压缩/新上下文窗口',
            source: 'core/src/session/turn.rs',
          },
          {
            text: '流式请求指数退避重试：初始 5s、上限 60s，区分连接错误与采样错误，同一 turn 复用连接',
            source: 'core/src/responses_retry.rs',
          },
          {
            text: '控制循环做薄、子任务做成工具：spawn 子 agent 通过 multi_agents 工具外挂，无内建规划器/反思器',
            source: 'core/src/tools/handlers/multi_agents/',
          },
        ],
      },
      {
        product: 'Claude Code',
        points: [
          {
            text: '单一 queryLoop async generator：model call → tool dispatch → result → repeat；CLI、headless、SDK、IDE 全部共享同一代码路径',
            source: 'src/query.ts',
          },
          {
            text: '每个 turn 走 9 步流水线：Settings 解析 → 状态初始化 → 上下文组装 → 5 个 pre-model shapers → 模型调用 → 工具分发 → 权限门 → 执行 → 停止检查',
            source: 'Dive-into-Claude-Code · docs/architecture.md',
          },
          {
            text: 'Stop hook 可阻止停止并把原因反馈给模型继续工作，但连续 block 8 次后强制放行，防死循环',
            source: 'code.claude.com/docs/en/hooks-guide',
          },
          {
            text: 'AgentTool 委派 subagent：maxTurns 限制轮数、嵌套深度限制，后台 subagent 完成通知在后续 turn 到达',
            source: 'code.claude.com/docs/en/sub-agents',
          },
          {
            text: 'hooks 在 27+ 生命周期事件（SessionStart/PreToolUse/Stop/PreCompact 等）提供确定性编排点，补充模型自主循环',
            source: 'code.claude.com/docs/en/hooks-guide',
          },
        ],
      },
    ],
  },
  {
    symbol: 'I_act',
    name: '动作接口',
    en: 'Action Interface',
    tagline: '把模型输出映射成可执行的操作',
    detail:
      '函数调用、MCP 工具、shell、代码执行、文件系统抽象——模型的一切意图都要经过动作接口落地。接口提供了什么操作、怎样返回结果、错误能否被下一步利用，直接改变任务完成率。',
    implementations: [
      {
        product: 'Codex',
        points: [
          {
            text: '文件编辑走自定义 apply_patch 工具（V4A patch 格式），对某些模型以 freeform custom tool + Lark 语法约束解码的方式暴露',
            source: 'core/src/tools/handlers/apply_patch.lark',
          },
          {
            text: 'patch 解析与落盘在独立 crate；另提供 codex-apply-patch 独立可执行文件，供不支持 custom tool 的模型经 shell 调用',
            source: 'codex-rs/apply-patch/',
          },
          {
            text: '每个工具是一张 JSON Schema（ToolSpec），按特性开关组装，经 router/registry 分发到 handler',
            source: 'core/src/tools/spec_plan.rs',
          },
          {
            text: '带副作用的工具都过 ToolOrchestrator：审批 → 选沙箱 → 尝试 → 拒绝后按策略升级重试',
            source: 'core/src/tools/orchestrator.rs',
          },
          {
            text: '作为 MCP 客户端聚合外部工具，与内建工具同等并入 Prompt.tools；也可反向把自身暴露为 MCP server',
            source: 'codex-rs/rmcp-client/',
          },
        ],
      },
      {
        product: 'Claude Code',
        points: [
          {
            text: 'Edit 工具用精确字符串替换而非 diff/patch：old_string 不唯一即失败，要求加大上下文或 replace_all',
            source: 'src/tools/FileEditTool/prompt.ts',
          },
          {
            text: '先读后写由 harness 强制（不读就 edit 直接报错）；并发文件编辑用时间戳 + 内容变化检测防冲突',
            source: 'nadonghuang/claude-code · README',
          },
          {
            text: '统一 Tool 接口 + Zod schema 校验；工具池 5 步组装管线：枚举（至多 54 个）→ 模式过滤 → deny 预过滤 → MCP 接入 → 去重',
            source: 'src/tools/Tool.ts',
          },
          {
            text: 'MCP 扩展工具命名 mcp__<server>__<tool>，支持 stdio/SSE/HTTP/WebSocket 等多种 transport，与内置工具走同一权限体系',
            source: 'code.claude.com/docs/en/hooks-guide',
          },
          {
            text: 'ToolSearchTool 支持延迟工具发现——不把所有工具描述一次性塞进上下文',
            source: 'Dive-into-Claude-Code · docs/architecture.md',
          },
        ],
      },
    ],
  },
  {
    symbol: 'S',
    name: '状态与产物存储',
    en: 'State & Artifact Store',
    tagline: '持久化执行状态与中间产物',
    detail:
      '模型没有跨会话记忆。对话历史、计划、进度文件、检查点、日志、轨迹、diff，都要由这一层独立持久化，长任务才能在中断、压缩、交接之后继续推进。结构化数据（如 JSON 进度文件）比自由文本更不容易被 Agent 改乱。',
    implementations: [
      {
        product: 'Codex',
        points: [
          {
            text: 'Rollout JSONL：每会话一个 append-only 文件，按日期归档到 ~/.codex/sessions/YYYY/MM/DD/，是 resume/fork/revert 的事实来源',
            source: 'codex-rs/rollout/src/recorder.rs',
          },
          {
            text: '持久化策略白名单：消息、reasoning、工具调用与输出、压缩标记、turn context 快照都落盘，纯 UI 事件不落',
            source: 'codex-rs/rollout/src/policy.rs',
          },
          {
            text: '写入走 actor 模式：后台 writer 缓冲批量落盘，flush 失败可重试；resume 逐条重建历史，等于无损回放',
            source: 'core/src/session/rollout_reconstruction.rs',
          },
          {
            text: 'state.db（SQLite）存线程元数据、审计日志、memories，与 append-only 的 rollout 分工成「索引查询 / 轨迹回放」两层',
            source: 'codex-rs/state/',
          },
        ],
      },
      {
        product: 'Claude Code',
        points: [
          {
            text: '会话转录为 append-only JSONL：每行一个自包含事件（user/assistant/tool call/tool result/system），含 token 用量与 hook 事件',
            source: 'claude-dev.tools · docs/jsonl-format',
          },
          {
            text: '三条持久化通道：主转录、history.jsonl 全局输入历史、每个 subagent 的独立 sidechain JSONL（完整历史永不进入父上下文）',
            source: 'Dive-into-Claude-Code · docs/architecture.md',
          },
          {
            text: 'compaction 边界以链式补丁方式记录在转录中保证可重建；claude --resume 直接从 JSONL 恢复会话',
            source: '~/.claude/projects/<project>/<session-id>.jsonl',
          },
          {
            text: '安全不变式：resume 只恢复对话状态，权限授权绝不随会话恢复，信任每次会话重新建立',
            source: 'Dive-into-Claude-Code · docs/architecture.md',
          },
          {
            text: '~/.claude.json 损坏时自动备份到 ~/.claude/backups/，可从最近 5 份备份恢复',
            source: 'code.claude.com/docs/en/settings',
          },
        ],
      },
    ],
  },
  {
    symbol: 'V',
    name: '验证与治理',
    en: 'Verification & Governance',
    tagline: '检查、约束并修复执行',
    detail:
      '让 Agent 知道自己做没做对，并在出错时拦住它：测试、断言、linter、验证器模型、沙箱、权限门。约束必须可机械执行——只写在文档里的规矩，Agent 迟早偏离。软件工程场景的主要瓶颈就压在这一层。',
    implementations: [
      {
        product: 'Codex',
        points: [
          {
            text: '三层防线叠加：审批策略（untrusted/on-request/granular/never 四级）+ execpolicy 前缀规则引擎 + OS 级沙箱，全部在 harness 内强制执行',
            source: 'codex-rs/protocol/src/protocol.rs',
          },
          {
            text: '沙箱模式分 read-only / workspace-write / danger-full-access；macOS Seatbelt（deny default）、Linux Landlock + bubblewrap、Windows 受限令牌',
            source: 'codex-rs/sandboxing/',
          },
          {
            text: 'execpolicy 把 shell 命令解析成 token 序列做前缀匹配，裁决 allow/prompt/forbid；「以后都允许」生成 ExecPolicyAmendment 持久化放行规则',
            source: 'codex-rs/execpolicy/',
          },
          {
            text: 'apply_patch 有独立安全评估：写入路径全部落在可写根内且沙箱可用才 AutoApprove，否则 AskUser 或 Reject',
            source: 'core/src/safety.rs',
          },
          {
            text: '测试验证刻意做薄（委托提示词约定）；但可选 auto_review 把审批请求路由给 reviewer agent，把「人审」换成「模型审」',
            source: 'core/src/guardian/',
          },
        ],
      },
      {
        product: 'Claude Code',
        points: [
          {
            text: '7 层相互独立的安全层：工具预过滤 → deny-first 规则 → 权限模式 → ML 分类器 → OS 沙箱 → resume 不继承权限 → hooks 拦截',
            source: 'Dive-into-Claude-Code · docs/architecture.md',
          },
          {
            text: '权限规则评估顺序固定为 deny → ask → allow，首个匹配生效；裸工具名 deny 会把工具整体移出模型可见上下文',
            source: 'code.claude.com/docs/en/permissions',
          },
          {
            text: 'PreToolUse hook 先于任何权限模式（含 bypassPermissions）触发，返回 deny 可阻断一切；hook 只能收紧不能放松',
            source: 'code.claude.com/docs/en/hooks-guide',
          },
          {
            text: 'auto 模式后台分类器（yoloClassifier）：独立 LLM 两阶段评估（fast-filter + chain-of-thought），审查动作与用户意图是否一致',
            source: 'Dive-into-Claude-Code · docs/architecture.md',
          },
          {
            text: 'OS 沙箱：macOS Seatbelt / Linux bubblewrap + socat 代理，文件系统与网络隔离；.claude/、.git/hooks 等 protected paths 始终禁写',
            source: 'code.claude.com/docs/en/sandboxing',
          },
        ],
      },
    ],
  },
]
