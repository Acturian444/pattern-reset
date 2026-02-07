# Tech Stack Overview - Pattern Reset Project

## 🎨 Frontend Technologies

### Core Languages
- **HTML5** - All pages (5 total: index.html, product/breakup-course.html, course/breakup-course.html, letitout.html, legal.html)
- **CSS3** - Custom styling with:
  - `style.css` (main stylesheet - 3,147 lines)
  - `product/product.css` (product page specific)
  - `course/course.css` (course access page)
  - `legal.css` (legal page)
  - `styles/letitout-*.css` (multiple Let It Out page stylesheets)
- **JavaScript (Vanilla ES6+)** - No frameworks, pure JavaScript
  - Modular structure in `/js` directory
  - Event-driven architecture
  - Local Storage for state management

### Frontend Features
- **Responsive Design** - Mobile-first approach with media queries
- **Progressive Enhancement** - Works without JavaScript for basic functionality
- **CSS Animations** - Custom keyframes and transitions
- **CSS Variables** - For theming and dynamic values
- **Local Storage** - Quiz state persistence, course unlock status

---

## 🗄️ Backend & Services

### Serverless Functions (Vercel)
- **Node.js** - Server-side logic
- **Express.js** - HTTP server framework
- **Server File:** `server.js` - Handles Stripe checkout sessions

### Payment Processing
- **Stripe API** (v14.14.0)
  - Checkout Sessions
  - Price IDs for products
  - Payment method: Credit cards
  - Promotion codes support
  - Environment variable: `STRIPE_SECRET_KEY`

### Database & Authentication
- **Firebase** (Google)
  - **Firestore** - NoSQL database for:
    - User posts (Let It Out wall)
    - Replies and comments
    - Post counters (likes, views)
    - Premium pack unlocks
  - **Authentication** - Anonymous auth for Let It Out wall
  - **Offline Persistence** - Enabled for Firestore
  - **Project ID:** `pattern-reset`
  - **Config:** `js/config/firebase-config.js`

### Data Collection
- **Google Forms** - Quiz results submission
  - Form ID: `1FAIpQLSdMfNDBBsnuE2Q1_Gn57Y_FJmpWTw0h00bTStNd5Bju07mTKA`
  - Collects: Name, Email, Phone, Quiz results, Pattern data, Birth date, Relationship status

### Analytics
- **Google Analytics 4 (GA4)**
  - Tracking ID: `G-ZEZQRBTLR7`
  - Custom events for:
    - Quiz completion
    - Newsletter signups
    - Course purchases
    - Social media clicks
    - Navigation tracking

---

## ☁️ Hosting & Deployment

### Platform
- **Vercel** - Serverless hosting platform
  - Static file hosting
  - Serverless functions
  - Automatic HTTPS
  - Edge network (CDN)

### Configuration
- **vercel.json** - Deployment configuration
  - Builds: Node.js serverless functions + static files
  - Rewrites: API endpoints to server.js
  - Redirects: Clean URLs (removes .html), domain redirects

### Domains
- **Primary:** `mypatternreset.com` (no www)
- **Redirect:** `resetmypattern.com` → `mypatternreset.com`

---

## 📦 Dependencies (package.json)

### Production Dependencies
```json
{
  "express": "^4.18.2",      // HTTP server
  "stripe": "^14.14.0",      // Payment processing
  "dotenv": "^16.3.1"        // Environment variables
}
```

### No Build Tools
- No bundlers (Webpack, Vite, etc.)
- No transpilers (Babel, TypeScript)
- No CSS preprocessors (Sass, Less)
- Pure vanilla JavaScript and CSS

---

## 🎯 Third-Party Services & CDNs

### Fonts
- **Google Fonts**
  - **Anton** - Display font (headings)
  - **DM Sans** - Body font (400, 500, 600 weights)

### Icons
- **Font Awesome 6.5.1** (via CDN)
  - CDN: `cdnjs.cloudflare.com`

### External APIs
- **Stripe Checkout API** - Payment processing
- **Firebase SDK** - Database and auth
- **Google Forms API** - Data collection
- **Google Analytics API** - Tracking

---

## 📁 Project Structure

