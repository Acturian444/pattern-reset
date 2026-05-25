# Your Story ($22) — Stripe & copy checklist

## Stripe (required for live $22 checkout)

**Add a new Price — do not edit the old $59 price.** In Stripe, prices are immutable: you create a new **one-time $22** price on the same product (or a new product), then point Vercel at the new `price_…` ID.

1. In [Stripe Dashboard](https://dashboard.stripe.com/products) → open your product (e.g. “Get a Direct Answer”) → **Add price** → **One time** → **$22.00 USD** → save.
2. Copy the **Price ID** (`price_…`). Current live default in repo: `price_1Tb7BoBiV6S6xuimh1g8U1RG`.
3. In **Vercel** (Production + Preview if you test there), set:
   - **`STRIPE_PRICE_PATTERN_REFLECTION_22`** = `price_1Tb7BoBiV6S6xuimh1g8U1RG` (recommended), **or**
   - **`STRIPE_PRICE_PERSONAL_RELATIONSHIP_READ`** = same `price_…` (legacy env name still supported).
4. Ensure **`STRIPE_SECRET_KEY`** and **`STRIPE_PUBLISHABLE_KEY`** are the same mode (live vs test) as that price.
5. Redeploy. Test checkout from `https://mypatternreset.com/personal-relationship-read` — amount should show **$22**.

The repo default fallback price ID in `server.js` may still point at the old **$59** catalog entry until env is set. **Checkout amount is controlled by env, not by on-page copy.**

## Offer ID (Firestore / analytics)

- New: **`pattern_reflection_22`**
- Legacy rows may still use **`direct_read_59`** — webhooks map both to customer status **`paid_22`**.

## Pages updated for Pattern Reflection copy

| Location | Role |
|----------|------|
| `liamsaysit.html` | Bio card: title, subtext, “Personal written reflection · $22” |
| `personal-relationship-read.html` | Intake hero + submit CTA |
| `personal-relationship-read-thanks.html` | Post-payment confirmation line |
| `js/clarity-paywall.js` | Quiz paywall $22 tier |
| `js/results-renderer-v2.js` | Quiz results upsell card |
| `js/results-breakdown.js` | Breakdown upsell |
| `index.html` | FAQ timing line |
| `js/funnel/offer-constants.js` | Offer IDs + labels |
| `server.js` | Stripe price resolution + webhook labels |

## Optional / not changed

- URL path remains **`/personal-relationship-read`** (no redirect rename).
- Docs under `docs/HANDOFF-*` may still mention $59 until updated manually.
- Quiz paywall **$197 call** tier unchanged.
