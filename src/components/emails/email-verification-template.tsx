import React from "react";
import { Button, Tailwind, Head } from "@react-email/components";

interface EmailTemplateProps {
  username: string;
  verificationLink: string;
}

export default function EmailVerificationTemplate({
  username = "",
  verificationLink,
}: EmailTemplateProps) {
  return (
    <Tailwind>
      <div className="font-sans text-base leading-relaxed text-gray-700 max-w-2xl mx-auto p-8">
        <Head>
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold">
              Welcome to{" "}
              <span className="underline underline-offset-8 decoration-8 decoration-blue-400 dark:decoration-blue-600">
                KNKT_
              </span>
              <br /> Login now!
            </h1>
          </header>
        </Head>

        <main>
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Verify Your Email Address
          </h1>

          <p className="mb-4">Hello {username},</p>

          <p className="mb-6">
            Thank you for signing up! We&apos;re excited to have you on board.
            To ensure the security of your account and to start using our
            services, please verify your email address by clicking the button
            below:
          </p>

          <div className="text-center my-8">
            <a href={verificationLink}>
              <button className="shadcn-button max-w-[264px] w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-600 transition-all duration-200">
                Verify My Email
              </button>
            </a>
          </div>

          <p className="mb-4">
            If the button above doesn&apos;t work, you can also copy and paste
            the following link into your browser:
          </p>

          <p className="mb-6 break-all text-blue-600">{verificationLink}</p>

          <p className="text-sm text-gray-600">
            This link will expire in 1 hour for security reasons. If you
            didn&apos;t create an account with us, please ignore this email.
          </p>
        </main>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p className="mb-2">
            This is an automated message, please do not reply to this email. If
            you need assistance, please contact our support team at
            support@KNKT.com
          </p>
          <p>&copy; {new Date().getFullYear()} KNKT_. All rights reserved.</p>
        </footer>
      </div>
    </Tailwind>
  );
}
