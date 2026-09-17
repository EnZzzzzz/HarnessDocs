import type { Metadata } from "next";
import { ChapterHeader, StorySection, EditorialNote, ChapterFooter } from "@/components/chapter-layout";
import { ProposalImage } from "@/components/proposal-image";

export const metadata: Metadata = { title: "评测用例集", description: "把需求、参考图和初始项目保存成可重复使用的用例，先固定任务，再比较不同 Skill 版本的产物。" };

export default function CasesPage() {
  return <article className="page narrative-page">
    <ChapterHeader index={1} title={<>换一组任务，<br />它还会<em>更好吗？</em></>} lead={<><p>上一章留下了两种 Skill 改法。如果一个拿去做作品集，另一个拿去做数据看板，生成结果当然不同，却很难说清谁的改动更有效。</p><p>比较之前，先把任务放在同一张桌上。评测用例集要解决的，就是让这些任务能够反复使用，也让人知道每次究竟在看什么。</p></>} />
    <ProposalImage file="mockup-05-cases-datasets.png" title="02 / 用例与数据集" caption="把需求、附件、初始项目和预期行为放在一起。页面为产品设计示意。" priority />
    <StorySection id="case" number="01" title="一条用例，要比一句提示词更完整。">
      <p>用例（Case）就是一份可以交给 Agent 的任务单。“做一个作品集”只是开头。面向谁、参考哪张图、从空项目开始还是修改已有代码、哪些交互必须能用，都应该跟着任务一起保存。</p>
      <div className="case-sheet"><div className="case-sheet-heading"><span className="eyebrow accent">示意任务单 / CASE</span><h3>为独立设计师制作个人作品集</h3></div><dl><div><dt>要做什么</dt><dd>展示作品、个人介绍与联系方式。</dd></div><div><dt>带入什么</dt><dd>同一份参考图、内容素材与初始 React 项目。</dd></div><div><dt>看哪些场景</dt><dd>桌面和窄屏浏览；打开作品详情，再返回列表。</dd></div><div><dt>希望看到什么</dt><dd>作品容易找到，详情可以访问，窄屏内容不溢出。</dd></div></dl></div>
      <p>这些内容给执行提供起点，也给后面的人工查看提供依据。若需求或输入发生修改，就保存新的用例版本；旧实验继续引用旧版本。</p>
    </StorySection>
    <StorySection id="dataset" number="02" title="把经常遇到的任务，慢慢积累成一套题。">
      <p>数据集（Dataset）像一个题目文件夹：把用例按类型、标签或来源整理起来。可以从手头真实遇到的任务开始，把有代表性的需求和曾经失败的场景留下来。</p>
      <div className="case-types"><article><span>页面表达</span><h3>作品集、产品落地页</h3><p>观察视觉层级、内容组织与风格表达。</p></article><article><span>交互完成</span><h3>登录表单、数据筛选</h3><p>走一遍输入、反馈和状态变化。</p></article><article><span>容易遗漏</span><h3>窄屏导航、空状态</h3><p>把曾经出问题的场景留下来复查。</p></article></div>
      <p>这些只是组题思路，不是已经建立的数据集。保存集合版本时，要固定里面的用例版本，避免下一次比较时题目已经变了。</p>
      <EditorialNote label="现阶段就能用"><p>即使还没有自动评分，也可以让两个 Skill 版本做同一组任务，然后由人逐项查看产物。用例集先提供稳定的比较对象。</p></EditorialNote>
    </StorySection>
    <StorySection id="benchmark" number="03" title="题目固定以后，再决定要不要配一把尺子。">
      <p>当我们需要更正式的评测，可以在这些用例之上建立基准评测集（Benchmark）。它像一套带评分说明的试卷：同时固定用例版本、评测方式、评分维度和失败处理规则。</p>
      <ProposalImage file="mockup-06-benchmark.png" title="Benchmark · 后续可逐步完善的评分约定" caption="配图展示评分维度和权重的产品设想。当前不要求先具备自动评分，仍以人的查看和判断为准。" />
      <p>这里可以分两步走：先保存“要看哪些任务、关注哪些问题”，让人工评审有共同依据；需要量化时，再明确权重、缺失项和失败怎么处理，并引入适合的检查工具。</p>
      <p>用于评分的参考答案或隐藏检查材料，要与 Agent 的任务输入分开。否则，题目里夹着答案，看到的表现就失去了比较意义。</p>
    </StorySection>
    <ChapterFooter index={1} bridge="版本和任务都固定了，接下来把结果摆出来：先由人看差异、走交互、留下理由，再决定这次改动是否值得继续。" sources={[{file:"02-cases.md",label:"用例与数据集"},{file:"03-benchmarks.md",label:"Benchmark 与评分"}]} />
  </article>;
}
