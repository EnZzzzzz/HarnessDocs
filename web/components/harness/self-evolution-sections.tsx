import Image from 'next/image'

type Point = {
  zh: string
  en: string
  desc: string
}

type Section = {
  id: string
  eyebrow: string
  title: string
  intro: string
  points: Point[]
  image: {
    src: string
    alt: string
    caption: string
  }
}

const SECTIONS: Section[] = [
  {
    id: 'se-what',
    eyebrow: 'Self-Evolution · 01',
    title: 'Agent 自进化是什么？',
    intro:
      '今天绝大多数 Agent 干了一万次活以后，和第一次干活的时候能力几乎没有区别——昨天踩过的坑今天继续踩，昨天走过的弯路今天继续走。',
    points: [
      {
        zh: '传统 Agent：任务结束就结束了',
        en: 'Plan → Tool → Action',
        desc: '拿到任务以后做 planning、调工具、执行 action，拿到结果，这个任务就结束了。',
      },
      {
        zh: '自进化多出的一圈闭环',
        en: 'Feedback → Reflection → Update',
        desc: '拿到结果以后还有 feedback 和反思，再获取经验，最后做 update——更新的就是 Agent 本身，然后再去做下一次执行。',
      },
      {
        zh: '最关键的是最后的 Update',
        en: 'The Key Step',
        desc: '如果只有反思，其实还不能叫自进化——经验必须真正沉淀回 Agent。',
      },
    ],
    image: {
      src: '/harness/self-evolution-loop.png',
      alt: '传统 Agent 的任务闭环外增加反馈、反思和永久更新，经验被重新安装回 Agent',
      caption:
        '内圈完成规划、工具调用与执行，只能得到这一次的结果；外圈继续检查反馈、追溯原因并提炼经验。真正决定是否发生自进化的，是最后把经验模块永久写回 Agent，让下一次执行从更新后的状态出发。',
    },
  },
  {
    id: 'se-vs-reflection',
    eyebrow: 'Self-Evolution · 02',
    title: 'Reflection ≠ 自进化',
    intro:
      'Reflection 和 Self-Evolution 的区别非常重要——这两个东西，根本就不是一个层级。',
    points: [
      {
        zh: 'Reflection 解决「这一次」',
        en: 'Fix This Task',
        desc: 'Agent 调错了一个 API，发现参数传错了，想了一下、换另一个参数、调用成功——发现错了，反思一下再改，仅此而已。',
      },
      {
        zh: '同样的问题下次还会再犯',
        en: 'No Accumulation',
        desc: '如果下一次遇到同样的问题，它又从头重新反思一遍——其实它根本没有进化。',
      },
      {
        zh: '自进化解决「下一次」',
        en: 'Fix Forever',
        desc: '拿到错误以后理解为什么错、知道怎么去改，然后做最关键的一步：改完以后永久保存。',
      },
    ],
    image: {
      src: '/harness/reflection-vs-self-evolution.png',
      alt: '两条时间线对比 Reflection 的临时修复与自进化的永久保存',
      caption:
        '上方时间线中，Agent 通过 Reflection 修好了当前接口错误，但经验随任务结束而消失，下一次仍会重犯；下方时间线把正确适配器与规则保存进自身，因此再次遇到同类任务时可以直接成功。',
    },
  },
  {
    id: 'se-layers',
    eyebrow: 'Self-Evolution · 03',
    title: 'Agent 到底在进化什么？',
    intro:
      '不是让 AI 自己去训练自己——模型参数的更新只是其中最重的一种。更现实的 Agent 自进化，至少可以分成五层。',
    points: [
      {
        zh: 'Memory：经验的积累',
        en: 'Experience Accumulation',
        desc: '记住经验：A 数据源总是拿不到数据、B 数据源稳定很多，下一次优先调的就是 B。',
      },
      {
        zh: 'Policy：规划的策略',
        en: 'Planning Strategy',
        desc: '不只是记住事情，还要知道怎么修改自己的方法：10 步的任务复盘后发现几步完全没必要，下次直接缩减到 7 步。',
      },
      {
        zh: 'Skill：被固化的成功经验',
        en: 'Skill',
        desc: '把一整套成功路径封装成 Skill：财报分析沉淀为 Financial Analyze Skill，下次遇到类似任务直接调用，不用重新探索。',
      },
      {
        zh: 'Tool：自己去写工具',
        en: 'Tool Creation',
        desc: '现有工具不够用了，就自己写一段代码、测试、debug，能稳定解决一类问题后，注册成一个新的 tool 放进工具箱。',
      },
      {
        zh: 'Model：更新模型参数',
        en: 'SFT / RL',
        desc: '几十万条轨迹沉淀成 dataset，再通过 SFT/RL 更新模型参数——底层模型本身都发生变化，这是最重的一层。',
      },
    ],
    image: {
      src: '/harness/self-evolution-layers.png',
      alt: 'Agent 自进化的五层结构，从经验记忆、策略优化、Skill 固化、工具创造到模型更新',
      caption:
        '五层由上至下逐渐深入：记忆层保留有效经验，策略层缩短行动路径，Skill 层封装成功工作流，Tool 层创造并注册新工具，最底层则把大量成败轨迹转成训练数据，进一步更新模型参数。',
    },
  },
  {
    id: 'se-flywheel',
    eyebrow: 'Self-Evolution · 04',
    title: '经验飞轮：越工作越聪明的 Agent',
    intro:
      '真正的 Agent 应该形成它的经验飞轮——这也是未来判断一个 Agent 聪不聪明的新标准。',
    points: [
      {
        zh: '一个内容 Agent 的进化',
        en: 'Example',
        desc: '第一周发现技术科普类平均点赞 500、AI 职场类 1500，于是调整选题；又发现带具体数字的标题点击率高 30%，就把这条规律写进自己的 Skill。一个月后，它和第一天拿到的那个 Agent 已经完全不一样了。',
      },
      {
        zh: '经验飞轮',
        en: 'Experience Flywheel',
        desc: '执行 → feedback → reflection → 经验 → 更新 → 更好的下一次执行，这样不断循环。',
      },
      {
        zh: '新的评价指标',
        en: 'A New Metric',
        desc: '不再只看一次任务完成得多好，而是看它做完 1000 次任务以后有没有比第一次更强——真正厉害的 Agent 不一定出厂时最聪明，而是在真实世界里工作越久越聪明。',
      },
    ],
    image: {
      src: '/harness/experience-flywheel.png',
      alt: '内容 Agent 在执行、反馈、反思、经验沉淀和更新构成的飞轮中持续增强',
      caption:
        '内容 Agent 每轮工作都会收集选题、标题与受众反馈，经过复盘后把有效规律固化成可复用经验，再写回下一轮执行。评价它是否聪明，不只看第一次交付，而要看大量真实任务之后是否形成了更稳定的策略与更强的结果。',
    },
  },
]

