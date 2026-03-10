# Maverick's Blog - 本地配置说明

部署上线与 GitHub 自动更新流程请看：

- `DEPLOY.md`
- `NOTE_REPO_TEMPLATE/`

## 0) 先确认

- GitHub 仓库用于托管代码，不能直接作为数据库。
- 你已经成功推送到仓库：`main` 分支可用。

## 1) 配置环境变量

创建本地配置文件：

```bash
cp .env.example .env.local
```

编辑 `.env.local`（必须替换成真实值）：

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public"
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxx"
```

说明：
- `DATABASE_URL` 建议使用 Neon/Supabase/Vercel Postgres 的连接串
- `BLOB_READ_WRITE_TOKEN` 来自 Vercel Blob 控制台

## 2) 安装依赖

```bash
npm install --legacy-peer-deps
```

## 3) 检查数据库配置是否合法

```bash
npm run setup:check
```

## 4) Prisma 初始化数据库

生成 Prisma Client：

```bash
npm run prisma:generate
```

把 schema 推到数据库：

```bash
npm run prisma:push
```

## 5) 启动项目

```bash
npm run dev
```

打开 `http://localhost:3000`。

## 6) 上传流程验证（Phase 3）

访问 `/depository`：

- 选择分区（`life` / `notes` / `research` / `tech`）
- 拖拽文件或点击“选择文件”
- 点击 `Commit To Vault`
- 成功后会：
  - 上传文件到 Vercel Blob
  - 写入 PostgreSQL `VaultAsset` 表
  - 页面显示已归档资产

## 7) 常见报错

- **Environment variable not found: DATABASE_URL**
  - 先确认 `.env.local` 存在且已填写真实值
  - 已配置脚本自动读取 `.env.local`

- **Upload failed. Please check Blob/Database configuration**
  - 检查 `BLOB_READ_WRITE_TOKEN` 是否有效
  - 检查 `DATABASE_URL` 是否可连通

- **prisma:push 连接失败**
  - 通常是数据库白名单、账号密码或 URL 填写错误
