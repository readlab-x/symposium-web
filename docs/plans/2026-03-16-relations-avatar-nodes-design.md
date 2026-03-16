# Relations Avatar Node Design

**Date:** 2026-03-16  
**Status:** Approved

## Goal

让《会饮》关系图中的节点直接使用现有角色头像资源，而不是抽象圆点，同时保留当前图谱对类型、选中状态、邻接状态和标签可读性的编码能力。

## Scope

本轮只改造关系图节点本体与关联详情头部的视觉承载方式，不改动：

- 关系拓扑数据结构
- 边关系文案与筛选逻辑
- 关系图页面的信息架构
- 阅读页与人物页的头像使用方式

## Design Decision

采用 `G6 自定义头像节点`，而不是纯 `image` 节点或 HTML/DOM 节点。

节点将由以下层级组成：

1. 头像主体
2. 类型描边
3. 状态外环 / halo
4. 常显标签

这样可以让节点优先表达“是谁”，同时继续表达“是什么类型”以及“当前是否被选中/邻接”。

## Why Not Other Approaches

### Pure Image Node

如果直接把节点替换成纯图片：

- 类型编码只能额外补丁式叠加
- `active / neighbor / dimmed` 状态不够稳定
- fallback 字符节点很难和图片节点保持统一表现

### HTML Node

如果用 DOM 节点：

- 缩放与拖拽体验更复杂
- 命中区域、层级和性能更难控
- 当前图谱并不需要卡片化节点

### Avatar Overlay on Current Circle Node

如果头像只是贴在现有圆点上：

- 头像资源被浪费
- 视觉中心仍然是抽象点，不是人物
- 最终效果会像“图标贴纸”，而不是头像节点

因此选 `G6 自定义头像节点` 是最稳妥的中间方案。

## Data Flow

不把头像路径复制进 `relations.json`。

### Data Ownership

- `src/lib/data/relations.json` 继续负责：节点坐标、拓扑、关系边
- `src/lib/data/characters.json` 继续负责：角色名、fallback 字符、`avatarImage`

### Join Strategy

在关系图页面层或专用 mapper 层，通过 `id` 把人物数据 join 到关系图节点上，生成关系图专用节点数据。

关系图节点运行时应至少包含：

- `id`
- `label`
- `type`
- `summary`
- `x`
- `y`
- `avatarImage`
- `avatarFallback`

### Fallback

如果某节点找不到 `avatarImage`：

- 节点仍正常显示
- 退回到单字 fallback
- 类型描边、外环状态、标签仍保留
- 不允许 broken image 进入图内

## Node Rendering

### Structure

每个节点由 5 层组成：

1. 头像底盘
2. 头像图像或单字 fallback
3. 类型描边
4. 状态外环
5. 下方常显标签

### Size

当前 `42` 的圆点尺寸不适合头像节点。建议默认头像节点提升到 `52` 或 `56`。

- default: `52-56`
- neighbor: 比 default 略大
- active: `58-62`

标签与节点间距同步略增，避免头像扩大后压住名字。

### Avatar Crop

- 头像以圆形节点呈现
- 图像采用 cover 逻辑铺满圆形区域
- 不允许出现透明外边、留白边或 broken image 占位符

## State System

### Type Encoding

保留当前类型编码，但从“节点填充色差异”转为“描边差异”：

- `person`: 人物描边色
- `deity`: 神祇描边色
- `place`: 保留地点描边色，以便后续扩展

### Active

- 外环更强、更粗
- halo 保留
- 标签字重增强
- 头像主体本身不做复杂滤镜

### Neighbor

- 外环比默认更明显
- 类型描边仍可见
- 标签保持正常可读，不弱化到看不清

### Dimmed

- 节点整体降低透明度
- 标签同步弱化
- 头像仍能辨认轮廓，不完全消失

## Labels

用户已确认：关系图节点标签 `始终显示`。

因此：

- 节点名字继续常显在头像下方
- 不改为 hover 才显示
- 不改为只选中时显示
- 后续若图过密，优先调布局和碰撞半径，不优先砍标签

## Interaction

### Canvas Interaction

- 点击节点：节点 active、邻接节点 neighbor、其他 dimmed
- 点击空白：恢复默认态
- 拖拽、缩放：保持现状
- hover：只保留轻反馈，不做重状态切换

### Detail Panel

右侧详情卡建议同步显示选中节点头像，但只增强卡头，不让关系列表重复堆头像。

卡头信息：

- 头像
- 名称
- 类型 badge
- 摘要

关系列表仍以文字为主，保证阅读密度。

## Layout Impact

头像节点和常显标签都会提升图面占用，因此布局要配套调整：

- 增加节点碰撞半径
- 可能需要提高 link distance
- 边标签默认视觉权重略弱
- active 边再抬高可读性

第一版不做缩放级别驱动的标签开关逻辑，先靠静态布局把密度控制住。

## Risks

### Visual Density Risk

头像节点比圆点更重，如果不调布局：

- 标签会相互挤压
- 边标签会和头像叠压
- 图会显得脏

### State Readability Risk

如果只换头像，不保留类型描边和外环：

- 节点状态会弱化
- 选中关系不够清晰

### Data Drift Risk

如果把头像路径复制进 `relations.json`：

- 会出现角色数据和关系数据双源维护
- 头像更新时容易漂移

## Approved Outcome

关系图节点将升级为 `G6 自定义头像节点`：

- 节点主体显示角色头像
- 类型信息通过描边保留
- 选中/邻接通过外环与 halo 保留
- 节点名字继续始终显示
- 头像路径不写入 `relations.json`，而是在运行时与 `characters.json` 进行 join
