import type { Metadata } from "next";
import { ChapterFooter, ChapterHeader, EditorialNote, StorySection } from "@/components/chapter-layout";
import { ProposalImage } from "@/components/proposal-image";

export const metadata: Metadata = {
  title: "图表实践",
  description: "用图表把 Design Harness 与 RSI 的关键关系讲清楚。",
};

export default function ChartsPage() {
  return <article className="page narrative-page">
    <ChapterHeader index={1} title={<>一个图表 Skill，<br />是怎么被<em>调出来的？</em></>} lead={<><p>第一次跑通，只能说明 Agent 会生成页面。它选的图表是否合适、移动端是否可用、信息层级是否清楚，仍然需要人在真实产物里判断。</p><p>下面不是一张理想化流程图，而是一次真实的图表生成 Skill 调试过程：从挑选任务开始，经过运行、标注与复盘，最后把经验写回可追踪的 Skill 版本。</p></>} />

    <StorySection id="prepare-and-run" number="01" title="先固定一批任务，才知道下一次是不是真的变好。">
      <p>如果每次都换一道题，结果变好可能只是碰巧。这里先从场景用例中选出带“图表”标签的 Query——也就是交给 Agent 的真实任务——把它们作为这一轮反复使用的测试题。</p>
      <ProposalImage file="chart-practice-01-cases.png" title="挑选管线测评 Query" caption="在场景用例中固定评测对象，并保留每条用例的运行记录。真实实践截图。" width={2828} height={1588} alt="AI 工作台的场景用例页面，展示带图表标签的管线测评 Query、验收标准和运行记录" priority />
      <p>任务固定以后，再让“图表生成 Skill”批量执行。模型、执行器、Skill 集合和用例范围都写进同一次运行要求里，生成的 HTML 页面与原始轨迹同时归档。</p>
      <ProposalImage file="chart-practice-02-run.png" title="批量运行图表生成 Skill" caption="一次运行固定模型、执行器、Skill 集合和用例集，为后续比较保留上下文。真实实践截图。" width={1570} height={1756} alt="Claude Code 中输入批量评测要求，指定图表生成 Skill、六条用例、模型、执行器和归档规则" />
    </StorySection>

    <StorySection id="annotate-and-reflect" number="02" title="先在产物上指出问题，再问这些问题有没有共同原因。">
      <p>页面生成以后，设计师不只给一个总分，而是直接框选产物中的具体区域，说明“这里为什么不对、可以往哪个方向改”。例如，同一组日期数据，与其继续堆卡片，也许更适合使用日期热力图。</p>
      <ProposalImage file="chart-practice-03-annotation.png" title="在真实产物上留下设计标注" caption="标注与截图位置、设备尺寸、整体评价和具体建议绑定，让反馈能回到对应的产物。真实实践截图。" width={2854} height={1580} alt="生成页面的平板预览和标注面板，设计师框选日历区域并建议使用日期热力图" />
      <p>一条反馈只能解释一个页面。把多个 Run 的标注放在一起，才会看见反复出现的模式：图表空渲染、移动端拥挤、卡片过大、布局太平，以及自动自评与人工判断错位。此时要修的就不再是某张页面，而是生成这些页面的方法。</p>
      <ProposalImage file="chart-practice-04-insights.png" title="跨 Run 汇总标注，提取共性问题" caption="Agent 读取人工标注，按用例整理正面反馈、失败模式与自评偏差，形成下一轮修改依据。真实实践截图。" width={2006} height={2010} alt="Codex 汇总四个 Run 的十八条设计师标注，提炼布局、空渲染、选型和自评偏差等问题" />
      <EditorialNote label="这一轮真正采集到的东西"><p>不是一句“做得不好”，而是 Query、运行配置、Skill 快照、生成产物与人工标注之间的一组对应关系。</p></EditorialNote>
    </StorySection>

    <StorySection id="update-and-version" number="03" title="共性问题找到以后，要把经验写回哪一个能力？">
      <p>“图表生成 Skill”并不是一份越来越长的提示词。它由图表构建、数据可视化设计、前端质量、动效和布局等子 Skill 组成。这样，图表选型的问题可以回到数据可视化设计，空渲染和移动端问题也能进入各自对应的能力模块。</p>
      <ProposalImage file="chart-practice-05-skill-library.png" title="从问题定位到具体子 Skill" caption="Skill 库把图表生成能力拆成多个可独立维护的模块，避免所有经验挤进同一份说明。真实实践截图。" width={1728} height={1332} alt="AI 工作台的图表生成 Skill 库，列出 chart-builder、data-viz-designer、frontend-guardian、interaction-motion 和 layout-designer" />
      <p>修改完成后，Git 提交把这次更新变成一个可追踪的版本。页面同时保留分支、提交历史、文件目录和当时的 SKILL.md 内容。下一轮再跑同一批 Query 时，我们比较的不再是两个模糊的“前后效果”，而是两个确定的 Skill 快照。</p>
      <ProposalImage file="chart-practice-06-version.png" title="用 Git 留下 Skill 的修改与内容快照" caption="分支、Commit、目录与 SKILL.md 放在同一个版本视图中，支持回看每次经验是怎样进入 Skill 的。真实实践截图。" width={2840} height={1522} alt="data-viz-designer Skill 的版本管理页面，展示 Git 分支、提交历史、文件目录和 SKILL.md 预览" />
      <EditorialNote label="闭环还差最后一步"><p>把新版本重新放回同一批 Query：如果人工标注中的问题减少，修改才算正向；如果没有，就带着新的证据继续迭代。</p></EditorialNote>
    </StorySection>

    <ChapterFooter index={1} bridge="这个案例跑通了一个小闭环。但把它推广到更多任务和 Harness 之前，还要先看清：RSI 最容易在哪些地方卡住？" sources={[]} />
  </article>;
}
