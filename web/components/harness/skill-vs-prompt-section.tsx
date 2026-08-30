import Image from 'next/image'

const POINTS = [
  {
    zh: '一次性指令',
    en: 'One-shot Prompt',
    desc: 'Prompt 是当下的一句命令——今天说一句、明天换一句，解决的只是当前这一个任务。',
  },
  {
    zh: '长期维护的操作手册',
    en: 'Living Playbook',
    desc: 'Skill 不只有 Instructions，还有 Examples、Templates、Checklists、Best Practices、Validation，乃至整套领域方法论。',
  },
  {
    zh: '消耗品 vs 知识资产',
    en: 'Disposable vs Knowledge Asset',
    desc: 'Prompt 越来越像一次性消耗品；Skill 可以不断沉淀、持续版本迭代——企业开始维护自己的 Skill Repository，而不是 Prompt Collection。',
  },
]

/**
 * 「Skill vs Prompt」：左侧标题 + 三张论点卡片，右侧对比配图。
 */
export function SkillVsPromptSection() {
  return (
    <section
      id="skill-vs-prompt"
      aria-labelledby="skill-vs-prompt-title"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 sm:py-32"
    >
      <div className="grid items-start gap-y-8 md:grid-cols-2 md:gap-x-10 lg:gap-x-16">
        <header className="md:col-start-1 md:row-start-1">
          <p className="text-xs font-semibold tracking-[0.18em] text-indigo-600 uppercase">
            Skill vs Prompt
          </p>
          <h2
            id="skill-vs-prompt-title"
            className="mt-4 bg-gradient-to-br from-slate-950 via-slate-800 to-indigo-900 bg-clip-text text-4xl font-bold tracking-tighter text-transparent lg:text-5xl"
          >
            比较容易混淆的概念：Skill 不是一句 Prompt
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            很多人觉得：Skill 既然是一个技能，那不就是一句 Prompt 吗？
            差别其实很大——一个是简短的命令，一个是不断沉淀的知识体系。
          </p>
        </header>

        <ol className="space-y-3 md:col-start-1 md:row-start-2 md:self-center">
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

        <figure className="md:col-start-2 md:row-span-2 md:row-start-1 md:self-center">
          <div className="overflow-hidden rounded-3xl">
            <Image
              src="/harness/skill-vs-prompt.png"
              alt="Prompt 是解决当前任务的一次性指令；Skill 是包含方法、示例、模板、检查与验证的可迭代知识体系"
              width={1536}
              height={1024}
              className="h-auto w-full"
            />
          </div>
          <figcaption className="mt-3 px-1 text-left text-[11px] leading-5 text-slate-400">
            左侧的 Prompt 像一张一次性工单：输入一句命令，只完成眼前任务，随后被替换或丢弃。右侧的 Skill
            则像一本持续维护的专业手册：把指令、示例、模板、检查清单、最佳实践、验证规则与领域方法论组织起来，并通过版本迭代逐步沉淀为企业可复用的知识资产。
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
