import type { Metadata } from "next";
import { ChapterHeader, StorySection, EditorialNote, ChapterFooter } from "@/components/chapter-layout";
import { ChapterFigures } from "@/components/chapter-figures";
import { ProposalImage } from "@/components/proposal-image";

export const metadata: Metadata = { title: "Skill 版本管理", description: "从一次具体的 Skill 修改开始，留下版本、差异和派生关系，让设计能力的迭代有迹可循。" };

export default function SkillsPage() {
  return <article className="page narrative-page">
    <ChapterHeader index={0} title={<>这次改好了，<br />能不能留下<em>为什么？</em></>} lead={<><p>你给 Skill 加了一条“优先检查窄屏布局”，重新生成，页面看起来顺眼了。又改了几轮，却发现有些任务反而退步了。</p><p>这时最想知道的是：到底从哪一次改动开始，结果发生了变化？RSI Harness 的第一步，就是把这些改动留下来。</p></>} />
    <ProposalImage file="mockup-04-asset-version.png" title="01 / Skill 版本管理" caption="版本树把每一次修改放回它的来处。产品效果图，示例成绩不作为版本优劣的依据。" priority />
    <StorySection id="keep-versions" number="01" title="先别覆盖旧文件，给这次修改留一个位置。">
      <p>技能包（Skill）可以理解成给 Agent 的操作手册：遇到这类任务，应该怎样做。它还可以带着脚本、资源和依赖说明。修改这份手册，就是在修改 Agent 下一次做事的方法。</p>
      <p>如果每次都直接覆盖文件，我们最后只剩下最新的一份。方案里，每次保存都形成一个<strong>不可变的版本快照</strong>：当时的完整内容、修改说明和父版本一起保存。还没保存的内容是草稿；保存之后再修改，就创建新版本。</p>
      <EditorialNote><p>留下的不是一个“v2”名字，而是一份能回看的内容，以及一句具体的修改理由。</p></EditorialNote>
    </StorySection>
    <StorySection id="branch" number="02" title="两种改法都想试，就从同一个版本分出去。">
      <p>比如，一种改法强化响应式检查，另一种改法调整信息层级。两者都从同一份旧版本出发，分别保存、分别试用。版本树把这种关系画出来：谁从谁派生，哪条路做了什么。</p>
      <div className="version-story" aria-label="示意版本派生：初始版本分别派生响应式检查和信息层级两个版本"><div className="version-root"><span>共同起点</span><strong>初始版本</strong><small>保留原有能力快照</small></div><div className="version-branches"><div><span>改法 A</span><strong>增加窄屏检查</strong><small>先验证响应式问题</small></div><div><span>改法 B</span><strong>调整信息层级</strong><small>先验证阅读顺序</small></div></div></div>
      <p className="figure-note">派生关系示意，不代表已经完成的实验。</p>
      <p>首版每个版本最多一个父节点，但同一节点可以派生多个子版本。选中两个版本时，可以看文本差异；图片等文件至少能看出新增、删除或变化。历史实验用过的版本继续保留，避免后来找不到当时的依据。</p>
    </StorySection>
    <StorySection id="version-combination" number="03" title="只记住 Skill，还不能解释全部变化。">
      <p>同一个 Skill，换了提示词，或者改变了工具和执行流程，结果也可能不同。所以提示词模板（Prompt）和执行配置（Harness）也各自保存版本，再与 Skill 组合使用。</p>
      <ChapterFigures label="查看能力管理配图" items={[
        { file: "mockup-12-prompt-editor.png", title: "Prompt 编辑", caption: "任务模板与变量独立管理。编辑草稿后保存为新版本，旧实验仍引用原来的版本。" },
        { file: "mockup-13-harness-config.png", title: "Harness 配置", caption: "工具、流程和上下文配置可独立迭代。具体开关是否可用，以 DeepSeekHarness 的实际能力为准。" },
      ]} />
      <p>方案采用 <strong>DeepSeekHarness 作为唯一执行底座</strong>。它的底座版本，和我们迭代的 Harness 配置版本分别记录。这样回看结果时，才能区分是自己的改动，还是底座升级带来的变化。</p>
      <EditorialNote label="默认版本只是一个指针"><p>把某个版本设为默认，只影响后续选择。已经提交的实验继续使用当时固定的版本，不会悄悄换成新的。</p></EditorialNote>
    </StorySection>
    <ChapterFooter index={0} bridge="现在知道改了什么了。但只看一个页面，能说明这次修改值得保留吗？我们还需要一组可以反复使用的任务。" sources={[{file:"01-assets.md",label:"资产与版本"},{file:"04-experiments.md",label:"实验配置快照"},{file:"05-runner.md",label:"执行底座"}]} />
  </article>;
}
