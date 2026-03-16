# Symposium Character Avatar Design

**Date:** 2026-03-16  
**Status:** Approved

## Goal

为《会饮篇》中的人物与神祇建立一套统一、可持续扩展的头像体系，用于阅读页、人物索引页以及后续分析视图。头像需要提升人物辨识度，同时保持整体视觉一致，不把角色误做成“历史证件照”。

## Design Decision

采用 `古希腊陶绘 / 浅浮雕` 的统一插画方向，头像以 `胸像` 为主，优先使用 `侧面或 3/4 侧面` 构图。整体控制在少色、强轮廓、低背景干扰的风格内，保证：

1. 小尺寸下也能识别人物差异。
2. 可用 AI 初稿 + 本地 SVG 精修的方式生产。
3. 后续扩充人物时不需要改动整套视觉语言。

## Why This Approach

相比纯字母 fallback、抽象符号或写实头像，这种方案更适合当前项目：

- 文本是古典哲学对话，统一插画比现代照片或随机二次元头像更贴题。
- 多数人物没有可靠肖像，风格化重建比“伪写实”更诚实。
- SVG 化后体积小、可本地托管、可控，不依赖第三方头像服务。
- 阅读页需要沉浸感，陶绘与浮雕风比彩色写实更克制。

## Visual System

### Composition

- 胸像，不做半身以上复杂场景。
- 主视角为侧面或 3/4 侧面。
- 背景极简，避免故事场景和装饰噪声。
- 人物差异主要依靠头型、发型、胡须、轮廓、冠饰和服饰边缘。

### Palette

统一控制在 2-3 色：

- Terracotta red
- Carbon black
- Bone white

如后续需要主题适配，可在 SVG 或 CSS 层做轻微色调映射，但不改变角色结构。

### Rendering Style

- 参考古希腊红绘陶瓶人物轮廓与浅浮雕的体积提示。
- 线条干净，轮廓优先于细碎阴影。
- 适配矢量化，避免复杂纹理。
- 避免现代插画常见的高光、镜头光效、电影感布光。

## Historical Constraint

以下头像不应宣称为人物真实面貌，而应表述为：`基于史料、文本气质与古典图像传统的风格化重建`。

- `socrates`、`aristophanes`：可参考现存胸像，历史依据相对更强。
- `alcibiades`：常见“Alcibiades bust”多为后世归名，适合借用“贵族美少年”形象，不适合作为真实肖像断言。
- `agathon`、`phaedrus`、`pausanias`、`eryximachus`、`aristodemus`、`apollodorus`、`glaucon`：以文本角色气质为主。
- `diotima`：采用祭司 / 智者的象征化处理，不诉求历史写实。
- `eros`、`aphrodite`：明确归为神性象征头像。

## Prompt System

### Base Prompt

```text
ancient Greek red-figure vase portrait mixed with shallow marble relief style, bust-only, 3/4 view or side profile, terracotta red, carbon black, bone white, clean silhouette, minimal background, classical himation drapery, vector-friendly shapes, elegant contour lines, restrained expression, museum illustration quality
```

### Negative Prompt

```text
photorealistic, modern clothing, fantasy armor, anime, glossy game art, cinematic lighting, busy background, extra props, text, watermark, saturated colors
```

### Character-Specific Direction

- `socrates`: bald, broad snub nose, short beard, plain but memorable face.
- `alcibiades`: beautiful young aristocrat, curls, wreath, proud charisma.
- `aristophanes`: mature comic poet, fuller beard, heavier face, sly intelligence.
- `agathon`: refined beauty, almost androgynous, polished tragic poet.
- `phaedrus`: youthful initiator, clean profile, idealized aristocratic energy.
- `pausanias`: mature, orderly, legal and ethical composure.
- `eryximachus`: rational physician, measured and balanced demeanor.
- `aristodemus`: modest companion, simpler and more unobtrusive presence.
- `apollodorus`: intense, devout, slightly gaunt seriousness.
- `glaucon`: young listener, intelligent and understated.
- `diotima`: priestess-teacher, veiled, sacred calm and authority.
- `eros`: youthful divine ambiguity, symbolic desire.
- `aphrodite`: idealized divine feminine profile, elevated calm.

## Asset Strategy

推荐后续采用本地静态资源：

- 路径建议：`static/avatars/characters/<id>.svg`
- 数据层新增图片字段指向本地资源。
- 保留当前 `avatar` 单字字段作为 fallback，避免资源缺失时 UI 断裂。

这样做的原因：

- 不把大体积源图打进业务数据层。
- 路径稳定，适合版本管理。
- SVG 便于后期统一改色、裁切、描边和压缩。

## UI Usage

头像至少用于：

- 阅读页发言卡片中的说话人头像。
- 人物索引页中的人物卡片或列表。
- 后续若扩展到关系图、注解卡、人物详情，也继续复用同一资源路径。

## Recommended Production Order

优先从辨识度最高的一批开始：

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

## Source References

- Socrates bust: https://commons.wikimedia.org/wiki/File:Portrait_bust_of_a_man_on_a_Herm_(known_as_Socrates)-Uffizi.jpg
- Alcibiades context: https://en.wikipedia.org/wiki/Alcibiades
- Aristophanes bust: https://commons.wikimedia.org/wiki/File:Bust_of_Aristophanes.jpg
- Diotima: https://en.wikipedia.org/wiki/Diotima_of_Mantinea
- Symposium context: https://en.wikipedia.org/wiki/Symposium_(Plato)

## Approved Outcome

本项目的人物头像采用统一的古希腊陶绘 / 浅浮雕风格，使用本地 SVG 资源承载图像内容，业务数据保留 fallback 字符，并为后续在阅读页和人物索引页接入真实头像留出字段与渲染路径。
