# Google Form Setup for Common Ground Applications

This guide walks you through connecting the Common Ground apply form to a Google Sheet so you can easily view and manage applications.

---

## Step 1: Create a New Google Form

1. Go to [Google Forms](https://forms.google.com)
2. Click **Blank** (or **+** to create a new form)
3. Name it something like **Common Ground Applications**

---

## Step 2: Add Questions (One Per Field)

Add the following questions in this exact order. The order matters because it determines the column order in your sheet.

| # | Question title | Type | Notes |
|---|----------------|------|-------|
| 1 | First name | Short answer | Required |
| 2 | Last name | Short answer | Required |
| 3 | Email | Short answer | Required |
| 4 | Phone | Short answer | Optional |
| 5 | City | Short answer | Required |
| 6 | Age range | Short answer | Will receive: 18-24, 25-34, etc. |
| 7 | Instagram | Short answer | Optional |
| 8 | Clubs | Paragraph | Will receive comma-separated: friday-flow, saturday-social-walk |
| 9 | Life stage | Paragraph | Will receive comma-separated values |
| 10 | Availability | Paragraph | Will receive comma-separated values |
| 11 | Relationship status | Short answer | single, dating, relationship, married, etc. (optional) |
| 12 | Why join | Paragraph | Free text |
| 13 | Event interest | Short answer | Which club card they clicked (if any) |
| 14 | Attend preference | Short answer | comfortable-solo, prefer-friend, or either |
| 15 | Guidelines agreed | Short answer | Will receive "Yes" or "No" |
| 16 | Contact share consent | Short answer | Will receive "Yes" or "No" |

**Tip:** You can set questions 1–7 and 11 as "Required" in the form settings if you want — but the website already validates these, so it's optional.

---

## Step 3: Get the Form ID

1. Click **Send** (top right)
2. Click the **link icon** (🔗)
3. Copy the URL. It looks like:
   ```
   https://docs.google.com/forms/d/e/1FAIpQLSeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/viewform
   ```
4. The **Form ID** is the long string between `/d/e/` and `/viewform`:
   ```
   1FAIpQLSeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
5. Save this — you'll need it in Step 5.

---

## Step 4: Get Entry IDs for Each Question

Each form question has a unique **entry ID** (e.g. `entry.123456789`). Here's how to get them:

### Method A: Get pre-filled link (easiest)

1. In your form, click the **3 dots** (⋮) next to "Send"
2. Select **Get pre-filled link**
3. Fill in each question with a placeholder like `test` (or `1` for short answers)
4. Click **Get link**
5. Copy the full URL. It will look like:
   ```
   https://docs.google.com/forms/d/e/FORM_ID/viewform?usp=pp_url&entry.123456789=test&entry.987654321=test&...
   ```
6. Each `entry.XXXXX=value` pair is one question. Write down the entry IDs in order:
   - First `entry.` → First name
   - Second `entry.` → Last name
   - etc.

### Method B: View page source

1. Click **Preview** (eye icon) to open the form
2. Right-click → **View Page Source** (or Ctrl+U / Cmd+U)
3. Search for `entry.` — you'll see `name="entry.123456789"` for each question
4. Match them to your questions by order

### Method C: Use the helper tool

1. Open `docs/extract-form-ids.html` in your browser (double-click or drag into Chrome)
2. Paste your pre-filled URL into the text area
3. Click **Extract Entry IDs**
4. Copy the generated `GOOGLE_FORM` block — it's ready to paste into `common-ground.js`

---

## Step 5: Link the Form to a Google Sheet

1. In your form, click the **Responses** tab
2. Click the green **Google Sheets** icon (or "Link to Sheets")
3. Choose **Create a new spreadsheet** (or select an existing one)
4. Name it e.g. **Common Ground Applications**
5. Click **Create** — your sheet is now connected. New submissions will appear as rows.

---

## Step 6: Update Your Code

Open `js/common-ground.js` and find the `GOOGLE_FORM` object (around line 59). Replace the placeholder values:

```javascript
const GOOGLE_FORM = {
    formId: 'YOUR_ACTUAL_FORM_ID',  // from Step 3
    entries: {
        firstName: 'entry.XXXXX',    // from Step 4, question 1
        lastName: 'entry.XXXXX',     // question 2
        email: 'entry.XXXXX',        // question 3
        phone: 'entry.XXXXX',        // question 4
        city: 'entry.XXXXX',         // question 5
        ageRange: 'entry.XXXXX',     // question 6
        instagram: 'entry.XXXXX',    // question 7
        interests: 'entry.XXXXX',    // question 8 (same as clubs, comma-separated)
        clubs: 'entry.XXXXX',        // question 8 (use same entry ID as interests)
        lifeStage: 'entry.XXXXX',    // question 9
        availability: 'entry.XXXXX', // question 10
        relationshipStatus: 'entry.XXXXX', // question 11
        whyJoin: 'entry.XXXXX',      // question 12
        eventInterest: 'entry.XXXXX',// question 13
        attendPreference: 'entry.XXXXX', // question 14
        guidelinesAgreed: 'entry.XXXXX', // question 15
        contactShareConsent: 'entry.XXXXX', // question 16
    },
};
```

**Note:** `interests` and `clubs` send the same data (comma-separated club IDs). Use the same entry ID for both — they'll both write to the same "Clubs" column. Or remove `interests` from the form and only use `clubs`.

---

## Step 7: Test It

1. Deploy or run your site locally
2. Fill out and submit the Common Ground application form
3. Check your Google Sheet — a new row should appear within a few seconds
4. Check the browser console (F12) for any errors

---

## Troubleshooting

### No data in the sheet
- **Server proxy:** Submissions go through `/api/common-ground-google-form` (server.js). Ensure the server is running and deployed. On Vercel, the rewrite is configured.
- **Google Form settings:** In your form, click the gear icon → **Responses** → ensure "Collect email addresses" is off if you want anonymous submissions, and "Restrict to users in [org]" is off so anyone can respond.
- **Wrong entry IDs:** Double-check each `entry.XXXXX` matches the correct question. Order matters.
- **Form ID:** Ensure there are no extra spaces and the ID is the full string from the URL.

### Duplicate columns
- If you have both `interests` and `clubs` pointing to different questions, you'll get two columns. Use the same entry ID for both, or remove one from the form and from the `entries` object.

### Data format
- **Clubs:** `friday-flow, saturday-social-walk, sunday-dinner`
- **Life stage:** `new-to-area, remote-work, single`
- **Availability:** `weekends, weeknights, flexible`
- **Attend preference:** `comfortable-solo`, `prefer-friend`, or `either`

---

## Quick Reference: Form Structure

```
Common Ground Applications
├── First name (Short answer)
├── Last name (Short answer)
├── Email (Short answer)
├── Phone (Short answer)
├── City (Short answer)
├── Age range (Short answer)
├── Instagram (Short answer)
├── Clubs (Paragraph)
├── Life stage (Paragraph)
├── Availability (Paragraph)
├── Relationship status (Short answer)
├── Why join (Paragraph)
├── Event interest (Short answer)
├── Attend preference (Short answer)
├── Guidelines agreed (Short answer)
└── Contact share consent (Short answer)
```