/**
 * 「Agent 自进化」四个章节：每章一页，布局统一——
 * 左侧标题 + 若干要点卡片，右侧展示对应的自进化机制插画。
 */
export function SelfEvolutionSections() {
  return (
    <>
      {SECTIONS.map((section) => (
        <section
          key={section.id}
          id={section.id}
          aria-labelledby={`${section.id}-title`}
          className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 sm:py-32"
        >
          <div className="grid items-start gap-y-8 md:grid-cols-2 md:gap-x-10 lg:gap-x-16">
            <header className="md:col-span-2">
              <p className="text-xs font-semibold tracking-[0.18em] text-indigo-600 uppercase">
                {section.eyebrow}
              </p>
              <h2
                id={`${section.id}-title`}
                className="mt-4 bg-gradient-to-br from-slate-950 via-slate-800 to-indigo-900 bg-clip-text text-4xl font-bold tracking-tighter text-transparent lg:text-5xl"
              >
                {section.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                {section.intro}
              </p>
            </header>

            <ol className="space-y-3 md:col-start-1 md:self-center">
              {section.points.map((point, i) => (
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
                  src={section.image.src}
                  alt={section.image.alt}
                  width={1536}
                  height={1024}
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-3 px-1 text-left text-[11px] leading-5 text-slate-400">
                {section.image.caption}
              </figcaption>
            </figure>
          </div>
        </section>
      ))}
    </>
  )
}
