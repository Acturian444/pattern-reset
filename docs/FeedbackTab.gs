/**
 * Google Apps Script for Pattern Quiz Submissions sheet
 * 1. Web App: receives feedback AND quiz submissions from your site
 *    - Feedback: writes DIRECTLY to Feedback sheet (no Form submission)
 *    - Quiz: writes DIRECTLY to Form Responses 1 (bypasses form CAPTCHA/entry-ID issues)
 * 2. onFormSubmit: copies quiz responses with feedback into Feedback tab (for quiz submissions that include feedback)
 *
 * SETUP:
 * 1. Open your "Pattern Quiz Submissions" Google Sheet
 * 2. Extensions → Apps Script (IMPORTANT: create from the sheet so the script is bound to it)
 * 3. Paste this entire file, save
 *    - If you use a standalone project, set SPREADSHEET_ID at the top (from the sheet URL)
 * 4. Deploy as Web App: Deploy → New deployment → Web app
 *    - Execute as: Me | Who has access: Anyone
 *    - Copy the Web App URL
 * 5. In js/feedback-modal.js, set FEEDBACK_WEB_APP_URL to your Web App URL
 * 6. In index.html, set QUIZ_WEB_APP_URL to the same Web App URL (for quiz submissions)
 * 7. Run backfillFeedbackTab once to copy existing feedback from Form Responses
 * 8. Triggers → Add Trigger: onFormSubmit, On form submit (for quiz submissions only)
 */

// Entry IDs from feedback modal (must match js/feedback-modal.js)
var ENTRY_NAME = 'entry.582121306';
var ENTRY_ARCHETYPE = 'entry.1669029656';
var ENTRY_PATTERN = 'entry.1636500525';
var ENTRY_PRIMARY = 'entry.592148584';
var ENTRY_SECONDARY = 'entry.2142135160';
var ENTRY_FEEDBACK = 'entry.206451738';

// Google Form URL for quiz (Web App forwards here; form adds row to Form Responses 1)
var QUIZ_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfv4rmCtd2JDVeFfjy8a6cDMtQanHzAIwu39H2v-heZVlGYcg/formResponse';

// If script is standalone (not bound to a sheet), set your sheet ID here. Get it from the sheet URL:
// https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
var SPREADSHEET_ID = '';  // e.g. '1abc123xyz...'

/**
 * GET handler (e.g. when visiting the Web App URL in a browser).
 * The Web App is designed for POST (quiz + feedback submissions).
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    ok: true,
    message: 'Pattern Quiz Web App. This endpoint accepts POST requests for quiz and feedback submissions.'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Parse POST body into key-value object (handles both e.parameter and e.postData.contents).
 */
function parsePostParams(e) {
  var params = e.parameter || {};
  if (Object.keys(params).length === 0 && e.postData && e.postData.contents) {
    var parts = e.postData.contents.split('&');
    for (var i = 0; i < parts.length; i++) {
      var idx = parts[i].indexOf('=');
      if (idx >= 0) {
        var k = decodeURIComponent(parts[i].substring(0, idx).replace(/\+/g, ' '));
        var v = decodeURIComponent((parts[i].substring(idx + 1) || '').replace(/\+/g, ' '));
        params[k] = v;
      }
    }
  }
  return params;
}

/**
 * Web App endpoint: receives POST from your site.
 * - If feedback message present: writes DIRECTLY to Feedback sheet (no Form submission).
 * - Else (quiz submission): writes DIRECTLY to Form Responses 1 sheet.
 */
