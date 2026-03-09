# Feedback Feature Setup Guide

This guide helps you:
1. **Deploy the Web App proxy** (fixes 400 error when submitting from your site)
2. **Add a Feedback tab** that shows Name, Pattern, Complexes, and Feedback in one place

---

## Step 1: Deploy the Web App Proxy (Required – Fixes 400 Error)

Google Forms returns a 400 error when submitted directly from your website. The fix is to use an Apps Script Web App as a proxy.

1. Open your **Pattern Quiz Submissions** Google Sheet
2. Go to **Extensions → Apps Script**
3. Paste the contents of `docs/FeedbackTab.gs` (replace any existing code), then **Save**
4. Click **Deploy** → **New deployment**
5. Click the gear icon next to "Select type" → choose **Web app**
6. Set:
   - **Description:** Feedback proxy
   - **Execute as:** Me
   - **Who has access:** Anyone
7. Click **Deploy**, then **Authorize access** if prompted
8. **Copy the Web App URL** (it ends with `/exec`)

### Update your site

Open `js/feedback-modal.js` and set the Web App URL on line 9:

```javascript
const FEEDBACK_WEB_APP_URL = 'https://script.google.com/macros/s/YOUR_ID/exec';
```

Replace with your actual URL from step 8.

---

## Step 2 (Legacy): Get the Feedback Entry ID

Your feedback won't appear in the sheet until the correct entry ID is set. Here's how to find it:

