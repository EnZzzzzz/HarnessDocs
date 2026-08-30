import Image from 'next/image'

const TRAITS = [
  {
    zh: 'Do the Task vs Do it Professionally',
    en: '做完 ≠ 做专业',
    desc: 'Agent 负责 do the task——推进流程、把事情做完；Skill 负责 do it professionally——这件事应该怎么做、怎样做得足够专业。',
  },
  {
    zh: '质量可复现',
    en: 'Reproducible Quality',
    desc: 'Skill 把专业经验提前写进方法与标准里，让交付质量不依赖模型当场的发挥——每一次交付都稳定、可复现。',
  },
  {
    zh: '与多样性天然互斥',
    en: 'Less Diversity',
    desc: 'Skill 会把模型的输出约束到一个更小的解空间——一致性提升的代价，是多样性的收缩。',
  },
]

/**
 * 「Skill 的特性 · 专业性与一致性」：左侧核心论点，右侧配
 * 「Skill 负责什么」手绘示意图。
 */
export function SkillTraitsSection() {
  return (
    <section
      id="skill-traits"
      aria-labelledby="skill-traits-title"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 sm:py-32"
    >
      <div className="grid items-start gap-y-8 md:grid-cols-2 md:gap-x-10 lg:gap-x-16">
        <header className="md:col-start-1 md:row-start-1">
          <p className="text-xs font-semibold tracking-[0.18em] text-indigo-600 uppercase">
            Skill Traits
          </p>
          <h2
            id="skill-traits-title"
            className="mt-4 bg-gradient-to-br from-slate-950 via-slate-800 to-indigo-900 bg-clip-text text-4xl font-bold tracking-tighter text-transparent lg:text-5xl"
          >
            Skill：Agent 的专业知识层
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            Agent 和 Skill 的关注点不同：一个推进任务，一个定义专业做法。
            专业经验被提前写进 Skill 里，Agent 每次调用都站在同一套标准上。
          </p>
        </header>

        <ol className="space-y-3 md:col-start-1 md:row-start-2 md:self-center">
          {TRAITS.map((trait, i) => (
            <li
              key={trait.en}
              className="grid grid-cols-[2rem_1fr] gap-3 rounded-2xl border border-slate-200/80 bg-white/55 p-4 backdrop-blur-sm"
            >
              <span className="pt-0.5 font-mono text-[11px] font-semibold text-indigo-500">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-sm font-bold tracking-tight text-slate-900">
                  {trait.zh}
                  <span className="ml-2 text-[11px] font-medium tracking-wide text-slate-400">
                    {trait.en}
                  </span>
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">{trait.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <figure className="md:col-start-2 md:row-span-2 md:row-start-1 md:self-center">
          <div className="overflow-hidden rounded-3xl">
            <Image
              src="/harness/skill-professional.png"
              alt="Skill 负责什么：Agent 和 Skill 关注点不同——Agent 推进任务，Skill 定义专业做法，让交付质量稳定可复现"
              width={956}
              height={668}
              sizes="(min-width: 1152px) 600px, (min-width: 768px) 52vw, calc(100vw - 48px)"
              className="h-auto w-full"
            />
          </div>
          <figcaption className="mt-3 px-2 text-center text-[11px] leading-5 text-slate-400">
            Agent 负责把事情做完，Skill 负责把事情做专业。
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
