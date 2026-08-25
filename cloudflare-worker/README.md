# Cloudflare Worker — Contact Form Backend

This directory contains the serverless contact form handler that processes
form submissions from the portfolio site and dispatches emails via Resend.

## Why a Cloudflare Worker?

GitHub Pages is a static host — it cannot run server-side code. The Worker runs
at Cloudflare's edge (free tier, 100k requests/day) and handles:
- Input validation & rate limiting
- Resend API email dispatch
- CORS — only allows requests from `princeyadav7.github.io`

---

## One-Time Setup

### 1. Install Wrangler (Cloudflare's CLI)
```bash
npm install -g wrangler
wrangler login
```

### 2. Set your Resend API key as a secret
```bash
cd cloudflare-worker
wrangler secret put RESEND_API_KEY
# Paste your key when prompted: re_XXXX...
```
> ⚠️ Never put the key in `wrangler.toml` or commit it to the repo.

### 3. Deploy the Worker
```bash
wrangler deploy
```

Wrangler will output a URL like:
```
https://prince-portfolio-contact.YOUR-SUBDOMAIN.workers.dev
```

### 4. Update the portfolio's `js/main.js`
Replace the placeholder in the fetch call with your actual Worker URL:
```js
const res = await fetch('https://prince-portfolio-contact.YOUR-SUBDOMAIN.workers.dev/api/contact', {
```

### 5. Update CORS in `worker.js`
If you ever add a custom domain, add it to `ALLOWED_ORIGINS` in `worker.js`.

---

## Re-deploying after changes
```bash
cd cloudflare-worker
wrangler deploy
```

## Viewing logs (real-time)
```bash
wrangler tail
```
