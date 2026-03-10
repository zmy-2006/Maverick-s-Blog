# Maverick's Blog - GitHub + Vercel 部署说明

## 1. 最推荐的工作方式

最简单、最稳的方式不是额外再建一个“独立笔记仓库”，而是：

- 你的博客代码和笔记内容都放在同一个 GitHub 仓库里
- 笔记放在 `content/academic-ledger/`
- Vercel 直接连接这个 GitHub 仓库
- 以后每次你写完笔记，只要 `git push`，Vercel 就会自动重新构建并更新线上博客

这就是你要的效果：

1. 本地写笔记
2. 放进指定文件夹
3. 推送到 GitHub
4. 博客自动更新
5. 别人直接访问你的线上 URL

## 2. 笔记应该放哪里

统一放这里：

```text
content/academic-ledger/
```

课程、chapter、笔记的层级：

```text
content/academic-ledger/
  computer-networks/
    course.json
    fig/
      topology.png
      lecture1-diagram.png
    lecture-01/
      review.md
      exam-focus.md
    lecture-02/
      review.md
```

系统已经支持：

- `course.json` 作为课程元数据
- `lecture-01/` 这种 chapter 文件夹
- 一个 chapter 里放多个 `.md/.mdx`
- 图片优先在 chapter 目录找
- 找不到时自动去课程根目录的 `fig/` 里找

## 3. 你每次更新笔记的固定流程

假设你已经在这个博客项目目录里：

```bash
git add .
git commit -m "add lecture 3 computer networks notes"
git push origin main
```

推送后：

- GitHub 收到最新代码
- Vercel 自动开始部署
- 部署完成后，线上博客自动变成最新内容

你不需要让电脑一直开着，也不需要本地运行 `npm run dev` 给别人看。

## 4. 部署到 Vercel

### 第一步：把代码放到 GitHub

如果你已经有 GitHub 仓库，就把这个博客项目推上去。

### 第二步：登录 Vercel

打开：

[https://vercel.com](https://vercel.com)

建议直接用 GitHub 登录。

### 第三步：导入项目

在 Vercel 里：

1. 点击 `Add New...`
2. 选择 `Project`
3. 选择你的 GitHub 仓库
4. 点击导入

### 第四步：填写环境变量

这个项目至少需要：

```env
DATABASE_URL=你的数据库连接串
BLOB_READ_WRITE_TOKEN=你的 Vercel Blob Token
```

在 Vercel 项目后台：

1. 进入 `Settings`
2. 进入 `Environment Variables`
3. 添加上面两个变量

如果以后你本地 `.env.local` 改了，记得 Vercel 里面也要同步改。

### 第五步：部署

点击部署后，Vercel 会自动：

- 安装依赖
- 构建 Next.js
- 发布一个线上域名

部署完成后你会得到一个 URL，类似：

```text
https://mavericks-blog.vercel.app
```

别人直接打开这个地址就能访问。

## 5. 以后如何自动更新

只要满足这两个条件：

- Vercel 已经连接你的 GitHub 仓库
- 你是往已连接的分支推送代码（通常是 `main`）

那么以后每次：

```bash
git add .
git commit -m "update notes"
git push origin main
```

Vercel 都会自动重新部署。

## 6. 你部署前必须确认的事

### 数据库已经在线

推荐用：

- Neon
- Supabase Postgres
- Vercel Postgres

不能只用本地数据库，不然线上站点访问不到。

### Blob 也是线上可用

你现在上传文件使用的是 Vercel Blob，所以线上环境必须配好 `BLOB_READ_WRITE_TOKEN`。

## 7. 推荐你的最终工作流

以后你的习惯就固定成：

1. 新建或更新笔记到 `content/academic-ledger/课程/chapter/`
2. 如果有图片，就放到课程目录的 `fig/` 或 chapter 目录内
3. 本地检查一下效果
4. `git add . && git commit && git push`
5. 等 Vercel 自动部署
6. 把线上 URL 发给别人

## 8. 如果你想把“笔记”和“博客代码”分开

也可以，但会明显更复杂，因为需要额外做同步：

- Git 子模块
- GitHub Action 自动拷贝
- 或外部内容拉取逻辑

现阶段不建议。  
你当前最适合的是：

`一个仓库 = 博客代码 + 笔记内容`
