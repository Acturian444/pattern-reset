# Domain Analysis & Change Guide

## Current Domain
**Primary Domain:** `www.joinheartmatters.com`

## Domain Usage Locations

### 1. **HTML Files** (Meta Tags, SEO, Structured Data)
All HTML files contain domain references in:
- Open Graph URLs (`og:url`)
- Canonical URLs (`rel="canonical"`)
- Twitter Card images
- JSON-LD structured data
- Email addresses (`info@joinheartmatters.com`)

**Files Affected:**
- `index.html`
- `letitout.html`
- `info.html`
- `theheartroom.html`
- `makers.html`
- `legal.html`
- `product/breakup-course.html`
- `product/balance-earrings.html`
- `product/reminder-tshirt.html`
- `product/self-love-bracelet.html`
- `product/power-earrings.html`
- `shop/index.html`
- `course/breakup-course.html`

### 2. **SEO Files**
- `sitemap.xml` - All URL entries
- `robots.txt` - Sitemap location reference

### 3. **Configuration Files**
- `vercel.json` - No domain references (only redirects)
- `package.json` - No domain references

### 4. **Email Addresses**
- `info@joinheartmatters.com` appears in:
  - `index.html`
  - `info.html`
  - `legal.html`
  - `product/breakup-course.html`

### 5. **Social Media Links**
- Instagram: `https://www.instagram.com/heartmatters__/`
- TikTok: `https://www.tiktok.com/@heartmatters__`
- (These are external links, not domain-related)

## Redirects (vercel.json)
Current redirects are path-based, not domain-based:
- `/letitout` → `/letitout.html`
- `/info` → `/info.html`
- `/theheartroom` → `/theheartroom.html`
- `/makers` → `/makers.html`
- `/legal` → `/legal.html`
- `/shop` → `/shop/`
- Product page redirects
- Course page redirects

**Note:** These redirects don't need domain changes.

## Domain Change Strategy

### Recommended Approach: Automated Find & Replace Script

**Best Method:** Use a Node.js script to safely replace all domain instances across all files.

### Files to Update:
1. All `.html` files (13+ files)
2. `sitemap.xml`
3. `robots.txt`

### What to Replace:
- `https://www.joinheartmatters.com` → `https://www.[NEW-DOMAIN].com`
- `www.joinheartmatters.com` → `www.[NEW-DOMAIN].com`
- `info@joinheartmatters.com` → `info@[NEW-DOMAIN].com` (if email changes)

### What NOT to Change:
- External links (Instagram, TikTok, Google Forms, Font Awesome, etc.)
- Relative paths (`/images/`, `/js/`, etc.)
- Firebase/Stripe API endpoints
- CDN URLs

## Safety Checklist

Before running domain change:
- [ ] Backup entire project
- [ ] Test script on one file first
- [ ] Verify all replacements are correct
- [ ] Check for any hardcoded domain references in JavaScript
- [ ] Update email addresses if needed
- [ ] Update DNS settings
- [ ] Update Vercel domain configuration
- [ ] Update Google Analytics property (if domain changes)
- [ ] Update Google Search Console
- [ ] Update Firebase project settings (if applicable)

