// src/lib/utils/email.ts

import nodemailer from 'nodemailer';
import { ContactSubmission } from '@/lib/db/contact';

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // This should be an App Password from Google
  },
});

export async function sendContactNotification(submission: ContactSubmission) {
  const emailBody = `
    New Contact Form Submission

    From: ${submission.name} (${submission.email})
    Category: ${submission.category}
    Subject: ${submission.subject}

    Message:
    ${submission.message}

    ${submission.accountEmail ? `Account Email: ${submission.accountEmail}` : ''}
    ${submission.transactionId ? `Transaction ID: ${submission.transactionId}` : ''}

    Submitted: ${submission.timestamp.toLocaleString()}
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'smartaicopy@upperleftai.com',
    subject: `[SmartAICopy Contact] ${submission.subject}`,
    text: emailBody,
  };

  await transporter.sendMail(mailOptions);
}