# Open Design Skill Prompt 注入机制调研

> 调研对象：`/mnt/data/c30011421/proj/public/open-design`（daemon 为每次运行拼一条 ~66KB 提示词栈注入给 Claude Code CLI，其中 `skillPrompt` 段来自「激活技能」的 SKILL.md body）。
> 结论以源码 `file:line` 标注，附真实运行佐证。仓库内相对路径均相对仓库根。

---

## 0. 机制总览

技能注入是一条单向数据流：

```
SKILL.md（内置 skills/ 或 design-templates/ 或 用户 USER_SKILLS_DIR 或 插件 fsPath）
   └─ listSkills() 扫描根目录 + parseFrontmatter 解析 frontmatter → SkillInfo { id, body, dir, mode, craftRequires, critiquePolicy, ... }
        └─ findSkillById(allSkills, effectiveSkillId) 选中【主技能】；adHocSkillIds 逐个追加【Composed skill】块
             └─ 插件快照若声明 od.context.skills：本地 SKILL.md 覆盖主技能（优先级最高）
                  └─ composeSystemPrompt({ skillBody, skillName, skillMode, craftBody, ... })
                       └─ 按固定格式注入 `## Active skill — <name>` 块（+ craft 块、deck framework、critique 面板、plugin 块）
                            └─ 同时把 activeSkillDirs 拷贝到 <cwd>/.od-skills/<folder>-<digest>/（stageActiveSkill）
                                 └─ promptTelemetry.skillPrompt 段记录 body 的字节/指纹/脱敏内容
```

关键点：`loadAllSkills()` 一次加载**全部**技能（供 `/api/skills` 列表与 id 解析），但**只有**被 `findSkillById` 选中的主技能 + 本轮 ad-hoc 技能 + 插件本地技能会拼进 `skillBody`，其余技能不进提示词。

---

## 1. 选择（Selection）

### 1.1 主技能（primary skill）由什么决定

`apps/daemon/src/server.ts:3618-3619`：

```ts
const effectiveSkillId =
  typeof skillId === 'string' && skillId ? skillId : project?.skillId;
```

- 本轮请求带 `skillId`（web 每次 turn 可选、`POST /api/runs` 可带）→ **本轮优先**。
- 否则回落到项目持久化的 `skill_id`（SQLite projects 表，见 `apps/daemon/src/db.ts:61`）。

### 1.2 完整优先级链路

| 优先级 | 来源 | 代码位置 |
|---|---|---|
| 1 | 插件本地 SKILL.md（`od.context.skills[{path}]`） | `server.ts:3788-3792` 覆盖 |
| 2 | 本轮请求 `skillId` | `server.ts:3618` |
| 3 | 项目持久化 `skill_id` | `server.ts:3618-3619` |
| 4 | 插件按 `ref` 引用全局技能（`od.context.skills[{ref}]`） | `server.ts:3801-3824` |
| 5 | ad-hoc 每轮技能（`skillIds` 数组，composer @-mention） | `server.ts:3654-3659` + `3722-3765` |
| 6 | 默认路由 od-default（实为场景插件本地技能） | 见 1.4 |

### 1.3 为什么 `loadAllSkills()` 加载全部但只有激活技能进提示词

- `loadAllSkills()`（`server.ts:3641-3645`）把 `listAllSkillLikeEntries()` 结果缓存进 `allSkillsPromise`，每次 compose 只算一次。
- `listAllSkillLikeEntries()`（`apps/daemon/src/design-systems/server-services.ts:109-111`）→ `skills.listSkills(ALL_SKILL_LIKE_ROOTS)`，返回**完整目录**（UI 的 `/api/skills` 也用它，见 `apps/daemon/src/routes/static-resource.ts:164-178`）。
- 提示词组装只用 `findSkillById(allSkills, effectiveSkillId)` 取**一个**主技能 body（`server.ts:3703-3721`），再循环 `adHocSkillIds` 取每个 ad-hoc 技能 body（`server.ts:3730-3755`）。其余技能只是目录里躺着，不注入。

### 1.4 默认路由：od-default

`od-default` **不是** `skills/` 注册表里的技能，而是**内置场景插件** `plugins/_official/scenarios/od-default/`，自带本地 `SKILL.md`：

- web 侧在自由输入 Home prompt 未选分类 chip 时绑定它：`DEFAULT_UNSELECTED_SCENARIO_PLUGIN_ID = 'od-default'`（`packages/contracts/src/plugins/scenario-defaults.ts:52-53`），应用点 `apps/web/src/App.tsx:1798`、`apps/web/src/components/HomeView.tsx:2007`、`apps/web/src/components/EntryShell.tsx:722`。
- kind → 场景插件映射表：`scenario-defaults.ts:55-70`（prototype→`example-web-prototype`、deck→`example-simple-deck`、template/other→`od-new-generation`、image/video/audio→`od-media-generation`）；intent 特例 `live-artifact`→`example-live-artifact`、`web-clone`→`example-web-clone`（`scenario-defaults.ts:86-92`）。
- 绑定后插件快照携带 `od.context.skills[{path:'./SKILL.md'}]`（`plugins/_official/scenarios/od-default/open-design.json`），daemon 经 `loadPluginLocalSkill` 把它读成 `skillBody`，注入格式与普通技能一致（`## Active skill — Default design router`）。

