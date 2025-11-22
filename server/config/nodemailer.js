import nodemailer, { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.PASS_USER,
  },
});

export const sendEmail = (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      reject(error);
    } else {
      resolve(info);
    }
  });
};
