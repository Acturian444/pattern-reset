# New Project Configuration Required - Complete Checklist

**Project:** Pattern Reset  
**New Domain:** `mypatternreset.com`  
**Status:** ⚠️ **CRITICAL UPDATES NEEDED**

---

## 🔴 CRITICAL: Services That MUST Be Updated

### 1. **Firebase / Firestore** ⚠️ HIGH PRIORITY

**Current Configuration:**
- **File:** `js/config/firebase-config.js`
- **Project ID:** `heart-matters-ceb3a` (OLD PROJECT)
- **Auth Domain:** `heart-matters-ceb3a.firebaseapp.com`
- **API Key:** `AIzaSyATtfn1844KAI0Y_kUKGht49b6GHRzGSEo`

**What Needs to Happen:**
1. ✅ **Create NEW Firebase Project** for Pattern Reset
2. ✅ **Update `js/config/firebase-config.js`** with new credentials:
   ```javascript
   const firebaseConfig = {
       apiKey: "YOUR_NEW_API_KEY",
       authDomain: "YOUR_NEW_PROJECT.firebaseapp.com",
       projectId: "YOUR_NEW_PROJECT_ID",
       storageBucket: "YOUR_NEW_PROJECT.appspot.com",
       messagingSenderId: "YOUR_NEW_SENDER_ID",
       appId: "YOUR_NEW_APP_ID"
   };
   ```
3. ✅ **Update Firestore Security Rules** (`firestore.rules`)
   - Deploy to NEW Firebase project
   - Update authorized domains in Firebase Console
4. ✅ **Update Firebase Console Settings:**
   - Add `mypatternreset.com` to authorized domains
   - Add `resetmypattern.com` to authorized domains (if redirecting)
   - Update OAuth redirect URLs

**Files Using Firebase:**
- `js/config/firebase-config.js` ⚠️ **MUST UPDATE**
- `js/firebase.js` (uses config)
- `js/services/post-service.js` (Firestore operations)
- `js/postForm.js` (Firestore writes)
- `js/wallFeed.js` (Firestore reads)
- `firestore.rules` ⚠️ **MUST DEPLOY TO NEW PROJECT**

**Impact if NOT Updated:**
- ❌ "Let It Out" wall won't work (no database)
- ❌ Posts won't save
- ❌ User authentication will fail
- ❌ All Firestore operations will fail

---

### 2. **Stripe Payment Processing** ⚠️ HIGH PRIORITY

**Current Configuration:**
- **File:** `server.js`
- **Environment Variable:** `STRIPE_SECRET_KEY` (from `.env` or Vercel)
- **Test Key (fallback):** `sk_test_YOUR_STRIPE_SECRET_KEY`

**Hardcoded Stripe Keys Found:**
1. **`product/breakup-course.html`** (Line 1409):
   - Public Key: `pk_live_51RaP4MLWOdcyyqSfMIlvbkoTQ0cVvm1KrSOExbJQeO6UBJoq4IbWpcuhAhlGbNSZbudJUAzh4B3L4jXYU9p109y000XIJvvIld`
   - Price ID: `price_1RpkcDLWOdcyyqSffkzJQUf8`

2. **`js/postForm.js`** (Line 1698):
   - Public Key: `pk_test_51RaP4RQ1hjqBwoa0ZnOuoRygvmNsfrRQmGG5wXIjcVhyKebi1CFfcG00pIQCceYu8pqlzFhAuJeNGz2dw5wlAcbD00wooUWDOR`

3. **`server.js`** (Line 50):
   - Hardcoded Price ID: `price_1RaPPMQ1hjqBwoa0vVLHNXO1` (post unlock - $4.99)

4. **`js/premium-packs.js`** (Lines 9, 27, 45):
   - Price IDs: `price_1Rd1blQ1hjqBwoa0kjXwrfFi` (breakup pack)
   - Price IDs: `price_1Rd1eWQ1hjqBwoa0lhh9xMaZ` (grief pack)
   - Price IDs: `price_1Rd1f4Q1hjqBwoa0jQT4lhYA` (anxiety pack)

