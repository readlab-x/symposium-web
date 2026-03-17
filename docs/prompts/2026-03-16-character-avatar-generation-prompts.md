# Symposium Character Avatar Generation Prompts

**Date:** 2026-03-16

## Purpose

这份提示词用于直接生成《会饮篇》13 个角色的正式 PNG 头像。

目标风格严格对齐当前参考方向：

- 正面胸像
- `1:1` 正方形
- 浅米白背景
- 深色清晰线稿
- 柔和肤色与低饱和古希腊服饰
- 干净、端正、可小尺寸识别

不要再走抽象 SVG 或侧面陶绘路线。

## Global Prompt

```text
front-facing bust portrait of a classical ancient Greek symposium character, centered symmetrical composition, shoulders and upper chest visible, refined editorial illustration, crisp dark ink outlines, soft cel shading, warm ivory parchment background, muted terracotta and dusty rose clothing, elegant himation drapery, subtle Greek textile trim, museum-quality character illustration, clean silhouette, calm lighting, high facial readability, square avatar composition, no border, no sparkle, no text, no watermark
```

## Global Negative Prompt

```text
photorealistic, 3d render, anime, manga, chibi, caricature, exaggerated cartoon, glossy game art, cinematic lighting, dramatic shadows, busy background, architecture, crowd, props covering face, hands near face, side profile, three-quarter profile, full body, cropped forehead, cropped chin, armor, helmet, modern clothes, jewelry overload, wings spread behind body, child cupid, sensual glamour pose, low detail, blurry eyes, deformed facial features, asymmetrical eyes, double pupils, text, logo, signature, sparkles
```

## Hard Constraints

每一张都必须满足：

1. Only one character.
2. Face centered on the canvas.
3. Head and shoulders only.
4. Eyes fully visible.
5. Mouth fully visible.
6. Background plain and quiet.
7. No decorative star or sparkle in corners.
8. Output target: `1024x1024`, then downscale/export to `512x512` PNG.
9. Keep the same illustration language across all 13 images.
10. No prop may block the face.

## Model Guidance

如果是支持 `prompt + negative prompt + seed` 的模型，建议：

- Aspect ratio: `1:1`
- Size: `1024x1024`
- CFG / prompt guidance: `6-8`
- Steps: `28-40`
- Seed: 固定每个角色自己的 seed，便于重试

如果是 GPT Image / Flux 这类偏自然语言模型：

- 直接使用 `Full Prompt`
- 再加一段 `Strict constraints`
- 多出 2-4 张，从中挑最稳定的一张

## Prompt Template

```text
{GLOBAL PROMPT},
{CHARACTER DESCRIPTION},
strictly front-facing,
head fully inside frame,
mouth and beard clearly separated,
face occupying roughly 60 percent of the image height,
plain warm parchment gradient background,
high consistency with a unified ancient Greek illustration series
```

## Character Prompts

### 1. `socrates`

Seed: `3101`

```text
front-facing bust portrait of Socrates, elderly Athenian philosopher, high bald crown with thin side hair, broad snub nose, heavy full beard, weathered intelligent face, stern but calm expression, terracotta himation, classical ancient Greek symposium character, centered symmetrical composition, refined editorial illustration, crisp dark ink outlines, soft cel shading, warm ivory parchment background, museum-quality character illustration, clean silhouette, no text, no sparkle
```

### 2. `alcibiades`

Seed: `3102`

```text
front-facing bust portrait of Alcibiades, strikingly handsome young Athenian aristocrat, lush dark ringlets, neatly shaped short beard, subtle laurel wreath, confident gaze, elegant pale violet himation with Greek trim, classical ancient Greek symposium character, centered symmetrical composition, refined editorial illustration, crisp dark ink outlines, soft cel shading, warm ivory parchment background, museum-quality character illustration, clean silhouette, no text, no sparkle
```

### 3. `aristophanes`

Seed: `3103`

```text
front-facing bust portrait of Aristophanes, mature comic poet, curly hair with slight recession, medium full beard, visible crow's feet, sharp knowing expression, dusty rose himation, classical ancient Greek symposium character, centered symmetrical composition, refined editorial illustration, crisp dark ink outlines, soft cel shading, warm ivory parchment background, museum-quality character illustration, clean silhouette, no text, no sparkle
```

### 4. `agathon`

Seed: `3104`

```text
front-facing bust portrait of Agathon, beautiful refined young tragic poet, soft almost androgynous facial structure, dark sculpted curls, elegant short beard, polished expression, warm terracotta robe with delicate Greek neckline detail, classical ancient Greek symposium character, centered symmetrical composition, refined editorial illustration, crisp dark ink outlines, soft cel shading, warm ivory parchment background, museum-quality character illustration, clean silhouette, no text, no sparkle
```

