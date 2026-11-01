// RobotLab feedback receiver: a Google Apps Script bound to the "RobotLab feedback" Sheet.
// The website's feedback form (site/feedback.js) POSTs here; each answer becomes one row.
// Deploy: Extensions > Apps Script, paste this file, Deploy > New deployment > Web app,
// Execute as: Me, Who has access: Anyone. Put the /exec URL in FEEDBACK_ENDPOINT.

const FIELDS = ['role', 'page', 'built', 'hardest', 'dream', 'more', 'email'];
const MAX_LENGTH = 1000;

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p._gotcha) return reply({ ok: true }); // hidden field: only bots fill it in
  const row = [new Date()].concat(FIELDS.map(name => clean(p[name])));
  if (row.slice(3, 7).every(value => value === '')) return reply({ ok: false, error: 'empty' });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].appendRow(row);
  } finally {
    lock.releaseLock();
  }
  return reply({ ok: true });
}

// Trim, cap length, and stop text that starts with = + - @ from running as a formula.
function clean(value) {
  const text = String(value || '').trim().slice(0, MAX_LENGTH);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
