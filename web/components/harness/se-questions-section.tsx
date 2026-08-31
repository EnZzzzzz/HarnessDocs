/**
 * 「Agent 的自进化是进化什么」提问页：
 * 版式与 skill-questions-section 一致——一个大标题 +
 * 若干问题气泡，像小云朵一样随机散落在页面上。
 * 位置/角度/大小直接改 QUESTIONS 数组（pos 为 md 以上的 Tailwind 定位类）。
 */
const QUESTIONS = [
  {
    text: '今天遇到的问题，明天又遇到了',
    pos: 'md:top-[14%] md:left-[7%]',
    rot: '-rotate-6',
    size: 'text-lg sm:text-xl px-7 py-3.5',
    bg: 'bg-white/50',
    dur: '5.5s',
  },
  {
    text: '调了这个场景，但另一个场景很像，又要调一遍',
    pos: 'md:top-[10%] md:right-[6%]',
    rot: 'rotate-5',
    size: 'text-base sm:text-lg px-6 py-3',
    bg: 'bg-white/40',
    dur: '6.5s',
  },
  {
    text: '上次踩过的坑，这次照样踩',
    pos: 'md:right-[8%] md:bottom-[16%]',
    rot: '-rotate-4',
    size: 'text-lg sm:text-xl px-7 py-3.5',
    bg: 'bg-white/55',
    dur: '7s',
  },
  {
    text: '干了一万次活，和第一次干活没区别？',
    pos: 'md:bottom-[12%] md:left-[10%]',
    rot: 'rotate-6',
    size: 'text-base sm:text-lg px-6 py-3',
    bg: 'bg-indigo-50/60',
    dur: '6s',
  },
] as const

export function SeQuestionsSection() {
  return (
    <section
      id="se-questions"
      aria-labelledby="se-questions-title"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 sm:py-32"
    >
      {/* 移动端：标题在上、气泡依次排列；md 以上：气泡绝对定位散落 */}
      <div className="relative flex flex-col items-center gap-10 md:block md:min-h-[520px]">
        <div className="flex flex-col items-center gap-5 text-center md:absolute md:top-1/2 md:left-1/2 md:w-full md:-translate-x-1/2 md:-translate-y-1/2">
          <p className="rounded-full border border-indigo-200/70 bg-white/60 px-4 py-1.5 text-xs font-medium tracking-wide text-indigo-600 backdrop-blur">
            Self-Evolution
          </p>
          <h2
            id="se-questions-title"
            className="bg-gradient-to-br from-slate-950 via-slate-800 to-indigo-900 bg-clip-text text-4xl font-bold tracking-tighter text-transparent lg:text-5xl"
          >
            Agent 的自进化，
            <br className="hidden sm:block" />
            是进化什么？
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
