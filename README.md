# Study Companion

React + Vite study dashboard with AI tools (summary, questions, flashcards).

https://loomcognitive.netlify.app/dashboard

## 1) Local setup

```bash
npm install
npm run dev
```

Then copy `.env.example` to `.env` and fill values as needed.

## 2) Environment variables

Frontend (`.env`, public at build-time):

- `VITE_AI_API_URL` (default: `/api/generate`)
- `VITE_GROQ_API_KEY` (optional local fallback only; avoid in production, must start with `gsk_`)

Server-side (`GROQ_API_KEY`, secret):

- Used by `api/generate.js` (Vercel serverless function)
- Set this in your deploy platform dashboard, not in GitHub code

## 3) GitHub-ready security checklist

- `.env` files are gitignored.
- Use `.env.example` as template.
- Never commit keys to source files.
- If a key was exposed previously, rotate/revoke it immediately.

## 4) Deploy from GitHub (recommended: Vercel)

1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. Add environment variable in Vercel project settings:
   - `GROQ_API_KEY=your_real_key`
4. Deploy.

This project includes:

- `api/generate.js` for secure server-side Groq calls
- `vercel.json` for SPA + API routing
- `.github/workflows/ci.yml` for build checks on push/PR

## 5) Notes about GitHub Pages

GitHub Pages is static hosting only, so it cannot safely keep API keys server-side.
If you use GitHub Pages, host the API elsewhere and set `VITE_AI_API_URL` to that backend URL.
