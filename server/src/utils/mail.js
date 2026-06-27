import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const {
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REFRESH_TOKEN,
  EMAIL_USER
} = process.env;

/**
 * Sends an email using the Gmail OAuth2 API.
 * @param {Object} details
 * @param {string} details.name
 * @param {string} details.email
 * @param {string} details.message
 */
export async function sendEmail({ name, email, message }) {
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN || !EMAIL_USER) {
    throw new Error('Gmail API OAuth2 environment variables are not configured');
  }

  const oAuth2Client = new google.auth.OAuth2(
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oAuth2Client.setCredentials({
    refresh_token: GMAIL_REFRESH_TOKEN
  });

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  const subject = `Lumenscope Contact Form: ${name}`;
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const emailContent = [
    `From: "${name}" <${email}>`,
    `To: ${EMAIL_USER}`,
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    `<p><strong>Name:</strong> ${name}</p>`,
    `<p><strong>Email:</strong> ${email}</p>`,
    `<p><strong>Message:</strong></p>`,
    `<p>${message.replace(/\n/g, '<br>')}</p>`
  ].join('\r\n');

  const encodedMessage = Buffer.from(emailContent)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage
    }
  });
}
