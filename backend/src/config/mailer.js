import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

// This module is evaluated before server.js finishes loading its imports.
// Load the backend .env here so SMTP settings are available when the
// transporter is created.
dotenv.config();
dotenv.config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../.env"),
});

const smtpPort = Number(process.env.SMTP_PORT || 587);

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: smtpPort,
  secure: smtpPort === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export const sendPasswordResetCode = ({ to, name, code }) =>
  mailer.sendMail({
    from: {
      name: process.env.SMTP_NAME || "IITS",
      address: process.env.SMTP_FROM || process.env.SMTP_USER,
    },
    to,
    subject: "Your password reset code",
    text: `Hello ${name || "there"},\n\nYour password reset code is ${code}. It expires in 15 minutes.\n\nIf you did not request this, you can safely ignore this email.`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937"><h2>Password reset request</h2><p>Hello ${name || "there"},</p><p>Use the following code to reset your password:</p><p style="font-size:28px;font-weight:700;letter-spacing:8px">${code}</p><p>This code expires in 15 minutes.</p><p>If you did not request this, you can safely ignore this email.</p></div>`,
  });

export const sendStudentNotificationEmail = ({ to, name, subject, message }) =>
  mailer.sendMail({
    from: {
      name: process.env.SMTP_NAME || "IITS",
      address: process.env.SMTP_FROM || process.env.SMTP_USER,
    },
    to,
    subject,
    text: `Hello ${name || "there"},\n\n${message}\n\nIntern & Industrial Training System`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937"><h2>${subject}</h2><p>Hello ${name || "there"},</p><p>${message}</p><p>Intern &amp; Industrial Training System</p></div>`,
  });

export const sendExternalSupervisorAppointmentEmail = ({ to, name, studentName, internalSupervisorName, coordinatorName }) =>
  mailer.sendMail({
    from: { name: process.env.SMTP_NAME || "IITS", address: process.env.SMTP_FROM || process.env.SMTP_USER },
    to,
    subject: `External supervisor appointment – ${studentName}`,
    text: `Hello ${name || "Supervisor"},\n\nYou have been appointed as the external supervisor for ${studentName}. Internal supervisor: ${internalSupervisorName || "To be confirmed"}. Industrial Training Coordinator: ${coordinatorName || "To be confirmed"}.\n\nThank you.`,
  });
