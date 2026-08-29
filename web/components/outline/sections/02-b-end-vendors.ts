import type { OutlineSectionData } from '../outline-data'

export const S02_B_END: OutlineSectionData = {
  id: 'b-end-vendors',
  kicker: '为什么 Harness 热度这么高 · B 端 Harness 厂商',
  title: 'B 端厂商：办公入口争夺战',
  intro:
    'C 端免费换规模的路线撑不起算力成本，付费转化迟迟未被验证。大厂于是集体转向 B 端：谁把 Harness 嵌进企业办公流，谁就拿住下一个生态入口。',
  cards: [
    {
      badge: '01',
      title: 'C 端订阅路线遇阻',
      en: 'The Limits of C-End',
      tagline: '豆包 MAU 数亿却算不过账，C 端免费路线难以为继',
      detail:
        '豆包是 C 端路线的极限样本：坐拥国民级流量，却迟迟跑不通商业化。2026 年 5 月起豆包测试三档付费订阅，但国内 C 端订阅普遍面临续费率低、算力成本倒挂的结构性难题，付费转化与 ARPU 仍需时间验证。这印证了一个判断：C 端「免费获客、订阅变现」在国内尚未被证明成立，厂商必须向生产力与 B 端场景要收入。',
      images: [
        {
          src: '/outline/doubao-subscription-tiers.jpg',
          caption:
            '豆包 App 内的订阅服务声明截图：标准版 68 元/月、加强版 200 元/月、专业版 500 元/月，免费版基础功能不变——C 端「免费获客、订阅变现」路线的首次大规模试水',
          source: 'https://finance.sina.com.cn/stock/t/2026-05-05/doc-inhwvumi4103265.shtml',
        },
        {
          src: '/outline/doubao-usage-ranking.jpg',
          caption:
            '花旗研究对中国 AI 产品使用率的调查：豆包以 79% 遥遥领先——坐拥国民级流量，却仍需向付费与 B 端场景要收入',
          source: 'https://finance.sina.com.cn/stock/t/2026-05-05/doc-inhwvumi4103265.shtml',
        },
      ],
      points: [
        {
          text: '2026-05-04 豆包在 App Store 更新付费声明，测试三档订阅：标准版 68 元/月、加强版 200 元/月、专业版 500 元/月，付费聚焦生产力场景，免费版基础功能不变',
          source: 'https://www.huxiu.com/article/4870308.html',
        },
        {
          text: '豆包月活达 3.45 亿（截至 2026 年 3 月，QuestMobile 数据），但报道指出国内 C 端订阅面临续费率低、算力成本倒挂等结构性难题',
          source: 'https://cj.sina.com.cn/articles/view/7857201856/1d45362c001906hd3u',
        },
        {
          text: '机构观点：豆包付费聚焦复杂任务与生产力场景，标志国产大模型应用从「免费获客、规模扩张」进入「付费转化、价值验证」阶段',
          source: 'https://m.cls.cn/detail/2407604',
        },
        {
          text: '媒体普遍将此次试水视为行业级实验：「C 端用户愿不愿意为 AI 付费」长期悬而未决，豆包的付费转化率将直接探明国内 AI 付费的规模天花板',
          source: 'https://finance.sina.com.cn/stock/t/2026-05-05/doc-inhwvumi4103265.shtml',
        },
      ],
    },
    {
      badge: '02',
      title: '大厂押注 B 端办公 Harness',
      en: 'The New Gateway',
      tagline: '腾讯、字节、阿里、微软齐下场，办公入口正在重排',
      detail:
        '2026 年上半年，大厂在 B 端办公智能体上密集出手：腾讯把桌面智能体和企业微信打通，字节把飞书变成 agent 平台，阿里钉钉推「AI 员工」，微软持续把 Copilot 织进办公全家桶。共识很清晰——企业办公流是 Harness 最大的落地场景，也是新的生态入口。',
      images: [
        {
          src: '/outline/workbuddy-enterprise-suite.png',
          caption:
            '腾讯 WorkBuddy 企业版及办公智能体套件全景图：企业 AI 工作台 + Skill 市场 + Connector 接入现有 OA/CRM/会议工作流，办公入口被整体重构为 agent 平台',
          source: 'https://www.sohu.com/a/1032778701_374240',
        },
        {
          src: '/outline/wecom-cli-github-readme.png',
          caption:
            '企业微信开源 CLI（WecomTeam/wecom-cli）的 README 功能范围表：消息、邮件、文档、日程、会议等核心办公能力全部向 AI agent 开放',
          source: 'https://github.com/WecomTeam/wecom-cli',
        },
        {
          src: '/outline/feishu-aily-agent-chat.png',
          caption:
            '飞书 aily 智能体对话界面：内置消息、会议、多维表格、日程、云文档、PPT、Excel 等飞书技能，AI 产出直接沉淀为协作对象',
          source: 'https://www.feishu.cn/content/article/7621764358124604369',
        },
      ],
      points: [
        {
          text: '腾讯 WorkBuddy：2026-03-09 上线全场景桌面智能体，兼容 OpenClaw 技能，1 分钟接入企业微信即可远程「遥控」干活；6 月发布企业版与 Skill 市场（收录过万技能），Connector 可一键接入 OA、CRM、腾讯会议等现有工作流',
          source: 'https://www.sohu.com/a/1032778701_374240',
        },
        {
          text: '企业微信开源 CLI：2026-03-30 上架 GitHub，向 Claude Code、Codex、WorkBuddy、QClaw 等主流 agent 开放消息、日程、文档、会议等 7 大核心能力',
          source: 'https://tech.ifeng.com/c/8ruZUiurEyV',
        },
        {
          text: '飞书 aily：飞书原生 Agent 办公平台，结合企业内部知识库与工作上下文完成调研分析、内容产出、跨项目跟进，AI 产出直接沉淀为文档、多维表格、任务卡片等协作对象',
          source: 'https://www.feishu.cn/content/article/7621764358124604369',
        },
        {
          text: '钉钉悟空：主打「AI 员工」逻辑，强调自主执行与业务流自动化，与飞书 aily、WorkBuddy 形成三大办公智能体对垒',
          source: 'http://www.iheima.com/article-395686.html',
        },
        {
          text: '微软 Microsoft 365 Copilot：官方发行说明保持高频迭代，持续把 agent 能力织入 Office 办公全家桶，是全球 B 端办公入口的标杆玩家',
          source: 'https://learn.microsoft.com/zh-cn/microsoft-365/copilot/release-notes',
        },
      ],
    },
    {
      badge: '03',
      title: 'B 端为什么愿意付费',
      en: 'Why Enterprises Pay',
      tagline: '数据私有、流程定制、可审计—— Harness 恰好都踩在点上',
      detail:
        'C 端用户为「更好聊」付钱的意愿有限，企业却愿意为「能进流程、能管权限、能查账」的 AI 付高价。Harness 把模型包进可管控的执行系统，天然契合 B 端的采购逻辑：数据不出私域、流程按需定制、行为全程可审计。',
      images: [
        {
          src: '/outline/feishu-aily-enterprise-security.png',
          caption:
            '飞书官方对 aily 企业级特性的表述：「所有内容都属于企业，权限清晰，可以追溯」「数据不出企业」「统一购买、用量分配和管控」——正是 B 端采购逻辑的三块基石',
          source: 'https://www.feishu.cn/content/article/7621764358124604369',
        },
        {
          src: '/outline/harnesseval-agentic-eval.png',
          caption:
            'HarnessEval 的 Agentic Evaluation 架构：模型输出经技能库调用评测工具，层层汇聚为 Skill Evidence 证据再得出最终分数——每个分数都可追溯、可审计',
          source: 'https://mp.weixin.qq.com/s/T_fBh7p82OHaKw75oq-5cQ',
        },
      ],
      points: [
        {
          text: '数据私有与权限可控：飞书 aily 支持对接企业自有知识库与业务系统，经权限配置后才允许 AI 基于内部数据生成内容',
          source: 'https://agent.csdn.net/6a5a0daf10ee7a33f28e806a.html',
        },
        {
          text: '流程定制：WorkBuddy 企业版让员工封装企业专属 Skill 并共享给团队，「个体经验转化为团队资产」；Connector 基于统一身份体系对接企业已有工作流',
          source: 'https://www.sohu.com/a/1032778701_374240',
        },
        {
          text: '可审计：HarnessEval 代表的评测范式把每个分数落成可追溯的证据树，「可检查、可复现、可追责」正是企业采购与合规的硬要求',
          source: 'https://mp.weixin.qq.com/s/T_fBh7p82OHaKw75oq-5cQ',
        },
      ],
    },
  ],
}
