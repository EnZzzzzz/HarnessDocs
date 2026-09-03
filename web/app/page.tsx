import { ChevronDown } from 'lucide-react'
import type { CSSProperties } from 'react'
import { CordisSection } from '@/components/harness/cordis-section'
import { HarnessDutySection } from '@/components/harness/harness-duty-section'
import { HarnessPuritySection } from '@/components/harness/harness-purity-section'
import { HarnessSection } from '@/components/harness/harness-section'
import { DataAugmentationSections, DataFlywheelSection, DeliveryModelsSection, DesignHarnessAssetsSection, SelfEvolutionFlywheelSection, SelfEvolutionSections } from '@/components/harness/self-evolution-sections'
import { SeQuestionsSection } from '@/components/harness/se-questions-section'
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
          洞察 & 思考
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

    {/* 自进化开篇提问：Agent 的自进化是进化什么（大标题 + 散落问题气泡） */}
    <SeQuestionsSection />

    {/* Agent 自进化：四个章节，每章一页，右侧预留配图区域 */}
    <SelfEvolutionSections />

    {/* 最后一页：Cordis 时空可组合性编程范式（DeepSeek Harness 理论基础） */}
    <CordisSection />

    {/* DeepSeek Harness 优势之二：上下文纯净度，对照 Codex / Claude Code / OpenCode */}
    <HarnessPuritySection />

    {/* 延伸：DesignHarness 自增长要沉淀的两类资产（右侧配图待补） */}
    <DesignHarnessAssetsSection />

    {/* 深入：轨迹与思维链数据如何增广，以及大厂公开的共同流水线 */}
    <DataAugmentationSections />

    {/* 落地：Design Harness 的多种交付形态（右侧配图待补） */}
    <DeliveryModelsSection />

    {/* 倒数第三页：经验飞轮——越工作越聪明的 Agent */}
    <SelfEvolutionFlywheelSection />

    {/* 接着：数据飞轮——专家知识层 + 高质量种子轨迹数据 */}
    <DataFlywheelSection />

    {/* 压轴：Codex 产品负责人 Tibo 谈 Harness 将走向哪里 */}
    <OutlineSection data={FEATURED_SECTION} />

    {/* 页面最左侧的整体目录条：点击快速跳转各章节 */}
    <TocRail />
    </>
  )
}
