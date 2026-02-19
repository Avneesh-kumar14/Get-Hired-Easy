import nodemailer, { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

let transporter;

// Only configure email if credentials are available
if (process.env.EMAIL_USER && process.env.PASS_USER) {
  transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.PASS_USER,
    },
  });
} else {
  console.warn("⚠️  Email credentials not configured. Email sending disabled.");
  transporter = null;
}

export const sendEmail = (to, subject, html) => {
  return new Promise((resolve, reject) => {
    // If email is not configured, just resolve without sending
    if (!transporter) {
      console.log("📧 Email sending disabled. Would have sent to:", to);
      return resolve({ messageId: "disabled", accepted: [to] });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email error:", error.message);
        // Don't reject - just log and resolve to prevent server crash
        resolve({ error: error.message, accepted: [] });
      } else {
        resolve(info);
      }
    });
  });
};
