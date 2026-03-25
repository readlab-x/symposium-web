# 会饮研读台

`symposium-web` 是一个围绕柏拉图《会饮》构建的数字研读网站。它不是单纯的文本展示页，而是把原文阅读、人物索引、主题地图、关系图与全文搜索组织成一套可进入、可跳转、可对照的阅读界面。

在线地址：

- https://readlab-x.github.io/symposium-web/

## 这个项目能做什么

- 在 [阅读台](https://readlab-x.github.io/symposium-web/reading/) 中按发言顺序阅读文本，并结合场景筛选、人物筛选和注解辅助理解。
- 在 [人物索引](https://readlab-x.github.io/symposium-web/characters/) 中查看主要角色、头像、人物简介与外部百科入口。
- 在 [主题地图](https://readlab-x.github.io/symposium-web/themes/) 中按“荣誉、欲望、完整、美、不朽”等主题横向进入文本。
- 在 [关系图](https://readlab-x.github.io/symposium-web/relations/) 中查看人物之间的回应、继承、修正与叙事关联。
- 在 [全文搜索](https://readlab-x.github.io/symposium-web/search/) 中按关键词检索《会饮》相关文本内容。

## 项目特点

- 双语阅读：当前界面支持中英内容切换，同时保留统一的静态 SEO 输出。
- 阅读辅助：注解、人物、主题和关系四条路径互相联通，不是孤立页面。
- 角色资产：项目内置统一风格的人物头像资源，并在人物页和关系图中复用。
- 静态部署：基于 SvelteKit 静态构建，可直接部署到 GitHub Pages 子路径。
- SEO 集中管理：标题、描述、canonical、Open Graph、Twitter Card、JSON-LD、robots、sitemap 由统一模块生成。

## 快速开始

安装依赖：

```bash
npm install
```

本地开发：

```bash
npm run dev
```

类型检查：

```bash
npm run check
```

生产构建：

```bash
npm run build
```

如果你需要按 GitHub Pages 的线上方式验证子路径部署，可以这样构建：

```powershell
$env:BASE_PATH='/symposium-web'
$env:SITE_URL='https://readlab-x.github.io/symposium-web'
pnpm build
```

## 技术栈

- SvelteKit
- Svelte 5
- TypeScript
- Tailwind CSS v4
- Bits UI / shadcn-svelte 组件模式
- AntV G6 人物关系图
- GitHub Pages 静态部署

## 重要目录

- `src/routes/`：页面路由
- `src/lib/components/`：阅读台、关系图、UI 组件
- `src/lib/data/`：对话、人物、主题、注解、关系等核心数据
- `src/lib/seo/`：SEO 配置与 metadata 生成逻辑
- `static/avatars/characters/`：人物头像资源
- `static/branding/`：站点 logo、favicon 等品牌资源
- `docs/`：技术文档、设计方案、提示词与原始资料

## 文档入口

项目文档入口在 [docs/README.md](https://github.com/readlab-x/symposium-web/blob/master/docs/README.md)。

当前建议优先阅读：

- [项目 SEO 技术文档](https://github.com/readlab-x/symposium-web/blob/master/docs/seo-technical-guide.md)
- [GitHub Pages 部署设计](https://github.com/readlab-x/symposium-web/blob/master/docs/plans/2026-03-21-github-pages-deployment-design.md)
- [GitHub Pages 部署实施计划](https://github.com/readlab-x/symposium-web/blob/master/docs/plans/2026-03-21-github-pages-deployment-implementation.md)

## 项目状态

当前项目已经具备完整的静态阅读站点骨架与核心内容导航结构，后续可继续扩展：

- 更细的注解体系
- 更完整的技术文档
- 更系统的内容数据维护流程
- 更细粒度的性能与 SEO 优化

## Content Sync

When using the shared `symposium-content` repository, rebuild the shared artifacts first and then refresh this app:

```bash
cd ../symposium-content
node scripts/build.mjs

cd ../symposium-web
npm run sync:content
```

This repository keeps the synced JSON files plus generated `content-i18n.js` and `reading-i18n.js` wrapper modules locally so the existing Svelte imports stay stable.
