"use server";
import EmailTemplate from "@/components/emails/email-verification-template";
import PasswordResetTemplate from "@/components/emails/password-reset-template";
import { Resend } from "resend";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

const WEBSITE_EMAIL_ADDRESS = "Acme <onboarding@resend.dev>";

const resend = new Resend(RESEND_API_KEY);

export const sendVerificationEmail = async (
  email: string,
  token: string,
  username: string
) => {
  const verificationLink = `${BASE_URL}/auth/verify-email?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: WEBSITE_EMAIL_ADDRESS,
    to: email,
    subject: "Verify your email",
    react: EmailTemplate({
      verificationLink,
      username,
    }),
  });

  if (error) {
    return {
      success: false,
      message: "Failed to send verification email",
    };
  } else {
    return {
      success: true,
      message: "Verification email sent",
    };
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  username: string
) => {
  const resetLink = `${BASE_URL}/auth/reset-password?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: WEBSITE_EMAIL_ADDRESS,
    to: email,
    subject: "Reset your password",
    react: PasswordResetTemplate({
      resetLink,
      username,
    }),
  });

  if (error) {
    return {
      success: false,
      message: "Failed to send reset email",
    };
  } else {
    return {
      success: true,
      message: "Reset email sent",
    };
  }
};
