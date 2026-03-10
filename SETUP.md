# Maverick's Blog - Local Setup

## 1) Environment Variables

Create a local env file:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public"
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxx"
```

## 2) Install Dependencies

```bash
npm install --legacy-peer-deps
```

## 3) Prisma Setup

Generate Prisma client:

```bash
npm run prisma:generate
```

Push schema to your database:

```bash
npm run prisma:push
```

## 4) Run the Project

```bash
npm run dev
```

Open `http://localhost:3000`.

## 5) Upload Flow (Phase 3)

On `/depository`:

- Select a partition (`life`, `notes`, `research`, `tech`)
- Drag files into the intake area (or use "选择文件")
- Click `Commit To Vault`
- File is uploaded to Vercel Blob and metadata is saved to PostgreSQL (`VaultAsset`)

## 6) Common Issues

- **Missing `DATABASE_URL`**: add it to `.env.local`
- **Missing `BLOB_READ_WRITE_TOKEN`**: add your Vercel Blob read-write token
- **`prisma:push` fails**: verify your Postgres host/user/password and network access
- **Upload fails**: check Blob token scope and DB connectivity
