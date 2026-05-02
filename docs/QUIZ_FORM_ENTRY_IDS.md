# Quiz Form Entry IDs – Verification Guide

When you add new questions to the Google Form (e.g. Current Pain, Biggest Fear), the form assigns **new entry IDs**. The quiz must send the correct IDs or data will not appear in Form Responses 1.

## How to Get Entry IDs from Your Form

1. Open your **Pattern Quiz Submissions** Google Form (the one linked to Form Responses 1).
2. Click the **⋮** (three dots) menu → **Get pre-filled link**.
3. Fill in a sample answer for each question (including the new ones).
4. Click **Get link**.
5. The URL will look like:  
   `https://docs.google.com/forms/d/e/.../viewform?usp=pp_url&entry.582121306=John&entry.1024132954=john@example.com&entry.1745092026=...&entry.1602083511=...`
6. The numbers after `entry.` are the entry IDs for each question.

## Current Entry IDs in Code

| Field           | Entry ID       | Location                    |
|----------------|----------------|-----------------------------|
| Name           | entry.582121306 | index.html, FeedbackTab.gs |
| Email          | entry.1024132954 | index.html                 |
| Phone          | entry.479336729 | index.html                 |
| Pattern        | entry.1636500525 | index.html                 |
| Archetype      | entry.1669029656 | index.html                 |
| Pattern Dominance | entry.2023467530 | index.html              |
| Primary Complex   | entry.592148584 | index.html              |
| Secondary Complex | entry.2142135160 | index.html              |
| Birth Date     | entry.1276258241 | index.html                 |
| Age            | entry.170864257 | index.html                 |
| Sun Sign       | entry.1863926933 | index.html                 |
| Relationship Status | entry.231449018 | index.html             |
| Driver Scores  | entry.1799985826 | index.html                 |
| Secondary Pattern | entry.2066312398 | index.html              |
| Secondary Driver % | entry.2064418059 | index.html              |
| **Current Pain** | entry.1745092026 | index.html (FORM_ENTRY_CURRENT_PAIN) |
| **Biggest Fear** | entry.1602083511 | index.html (FORM_ENTRY_BIGGEST_FEAR) |
| **City** (optional) | _Add to form first_ | index.html (FORM_ENTRY_CITY) — for Common Ground & local event targeting |

## Adding the City Field

1. Add a **Short answer** question "City" to your Pattern Quiz Submissions form (optional).
2. Get the entry ID from the pre-filled link.
3. In `index.html`, update: `const FORM_ENTRY_CITY = 'entry.YOUR_ENTRY_ID';`
4. Update your Apps Script Web App to forward the city field to the form.

## If Your Form Has Different IDs

If you added the 2 new questions and the form gave them **different** entry IDs:

1. Get the correct IDs from the pre-filled link (step 1–6 above).
2. Update `index.html` around line 3914–3915:
   ```javascript
   const FORM_ENTRY_CURRENT_PAIN = 'entry.YOUR_CURRENT_PAIN_ID';
   const FORM_ENTRY_BIGGEST_FEAR = 'entry.YOUR_BIGGEST_FEAR_ID';
   ```

## Form and Sheet Must Match

- **Form Responses 1** = the sheet linked to your form. Quiz data goes here when the Web App writes directly.
- **Feedback** = separate sheet. User feedback goes here (no form submission).

## Fixing "Column 4" or Generic Headers

If you see generic headers like "Column 4" in Form Responses 1:
1. Open your **Google Form** (the one linked to the sheet).
2. Find the question that shows as "Column 4" in the sheet.
3. Edit the question and give it a proper title (e.g. "About your results" or remove if it's a duplicate).
4. Save the form. New responses will use the updated header.
