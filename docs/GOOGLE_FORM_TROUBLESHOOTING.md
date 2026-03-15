# Google Form Troubleshooting — Common Ground

## Why Pattern Quiz works but Common Ground doesn't

| | Pattern Quiz | Common Ground |
|---|--------------|---------------|
| **How it submits** | Native HTML form with `action` pointing directly to Google | JavaScript: fetch to our proxy → iframe fallback |
| **Proxy needed?** | No | **Yes** (proxy must be reachable) |
| **Works when testing locally?** | Yes (form POSTs directly) | Only if server is running |

**Pattern Quiz** uses a simple form: `action="https://docs.google.com/forms/.../formResponse"` and `target="iframe"`. The browser submits directly to Google. No proxy.

**Common Ground** saves to Firestore first, then submits to Google via:
1. **Proxy** (preferred) — `fetch('/api/common-ground-google-form')` → our server POSTs to Google
2. **Iframe fallback** — If proxy fails (404, etc.), we create a form and submit it (like the quiz)

**The proxy must be reachable.** If you open `file:///.../common-ground.html` or run without the server, the proxy returns 404 → iframe fallback. The iframe sends from your browser origin; Google may reject some origins.

## How to test Common Ground correctly

### Local testing (must run server)

```bash
node server.js
```

Then open **http://localhost:3000/common-ground.html** (not by double-clicking the file).

### Production (deploy first)

Deploy to Vercel so `/api/common-ground-google-form` is live. Then test on mypatternreset.com.

## If data still doesn't appear

### 1. Run the test script

```bash
node docs/test-google-form-submit.js
```

- **200 OK** → Form accepts submissions. Check your sheet for "Test User". If it's there, the issue is the app flow (proxy not being called).
- **400** → Form is rejecting. Check settings below.

### 2. Google Form settings

**Settings** (gear) → **Responses**:

| Setting | Fix |
|---------|-----|
| **Send responders a copy of their response** | **OFF** — Enables CAPTCHA, blocks programmatic submissions |
| **Restrict to users in [org]** | Off |

### 3. Check browser console

When you submit, open DevTools (F12) → Console. You should see:
- Nothing if proxy succeeds
- `"Proxy unreachable"` if you're testing without the server
- `"Proxy said Google rejected"` if Google returned 400

## Quick checklist

- [ ] Run `node docs/test-google-form-submit.js` — 200 OK?
- [ ] Check sheet for "Test User" row
- [ ] "Send responders a copy" is **OFF**
- [ ] Local: run `node server.js` and use http://localhost:3000/common-ground.html
- [ ] Production: deploy to Vercel