所以「无技能时的默认路由」本质上是**一个插件驱动的技能注入**，而不是注册表默认技能。

### 1.5 选择依据的真实链路（web 路由 → daemon 解析）

上面的 1.1-1.4 只讲了 daemon 组装期的解析；**「选哪个 skill」真正由 web 侧先定**。三者（模板 / 类型 chip / 显式技能选择）路由方式互斥：

**A. Home 自由输入 composer**（`apps/web/src/components/HomeView.tsx:2004-2008`）

```ts
const resolvedSkillId = submittedActive ? null : activeSkill?.id ?? null;
const routedPluginId =
  sessionMode === 'design'
    ? submittedActive?.record.id ?? DEFAULT_UNSELECTED_SCENARIO_PLUGIN_ID
    : submittedActive?.record.id ?? null;
```

- 选了场景 chip / preset 卡（`submittedActive` 非空）→ `skillId = null`，技能体走 **scenario 插件**：design 模式未选时兜底 `od-default`，选 deck chip 则其插件 `example-simple-deck` 等，compose 时插件本地 SKILL.md 成为技能体。
- 没选 chip、但显式点了技能（`activeSkill`）→ `skillId = activeSkill.id`。
- **两类互斥**：chip 与显式技能不会同时生效。

**B. 新建项目面板**（`apps/web/src/components/NewProjectPanel.tsx:768`）

```ts
skillId: startTemplateId ?? skillIdForTab,
```

- `startTemplateId` = 「Start from」模板卡片。**design-templates 目录本身就是 skill-like entry**（在 `ALL_SKILL_LIKE_ROOTS` 内、带 SKILL.md），所以**选模板 = 直接把模板 id 当 skillId**，这就是「选了模板就捞出关联 skill」的最直接路径。
- `skillIdForTab`（`NewProjectPanel.tsx:494-537`）= tab 默认技能：prototype → prototype 模式中 `od.default_for` 含 'prototype' 的第一个；deck → 同理；live-artifact → `live-artifact` 技能（名精确匹配/启发式）；media → surface 匹配技能，视频选 hyperframes-html 模型时 pin 到 `hyperframes`；other → null。

**C. 已有项目聊天**（`apps/web/src/components/ProjectView.tsx:5917-5918`）

```ts
skillId: project.skillId ?? null,
skillIds: Array.isArray(meta?.skillIds) ? meta.skillIds : [],
```

