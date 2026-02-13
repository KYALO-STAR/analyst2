# PulseTrader Frontend

This repository contains the PulseTrader React + TypeScript frontend application.

Quick start

1. Copy environment values:

```bash
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

2. Install dependencies and run in development:

```powershell
npm ci
npm run start
```

3. Admin panel: visit `http://localhost:3000/admin` and sign in using your Supabase admin user.

Repository cleanup done by the automated script includes adding `.gitignore`, `.env.example`, and a CI workflow.

Deployment

- The project uses `rsbuild` for dev and build by default (see `package.json` scripts). For static hosting (Vercel, Netlify), configure environment variables and use `npm run build`.

CI

A GitHub Actions workflow is included to run build and tests on pushes to `main`.

Security notes

- Do not commit secrets. Use `.env` for local dev and the GitHub repository/hosting provider secrets for CI/deploy.
- If you need help making Supabase storage objects public or switching to signed URLs for production, I can help implement that.
