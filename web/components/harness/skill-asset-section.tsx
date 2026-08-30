import Image from 'next/image'

const POINTS = [
  {
    zh: 'Agent 框架趋于标准化',
    en: 'Standardized Frameworks',
    desc: '今天有 CrewAI、LangGraph、OpenAI Agent SDK，未来还会有更多——框架会越来越成熟、越来越同质化，拉不开差距。',
  },
  {
    zh: '知识资产是不可复制的壁垒',
    en: 'Moat of Know-how',
    desc: 'Skill 背后不是 Prompt，而是一家企业或一个人几十年积累的行业经验、业务流程、专家方法论和最佳实践——这些 know-how 才真正不可复制。',
  },
  {
    zh: '企业的新知识资产',
    en: 'Skill Library & Marketplace',
    desc: '知识资产包含了 Skill 以及配套的组件库，还有真实设计师的 Agent 轨迹数据。',
  },
]

/**
 * 「Skill 即资产」：未来真正值钱的不是 Agent 而是 Skill。
 * 左侧论点概要，右侧展示企业知识资产的组成与复用方式。
 */
export function SkillAssetSection() {
  return (
    <section
      id="skill-asset"
      aria-labelledby="skill-asset-title"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 sm:py-32"
    >
      <div className="grid items-start gap-y-8 md:grid-cols-2 md:gap-x-10 lg:gap-x-16">
        <header className="md:col-span-2">
          <p className="text-xs font-semibold tracking-[0.18em] text-indigo-600 uppercase">
            Skill as Asset
          </p>
          <h2
            id="skill-asset-title"
            className="mt-4 bg-gradient-to-br from-slate-950 via-slate-800 to-indigo-900 bg-clip-text text-4xl font-bold tracking-tighter text-transparent lg:text-5xl"
          >
            未来值钱的不是 Agent，而是企业的知识资产
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            很多人觉得未来企业最重要的资产是自己的 Agent。
            但框架总会标准化——真正拉开差距的，是谁沉淀了更多高质量的 Skill。
          </p>
        </header>

        <ol className="space-y-3 md:col-start-1 md:self-center">
          {POINTS.map((point, i) => (
            <li
              key={point.en}
              className="grid grid-cols-[2rem_1fr] gap-3 rounded-2xl border border-slate-200/80 bg-white/55 p-4 backdrop-blur-sm"
            >
              <span className="pt-0.5 font-mono text-[11px] font-semibold text-indigo-500">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-sm font-bold tracking-tight text-slate-900">
                  {point.zh}
                  <span className="ml-2 text-[11px] font-medium tracking-wide text-slate-400">
                    {point.en}
                  </span>
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">{point.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <figure className="md:col-start-2 md:self-center">
          <div className="overflow-hidden rounded-3xl">
            <Image
              src="/harness/skill-as-asset.png"
              alt="企业知识资产由 Skill Library、设计组件库与资深设计师的使用轨迹共同构成，并连接可替换的标准化 Agent 框架"
              width={1536}
              height={1024}
              className="h-auto w-full"
            />
          </div>
          <figcaption className="mt-3 px-1 text-left text-[11px] leading-5 text-slate-400">
            外围的 Agent 框架可以不断替换，中央沉淀的知识资产才构成长期壁垒：Skill
            封装行业经验与专家方法，设计组件库提供可复用的交付材料，资深设计师的使用轨迹则记录真实决策、修改、反馈与验证过程；三者共同形成企业自己的 Skill
            Library，并进一步进入 Skill Marketplace 流通复用。
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
