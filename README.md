# Huiyin Symposium

SvelteKit 骨架项目，用于《会饮》数字化研读。

## 技术栈

- SvelteKit + TypeScript
- Tailwind CSS
- shadcn-svelte 组件库
- Static Adapter（可部署静态站）

## 已完成的页面骨架

- `/reading`：对话阅读、人物筛选、实体高亮、注解侧栏
- `/characters`：人物索引
- `/themes`：观点主题地图
- `/relations`：人物关系图（静态 SVG）
- `/search`：全文搜索

## 数据文件

- `src/lib/data/dialogs.json`
- `src/lib/data/characters.json`
- `src/lib/data/places.json`
- `src/lib/data/annotations.json`
- `src/lib/data/themes.json`
- `src/lib/data/relations.json`

## 启动与构建

```bash
npm install
npm run dev
```

```bash
npm run check
npm run build
```
