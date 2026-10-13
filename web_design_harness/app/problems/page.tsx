import type { Metadata } from "next";
import { ChapterFooter, ChapterHeader, EditorialNote, StorySection } from "@/components/chapter-layout";
import { ProposalImage } from "@/components/proposal-image";

export const metadata: Metadata = {
  title: "RSI 容易遇到的问题",
  description: "梳理 RSI 迭代闭环在实践中容易遇到的问题。",
};

export default function ProblemsPage() {
  return <article className="page narrative-page">
    <ChapterHeader index={2} title={<>Skill 写久了，<br />为什么会<em>越堆越多？</em></>} lead={<><p>一遇到问题，就补一条规则。这是最直接的修法：它见效快，也很容易开始。可当 Skill 运行得越来越久，规则便会像补丁一样一层层叠上去。</p><p>真正棘手的不是规则多，而是我们逐渐回答不了三个问题：新规则到底有没有用？旧规则还能不能删？眼前这条规则当初为什么会出现？这不是某一个团队的问题，而是 Skill 长期迭代时普遍会遇到的规则债务。</p></>} />

    <ProposalImage file="rsi-problems-case-analysis.png" title="一次真实的 Skill 病因复盘" caption="文档加载、规则冲突、检查循环与上下文交接相互影响；规则累积以后，单次故障往往已经无法由某一条规则单独解释。" width={3854} height={1044} alt="真实 Skill 复盘记录，列出任务失败症状、文档加载结构、规则冲突、检查循环和上下文交接等根因" priority />
    <ProposalImage file="rsi-problems-version-history.jpeg" title="沿版本历史还原问题与治理过程" caption="通过 Git 提交链回看最初的问题、每轮治理动作与规则变化，才能重新建立规则与原始场景之间的联系。" width={3532} height={1130} alt="真实 Skill 版本复盘记录，展示最初的问题、历史提交与对应治理动作的时间线" />

    <StorySection id="hard-to-evaluate" number="01" title="规则的效果很难评估">
      <p>某个页面出现问题，我们很自然地在 Skill 里补上一句：“遇到这种情况，应该这样处理。”重新跑一次，眼前的 Bug 也许消失了。可问题来了：是这条规则真的起了作用，还是这一次刚好生成得比较好？</p>
      <p>只看最初出问题的那一个场景，很难判断规则能不能迁移到其他任务。它可能修好一个用例，却让另一个用例退步；也可能与已有规则重复，实际没有带来变化。如果没有固定的 Query、修改前后的 Skill 快照和同一套评测依据，我们就无法判断这条规则是否值得保留。</p>
    </StorySection>

    <StorySection id="hard-to-delete" number="02" title="规则很难被删除">
      <p>新增一条规则通常很容易，删除一条却需要更强的证据。因为我们不知道它是否仍在保护某个很少出现、但一旦出错就很严重的场景。于是最稳妥的做法变成了：先留着。</p>
      <p>久而久之，已经过期的规则、内容重复的规则和彼此冲突的规则被绑在一起。Skill 越写越长，Agent 需要理解的约束越来越多，真正重要的判断反而被埋在里面。删除风险越高，规则就越不可能被清理，最后形成只进不出的规则仓库。</p>
    </StorySection>

    <StorySection id="hard-to-trace" number="03" title="规则很难溯源">
      <p>再过一段时间回看 Skill，我们往往只能看到结论：“不要这样做”“必须检查这个状态”。但当时遇到的任务、失败的产物、设计师的标注，以及为什么选择这条改法，已经不在旁边了。</p>
      <p>失去这些上下文，规则就变成一句无法验证的遗嘱。后来的人不知道它解决的是普遍问题还是一次偶发现象，也无法在需求变化后判断它是否已经失效。规则要能够演进，就必须与当时的 Query、产物、标注和 Skill 版本一起留下。</p>
      <EditorialNote label="三个问题其实来自同一个缺口"><p>规则没有与实验数据一起管理。缺少对照，就无法评估；缺少覆盖证据，就不敢删除；缺少版本与场景关系，就无法溯源。</p></EditorialNote>
    </StorySection>

    <ChapterFooter index={2} bridge="要解决的不是再写一份更长的 Skill，而是建立一套能评估、能清理、能追溯的迭代系统。下一章，我们把这些能力放进同一张整体框架里。" sources={[]} />
  </article>;
}