- 项目技能选择器（`ChatComposer.tsx:2393` `patchProject(projectId, { skillId: skill.id })`）把选择**持久化**到 `projects.skill_id`（`apps/daemon/src/db.ts:61, 864`），之后每轮沿用。
- `@`-mention 追加的技能走 `skillIds` 数组 → compose 时变成 `## Composed skill` 独立块（见 4.3）。

**daemon 组装期的最终解析**（`apps/daemon/src/server.ts:3618-3834`）：

1. `effectiveSkillId = 本轮请求 skillId ?: 项目 skill_id`（`server.ts:3618-3619`）；
2. 全局解析 `findSkillById`，跨 `ALL_SKILL_LIKE_ROOTS`（skills ∪ design-templates，`server.ts:3703-3721`）；
3. ad-hoc `skillIds` 逐个追加为 `## Composed skill` 块（`server.ts:3722-3765`）；
4. **插件本地 SKILL.md 无条件覆盖**主技能（`server.ts:3786-3792`），插件 `ref` 全局技能则用被引技能 body（`server.ts:3801-3824`）；
5. **兜底默认**：run 未带显式插件、项目也未 pin 插件快照时，daemon 按 `project.metadata.kind/intent` 绑默认场景插件（`apps/daemon/src/routes/runs.ts:742-755`，映射表 `packages/contracts/src/plugins/scenario-defaults.ts:55-92`）→ 该插件本地 SKILL.md 成为技能体。

**回答「选了模板是否就捞出关联 skill」**：要区分两种「模板」——

- **design-template**（「Start from」卡片 / 模板画廊）：本身就是注册表里的 skill-like 条目，`id` 直接当 `skillId`，**选模板 = 选技能**（直连）。
- **类型 chip / project kind**（prototype / deck / image / video / audio…）：kind → scenario 插件（`example-web-prototype` / `example-simple-deck` / `od-media-generation`…）→ 插件自带的 `od.context.skills[{path}]` 本地 SKILL.md，**是「经插件间接捞」**。

---

## 2. 加载（Loading）

### 2.1 扫描根目录（listSkills）

`apps/daemon/src/skills.ts:145-314`：

- 对每个 root 的每个目录/符号链接检查 `<dir>/SKILL.md`（`skills.ts:161-168`）。
- `parseFrontmatter(raw)`（`apps/daemon/src/design-systems/frontmatter.ts:22-33`）用正则 `/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/` 拆出 frontmatter 与 body；**body = 关闭 `---` 之后的全部 markdown**。`parseYamlSubset` 只支持标量/块字面量(`|`)/平铺数组（`frontmatter.ts:37+`）。
- `id` = frontmatter `name`，缺省用文件夹名（`skills.ts:174-175`）。
- 派生的示例卡 `<parent>:<child>` 来自 `examples/*.html`（`skills.ts:268-307`），继承父技能 body（保证 'Use this prompt' 有系统提示）。
- 若技能目录附带侧文件（`dirHasAttachments`，`skills.ts:464-475`），body 前拼 `withSkillRootPreamble`（`skills.ts:214-216, 418-454`）：一段 markdown blockquote，声明 `.od-skills/<folder>-<digest>/`（相对项目 cwd）与绝对路径两个技能根，并列出 `assets/`、`references/` 侧文件名（正则抓取 `skills.ts:456-462`）。

### 2.2 根目录（技能/设计模板拆分）

`apps/daemon/src/server.ts:908-915`：

```ts
const SKILL_ROOTS = [USER_SKILLS_DIR, SKILLS_DIR];
const DESIGN_TEMPLATE_ROOTS = [USER_DESIGN_TEMPLATES_DIR, DESIGN_TEMPLATES_DIR];
const ALL_SKILL_LIKE_ROOTS = [USER_SKILLS_DIR, USER_DESIGN_TEMPLATES_DIR, SKILLS_DIR, DESIGN_TEMPLATES_DIR];
```

