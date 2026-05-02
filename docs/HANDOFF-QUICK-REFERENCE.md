# Handoff — quick reference

## Repo & run

- **Root:** Pattern Reset™ marketing + quiz + Let It Out + paid products.
- **Local server:** `npm start` → `node server.js` (default **http://localhost:3000**). Needed for Stripe API routes and PR Read checkout verification.
- **Deploy:** Vercel — `server.js` as Node build + static files; rewrites in `vercel.json`.

## Personal Relationship Read ($59) — URLs

| Page | File |
|------|------|
| Intake + pay | `personal-relationship-read.html` |
| After Stripe | `personal-relationship-read-thanks.html?checkout=success&session_id=cs_…` |

## `sessionStorage` keys (PR Read)

| Key | Purpose |
|-----|---------|
| `prReadIntakeDraft` | Autosave intake; cleared after verified payment on thanks page. |
| `prReadPendingOrder` | Set before redirect to Stripe; used to restore form on `?checkout=cancelled`. |
| `patternResetQuizState` | Quiz state for prefilling intake (`js/personal-relationship-read.js`). |

## Stripe env (server)

- `STRIPE_SECRET_KEY` — must match account of publishable key.
- `STRIPE_PUBLISHABLE_KEY` (or aliases in `server.js`) — exposed via `/api/stripe-client-config`.
- PR Read price: `STRIPE_PRICE_PERSONAL_RELATIONSHIP_READ` or `STRIPE_PRODUCT_PERSONAL_RELATIONSHIP_READ`.

## API routes (Express / Vercel)

- `POST /create-checkout-session`
- `GET /api/verify-checkout?session=cs_…`
- `GET /api/stripe-client-config`
- Plus Let It Out / Common Ground routes in `server.js`.

## Cache bust (bump when editing)

- Intake: `personal-relationship-read.js?v=9`, `personal-relationship-read.css?v=6`
- Thanks: `personal-relationship-read-thanks.js?v=4`, same CSS `?v=6`

## Quiz / results (recent branch work)

Files often touched together: `index.html`, `js/quiz/quiz-data.js`, `js/quiz/quiz-config.js`, `js/quiz/pattern-determiner.js`, `js/results-renderer-v2.js`, paywall JS if applicable.

## Verify fails after “successful” test pay?

Not caused by test mode alone. Check: same **origin** as checkout, `/api/verify-checkout` reachable (not `file://`), secret key matches session account. See full doc troubleshooting.
