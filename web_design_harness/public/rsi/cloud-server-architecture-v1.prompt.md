# cloud-server-architecture-v1

风格参考：`web/public/outline/universal-harness-editorial.png` 与 `web_design_harness/public/rsi/evaluator-learning-loop-v3.png`。

用途：Harness Docs 云端 Server 章节配图，3:2 横向科技编辑部手绘架构图。

构图：左侧为端侧工程工作台，本地 Harness 依次连接插件和红色 CLI 网关。右侧为带云朵轮廓的四层轴测机柜：顶部 Web 控制台与 CLI 汇入同一个 API 层；中间业务机箱内并列用户、项目、资产、血缘四个模块；底部关系数据库、Git 仓库、对象存储三类设备并列。最右侧红色审计纸带纵向贯穿各层。

传输路径：蓝色线路由 CLI 进入 API；紫色线路表示 Git 增量传输，绕过业务服务器直达 Git 仓库；青色线路表示大文件直传，绕过业务服务器直达对象存储。

风格：精细铅笔与针管笔线稿，半透明水彩晕染，略带俯视的轴测工程图；冷白纸张纹理，低饱和石墨灰、雾霾蓝、靛蓝，少量青绿、紫色和红色批注。使用物理机柜、模块、线缆、纸带与存储设备表达软件架构，避免规整 SaaS 方框流程图。

标注：使用手写纸签和细虚线，标明端侧、云端、本地 Harness、插件、CLI、Web 控制台、API 层、业务层、用户、项目、资产、血缘、存储层、关系数据库、Git 仓库、对象存储、审计日志，以及 API、Git 增量传输、大文件直传三条路径。
