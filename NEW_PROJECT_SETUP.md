# New Project Setup Checklist

## Domain Configuration

**Primary Domain:** `mypatternreset.com` (no www)  
**Redirect Domain:** `resetmypattern.com` → `mypatternreset.com` (no www)

---

## Step 1: Run Domain Change Script

```bash
node change-domain.js
```

**What this does:**
- Replaces `www.joinheartmatters.com` → `mypatternreset.com`
- Replaces `joinheartmatters.com` → `mypatternreset.com`
- Updates all HTML files (13+ files)
- Updates `sitemap.xml`
- Updates `robots.txt`
- Updates email: `info@joinheartmatters.com` → `info@mypatternreset.com`

**Output:** Shows exactly what files were changed and how many replacements.

---

## Step 2: Review Changes

```bash
git diff
```

Review all changes to ensure they're correct before committing.

---

## Step 3: Create New Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. **Import Git Repository** (recommended) or **Upload Files**
4. **Project Settings:**
   - **Framework Preset:** Other
   - **Root Directory:** (leave as is)
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)
   - **Install Command:** `npm install` (if needed)

---

## Step 4: Configure Domains in Vercel

### Add Primary Domain

1. **Project Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter: `mypatternreset.com`
4. Vercel will show DNS records - **copy these values**

### Add Redirect Domain

1. Still in **Domains** section
2. Click **"Add Domain"** again
3. Enter: `resetmypattern.com`
4. Vercel will show DNS records - **copy these values**
5. **Configure Redirect:**
   - Click on `resetmypattern.com` domain
   - Enable **"Redirect to"**
   - Enter: `https://mypatternreset.com`
   - Select **301 (Permanent Redirect)**
   - Save

---

## Step 5: Configure DNS at Domain Registrar

### For mypatternreset.com

**At your domain registrar (GoDaddy, Namecheap, etc.):**

Add DNS record (use exact values from Vercel):
- **Type:** A or CNAME (Vercel will specify)
- **Name:** @ (or root/blank)
- **Value:** (Vercel provides this)
- **TTL:** 3600 or default

### For resetmypattern.com

**At your domain registrar:**

Add the same DNS record type:
- Point to Vercel's servers
- Vercel handles the redirect automatically

**Note:** DNS propagation can take 24-48 hours, but usually works within 1-2 hours.

---

## Step 6: Set Up New Accounts/Services

### Google Services (New Accounts)

- [ ] **Google Analytics** - Create new property for `mypatternreset.com`
- [ ] **Google Search Console** - Add new property for `mypatternreset.com`
- [ ] **Google Tag Manager** - Create new container (if using)

### Email

- [ ] Set up email for `info@mypatternreset.com`
  - Use Google Workspace, Zoho, or your email provider
  - Or set up email forwarding

### Firebase (if using)

- [ ] Create new Firebase project
- [ ] Update `js/config/firebase-config.js` with new config
- [ ] Update authorized domains in Firebase Console

### Stripe (if using)

- [ ] Create new Stripe account (or use existing)
- [ ] Update webhook URLs to new domain
- [ ] Update allowed domains in Stripe Dashboard
- [ ] Update `server.js` with new Stripe keys (if needed)

---

## Step 7: Update Configuration Files

### Firebase Config
- [ ] Update `js/config/firebase-config.js` with new Firebase project credentials

### Environment Variables (Vercel)
- [ ] Add Stripe keys (if using)
- [ ] Add Firebase config (if using)
- [ ] Add any other API keys

**In Vercel Dashboard:**
- Go to **Project Settings** → **Environment Variables**
- Add all required variables

---

## Step 8: Test Everything

### Before Deploying
- [ ] Test locally
- [ ] Verify all domain references updated
- [ ] Check all links work
- [ ] Test quiz functionality
- [ ] Test form submissions

### After Deploying
- [ ] Test primary domain: `https://mypatternreset.com`
- [ ] Test redirect: `https://resetmypattern.com` → `https://mypatternreset.com`
- [ ] Verify SSL certificates active (automatic)
- [ ] Test all pages load correctly
- [ ] Test quiz flow
- [ ] Test checkout (if applicable)
- [ ] Verify Google Analytics tracking
- [ ] Check canonical URLs

---

## Step 9: SEO Setup

- [ ] Submit sitemap to Google Search Console
- [ ] Verify site in Google Search Console
- [ ] Set up Google Analytics
- [ ] Update social media profiles with new domain
- [ ] Update any external backlinks

---

## Step 10: Clean Up Old Project

**If keeping old project separate:**
- [ ] Old Vercel project can stay (or delete if not needed)
- [ ] Old domain can redirect to new (optional)
- [ ] Archive old Google Analytics property

---

## Quick Command Reference

```bash
# 1. Run domain change script
node change-domain.js

# 2. Review changes
git diff

# 3. Commit changes
git add .
git commit -m "Update domain to mypatternreset.com for new project"

# 4. Push to new repository (if using new repo)
git remote add origin <new-repo-url>
git push -u origin main
```

---

## Important Notes

1. **No www:** All URLs use `mypatternreset.com` (no www subdomain)
2. **Redirect:** `resetmypattern.com` automatically redirects to primary
3. **SSL:** Vercel automatically provisions SSL certificates
4. **DNS:** Can take 24-48 hours to fully propagate
5. **Testing:** Always test in staging first if possible

---

## Files Updated by Script

✅ All HTML files (13+ files)  
✅ `sitemap.xml`  
✅ `robots.txt`  
✅ Email addresses

**Ready to run when you are!**

