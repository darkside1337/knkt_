"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { verificationLinkSchema } from "@/schemas";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { requestEmailVerification } from "@/actions/tokens";
import { useEffect, useState } from "react";
import { SingleAlertDestructive } from "./ui/SingleAlertDestructive";
import { Alert, AlertDescription } from "./ui/alert";
import { ReloadIcon } from "@radix-ui/react-icons";

const EmailVerificationReminderCard = () => {
  const searchParams = useSearchParams();
  const targetEmail = searchParams.get("email") || "";
  const [globalError, setGlobalError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const form = useForm<z.infer<typeof verificationLinkSchema>>({
    resolver: zodResolver(verificationLinkSchema),
    defaultValues: {
      email: targetEmail,
    },
  });

  // send email verification on page load
  useEffect(() => {
    if (targetEmail === "") return;
    const executeRequest = async () =>
      await requestEmailVerification(targetEmail);

    executeRequest();
  }, [targetEmail]);

  // resend email verification on button press

  async function onSubmit(values: z.infer<typeof verificationLinkSchema>) {
    setGlobalError("");
    setSuccessMessage("");
    try {
      const response = await requestEmailVerification(values.email);

      if (!response.success) {
        setGlobalError(response.message);
      } else {
        setSuccessMessage(response.message);
      }
    } catch (error) {
      setGlobalError("Oops, something went wrong. Please try again later.");
    }
  }

  return (
    <Card className="lg:min-h-[300px] flex flex-col  justify-center">
      <CardHeader className="text-center lg:text-left">
        <CardTitle>Please verify your email</CardTitle>
        <CardDescription>
          We have sent an email to{" "}
          <span className="font-bold">{targetEmail}. </span>
          Please verify your email to continue using our services.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {globalError && (
              <SingleAlertDestructive description={globalError} />
            )}
            {successMessage && (
              <Alert variant="success">
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="shadcn"
                      {...field}
                      type="hidden"
                      value={targetEmail}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Resend verification link"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EmailVerificationReminderCard;
