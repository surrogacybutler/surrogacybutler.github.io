# 技术管理员设置指南

## 1. 先确认所有权

建议由美宝管家或其长期管理的组织拥有 GitHub 仓库、Pages CMS 连接和域名。至少两位可信管理员应能恢复仓库与发布访问。内容编辑者可在 Pages CMS 支持的情况下通过邮件邀请为 CMS 协作者，避免给日常编辑者仓库管理权限。

## 2. 导入项目

将本项目完整内容导入 Practice 拥有的 GitHub 仓库，并使用 `main` 作为生产分支。由于本次生成环境无法访问 npm registry，导入后请先运行一次 `npm install` 并提交 `package-lock.json`；随后可将工作流的安装命令改为 `npm ci`，获得可重复安装。仓库应包括 `.pages.yml`、`astro.config.mjs`、`package-lock.json`、`src/`、`public/` 和 `.github/workflows/deploy.yml`。

## 3. 启用 GitHub Pages 发布

在 GitHub 仓库的 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**。首次把代码推送到 `main` 后，打开 **Actions** 确认 “Deploy Astro site to GitHub Pages” 构建和发布成功。站点生成到 `dist/`。

## 4. 连接 Pages CMS

1. 登录 Pages CMS 并安装/授权其 GitHub App，只选择这个仓库。
2. 在仓库根目录确认 `.pages.yml` 已提交。
3. 回到 Pages CMS，打开仓库与 `main` 分支。
4. 验证“报道与政策更新”集合可见，可以新增未发布的测试草稿并保存。
5. 确认测试草稿不出现在公开 `/news/`、`/sitemap.xml` 或 `/feed.xml` 中。完成后删除测试草稿。
6. 邀请日常编辑者，并告知他们 CMS 保存会写入 GitHub 并触发部署。

## 5. 自定义域名

项目保留了原档案中的 `CNAME`：`www.surrogacybutler.com`，并将规范网址配置为 `https://www.surrogacybutler.com`。本次只创建网站文件，没有更改 GitHub 账户设置或 DNS。

只有在仓库归属、当前域名网站、DNS 提供商和邮箱记录确认后，才能配置域名。保留现有 MX、SPF、DKIM、DMARC 和验证记录。请在 GitHub Pages 设置中验证并添加 `www.surrogacybutler.com`，再按 GitHub 当前官方说明核对 DNS 目标；不要仅凭这份项目文件更改 DNS。DNS 成功后，分别验证 www、根域名跳转、HTTPS 和业务邮箱。

## 6. 常见问题与恢复

- **部署失败**：打开 Actions 失败任务，检查 Node 版本、依赖安装、Astro 构建日志和内容字段是否完整。
- **CMS 不显示集合**：确认 `.pages.yml` 在仓库根目录、分支正确、集合路径 `src/content/news` 与文件名一致。
- **文章未公开**：确认 `published: true`，且日期、摘要、来源 URL、状态与最近核对日期均有效。
- **恢复旧版本**：在 GitHub 查看文件历史，回退错误内容提交；然后确认 Pages 工作流程重新成功。
- **移交或撤销访问**：先指定新的长期所有者，再转移仓库和域名管理；撤销离任人员的 CMS、GitHub 和域名访问。

不要在公开仓库中保存客户资料、医疗记录、咨询表响应、密码、令牌或 API 密钥。咨询应用仍由现有外部 Google Apps Script 提供，本站静态托管不处理表单提交。