- 内置根：`SKILLS_DIR`/`DESIGN_TEMPLATES_DIR` 经 `resolveDaemonResourceDir`（`server.ts:783-801`）解析，本地开发回落到 `<projectRoot>/skills`、`<projectRoot>/design-templates`；打包运行时指向 `DAEMON_RESOURCE_ROOT` 下的资源（`apps/daemon/src/daemon-paths.ts:71-97`）。
- 用户根：`USER_SKILLS_DIR = <RUNTIME_DATA_DIR>/skills`、`USER_DESIGN_TEMPLATES_DIR = <RUNTIME_DATA_DIR>/design-templates`（`server.ts:887, 901`），完全受 `OD_DATA_DIR` 控制。
- 拆分规则（功能技能 vs 渲染模板）见 `specs/current/skills-and-design-templates.md:39-43` 与 `skills/AGENTS.md`、`design-templates/AGENTS.md`。

### 2.3 Shadow 机制（用户技能覆盖内置技能）

- 根目录按优先级排列，**第一个 root 命中即胜**（`skills.ts:6-7, 151-179`）：`USER_SKILLS_DIR` 在前，所以同名用户技能 shadow 内置技能，内置副本不删除、只是不出现在目录里。
- `source = rootIdx===0 ? 'user' : 'built-in'`（`skills.ts:154`），UI 据此渲染来源徽章并门禁删除。
- 编辑内置技能 = `updateUserSkill` 向 `USER_SKILLS_DIR/<slug>/SKILL.md` 写一份 shadow 副本；**首次** shadow 会把内置的 `assets/ references/ scripts/ examples/` 侧文件克隆进 shadow 目录（`skills.ts:906-922, 933-955`），保证 `/api/skills/:id/files`、`/example`、`/assets/*` 与系统提示 preamble 仍能解析侧文件。

### 2.4 插件本地技能（plugin-local SKILL.md）

`apps/daemon/src/plugins/local-skill.ts:33-60`：

- 从插件 manifest `od.context.skills` 取第一个非 `ref` 的 `path`（`apply.ts:322-326` `pickFirstLocalSkillPath`），拒绝 `..` 越权（`local-skill.ts:43`）。
- 读 `<plugin.fsPath>/<relpath>`，`stripFrontmatter`（`local-skill.ts:69-75`）后返回 `{ body, name: manifest.title ?? name ?? plugin.id, dir: path.dirname(abs), relpath }`。
- 用法在 `server.ts:3786-3792`；插件本地技能**从不注册进全局目录**，是提示词组装期间唯一读取方（`local-skill.ts:8-11`）。
- 若插件声明的是 `{ref: '<skill-id>'}` 引用全局技能，则走 `server.ts:3801-3824` 从全局目录解析。

---

## 3. 注入（Injection）

### 3.1 注入的精确格式

`apps/daemon/src/prompts/system.ts:1181-1186`：

```ts
if (skillBody && skillBody.trim().length > 0) {
  const preflight = derivePreflight(skillBody);
  parts.push(
    `\n\n## Active skill${skillName ? ` — ${skillName}` : ''}\n\nFollow this skill's workflow exactly.${preflight}\n\n${skillBody.trim()}`,
  );
}
```

即：

```
## Active skill — <skillName>

Follow this skill's workflow exactly.<preflight>

