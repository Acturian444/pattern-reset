# Full handoff context — Pattern Reset™ (for AI / new sessions)

Condensed engineering and product context for **continuing work without losing prior decisions**. Last aligned with repo state including **Personal Relationship Read** funnel, **post-Stripe thanks** flow, and **relationship quiz overhaul** work.

---

## 1. Product & site purpose

- **Brand:** Pattern Reset™ — relationship patterns, quiz-led positioning, paid offers (reads, course, Let It Out unlocks, Common Ground events).
- **Primary quiz:** “My Pattern” on `index.html` (`#quiz-section`); results drive paywall / upsells and can **prefill** the Personal Relationship Read intake.
- **Tone / design:** Dark funnels (e.g. PR read) use **Anton** + **DM Sans**, high contrast, accent **red** `#f10000` (see `styles/personal-relationship-read.css`).

---

## 2. Tech stack

| Layer | Choice |
|-------|--------|
| **Pages** | Static HTML + inline/menu scripts (no React/Vue app shell). |
| **Server** | **Express** in `server.js` — Stripe Checkout creation, verify session, Stripe publishable config, Common Ground Google Form proxy. |
| **Payments** | **Stripe Checkout** (mode `payment`), Stripe Node SDK (`stripe` npm package). |
| **Config** | **`dotenv`** — `.env` at project root (not committed). |
| **Deploy** | **Vercel** — `@vercel/node` for `server.js`, static for `**/*`; rewrites route API paths to `server.js` (`vercel.json`). |
| **Data / wall** | **Firebase** (config in `js/config/firebase-config.js`, rules/indexes in repo) for Let It Out / posts as applicable. |
| **Analytics** | Google tag on key pages (e.g. PR read thanks). |

**Not in stack:** No Next.js; no central bundler for site JS (files loaded via `<script src>` with cache query params).

---

## 3. Important pages & flows (inventory)

### Core site

- `index.html` — Quiz landing + quiz UI + results experience.
- `home.html` — Large marketing home.
- `philosophy.html` — Pattern Reset System™ (linked from PR thanks “while you wait”).
- `letitout.html` — Community wall; unlock / posts (`js/postForm.js`, Firebase).
- `common-ground.html` + `common-ground/checkout.html`, `thank-you.html`, `event-terms.html` — Events funnel.
- `legal.html`, `patterns.html`, `pattern-theory.html`, `liamsaysit.html`, etc.

### Personal Relationship Read ($59)

| File | Role |
|------|------|
| `personal-relationship-read.html` | Intake form, Stripe.js, prefill from quiz, **draft autosave**, redirect to Checkout, early redirect if old success URL hits intake. |
| `personal-relationship-read-thanks.html` | **Post-payment** confirmation: loading → verified / unverified / nosession (single visible state). |
| `js/personal-relationship-read.js` | Intake logic, `create-checkout-session`, draft keys, cancel restore, `thanksPageBaseUrl()`. |
| `js/personal-relationship-read-thanks.js` | `setView()` for mutually exclusive panels; `verifyCheckoutWithRetry()` → `/api/verify-checkout`; clears storage on verified. |
| `styles/personal-relationship-read.css` | Funnel + thanks layout, steps, loading spinner, nosession bullets, etc. |

### Course / legacy product HTML

- `product/breakup-course.html`, `course/breakup-course.html` — Course purchase; uses `/api/verify-checkout` in `js/course.js`.

### Backups

- `backup/2025-03-08-pre-overhaul/` — Snapshot of older quiz/results files.

---

## 4. Work completed in recent sessions (do not redo blindly)

### Personal Relationship Read — UX & engineering

1. **Draft persistence:** `sessionStorage` key **`prReadIntakeDraft`** — debounced save on intake `input`/`change`; **restore on load** before quiz prefill; quiz prefill only fills **empty** fields (including stage/fear only if selects still empty). Cleared after **verified** payment on thanks page; cleared when starting checkout (pending order holds snapshot).
2. **Pending order:** **`prReadPendingOrder`** written before Stripe redirect; on **`?checkout=cancelled`** intake restored from pending; on success thanks page clears both draft and pending after verify.
3. **Success URL:** Stripe **`success_url`** points to **`personal-relationship-read-thanks.html?checkout=success&session_id={CHECKOUT_SESSION_ID}`** (not the intake page). Intake still **`replace`**s to thanks if someone lands on intake with success query (legacy).
4. **Thanks page redesign:** Calmer typography (sentence-case title on success), **“What happens next”** numbered steps, **“While you wait”** CTAs tied to product (e.g. philosophy + quiz), **Return home** as quiet link. **Unverified** copy assumes payment may still have succeeded; **nosession** for missing query — hubs (**home** + **quiz**), application link demoted to footer line.
5. **Verification robustness:** Client uses **`r.text()` + `JSON.parse`**; **one retry** after ~1.3s on 5xx / parse errors. **Unverified** panel notes file/static preview cannot call API.
6. **Single-state UI:** `setView()` shows exactly one of: loading, verified, unverified, nosession.
7. **Funnel close (×) on thanks:** Navigates to **`home.html`** (not `history.back()`), with aria-label **Exit to home**.
8. **Removed** success **modal** from intake HTML (success is full thanks page only).

