# 美宝管家 Astro + Pages CMS

保留原有美宝管家网站的视觉方向和现有页面，迁移为 Astro 静态站点，并增加便于维护近期报道和专业政策变化的 Pages CMS 编辑工作流。

## 主要路线

- `/`：原网站首页，原视觉、图片、核心交互和内容延续。
- `/consult.html`：保留咨询应用嵌入路线。
- `/privacy.html`：保留隐私声明地址。
- `/news/`：公开发布的新闻和政策整理列表。
- `/news/{slug}/`：单篇文章。
- `/editorial-policy/`：资料来源、状态和更新原则。
- `/sitemap.xml`、`/feed.xml`、`/robots.txt`、`/llms.txt`：搜索与内容发现文件。

## 本地预览

需安装 Node.js 22.12 或更高版本。

```sh
npm install
npm run dev
```

在本次工作区，npm registry 返回 403，因此未能生成 `package-lock.json` 或运行本地 Astro 构建。管理员在可访问 npm registry 的环境中首次运行 `npm install` 后，应提交生成的 `package-lock.json`，再将 CI 安装命令改为 `npm ci`。

正式构建：

```sh
npm run build
npm run preview
```

## 内容编辑

Pages CMS 设置位于仓库根目录 `.pages.yml`，文章保存在 `src/content/news/`。每篇文章使用独立英文 slug 作为固定 URL，常规 CMS 编辑不会重命名文件。编辑器可维护标题、来源、日期、适用地区、法律状态、摘要、来源链接、最近核对日期、正文、SEO 字段和是否发布。未发布条目不会生成公开页面、出现在首页/列表、RSS 或 sitemap。

CMS 上传媒体保存到 `public/images/uploads/`，公开 URL 为 `/images/uploads/`。

## 搜索与 GEO

每个页面有规范网址、描述、Open Graph 信息和索引控制；文章输出 Article JSON-LD、来源链接、明确的发布日期/核对日期/适用地区/状态。站点还提供 XML sitemap、RSS、robots.txt 和简明 `llms.txt`。这些结构提升机器理解与来源可追溯性，不保证搜索排名或 AI 搜索引用。

## 部署

GitHub Actions 在推送到 `main` 时构建 Astro 并发布 `dist/` 到 GitHub Pages。首次使用时，管理员需在仓库 Pages 设置里选择 GitHub Actions，并配置 Pages CMS GitHub App。

## 迁移说明

页面内容与风格主要来自上传的静态 HTML/CSS/JS 成品，而不是原始 Astro 源码。首页主体保留为 Astro 页面模板，样式和交互脚本保留为原资源文件；动态报道则迁移到经过字段验证的 Astro 内容集合。旧 sitemap 的 XML 路径保留为 `/sitemap.xml`。原 CNAME 文件保留 `www.surrogacybutler.com`。

详细操作见 [START-HERE.md](START-HERE.md)、[EDITOR-GUIDE.md](EDITOR-GUIDE.md)、[ADMIN-SETUP.md](ADMIN-SETUP.md) 与 [LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md)。
