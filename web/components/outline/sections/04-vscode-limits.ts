import type { OutlineSectionData } from '../outline-data'

/**
 * 第 4 章「为什么类 VS Code 这种插件形式不行」
 * 依据：《一种面向时空可组合性的编程范式》§1.2.1（论文直接以 VSCode 为代表性案例）
 * 全文翻译：Cordis论文全文翻译-时空可组合性编程范式.md
 */
export const S04_VSCODE_LIMITS: OutlineSectionData = {
  id: 'vscode-limits',
  kicker: '反例剖析',
  title: '为什么 VS Code 式插件不行',
  intro:
    '论文以应用最广泛的可扩展 IDE——Visual Studio Code——为插件系统的代表性案例，从时间与空间两个维度剖析其局限；并指出这两个局限并非 VSCode 独有，而是在各类插件系统中普遍存在。',
  cards: [
    {
      badge: '01',
      title: '共享宿主：无法运行时卸载',
      en: 'Extension Host',
      tagline: '禁用或卸载一个含代码的扩展，需要重启整个扩展宿主',
      detail:
        'VSCode 在一个共享进程（扩展宿主）中运行所有扩展，宿主不提供任何在运行时卸载单个扩展代码的机制：一旦 activate 执行，移除它就得重启整个宿主，波及所有已加载的扩展。在安装量前 100 名的扩展中，87 个包含可执行代码，都逃不开这次重启。',
      images: [
        {
          src: '/outline/vscode-extension-host-architecture.png',
          caption:
            'VS Code 官方文档的架构图：所有扩展（图中橙色块）都堆叠在同一个 Extension Host 进程内——卸载其中一个意味着重启整个宿主，波及其他扩展',
          source: 'https://code.visualstudio.com/api/advanced-topics/remote-extensions',
        },
        {
          src: '/outline/cordis-lifecycle.png',
          caption:
            '论文图 1（组件生命周期）：Cordis 中 Fiber 经 L-Unload 应用累积器原地回到 Inactive——单个组件的运行时卸载无需重启任何宿主，正是 VS Code 缺的那条边',
          source: 'https://arxiv.org/abs/2608.25512',
        },
      ],
      points: [
        {
          text: '纯声明式扩展（主题、快捷键、代码片段）不含代码，可以自由移除；含代码的不行',
          source: '§1.2.1 插件系统',
        },
        {
          text: '前 100 名扩展中 87 个包含可执行代码，移除时都需要重启宿主（2026-06 数据）',
          source: '§1.2.1 插件系统（脚注 1）',
        },
        {
          text: '对照范式：可逆效应让「卸载 = 运行累积器」，原地撤销而不惊扰其他组件',
          source: '§3.1 可逆效应',
        },
      ],
    },
    {
      badge: '02',
      title: 'deactivate 钩子：清理难以验证',
      en: 'Locality of Concern',
      tagline: '清理逻辑与创建逻辑分离，违背关注点的局部性',
      detail:
        'VSCode 虽提供 deactivate 钩子，但它只是宿主进程终止期间的优雅关闭回调，并不能支持在运行中移除扩展。更根本的问题是：它把效应的处置与效应的创建（在 activate 中）分离开来，违背了关注点的局部性，使得完整清理难以验证——正确性依赖于每位作者自身的勤勉。',
      images: [
        {
          src: '/outline/vscode-activate-deactivate.png',
          caption:
            'VS Code 官方文档「Extension Entry File」：扩展入口导出 activate 与 deactivate 两个分离的函数——清理逻辑写在另一个钩子里、远离创建之处，完整清理只能靠作者自觉',
          source: 'https://code.visualstudio.com/api/get-started/extension-anatomy',
        },
      ],
      points: [
        {
          text: 'deactivate 只在宿主终止时触发，不构成运行时卸载机制',
          source: '§1.2.1 插件系统',
        },
        {
          text: '效应的创建与处置分离在两个钩子里，完整清理无法局部地验证',
          source: '§1.2.1 插件系统',
        },
        {
          text: '对照范式：逆操作在效应被应用之处一并返回、由运行时持有，创建与撤销天然同处',
          source: '§3.1 可逆效应',
        },
        {
          text: 'Koishi 实证：抽象一次性承担清理正确性，作者无需编写卸载路径',
          source: '§5.3 案例研究：Koishi',
        },
      ],
    },
    {
      badge: '03',
      title: '固定扩展点：依赖几乎不存在',
      en: 'Fixed Extension Points',
      tagline: '扩展只向宿主贡献功能，却没有安全、结构化的相互依赖方式',
      detail:
        'VSCode 的扩展 API 只暴露固定的、表层的扩展点（命令、视图、语言特性），扩展向宿主贡献功能而非彼此依赖，因此扩展间依赖很少出现：前 100 名扩展中只有 7 个声明了 extensionDependencies。唯一的扩展间交互机制 getExtension(...).exports 返回无类型的值（默认 any），依赖方得不到任何经过检查的接口。',
      images: [
        {
          src: '/outline/vscode-contribution-points-views.png',
          caption:
            'VS Code 官方文档的扩展点示例：扩展通过 contributes.views 向宿主贡献一个侧边栏视图——扩展点由宿主固定提供，扩展是「向宿主贡献」而非彼此依赖',
          source: 'https://code.visualstudio.com/api/references/contribution-points',
        },
      ],
      points: [
        {
          text: '扩展点由宿主固定提供，扩展被引导向宿主贡献，而非相互依赖',
          source: '§1.2.1 插件系统',
        },
        {
          text: '前 100 名扩展中仅 7 个对非内置扩展声明 extensionDependencies',
          source: '§1.2.1 插件系统（脚注 1）',
        },
        {
          text: 'exports 机制无类型、无结构化契约，依赖方无法依赖一个经过检查的接口',
          source: '§1.2.1 插件系统',
        },
        {
          text: '对照范式：响应式共效应把依赖声明为类型化规约，由系统在运行时解析与收回',
          source: '§3.2 响应式共效应',
        },
        {
          text: 'Koishi 反例：真实依赖拓扑在开放生态中成立——适配器、数据库驱动被功能插件声明为共效应',
          source: '§5.3 案例研究：Koishi',
        },
      ],
    },
    {
      badge: '04',
      title: '粒度错配：权宜之计的代价',
      en: 'Coarse-Grained Workarounds',
      tagline: '靠重启进程和容器编排兜底，丢弃状态且表达不了细粒度依赖',
      detail:
        '大多数软件靠操作系统与容器编排器这类粗粒度机制容忍细粒度可组合性的缺失：行为失常就重启进程，服务依赖交给编排器。但重启丢弃全部进程内累积状态（缓存、连接、半成品计算），维持可用性还要冗余副本；容器级编排既无法表达同一地址空间内组件的依赖，还为本可以是本地函数调用的交互引入网络开销。',
      images: [
        {
          src: '/outline/kubernetes-cluster-architecture.png',
          caption:
            'Kubernetes 官方架构图：编排器（控制平面 + kubelet）的管理粒度止步于节点与 Pod 边界——Pod 内部同一地址空间里组件之间的依赖，它既看不见也表达不了',
          source: 'https://kubernetes.io/docs/concepts/architecture/',
        },
      ],
      points: [
        {
          text: '时间维度：每次重启丢弃进程内状态，重建需数秒到数分钟',
          source: '§1.2.3 粗粒度的权宜之计',
        },
        {
          text: '空间维度：容器编排无法表达共享同一地址空间的组件之间的依赖',
          source: '§1.2.3 粗粒度的权宜之计',
        },
        {
          text: '症结是粒度错配：机制作用于进程与容器边界，而现代系统在更细的层面组合',
          source: '§1.2.3 粗粒度的权宜之计',
        },
        {
          text: '论文主张：需要一种组合式抽象，在与组件本身相同的层面管理效应与依赖',
          source: '§1.2.3 粗粒度的权宜之计',
        },
      ],
    },
  ],
}
