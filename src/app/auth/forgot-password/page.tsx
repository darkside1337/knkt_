import ForgotPasswordForm from "@/components/forgot-password-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import React from "react";

const ResetPasswordPage = () => {
  return (
    <Card className="w-[350px]">
      <CardHeader className="text-center">
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Enter your email to reset password</CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
    </Card>
  );
};

export default ResetPasswordPage;
