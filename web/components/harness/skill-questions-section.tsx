/**
 * 「Harness 和 Skill 的关系是什么」提问页：
 * 一个大标题 + 四个问题气泡，像小云朵一样随机散落在页面上。
 * 位置/角度/大小直接改 QUESTIONS 数组（pos 为 md 以上的 Tailwind 定位类）。
 */
const QUESTIONS = [
  {
    text: 'Skill 就是 Harness？',
    pos: 'md:top-[14%] md:left-[7%]',
    rot: '-rotate-6',
    size: 'text-lg sm:text-xl px-7 py-3.5',
    bg: 'bg-white/50',
    dur: '5.5s',
  },
  {
    text: 'Skill 就是 Prompt？',
    pos: 'md:top-[10%] md:right-[9%]',
    rot: 'rotate-5',
    size: 'text-base sm:text-lg px-6 py-3',
    bg: 'bg-white/40',
    dur: '6.5s',
  },
  {
    text: '有了 Skill，就不用再做 Harness 了？',
    pos: 'md:right-[6%] md:bottom-[16%]',
    rot: '-rotate-4',
    size: 'text-lg sm:text-xl px-7 py-3.5',
    bg: 'bg-white/55',
    dur: '7s',
  },
  {
    text: '那为什么，我们还要做一个 Harness？',
    pos: 'md:bottom-[12%] md:left-[10%]',
    rot: 'rotate-6',
    size: 'text-base sm:text-lg px-6 py-3',
    bg: 'bg-indigo-50/60',
    dur: '6s',
  },
] as const

export function SkillQuestionsSection() {
  return (
    <section
      id="skill-questions"
      aria-labelledby="skill-questions-title"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 sm:py-32"
    >
      {/* 移动端：标题在上、气泡依次排列；md 以上：气泡绝对定位散落 */}
      <div className="relative flex flex-col items-center gap-10 md:block md:min-h-[520px]">
        <div className="flex flex-col items-center gap-5 text-center md:absolute md:top-1/2 md:left-1/2 md:w-full md:-translate-x-1/2 md:-translate-y-1/2">
          <p className="rounded-full border border-indigo-200/70 bg-white/60 px-4 py-1.5 text-xs font-medium tracking-wide text-indigo-600 backdrop-blur">
            Harness × Skill
          </p>
          <h2
            id="skill-questions-title"
            className="bg-gradient-to-br from-slate-950 via-slate-800 to-indigo-900 bg-clip-text text-4xl font-bold tracking-tighter text-transparent lg:text-5xl"
          >
            Harness 和 Skill，
            <br className="hidden sm:block" />
            到底是什么关系？
          </h2>
        </div>

        {QUESTIONS.map((q) => (
          <div
            key={q.text}
            className={`chip-float md:absolute ${q.pos}`}
            style={{ animationDuration: q.dur }}
          >
            <span
              className={`inline-block ${q.rot} rounded-[2.5rem] border border-white/70 ${q.bg} ${q.size} font-medium tracking-tight text-slate-600 shadow-[0_14px_35px_-18px_rgba(60,80,160,0.4)] backdrop-blur-md`}
            >
              {q.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
