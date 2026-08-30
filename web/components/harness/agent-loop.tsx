'use client'

/**
 * Agent 闭环模拟器：五个节点（Perception / Reasoning / Action / Observation /
 * Reflection）围成一个环。鼠标悬浮到环上自动播放，每一步推进一个节点；
 * 移开暂停；点一下单步推进（触屏兜底）。模拟的任务是「做一个 App」：
 * 找素材 → 前端编码 → 联调收尾，跑完三轮自动停在「任务完成」。
 * 改任务脚本就改 ROUNDS：每轮 5 条，对应环上 5 个节点的内容。
 */
import { useEffect, useState } from 'react'

const NODE_META = [
  { name: '理解目标', en: 'Perception' },
  { name: '规划任务', en: 'Reasoning' },
  { name: '调用工具', en: 'Action' },
  { name: '检查结果', en: 'Observation' },
  { name: '重新规划', en: 'Reflection' },
] as const

interface LoopStep {
  /** 环上节点下方的小字 */
  caption: string
  /** 环中心的当前步骤详情 */
  detail: string
}

interface LoopRound {
  /** 阶段名，如「第 1 轮 · 找素材」 */
  label: string
  steps: LoopStep[]
}

const ROUNDS: LoopRound[] = [
  {
    label: '第 1 轮 · 找素材',
    steps: [
      { caption: '明确目标：做 App 首页原型', detail: '理解目标：做一个待办 App 的首页原型，先要搞清楚长什么样。' },
      { caption: '拆解：素材 → 布局 → 编码', detail: '规划任务：先找参考素材，再定布局，最后写前端代码。' },
      { caption: '找图标、配色与参考图', detail: '调用工具：搜集图标、配色方案和几款同类 App 的截图作参考。' },
      { caption: '素材风格统一吗？', detail: '检查结果：图标风格不统一，还缺一张空状态插图。' },
      { caption: '补齐素材，改成卡片流', detail: '重新规划：替换不统一的图标，布局方案从列表改成卡片流，进入下一轮。' },
    ],
  },
  {
    label: '第 2 轮 · 前端编码',
    steps: [
      { caption: '本轮目标：实现首页 UI', detail: '理解目标：素材齐了，这一轮把首页界面写出来。' },
      { caption: '规划组件拆分', detail: '规划任务：拆成 Header、CardList、Footer 三个组件，逐个实现。' },
      { caption: '写三个组件的代码', detail: '调用工具：开始前端编码，依次实现三个组件。' },
      { caption: '编译报错：类型不匹配', detail: '检查结果：编译失败——CardList 的 props 类型不匹配。' },
      { caption: '修复类型，编译通过 ✓', detail: '重新规划：修正 props 类型定义，重新编译通过，进入联调。' },
    ],
  },
  {
    label: '第 3 轮 · 联调收尾',
    steps: [
      { caption: '目标：可交互、可演示', detail: '理解目标：页面能跑起来还不够，要能交互、能演示。' },
      { caption: '规划：接数据 → 自测', detail: '规划任务：接入 mock 数据，加上交互状态，然后完整自测一遍。' },
      { caption: '接入 mock 数据并运行', detail: '调用工具：接上 mock 数据，启动 dev server 实际运行。' },
      { caption: '自测：移动端卡片溢出', detail: '检查结果：桌面端正常，但移动端卡片溢出屏幕。' },
      { caption: '加响应式断点，回归通过 ✓', detail: '重新规划：补上响应式断点，回归验证通过——目标完成！' },
    ],
  },
]

/** 节点在环上的位置：从正上方开始，顺时针每 72° 一个 */
const RADIUS = 38
function posFor(i: number) {
  const a = ((-90 + i * 72) * Math.PI) / 180
  return { x: 50 + RADIUS * Math.cos(a), y: 50 + RADIUS * Math.sin(a) }
}

/** 全部步数（轮 × 5）；idx 拉平成一维后推进逻辑更简单 */
const TOTAL_STEPS = ROUNDS.length * 5
/** 自动播放节奏：每一步的停留毫秒数 */
const AUTOPLAY_MS = 1800

