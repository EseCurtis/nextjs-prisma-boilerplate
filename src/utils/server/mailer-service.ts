import nodemailer from "nodemailer";
import { ENV } from "../constants";

async function send({ to, subject, text, html }: { to: string; subject: string; text: string; html: string }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return await transporter.sendMail({
    from: `"${process.env.APP_NAME}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  });
}


export const MailerService = {
  send,
  sendTemplate: {
    ACCOUNT_CONFIRMATION_SUCCESS: async ({ email }: { email: string }) => send({
      to: email,
      subject: "Account Confirmation Successful",
      text: `Your account has been successfully confirmed.`,
      html: `<p>Your account has been successfully confirmed.</p>`,
    }),

    WELCOME_USER: async ({ email, firstName }: { email: string; firstName: string }) => send({
      to: email,
      subject: `Welcome to ${ENV.APP_NAME}`,
      text: `Hello ${firstName},\n\nThank you for registering at ${ENV.APP_NAME}. We are excited to have you on board.`,
      html: `<p>Hello ${firstName},</p><p>Thank you for registering at ${ENV.APP_NAME}. We are excited to have you on board.</p>`,
    }),

    ACCOUNT_CONFIRMATION_OTP: async ({ email, otp }: { email: string; otp: number }) => ({
      to: email,
      subject: "Account Confirmation OTP",
      text: `Your OTP for account confirmation is: ${otp}. This OTP will expire in 10 minutes.`,
      html: `<p>Your OTP for account confirmation is: <strong>${otp}</strong>. This OTP will expire in 10 minutes.</p>`,
    })
  }
}