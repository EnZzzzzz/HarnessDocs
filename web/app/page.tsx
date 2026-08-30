import { ChevronDown } from 'lucide-react'
import type { CSSProperties } from 'react'
import { CordisSection } from '@/components/harness/cordis-section'
import { HarnessDutySection } from '@/components/harness/harness-duty-section'
import { HarnessSection } from '@/components/harness/harness-section'
import { SelfEvolutionFlywheelSection, SelfEvolutionSections } from '@/components/harness/self-evolution-sections'
import { SkillAssetSection } from '@/components/harness/skill-asset-section'
import { SkillQuestionsSection } from '@/components/harness/skill-questions-section'
import { SkillTraitsSection } from '@/components/harness/skill-traits-section'
import { SkillVsPromptSection } from '@/components/harness/skill-vs-prompt-section'
import { OutlineSection } from '@/components/outline/outline-section'
import { FEATURED_SECTION } from '@/components/outline/sections'
import { TimelineSection } from '@/components/timeline/timeline-section'
import { TocRail } from '@/components/toc-rail'

/**
 * 右侧 Harness 图标阵列：真实 logo，像随手一撒一样随机散落在区域内。
 * 增删/替换图标直接改这个数组（x/y 相对中心的 px 坐标、size 尺寸、
 * rot 旋转角、o 不透明度、b 虚化的 px）。
 */
const LOGOS = [
  { src: '/icons/deepseek.svg', label: 'DeepSeek', x: 0, y: -6, size: 74, rot: 0, o: 1, b: 0, z: true },
  { src: '/icons/claude.svg', label: 'Claude', x: -158, y: -148, size: 66, rot: -14, o: 1, b: 0 },
  { src: '/icons/chatgpt.svg', label: 'ChatGPT', x: 96, y: -176, size: 54, rot: 18, o: 0.85, b: 0.3 },
  { src: '/icons/googlegemini.svg', label: 'Gemini', x: 196, y: -58, size: 58, rot: -10, o: 0.9, b: 0 },
  { src: '/icons/cursor.svg', label: 'Cursor', x: -38, y: -72, size: 46, rot: 22, o: 0.6, b: 1 },
  { src: '/icons/githubcopilot.svg', label: 'Copilot', x: 142, y: 96, size: 60, rot: -16, o: 0.85, b: 0.3 },
  { src: '/icons/kimi.svg', label: 'Kimi', x: -28, y: 168, size: 48, rot: 12, o: 0.65, b: 1 },
  { src: '/icons/qwen.svg', label: 'Qwen', x: -186, y: 62, size: 54, rot: -20, o: 0.75, b: 0.5 },
  { src: '/icons/opencode.svg', label: 'OpenCode', x: -92, y: -28, size: 44, rot: 26, o: 0.55, b: 1.2 },
  { src: '/icons/feishu.png', label: '飞书', x: 44, y: 108, size: 50, rot: -12, o: 0.7, b: 0.7 },
  { src: '/icons/context7.png', label: 'Context7', x: 152, y: 172, size: 50, rot: 15, o: 0.65, b: 0.9 },
  { src: '/icons/zhipu.svg', label: '智谱', x: -160, y: 152, size: 52, rot: -18, o: 0.7, b: 0.6 },
  { src: '/icons/workbuddy.svg', label: 'WorkBuddy', x: 6, y: -150, size: 50, rot: 10, o: 0.8, b: 0.4 },
]

const ORBIT_SIZE = 560