**What Needs to Happen:**
1. ✅ **Create NEW Stripe Account** (or use existing, but create new products)
2. ✅ **Create NEW Products in Stripe:**
   - Pattern Reset Course (22-day program)
   - Premium Prompt Packs (if keeping)
   - Post Unlock feature (if keeping)
3. ✅ **Get NEW Stripe Keys:**
   - Public Key (Publishable Key): `pk_live_...` or `pk_test_...`
   - Secret Key: `sk_live_...` or `sk_test_...`
4. ✅ **Update `server.js`:**
   - Update environment variable reference
   - Update hardcoded price ID for post unlock (line 50)
5. ✅ **Update `product/breakup-course.html`:**
   - Replace public key (line 1409)
   - Replace price ID (line 1420)
   - Update success URL to use clean URL: `/course/breakup-course?session={CHECKOUT_SESSION_ID}`
6. ✅ **Update `js/postForm.js`:**
   - Replace public key (line 1698)
7. ✅ **Update `js/premium-packs.js`:**
   - Replace all price IDs (lines 9, 27, 45)
8. ✅ **Set Environment Variables in Vercel:**
   - `STRIPE_SECRET_KEY` = Your new secret key
9. ✅ **Update Stripe Webhooks:**
   - Add webhook endpoint: `https://mypatternreset.com/api/webhook` (if using)
   - Update webhook URLs in Stripe Dashboard

**Files Using Stripe:**
- `server.js` ⚠️ **MUST UPDATE** (secret key, price IDs)
- `product/breakup-course.html` ⚠️ **MUST UPDATE** (public key, price ID)
- `js/postForm.js` ⚠️ **MUST UPDATE** (public key)
- `js/premium-packs.js` ⚠️ **MUST UPDATE** (price IDs)

**Impact if NOT Updated:**
- ❌ Course purchases won't work
- ❌ Payment processing will fail
- ❌ Users can't buy the course
- ❌ Premium features won't work

---

### 3. **Google Analytics** ⚠️ MEDIUM PRIORITY

**Current Configuration:**
- **Old Tracking ID:** `G-ST1QJZ92B0`
- **New Tracking ID:** `G-ZEZQRBTLR7`
- **Found in:** All marketing/product HTML pages

**What Needs to Happen:**
1. ✅ **Create NEW Google Analytics Property** for Pattern Reset
2. ✅ **Get NEW Tracking ID:** `G-ZEZQRBTLR7`
3. ✅ **Update all HTML files with the new ID:**
   - `index.html`
   - `letitout.html`
   - `course/breakup-course.html`
   - `product/*.html`
   - `makers.html`
   - `theheartroom.html`
   - `info.html`
   - `shop/index.html`

**Files Using Google Analytics:**
- `index.html`
- `letitout.html`
- `course/breakup-course.html`
- `product/*.html`
- `makers.html`
- `theheartroom.html`
- `info.html`
- `shop/index.html`

**Impact if NOT Updated:**
- ⚠️ Analytics will track to old project
- ⚠️ Data will be mixed with old site
- ⚠️ Can't track new project performance

---

### 4. **Google Forms** ⚠️ MEDIUM PRIORITY

**Current Configuration:**
- **Product Signup Form:** `https://docs.google.com/forms/d/e/1FAIpQLSfPbFlyktw_r1yuLameKjx3SPxQnKWTFFL47yid8lY1DI-3YQ/formResponse`
- **Course Checkout Form:** `https://docs.google.com/forms/d/e/1FAIpQLScXrguo3nsSmYskNpckgCh4kUyo5creIjPGBGgfsWXi83Ujjw/formResponse`

**What Needs to Happen:**
1. ✅ **Create NEW Google Forms** for new project
2. ✅ **Update form action URLs** in:
   - `product/power-earrings.html` (line 292)
   - `product/balance-earrings.html` (line 294)
   - `product/self-love-bracelet.html` (line 295)
   - `product/reminder-tshirt.html` (line 314)
   - `product/breakup-course.html` (line 710)
3. ✅ **Update form field names** (`entry.XXXXX`) to match new forms

