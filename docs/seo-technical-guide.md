# 项目 SEO 技术文档

本文档说明 `symposium-web` 当前的 SEO 实现方式，重点不是泛泛解释 SEO 概念，而是帮助你快速看懂“这个项目现在是怎么做的”以及“以后应该改哪里”。

## 1. 目标与边界

本项目的 SEO 目标比较明确：

- 为静态站点输出稳定的标题、描述、canonical、Open Graph、Twitter 元数据和结构化数据
- 为搜索引擎生成 `robots.txt` 和 `sitemap.xml`
- 兼容 GitHub Pages 的子路径部署
- 保持当前双语阅读体验，但不引入额外的 `/en` 路由树

当前实现有几个明确边界：

- 没有做 `hreflang`
- 没有做动态 OG 图生成
- 没有按语言拆分独立页面 SEO
- 没有给搜索页建立可索引的结果 URL

## 2. SEO 架构总览

这套 SEO 是“集中式”的，不是每个页面单独手写 `<head>`。

核心链路如下：

1. [site-config.js](/d:/Repository/6iedog/huiyin-symposium/src/lib/seo/site-config.js) 定义 SEO 的静态配置源，包括站点默认地址、默认图片、每个路由的标题、描述、索引策略和是否进入 sitemap。
2. [metadata.js](/d:/Repository/6iedog/huiyin-symposium/src/lib/seo/metadata.js) 把这些静态配置转换成真正可渲染的 SEO 数据，包括 canonical、Open Graph、Twitter 和 JSON-LD。
3. [+layout.server.ts](/d:/Repository/6iedog/huiyin-symposium/src/routes/+layout.server.ts) 在服务端根据当前路径生成 `seo` 对象。
4. [+layout.svelte](/d:/Repository/6iedog/huiyin-symposium/src/routes/+layout.svelte) 统一把 `seo` 对象输出到 `<head>`。
5. [robots.txt/+server.ts](/d:/Repository/6iedog/huiyin-symposium/src/routes/robots.txt/+server.ts) 和 [sitemap.xml/+server.ts](/d:/Repository/6iedog/huiyin-symposium/src/routes/sitemap.xml/+server.ts) 用同一套 SEO helper 生成 crawl 资产。

这意味着：

- 想改某个页面的标题或描述，主要改 `ROUTE_SEO`
- 想改 canonical 规则、JSON-LD 规则或 sitemap 规则，主要改 `metadata.js`
- 想改部署域名或子路径，主要改 `SITE_URL` 和 `BASE_PATH`

## 3. 关键文件与职责

### 3.1 站点 SEO 配置

[site-config.js](/d:/Repository/6iedog/huiyin-symposium/src/lib/seo/site-config.js) 是目前最重要的 SEO 配置入口。

它负责定义：

- `DEFAULT_SITE_URL`
- `SITE_NAME_ZH`
- `SITE_NAME_EN`
- `SITE_DESCRIPTION`
- `DEFAULT_OG_IMAGE_PATH`
- `ROUTE_SEO`
- `PUBLIC_SITEMAP_PATHS`

其中 `ROUTE_SEO` 是整个项目的路由级 SEO 真正“配置中心”。当前覆盖这些路径：

- `/`
- `/reading`
- `/characters`
- `/themes`
- `/relations`
- `/search`

每个条目至少定义：

- `title`
- `description`
- `robots`
- `schemaTypes`
- `sitemap`

## 4. Metadata 生成逻辑

[metadata.js](/d:/Repository/6iedog/huiyin-symposium/src/lib/seo/metadata.js) 负责把静态配置加工成页面实际使用的 SEO 数据。

### 4.1 URL 规范化

这里有几步基础处理：

- `normalizePathname(pathname)` 把路径标准化，例如把 `/reading/` 处理成 `/reading`
- `normalizeSiteUrl(siteUrl)` 确保站点地址带协议并去掉尾部斜杠
- `buildCanonicalUrl(pathname, siteUrl)` 把规范化后的路径和站点地址拼成 canonical

这能保证：

- 首页 canonical 总是以 `/` 结尾
- 其他页面 canonical 不带多余斜杠
- canonical 不受 query 和 hash 干扰

### 4.2 路由 SEO 选择

`getSeoMetadata({ pathname, siteUrl })` 会先根据路径查到 `ROUTE_SEO` 中的配置，再生成：

- `title`
- `description`
- `robots`
- `canonicalUrl`
- `imageUrl`
- `jsonLd`
- `openGraph`
- `twitter`

### 4.3 JSON-LD

当前结构化数据策略是：

- 首页输出两个 schema：
  - `WebSite`
  - `WebPage`
