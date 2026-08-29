# OpenAI Codex Harness 调研：六大运行时职责的实现

> 调研对象：[openai/codex](https://github.com/openai/codex) 仓库 `main` 分支
> （tree SHA `7625343977154efed8c0dadba956374992a1580b`，2026-08 抓取），
> 核心为 `codex-rs/` 下的 Rust 实现；仓库根部的 `codex-cli/` 只剩 npm 打包
> 入口（`bin/codex.js` 等薄封装），不含 agent 逻辑。
> 官方文档：<https://developers.openai.com/codex>。
> 章节划分依据 arXiv:2606.20683 综述提出的 Harness 六大运行时职责：
> I_obs（观察接口）、C（上下文管理）、L（控制循环）、I_act（动作接口）、
> S（状态与产物存储）、V（验证与治理）。

## 总述：Codex Harness 的整体架构

Codex CLI 中"模型之外的那层运行时"几乎全部位于 `codex-rs/core/`（crate 名 `codex-core`），
加上一组高度拆分的辅助 crate（整个 `codex-rs/` 下有 140+ 个带 `Cargo.toml` 的 crate）。架构主线是：

- **会话 / 轮次编排**：`Session`（`core/src/session/session.rs`）持有全部会话状态；
  每个用户输入被包装成一个 `SessionTask`（`core/src/tasks/mod.rs`），普通轮次是
  `RegularTask`（`core/src/tasks/regular.rs`），它反复调用 `run_turn()`
  （`core/src/session/turn.rs`）驱动"观察—推理—行动—反馈"循环。
- **模型接入**：通过 OpenAI Responses API 的流式接口（`core/src/client.rs`、
  `core/src/client_common.rs`），请求载荷为 `Prompt { input, tools, base_instructions, ... }`。
- **工具系统**：`core/src/tools/` 下的注册表 / 路由器 / 编排器
  （`registry.rs`、`router.rs`、`orchestrator.rs`），内建工具 handler 在
  `core/src/tools/handlers/`，外部工具经 MCP 接入（`codex-rs/rmcp-client/`）。
- **治理层**：审批策略（`AskForApproval`）、沙箱（`codex-rs/sandboxing/`：
  macOS Seatbelt、Linux Landlock + bubblewrap、Windows 受限令牌）、
  命令前缀规则引擎（`codex-rs/execpolicy/`）三者叠加。
- **持久化**：`codex-rs/rollout/` 把每个会话写成 JSONL rollout 文件，
  是 resume / fork / revert 的事实来源；另有 `codex-rs/state/`（SQLite）
  存线程元数据、日志等。

前端（TUI、IDE 扩展、app-server）只消费 core 发出的事件流，不参与决策。
以下按六大职责分述。

## 1. 观察接口（I_obs）：环境信号 → 模型观察

Codex 的观察主要是**文本化**的：终端输出、文件编辑结果、环境上下文都以
Responses API 的 `FunctionCallOutput` / 文本消息形式回传模型。

**(a) 命令输出的截断与格式化。** `exec_command` 工具在 PTY 中跑命令，
输出经 head/tail 对称截断：保留开头一半预算和结尾一半预算，丢弃中段
（`core/src/unified_exec/head_tail_buffer.rs`）：

```rust
// codex-rs/core/src/unified_exec/head_tail_buffer.rs
/// A capped buffer that preserves a stable prefix ("head") and suffix ("tail"),
/// dropping the middle once it exceeds the configured maximum. The buffer is
/// symmetric meaning 50% of the capacity is allocated to the head and 50% is
/// allocated to the tail.
pub(crate) struct HeadTailBuffer<const MAX_BYTES: usize = UNIFIED_EXEC_OUTPUT_MAX_BYTES> {
    head: Vec<u8>,
    tail: VecDeque<u8>,
    omitted_bytes: usize,
}
```

预算常量与"省略标记"在 `core/src/unified_exec/mod.rs`：

```rust
// codex-rs/core/src/unified_exec/mod.rs
pub(crate) const MAX_YIELD_TIME_MS: u64 = 30_000;
pub(crate) const DEFAULT_MAX_OUTPUT_TOKENS: usize = 10_000;
pub(crate) const UNIFIED_EXEC_OUTPUT_MAX_BYTES: usize = 1024 * 1024; // 1 MiB
pub(crate) const UNIFIED_EXEC_OUTPUT_MAX_TOKENS: usize = UNIFIED_EXEC_OUTPUT_MAX_BYTES / 4;

pub(crate) fn format_output_omission_marker(omitted_bytes: usize) -> String {
    format!("... {omitted_bytes} bytes omitted ...")
}
```

**(b) 长任务的异步观察。** `exec_command` 默认最多等 `yield_time_ms`
（默认 10s，范围 250–30000ms）就返回一个 `session_id`；模型之后用
`write_stdin` 工具轮询增量输出或向进程喂输入（工具定义见
`core/src/tools/handlers/shell_spec.rs`，handler 在
`core/src/tools/handlers/unified_exec/`）。这让"观察"变成按需拉取而非一次性推送。

**(c) 文件 diff 观察。** Harness 自己跟踪本轮 `apply_patch` 产生的净 diff，
不重读文件系统（`core/src/turn_diff_tracker.rs`）：

```rust
// codex-rs/core/src/turn_diff_tracker.rs
/// Tracks the net text diff for the current turn from committed apply_patch
/// mutations, without rereading the workspace filesystem.
pub struct TurnDiffTracker {
    valid: bool,
    display_roots_by_environment: HashMap<String, PathUri>,
    baseline_by_path: HashMap<TrackedPath, TrackedContent>,
    current_by_path: HashMap<TrackedPath, TrackedContent>,
    // ...
}
```

**(d) 图像观察。** `view_image` 工具（`core/src/tools/handlers/view_image.rs`）
把本地图片/截图作为 `InputImage` content 注入下一轮输入。

值得注意：Codex **没有**结构化的代码观察（无 AST 索引、无 LSP 语义回传）；
模型想看代码就走 `exec_command`（`cat`/`rg`），观察接口刻意保持"哑终端"风格。

## 2. 上下文管理（C）：什么、何时、以什么形式进上下文

**(a) 系统提示词。** 基础指令是一个编译进二进制的 markdown 文件
`codex-rs/protocol/src/prompts/base_instructions/default.md`（约 275 行），
内容覆盖人格、AGENTS.md 规范、计划工具用法等（原文摘录与完整章节结构见 7.1）。开头：

```markdown
<!-- codex-rs/protocol/src/prompts/base_instructions/default.md -->
You are a coding agent running in the Codex CLI, a terminal-based coding assistant.
Codex CLI is an open source project led by OpenAI. You are expected to be precise, safe, and helpful.

Your capabilities:
- Receive user prompts and other context provided by the harness, such as files in the workspace.
- Communicate with the user by streaming thinking & responses, and by making & updating plans.
- Emit function calls to run terminal commands and apply patches. ...
```

**(b) AGENTS.md 注入。** 发现逻辑在 `core/src/agents_md.rs`，模块注释写明了规则：

```rust
// codex-rs/core/src/agents_md.rs
//! 1.  Determine the project root by walking upwards from the current working
//!     directory until a configured `project_root_markers` entry is found.
//!     When `project_root_markers` is unset, the default marker list is used
//!     (`.git`). ...
//! 2.  Collect every `AGENTS.md` found from the project root down to the
//!     current working directory (inclusive) and concatenate their contents in
//!     that order.
//! 3.  We do **not** walk past the project root.

pub const DEFAULT_AGENTS_MD_FILENAME: &str = "AGENTS.md";
pub const LOCAL_AGENTS_MD_FILENAME: &str = "AGENTS.override.md";
const AGENTS_MD_SEPARATOR: &str = "\n\n--- project-doc ---\n\n";
```

全局层（`~/.codex/AGENTS.md` 或 `AGENTS.override.md`）与项目层拼接后注入；
总量受 `project_doc_max_bytes` 限制（默认 32 KiB）。官方文档
[AGENTS.md 指南](https://developers.openai.com/codex/guides/agents-md) 确认了
发现顺序、每目录至多一个文件、字节上限等行为。注意：**不受信任的项目
（`active_project.is_untrusted()`）会跳过项目文档加载**，这是治理与上下文管理的交叉点。

**(c) 环境上下文与"世界状态差分注入"。** cwd、shell、网络与文件系统权限
被渲染为 XML 片段放进 `<environment_context>` 标签的用户消息
（`core/src/context/world_state/environment.rs`、
`core/src/context/environment_context.rs`）：

```rust
// codex-rs/core/src/context/world_state/environment.rs
fn push_environment_values(rendered: &mut String, environment: &EnvironmentState, indent: &str) {
    rendered.push_str(indent);
    rendered.push_str("<cwd>");
    push_xml_escaped_text(rendered, &environment.cwd.inferred_native_path_string());
    rendered.push_str("</cwd>\n");
    if let Some(shell) = &environment.shell {
        rendered.push_str(indent);
        rendered.push_str("<shell>");
        push_xml_escaped_text(rendered, shell);
        rendered.push_str("</shell>\n");
    }
}
```

`core/src/context/world_state/` 整目录是一个"世界状态 → 上下文片段"系统：
每个片段（环境、权限、AGENTS.md、协作模式等）实现 `ContextualUserFragment`，
harness 比较当前与上一轮的渲染结果，**只在发生变化时注入 diff**
（`render_diff`），避免每轮重复塞同样的上下文。

**(d) 压缩（compaction）。** 上下文逼近窗口上限时触发自动压缩
（触发阈值、四种实现分派与重建细节见 7.2）：
触发逻辑在 `core/src/session/context_window.rs`（按
`model_auto_compact_token_limit` 与 `effective_context_window_percent` 判定），
执行在 `core/src/compact.rs`。压缩本质是**让模型自己写交接摘要**，
摘要提示词为 `codex-rs/prompts/templates/compact/prompt.md`：

```markdown
<!-- codex-rs/prompts/templates/compact/prompt.md -->
You are performing a CONTEXT CHECKPOINT COMPACTION. Create a handoff summary
for another LLM that will resume the task.

Include:
- Current progress and key decisions made
- Important context, constraints, or user preferences
- What remains to be done (clear next steps)
- Any critical data, examples, or references needed to continue
```

压缩提示词可被 config 的 `compact_prompt` 覆盖（`core/src/compact.rs` 中
`run_inline_auto_compact_task` 里 `unwrap_or(SUMMARIZATION_PROMPT)`）。
此外还有服务端压缩路径（`core/src/compact_remote_v2*.rs`），即在上下文里
放一个压缩占位符、由服务端处理历史——属于较新的实验特性。

**(e) 请求组装。** 最终发给模型的载荷是 `Prompt` 结构
（`core/src/client_common.rs`）：`input: Vec<ResponseItem>`（完整会话历史）、
`tools`（含 MCP 工具）、`base_instructions`——上下文管理的一切产物都汇聚到这里。

## 3. 控制循环（L）：观察—推理—行动的编排

**(a) 任务抽象。** 每个回合被建模为 `SessionTask`（`core/src/tasks/mod.rs`），
有 Regular（普通对话）、Compact、Review、UserShell 等种类
（`core/src/tasks/{regular,compact,review,user_shell}.rs`），由 Session 串行调度，
可被 `CancellationToken` 打断。

**(b) 外层循环：排干用户输入。** `RegularTask::run` 在用户于模型运行期间
追加输入时继续开新一轮（`core/src/tasks/regular.rs`）：```rust
// codex-rs/core/src/tasks/regular.rs
let mut next_input = input;
loop {
    let last_agent_message = run_turn(
        Arc::clone(&sess), Arc::clone(&ctx), next_input,
        prewarmed_client_session.take(),
        cancellation_token.child_token(),
    ).await?;
    // Terminal errors are already reported. Let task completion preserve pending
    // input instead of restarting the failed turn for that same input.
    if ctx.terminal_error.lock().await.is_some() {
        return Ok(last_agent_message);
    }
    if !sess.input_queue.has_pending_input(&sess.active_turn).await {
        return Ok(last_agent_message);   // 无待处理输入 → 任务结束
    }
    next_input = Vec::new();
}
```

**(c) 内层循环：采样—执行工具—再采样。** `run_turn()`
（`core/src/session/turn.rs`，约 2800 行）的结构：
先做 pre-sampling compaction，捕获本轮 step context（上下文、工具列表的快照），
然后进入循环：消费 Responses 事件流 → 每收到一个 `OutputItemDone` 就把工具调用
丢进 `FuturesOrdered` 并发执行 → 流结束后把工具结果追加进历史 →
若模型还需要跟进（`needs_follow_up`，即本轮产生过工具调用）或有待处理输入，
则带着新观察再次采样；否则记录 `last_agent_message` 并结束本轮：

```rust
// codex-rs/core/src/session/turn.rs（sampling 循环收尾处）
let needs_follow_up = model_needs_follow_up || has_pending_input;
```

即停止条件是"模型这一回合没有发起任何工具调用且没有排队输入"——典型的
ReAct 式 loop-until-done；token 触顶时不是硬失败，而是 rollover 到
压缩 / 新上下文窗口。

**(d) 重试。** 流式请求的错误重试集中在 `core/src/responses_retry.rs`：
指数退避（`INITIAL_CONNECTION_RETRY_DELAY = 5s`，上限 60s），区分连接错误与
采样错误，同一 turn 内复用 `ModelClientSession` 以保留 WebSocket 与路由状态。

**(e) 子任务 / 子智能体。** 子任务不是控制循环的内建概念，而是通过工具暴露的：
`core/src/tools/handlers/multi_agents/`（`spawn.rs`/`wait.rs`/`close_agent.rs` 等）
让模型可以 spawn 子 agent 并等待结果；`core/src/agent/` 维护 agent 注册表与
内建角色（`builtins/explorer.toml` 等）。这是"控制循环做薄、子任务做成工具"的设计。

## 4. 动作接口（I_act）：模型输出 → 可执行操作

**(a) 工具定义。** 每个工具是一张 JSON Schema（`ToolSpec`），在
`core/src/tools/spec_plan.rs` 按特性开关组装，经 router/registry 分发到
`core/src/tools/handlers/` 下的 handler。核心 shell 工具定义
（`core/src/tools/handlers/shell_spec.rs`）：

```rust
// codex-rs/core/src/tools/handlers/shell_spec.rs
let mut properties = BTreeMap::from([
    ("cmd".to_string(),
     JsonSchema::string(Some("Shell command to execute.".to_string()))),
    ("workdir".to_string(),
     JsonSchema::string(Some("Working directory for the command. Defaults to the turn cwd.".to_string()))),
    ("tty".to_string(),
     JsonSchema::boolean(Some("True allocates a PTY for the command; false or omitted uses plain pipes.".to_string()))),
    ("yield_time_ms".to_string(), JsonSchema::number(Some(yield_time_ms_description.to_string()))),
    ("max_output_tokens".to_string(),
     JsonSchema::number(Some("Output token budget. Defaults to 10000 tokens; larger requests may be capped by policy.".to_string()))),
]);
// ToolSpec::Function(ResponsesApiTool { name: "exec_command", ... })
```

**(b) 文件编辑：自定义 apply_patch 工具。** Codex 不让模型裸写
`sed`/`cat >`，而是定义了一套 V4A patch 格式，对某些模型以 **freeform custom
tool + Lark 语法约束解码** 的方式暴露（语法文件
`core/src/tools/handlers/apply_patch.lark`）：

```lark
;; codex-rs/core/src/tools/handlers/apply_patch.lark
start: begin_patch hunk+ end_patch
begin_patch: "*** Begin Patch" LF
end_patch: "*** End Patch" LF?
hunk: add_hunk | delete_hunk | update_hunk
add_hunk: "*** Add File: " filename LF add_line+
delete_hunk: "*** Delete File: " filename LF
update_hunk: "*** Update File: " filename LF change_move? change?
change: (change_context | change_line)+ eof_line?
change_context: ("@@" | "@@ " /(.+)/) LF
change_line: ("+" | "-" | " ") /(.+)/ LF
```

解析与落盘在独立 crate `codex-rs/apply-patch/`
（`parser.rs` 把 patch 解析为 `Hunk::{AddFile, DeleteFile, UpdateFile}`，
`file_update.rs` 应用变更）；`main.rs` 还提供独立的 `codex-apply-patch`
可执行文件，供不支持 custom tool 的模型通过 shell 调用。执行 handler 在
`core/src/tools/handlers/apply_patch.rs` 与 `core/src/tools/runtimes/apply_patch.rs`。

**(c) 执行编排。** 所有带副作用的工具都过 `ToolOrchestrator`
（`core/src/tools/orchestrator.rs`，见第 6 节）——审批、沙箱选择、失败后
升级重试都在动作接口与治理的交界处完成。

**(d) MCP。** Codex 作为 MCP 客户端聚合外部工具：
连接管理在 `core/src/mcp.rs` 与 `core/src/session/mcp_runtime.rs`，
协议客户端是 `codex-rs/rmcp-client/`（基于 rmcp，含 OAuth），MCP 工具被并入
`Prompt.tools` 与内建工具同等对待。反向地，`codex-rs/mcp-server/` 把 Codex
自身暴露为 MCP server，供其他 agent 调用。

## 5. 状态与产物存储（S）：会话、rollout、日志的持久化

**(a) Rollout 文件：会话的不可变追加日志。** 核心在
`codex-rs/rollout/src/recorder.rs`。每会话一个 JSONL 文件，按日期分目录：

```rust
// codex-rs/rollout/src/recorder.rs
//! Persist Codex session rollouts (.jsonl) so sessions can be replayed or inspected later.
///
/// ```ignore
/// $ jq -C . ~/.codex/sessions/rollout-2025-05-07T17-24-21-5973b6c0-...jsonl
/// ```
///
/// Normally this is `None`, so the filename is
/// `rollout-<timestamp>-<conversation_id>.jsonl`. `thread/revert` sets it, producing
/// `rollout-<timestamp>-<conversation_id>_<rollout_id>.jsonl`, because revert keeps the
/// thread ID stable while creating a new immutable rollout file.
```

实际路径为 `~/.codex/sessions/YYYY/MM/DD/rollout-<timestamp>-<uuid>.jsonl`。
写入走 actor 模式：`RolloutRecorder` 持有一个 channel，后台 writer task
先缓冲到 `pending_items`，再批量落盘，flush 失败可重试（同文件
`fn write_pending_with_recovery`）。

**(b) 持久化策略：什么进 rollout。** `codex-rs/rollout/src/policy.rs` 决定
哪些条目值得落盘——消息的完整轨迹（含推理项、工具调用与输出、压缩标记、
turn context 快照）都持久化，纯 UI 事件不落：

```rust
// codex-rs/rollout/src/policy.rs
pub fn should_persist_response_item(item: &ResponseItem) -> bool {
    match item {
        ResponseItem::Message { .. }
        | ResponseItem::Reasoning { .. }
        | ResponseItem::FunctionCall { .. }
        | ResponseItem::FunctionCallOutput { .. }
        | ResponseItem::CustomToolCall { .. }
        | ResponseItem::WebSearchCall { .. }
        | ResponseItem::Compaction { .. }
        | ResponseItem::ContextCompaction { .. } => true,
        ResponseItem::AdditionalTools { .. } | ResponseItem::CompactionTrigger { .. }
        | ResponseItem::Other => false,
        // ...
    }
}
```

文件首行是 `SessionMeta`（会话 id、时间戳、cwd、originator、base
instructions、git 信息等），之后是逐条的 `ResponseItem` / `TurnContext` /
`Compacted` 记录。

**(c) 恢复与分叉。** resume 走 `RolloutRecorderParams::Resume { path }`，
历史重建在 `core/src/session/rollout_reconstruction.rs`；fork / revert 通过
复制 rollout 文件实现（`codex-rs/thread-store/src/local/paginated_fork.rs`、
`revert_thread.rs`）。rollout 文件因此同时充当"检查点"和"轨迹"两个角色。

**(d) 其他存储。** `codex-rs/state/` 用 SQLite（`state.db`）存线程元数据、
审计日志、memories 等结构化状态；`codex-rs/message-history/` 记录用户输入历史。
rollout（JSONL，append-only、面向轨迹）与 state.db（SQLite、面向索引/查询）
是分工的两层。

## 6. 验证与治理（V）：沙箱、审批与约束执行

这是 Codex 做得最厚的一层，由**审批策略 + 命令规则引擎 + OS 级沙箱**三件叠加。

**(a) 审批策略。** 枚举定义在 `codex-rs/protocol/src/protocol.rs`：

```rust
// codex-rs/protocol/src/protocol.rs
pub enum AskForApproval {
    /// Internal policy for projects marked untrusted. Commands require
    /// approval unless an explicit exec policy rule allows them.
    #[serde(rename = "untrusted")]
    UnlessTrusted,

    /// The model decides when to ask the user for approval.
    #[serde(alias = "on-failure")]   // 旧的 on-failure 已并入 on-request
    #[default]
    OnRequest,

    /// Fine-grained controls for individual approval flows. ...
    Granular(GranularApprovalConfig),

    /// Never ask the user to approve commands. Failures are immediately returned
    /// to the model, and never escalated to the user for approval.
    Never,
}
```

沙箱模式（`read-only` / `workspace-write` / `danger-full-access`）定义在
`codex-rs/protocol/src/config_types.rs` 的 `SandboxMode`。官方文档
[Sandboxing](https://developers.openai.com/codex/concepts/sandboxing) 与
[Agent approvals & security](https://developers.openai.com/codex/security)
确认了两者的语义与组合方式（"sandbox 决定技术上能做什么，approval policy
决定何时必须停下来问"）。

**(b) 审批 → 沙箱 → 失败升级重试。** 所有工具执行都过 `ToolOrchestrator`
（`core/src/tools/orchestrator.rs`），模块注释即算法：

```rust
// codex-rs/core/src/tools/orchestrator.rs
/*
Module: orchestrator

Central place for approvals + sandbox selection + retry semantics. Drives a
simple sequence for any ToolRuntime: approval → select sandbox → attempt →
retry with an escalated sandbox strategy on denial (no re-approval thanks to
caching).
*/
```

沙箱内执行被 OS 拒绝（`SandboxErr::Denied`）后，按审批策略决定是否脱沙箱重试——
`Never`/`OnRequest` 下不静默升级，直接把拒绝结果回给模型（代码注释原文：
"Under `Never` or `OnRequest`, do not retry without sandbox; surface a concise
sandbox denial that preserves the original output."）。

是否需要审批的默认判定在 `core/src/tools/sandboxing.rs` 的
`default_exec_approval_requirement()`：`Never` → 不需要；`OnRequest`/`Granular`
→ 仅当文件系统沙箱是 Restricted（即命令可能越界）时才需要；`UnlessTrusted` →
总是需要。

**(c) OS 级沙箱。** 统一入口是 `codex-rs/sandboxing/` crate（`manager.rs`
按平台分派）：

- **macOS Seatbelt**：生成 `.sbpl` 策略后用 `/usr/bin/sandbox-exec` 包裹命令
  （`codex-rs/sandboxing/src/seatbelt.rs`；基线策略
  `seatbelt_base_policy.sbpl` 开头即 `(deny default)`，默认拒绝、按需放行，
  注释注明灵感来自 Chrome 的 sandbox 策略）。可写根目录、网络开关、
  受保护路径都被翻译成 Seatbelt 规则。
- **Linux Landlock + bubblewrap**：通过自调用的 `codex-linux-sandbox` helper
  落地（`codex-rs/sandboxing/src/landlock.rs`、`codex-rs/linux-sandbox/`），
  现代路径用 bubblewrap 建隔离挂载/网络命名空间，`--use-legacy-landlock`
  保留旧的纯 Landlock 路径。
- **Windows**：`codex-rs/windows-sandbox-rs/`（受限令牌 + 写授权目录），
  对应 `core/src/windows_sandbox.rs`。

**(d) 命令前缀规则引擎（execpolicy）。** 用户/管理员可以写
`prefix_rule(pattern=[...], decision="allow|prompt|forbid")` 规则，
`codex-rs/execpolicy/`（`policy.rs`、`parser.rs`、`decision.rs`）把 shell 命令
解析成 token 序列做前缀匹配，作为审批的自动裁决器；审批时用户选"以后都允许"
会生成 `ExecPolicyAmendment` 追加规则（`codex-rs/protocol/src/approvals.rs`）。

**(e) 补丁安全评估。** `apply_patch` 不经过 shell，有独立的安全检查
（`core/src/safety.rs`）：patch 写路径全部落在可写根内且平台沙箱可用时才
`AutoApprove`，否则 `AskUser` 或直接 `Reject`：

```rust
// codex-rs/core/src/safety.rs
pub enum SafetyCheck {
    AutoApprove,
    AskUser,
    Reject { reason: String },
}
// assess_patch_safety(): is_write_patch_constrained_to_writable_paths(...) → AutoApprove
```

**(f) 验证（测试）。** Harness **不内建测试执行**：跑不跑测试、怎么跑都由
基础提示词和 AGENTS.md 引导模型自行完成（"make it work, run the tests"类的
提示词约定）。治理侧另有可选的自动审查者：`approvals_reviewer = "auto_review"`
把审批请求路由给一个 reviewer agent（`core/src/guardian/`），把"人审"换成"模型审"。

## 7. 专题深挖

### 7.1 系统提示词原文（base instructions）

编译进二进制的基础指令是
`codex-rs/protocol/src/prompts/base_instructions/default.md`（275 行），由
`codex-rs/protocol/src/models.rs` 里的
`pub const BASE_INSTRUCTIONS_DEFAULT: &str = include_str!("prompts/base_instructions/default.md");`
嵌入；运行时以 developer 角色单独成消息注入（`core/src/context/base_instructions.rs`
的 `BaseInstructionsFragment`，`requires_separate_message() == true`）。
其章节结构依次是：

```
开头身份段（无标题）
# How you work / ## Personality          ← 人格与沟通风格
# AGENTS.md spec                          ← AGENTS.md 的作用域与优先级规则
## Responsiveness / ### Preamble messages ← 工具调用前先发 8–12 词预告
## Planning                               ← update_plan 用法 + 高/低质量计划正例反例
## Task execution                         ← 自主性要求 + 编码准则清单
## Validating your work                   ← 测试策略（含按审批模式区分主动性）
## Ambition vs. precision                 ← 新项目放手做 / 存量代码外科手术式
## Sharing progress updates
## Presenting your work and final message / ### Final answer structure
# Tool Guidelines / ## Shell commands / ## `update_plan`
```

身份段原文（开头）：

```markdown
<!-- codex-rs/protocol/src/prompts/base_instructions/default.md -->
You are a coding agent running in the Codex CLI, a terminal-based coding
assistant. Codex CLI is an open source project led by OpenAI. You are expected
to be precise, safe, and helpful.

Your capabilities:
- Receive user prompts and other context provided by the harness, such as files
  in the workspace.
- Communicate with the user by streaming thinking & responses, and by making &
  updating plans.
- Emit function calls to run terminal commands and apply patches. Depending on
  how this specific run is configured, you can request that these function calls
  be escalated to the user for approval before running. ...
```

`## Task execution` 开头体现了控制循环"跑到底"的提示词约定（与第 3 节
`run_turn` 的停止条件互为表里）：

```markdown
You are a coding agent. Please keep going until the query is completely
resolved, before ending your turn and yielding back to the user. Only terminate
your turn when you are sure that the problem is solved. ...
- Use the `apply_patch` tool to edit files (NEVER try `applypatch` or
  `apply-patch`, only `apply_patch`): ...
```

**注意：沙箱边界的说明并不在 default.md 里**。开头那句 "More on this in the
'Sandbox and approvals' section" 指向的内容是按当前配置**动态生成**的 developer
消息：模板在 `codex-rs/prompts/templates/permissions/sandbox_mode/*.md` 与
`.../approval_policy/*.md`，组装逻辑在
`codex-rs/prompts/src/permissions_instructions.rs`（`PermissionsInstructions`，
以 developer 角色注入上下文）。例如 `workspace-write` 模式模板原文：

```markdown
<!-- codex-rs/prompts/templates/permissions/sandbox_mode/workspace_write.md -->
Filesystem sandboxing defines which files can be read or written.
`sandbox_mode` is `workspace-write`: The sandbox permits reading files, and
editing files in `cwd` and `writable_roots`. Editing files in other directories
requires approval. Network access is {{ network_access }}.
```

`on-request` 审批模板还教会模型如何自救：沙箱拒绝后用
`sandbox_permissions = "require_escalated"` + `justification` 重新发起命令，
并可附带 `prefix_rule` 让用户持久化放行规则（含明确的禁止项：不得为 `rm`
等破坏性命令申请 prefix_rule、不得申请 `["python3"]` 这类过宽前缀）——
见 `codex-rs/prompts/templates/permissions/approval_policy/on_request.md`。

### 7.2 上下文压缩策略细节

**(a) 触发条件**（均在 `core/src/session/turn.rs`）：

1. **轮前预防性压缩** `run_pre_sampling_compact`（turn.rs，约 1033 行起）：
   `context_window_token_status()` 判定 `token_limit_reached`（即超过
   `model_auto_compact_token_limit` 或达到可用窗口上限）则先压缩再采样。
   阈值的计算在 `core/src/session/context_window.rs`：全窗口上限 =
   `context_window × effective_context_window_percent / 100`；压缩阈值按
   `model_auto_compact_token_limit_scope`（`Total` / `BodyAfterPrefix`）取
   config 覆盖值或模型自带的 `auto_compact_token_limit()`。
2. **模型切换触发**：comp_hash（压缩兼容哈希）变化 → `CompactionReason::
   CompHashChanged`；切换到更小窗口的模型且旧用量超限 → `ModelDownshift`，
   两者都用*上一个模型*的上下文先做压缩（`maybe_run_previous_model_inline_compact`）。
3. **轮中触发**：采样结束后发现 token 触顶 → `run_auto_compact`
   （turn.rs，约 474 行），压缩后 rollover 继续当前轮。
4. **手动**：用户 `/compact` → `CompactTask` → `run_compact_task`
   （`CompactionTrigger::Manual`）。

**(b) 实现分派**（`run_auto_compact`，turn.rs 约 1199 行起）：按优先级——
`TokenBudget` feature → `compact_token_budget.rs` 路径；provider 支持
`RemoteCompactionSupport::V2` 且开了 `RemoteCompactionV2` feature → 服务端 v2；
支持 V2 但没开 feature → 服务端 v1（`compact_remote.rs`）；否则 → 本地摘要
（`compact.rs`）。

**(c) 本地摘要压缩流程**（`core/src/compact.rs`，
`run_compact_task_inner_impl`）：克隆当前历史并追加压缩指令（默认
`SUMMARIZATION_PROMPT`，可被 config `compact_prompt` 覆盖），用一个**无工具的
Prompt** 让模型产出交接总结；若模型报 `ContextWindowExceeded`，则从头部逐条
删掉最老的历史项重试（"Trim from the beginning to preserve cache (prefix-based)
and keep recent messages intact"），普通错误按 `stream_max_retries` 退避重试。

**(d) 压缩后上下文如何重建**：新历史 =
`build_compacted_history(Vec::new(), &user_messages, &summary_text)`——

- **保留**：最近的**用户消息**（从最新往最旧挑选，总预算
  `COMPACT_USER_MESSAGE_MAX_TOKENS = 20_000` tokens，最早入选的一条可截断；
  过往的压缩摘要消息会被 `is_summary_message` 排除，不会套娃累积）；
  然后通过 `insert_initial_context_before_last_real_user_or_summary` 把当前世界状态
  （环境/权限/AGENTS.md 等初始上下文）**重新注入**到最后一条真实用户消息之前。
- **摘要**：`summary_text = SUMMARY_PREFIX + 模型压缩轮的最后一条 assistant 消息`，
  作为一条 user 消息放在历史末尾。`SUMMARY_PREFIX` 原文
  （`codex-rs/prompts/templates/compact/summary_prefix.md`）：

```markdown
Another language model started to solve this problem and produced a summary of
its thinking process. You also have access to the state of the tools that were
used by that language model. Use this to build on the work that has already been
done and avoid duplicating work. Here is the summary produced by the other
language model, use the information in this summary to assist with your own
analysis:
```

- **丢弃**：全部工具调用与输出、reasoning 项、中间的 assistant 消息。
  压缩完成事件会附带一条警告："Long threads and multiple compactions can
  cause the model to be less accurate..."。

**(e) 服务端压缩 v2**（`core/src/compact_remote_v2.rs`，1200+ 行）：
把历史分组（`compact_remote_history.rs` 的 `HistoryItemGroup`）发给
`/responses/compact` 端点，由服务端做压缩并返回压缩项；本地侧只保留
`should_keep_compacted_history_item()`（`compact_remote.rs`）允许的条目——
user/assistant/agent 消息和压缩项保留，**工具调用、工具输出、reasoning 全部丢弃**。
关键常量（文件注释说明是对齐服务端默认值的镜像）：

```rust
// codex-rs/core/src/compact_remote_v2.rs
// Mirror the current /responses/compact retained-message default while the
// server-side path remains the reference implementation.
pub(crate) const RETAINED_MESSAGE_TOKEN_BUDGET: usize = 64_000;
const MAX_RETAINED_AGENT_MESSAGE_TOKENS: i64 = 10_000;
// Compact attempts can run much longer than normal turns, so keep the per-transport
// retry budget smaller than the general Responses stream retry budget.
const MAX_REMOTE_COMPACTION_V2_STREAM_RETRIES: u64 = 2;
```

即服务端路径"保留近期消息原文（64k token 预算内）+ 更早部分压缩"，而不是本地
路径的"只留用户消息 + 一段摘要"。v2 目前是 feature flag（`RemoteCompactionV2`）
控制的实验路径，默认是否开启未确认。

### 7.3 Skill 加载策略

**Codex 有完整的 Agent Skills 机制**（SKILL.md 格式，与 Anthropic Agent Skills
同构），分两层实现：

- **`codex-rs/skills/`（crate `codex-skills`）**：发现与解析。
  扫描 skill 根目录下的 `SKILL.md`，解析 YAML frontmatter 成 `SkillMetadata`
  （`skills/src/model.rs`）：

```rust
// codex-rs/skills/src/model.rs
pub struct SkillMetadata {
    pub name: String,
    pub description: String,
    pub short_description: Option<String>,
    pub interface: Option<SkillInterface>,
    pub dependencies: Option<SkillDependencies>,
    pub policy: Option<SkillPolicy>,       // 含 allow_implicit_invocation
    /// Path to the SKILL.md file that declares this skill.
    pub path_to_skills_md: AbsolutePathBuf,
    pub scope: SkillScope,
    pub plugin_id: Option<String>,
    // ...
}
```

  另有两个内嵌示例 skill（`skills/src/assets/samples/` 下的 `imagegen` 与
  `openai-docs`）被 `include_dir!` 编译进二进制，首次启动安装到
  `CODEX_HOME/skills/.system`（`skills/src/lib.rs`，带指纹 marker 避免重复安装）。

- **`codex-rs/ext/skills/`（skills 扩展）**：目录渲染与注入。渐进式披露
  （progressive disclosure）是写进提示词的运行规则：

  - **常驻上下文的只有元数据**：`## Skills` / `### Available skills` 清单
    （每个 skill 一行：name + description + 路径/locator），以 developer 角色
    的上下文片段注入，包裹在 `SKILLS_INSTRUCTIONS_OPEN_TAG` 标签里
    （`ext/skills/src/fragments.rs` + `catalog_prompt.rs`）。
  - **触发方式三种**：用户显式 `$SkillName` 提及；提示词规则"任务明显匹配某
    skill 的 description 时本轮必须使用"；以及一个实验性的动态选择器
    （`ext/skills/src/dynamic_skill_selector/`，含 BM25、字符 n-gram 路由卡
    等多种检索打分实现——这部分明显还在做选路实验）。
  - **全文按需加载**：选中后由 `HostSkillsSnapshot::load_skill_prompts`
    （`ext/skills/src/host_prompt.rs`）读取 SKILL.md 全文，包成
    `SkillInstructions` 片段注入；plugin 来源的 skill 正文截断到
    `MAX_SKILL_PROMPT_BYTES = 8_000` 字节（`ext/skills/src/render.rs`）。
    模型也可以用内建的 `skills.list` / `skills.read` 工具（`ext/skills/src/tools/`）
    按需读取（read 支持 `next_cursor` 分页）。

  使用规范提示词原文节选（`ext/skills/src/catalog_prompt.rs` 中
  `SKILLS_HOW_TO_USE_WITH_HOST_ALIASES`）：

```text
- How to use a skill (progressive disclosure):
  1) After deciding to use a skill, the main agent must expand the listed short
     `path` with the matching alias from `### Skill roots`, then open and read
     its `SKILL.md` completely before taking task actions. ...
  3) If `SKILL.md` points to extra folders such as `references/`, use its
     routing instructions to identify the files required for the task. The main
     agent must read each required instruction or reference file itself before
     acting on it. Do not delegate reading, summarizing, or interpreting skill
     instructions to a subagent. ...
- Context hygiene:
  - Progressive disclosure applies to selecting relevant files, not partially
    reading a selected instruction file. Do not load unrelated references,
    scripts, or assets.
```

### 7.4 长期记忆管理策略

**Codex 有一套跨会话记忆流水线**（较新/实验性质，默认开启状态未确认），
设计文档即 `codex-rs/memories/README.md`，读写路径分别在
`codex-rs/memories/read` 与 `codex-rs/memories/write` 两个 crate，运行时编排已迁移到
`codex-rs/ext/memories/` 扩展（README 仍写"编排在 `core/src/memories/`"，该目录在
当前 main 上已不存在——README 此处已过时）。架构是
**启动时后台运行的两阶段流水线**（触发条件：非 ephemeral 会话、feature 开启、
非子 agent、state DB 可用）：

- **Phase 1 — rollout 抽取（每线程并行）**：从 state DB 认领近期符合条件的
  rollout（交互来源、年龄窗口内、空闲足够久），过滤出记忆相关的 response items，
  发给模型生成结构化输出（详细 `raw_memory` + 紧凑 `rollout_summary` + 可选 slug），
  脱敏密钥后写回 state DB；任务带租约/退避，防并发重复。
- **Phase 2 — 全局整合（全局锁串行）**：按 `usage_count` / `last_usage`
  选出 top-N stage-1 输出，把 `raw_memories.md` 与 `rollout_summaries/` 同步到
  `~/.codex/memories/`（该目录本身是 git 基线目录），算出
  `phase2_workspace_diff.md`，然后**派一个无审批、无网络、仅本地写、禁止再派
  子任务的整合子 agent**，产出/更新 `MEMORY.md`、`memory_summary.md` 和
  记忆派生的 `skills/`。两个阶段的提示词分别在
  `memories/write/templates/memories/stage_one_system.md`（569 行）与
  `consolidation.md`（880 行）。Phase 1 提示词开头：

```markdown
<!-- codex-rs/memories/write/templates/memories/stage_one_system.md -->
## Memory Writing Agent: Phase 1 (Single Rollout)

Your job: convert raw agent rollouts into useful raw memories and rollout summaries.

The goal is to help future agents:
- deeply understand the user without requiring repetitive instructions from the user,
- solve similar tasks with fewer tool calls and fewer reasoning tokens,
- reuse proven workflows and verification checklists,
- avoid known landmines and failure modes, ...
```

- **读路径（注入位置）**：`ext/memories/templates/memories/read_path.md`
  模板把 `memory_summary.md` 内容直接嵌进一段 developer 指令（`## Memory`），
  并规定"快速记忆检索流程"：先看摘要提取关键词 → 搜 `MEMORY.md` → 必要时再开
  1–2 个 `rollout_summaries/` 文件，预算 ≤4–6 次搜索。检索通过 `memories`
  命名空间下的内建工具进行（`memories.list` / `memories.read` /
  `memories.search` / `memories.add_ad_hoc_note`，见 `ext/memories/src/lib.rs`
  与 `tools/`；read 默认上限 `DEFAULT_READ_MAX_TOKENS = 20_000`）。
  用完记忆必须在最终回复末尾附 `<oai-mem-citation>` 引用块
  （供程序解析与使用率统计）。
  记忆**只能由用户显式要求更新**，且模型不直接改记忆文件，只往
  `extensions/ad_hoc/notes/` 写一个小的更新便签，由流水线整合。

**rollout/resume 的事实记忆职能**：会话*内*的"记忆"完全由 rollout JSONL 承担
（resume/fork 时逐条重建历史，等于无损回放）；跨会话*显式*记忆由上述 memories
流水线承担；此外 `~/.codex/AGENTS.md`（全局层）是最原始的"手写长期记忆"。
也就是说 Codex 的记忆是分三层的：AGENTS.md（人工写）、memories 流水线
（模型自动从 rollout 提炼，文件化存储 + git 基线）、rollout 本身（原始证据，
`rollout_summaries/` 里的指针还能回链到原始 rollout 文件）。

## 8. 小结：Codex Harness 的设计特点

**做厚的部分：**

- **治理（V）最厚**。三层防线（审批策略、execpolicy 前缀规则、OS 级沙箱）
  全部在 harness 内强制执行，不依赖模型自觉；每个平台都有原生实现
  （Seatbelt / bwrap+Landlock / Windows 受限令牌），沙箱拒绝还反过来成为
  给模型的观察信号（denial → 回报给模型或触发审批）。
- **状态与持久化（S）厚**。Rollout JSONL 是一等公民：append-only、按日期归档、
  带 actor 化异步写入与失败恢复，直接支撑 resume / fork / revert / 复盘，
  等于把"轨迹记录"做成了系统的基础设施而非附属日志。
- **上下文管理（C）中等偏厚且仍在加码**。有专门的世界状态差分注入系统
  （`context/world_state/`）、可配置上限的 AGENTS.md 链式加载、本地摘要压缩 +
  服务端压缩双路径（四种压缩实现按 feature/provider 分派，见 7.2）。
- **能力封装与记忆是新投入方向**。Skills（SKILL.md + 渐进式披露 + 动态选路
  实验，见 7.3）与跨会话记忆流水线（rollout 提炼 → 文件化 MEMORY.md，见 7.4）
  都是近期新增且明显在快速演进，值得持续跟踪。

**做薄的部分：**

- **观察接口（I_obs）薄**。终端输出基本是"哑"文本 + head/tail 截断，
  没有结构化语义观察；环境信号压缩成一小段 XML。Codex 把观察的复杂度
  让渡给了模型（模型自己决定再跑什么命令来看）。
- **控制循环（L）刻意简单**。核心就是 `run_turn` 里一个
  "采样→并发执行工具→追加结果→再采样"的流式循环，停止条件朴素
  （无工具调用且无排队输入即停）；没有内建的规划器、反思器或预算控制器，
  连子 agent 都是通过工具（multi_agents handlers）外挂的。
- **验证（V 中的"测试"半边）薄**。Harness 从不主动跑测试或做静态检查，
  正确性验证完全委托给提示词约定和模型行为。

总体判断：Codex 的设计哲学是"**harness 负责约束与记录，模型负责观察与决策**"。
凡是与安全边界、可恢复性相关的职责（V、S）都在 harness 里做深做硬；
凡是与认知相关的职责（看什么、下一步做什么、做得对不对）都尽量留薄，
通过提示词和工具定义引导模型完成。这与它默认 `workspace-write + on-request`
的产品姿态一致：用强制沙箱换取尽量少的打扰，用完整 rollout 换取可审计与可恢复。
