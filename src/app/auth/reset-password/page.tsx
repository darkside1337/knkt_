import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import PasswordResetForm from "@/components/password-reset-form";

const ResetPasswordPage = () => {
  return (
    <Card className="lg:min-h-[300px] flex flex-col  justify-center">
      <CardHeader className="text-center lg:text-left">
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Please enter your new password</CardDescription>
      </CardHeader>
      <CardContent>
        <PasswordResetForm />
      </CardContent>
    </Card>
  );
};

export default ResetPasswordPage;