- 其他页面输出一个 schema，类型取自 `schemaTypes[0]`

因此当前页面类型大致是：

- `/` -> `WebSite` + `WebPage`
- `/reading` -> `WebPage`
- `/characters` -> `CollectionPage`
- `/themes` -> `CollectionPage`
- `/relations` -> `CollectionPage`
- `/search` -> `SearchResultsPage`

## 5. Head 标签是如何渲染出来的

[+layout.server.ts](/d:/Repository/6iedog/huiyin-symposium/src/routes/+layout.server.ts) 是服务端入口。它做两件事：

1. 用 `stripBasePath(process.env.BASE_PATH || "", url.pathname)` 去掉 GitHub Pages 子路径
2. 用 `process.env.SITE_URL || DEFAULT_SITE_URL` 作为 canonical 和 sitemap 的站点根地址

然后它把 `seo` 对象放进 layout data。

[+layout.svelte](/d:/Repository/6iedog/huiyin-symposium/src/routes/+layout.svelte) 再统一渲染这些标签：

- `<title>`
- `<meta name="description">`
- `<meta name="robots">`
- `<link rel="canonical">`
- Open Graph 一组 meta
- Twitter Card 一组 meta
- JSON-LD `<script type="application/ld+json">`
- favicon

这个实现的优点是：

- 所有页面共用一套输出逻辑
- 每个页面不需要重复写 SEO 代码
- 静态预渲染时就能生成稳定 head

## 6. 语言策略

[app.html](/d:/Repository/6iedog/huiyin-symposium/src/app.html) 当前固定使用：

```html
<html lang="zh-CN">
```

这和项目当前 SEO 策略是一致的，因为：

- 默认首屏内容以中文为主
- 页面标题和描述采用“中英混合”的稳定文案
- 用户在前端切换语言，不会生成另一套路由级 SEO 页面

所以目前这是“一个站点、一套路由、一套稳定 SEO 文案”的模式，而不是多语言 SEO 模式。

## 7. robots.txt 与 sitemap.xml

这两个 crawl 文件不是放在 `static/` 里手写死的，而是通过路由端点动态生成并参与预渲染。

### 7.1 robots.txt

[robots.txt/+server.ts](/d:/Repository/6iedog/huiyin-symposium/src/routes/robots.txt/+server.ts) 调用 `buildRobotsTxt()` 输出内容。

当前行为是：

- 允许默认抓取
- 把 sitemap 指向 `SITE_URL + /sitemap.xml`

例如当前生产地址下会生成：

```txt
User-agent: *
Disallow:

Sitemap: https://github.6iedog.com/symposium-web/sitemap.xml
```

### 7.2 sitemap.xml

[sitemap.xml/+server.ts](/d:/Repository/6iedog/huiyin-symposium/src/routes/sitemap.xml/+server.ts) 调用 `buildSitemapXml()` 生成 XML。

sitemap 的页面来源不是手写列表，而是 [site-config.js](/d:/Repository/6iedog/huiyin-symposium/src/lib/seo/site-config.js) 里的 `PUBLIC_SITEMAP_PATHS`，它来自 `ROUTE_SEO` 中 `sitemap: true` 的页面。

这保证了：

- sitemap 和页面 SEO 配置共享同一个来源
- 某个页面是否进入 sitemap，不需要维护两份配置

## 8. 当前索引策略

当前索引策略很清楚：

- `index,follow`
  - `/`
  - `/reading`
  - `/characters`
  - `/themes`
  - `/relations`
- `noindex,follow`
  - `/search`

这样设计的原因是：

- 首页和 4 个主要内容页是稳定内容页，适合被索引
- 搜索页虽然对用户有用，但结果是临时性的，不适合做搜索引擎入口页

同时因为 `/search` 的 `sitemap` 是 `false`，它也不会进入 sitemap。

## 9. GitHub Pages 子路径部署为什么会影响 SEO

这个项目不是部署在域名根目录，而是部署在：

`https://github.6iedog.com/symposium-web`

这意味着 SEO 不能只考虑“域名”，还必须考虑“子路径”。

当前相关配置分布在两个地方：

- [svelte.config.js](/d:/Repository/6iedog/huiyin-symposium/svelte.config.js)
- [deploy-pages.yml](/d:/Repository/6iedog/huiyin-symposium/.github/workflows/deploy-pages.yml)

### 9.1 `BASE_PATH`

[svelte.config.js](/d:/Repository/6iedog/huiyin-symposium/svelte.config.js) 读取 `process.env.BASE_PATH`，并把它放进 `kit.paths.base`。

当前 GitHub Pages 工作流里设置的是：

- `SITE_URL=https://github.6iedog.com/symposium-web`
- `BASE_PATH=/symposium-web`