export default function Page() {
  return (
    <>
      <section
        id="overview"
        className="relative mx-auto flex min-h-[calc(100svh-130px)] w-full max-w-6xl flex-1 flex-col items-center gap-14 px-6 pt-10 pb-16 lg:flex-row lg:items-center lg:gap-8 lg:pt-4"
      >
        {/* 左：大标题，从左向右入场 */}
        <div className="flex max-w-xl flex-col items-start gap-7 lg:flex-1">
        <p
          className="hero-stagger rounded-full border border-indigo-200/70 bg-white/60 px-4 py-1.5 text-xs font-medium tracking-wide text-indigo-600 backdrop-blur"
          style={{ '--d': '0.05s' } as CSSProperties}
        >
          Agent Harness × Model Training
        </p>
        <h1
          className="hero-stagger bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-7xl font-bold tracking-tighter text-transparent sm:text-8xl"
          style={{ '--d': '0.15s' } as CSSProperties}
        >
          Harness
        </h1>
        <p
          className="hero-stagger text-base leading-relaxed text-slate-600 sm:text-lg"
          style={{ '--d': '0.3s' } as CSSProperties}
        >
          关于 Agent Harness 与模型训练的研究文档可视化：Harness
          设计与自我进化、轨迹数据收集、数据合成与工具调用、RL
          后训练——把分散的论文笔记，变成可探索的知识地图。
        </p>
      </div>

      {/* 右：散乱圆形图标阵列，由外向内聚合入场 */}
      <div className="flex flex-1 items-center justify-center">
        <div
          className="relative shrink-0 scale-[0.58] sm:scale-75 lg:scale-90 xl:scale-100"
          style={{ width: ORBIT_SIZE, height: ORBIT_SIZE }}
        >
          {/* 散落的 Harness 图标 */}
          {LOGOS.map((logo, i) => {
            return (
              <div
                key={logo.label}
                className={logo.z ? 'orbit-item z-10' : 'orbit-item'}
                style={
                  {
                    '--x': `${logo.x}px`,
                    '--y': `${logo.y}px`,
                    '--o': logo.o,
                    '--b': `${logo.b}px`,
                    '--d': `${0.3 + i * 0.08}s`,
                  } as CSSProperties
                }
              >
                <div
                  className="chip-float"
                  style={
                    {
                      '--fd': `${1.7 + i * 0.3}s`,
                      animationDuration: `${5 + (i % 4)}s`,
                    } as CSSProperties
                  }
                >
                  <div
                    className="flex flex-col items-center gap-1.5"
                    style={{ transform: `rotate(${logo.rot}deg)` }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.src}
                      alt={logo.label}
                      width={logo.size}
                      height={logo.size}
                      className="drop-shadow-[0_10px_18px_rgba(80,100,180,0.25)]"
                    />
                    <span className="text-[10px] font-medium tracking-wide text-slate-500">
                      {logo.label}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 底部滚动提示 */}
      <div
        className="hero-stagger absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs text-slate-400 lg:flex"
        style={{ '--d': '1.2s' } as CSSProperties}
      >
        <ChevronDown className="size-4 animate-bounce" />
        向下滚动 · AI 发展脉络
      </div>
    </section>

    {/* 向下滚动进入时间线 */}
    <TimelineSection />

    {/* 时间线后优先展示：Codex 的自进化方案 */}
    <OutlineSection data={FEATURED_SECTION} />

    {/* 继续向下：先抛出 Harness × Skill 的关系之问 */}
    <SkillQuestionsSection />

    {/* 回答第一问：Harness 的职责（Agent 闭环） */}
    <HarnessDutySection />

    {/* 接着回答：Skill 带来什么——专业性与一致性 */}
    <SkillTraitsSection />

    {/* 澄清常见误解：Skill 和 Prompt 的区别 */}
    <SkillVsPromptSection />

    {/* 再给出答案的骨架：Harness 六职责 */}
    <HarnessSection />

    {/* 延伸观点：未来真正值钱的是 Skill，不是 Agent */}
    <SkillAssetSection />

    {/* Agent 自进化：四个章节，每章一页，右侧预留配图区域 */}
    <SelfEvolutionSections />

    {/* 最后一页：Cordis 时空可组合性编程范式（DeepSeek Harness 理论基础） */}
    <CordisSection />

    {/* 收尾：经验飞轮——越工作越聪明的 Agent */}
    <SelfEvolutionFlywheelSection />

    {/* 页面最左侧的整体目录条：点击快速跳转各章节 */}
    <TocRail />
    </>
  )
}