<body: SKILL.md 去 frontmatter 后的 markdown>
```

- `derivePreflight`（`system.ts:2059-2076`）：body 里正则命中 `assets/template.html`、`references/layouts.md`、`references/themes.md`、`references/components.md`、`references/checklist.md`、`references/html-in-canvas.md` 之一，就追加「**Pre-flight (do this before any other tool): Read ...**」硬前置指令。
- 契约层镜像 `packages/contracts/src/prompts/system.ts:422-425` 格式字节级一致（BYOK/plain 适配器走这份；daemon 走本仓库 `prompts/system.ts`）。

### 3.2 与 skillMode 的联动

`skillMode ∈ { prototype, deck, template, design-system, image, video, audio }`（`skills.ts:30` 为类型定义；`ComposeInput.skillMode` 在 `system.ts:640-648`）：

- **deck**：`resolvedExclusiveSurface === 'deck'` 时，若技能 body **不含** `assets/template.html`（`hasSkillSeed`，`system.ts:1238-1239`），在技能块**之后（最后）** 钉入 `DECK_FRAMEWORK_DIRECTIVE`（`system.ts:1236-1241`）——导航/计数器/滚动 JS/打印样式是 PDF 拼接的承重契约；技能自带 seed 时「技能的 framework 赢」，跳过通用骨架避免双重注入。`metadata.kind === 'deck'` 但无技能（skill_id null）也会触发（`system.ts:17-27` 文档注释）。自由格式项目（无技能 + kind=other）按 `freeformDeckSignal` 注入带条件前缀的 deck framework（`system.ts:1242-1260`）。
- **image / video / audio**：`isMediaSurfaceEarly`（`system.ts:839-846`）跳过 HTML 发现层，改注入 `renderMediaGenerationContract`（`system.ts:1270-1271`）；media 面也跳过 critique 面板（`system.ts:1304-1307`）。
- **design-system**：技能模式本身不注入 framework，设计系统由独立 `designSystemBody` 通道（`system.ts:1118-1137`）注入。

### 3.3 与 craft 的联动（od.craft.requires）

- frontmatter 解析：`od.craft.requires` → `craftRequires`（`skills.ts:235, 483-496`，slug 白名单 `^[a-z0-9][a-z0-9-]*$`）。
- 收集：主技能（`server.ts:3718-3719`）+ ad-hoc（`server.ts:3747-3751`）+ 插件 `od.context.craft`（`server.ts:3780-3783`）+ ref 技能（`server.ts:3819-3823`）→ `skillCraftRequires`。
- 汇总：`requestedCraft = 去重(skillCraftRequires ∪ designSystemCraftApplies) − 豁免`（`server.ts:3949-3955`；web-clone 运行时清空）。
- 读取：`loadCraftSections(CRAFT_DIR, requested)`（`apps/daemon/src/craft.ts:20-45`）逐个读 `<craftDir>/<slug>.md`，拼 `### <slug>\n\n<内容>`，缺失文件静默跳过；`CRAFT_DIR` 见 `server.ts:802-806`（本地回落到 `<projectRoot>/craft`）。
- 注入：`## Active craft references — <sections>`（`system.ts:1171-1179`），位置在 **DESIGN.md 之后、技能 body 之前**——品牌 token 冲突时品牌赢，craft 规则覆盖其下所有内容。真实 dump 中为 `## Active craft references — state-coverage, laws-of-ux`。

### 3.4 与 critique 的联动（od.critique.policy）

- 解析：`od.critique.policy: required | opt-in | opt-out`（`skills.ts:559-564` `normalizeCritiquePolicy`），SKILL.md frontmatter 见 `skills.ts:545-554` 注释。
- 合并：多技能按 `mergeSkillCritiquePolicy`（`server.ts:3692-3702`）：`opt-out` 一票否决、`required` 次之、`opt-in` 再次，任何技能声明都并入 `skillCritiquePolicy`。
- 决策：`isCritiqueEnabled`（`apps/daemon/src/critique/rollout.ts:84-109`）优先级：**skill opt-out → false；skill required → true；project 覆盖 → env 覆盖 → 阶段默认（M0/M1 off，M2 仅 opt-in，M3 on）**。
- 落地：`critiqueShouldRun`（`server.ts:4050-4052`）同时门禁提示词里的 critique 面板 addendum（`server.ts:4145-4147` → `system.ts:1304-1307`，即 `## Active stage: critique` / `critique-theater` 原子块）与 spawn 侧 orchestrator（`server.ts:6866-6873`），提示词与编排保持 lockstep。

### 3.5 与插件的共存顺序

