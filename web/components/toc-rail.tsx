'use client'

/**
 * 页面最左侧的整体目录条：竖排圆点 + 悬浮展开标签。
 * 悬浮时像 macOS 程序坞一样，按鼠标距离对附近圆点做递减放大；
 * 滚动时高亮「顶部越过视口中线」的当前章节，点击平滑跳转。
 * 目录项顺序与 app/page.tsx 中各 section 的出现顺序保持一致。
 */
import { useEffect, useRef, useState } from 'react'

const TOC_ITEMS = [
  { id: 'overview', label: '首页' },
  { id: 'timeline', label: 'AI 发展脉络' },
  { id: 'skill-questions', label: 'Harness × Skill' },
  { id: 'harness-duty', label: 'Harness 的职责' },
  { id: 'skill-traits', label: 'Skill 特性' },
  { id: 'skill-vs-prompt', label: 'Skill vs Prompt' },
  { id: 'harness', label: '四层架构' },
  { id: 'skill-asset', label: 'Skill 即资产' },
  { id: 'se-questions', label: '自进化之问' },
  { id: 'se-what', label: 'T+1 的问题' },
  { id: 'se-vs-reflection', label: '自进化 vs 人工进化' },
  { id: 'se-reward-driven', label: '奖励信号驱动' },
  { id: 'se-expert-driven', label: '专家知识驱动' },
  { id: 'se-layers', label: '进化的五层' },
  { id: 'se-hermes', label: 'Hermes 实例' },
  { id: 'cordis', label: 'Cordis 时空可组合' },
  { id: 'purity', label: '上下文纯净' },
  { id: 'design-harness-assets', label: 'DesignHarness 资产' },
  { id: 'chart-evolution', label: '图表场景自进化' },
  { id: 'trajectory-augmentation', label: '轨迹数据增广' },
  { id: 'cot-sft-augmentation', label: 'CoT SFT 增广' },
  { id: 'industry-augmentation-pipeline', label: '大厂数据流水线' },
  { id: 'augmentation-quality-gates', label: '增广质量门禁' },
  { id: 'delivery-models', label: '多种落地方式' },
  { id: 'se-flywheel', label: '经验飞轮' },
  { id: 'data-flywheel', label: '数据飞轮' },
  { id: 'self-evolution', label: 'Codex 自进化' },
] as const

/** 程序坞放大参数：影响半径与最大放大倍数 */
const DOCK_RANGE = 90
const DOCK_MAX_SCALE = 2.4

/** 距鼠标 dist px 的圆点的放大倍率（余弦衰减，越远越接近 1） */
function dockScale(dist: number): number {
  const t = Math.min(Math.abs(dist) / DOCK_RANGE, 1)
  return 1 + (DOCK_MAX_SCALE - 1) * Math.cos((t * Math.PI) / 2)
}

export function TocRail() {
  const [activeId, setActiveId] = useState<string>(TOC_ITEMS[0].id)
  // 鼠标在目录条内的 clientY；离开后置 null，圆点恢复常态
  const [mouseY, setMouseY] = useState<number | null>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    // 取「顶部越过视口中线」的最后一个 section 作为当前章节，
    // 直接读布局，不依赖 IO 的增量回调顺序（后台标签页里 IO 会被节流）
    const update = () => {
      const mid = window.innerHeight * 0.5
      let current: string = TOC_ITEMS[0].id
      for (const item of TOC_ITEMS) {
        const el = document.getElementById(item.id)
        if (el && el.getBoundingClientRect().top <= mid) current = item.id
      }
      setActiveId(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const jump = (id: string) => {
    if (id === TOC_ITEMS[0].id) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  // 每个圆点相对鼠标的距离；最近的一项就是程序坞里“被点起来”的那颗
  const distances = TOC_ITEMS.map((_, i) => {
    if (mouseY == null) return null
    const el = itemRefs.current[i]
    if (!el) return null
    const rect = el.getBoundingClientRect()
    return mouseY - (rect.top + rect.height / 2)
  })
  let hoverIndex = -1
  if (mouseY != null) {
    let bestDist = Infinity
    distances.forEach((d, i) => {
      if (d != null && Math.abs(d) < bestDist) {
        bestDist = Math.abs(d)
        hoverIndex = i
      }
    })
  }

  return (
    <nav
      aria-label="页面目录"
      className="fixed top-1/2 left-2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ul
        className="flex flex-col gap-2.5 rounded-full border border-white/70 bg-white/50 px-2 py-3 shadow-[0_10px_30px_-15px_rgba(60,80,160,0.35)] backdrop-blur"
        onMouseMove={(e) => setMouseY(e.clientY)}
        onMouseLeave={() => setMouseY(null)}
      >
        {TOC_ITEMS.map((item, i) => {
          const active = item.id === activeId
          const d = distances[i]
          const scale = d == null ? 1 : dockScale(d)
          const showLabel = active || i === hoverIndex
          return (
            <li
              key={item.id}
              ref={(el) => {
                itemRefs.current[i] = el
              }}
              className="relative flex justify-center"
            >
              <button
                type="button"
                onClick={() => jump(item.id)}
                aria-label={item.label}
                aria-current={active ? 'true' : undefined}
                className="flex items-center py-0.5"
              >
                <span
                  style={{ transform: `scale(${scale.toFixed(3)})` }}
                  className={`block origin-left rounded-full transition-transform duration-100 ease-out ${
                    active
                      ? 'size-2.5 bg-indigo-500 shadow-sm shadow-indigo-400/50'
                      : i === hoverIndex
                        ? 'size-1.5 bg-indigo-400'
                        : 'size-1.5 bg-slate-300'
                  }`}
                />
                {/* 悬浮最近项/激活项展开的章节标签 */}
                <span
                  className={`absolute top-1/2 left-6 -translate-y-1/2 rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap backdrop-blur transition-all duration-200 ${
                    showLabel
                      ? active
                        ? 'translate-x-0 border-indigo-200/70 bg-white/90 text-indigo-600 opacity-100'
                        : 'translate-x-0 border-white/70 bg-white/90 text-slate-600 opacity-100'
                      : 'translate-x-1 border-white/70 bg-white/90 text-slate-600 opacity-0'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
