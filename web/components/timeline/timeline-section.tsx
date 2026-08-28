import {
  ChevronDown,
  Code2,
  ExternalLink,
  Lightbulb,
  Newspaper,
  Rocket,
  ScrollText,
} from 'lucide-react'
import { ScrollFocus } from './scroll-focus'
import { StageHeader } from './stage-header'
import {
  EVENT_TYPE_LABEL,
  EVENTS,
  THEME_META,
  stageOf,
  type EventType,
  type TimelineEvent,
} from './timeline-data'

const TYPE_ICON: Record<EventType, typeof ScrollText> = {
  paper: ScrollText,
  product: Rocket,
  'open-source': Code2,
  concept: Lightbulb,
  event: Newspaper,
}

const TYPE_BADGE: Record<EventType, string> = {
  paper: 'bg-indigo-100/80 text-indigo-600',
  product: 'bg-sky-100/80 text-sky-600',
  'open-source': 'bg-emerald-100/80 text-emerald-600',
  concept: 'bg-amber-100/80 text-amber-600',
  event: 'bg-rose-100/80 text-rose-600',
}

function formatDate(date: string) {
  const [y, m] = date.split('-')
  return `${y}.${m}`
}

/** 里程碑卡片：照片墙大相框，加重呈现关键节点 */
function MilestoneCard({ event, index }: { event: TimelineEvent; index: number }) {
  const Icon = TYPE_ICON[event.type]
  const tilt = index % 2 === 0 ? '-rotate-[0.5deg]' : 'rotate-[0.6deg]'
  return (
    <article
      className={`group rounded-2xl border border-indigo-100 bg-white p-2.5 pb-4 shadow-[0_24px_50px_-18px_rgba(60,80,160,0.45)] ring-1 ring-indigo-50 transition-transform duration-300 hover:rotate-0 hover:scale-[1.015] ${tilt}`}
    >
      {/* 相框内页 */}
      <div className="rounded-xl border border-indigo-100/70 bg-gradient-to-br from-indigo-50/90 via-white to-sky-50/80 px-5 py-4">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${TYPE_BADGE[event.type]}`}
          >
            <Icon className="size-3" />
            {EVENT_TYPE_LABEL[event.type]}
          </span>
          <span className="text-[11px] text-slate-400">
            {THEME_META[event.theme].keyword}
          </span>
          <span className="font-mono text-xs font-semibold tracking-wider text-indigo-500">
            {formatDate(event.date)}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400">
            ◆ 关键节点
          </span>
          <a
            href={event.source}
            target="_blank"
            rel="noreferrer"
            className="ml-auto inline-flex items-center gap-1 text-xs text-indigo-400 transition-colors hover:text-indigo-600"
          >
            {event.type === 'paper' ? '论文' : '来源'}
            <ExternalLink className="size-3" />
          </a>
        </div>
        <h3 className="mt-2.5 text-xl font-bold tracking-tight text-slate-900">
          {event.title}
        </h3>
        {/* 配图：相框里的「照片」，点击跳转来源 */}
        {event.image && (
          <a
            href={event.source}
            target="_blank"
            rel="noreferrer"
            className="mt-3.5 block overflow-hidden rounded-lg border border-slate-200/70 bg-white"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.image}
              alt={event.title}
              className="max-h-60 w-full object-contain transition-transform duration-300 hover:scale-[1.02]"
            />
          </a>
        )}
      </div>
      {/* 相框底部说明 */}
      <p className="px-2.5 pt-3 text-sm leading-relaxed text-slate-600">
        {event.description}
      </p>
    </article>
  )
}

/** 次要事件：紧凑轻量的小卡片，作为脉络的上下文铺垫 */
function CompactCard({ event }: { event: TimelineEvent }) {
  const Icon = TYPE_ICON[event.type]
  return (
    <article className="group rounded-xl border border-white/80 bg-white/70 px-4 py-3 shadow-sm shadow-slate-300/20 backdrop-blur-sm transition-colors hover:bg-white">
      <div className="flex items-center gap-2 text-[11px] text-slate-400">
        <Icon className="size-3" />
        <span>{EVENT_TYPE_LABEL[event.type]}</span>
        <span className="font-mono tracking-wider">{formatDate(event.date)}</span>
        <a
          href={event.source}
          target="_blank"
          rel="noreferrer"
          className="ml-auto inline-flex items-center gap-1 opacity-0 transition-opacity hover:text-indigo-500 group-hover:opacity-100"
        >
          来源
          <ExternalLink className="size-3" />
        </a>
      </div>
      <h3 className="mt-1.5 text-[15px] font-semibold tracking-tight text-slate-700">
        {event.title}
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-400">
        {event.description}
      </p>
    </article>
  )
}

/** 首页向下滚动进入的「AI 发展脉络」时间线段落 */
export function TimelineSection() {
  return (
    <ScrollFocus>
      <div id="timeline" className="mx-auto w-full max-w-4xl scroll-mt-4 px-6">
        {/* 段落引子 */}
        <div className="flex flex-col items-start gap-6 pt-28 pb-24">
          <p className="rounded-full border border-indigo-200/70 bg-white/60 px-4 py-1.5 text-xs font-medium tracking-wide text-indigo-600 backdrop-blur">
            AI Evolution · 2020 — 2026
          </p>
          <h2 className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-5xl font-bold tracking-tighter text-transparent sm:text-6xl">
            从提示词，
            <br />
            到上下文，到 Harness
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-slate-600">
            三个概念呈现清晰的递进关系，对应 AI 应用从「会说话」到「有信息」再到「有环境」的三个阶段：
            2022 年教 AI 说话，2024 年给 AI 信息，2026 年给 AI 建环境。
            它们不是互相取代，而是层层递进、研究范围不断向外扩展。
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ChevronDown className="size-4 animate-bounce" />
            继续滚动
          </div>
        </div>

        {/* 吸顶主题条：随滚动切换当前阶段 */}
        <StageHeader />

        {/* 全量事件流：严格按时间顺序 */}
        <div className="relative pb-28">
          {/* 时间轴竖线 */}
          <div className="absolute top-2 bottom-6 left-[98px] w-[3px] rounded-full bg-gradient-to-b from-slate-300/20 via-slate-400/70 to-slate-300/20" />
          {EVENTS.map((event, i) => (
            <div
              key={`${event.date}-${event.title}`}
              data-fade-row
              data-stage={stageOf(event.date)}
              className="relative flex"
            >
              {/* 左：日期 + 节点 */}
              <div className="relative w-28 shrink-0">
                <span
                  className={`absolute top-7 right-6 font-mono text-xs tracking-wider ${
                    event.milestone ? 'font-bold text-indigo-500' : 'text-slate-400'
                  }`}
                >
                  {formatDate(event.date)}
                </span>
                <span
                  className={`absolute rounded-full border-2 border-white ${
                    event.milestone
                      ? 'top-[35px] right-[4px] size-4 bg-indigo-500 shadow-md shadow-indigo-400/50'
                      : 'top-[38px] right-[7px] size-2.5 bg-indigo-300 shadow-sm shadow-indigo-300/60'
                  }`}
                />
              </div>
              {/* 中：事件卡片 */}
              <div className={`relative flex-1 pl-10 ${event.milestone ? 'pb-14' : 'pb-6'}`}>
                <span className={`absolute top-[42px] left-0 h-px w-10 ${event.milestone ? 'bg-indigo-300' : 'bg-indigo-200/70'}`} />
                {event.milestone ? (
                  <MilestoneCard event={event} index={i} />
                ) : (
                  <CompactCard event={event} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 结尾 */}
        <div data-fade-row className="pb-32 text-center">
          <p className="text-sm text-slate-400">
            脉络仍在生长——下一站，模型与 Harness 的协同进化。
          </p>
        </div>
      </div>
    </ScrollFocus>
  )
}