```
Love Pattern Site/
├── index.html                 # Homepage (quiz, hero, how it works)
├── product/
│   └── breakup-course.html    # Product sales page
├── course/
│   └── breakup-course.html   # Course access page (post-purchase)
├── letitout.html             # Anonymous social wall
├── legal.html                # Legal & IP page
├── style.css                 # Main stylesheet
├── product/
│   └── product.css          # Product page styles
├── course/
│   └── course.css           # Course page styles
├── styles/                   # Let It Out page stylesheets
├── js/                       # JavaScript modules
│   ├── config/
│   │   ├── firebase-config.js
│   │   └── mvp-config.js
│   ├── components/
│   │   └── post-card.js
│   ├── services/
│   │   └── post-service.js
│   ├── firebase.js          # Firebase initialization
│   ├── wallFeed.js          # Let It Out wall logic
│   ├── postForm.js          # Post submission
│   ├── course.js            # Course access logic
│   ├── premium-packs.js     # Premium features
│   └── utils.js            # Utility functions
├── server.js                 # Stripe serverless function
├── vercel.json              # Vercel configuration
├── package.json             # Node.js dependencies
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Search engine directives
└── site.webmanifest        # PWA manifest
```

---

## 🔧 Development Tools

### Version Control
- **Git** - Source control
- **GitHub** - Repository hosting

### Environment Variables
- **dotenv** - Environment variable management
- **Vercel Environment Variables** - Production secrets
  - `STRIPE_SECRET_KEY` - Stripe API key

### No Build Process
- Direct file editing
- No compilation step
- No bundling
- Live reload via Vercel preview deployments

---

## 🎨 Design & UI

### CSS Architecture
- **No CSS Framework** - Custom CSS only
- **CSS Variables** - For theming
- **Media Queries** - Responsive breakpoints
- **Flexbox & Grid** - Layout systems
- **CSS Animations** - Custom keyframes

### JavaScript Architecture
- **Modular Structure** - Separate files by feature
- **Event-Driven** - DOM event listeners
- **No State Management Library** - Local Storage + global variables
- **No Framework** - Vanilla JavaScript

---

## 🔐 Security & Privacy

### Authentication
- **Firebase Anonymous Auth** - For Let It Out wall
- **No User Accounts** - Anonymous only (for now)

### Data Storage
- **Local Storage** - Client-side (quiz state, course unlocks)
- **Firestore** - Server-side (posts, replies)
- **Google Forms** - User data collection

### Payment Security
- **Stripe** - PCI-compliant payment processing
- **Server-side validation** - All payments processed server-side

---

## 📊 Data Flow

### Quiz Flow
1. User answers questions → Stored in `localStorage`
2. Results calculated → JavaScript functions
3. Form submission → Google Forms API
4. Email report → (External email service - not in codebase)

### Payment Flow
1. User clicks purchase → Frontend JavaScript
2. Creates checkout session → `server.js` (Stripe API)
3. Redirects to Stripe Checkout → Stripe hosted page
4. Payment success → Redirects back to site
5. Course unlock → `localStorage` + Firestore

### Let It Out Wall Flow
1. User signs in anonymously → Firebase Auth
2. User creates post → `postForm.js`
3. Post saved to Firestore → `post-service.js`
4. Posts displayed → `wallFeed.js`
5. Real-time updates → Firestore listeners

---

## 🌐 Browser Support

### Modern Browsers
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Features Used
- ES6+ JavaScript
- CSS Grid & Flexbox
- Local Storage API
- Fetch API
- CSS Variables
- CSS Animations

---

## 📈 Performance

### Optimization
- **Font Preloading** - Google Fonts
- **Lazy Loading** - Images (where applicable)
- **CDN Delivery** - Vercel Edge Network
- **Minimal Dependencies** - No heavy frameworks
- **Static Assets** - Served via CDN

### Caching
- **Browser Caching** - Static assets
- **Vercel CDN** - Global edge caching
- **Firestore Offline** - Local persistence

---

## 🔄 Deployment Process

### Current Setup
1. **Git Push** → GitHub repository
2. **Vercel Auto-Deploy** → Detects changes
3. **Build** → Static files + serverless functions
4. **Deploy** → Live on `mypatternreset.com`

### No CI/CD Pipeline
- Direct deployment from Git
- No separate staging environment (uses Vercel previews)

---

## 📝 Summary

### Tech Stack Highlights
- ✅ **Simple & Lightweight** - No heavy frameworks
- ✅ **Fast Performance** - Minimal dependencies
- ✅ **Serverless** - Vercel + Firebase
- ✅ **Scalable** - Serverless architecture
- ✅ **Modern** - ES6+, CSS3, HTML5
- ✅ **Secure** - Stripe payments, Firebase auth

### Key Technologies
1. **Frontend:** HTML5, CSS3, Vanilla JavaScript
2. **Backend:** Node.js, Express.js (serverless)
3. **Database:** Firebase Firestore
4. **Payments:** Stripe
5. **Hosting:** Vercel
6. **Analytics:** Google Analytics 4
7. **Data Collection:** Google Forms

### Architecture Type
**JAMstack** (JavaScript, APIs, Markup)
- Static HTML/CSS/JS
- Serverless functions for dynamic features
- Third-party APIs for services
- CDN delivery

