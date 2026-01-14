// Appwrite Function: Welcome Email
// This function would be deployed to Appwrite.
import { Client, Users } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  // 1. Parse Event Payload (if triggered by Event)
  // For 'users.create', the payload is the user object.
  let user = {};
  try {
    user = JSON.parse(req.body);
  } catch (e) {
    error(e);
  }

  log(`Sending welcome email to ${user.email || "test user"}...`);
  // 2. Initialize Appwrite Client (if needed for DB or other actions)
  // To send email via Appwrite, usually we use third party provider (SendGrid, Mailgun

  // Here we simulate sending an email.
  console.log(`[STUB] Email sent to ${user.email}`);

  // Use 3rd party API or Appwrite Messaging

  return res.json({ success: true, message: "Welcome email sent." });
};
