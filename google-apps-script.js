/**
 * Private Chocolate — Google Apps Script
 * ──────────────────────────────────────
 * SETUP:
 * 1. Create Google Sheet → Row 1 headers:
 *    Timestamp | Form | Name | Company | Email | Phone | Business Type | Country | Interest | Volume | Message | Language
 * 2. Extensions → Apps Script → paste this
 * 3. Deploy → New deployment → Web app → "Anyone"
 * 4. Copy URL → paste in analytics.js SHEETS_URL
 */
var NOTIFY_EMAIL = 'info@privatechocolate.com';
var SHEET_NAME = 'Submissions';

function doPost(e) {
  try {
    var p = e.parameter;

    // Honeypot check — if "website" field is filled, it's a bot
    if (p.website && p.website.length > 0) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: 'blocked' })
      ).setMimeType(ContentService.MimeType.JSON);
    }

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
      p.page_lang || ''
    ]);

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
      + '\nTimestamp: ' + (p.timestamp || new Date().toISOString());

    MailApp.sendEmail(NOTIFY_EMAIL, subject, body);

    return ContentService.createTextOutput(
      JSON.stringify({ status: 'ok' })
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
