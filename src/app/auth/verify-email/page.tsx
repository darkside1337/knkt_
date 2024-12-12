import { verifyAccount } from "@/actions/tokens";
import ErrorImage from "@/assets/error-image";
import SuccessImage from "@/assets/success-image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";

async function EmailVerificationPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const token = searchParams.token || "";

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invalid verification token. Please try again.</CardTitle>
          <CardDescription>
            If this error persists, please contact support.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorImage width={200} className="mx-auto" />
          <Button asChild>
            <a href="/auth/login" className="w-full h-full mt-8">
              Try Again
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const response = await verifyAccount(token);

  const success = response.success;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {success
            ? "Email verified successfully!"
            : "Email verification failed"}
        </CardTitle>
        <CardDescription>{response.message}</CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <>
            <SuccessImage width={200} className="mx-auto" />
            <Button asChild>
              <a href="/auth/login" className="w-full h-full mt-8">
                Login
              </a>
            </Button>
          </>
        ) : (
          <>
            <ErrorImage width={200} className="mx-auto" />
            <Button asChild>
              <a href="/auth/login" className="w-full h-full mt-8">
                Try Again
              </a>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
export default EmailVerificationPage;
