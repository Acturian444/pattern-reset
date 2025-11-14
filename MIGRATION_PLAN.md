# 🚀 Standalone Project Migration Plan

## Goal
Transform this duplicate project into a completely independent website with:
- New accounts (Google, Stripe, Firebase, Domain, GitHub, Vercel)
- New branding
- New domain
- New SEO
- Only selected pages kept

---

## ⚡ FASTEST APPROACH (Recommended)

### **Phase 1: Account Setup (30-60 minutes)**

#### 1. **Domain Registration**
- Register new domain (e.g., `yournewsite.com`)
- Choose registrar: Namecheap, Google Domains, or Cloudflare
- **Time:** 5-10 minutes

#### 2. **GitHub Repository**
- Create new GitHub account (or use existing)
- Create new private repository
- **Time:** 5 minutes

#### 3. **Firebase Project**
- Go to [Firebase Console](https://console.firebase.google.com/)
- Create new project
- Enable Firestore Database
- Enable Anonymous Authentication
- Copy new config credentials
- **Time:** 10-15 minutes

#### 4. **Stripe Account**
- Sign up at [stripe.com](https://stripe.com)
- Get API keys (Test + Live)
- Create products/prices for:
  - Course ($33)
  - Post unlock ($4.99)
  - Premium packs (if keeping)
- Copy Price IDs
- **Time:** 15-20 minutes

#### 5. **Google Analytics**
- Create new GA4 property
- Get new Measurement ID (G-XXXXXXXXXX)
- **Time:** 5 minutes

#### 6. **Vercel Account**
- Sign up at [vercel.com](https://vercel.com)
- Connect GitHub repository
- **Time:** 5 minutes

#### 7. **Google Forms** (if using for lead capture)
- Create new Google Form
- Get new form IDs
- **Time:** 10 minutes

**Total Phase 1 Time: 60-90 minutes**

---

### **Phase 2: Code Cleanup (1-2 hours)**

#### **Step 1: Create Configuration File**
Create `js/config/site-config.js`:
```javascript
const SITE_CONFIG = {
    domain: 'yournewsite.com',
    brandName: 'Your New Brand',
    googleAnalyticsId: 'G-XXXXXXXXXX',
    stripePublicKey: 'pk_live_...',
    firebaseConfig: {
        // New Firebase config
    },
    contactEmail: 'hello@yournewsite.com',
    socialMedia: {
        instagram: 'https://instagram.com/yourhandle',
        tiktok: 'https://tiktok.com/@yourhandle'
    }
};
window.SITE_CONFIG = SITE_CONFIG;
```

#### **Step 2: Files to Update**

**Critical Files (Must Update):**
1. `js/config/firebase-config.js` - New Firebase credentials
2. `server.js` - New Stripe keys (line 3)
3. `product/breakup-course.html` - Stripe public key (line 1383)
4. `js/premium-packs.js` - New Stripe Price IDs
5. All HTML files - Google Analytics ID
6. All HTML files - Domain URLs in meta tags
7. `sitemap.xml` - New domain
8. `robots.txt` - New domain
9. `vercel.json` - Update if needed

**Branding Files (Update Text):**
- All HTML files - Replace "Heart Matters" with new brand
- All HTML files - Update meta descriptions
- All HTML files - Update social media links
- Footer sections - Update copyright and links

**SEO Files:**
- `sitemap.xml` - All URLs
- `robots.txt` - Sitemap URL
- All HTML files - Open Graph tags
- All HTML files - Canonical URLs
- All HTML files - Structured data (JSON-LD)

---

### **Phase 3: Page Selection & Cleanup (1-2 hours)**

#### **Pages to Keep (Recommended Minimal Set):**
1. ✅ `index.html` - Homepage with quiz
2. ✅ `product/breakup-course.html` - Course sales page
3. ✅ `course/breakup-course.html` - Course delivery
4. ✅ `letitout.html` - Social wall (if keeping)
5. ✅ `legal.html` - Legal page

#### **Pages to Remove:**
- ❌ `shop/index.html` - Remove if not selling products
- ❌ `theheartroom.html` - Remove if not using
- ❌ `info.html` - Remove or simplify
- ❌ `makers.html` - Remove if not using
- ❌ All product pages (if not selling)
- ❌ `product_backup/` - Delete entire folder

#### **Files to Delete:**
```
/product_backup/          (entire folder)
/shop/                    (if not using)
/product/power-earrings.html
/product/balance-earrings.html
/product/self-love-bracelet.html
/product/reminder-tshirt.html
/theheartroom.html        (if not using)
/info.html                (if not using)
/makers.html              (if not using)
```

---

### **Phase 4: Search & Replace (30 minutes)**

**Use Find & Replace in your editor:**

1. **Domain Replacements:**
   - `joinheartmatters.com` → `yournewsite.com`
   - `www.joinheartmatters.com` → `www.yournewsite.com`
   - `https://www.joinheartmatters.com` → `https://www.yournewsite.com`

2. **Brand Name:**
   - `Heart Matters` → `Your New Brand`
   - `Heart Matters™` → `Your New Brand™`

3. **Google Analytics:**
   - `G-ST1QJZ92B0` → `G-XXXXXXXXXX` (your new ID)

4. **Email Addresses:**
   - `info@joinheartmatters.com` → `hello@yournewsite.com`

5. **Social Media:**
   - Instagram: `heartmatters__` → `yourhandle`
   - TikTok: `@heartmatters__` → `@yourhandle`

---

### **Phase 5: Environment Variables Setup (15 minutes)**

Create `.env` file (for local development):
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLIC_KEY=pk_live_...
```

Add to Vercel:
- Go to Vercel Dashboard → Project → Settings → Environment Variables
- Add `STRIPE_SECRET_KEY`

---

### **Phase 6: Deployment (15 minutes)**

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - standalone project"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Connect GitHub repo in Vercel
   - Add environment variables
   - Deploy
   - Connect custom domain

3. **DNS Setup:**
   - Point domain to Vercel (instructions in Vercel dashboard)
   - Wait for SSL certificate (automatic)

---

## 📋 COMPLETE CHECKLIST

### **Account Setup**
- [ ] Domain registered
- [ ] GitHub repository created
- [ ] Firebase project created
- [ ] Stripe account created
- [ ] Google Analytics property created
- [ ] Vercel account created
- [ ] Google Forms created (if using)

### **Configuration Updates**
- [ ] Firebase config updated (`js/config/firebase-config.js`)
- [ ] Stripe keys updated (`server.js`, product pages)
- [ ] Google Analytics ID updated (all HTML files)
- [ ] Domain URLs updated (all files)
- [ ] Brand name updated (all files)
- [ ] Email addresses updated
- [ ] Social media links updated

### **Code Cleanup**
- [ ] Unused pages deleted
- [ ] Unused images/assets removed
- [ ] `product_backup/` folder deleted
- [ ] Test files removed
- [ ] `sitemap.xml` updated
- [ ] `robots.txt` updated

### **SEO Updates**
- [ ] Meta descriptions updated
- [ ] Open Graph tags updated
- [ ] Canonical URLs updated
- [ ] Structured data (JSON-LD) updated
- [ ] Title tags updated

### **Deployment**
- [ ] Code pushed to GitHub
- [ ] Vercel project connected
- [ ] Environment variables set
- [ ] Domain connected
- [ ] SSL certificate active
- [ ] Site tested and working

---

## 🎯 FASTEST METHOD: Automated Script

I can create a script that:
1. Finds all instances of old branding/domain
2. Replaces with new values
3. Updates configuration files
4. Removes unused pages

**Would you like me to:**
1. Create a find/replace script?
2. Create a new config file template?
3. Generate a list of exact files to update?

---

## ⚠️ CRITICAL: What NOT to Change

**Keep These (They're Generic):**
- CSS class names
- JavaScript function names
- File structure (unless removing pages)
- Firebase collection names (unless you want to start fresh)

**Must Change:**
- All domain references
- All API keys/credentials
- All brand names
- All social media links
- All email addresses
- All SEO metadata

---

## 🚨 IMPORTANT NOTES

1. **Firebase Data:** If you want fresh data, create new Firebase project. If you want to keep existing posts, keep same project but update config.

2. **Stripe Products:** You MUST create new products in Stripe and get new Price IDs. Old Price IDs won't work.

3. **Google Forms:** Create new forms and update entry IDs in HTML.

4. **Testing:** Test locally before deploying:
   ```bash
   npm install
   npm start
   ```

5. **Backup:** Keep a backup of original project before making changes.

---

## 📊 ESTIMATED TIME

- **Account Setup:** 60-90 minutes
- **Code Updates:** 2-3 hours
- **Testing:** 30 minutes
- **Deployment:** 15 minutes

**Total: 4-5 hours** (can be done in one day)

---

## 🎬 NEXT STEPS

Tell me:
1. **New domain name?** (so I can update all references)
2. **New brand name?** (so I can replace "Heart Matters")
3. **Which pages to keep?** (so I can identify what to delete)
4. **New email address?** (for contact forms)

Then I can:
- Create automated find/replace script
- Generate updated config files
- Create cleanup script for unused files
- Prepare everything for your new accounts

