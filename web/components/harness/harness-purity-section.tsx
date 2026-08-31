/**
 * 「纯净」对比页：DeepSeek Harness 极简模式的上下文纯净度，
 * 对照 Codex CLI / Claude Code / OpenCode 三家常见 Harness。
 * 左侧：DeepSeek 极简模式的全部上下文（一句话系统提示词 + 两个工具）；
 * 右侧：三家的系统提示词量级、工具数与额外注入项（调研来源见 DESIGN.md）。
 */

const DEEPSEEK_TOOLS = [
  {
    name: 'bash',
    desc: 'Run commands in a bash shell',
    notes: [
      'command 参数内容无需 XML 转义',
      '无法访问互联网；可通过 apt / pip 使用常见 Linux 与 Python 包的镜像',
      '状态在多次命令调用和用户对话之间持续保持',
      '查看文件指定行范围：sed -n 10,25p /path/to/file',
      '避免产生大量输出的命令；长驻命令放后台运行（sleep 10 &）',
    ],
    schema: '{ command: string /* 要执行的 bash 命令，优先相对路径 */ }',
  },
  {
    name: 'str_replace_editor',
    desc: 'Custom editing tool for viewing, creating and editing files',
    notes: [
      'view：文件按 cat -n 显示；目录列出 2 层非隐藏文件',
      'create：目标 path 已存在时不可使用',
      '输出过长时截断并标记 <response clipped>',
      'old_str 必须精确匹配原文连续行（注意空白），且不唯一时不执行替换',
      'new_str 为替换 old_str 的新内容',
    ],
    schema: '{ command: "view" | "create" | "str_replace" | …, path, old_str?, new_str? }',
  },
] as const

const OTHER_HARNESSES = [
  {
    name: 'Codex CLI',
    prompt: '275 行 / ≈21 KB / ≈5k tokens',
    promptNote: '另有按沙箱配置动态生成的第二条权限说明消息',
    tools: '基线 4–6 个，开启 MCP / Skills / 子 Agent 后 10+',
    injects: [
      '环境 XML：cwd、shell、逐条文件权限与网络域名白/黑名单',
      'AGENTS.md 从项目根到 cwd 链式拼接（上限 32 KiB）',
      'Skills 目录清单 + 跨会话记忆摘要常驻',
    ],
  },
  {
    name: 'Claude Code',
    prompt: '首请求合计 38K–119K tokens（随版本上涨）',
    promptNote: '系统提示词分段组装，官方不公开、逐版本变动',
    tools: '≈27 个内置工具 + 无上限的 MCP 工具',
    injects: [
      'CLAUDE.md 四级分层拼接 + @import 递归导入',
      'MEMORY.md 自动记忆 + 每个 Skill 的元数据常驻',
      'Subagent 描述、MCP 指令、hooks 注入的 system-reminder',
    ],
  },
  {
    name: 'OpenCode',
    prompt: '按厂商维护 9 套提示词，7.4–15.4 KB / 套',
    promptNote: 'gemini 版最长，含安全规则与 few-shot 示例',
    tools: '默认 12–14 个，另有实验性 LSP 工具',
    injects: [
      'env 块 + AGENTS.md / CLAUDE.md 多层规则文件',
      'Skills 列表 + MCP instructions + 子 Agent 描述',
      '每次改文件后，LSP 诊断自动回灌进 tool result',
    ],
  },
] as const

export function HarnessPuritySection() {
  return (
    <section
      id="purity"
      aria-labelledby="purity-title"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 sm:py-32"
    >
      <header>
        <p className="text-xs font-semibold tracking-[0.18em] text-indigo-600 uppercase">
          Context Purity
        </p>
        <h2
          id="purity-title"
          className="mt-4 bg-gradient-to-br from-slate-950 via-slate-800 to-indigo-900 bg-clip-text text-4xl font-bold tracking-tighter text-transparent lg:text-5xl"
        >
          纯净：DeepSeek Harness 的另一大优势
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
          跟几个常见的 Harness 对比上下文纯净度，DeepSeek Harness
          是断档领先的——它不是「在厚重基线上做减法」，而是从源头就不膨胀。
        </p>
      </header>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-2 lg:gap-10">
        {/* 左：DeepSeek 极简模式的全部上下文 */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-indigo-200/70 bg-indigo-50/50 p-6 backdrop-blur-sm">
            <p className="text-xs font-semibold tracking-wide text-indigo-500 uppercase">
              极简模式 · 系统提示词全文
            </p>
            <blockquote className="mt-3 border-l-2 border-indigo-300 pl-4 font-mono text-sm leading-relaxed text-slate-800">
              “You are a helpful software engineer assistant.”
            </blockquote>
            <p className="mt-3 text-xs text-slate-500">
              就这一句话。没有行为准则、没有排版规范、没有工具使用说明。
            </p>
          </div>

          {DEEPSEEK_TOOLS.map((tool) => (
            <div
              key={tool.name}
              className="rounded-2xl border border-slate-200/80 bg-white/55 p-5 backdrop-blur-sm"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-mono text-sm font-bold tracking-tight text-slate-900">
                  {tool.name}
                </h3>
                <span className="text-[11px] font-medium text-slate-400">
                  {tool.desc}
                </span>
              </div>
              <ul className="mt-3 space-y-1.5">
                {tool.notes.map((note) => (
                  <li
                    key={note}
                    className="flex gap-2 text-xs leading-5 text-slate-500"
                  >
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-indigo-300" />
                    {note}
                  </li>
                ))}
              </ul>
              <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950/90 px-3.5 py-2.5 font-mono text-[11px] leading-5 text-slate-300">
                {tool.schema}
              </pre>
            </div>
          ))}

          <p className="px-1 text-center text-xs font-medium text-indigo-500">
            以上，就是模型能看到的全部——1 句话系统提示词 + 2 个工具。
          </p>
        </div>

        {/* 右：三家常见 Harness 的上下文组成 */}
        <div className="space-y-4">
          {OTHER_HARNESSES.map((h) => (
            <div
              key={h.name}
              className="rounded-2xl border border-slate-200/80 bg-white/55 p-5 backdrop-blur-sm"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className="text-sm font-bold tracking-tight text-slate-900">
                  {h.name}
                </h3>
                <span className="font-mono text-[11px] font-semibold text-rose-500">
                  {h.prompt}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">{h.promptNote}</p>
              <p className="mt-3 text-xs leading-5 text-slate-600">
                <span className="font-semibold text-slate-700">工具：</span>
                {h.tools}
              </p>
              <ul className="mt-2 space-y-1.5">
                {h.injects.map((inj) => (
                  <li
                    key={inj}
                    className="flex gap-2 text-xs leading-5 text-slate-500"
                  >
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-slate-300" />
                    {inj}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <p className="rounded-2xl border border-slate-200/80 bg-white/40 p-4 text-xs leading-5 text-slate-500 backdrop-blur-sm">
            公平地说，三家都有精细的上下文工程——增量注入、渐进披露、历史压缩——但这些是「管理膨胀」的机制；DeepSeek
            Harness 是「从源头不膨胀」。
          </p>
        </div>
      </div>
    </section>
  )
}