- 插件块：`pluginBlock`（`renderPluginBlock`，`packages/contracts/src/prompts/plugin-block.ts:12-56`）在**技能块之后**拼接（`system.ts:1192-1194`）：`## Active plugin`（+`## Plugin inputs` +`## Plugin atoms`）。
- 阶段块：`activeStageBlocks`（`## Active stage: <id>`，来自原子 SKILL.md 片段，`system.ts:1202-1208`）在插件块之后。
- 冲突裁决：插件本地 SKILL.md **覆盖**全局技能（`server.ts:3788-3792` 无条件 `skillBody = local.body + composedSkillBlocks`）。plugin 与 skill 可同时存在：技能占 `## Active skill`，插件占 `## Active plugin`，各自独立成块。

### 3.6 技能目录 staging 到项目 cwd（.od-skills）

- 触发：每次 spawn 前，对 `activeSkillDirs` 逐个 `stageActiveSkill(cwd, skillCwdAliasSegment(dir), dir)`（`server.ts:4744-4758`；orbit/live-artifact 模板路径另见 `server.ts:8432-8445`）。
- 目标：`<cwd>/.od-skills/<folder>-<sha256(normalizedDir).slice(0,10)>/`（`cwd-aliases.ts:37-55` `SKILLS_CWD_ALIAS='.od-skills'`、`skillCwdAliasSegment`）。
- 语义（`apps/daemon/src/cwd-aliases.ts:1-29, 108-198`）：
  - **copy 而非 symlink**——`.od-skills/` 是真正的写屏障，agent 写坏副本不影响仓库原文件（PR #435 历史教训）。
  - `dereference: true` + `stat()`（非 lstat）跟随符号链接，staged 副本完全自包含；`fs.cp` 跨文件系统 EPERM/EXDEV 时回退流式复制 `copyTreeDereferenced`（`cwd-aliases.ts:74-95`）。
  - 每轮**整目录替换**（`rm` + `cp`），保证 `references/*.md` 编辑即时生效（`cwd-aliases.ts:172-192`）。
  - 非抛错：失败返回 `{staged:false, reason}`，调用方回落到 preamble 里的绝对路径（Claude/Copilot 额外 `--add-dir` 授权，见 `server.ts:4725-4743`）。
- preamble 与 staging 配套：`withSkillRootPreamble` 广告的相对路径 `.od-skills/<folder>-<digest>/` 正是 `stageActiveSkill` 的落地位置，二者是同一约定。

---

## 4. 边界与例外

### 4.1 技能 / 设计模板拆分后的跨 surface 解析

- 存储的 project `skill_id` 可能在拆分前指向任意 surface，因此提示词组装用 **`ALL_SKILL_LIKE_ROOTS`**（四根合一）解析（`server.ts:910-915`），而 UI 的 `/api/skills`（功能技能）与 `/api/design-templates`（模板）各自用 `SKILL_ROOTS` / `DESIGN_TEMPLATE_ROOTS`（`server-services.ts:101-111`）。
- 资产/示例路由同样跨 surface：`/api/skills/:id/example`、`/api/skills/:id/assets/*` 都基于 `listAllSkillLikeEntries()`（`static-resource.ts:459, 583`），且 example 里 `./assets/...` 被 `rewriteSkillAssetUrls` 重写为 `/api/skills/<id>/assets/...`（`static-resource.ts:888-898`）。

### 4.2 无技能时的默认路由

- `effectiveSkillId` 为空 + 无插件本地技能 → `skillBody` 保持 `undefined`，**不注入** `## Active skill` 块。
- 但 deck-kind 项目仍注入 `DECK_FRAMEWORK_DIRECTIVE`（`system.ts:1236-1241`）；media kind 仍注入 media contract；自由格式按信号注入条件 deck framework。设计系统、memory、custom instructions 照常注入。
- 「默认路由」另有 od-default 场景插件兜底（见 1.4）。

### 4.3 多技能组合（composed）