1. Open your Google Form: [Pattern Quiz Form](https://docs.google.com/forms/d/e/1FAIpQLSfv4rmCtd2JDVeFfjy8a6cDMtQanHzAIwu39H2v-heZVlGYcg/edit)
2. Click the **⋮** (three dots) in the top right
3. Select **Get pre-filled link**
4. In the "Your feedback or question" field, type `test` (or anything)
5. Click **Get link**
6. Copy the generated URL. It will look like:
   ```
   https://docs.google.com/forms/d/e/1FAIpQLS.../viewform?usp=pp_url&entry.1234567890=test
   ```
7. The number after `entry.` is your entry ID. In the example above it's `1234567890`, so the full ID is `entry.1234567890`

### Update the code

Open `js/feedback-modal.js` and replace line 8:

```javascript
const FEEDBACK_ENTRY_ID = 'entry.0'; // TODO: Replace with your actual entry ID
```

with your actual ID, e.g.:

```javascript
const FEEDBACK_ENTRY_ID = 'entry.1234567890';
```

---

## Step 3: Add a Feedback Tab to Your Google Sheet

### Option A: Formula-based (simplest)

1. Open your **Pattern Quiz Submissions** Google Sheet
2. Add a new tab at the bottom and name it **Feedback**
3. In cell A1 of the Feedback tab, paste this formula (adjust column letters if your feedback column is different):

   ```
   =QUERY(Form_Responses!A:Z, "SELECT A, B, E, F, H, I, J WHERE J <> '' ORDER BY A DESC", 1)
   ```

   **Column mapping:**
   - A = Timestamp
   - B = Name
   - E = Archetype
   - F = Pattern
   - H = Primary Complex
   - I = Secondary Complex
   - J = Your feedback or question (change J if your feedback column is different)

   To find your feedback column: look at the Form_Responses tab headers. The column for "Your feedback or question" is the one to use (e.g. if it's column K, change `J` to `K` in the formula).

### Option B: Google Apps Script (auto-copy on submit)

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code and paste the script below
3. Save (Ctrl/Cmd+S) and name the project "Feedback Tab"
4. Run `onFormSubmit` once manually (select it from the dropdown, click Run) to create the Feedback tab and add headers
5. To copy any *existing* feedback from Form_Responses, run `backfillFeedbackTab` once (select it, click Run)
6. Go to **Triggers** (clock icon) → **Add Trigger**
   - Function: `onFormSubmit`
   - Event: From spreadsheet
   - Type: On form submit
   - Save

```javascript
/**
 * Copies form responses that have feedback into a dedicated Feedback tab.
 * Run once to create the tab; then add an "On form submit" trigger.
 */
function onFormSubmit(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var formSheet = ss.getSheetByName('Form_Responses');
  var feedbackSheet = ss.getSheetByName('Feedback');
  
  if (!formSheet) return;
  
  // Create Feedback tab if it doesn't exist
  if (!feedbackSheet) {
    feedbackSheet = ss.insertSheet('Feedback');
    feedbackSheet.appendRow(['Timestamp', 'Name', 'Archetype', 'Pattern', 'Primary Complex', 'Secondary Complex', 'Feedback']);
    feedbackSheet.getRange('A1:G1').setFontWeight('bold');
  }
  
  var data = formSheet.getDataRange().getValues();
  if (data.length < 2) return;
  
  var headers = data[0];
  var feedbackCol = -1;
  for (var i = 0; i < headers.length; i++) {
    if (String(headers[i]).toLowerCase().indexOf('feedback') >= 0 || 
        String(headers[i]).toLowerCase().indexOf('question') >= 0) {
      feedbackCol = i;
      break;
    }
  }
  if (feedbackCol < 0) return;
  
  // Map Form_Responses columns (adjust indices if your columns differ)
  // A=0 Timestamp, B=1 Name, E=4 Archetype, F=5 Pattern, H=7 Primary, I=8 Secondary
  var tsCol = 0, nameCol = 1, archCol = 4, patternCol = 5, primCol = 7, secCol = 8;
  
  var lastRow = data[data.length - 1];
  var feedback = lastRow[feedbackCol] ? String(lastRow[feedbackCol]).trim() : '';
  
  if (feedback) {
    feedbackSheet.appendRow([
      lastRow[tsCol] || '',
      lastRow[nameCol] || '',
      lastRow[archCol] || '',
      lastRow[patternCol] || '',
      lastRow[primCol] || '',
      lastRow[secCol] || '',
      feedback
    ]);
  }
}

/** Run once to copy all existing feedback rows into the Feedback tab. */
function backfillFeedbackTab() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var formSheet = ss.getSheetByName('Form_Responses');
  if (!formSheet) return;
  
  var feedbackSheet = ss.getSheetByName('Feedback');
  if (!feedbackSheet) {
    feedbackSheet = ss.insertSheet('Feedback');
    feedbackSheet.appendRow(['Timestamp', 'Name', 'Archetype', 'Pattern', 'Primary Complex', 'Secondary Complex', 'Feedback']);
    feedbackSheet.getRange('A1:G1').setFontWeight('bold');
  }
  
  var data = formSheet.getDataRange().getValues();
  if (data.length < 2) return;
  
  var headers = data[0];
  var feedbackCol = -1;
  for (var i = 0; i < headers.length; i++) {
    if (String(headers[i]).toLowerCase().indexOf('feedback') >= 0 || 
        String(headers[i]).toLowerCase().indexOf('question') >= 0) {
      feedbackCol = i;
      break;
    }
  }
  if (feedbackCol < 0) {
    SpreadsheetApp.getUi().alert('Could not find a column with "feedback" or "question" in the header.');
    return;
  }
  
  var tsCol = 0, nameCol = 1, archCol = 4, patternCol = 5, primCol = 7, secCol = 8;
  var count = 0;
  for (var r = 1; r < data.length; r++) {
    var row = data[r];
    var feedback = row[feedbackCol] ? String(row[feedbackCol]).trim() : '';
    if (feedback) {
      feedbackSheet.appendRow([
        row[tsCol] || '', row[nameCol] || '', row[archCol] || '',
        row[patternCol] || '', row[primCol] || '', row[secCol] || '', feedback
      ]);
      count++;
    }
  }
  SpreadsheetApp.getUi().alert('Copied ' + count + ' feedback row(s) to Feedback tab.');
}
```

---

## UX Improvements (Already Done)

- The browser `alert()` has been replaced with an in-app success message: a green checkmark and "Thank you!" inside the modal, which auto-closes after 2 seconds.