export function AgentLoop() {
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(false)

  const done = idx >= TOTAL_STEPS
  const round = Math.min(Math.floor(idx / 5), ROUNDS.length - 1)
  const step = idx % 5
  const current = ROUNDS[round].steps[step]

  // 悬浮期间按节奏自动推进；跑完即停
  useEffect(() => {
    if (!playing || done) return
    const timer = setInterval(() => setIdx((i) => Math.min(i + 1, TOTAL_STEPS)), AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [playing, done])

  const handleEnter = () => {
    // 已经跑完的任务，再次悬浮时从头重播
    if (done) setIdx(0)
    setPlaying(true)
  }

  return (
    <div className="flex flex-col items-center gap-5 md:col-start-1 md:row-start-2">
      {/* 闭环：SVG 虚线环 + 5 个节点；悬浮自动播放，点击单步推进 */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Agent 闭环模拟器：悬浮自动播放，点击单步推进"
        className="relative aspect-square w-full max-w-md cursor-pointer"
        onMouseEnter={handleEnter}
        onMouseLeave={() => setPlaying(false)}
        onClick={() => setIdx((i) => (i >= TOTAL_STEPS ? 0 : i + 1))}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIdx((i) => (i >= TOTAL_STEPS ? 0 : i + 1))
          }
        }}
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden="true">
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            strokeWidth="0.6"
            strokeDasharray="2.5 2"
            className="stroke-slate-300"
          />
          {/* 节点之间的方向箭头（顺时针） */}
          {NODE_META.map((_, i) => {
            const midAngle = -90 + i * 72 + 36
            const a = (midAngle * Math.PI) / 180
            const x = 50 + RADIUS * Math.cos(a)
            const y = 50 + RADIUS * Math.sin(a)
            return (
              <polygon
                key={i}
                points="0,-1.2 2.4,0 0,1.2"
                transform={`translate(${x} ${y}) rotate(${midAngle + 90})`}
                className="fill-slate-300"
              />
            )
          })}
        </svg>

        {NODE_META.map((meta, i) => {
          const { x, y } = posFor(i)
          const active = !done && i === step
          const passed = done || i < step
          return (
            <div
              key={meta.en}
              className="absolute flex w-24 flex-col items-center gap-1 text-center sm:w-28"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <span
                className={`flex size-9 items-center justify-center rounded-full border font-mono text-[11px] font-semibold transition-all duration-300 sm:size-10 ${
                  active
                    ? 'scale-110 border-indigo-500 bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                    : passed
                      ? 'border-indigo-200 bg-indigo-50 text-indigo-500'
                      : 'border-slate-200 bg-white/70 text-slate-400'
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`text-xs font-bold tracking-tight transition-colors duration-300 ${
                  active ? 'text-indigo-600' : 'text-slate-700'
                }`}
              >
                {meta.name}
              </span>
              {/* 节点内容随任务阶段更新 */}
              <span
                key={`${round}-${i}`}
                className="stage-switch text-[10px] leading-tight text-pretty text-slate-400"
              >
                {ROUNDS[round].steps[i].caption}
              </span>
            </div>
          )
        })}

        {/* 环中心：当前阶段 + 正在做什么 */}
        <div className="absolute top-1/2 left-1/2 flex w-[54%] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 text-center">
          <span className="rounded-full border border-indigo-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-indigo-500 backdrop-blur">
            {done ? '任务完成' : `${ROUNDS[round].label} · ${NODE_META[step].name}`}
          </span>
          <p
            key={`${idx}-${done}`}
            className="stage-switch text-[13px] leading-relaxed text-pretty text-slate-600 sm:text-sm"
          >
            {done ? '首页原型可以演示了。Agent 就是这样：不断循环，直到目标完成。' : current.detail}
          </p>
        </div>
      </div>

      <p className="text-[11px] text-slate-400">悬浮自动播放 · 点击单步推进</p>
    </div>
  )
}
