# ⚡ Quick Start: Standalone Project Setup

## 🎯 Fastest Path (4-5 hours total)

### **STEP 1: Set Up Accounts (60-90 min)**

1. **Domain** → Register at Namecheap/Cloudflare (5 min)
2. **GitHub** → Create new repo (5 min)
3. **Firebase** → New project, enable Firestore + Auth (15 min)
4. **Stripe** → New account, create products, get keys (20 min)
5. **Google Analytics** → New property, get ID (5 min)
6. **Vercel** → Sign up, connect GitHub (5 min)

---

### **STEP 2: Update Configuration Files (30 min)**

#### **A. Firebase Config**
**File:** `js/config/firebase-config.js`
```javascript
const firebaseConfig = {
    apiKey: "YOUR_NEW_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-new-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

#### **B. Stripe Keys**
**File:** `server.js` (line 3)
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_live_YOUR_NEW_KEY');
```

**File:** `product/breakup-course.html` (line 1383)
```javascript
const stripePublicKey = 'pk_live_YOUR_NEW_KEY';
```

#### **C. Stripe Price IDs**
**File:** `product/breakup-course.html` (line 1394)
```javascript
priceId: 'price_YOUR_NEW_COURSE_PRICE_ID',
```

**File:** `js/premium-packs.js` (lines 9, 27, 45)
```javascript
stripePriceId: "price_YOUR_NEW_PACK_PRICE_ID",
```

**File:** `js/postForm.js` (line 50 in post unlock)
```javascript
price: 'price_YOUR_NEW_UNLOCK_PRICE_ID',
```

#### **D. Google Analytics**
**Files:** All HTML files (search for `G-ST1QJZ92B0`)
Replace with: `G-YOUR_NEW_ID`

---

### **STEP 3: Run Migration Script (5 min)**

1. **Update `migrate.js`** with your new values:
   ```javascript
   const NEW_CONFIG = {
       domain: 'yournewsite.com',
       brandName: 'Your Brand',
       // ... etc
   };
   ```

2. **Run scan:**
   ```bash
   node migrate.js
   ```

3. **Review results**, then apply:
   ```bash
   node migrate.js --apply
   ```

---

### **STEP 4: Manual Updates (30 min)**

#### **Files to Update Manually:**

1. **`sitemap.xml`**
   - Replace all `joinheartmatters.com` URLs

2. **`robots.txt`**
   - Update sitemap URL (line 54)

3. **All HTML Files - Meta Tags:**
   - Open Graph URLs
   - Canonical URLs
   - Twitter Card URLs

4. **Google Forms Entry IDs:**
   - `index.html` - Quiz form (lines 1780, 1782, 2508, 2522, 2536)
   - Create new Google Form, get entry IDs

---

### **STEP 5: Delete Unused Pages (15 min)**

**Delete these if not using:**
```bash
rm -rf product_backup/
rm shop/index.html          # If not selling products
rm theheartroom.html        # If not using
rm info.html                # If not using
rm makers.html              # If not using
rm product/power-earrings.html
rm product/balance-earrings.html
rm product/self-love-bracelet.html
rm product/reminder-tshirt.html
```

---

### **STEP 6: Environment Variables (10 min)**

**Create `.env` file:**
```env
STRIPE_SECRET_KEY=sk_live_YOUR_KEY
```

**Add to Vercel:**
- Dashboard → Project → Settings → Environment Variables
- Add `STRIPE_SECRET_KEY`

---

### **STEP 7: Deploy (15 min)**

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Standalone project setup"

# Push to GitHub
git remote add origin https://github.com/yourusername/repo.git
git push -u origin main

# Deploy on Vercel
# - Connect GitHub repo
# - Add environment variables
# - Connect custom domain
```

---

## 📝 Critical Files Checklist

### **Must Update (Credentials):**
- [ ] `js/config/firebase-config.js` - Firebase credentials
- [ ] `server.js` - Stripe secret key
- [ ] `product/breakup-course.html` - Stripe public key + price ID
- [ ] `js/premium-packs.js` - Stripe price IDs
- [ ] All HTML files - Google Analytics ID

### **Must Update (Branding):**
- [ ] All HTML files - Brand name
- [ ] All HTML files - Domain URLs
- [ ] `sitemap.xml` - All URLs
- [ ] `robots.txt` - Sitemap URL
- [ ] All HTML files - Email addresses
- [ ] All HTML files - Social media links

### **Must Update (SEO):**
- [ ] All HTML files - Meta descriptions
- [ ] All HTML files - Open Graph tags
- [ ] All HTML files - Canonical URLs
- [ ] All HTML files - Structured data

---

## 🚨 Before You Start

1. **Backup current project:**
   ```bash
   cp -r . ../backup-original-project
   ```

2. **Update `migrate.js`** with your new values

3. **Test locally first:**
   ```bash
   npm install
   npm start
   ```

---

## ⚡ Super Fast Method (If You Have Credentials Ready)

1. Update `migrate.js` with new config
2. Run `node migrate.js --apply`
3. Manually update 5 config files (Firebase, Stripe keys)
4. Delete unused pages
5. Deploy

**Total time: 1-2 hours** (if you have all credentials ready)

---

## 🆘 Need Help?

Tell me:
1. Your new domain name
2. Your new brand name
3. Which pages to keep
4. Your new email address

I can:
- Generate exact find/replace commands
- Create updated config files
- List exact files to delete
- Create deployment checklist