function doPost(e) {
  try {
    var params = parsePostParams(e);
    var name = params[ENTRY_NAME] || '';
    var feedback = params[ENTRY_FEEDBACK] ? String(params[ENTRY_FEEDBACK]).trim() : '';

    // Feedback: write to Feedback sheet only (no Form submission)
    if (feedback) {
      var archetype = params[ENTRY_ARCHETYPE] || '';
      var pattern = params[ENTRY_PATTERN] || '';
      var primary = params[ENTRY_PRIMARY] || '';
      var secondary = params[ENTRY_SECONDARY] || '';
      var displayName = name || 'Feedback submission';

      var ss = getSpreadsheet();
      var feedbackSheet = ss.getSheetByName('Feedback');
      if (!feedbackSheet) {
        feedbackSheet = ss.insertSheet('Feedback');
        feedbackSheet.appendRow(['Timestamp', 'Name', 'Archetype', 'Pattern', 'Primary Complex', 'Secondary Complex', 'Feedback']);
        feedbackSheet.getRange('A1:G1').setFontWeight('bold');
      }

      var now = new Date();
      feedbackSheet.appendRow([now, displayName, archetype, pattern, primary, secondary, feedback]);

      return ContentService.createTextOutput(JSON.stringify({ ok: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Quiz: write DIRECTLY to Form Responses 1 (bypasses form CAPTCHA/entry-ID issues)
    if (!name && !params['entry.1024132954']) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Missing name or email' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var ss = getSpreadsheet();
    var formSheet = getFormResponsesSheet(ss);
    if (!formSheet) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Form Responses 1 sheet not found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var data = formSheet.getDataRange().getValues();
    var headers = data.length > 0 ? data[0] : [];
    var numCols = headers.length;
    if (numCols === 0) {
      numCols = 18;
      headers = ['Timestamp', 'Name', 'Email', 'Phone', 'Pattern', 'Archetype', 'Pattern Dominance', 'Primary Complex', 'Secondary Complex', 'Birth Date', 'Age', 'Sun Sign', 'Relationship Status', 'Driver Scores', 'Secondary Pattern', 'Secondary Driver %', 'Current Pain', 'Biggest Fear'];
      formSheet.appendRow(headers);
      formSheet.getRange(1, 1, 1, numCols).setFontWeight('bold');
    }

    var colMap = {};
    for (var c = 0; c < headers.length; c++) {
      var h = String(headers[c]).toLowerCase();
      if (h.indexOf('timestamp') >= 0) colMap['timestamp'] = c;
      else if ((h.indexOf('name') >= 0 || h === 'your name') && !colMap['name']) colMap['name'] = c;
      else if ((h.indexOf('email') >= 0 || h.indexOf('e-mail') >= 0) && !colMap['email']) colMap['email'] = c;
      else if ((h.indexOf('phone') >= 0 || h.indexOf('number') >= 0) && h.indexOf('entry') < 0 && !colMap['phone']) colMap['phone'] = c;
      else if (h.indexOf('pattern') >= 0 && h.indexOf('dominance') < 0 && h.indexOf('secondary') < 0 && !colMap['pattern']) colMap['pattern'] = c;
      else if (h.indexOf('archetype') >= 0 && !colMap['archetype']) colMap['archetype'] = c;
      else if (h.indexOf('dominance') >= 0 && !colMap['dominance']) colMap['dominance'] = c;
      else if (h.indexOf('primary') >= 0 && h.indexOf('complex') >= 0 && !colMap['primary']) colMap['primary'] = c;
      else if (h.indexOf('secondary pattern') >= 0 && !colMap['secondarypattern']) colMap['secondarypattern'] = c;
      else if (h.indexOf('secondary driver') >= 0 && !colMap['secondarypct']) colMap['secondarypct'] = c;
      else if (h.indexOf('secondary') >= 0 && h.indexOf('complex') >= 0 && !colMap['secondary']) colMap['secondary'] = c;
      else if ((h.indexOf('birth') >= 0 || h.indexOf('date') >= 0) && h.indexOf('relation') < 0 && !colMap['birthdate']) colMap['birthdate'] = c;
      else if (h.indexOf('age') >= 0 && !colMap['age']) colMap['age'] = c;
      else if ((h.indexOf('sun sign') >= 0 || h.indexOf('zodiac') >= 0 || h.indexOf('sign') >= 0) && !colMap['sunsign']) colMap['sunsign'] = c;
      else if (h.indexOf('relationship') >= 0 && !colMap['relationship']) colMap['relationship'] = c;
      else if (h.indexOf('driver') >= 0 && h.indexOf('secondary') < 0 && !colMap['driverscores']) colMap['driverscores'] = c;
      // Current pain: "challenge" in love/relationships context, NOT "fear" (avoids biggest fear column)
      else if ((h.indexOf('challenge') >= 0 || h.indexOf('current pain') >= 0) && h.indexOf('fear') < 0 && !colMap['currentpain']) colMap['currentpain'] = c;
      // Biggest fear: "fear" in love context, NOT "challenge" (avoids current pain column)
      else if ((h.indexOf('biggest fear') >= 0 || (h.indexOf('fear') >= 0 && h.indexOf('challenge') < 0)) && !colMap['biggestfear']) colMap['biggestfear'] = c;
    }
    // Fallback: if current pain / biggest fear not found by header, use last 2 columns (common form order)
    if (colMap['currentpain'] === undefined && numCols >= 2) colMap['currentpain'] = numCols - 2;
    if (colMap['biggestfear'] === undefined && numCols >= 1) colMap['biggestfear'] = numCols - 1;

    var row = [];
    for (var i = 0; i < numCols; i++) row[i] = '';
    var now = new Date();
    if (colMap['timestamp'] !== undefined) row[colMap['timestamp']] = now;
    if (colMap['name'] !== undefined) row[colMap['name']] = params[ENTRY_NAME] || '';
    if (colMap['email'] !== undefined) row[colMap['email']] = params['entry.1024132954'] || '';
    if (colMap['phone'] !== undefined) row[colMap['phone']] = params['entry.479336729'] || '';
    if (colMap['pattern'] !== undefined) row[colMap['pattern']] = params[ENTRY_PATTERN] || '';
    if (colMap['archetype'] !== undefined) row[colMap['archetype']] = params[ENTRY_ARCHETYPE] || '';
    if (colMap['dominance'] !== undefined) row[colMap['dominance']] = params['entry.2023467530'] || '';
    if (colMap['primary'] !== undefined) row[colMap['primary']] = params[ENTRY_PRIMARY] || '';
    if (colMap['secondary'] !== undefined) row[colMap['secondary']] = params[ENTRY_SECONDARY] || '';
    if (colMap['birthdate'] !== undefined) row[colMap['birthdate']] = params['entry.1276258241'] || '';
    if (colMap['age'] !== undefined) row[colMap['age']] = params['entry.170864257'] || '';
    if (colMap['sunsign'] !== undefined) row[colMap['sunsign']] = params['entry.1863926933'] || '';
    if (colMap['relationship'] !== undefined) row[colMap['relationship']] = params['entry.231449018'] || '';
    if (colMap['driverscores'] !== undefined) row[colMap['driverscores']] = params['entry.1799985826'] || '';
    if (colMap['secondarypattern'] !== undefined) row[colMap['secondarypattern']] = params['entry.2066312398'] || '';
    if (colMap['secondarypct'] !== undefined) row[colMap['secondarypct']] = params['entry.2064418059'] || '';
    if (colMap['currentpain'] !== undefined) row[colMap['currentpain']] = params['entry.1745092026'] || '';
    if (colMap['biggestfear'] !== undefined) row[colMap['biggestfear']] = params['entry.1602083511'] || '';

    formSheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss) return ss;
  if (SPREADSHEET_ID) return SpreadsheetApp.openById(SPREADSHEET_ID);
  throw new Error('Script must be bound to your sheet. Open the sheet → Extensions → Apps Script, then paste this code there. Or set SPREADSHEET_ID at the top.');
}

function getFormResponsesSheet(ss) {
  if (!ss) return null;
  var names = ['Form Responses 1', 'Form Responses', 'Form_Responses'];
  for (var i = 0; i < names.length; i++) {
    var sheet = ss.getSheetByName(names[i]);
    if (sheet) return sheet;
  }
  return null;
}

function onFormSubmit(e) {
  var ss = getSpreadsheet();
  var formSheet = getFormResponsesSheet(ss);
  var feedbackSheet = ss.getSheetByName('Feedback');

  if (!formSheet) return;

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
    var h = String(headers[i]).toLowerCase();
    if (h.indexOf('feedback') >= 0 || h.indexOf('question') >= 0) {
      feedbackCol = i;
      break;
    }
  }
  if (feedbackCol < 0) return;

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
  var ss = getSpreadsheet();
  var formSheet = getFormResponsesSheet(ss);
  if (!formSheet) {
    SpreadsheetApp.getUi().alert('Form responses sheet not found. Look for "Form Responses 1" or "Form Responses".');
    return;
  }

  var feedbackSheet = ss.getSheetByName('Feedback');
  if (!feedbackSheet) {
    feedbackSheet = ss.insertSheet('Feedback');
    feedbackSheet.appendRow(['Timestamp', 'Name', 'Archetype', 'Pattern', 'Primary Complex', 'Secondary Complex', 'Feedback']);
    feedbackSheet.getRange('A1:G1').setFontWeight('bold');
  }

  var data = formSheet.getDataRange().getValues();
  if (data.length < 2) {
    SpreadsheetApp.getUi().alert('No data in Form_Responses.');
    return;
  }

  var headers = data[0];
  var feedbackCol = -1;
  for (var i = 0; i < headers.length; i++) {
    var h = String(headers[i]).toLowerCase();
    if (h.indexOf('feedback') >= 0 || h.indexOf('question') >= 0) {
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
