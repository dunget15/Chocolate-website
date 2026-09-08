/**
 * Private Chocolate — Google Apps Script
 * ──────────────────────────────────────
 * SETUP:
 * 1. Create a Google Sheet with headers in Row 1:
 *    Timestamp | Form | Name | Company | Email | Phone | Business Type | Country | Interest | Volume | Message | Language | reCAPTCHA Score
 * 2. Extensions → Apps Script → paste this → Deploy → Web app → "Anyone"
 * 3. Copy URL → paste in analytics.js SHEETS_URL
 *
 * CHANGE THESE:
 */
var NOTIFY_EMAIL = 'info@privatechocolate.com';
var RECAPTCHA_SECRET = 'YOUR_RECAPTCHA_SECRET_KEY';
var SCORE_THRESHOLD = 0.5;
var SHEET_NAME = 'Submissions';

function doPost(e) {
  try {
    var p = e.parameter;

    // ── Verify reCAPTCHA ──
    var score = -1;
    if (p.recaptcha_token && RECAPTCHA_SECRET !== 'YOUR_RECAPTCHA_SECRET_KEY') {
      var resp = UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'post',
        payload: {
          secret: RECAPTCHA_SECRET,
          response: p.recaptcha_token
        }
      });
      var result = JSON.parse(resp.getContentText());
      score = result.score || 0;

      // Block likely bots
      if (!result.success || score < SCORE_THRESHOLD) {
        return ContentService.createTextOutput(
          JSON.stringify({ status: 'blocked', score: score })
        ).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // ── Write to Sheet ──
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
      || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    sheet.appendRow([
      p.timestamp || new Date().toISOString(),
      p.form_type || '',
      p.name || '',
      p.company || '',
      p.email || '',
      p.phone || '',
      p.business_type || '',
      p.country || '',
      p.interest || '',
      p.volume || '',
      p.message || '',
      p.page_lang || '',
      score
    ]);

    // ── Send email ──
    var subject = 'New enquiry from ' + (p.name || 'Website') + ' (' + (p.form_type || 'quote') + ')';
    var body = 'New submission from privatechocolate.com\n\n'
      + 'Type: ' + (p.form_type || '-') + '\n'
      + 'Name: ' + (p.name || '-') + '\n'
      + 'Company: ' + (p.company || '-') + '\n'
      + 'Email: ' + (p.email || '-') + '\n'
      + 'Phone: ' + (p.phone || '-') + '\n'
      + 'Business Type: ' + (p.business_type || '-') + '\n'
      + 'Country/Market: ' + (p.country || '-') + '\n'
      + 'Interest: ' + (p.interest || '-') + '\n'
      + 'Volume: ' + (p.volume || '-') + '\n'
      + 'Message: ' + (p.message || '-') + '\n'
      + 'Language: ' + (p.page_lang || '-') + '\n'
      + 'reCAPTCHA Score: ' + score + '\n'
      + '\nTimestamp: ' + (p.timestamp || new Date().toISOString());

    MailApp.sendEmail(NOTIFY_EMAIL, subject, body);

    return ContentService.createTextOutput(
      JSON.stringify({ status: 'ok', score: score })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('Private Chocolate form endpoint is active.');
}
