# Domain Migration Plan

## New Domain Configuration

**Primary Domain:** `mypatternreset.com`  
**Redirect Domain:** `resetmypattern.com` → `mypatternreset.com`

## Current Domain
**Old Domain:** `www.joinheartmatters.com`

---

## Step-by-Step Migration Process

### Step 1: Run Domain Change Script
```bash
node change-domain.js www.joinheartmatters.com mypatternreset.com
```

**What this does:**
- Replaces all `www.joinheartmatters.com` references with `mypatternreset.com`
- Updates all HTML files (13+ files)
- Updates `sitemap.xml`
- Updates `robots.txt`
- Updates email addresses (`info@joinheartmatters.com` → `info@mypatternreset.com`)

### Step 2: Review Changes
```bash
git diff
```
Review all changes to ensure they're correct.

### Step 3: Update Vercel Configuration

**In Vercel Dashboard:**
1. Go to your project settings
2. Add `mypatternreset.com` as the primary domain
3. Add `resetmypattern.com` as a redirect domain
4. Configure redirect: `resetmypattern.com` → `mypatternreset.com` (301 redirect)

**Note:** Domain redirects are handled at Vercel/DNS level, not in `vercel.json` (which only handles path redirects).

### Step 4: Update DNS Settings

**For mypatternreset.com (Primary):**
- Point A record or CNAME to Vercel's servers
- Vercel will provide the exact DNS records

**For resetmypattern.com (Redirect):**
- Point to Vercel's servers
- Vercel will handle the redirect to primary domain

### Step 5: Update External Services

**Google Services:**
- [ ] Google Search Console - Add new property for `mypatternreset.com`
- [ ] Google Analytics - Update property URL
- [ ] Google Tag Manager - Update container settings (if used)

**Email:**
- [ ] Set up email for `info@mypatternreset.com` (if needed)
- [ ] Update email forwarding if using old domain

**Firebase (if applicable):**
- [ ] Update authorized domains in Firebase Console
- [ ] Update OAuth redirect URIs

**Stripe (if applicable):**
- [ ] Update webhook URLs in Stripe Dashboard
- [ ] Update allowed domains

### Step 6: Test Everything

**Before Deploying:**
- [ ] Test locally with new domain references
- [ ] Verify all links work
- [ ] Check SEO meta tags
- [ ] Verify sitemap.xml
- [ ] Test form submissions

**After Deploying:**
- [ ] Test primary domain: `mypatternreset.com`
- [ ] Test redirect: `resetmypattern.com` → `mypatternreset.com`
- [ ] Verify all pages load correctly
- [ ] Check canonical URLs
- [ ] Test quiz functionality
- [ ] Test checkout flow (if applicable)

### Step 7: SEO & Indexing

**After Migration:**
- [ ] Submit new sitemap to Google Search Console
- [ ] Set up 301 redirects from old domain (if keeping it)
- [ ] Update any external backlinks
- [ ] Monitor search rankings
- [ ] Update social media profiles

---

## Files That Will Be Updated

### HTML Files (13 files):
1. `index.html`
2. `letitout.html`
3. `info.html`
4. `theheartroom.html`
5. `makers.html`
6. `legal.html`
7. `product/breakup-course.html`
8. `product/balance-earrings.html`
9. `product/reminder-tshirt.html`
10. `product/self-love-bracelet.html`
11. `product/power-earrings.html`
12. `shop/index.html`
13. `course/breakup-course.html`

### SEO Files:
- `sitemap.xml` - All URL entries
- `robots.txt` - Sitemap location

### What Gets Changed:
- Open Graph URLs (`og:url`)
- Canonical URLs (`rel="canonical"`)
- Twitter Card image URLs
- JSON-LD structured data URLs
- Email addresses (`info@joinheartmatters.com` → `info@mypatternreset.com`)

### What Stays the Same:
- External links (Instagram, TikTok, Google Forms)
- Relative paths (`/images/`, `/js/`, etc.)
- Firebase/Stripe API endpoints
- Internal file references

---

## Important Notes

1. **Domain Redirect:** The redirect from `resetmypattern.com` to `mypatternreset.com` is handled at the DNS/Vercel level, not in code.

2. **Email Domain:** If you want to keep `info@joinheartmatters.com`, you'll need to manually revert those changes or set up email forwarding.

3. **Old Domain:** Consider setting up 301 redirects from the old domain to preserve SEO value.

4. **Testing:** Always test in a staging environment first if possible.

5. **Backup:** Make sure you have a git commit or backup before running the script.

---

## Quick Start Command

```bash
# Run the domain change script
node change-domain.js www.joinheartmatters.com mypatternreset.com

# Review changes
git diff

# If everything looks good, commit
git add .
git commit -m "Update domain from joinheartmatters.com to mypatternreset.com"
```

---

## Post-Migration Checklist

- [ ] All pages load correctly on new domain
- [ ] Redirect domain works (resetmypattern.com → mypatternreset.com)
- [ ] SEO meta tags updated
- [ ] Sitemap submitted to Google
- [ ] Google Analytics tracking works
- [ ] Forms submit correctly
- [ ] Quiz functionality works
- [ ] Checkout flow works (if applicable)
- [ ] Email addresses updated/forwarded
- [ ] Social media links updated
- [ ] Old domain redirects set up (if keeping)

