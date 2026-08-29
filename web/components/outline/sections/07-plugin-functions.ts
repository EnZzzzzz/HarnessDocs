import type { OutlineSectionData } from '../outline-data'

export const S07_PLUGIN_FUNCTIONS: OutlineSectionData = {
  id: 'plugin-functions',
  kicker: '插件式 Function 拓展 · Self-Built Plugins',
  title: 'Function 拓展式的自进化',
  intro:
    '当模型遇到一个现成插件解决不了的问题，理想形态是：它现场把所需的 Function 开发出来、装进来、用完还能复用。以 DeepSeek Harness 为例看这个闭环如何成立。',
  cards: [
    {
      badge: '01',
      title: '底座：一切皆插件',
      en: 'Everything Is a Plugin',
      tagline: '模型、工具、会话、UI 全是插件，能力边界由插件决定',
      detail:
        'DeepSeek Harness 建立在 Cordis 插件内核之上：模型、工具、技能、会话、沙箱、存储、循环、调度乃至 UI 全部是插件。模型能做什么，不取决于写死的代码，而取决于当前挂载了哪些插件——这为"自己给自己装能力"提供了结构前提。',
      images: [
        {
          src: '/outline/dsh-plugins-panel.png',
          caption:
            '官方 Settings → Plugins 面板：一个部署挂载了 159 个插件，llm、session、timer、api-gateway 等核心能力都以插件形式列出并可独立启停——"一切皆插件"的直接写照',
          source: 'https://deepseek.com/harness/en/',
        },
      ],
      points: [
        {
          text: 'Cordis 内核负责插件的挂载、卸载与依赖管理，agent 能力全部住在插件里',
          source: 'https://deepseek.com/harness/en/',
        },
        {
          text: '插件覆盖模型、工具、技能、会话、沙箱、存储、循环、调度与 UI，可混合、替换、扩展',
          source: 'https://www.theregister.com/ai-and-ml/2026/08/14/deepseeks_innovative_harness_treats_everything_as_a_plug-in/5288095',
        },
        {
          text: '开发者不改 Harness 源码，仅在配置中选择、替换、扩展任意能力',
          source: 'https://deepseek.com/harness/en/',
        },
        {
          text: '编者按：大纲提到的"DeepSeek Honeycomb"未检索到对应产品，本卡依据 DeepSeek Harness 官方资料撰写',
          source: 'https://github.com/deepseek-ai/deepseek-harness',
        },
      ],
    },
    {
      badge: '02',
      title: '现场造插件',
      en: 'Creator Mode',
      tagline: '检查运行时、内存里试插件，模型自己攒出新能力',
      detail:
        'Harness 的 Creator 模式把"造插件"变成 agent 的常规动作：模型可以检查当前运行时状态，在内存中热加载、试验 Cordis 插件（不必建文件、装依赖），再把可用的组合固化成新的 Agent 预设。B 端场景里，企业可以让 agent 针对内部系统现场长出专属 Function。',
      images: [
        {
          src: '/outline/dsh-creator-word-count-prompt.png',
          caption:
            '实测对话：用户要求"用动态 Cordis 插件临时创建 word_count 工具"，模型加载 cordis-plugin-development 技能后先调用 cordis_inspect_list 检查运行时——正是 Creator 模式的标准动作',
          source: 'https://www.codefather.cn/post/2092472825448239106',
        },
        {
          src: '/outline/dsh-creator-plugin-registered.png',
          caption:
            '插件热加载后的验证过程：cordis_run 运行成功，word_count 真实注册进当前进程的工具列表；完成情况表记录了从环境检查、定义、修 schema 错误到注册验证的全过程',
          source: 'https://www.codefather.cn/post/2092472825448239106',
        },
      ],
      points: [
        {
          text: 'Creator 模式可检查当前运行时、在内存中试验 Cordis 插件、组合出新模式',
          source: 'https://deepseek.com/harness/en/',
        },
        {
          text: '动态插件能力不需建文件、不需装依赖，可直接在对话中试验插件组合',
          source: 'https://www.codefather.cn/post/2092472825448239106',
        },
        {
          text: '造插件的过程被视为训练数据入口：模型可从中学习如何设计插件',
          source: 'https://news.qq.com/rain/a/20260820A0BZZE00',
        },
        {
          text: '社区已出现"插件开发技能"插件：任何 agent 加载后即可按统一规范开发 DSH 插件',
          source: 'https://github.com/zimodzh/dsh-plugin-dev-skills',
        },
      ],
    },
    {
      badge: '03',
      title: '插件市场闭环',
      en: 'Plugin Ecosystem',
      tagline: '搜索、审查、安装、卸载，插件像应用一样可分发',
      detail:
        '造出来的插件不是一次性的：`dsh plugin add` 支持从 npm 或 GitHub 安装，官方用 GitHub `dsh-plugin` 话题做发现入口；社区市场上甚至出现面向模型的 `plugin_search / plugin_vet / plugin_install` 工具链，让 agent 自己完成"找插件→查安全→装进来"的全流程。',
      images: [
        {
          src: '/outline/dsh-plugin-topic-github.png',
          caption:
            'GitHub `dsh-plugin` 话题页：已有 12,601 个公开仓库挂靠该话题，deepseek-harness 官方仓库同样以 `dsh-plugin` 标签被索引——打标签即被生态发现的约定已经成立',
          source: 'https://github.com/topics/dsh-plugin',
        },
        {
          src: '/outline/dsh-plugin-install-chat.png',
          caption:
            '实测安装流程：用户直接把 GitHub 仓库地址丢进对话，模型理解意图后自行完成插件安装——插件像应用一样可分发的闭环体验',
          source: 'https://www.codefather.cn/post/2092472825448239106',
        },
      ],
      points: [
        {
          text: '`dsh plugin --profile web add github:owner/repo` 一条命令安装，包操作转发给 pnpm',
          source: 'https://github.com/0xsline/awesome-deepseek-harness',
        },
        {
          text: '官方约定：给插件仓库打上 `dsh-plugin` 话题标签即可被生态发现',
          source: 'https://github.com/deepseek-ai/deepseek-harness',
        },
        {
          text: '面向模型的插件市场插件提供 plugin_search / plugin_vet / plugin_report / plugin_install 流程',
          source: 'https://github.com/ACEMaravilla/dsh-plugin-market',
        },
        {
          text: '插件在 Settings → Plugins 面板中可视化管理，支持启用/禁用',
          source: 'https://github.com/0xsline/awesome-deepseek-harness',
        },
      ],
    },
    {
      badge: '04',
      title: '生活场景想象',
      en: 'Everyday Scenarios（示例）',
      tagline: '一句话订票、追球赛比分，缺什么插件现场造',
      detail:
        '（假设性示例，机制基于卡片 02/03）用户对 agent 说"帮我抢下周五晚上的电影票"：agent 发现没有订票插件，便在 Creator 模式下现场写一个调用票务接口的 Function 插件，热加载测试通过后完成下单；再说"盯一下今晚的比分"，它要么从市场搜一个球赛插件，要么照样现造一个——用完的插件留在库里，下次一句话直接调用。',
      images: [
        {
          src: '/outline/dsh-trajectory-self-build-tool.png',
          caption:
            '官方 Trajectory 视图里的真实轨迹：用户一句"Build yourself a tool"，agent 连续调用 bash 检查环境、解压会话数据、验证工具可行性——卡片设想的"缺什么现场造"机制在官方演示中已有雏形',
          source: 'https://deepseek.com/harness/en/',
        },
      ],
      points: [
        { text: '示例场景：用户一句话"买电影票"，agent 现场开发订票 Function 插件并完成任务' },
        { text: '示例场景：说"追球赛比分"，agent 优先搜索市场现成插件，没有再自己造' },
        {
          text: '机制支撑：内存中试验插件 + 固化为预设，来自 Creator 模式的真实能力',
          source: 'https://deepseek.com/harness/en/',
        },
        {
          text: '机制支撑："搜索→审查→安装"的自助闭环，来自社区模型向插件市场',
          source: 'https://github.com/ACEMaravilla/dsh-plugin-market',
        },
      ],
    },
  ],
}