### Relationship quiz overhaul (branch / files)

Git context at one point: **`feature/relationship-quiz-overhaul`** with edits to:

- `index.html`
- `js/quiz/pattern-determiner.js`
- `js/quiz/quiz-config.js`
- `js/quiz/quiz-data.js`
- `js/results-renderer-v2.js`

Plus paywall-related scripts if wired on index (e.g. `js/clarity-paywall.js`). **Re-run `git status`** before merging; this handoff does not duplicate every copy change inside those files.

### Other product notes from conversations

- Paywall / offer differentiation and quiz subtext were tuned (see git diff on `js/clarity-paywall.js` / quiz files).
- Pattern font sizing / dash removal (UI polish) — verify in current CSS/results templates.

---

## 5. Server: Stripe & metadata

### Checkout creation (`POST /create-checkout-session`)

- **`type: 'personal_relationship_read'`** — Price from env only (**never trust client for amount**).
- **`buildPrReadIntakeMetadata(intakePayload)`** — Sets `metadata.product = 'personal_relationship_read'` and shards intake JSON across **`ip0`, `ip1`, …** (Stripe metadata limits), plus **`ip_count`**, **`ip_raw_len`**, optional **`ip_trunc`**. Used for webhooks / ops to reassemble payload.

### Verification (`GET /api/verify-checkout?session=`)

- Retrieves Checkout Session; **`verified: true`** when **`payment_status === 'paid'`** (then returns `course` / product hint from metadata).
- **Test vs live:** Both can return `paid` after successful payment; failures are usually **hosting**, **key mismatch**, or **non-JSON** error responses—not “because test mode.”

### Env vars (document in `.env.example` if you add one)

- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY` or `STRIPE_PUBLIC_KEY` or `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_PRICE_PERSONAL_RELATIONSHIP_READ` **or** `STRIPE_PRODUCT_PERSONAL_RELATIONSHIP_READ`

Client may also set `window.PR_READ_STRIPE_PUBLIC_KEY` in HTML as fallback; must match secret key’s Stripe account.

---

## 6. Vercel routing (summary)

From `vercel.json`: `/create-checkout-session`, `/api/verify-checkout`, `/api/stripe-client-config`, `/api/common-ground-google-form` → **`server.js`**. Static assets served from repo root.

---

## 7. Design tokens (PR funnel CSS)

- Defined in `styles/personal-relationship-read.css`: `--prr-bg`, `--prr-panel`, `--prr-border`, `--prr-text`, `--prr-muted`, `--prr-red`.
- Thanks page: **loading spinner**, **step numbers**, **bullet lists** for nosession, panel headings.

---

## 8. Troubleshooting checklist

| Symptom | Likely cause |
|---------|----------------|
| Thanks shows **unverified** after pay | Thanks page not on same deploy as API; `file://` or static-only preview; Stripe secret key wrong account; JSON parse error (HTML 404 page). |
| Thanks shows **nosession** | URL missing `checkout=success` & `session_id` (bookmark, manual navigation). |
| Checkout create fails | Missing `personal_relationship_read` branch on deployed `server.js`; price env not set; wrong `type` in POST body. |
| Port conflict locally | Another app on :3000 — server logs suggest another port. |

---

## 9. Cache busting

When editing bundled behavior, bump query string on script/link tags:

- `personal-relationship-read.html`: `js/personal-relationship-read.js?v=**9**`, `styles/personal-relationship-read.css?v=**6**`
- `personal-relationship-read-thanks.html`: `js/personal-relationship-read-thanks.js?v=**4**`, same CSS `v=**6**`

---

## 10. Other docs in this repo (strategy / research)

- `docs/mastermind/PLAYBOOK-INDEX.md` — Routes business questions to playbooks.
- `Alex Hormozi Mastermind/*.md` — Full playbook text.
- `WORKBOOK_*.md`, `docs/*ANALYSIS*.md` — Positioning, quiz, Let It Out, Common Ground research.
- `PROJECT_INSPECTION_REPORT.md`, `CODEBASE_ANALYSIS.md` — Older but useful architecture notes.

---

## 11. What a new session should do first

1. Read **`docs/HANDOFF-QUICK-REFERENCE.md`**.
2. Open **`server.js`** (Stripe + verify + PR metadata).
3. Open **`js/personal-relationship-read.js`** and **`js/personal-relationship-read-thanks.js`** for funnel behavior.
4. Run **`git status`** / **`git diff`** against main to see unmerged quiz/overhaul work.

---

*This file is meant to be updated as the product evolves—append dated notes or bump “Last aligned” when ship changes.*