- ad-hoc 每个技能拼 `\n\n---\n\n## Composed skill — <name>\n\n<body>`（`server.ts:3752-3754`）。
- `skillBody = baseBody + composedSkillBlocks`（`server.ts:3758`）；无主技能且只有一个 ad-hoc 时 `skillName` 取该技能名，否则 `'composed'`（`server.ts:3759-3763`）。去重：排除与主技能同 id（`server.ts:3725-3734`）。

### 4.4 技能与插件共存时谁赢

- **插件本地 SKILL.md 赢**（覆盖全局技能 body，`server.ts:3788-3792`）。
- 插件只 `ref` 全局技能时用被引技能的 body（`server.ts:3801-3824`）。
- 双方可共存：技能入 `## Active skill`，插件元信息入 `## Active plugin`，craft 请求合并，critique 策略合并。

---

## 5. 审计证据（promptTelemetry 的 skillPrompt 段）

### 5.1 记录内容

- 来源：`composeDaemonSystemPrompt` 返回 `promptTelemetryParts.skillPrompt = skillBody ?? ''`（`server.ts:4186-4192`）。
- 组装：`server.ts:5194-5216` 用 `buildPromptStackTelemetry({ kind: 'skillPrompt', content: ... })` 生成整栈 telemetry 挂到 `run.promptTelemetry`。
- 字段（`apps/daemon/src/prompt-telemetry.ts:39-51, 261-356`）：
  - `rawBytes` / `redactedBytes`：原始/脱敏后字节数。
  - `fingerprint`：`sha256:<redacted 内容>`（`prompt-telemetry.ts:126-128`）。
  - `truncated` + `truncationReason`：`section_byte_limit`（单段上限 **64 KiB**，`SECTION_MAX_BYTES`，`prompt-telemetry.ts:11`；`daemonSystemPrompt` 单独 128 KiB）或 `total_budget_exceeded`（全栈脱敏预算 **512 KiB**，`prompt-telemetry.ts:12, 304-331`）。
  - `redactedContent`：`skillPrompt` 在 `REDACTED_CONTENT_KINDS`（`prompt-telemetry.ts:100`）内 → `contentMode: 'redacted-section-content'`，内容经 `redactPromptText`（路径 + secrets 脱敏，`prompt-telemetry.ts:156-158, 142-154`）后保留；分配优先级 5（与 designSystemPrompt/pluginStagePrompt 同级，`prompt-telemetry.ts:110`）。
- 下游：Langfuse 上报 `prompt_build_summary`（`apps/daemon/src/langfuse-trace.ts:600-615`）与结构化 `open-design.prompt-stack`（`langfuse-trace.ts:1553-1556`、`prompt-telemetry.ts:368-396`）；`promptStackWithoutContent` 可去掉内容只留指纹（`prompt-telemetry.ts:358-366`）。

### 5.2 真实运行佐证

- 完整注入栈：`/tmp/od-claude-system-prompt-full.txt`（**66813 字节**，与 state.json `promptTelemetry.rawBytes = 66813` 完全一致）。
- 其中技能段为 `## Active skill — Kanban Board` + `Follow this skill's workflow exactly.` + kanban-board SKILL.md 全文（`# Kanban Board Skill` …），紧随其后是 `## Active plugin`（Kanban Board）、`## Active stage: plan` / `## Active stage: critique`。
- state.json（`~/.config/Open Design/namespaces/default/data/runs/87226cc0-.../state.json`）`promptTelemetry.sections` 中 `skillPrompt`：
  - `rawBytes: 792`、`redactedBytes: 792`、`truncated: false`、`contentMode: redacted-section-content`
  - `fingerprint: sha256:6f11b616...`（对 kanban-board SKILL.md body 脱敏后哈希）
  - `redactedContent` 即为该 SKILL.md body 全文——与 `plugins/_official/examples/kanban-board/SKILL.md` 内容一致，证明该 run 的技能体来自**插件本地技能**通道（`od.context.skills[{path:'./SKILL.md'}]`），而非全局技能注册表。
