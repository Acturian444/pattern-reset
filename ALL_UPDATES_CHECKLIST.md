# 📋 Complete Update Checklist

## Review this list and check what you want to update

---

## 🔐 **ACCOUNT & CREDENTIALS** (Must Update for Standalone)

### **Firebase**
- [ ] Project ID (`heart-matters-ceb3a` → new project)
- [ ] API Key
- [ ] Auth Domain
- [ ] Storage Bucket
- [ ] Messaging Sender ID
- [ ] App ID
- **File:** `js/config/firebase-config.js`

### **Stripe**
- [ ] Secret Key (server-side)
- [ ] Public Key (client-side)
- [ ] Course Price ID (`price_1RpkcDLWOdcyyqSffkzJQUf8`)
- [ ] Post Unlock Price ID (`price_1RaPPMQ1hjqBwoa0vVLHNXO1`)
- [ ] Premium Pack Price IDs (3 packs)
- **Files:** 
  - `server.js`
  - `product/breakup-course.html`
  - `js/premium-packs.js`
  - `js/postForm.js`

### **Google Analytics**
- [ ] Measurement ID (`G-ST1QJZ92B0` → new ID)
- **Files:** All HTML files (search for `G-ST1QJZ92B0`)

### **Google Forms** (Lead Capture)
- [ ] Quiz form entry IDs (`entry.XXXXX` placeholders)
- [ ] Newsletter signup form IDs
- [ ] Waitlist form IDs
- **Files:** 
  - `index.html`
  - `product/breakup-course.html`
  - `shop/index.html`

---

## 🌐 **DOMAIN & URLs** (Must Update)

### **Domain References**
- [ ] `joinheartmatters.com` → new domain
- [ ] `www.joinheartmatters.com` → new domain
- [ ] `https://www.joinheartmatters.com` → new domain
- **Files:** All HTML files, `sitemap.xml`, `robots.txt`, `vercel.json`

### **Canonical URLs**
- [ ] All `<link rel="canonical">` tags
- **Files:** All HTML files

### **Open Graph URLs**
- [ ] All `og:url` meta tags
- **Files:** All HTML files

### **Twitter Card URLs**
- [ ] All Twitter image URLs
- **Files:** All HTML files

### **Sitemap**
- [ ] All URLs in `sitemap.xml`
- **File:** `sitemap.xml`

### **Robots.txt**
- [ ] Sitemap URL
- **File:** `robots.txt`

---

## 🏷️ **BRANDING** (Update for New Brand)

### **Brand Name**
- [ ] `Heart Matters` → new brand name
- [ ] `Heart Matters™` → new brand name
- **Files:** All HTML files, navigation, footers

### **Logo/Title Text**
- [ ] Logo text in navigation
- [ ] Page titles
- **Files:** All HTML files

### **Copyright**
- [ ] Footer copyright text
- **Files:** All HTML files (footer sections)

### **Trademark References**
- [ ] All trademark mentions
- **Files:** All HTML files

---

## 📧 **CONTACT & COMMUNICATION**

### **Email Addresses**
- [ ] `info@joinheartmatters.com` → new email
- [ ] All `mailto:` links
- **Files:** All HTML files

### **Social Media Links**
- [ ] Instagram: `heartmatters__` → new handle
- [ ] TikTok: `@heartmatters__` → new handle
- [ ] All social media URLs
- **Files:** All HTML files (footer sections)

---

## 🔍 **SEO & METADATA** (Update for New Site)

### **Meta Descriptions**
- [ ] All `<meta name="description">` tags
- **Files:** All HTML files

### **Page Titles**
- [ ] All `<title>` tags
- **Files:** All HTML files

### **Open Graph Tags**
- [ ] `og:title`
- [ ] `og:description`
- [ ] `og:image`
- [ ] `og:url`
- **Files:** All HTML files

### **Twitter Cards**
- [ ] `twitter:title`
- [ ] `twitter:description`
- [ ] `twitter:image`
- **Files:** All HTML files

### **Structured Data (JSON-LD)**
- [ ] Organization name
- [ ] Organization URL
- [ ] Logo URLs
- [ ] Social media links
- [ ] Course/product data
- **Files:** All HTML files

---

## 📄 **PAGE CONTENT** (Select What to Keep/Remove)

### **Pages to Keep/Remove**
- [ ] `index.html` - Homepage with quiz
- [ ] `letitout.html` - Anonymous social wall
- [ ] `product/breakup-course.html` - Course sales page
- [ ] `course/breakup-course.html` - Course delivery
- [ ] `shop/index.html` - Shop page
- [ ] `theheartroom.html` - The Heart Room show
- [ ] `info.html` - Info/Join the Movement page
- [ ] `makers.html` - Meet the Makers page
- [ ] `legal.html` - Legal page
- [ ] `product/power-earrings.html`
- [ ] `product/balance-earrings.html`
- [ ] `product/self-love-bracelet.html`
- [ ] `product/reminder-tshirt.html`

### **Folders to Delete**
- [ ] `product_backup/` - Entire folder
- [ ] `tests/` - Test files
- [ ] `lang/` - If empty/unused

