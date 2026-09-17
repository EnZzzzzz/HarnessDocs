import type { Metadata } from "next";
import { ChapterHeader, StorySection, EditorialNote, ChapterFooter } from "@/components/chapter-layout";
import { ChapterFigures } from "@/components/chapter-figures";
import { ProposalImage } from "@/components/proposal-image";

export const metadata: Metadata = { title: "评测与人的判断", description: "自动评测尚未齐备时，先让人查看产物、走通交互、留下评审依据，再决定下一次 Skill 修改。" };

export default function ReviewPage() {
  return <article className="page narrative-page">
    <ChapterHeader index={2} title={<>有没有变好，<br />先让人<em>看得清。</em></>} lead={<><p>两份 Skill 做完了同一组任务，结果已经摆在眼前。一个页面更漂亮，但表单不能提交；另一个视觉普通，却把交互做完整了。</p><p>这时候，一个总分未必说得清问题。现阶段可以先没有自动评测环节：让人看产物、试操作、说明理由，再决定下一步怎么改。</p></>} />
    <div className="human-first-label"><span className="red-dot" /> 当前方向：人工判断为主 · 自动评测可后续补充</div>
    <ProposalImage file="mockup-09-experiment-comparison.png" title="03 / 把两次结果放在一起看" caption="对比界面的设计设想。图中数值仅为配图示例；当前汇报重点是产物对照与人工判断，不以示例分数作结论。" priority />
    <StorySection id="run" number="01" title="先把产物跑出来，也留下它怎么来的。">
      <p>选择 Skill 版本、任务以及运行配置，提交一次实验（Experiment）。本地 Runner 为每次执行（Run）建立独立工作目录，调用 DeepSeekHarness，留下运行日志与生成产物。</p>
      <ChapterFigures label="查看执行过程配图" items={[
        {file:"mockup-07-new-experiment.png",title:"新建实验",caption:"提交时固定能力与用例版本、模型、底座及运行参数，方便之后回看差异。"},
        {file:"mockup-08-run-detail.png",title:"执行详情",caption:"沿着一次执行查看日志、失败阶段、产物和本地预览入口。图中状态为设计示例。"},
      ]} />
      <p>HTML 页面和 React 项目在本地预览。云端负责保存记录、展示已上传的截图与报告。执行失败也留下已有产物和原因；重新执行创建新的 Run，不把原来的失败尝试抹掉。</p>
    </StorySection>
    <StorySection id="human-review" number="02" title="人的判断，也可以留下清楚的依据。">
      <p>先确认两次任务使用了相同的用例版本，再核对 Skill 之外的配置有没有变化。然后打开页面，沿着任务里的预期行为操作，回到具体位置描述差别。</p>
      <div className="review-example"><span className="eyebrow accent">评审表达示意</span><div><span>最初的感觉</span><p>“这个版本更好了。”</p></div><div><span>可以帮助下一次修改的判断</span><p>“窄屏下，作品列表已经不再溢出；但详情页返回后筛选条件丢失。这次布局修改值得保留，下一版补查返回流程。”</p></div></div>
      <p>可以记录评分，但评分需要跟着评审人、时间和备注一起保存。没有分数时，就展示观察和待确认项，不用一个数字填补判断。修改人工评分要保留历史；重新评审同一产物，也应新增记录。</p>
      <EditorialNote label="判断要能找到对应的页面"><p>记录这次看的是哪份产物快照，附上截图、问题位置和操作步骤。之后即使工作目录又改了，也能回到当时受评的版本。</p></EditorialNote>
    </StorySection>
    <StorySection id="automation" number="03" title="自动检查可以帮忙，但不必等它齐备才开始。">
      <p>一些问题适合先交给程序：项目能否安装、构建和启动。浏览器交互检查、模型评审和视觉评分，可以在规则清楚、工具具备之后逐步补上。</p>
      <div className="review-stages"><article><span>现在先做</span><h3>人看结果，留下理由</h3><p>使用固定用例，查看产物、实际操作，决定保留什么、下一轮改什么。</p></article><article><span>按需补充</span><h3>用工具收集更多证据</h3><p>先接可运行性检查，再按具体任务引入交互测试或其他自动评测。</p></article></div>
      <p>有了自动结果，也要分清：项目构建失败、评测器自己出错、还没评分，是三种不同情况。缺失评分不能默认为零分或满分；正式计分时，必填项缺失应显示“未完成”。</p>
      <p>同样，执行流程结束不代表任务全部达标。页面上应分别说明执行状态、评审状态和同步状态，让人知道自己究竟还能依据什么作判断。</p>
    </StorySection>
    <StorySection id="keep-evidence" number="04" title="最后，把这次判断送回下一次修改。">
      <p>看到问题以后，从当前 Skill 派生下一版，写下修改理由，再拿同一组用例复查。这里由人决定是否保留改动、是否调整默认版本；自动修改和自动晋升版本暂不作为前提。</p>
      <ProposalImage file="mockup-10-artifact-archive.png" title="留下产物，也留下证据的可用状态" caption="默认同步实验记录与指定证据。源码、完整日志按需追加归档，已登记文件不等于已经上传。" />
      <p>等待人工评审时，已有记录和证据仍可同步。Runner 用后台队列处理上传，断网或重启后补传。同步失败不改变执行结论；只有本地副本的源码，也不能因为云端已经有一条记录，就当作可以恢复。</p>
      <EditorialNote label="这一轮真正完成的闭环"><p>保存能力版本 → 用同一组任务生成 → 人查看并记录判断 → 根据问题派生新版本。自动评测以后可以加入，人的迭代现在就能开始。</p></EditorialNote>
    </StorySection>
    <ChapterFooter index={2} bridge="下一次打开版本树时，我们希望看到的不只是又多了一个版本，而是知道它为什么出现，以及准备解决什么问题。" sources={[{file:"03-benchmarks.md",label:"人工评分与证据"},{file:"04-experiments.md",label:"实验与对比"},{file:"06-artifacts-sync.md",label:"采集与同步"}]} />
  </article>;
}
