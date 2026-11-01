# Feedback Sheet

Not in use yet: the site currently sends feedback by email (`FEEDBACK_EMAIL` in `site/feedback.js`). Follow the steps below to switch to the Sheet instead.

Answers from the website's "Tell us what you think" form go to a private Google Sheet, "RobotLab feedback", through the Apps Script in [Code.gs](Code.gs). Each answer becomes one row: time received, who (kid, parent, teacher, other), page, the four answers, and an optional grown-up email.

## Set up once

1. Open the "RobotLab feedback" Sheet in Google Drive. Row 1 already has the column names.
2. Extensions > Apps Script. Delete what is there, paste in `Code.gs`, and save.
3. Deploy > New deployment > type: Web app. Execute as: **Me**. Who has access: **Anyone**. Click Deploy and approve the permissions.
4. Copy the Web app URL (ends in `/exec`) into `FEEDBACK_ENDPOINT` at the top of [site/feedback.js](../site/feedback.js), then commit and push.

"Anyone" lets the website send rows to the script; it does not let anyone read the Sheet.

After editing `Code.gs`, use Deploy > Manage deployments > Edit > New version, so the `/exec` URL stays the same.