### 5. `phaedrus`

Seed: `3105`

```text
front-facing bust portrait of Phaedrus, youthful aristocratic speaker, idealized curly hair, balanced medium beard, bright attentive eyes, energetic but composed expression, terracotta himation, classical ancient Greek symposium character, centered symmetrical composition, refined editorial illustration, crisp dark ink outlines, soft cel shading, warm ivory parchment background, museum-quality character illustration, clean silhouette, no text, no sparkle
```

### 6. `pausanias`

Seed: `3106`

```text
front-facing bust portrait of Pausanias, mature thoughtful legal-minded man, orderly dark curls, carefully groomed beard, restrained expression, composed mouth, muted clay-red himation, classical ancient Greek symposium character, centered symmetrical composition, refined editorial illustration, crisp dark ink outlines, soft cel shading, warm ivory parchment background, museum-quality character illustration, clean silhouette, no text, no sparkle
```

### 7. `eryximachus`

Seed: `3107`

```text
front-facing bust portrait of Eryximachus, disciplined physician, carefully arranged hair, trimmed professional beard, rational steady expression, understated earth-tone himation, classical ancient Greek symposium character, centered symmetrical composition, refined editorial illustration, crisp dark ink outlines, soft cel shading, warm ivory parchment background, museum-quality character illustration, clean silhouette, no text, no sparkle
```

### 8. `aristodemus`

Seed: `3108`

```text
front-facing bust portrait of Aristodemus, modest companion, simpler hairstyle, shorter beard, slimmer quieter face, humble unadorned robe, subdued expression, classical ancient Greek symposium character, centered symmetrical composition, refined editorial illustration, crisp dark ink outlines, soft cel shading, warm ivory parchment background, museum-quality character illustration, clean silhouette, no text, no sparkle
```

### 9. `apollodorus`

Seed: `3109`

```text
front-facing bust portrait of Apollodorus, intense devoted narrator, slightly gaunt face, deep-set eyes, darker curls, medium beard, earnest fervent expression, muted red-brown himation, classical ancient Greek symposium character, centered symmetrical composition, refined editorial illustration, crisp dark ink outlines, soft cel shading, warm ivory parchment background, museum-quality character illustration, clean silhouette, no text, no sparkle
```

### 10. `glaucon`

Seed: `3110`

```text
front-facing bust portrait of Glaucon, intelligent young listener, youthful clear face, soft curls, very light beard or early stubble, attentive expression, understated warm robe, classical ancient Greek symposium character, centered symmetrical composition, refined editorial illustration, crisp dark ink outlines, soft cel shading, warm ivory parchment background, museum-quality character illustration, clean silhouette, no text, no sparkle
```

### 11. `diotima`

Seed: `3111`

```text
front-facing bust portrait of Diotima, dignified female priestess and philosopher, mature serene face, veiled head covering, calm authoritative gaze, refined classical drapery, sacred but restrained presence, classical ancient Greek symposium character, centered symmetrical composition, refined editorial illustration, crisp dark ink outlines, soft cel shading, warm ivory parchment background, museum-quality character illustration, clean silhouette, no text, no sparkle, no glamour styling
```

### 12. `eros`

Seed: `3112`

```text
front-facing bust portrait of Eros, idealized young divine figure, androgynous beauty, soft dark curls, smooth luminous face, subtle sacred elegance, refined pale robe, classical ancient Greek symposium character, centered symmetrical composition, refined editorial illustration, crisp dark ink outlines, soft cel shading, warm ivory parchment background, museum-quality character illustration, clean silhouette, no text, no sparkle, not a child, no cupid wings
```

### 13. `aphrodite`

Seed: `3113`

```text
front-facing bust portrait of Aphrodite, idealized divine feminine figure, graceful wavy hair, serene elevated expression, refined classical veil or diadem, elegant pale rose drapery, restrained beauty, classical ancient Greek symposium character, centered symmetrical composition, refined editorial illustration, crisp dark ink outlines, soft cel shading, warm ivory parchment background, museum-quality character illustration, clean silhouette, no text, no sparkle, no glamour styling
```

## QA Checklist

每张出图后都要人工筛掉：

- 不是正面
- 五官不对称
- 眼睛一个大一个小
- 鼻子塌掉或多出线条
- 胡须把嘴完全遮住
- 发际线和年龄感不符合角色
- 背景过花
- 出现首饰、手、道具抢戏
- 出现边框、文字、水印、星光

## Export Rules

最终落库前统一：

1. 选中最佳 `1024x1024` 原图
2. 去掉任何角落装饰
3. 导出为 `512x512` PNG
4. 命名为 `static/avatars/characters/<id>.png`
