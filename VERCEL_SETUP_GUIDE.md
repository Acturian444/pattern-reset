# Vercel Setup Guide for New Project

## Domain Configuration

**Primary Domain:** `mypatternreset.com` (no www)  
**Redirect Domain:** `resetmypattern.com` → `mypatternreset.com` (no www)

---

## Step 1: Create New Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository (or upload files)
4. Configure build settings:
   - **Framework Preset:** Other
   - **Build Command:** (leave empty or `echo 'No build step'`)
   - **Output Directory:** (leave empty - root)
   - **Install Command:** `npm install` (if needed)

---

## Step 2: Add Domains in Vercel

### Add Primary Domain (mypatternreset.com)

1. Go to **Project Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter: `mypatternreset.com`
4. Vercel will show DNS records to add:
   - **A Record** or **CNAME** pointing to Vercel
   - Copy the exact values Vercel provides

### Add Redirect Domain (resetmypattern.com)

1. Still in **Domains** section
2. Click **"Add Domain"** again
3. Enter: `resetmypattern.com`
4. Vercel will show DNS records
5. **Important:** After adding, configure redirect:
   - Click on `resetmypattern.com` domain
   - Set redirect to: `https://mypatternreset.com` (301 redirect)

---

## Step 3: Configure DNS

### For mypatternreset.com (Primary)

**At your domain registrar (where you bought the domain):**

Add DNS records (Vercel will provide exact values):
- **Type:** A or CNAME
- **Name:** @ (or root)
- **Value:** Vercel's IP or CNAME target
- **TTL:** 3600 (or default)

**Example:**
```
Type: A
Name: @
Value: 76.76.21.21 (Vercel will provide actual IP)
```

OR

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com (Vercel will provide)
```

### For resetmypattern.com (Redirect)

**At your domain registrar:**

Add the same DNS records Vercel provides:
- Point to Vercel's servers
- Vercel will handle the redirect automatically

---

## Step 4: Configure Redirect in Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to **Project Settings** → **Domains**
2. Click on `resetmypattern.com`
3. Enable **"Redirect to"** option
4. Enter: `https://mypatternreset.com`
5. Select **301 (Permanent Redirect)**
6. Save

### Option B: Using vercel.json (Alternative)

If you prefer code-based redirects, add to `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/(.*)",
      "has": [
        {
          "type": "host",
          "value": "resetmypattern.com"
        }
      ],
      "destination": "https://mypatternreset.com/:path*",
      "permanent": true
    }
  ]
}
```

**Note:** The domain redirect is better handled in Vercel Dashboard, but this works too.

---

## Step 5: Verify Setup

### Test Primary Domain
- Visit: `https://mypatternreset.com`
- Should load your site

### Test Redirect Domain
- Visit: `https://resetmypattern.com`
- Should automatically redirect to `https://mypatternreset.com`
- Check browser shows: `mypatternreset.com` in address bar

### Test www (if someone types it)
- Visit: `https://www.mypatternreset.com`
- Should either:
  - Redirect to `mypatternreset.com` (if configured)
  - Or show error (if not configured - this is fine)

---

## Step 6: SSL Certificates

Vercel automatically provisions SSL certificates for:
- ✅ `mypatternreset.com`
- ✅ `resetmypattern.com`
- ✅ `www.mypatternreset.com` (if you add it)

**No action needed** - Vercel handles this automatically.

---

## Important Notes

1. **No www:** Your site uses `mypatternreset.com` (no www subdomain)
2. **Canonical URLs:** All canonical URLs in HTML should point to `mypatternreset.com`
3. **SEO:** Google will index `mypatternreset.com` as primary
4. **Redirects:** `resetmypattern.com` automatically redirects (301) to primary
5. **DNS Propagation:** Can take 24-48 hours, but usually faster

---

## Troubleshooting

### Domain not working?
- Check DNS records are correct
- Wait for DNS propagation (can take up to 48 hours)
- Verify domain is added in Vercel dashboard
- Check Vercel deployment is successful

### Redirect not working?
- Verify redirect is configured in Vercel dashboard
- Check DNS for redirect domain points to Vercel
- Clear browser cache
- Try incognito/private browsing

### SSL certificate issues?
- Vercel handles SSL automatically
- Wait 5-10 minutes after adding domain
- Check domain is verified in Vercel

---

## Checklist

- [ ] New Vercel project created
- [ ] `mypatternreset.com` added as primary domain
- [ ] `resetmypattern.com` added as redirect domain
- [ ] DNS records configured at registrar
- [ ] Redirect configured: `resetmypattern.com` → `mypatternreset.com`
- [ ] Primary domain tested and working
- [ ] Redirect domain tested and working
- [ ] SSL certificates active (automatic)
- [ ] All pages load correctly
- [ ] Canonical URLs point to `mypatternreset.com`

