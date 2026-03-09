# commongroundsocialclub.com Domain Setup

This guide walks you through connecting your new domain to the same site and redirecting visitors to the Common Ground page.

---

## Overview

- **mypatternreset.com** → Full site (quiz, patterns, Common Ground, etc.)
- **commongroundsocialclub.com** → Redirects to `mypatternreset.com/common-ground.html`

Same codebase, same deployment. Visitors to either domain see the same content; Common Ground visitors land directly on that page.

---

## Step 1: Add Domain in Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Open your **Pattern Reset** project (the one that deploys mypatternreset.com)
3. Go to **Settings** → **Domains**
4. Click **Add**
5. Enter: `commongroundsocialclub.com`
6. Click **Add**
7. Vercel will show DNS instructions — keep this tab open

---

## Step 2: Configure DNS (Where You Bought the Domain)

Where did you buy commongroundsocialclub.com? (GoDaddy, Namecheap, Google Domains, etc.)

### For most registrars:

1. Log in to your domain registrar
2. Find **DNS settings** or **Manage DNS** for commongroundsocialclub.com
3. Add the records Vercel shows you. Typically:
   - **A record**: `@` (or blank) → `76.76.21.21`
   - **CNAME record**: `www` → `cname.vercel-dns.com`
4. Save changes

**Important:** Use the exact values Vercel provides — they may differ slightly.

---

## Step 3: Verify in Vercel

1. Back in Vercel → Settings → Domains
2. Wait a few minutes (DNS can take 5–60 minutes to propagate)
3. Vercel will show a checkmark when the domain is verified
4. Vercel will automatically provision SSL (HTTPS) for the new domain

---

## Step 4: Deploy the Redirect (Already Done)

The redirect is already in `vercel.json`:

- `commongroundsocialclub.com` → `https://mypatternreset.com/common-ground.html`
- `www.commongroundsocialclub.com` → same redirect

**To deploy:**
1. Commit and push your changes
2. Vercel will auto-deploy
3. Or trigger a manual deploy from the Vercel dashboard

---

## Step 5: Test

1. Visit `https://commongroundsocialclub.com`
2. You should be redirected to `https://mypatternreset.com/common-ground.html`
3. The address bar will show mypatternreset.com (that’s expected with a redirect)

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Domain not verifying | Wait longer (up to 48 hrs). Check DNS records match Vercel exactly. |
| "Site not found" | Ensure the domain is added to the same Vercel project as mypatternreset.com |
| Redirect not working | Confirm vercel.json changes are deployed. Check Vercel deployment logs. |

---

## Summary Checklist

- [ ] Add commongroundsocialclub.com in Vercel → Settings → Domains
- [ ] Add DNS records at your domain registrar (use Vercel’s values)
- [ ] Wait for Vercel to verify the domain
- [ ] Deploy (commit + push, or manual deploy)
- [ ] Test: commongroundsocialclub.com → Common Ground page