---

## 🎨 **DESIGN & STYLING** (Optional Updates)

### **Color Scheme**
- [ ] Primary color (`#ca0013` - red)
- [ ] Background color (`#fffcf1` - cream)
- **Files:** `style.css`, all CSS files

### **Fonts**
- [ ] Heading font (Anton)
- [ ] Body font (DM Sans)
- **Files:** All HTML files (font links)

### **Logo Images**
- [ ] Heart Matters logo images
- [ ] Let It Out logo
- [ ] The Heart Room logo
- **Files:** Image references in HTML

---

## 📝 **COPY & TEXT CONTENT** (Update for New Brand)

### **Homepage**
- [ ] Hero headline
- [ ] Hero subheading
- [ ] Quiz copy
- [ ] CTA buttons
- **File:** `index.html`

### **Product Pages**
- [ ] Course description
- [ ] Feature lists
- [ ] Testimonials
- [ ] FAQ content
- **File:** `product/breakup-course.html`

### **Let It Out**
- [ ] Intro modal text
- [ ] Feature descriptions
- [ ] Guidelines text
- **File:** `letitout.html`

### **Shop Page**
- [ ] Collection name ("Still Healing")
- [ ] Product descriptions
- [ ] Waitlist copy
- **File:** `shop/index.html`

---

## 🔧 **TECHNICAL CONFIGURATION**

### **Package.json**
- [ ] Project name (`heart-matters-site`)
- [ ] Description
- **File:** `package.json`

### **Vercel Configuration**
- [ ] Redirect rules (if domain changes)
- [ ] Rewrite rules
- **File:** `vercel.json`

### **Environment Variables**
- [ ] `.env` file (local development)
- [ ] Vercel environment variables
- **Files:** `.env`, Vercel dashboard

---

## 🗑️ **CLEANUP** (Remove Unused Code)

### **Unused JavaScript**
- [ ] `js/firebase-debug.js` - Debug file
- [ ] `js/test-setup.js` - Test file
- [ ] Commented-out code blocks

### **Unused CSS**
- [ ] Unused styles
- [ ] Commented CSS

### **Unused Images**
- [ ] Images not referenced
- [ ] Backup images

---

## 📊 **ANALYTICS & TRACKING**

### **Google Analytics Events**
- [ ] Event category names
- [ ] Event labels
- **Files:** All HTML files (gtag events)

### **Conversion Tracking**
- [ ] Purchase events
- [ ] Form submission events
- **Files:** All HTML files

---

## 🔒 **SECURITY & PRIVACY**

### **Privacy Policy**
- [ ] Update privacy policy URL
- [ ] Update terms of service URL
- **Files:** `legal.html`, footer links

### **Cookie Consent** (if added)
- [ ] Cookie policy
- [ ] Consent text

---

## 📱 **SOCIAL SHARING**

### **Share Images**
- [ ] Open Graph images
- [ ] Twitter Card images
- **Files:** Image references in HTML

### **Share URLs**
- [ ] Share link generation
- **Files:** `js/wallFeed.js`

---

## 🎯 **FEATURE FLAGS** (Optional)

### **MVP Mode**
- [ ] Enable/disable MVP features
- [ ] Free unlocks toggle
- **File:** `js/config/mvp-config.js`

### **Feature Toggles**
- [ ] Premium packs enabled/disabled
- [ ] Reply system enabled/disabled
- [ ] Shop enabled/disabled

---

## 📋 **SUMMARY CHECKLIST**

### **Critical (Must Do):**
- [ ] Firebase credentials
- [ ] Stripe keys and Price IDs
- [ ] Google Analytics ID
- [ ] Domain URLs (all files)
- [ ] Brand name (all files)
- [ ] Email addresses
- [ ] Social media links
- [ ] Sitemap.xml
- [ ] Robots.txt

### **Important (Should Do):**
- [ ] SEO metadata (all pages)
- [ ] Google Forms entry IDs
- [ ] Page titles and descriptions
- [ ] Delete unused pages
- [ ] Update structured data

### **Optional (Nice to Have):**
- [ ] Color scheme changes
- [ ] Font changes
- [ ] Logo updates
- [ ] Copy/content updates
- [ ] Design tweaks

---

## 🎬 **NEXT STEPS**

1. **Review this checklist**
2. **Check what you want to update**
3. **Tell me:**
   - New domain name
   - New brand name
   - Which pages to keep
   - New email address
   - New social handles
   - Any design changes
4. **I'll create a custom migration plan** based on your selections
5. **We'll do it step by step** with your approval at each stage

---

## 💡 **Questions to Answer:**

1. **What's your new domain name?**
2. **What's your new brand name?**
3. **Which pages do you want to keep?** (list them)
4. **What's your new email address?**
5. **What are your new social media handles?**
6. **Do you want to change colors/fonts?**
7. **Do you have new logo images?**
8. **What products/services are you keeping?**
9. **Any specific copy changes?**
10. **Do you want to keep Let It Out feature?**

---

**Once you review this and tell me what to update, I'll create a step-by-step execution plan!**

