# AdFlow - Cloudflare + D1 Setup Guide

This guide walks you through deploying AdFlow to Cloudflare Workers with D1 as the database.

## Prerequisites

- [Cloudflare account](https://dash.cloudflare.com/sign-up)
- Node.js 18+
- Wrangler CLI (installed as dev dependency)

## Step 1: Install Dependencies

```bash
npm install @opennextjs/cloudflare wrangler @prisma/adapter-d1 --save-dev --legacy-peer-deps
```

> **Note**: `--legacy-peer-deps` may be needed if you encounter peer dependency conflicts. AdFlow supports Next.js 14 and 15.

## Step 2: Create D1 Database

1. Log in to Cloudflare (if not already):
   ```bash
   npx wrangler login
   ```

2. Create the D1 database:
   ```bash
   npx wrangler d1 create adflow-db
   ```

3. Copy the `database_id` from the output and paste it into `wrangler.jsonc`:
   ```jsonc
   "d1_databases": [
     {
       "binding": "DB",
       "database_name": "adflow-db",
       "database_id": "YOUR_DATABASE_ID_HERE"
     }
   ]
   ```

## Step 3: Apply Migrations

Apply the schema to your D1 database:

```bash
# For remote (production) D1
npx wrangler d1 migrations apply adflow-db --remote

# For local dev (optional - use when running preview)
npx wrangler d1 migrations apply adflow-db --local
```

## Step 4: Environment Variables

### Local development (`.env`)

Keep your existing `.env` for local SQLite when running `next dev`:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

### Cloudflare (Dashboard)

For production, set these in [Cloudflare Dashboard → Workers & Pages → your project → Settings → Variables and Secrets](https://dash.cloudflare.com):

- `NEXTAUTH_URL` - Your production URL (e.g. `https://adflow.yourdomain.com`)
- `NEXTAUTH_SECRET` - A random secret string
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console

Update your Google OAuth redirect URI to include your production URL.

## Step 5: Deploy

### Option A: Deploy from local / CI

```bash
npm run deploy
```

This builds your app with OpenNext and deploys to Cloudflare Workers.

### Option B: Deploy as Worker from Git (Workers Builds)

Use **Workers Builds** instead of Pages to deploy as a Cloudflare Worker with automatic CI/CD from GitHub.

1. In [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Create Worker** → **Import from Git**
2. Connect your GitHub repo (e.g. `Bookersy/test-ads`)
3. In **Settings → Build**, set:
   - **Build command**: `npm ci && npx opennextjs-cloudflare build`
   - **Deploy command**: `npx wrangler deploy`
   - **Root directory**: leave empty (or `.` if needed)
4. Ensure D1 is created and `database_id` is set in `wrangler.jsonc`
5. Add **Build variables** (optional): `DATABASE_URL` = `file::memory:` — the build uses this during prerender when D1 isn’t available (in-memory SQLite is fine for static page generation)
6. Add **Runtime variables** in **Settings → Variables & Secrets**:
   - `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

**Note:** The app uses `file::memory:` as a fallback when `DATABASE_URL` is not set during build, so the build command works even without build variables.

## Local Development

- **Standard Next.js dev** (uses SQLite from `.env`):
  ```bash
  npm run dev
  ```

- **Preview with Cloudflare runtime** (uses local D1 simulation):
  ```bash
  npm run preview
  ```

## How It Works

- **Local `next dev`**: Uses SQLite via `DATABASE_URL` when Cloudflare bindings aren't available
- **Cloudflare (preview/deploy)**: Uses D1 via the `DB` binding with Prisma's D1 adapter
- The `getDb()` function in `src/lib/db.ts` automatically selects the right database based on the environment

## Troubleshooting

### "getCloudflareContext has been called without initOpenNextCloudflareForDev"

Ensure `initOpenNextCloudflareForDev()` is called in `next.config.js` and the `@opennextjs/cloudflare` package is installed.

### Next.js 15 peer dependency

OpenNext requires Next.js 15+. If you're on Next.js 14, either upgrade (`npm install next@15`) or use `--legacy-peer-deps` when installing OpenNext.

### Build fails with Prisma

Run `npx prisma generate` before building. Ensure `serverExternalPackages: ["@prisma/client", ".prisma/client"]` is in your Next.js config.
