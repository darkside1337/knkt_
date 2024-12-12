import EmailReminderImage from "@/assets/email-reminder-image";
import EmailVerificationReminderCard from "@/components/email-verification-reminder-card";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import React from "react";
const EmailVerificationReminderPage = async () => {
  return (
    <MaxWidthWrapper className="grid grid-cols-1 lg:grid-cols-2 lg:items-center">
      <div className="lg:min-h-[320px]">
        <EmailVerificationReminderCard />
      </div>
      <div className="hidden lg:grid min-h-[480px] lg:place-items-center">
        <EmailReminderImage width={480} />
      </div>
    </MaxWidthWrapper>
  );
};

export default EmailVerificationReminderPage;
