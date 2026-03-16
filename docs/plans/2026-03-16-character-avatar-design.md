# Symposium Character Avatar PNG Regeneration Design

**Date:** 2026-03-16  
**Status:** Approved

## Goal

把《会饮篇》当前使用的 13 个角色头像从本地 SVG 全部替换为统一风格的 PNG 人像，并保持阅读页与人物索引页现有的头像渲染逻辑不变。

这次重做有三个明确约束：

1. `static/avatars/test/` 中现有 5 张 PNG 只作风格参考，不直接作为正式成品。
2. `static/avatars/characters/` 下现有 13 个角色都要重新做，不能保留旧 SVG。
3. 执行过程在当前工作区完成，不使用 worktree。

## Design Decision

采用统一的 `正面胸像 PNG` 方案，使用以下视觉语言：

- `1:1` 正方形构图
- 正面胸像，头肩裁切一致
- 浅米白背景
- 深灰描边与稳定线稿密度
- 柔和肤色与低饱和服饰色
- 古希腊服饰、卷发、头纱、花冠等古典元素

最终运行时头像资源统一为：

- `static/avatars/characters/<id>.png`

目标尺寸统一为：

- `512x512`

## Why PNG Instead Of SVG

当前 SVG 方案的问题已经明确：

- 风格不符合你认可的参考图方向
- 角色辨识度不足
- 手写几何过于机械，容易显得乱

PNG 更适合这次目标：

- 可以直接承接 `static/avatars/test/` 已经验证过的正面人像方向
- 正面头像在阅读页与人物索引页的小尺寸显示里更容易识别
- 不再需要继续维护复杂而脆弱的 SVG 线稿约束

## Reference Style

`static/avatars/test/` 中的 5 张参考图定义了这次重做的主方向：

- 正面而非侧面
- 人物占画面主体，背景极简
- 五官与发须使用干净但不生硬的描边
- 服饰与饰物保留古典感，但不做复杂叙事场景

正式成品统一去掉参考图右下角的装饰性闪光，避免看起来像临时样张或素材平台图。

## Character Differentiation Rules

统一风格不能导致 13 张头像长得像同一个人。差异必须主要通过脸型、年龄感、发须、轮廓和气质拉开。

- `socrates`: 高额头、明显秃顶、鼻子更钝、胡须厚重、神情更拧。
- `alcibiades`: 年轻俊美、卷发饱满、脸更窄、气质自信。
- `aristophanes`: 中年感更强、皱纹更明显、脸更宽、神情带讥讽。
- `agathon`: 更精致秀气，接近雌雄同体的诗人形象。
- `phaedrus`: 青年感强，卷发规整，神情更理想化。
- `pausanias`: 成熟克制，发型与胡须更规整，法政气质更强。
- `eryximachus`: 理性、严整、表情平稳，轮廓更收束。
- `aristodemus`: 更朴素、更低存在感，衣饰不抢眼。
- `apollodorus`: 略瘦，眼神更执着，整体更投入。
- `glaucon`: 年轻听者，面部更清朗，胡须可以更轻。
- `diotima`: 女性祭司 / 智者形象，头纱或披巾，沉静而有权威。
- `eros`: 年轻神祇，偏中性与理想化，不做儿童丘比特。
- `aphrodite`: 女性神祇，优雅克制，不做艳俗化处理。

## Asset Strategy

运行时只依赖 PNG：

- `src/lib/data/characters.json` 中的 `avatarImage` 全部改为 `/avatars/characters/<id>.png`
- 保留原有 `avatar` 单字字段作为运行时 fallback
- `reading` 与 `characters` 页面沿用现有 `Avatar.Image + Avatar.Fallback` 结构，不重写组件逻辑

参考图与正式图分离：

- `static/avatars/test/` 继续保留为参考素材，不参与正式引用
- `static/avatars/characters/` 只放正式头像

迁移完成后：

- 删除 `static/avatars/characters/*.svg`
- 验证仓库中不再有正式路径引用这些 SVG

## Production Workflow

这次必须按角色逐个生成，而不是一次性整体替换。

推荐顺序：

1. `socrates`
2. `alcibiades`
3. `aristophanes`
4. `agathon`
5. `phaedrus`
6. `pausanias`
7. `eryximachus`
8. `aristodemus`
9. `apollodorus`
10. `glaucon`
11. `diotima`
12. `eros`
13. `aphrodite`

执行原则：

- 先用 `socrates` 定镜头距离、背景、线稿粗细和服饰密度
- 其余角色严格继承同一模板，再调差异特征
- 每完成 1 个角色，就立刻落到正式路径并单独验证
- 全部 13 个完成后再做整体验证与清理

## Validation Rules

新的校验重点不再是 SVG 几何，而是 PNG 资源契约：

- 每个角色必须保留 `avatar`
- 每个角色必须有 `avatarImage`
- `avatarImage` 必须指向 `/avatars/characters/<id>.png`
- 对应 PNG 文件必须存在
- PNG 必须是正方形
- PNG 尺寸统一为 `512x512`

为了支持逐个生成，校验脚本需要支持单角色检查，例如只验证 `socrates` 或 `agathon`，避免在迁移中途被未完成角色阻塞。

## Non-Goals

这次重做不做以下事情：

- 不顺手改阅读页布局
- 不顺手改人物索引页结构
- 不顺手重做关系图节点样式
- 不把参考 PNG 直接当成正式稿迁入

## Approved Outcome

本项目的人物头像体系改为统一的正面胸像 PNG 方案。`static/avatars/test/` 仅作为风格参考，`static/avatars/characters/` 下 13 个角色全部重生成正式 PNG，数据层全部切换到 `.png` 路径，保留单字 fallback，并通过逐角色验证与最终全量验证完成迁移。
