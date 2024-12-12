"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { emailOnlySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription } from "./ui/alert";
import { ReloadIcon } from "@radix-ui/react-icons";
import { SingleAlertDestructive } from "./ui/SingleAlertDestructive";
import { requestPasswordReset } from "@/actions/tokens";
import { useState } from "react";
const ForgotPasswordForm = () => {
  const form = useForm<z.infer<typeof emailOnlySchema>>({
    resolver: zodResolver(emailOnlySchema),
    defaultValues: {
      email: "",
    },
  });
  const [globalError, setGlobalError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  async function onSubmit(values: z.infer<typeof emailOnlySchema>) {
    const { email } = values;

    try {
      setSuccessMessage("");
      setGlobalError("");
      const response = await requestPasswordReset(email);
      if (response.success) {
        setSuccessMessage(response.message);
        setGlobalError("");
      } else {
        setGlobalError(response.message);
        setSuccessMessage("");
      }
    } catch (error) {
      setGlobalError("Oops, something went wrong. Please try again later.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="johndoe@example.com"
                  {...field}
                  type={"email"}
                />
              </FormControl>
              <FormDescription>
                Enter your email. We will send you a password reset link.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {globalError && <SingleAlertDestructive description={globalError} />}
        {successMessage && (
          <Alert variant="success">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </>
          ) : (
            "Send"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
