# Mailer (Brevo)

If you want to use Brevo (formerly Sendinblue) as the email provider instead of SMTP, set the following environment variables in your deployment or `.env` file:

- `MAILER_PROVIDER=brevo` # set to `smtp` to use the existing SMTP transporter
- `BREVO_API_KEY` = your Brevo API key
- `BREVO_SENDER` = the sender email address (optional — falls back to `SMTP_FROM`)
- `BREVO_SENDER_NAME` = the sender name (optional)

The backend exposes a simple endpoint to trigger a resend via the configured provider:

- `POST /mailer/resend` with JSON body `{ "to": "user@example.com", "subject": "...", "text": "...", "html": "..." }`

Notes:

- The service will default to `smtp` if `MAILER_PROVIDER` is not set.
- For `smtp`, configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM` as before.