- 该栈还可见 craft 段 `## Active craft references — state-coverage, laws-of-ux`（插件 `od.context.craft` 驱动），印证 3.3。

---

## 6. 关键源码索引

| 关注点 | 位置 |
|---|---|
| 选择：`effectiveSkillId` | `apps/daemon/src/server.ts:3618-3619` |
| 选择：ad-hoc 技能 | `apps/daemon/src/server.ts:3654-3659, 3722-3765` |
| 选择：插件本地技能覆盖 | `apps/daemon/src/server.ts:3786-3834` |
| 选择：Home composer 互斥路由（chip vs 显式技能） | `apps/web/src/components/HomeView.tsx:2004-2008` |
| 选择：新建项目面板 `startTemplateId ?? skillIdForTab` | `apps/web/src/components/NewProjectPanel.tsx:494-537, 768` |
| 选择：项目聊天 `skillId`/`skillIds` | `apps/web/src/components/ProjectView.tsx:5917-5918` |
| 选择：项目技能持久化 `projects.skill_id` | `apps/web/src/components/ChatComposer.tsx:2393`；`apps/daemon/src/db.ts:61, 864` |
| 选择：daemon 兜底默认场景插件 | `apps/daemon/src/routes/runs.ts:742-755` |
| 默认路由映射表 | `packages/contracts/src/plugins/scenario-defaults.ts:52-99` |
| 加载：目录扫描 + frontmatter | `apps/daemon/src/skills.ts:145-314` |
| 加载：frontmatter 解析 | `apps/daemon/src/design-systems/frontmatter.ts:22-33` |
| 加载：shadow | `apps/daemon/src/skills.ts:151-179, 906-955` |
| 加载：插件本地技能 | `apps/daemon/src/plugins/local-skill.ts:33-75` |
| 根目录 | `apps/daemon/src/server.ts:783-801, 908-915` |
| 注入：`## Active skill` | `apps/daemon/src/prompts/system.ts:1181-1186` |
| 注入：preflight | `apps/daemon/src/prompts/system.ts:2059-2076` |
| 注入：craft 块 | `apps/daemon/src/prompts/system.ts:1171-1179`；`apps/daemon/src/craft.ts:20-45` |
| 注入：deck framework | `apps/daemon/src/prompts/system.ts:1236-1260` |
| 注入：media contract | `apps/daemon/src/prompts/system.ts:1262-1282` |
| 注入：插件块 | `packages/contracts/src/prompts/plugin-block.ts:12-56`；`system.ts:1192-1194` |
| staging 到 `.od-skills` | `apps/daemon/src/cwd-aliases.ts:108-198`；调用 `server.ts:4744-4758` |
| critique 决策 | `apps/daemon/src/critique/rollout.ts:84-109` |
| 审计：skillPrompt 段 | `apps/daemon/src/server.ts:4186-4192, 5194-5216`；`apps/daemon/src/prompt-telemetry.ts` |
| 契约层镜像 | `packages/contracts/src/prompts/system.ts:422-425` |

---

## 7. 与先前假设的差异点

1. **`bodies[0].body → skillBody` 不在主注入路径**：`static-resource.ts:63` 的 `skillBody` 是 `/api/atoms/:id` 响应的一个字段，与 daemon 主 compose 的 `skillBody` 无关（原子技能片段另有 `atom-bodies.ts` → `## Active stage` 通道）。
2. **od-default 不是注册表默认技能**：是场景插件 + 本地 SKILL.md，经「插件本地技能」通道注入，而非 `SKILL_ROOTS` 扫描结果。
3. **插件本地技能优先级高于本轮 `skillId`**：`server.ts:3788-3792` 无条件覆盖，早于 `server.ts:3703-3721` 的全局解析。
4. **composed skill 的 `## Composed skill — <name>` 是独立块**，不是并进一个 body；多技能各自成节。
