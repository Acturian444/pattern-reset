# Common Ground Social Club — Setup Guide

Complete these steps to finish configuring Common Ground.

---

## 1. Deploy Firestore Rules

The `commonGroundApplications` collection rule has been added to `firestore.rules`. Deploy it:

```bash
firebase deploy --only firestore:rules
```

Or deploy via Firebase Console: copy the rule from `firestore.rules` and publish.

---

## 2. Google Form (Dual Submission)

### Create the form

1. Go to [Google Forms](https://forms.google.com)
2. Create a new form: **Common Ground Applications**
3. Add these fields (match the order):

| Field | Type | Required |
|-------|------|----------|
| First name | Short answer | ✓ |
| Email | Short answer | ✓ |
| Phone | Short answer | |
| City | Short answer | ✓ |
| Age range | Dropdown (18-24, 25-34, 35-44, 45+) | ✓ |
| Instagram | Short answer | |
| Interests | Short answer | ✓ |
| What kind of people do you want to meet? | Paragraph | ✓ |
| Why do you want to join? | Paragraph | ✓ |
| Event interest | Short answer | |
| Attending solo | Multiple choice (Yes/No) | |
| Guidelines agreed | Multiple choice (Yes/No) | ✓ |
| Contact share consent | Multiple choice (Yes/No) | |

4. Click **Send** → **Link** → copy the form ID from the URL:
   - URL format: `https://docs.google.com/forms/d/e/FORM_ID/formResponse`
   - The FORM_ID is the long string between `/e/` and `/formResponse`

### Get entry IDs

1. In the form, click the 3 dots (⋮) → **Get pre-filled link**
2. Fill one value in each field, click **Get link**
3. The URL will contain `entry.XXXXX=value` — copy each `entry.XXXXX` ID

### Update `js/common-ground.js`

Replace `GOOGLE_FORM` with your values:

```javascript
const GOOGLE_FORM = {
    formId: 'YOUR_FORM_ID',
    entries: {
        firstName: 'entry.123456789',
        email: 'entry.123456789',
        // ... etc for each field
    },
};
```

---

## 3. Stripe Product & Price

### Create product

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Products**
2. **Add product**
3. Name: **Saturday Social Walk** (or your event name)
4. Price: e.g. **$25** one-time
5. Save and copy the **Price ID** (starts with `price_`)

### Update checkout

1. Edit `common-ground/checkout.html`
2. Replace `price_XXXXX` in the `events` object with your Price ID
3. Update the Stripe publishable key if needed (currently uses Pattern Reset key)

### Invite link format

When you approve an applicant, send them:

```
https://mypatternreset.com/common-ground/checkout.html?event=saturday-walk-1&email=their@email.com&priceId=price_YOUR_PRICE_ID
```

Or use `priceId` in the events config and omit it from the URL.

---

## 4. Firebase Verification

Your Firebase is already configured. Verify:

1. **Firebase Console** → Firestore → check `commonGroundApplications` exists (it will be created on first submission)
2. **Rules** → ensure the `commonGroundApplications` rule is deployed
3. **Authorized domains** → add your domain if not already listed

---

## 5. Contact Email

Update the contact link if needed. Currently set to `support@mypatternreset.com` in:

- `common-ground.html` (footer, menu)
- `letitout.html` (menu)
- `product/breakup-course.html` (menu)

---

## 6. Event Data

Edit `js/common-ground.js` → `EVENTS` array to update:

- Event names, dates, cities
- Descriptions
- Capacity

---

## 7. Founder Photo (Optional)

Add your photo to the "Why I Started Common Ground" section:

1. Place image in `images/` (e.g. `images/founder.jpg`)
2. Add to `common-ground.html` in the founder story section:

```html
<img src="images/founder.jpg" alt="Founder" class="cg-founder-photo" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem;">
```

---

## Summary Checklist

- [ ] Deploy Firestore rules
- [ ] Create Google Form and update `js/common-ground.js`
- [ ] Create Stripe product and update `common-ground/checkout.html`
- [ ] Verify Firebase
- [ ] Update contact email if needed
- [ ] Update event data in `js/common-ground.js`
- [ ] Add founder photo (optional)