### 9.2 为什么 `+layout.server.ts` 还要 strip base path

SvelteKit 部署在子路径下时，服务端拿到的 `url.pathname` 可能是：

- `/symposium-web/reading`

但 `ROUTE_SEO` 的 key 是：

- `/reading`

所以在 [+layout.server.ts](/d:/Repository/6iedog/huiyin-symposium/src/routes/+layout.server.ts) 里必须先用 [base-paths.js](/d:/Repository/6iedog/huiyin-symposium/src/lib/paths/base-paths.js) 的 `stripBasePath()` 去掉子路径，否则 SEO 路由匹配会错位，最后可能回退到首页配置。

## 10. 当前图片与 favicon 的 SEO 行为

当前默认分享图来自：

- [logo.png](/d:/Repository/6iedog/huiyin-symposium/static/branding/logo.png)

它在 [site-config.js](/d:/Repository/6iedog/huiyin-symposium/src/lib/seo/site-config.js) 中由：

- `DEFAULT_OG_IMAGE_PATH = "/branding/logo.png"`

定义。

favicon 则在 [+layout.svelte](/d:/Repository/6iedog/huiyin-symposium/src/routes/+layout.svelte) 中通过：

- `toAssetPath('/branding/favicon.png')`

输出。

这里用 `toAssetPath()` 的意义是保证静态资源在子路径部署下仍然能被正确引用。

## 11. 以后怎么改

### 11.1 新增一个需要 SEO 的页面

你通常需要改这些地方：

1. 在 [site-config.js](/d:/Repository/6iedog/huiyin-symposium/src/lib/seo/site-config.js) 的 `ROUTE_SEO` 里加一个新路径
2. 设置：
   - `title`
   - `description`
   - `robots`
   - `schemaTypes`
   - `sitemap`
3. 如果页面应该进入 sitemap，确保 `sitemap: true`
4. 跑验证命令

### 11.2 修改站点域名或仓库子路径

你通常需要改这些地方：

- [site-config.js](/d:/Repository/6iedog/huiyin-symposium/src/lib/seo/site-config.js) 里的 `DEFAULT_SITE_URL`
- [deploy-pages.yml](/d:/Repository/6iedog/huiyin-symposium/.github/workflows/deploy-pages.yml) 里的 `SITE_URL`
- [deploy-pages.yml](/d:/Repository/6iedog/huiyin-symposium/.github/workflows/deploy-pages.yml) 里的 `BASE_PATH`
- 对应测试中的站点地址断言

### 11.3 修改 OG 图

改：

- [site-config.js](/d:/Repository/6iedog/huiyin-symposium/src/lib/seo/site-config.js) 的 `DEFAULT_OG_IMAGE_PATH`

同时确认新资源在 `static/` 中存在，并且构建后 URL 可访问。

### 11.4 修改索引策略

改：

- [site-config.js](/d:/Repository/6iedog/huiyin-symposium/src/lib/seo/site-config.js) 中对应路由的 `robots`
- 如果不想进 sitemap，也同步改 `sitemap`

## 12. 常见坑

这个项目当前最容易踩的是这几类问题：

- 只改了 `SITE_URL`，没改 `BASE_PATH`
- 改了 GitHub 仓库名，但测试和 workflow 仍引用旧路径
- 页面已经存在，但没加到 `ROUTE_SEO`，结果 SEO 回退到首页
- 把不该索引的页面放进了 sitemap
- 直接写根路径资源 URL，没有走子路径友好的 helper

## 13. 验证命令

如果你改了项目 SEO，建议至少跑下面这组命令：

```bash
node tests/seo-metadata.test.mjs
node tests/seo-assets.test.mjs
node tests/github-pages-workflow.test.mjs
pnpm check
```

如果你改了部署域名、仓库名或 GitHub Pages 子路径，再补跑一次构建：

```bash
BASE_PATH=/symposium-web SITE_URL=https://github.6iedog.com/symposium-web pnpm build
```

在 PowerShell 里对应写法是：

```powershell
$env:BASE_PATH='/symposium-web'
$env:SITE_URL='https://github.6iedog.com/symposium-web'
pnpm build
```

## 14. 一句话总结

本项目的 SEO 不是散落在各页面里的，而是一套“集中配置 + 服务端生成 + 根布局渲染 + 预渲染 crawl 文件 + 子路径部署适配”的结构。只要你记住 `site-config.js` 是配置入口、`metadata.js` 是计算层、`+layout.server.ts` / `+layout.svelte` 是输出层，再配合 `robots.txt`、`sitemap.xml` 和 `BASE_PATH` / `SITE_URL`，后续维护就不会乱。

