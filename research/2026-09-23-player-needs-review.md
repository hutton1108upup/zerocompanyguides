# 2026-09-23 玩家需求内容交付与审查

## AnvilWiki 审查后的补充

- 倒计时：加入三种两周期安排与取舍表，同伴页链接该示例。
- 增援：加入 Enemy Intelligence 的已发表任务目标顺序，明确战斗转为 Escape 的决策点。路线建议与来源记载分开；没有编造坐标或刷怪波数。
- 经济：加入 Utility Items、Weapon Mods、Networking、Black Market Quality I 和武器升级的条件优先级，以及装备槽和商店品质的二选一例子。未核实的价格、等级和收益公式不写成事实。
- 软锁：改为症状、平台、触发位置和下一步表格，附官方帮助入口；仍无本站验证的特定修复。
- Visser：加入独立 Reddit 讨论的 Miasma 控制报告和原攻略提供的视频时间链接。直接视频访问失败，未声称观看实战。页面标记 needs-retest、noindex, follow，排除 sitemap、搜索和主导航；仍可从审阅卡片访问。核心完成条件和补丁后行为需后续独立复测。
- 精简开场自我说明和重复否定句，保留与玩家行动相关的版本、存档和难度限制；没有编造亲身游戏体验。

本次代码验证不能替代游戏实战验证。Boss 页的审阅状态是有意保留的发布边界，不代表其已经成为核实完毕的正式攻略。

本轮按用户批准的 1–5 顺序实施，使用现有英文站点内容组件。原有页面 Title、Description、H1 保持不变。本轮按授权提交到 GitHub 分支；不包含合并主分支或部署。

## 页面清单

| 顺序 | 页面 | 变化 |
| --- | --- | --- |
| 1 | http://127.0.0.1:3002/walkthrough | 任务类型、倒计时冲突决策、同伴任务与干预任务竞争示例 |
| 1 | http://127.0.0.1:3002/characters/companions | 任务前置、Intel 预算、防错过检查清单 |
| 2 | http://127.0.0.1:3002/guides/reinforcements-and-extraction | 新增；按目标分类，逐回合撤离思路，增援与行动卡死的区别 |
| 3 | http://127.0.0.1:3002/guides/credits-and-den-upgrades | 新增；按瓶颈选择升级，支出预算，黑市和装备出售的取舍 |
| 4 | http://127.0.0.1:3002/performance/fps-fix | Umbara 过场和无 AP 社区案例；报告范围、保档与官方支持路径 |
| 5 | http://127.0.0.1:3002/walkthrough/retake-mordant-citadel | 新增；Visser 关卡范围、配队职责、战斗步骤与故障区分；含剧透 |
| 入口 | http://127.0.0.1:3002/guides | 加入三篇新页面入口 |
| 入口 | http://127.0.0.1:3002/guides/beginners-guide | 加入增援与经济指南入口 |

## 来源与取舍

- 官方优先：EA 的 [玩法介绍](https://www.ea.com/games/starwars/zero-company/news/lead-zero-company-to-victory)、[社区问答](https://www.ea.com/games/starwars/zero-company/news/answering-biggest-questions)、[FAQ](https://www.ea.com/games/starwars/zero-company/faq)、[Patch 1.1](https://www.ea.com/games/starwars/zero-company/news/patch-notes-1-1)、[EA Help](https://help.ea.com/en/articles/star-wars/zero-company/troubleshoot-common-issues/)，以及 StarWars.com 的[玩法指南](https://www.starwars.com/news/star-wars-zero-company-guide)和 [Visser Databank](https://www.starwars.com/databank/visser)。发售前资料保留时效边界。
- 倒计时：Reddit Luco/Tel 讨论用于说明决策冲突，不作为每个存档的固定日历或费用表。
- 增援：Steam 与 Reddit 用于识别玩家困境，不承诺固定波数、全图通用的无限增援规律或新敌人首回合免行动。
- 经济：Reddit 与 Prodigygamers 的不同意见作为取舍背景，不采用未经复现的收入叠加公式、具体升级解锁等级或统一必买顺序。
- 软锁：页面快照与搜索结果展示的回复范围不同，因此不把最后回复日期当作安装版本。未采用混合设置、重装、重建数据库后的单一因果结论。
- Boss：官媒确认 Visser 身份与拼写。All Things How 与 IndiaTimes 的具体战斗攻略高度相似，不计作两次独立实测。仅交付明确标注来源的攻略综合，不声称本站完成 Expert/Beskar 或 Patch 1.1 实战；不同 Visser 遭遇战不可混用。
- 完整页面级来源和检查范围在 `src/content/sources.ts` 中；每个交付页底部有可点击来源列表。

## 本地验证

- `npm.cmd run test:run`：44 个测试文件、159 项测试通过。
- `npm.cmd run build`：生产构建和 TypeScript 检查通过，生成 45 个静态页面（含框架路由）。
- 修改文件 ESLint 与 `git diff --check`：通过。
- `BASE_URL=http://127.0.0.1:3002 npm.cmd run site:audit`：34 个可索引内容页、3 个审阅页、46 个内部链接检查通过。
- Playwright：8 个相关页面 × 桌面 1440px／手机 390px，HTTP、H1、目录锚点、横向溢出、页面脚本错误检查均通过。测试隔离了外部广告、统计和媒体请求，不代表这些第三方服务通过验证。
- 浏览器报告和截图位于 `artifacts/player-needs-review/`。查看了增援手机长图与 Boss 桌面长图。

本地预览使用 3002 端口，避免占用原有 3000 预览。生产站未部署，游戏实战未测试。
