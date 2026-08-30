import Image from 'next/image'
import { AgentLoop } from './agent-loop'

/**
 * 「Harness 的职责是什么」：左侧是可交互的 Agent 闭环模拟器（点「下一步」
 * 跟着一个「做 App」任务逐节点推进），右侧配一张闭环示意图。
 */
export function HarnessDutySection() {
  return (
    <section
      id="harness-duty"
      aria-labelledby="harness-duty-title"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 sm:py-32"
    >
      <div className="grid items-start gap-y-8 md:grid-cols-2 md:gap-x-10 lg:gap-x-16">
        <header className="md:col-start-1 md:row-start-1">
          <p className="text-xs font-semibold tracking-[0.18em] text-indigo-600 uppercase">
            The Agent Loop
          </p>
          <h2
            id="harness-duty-title"
            className="mt-4 bg-gradient-to-br from-slate-950 via-slate-800 to-indigo-900 bg-clip-text text-4xl font-bold tracking-tighter text-transparent lg:text-5xl"
          >
            Harness 的职责是什么？
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            Agent 不是「调用一次工具」，而是一个闭环执行系统：理解目标、规划任务、
            调用工具、检查结果、重新规划——Harness 的职责，就是让这五步持续转动，
            直到目标完成。把鼠标悬浮到下面的环上，跟着一个「做 App」的任务转一圈。
          </p>
        </header>

        <AgentLoop />

        <figure className="md:col-start-2 md:row-start-2 md:self-center">
          <div className="overflow-hidden rounded-3xl">
            <Image
              src="/harness/agent-loop.png"
              alt="Agent 闭环示意：理解目标、规划任务、调用工具、检查结果、重新规划，不断循环直到目标完成"
              width={1536}
              height={1024}
              sizes="(min-width: 1152px) 600px, (min-width: 768px) 52vw, calc(100vw - 48px)"
              className="h-auto w-full"
            />
          </div>
          <figcaption className="mt-3 px-2 text-center text-[11px] leading-5 text-slate-400">
            发现问题，就再执行一轮：持续反馈，形成闭环。
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