**Files Using Google Forms:**
- `product/power-earrings.html` ⚠️ **MUST UPDATE**
- `product/balance-earrings.html` ⚠️ **MUST UPDATE**
- `product/self-love-bracelet.html` ⚠️ **MUST UPDATE**
- `product/reminder-tshirt.html` ⚠️ **MUST UPDATE**
- `product/breakup-course.html` ⚠️ **MUST UPDATE**

**Impact if NOT Updated:**
- ⚠️ Form submissions go to old Google Form
- ⚠️ Can't collect new project data
- ⚠️ Email notifications go to old setup

---

## 🟡 MEDIUM PRIORITY: Configuration Updates

### 5. **Package.json**

**Current:**
```json
{
  "name": "heart-matters-site",
  "description": "Heart Matters Site with Stripe Integration"
}
```

**Should Update To:**
```json
{
  "name": "pattern-reset-club",
  "description": "Pattern Reset Club - 22-day pattern breaking program"
}
```

**File:** `package.json` ⚠️ **SHOULD UPDATE**

---

### 6. **Environment Variables (.env & Vercel)**

**Required Environment Variables:**
- `STRIPE_SECRET_KEY` = Your new Stripe secret key
- (Add any other API keys if needed)

**What Needs to Happen:**
1. ✅ **Create `.env` file** (for local development):
   ```
   STRIPE_SECRET_KEY=sk_live_YOUR_NEW_KEY
   ```
2. ✅ **Add to Vercel Environment Variables:**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add `STRIPE_SECRET_KEY` with your new key

**Files Using Environment Variables:**
- `server.js` (line 3)

---

## 🟢 LOW PRIORITY: Optional Updates

### 7. **Email Addresses**

**Current:** `info@mypatternreset.com` (already updated ✅)

**Files:**
- `info.html`
- `legal.html`
- `product/breakup-course.html`

**Status:** ✅ Already updated during domain migration

---

### 8. **Social Media Links**

**Current:**
- Instagram: `https://www.instagram.com/heartmatters__/`
- TikTok: `https://www.tiktok.com/@heartmatters__`

**What Needs to Happen:**
- ⚠️ Update to new social media handles (if different)
- ⚠️ Or keep if using same accounts

**Files:**
- `index.html` (structured data)
- Other pages with social links

---

## 📋 Summary Checklist

### 🔴 CRITICAL (Must Do Before Launch):
- [ ] Create new Firebase project
- [ ] Update `js/config/firebase-config.js`
- [ ] Deploy Firestore rules to new project
- [ ] Create new Stripe account/products
- [ ] Update all Stripe keys and price IDs
- [ ] Set Stripe environment variable in Vercel
- [ ] Test payment processing

### 🟡 IMPORTANT (Should Do):
- [ ] Create new Google Analytics property
- [ ] Update Google Analytics tracking IDs
- [ ] Create new Google Forms
- [ ] Update Google Form URLs
- [ ] Update `package.json` name/description

### 🟢 OPTIONAL (Nice to Have):
- [ ] Update social media links (if changed)
- [ ] Review and update email addresses (already done ✅)

---

## 🚨 Testing Checklist

After updating configurations, test:

1. **Firebase:**
   - [ ] Can create posts on "Let It Out" wall
   - [ ] Posts save to Firestore
   - [ ] User authentication works
   - [ ] Real-time updates work

2. **Stripe:**
   - [ ] Course purchase flow works
   - [ ] Payment processing completes
   - [ ] Success redirect works
   - [ ] Course access granted after payment

3. **Google Analytics:**
   - [ ] Page views tracked
   - [ ] Events tracked (if any)

4. **Google Forms:**
   - [ ] Form submissions work
   - [ ] Data collected correctly

---

## 📝 Next Steps

1. **Start with Firebase** (most critical)
2. **Then Stripe** (required for payments)
3. **Then Google Analytics** (for tracking)
4. **Then Google Forms** (for data collection)
5. **Test everything** before launch

---

**⚠️ DO NOT DEPLOY TO PRODUCTION until all critical items are updated!**

