"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Form,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { SingleAlertDestructive } from "./ui/SingleAlertDestructive";
import { Alert, AlertDescription } from "./ui/alert";
import { ReloadIcon } from "@radix-ui/react-icons";
import { passwordsSchema } from "@/schemas";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { resetPassword } from "@/actions/tokens";
import { useToast } from "@/hooks/use-toast";

const PasswordResetForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { toast } = useToast();
  const [globalError, setGlobalError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const router = useRouter();
  const form = useForm<z.infer<typeof passwordsSchema>>({
    resolver: zodResolver(passwordsSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof passwordsSchema>) {
    setGlobalError("");
    setSuccessMessage("");
    try {
      const { newPassword, confirmNewPassword } = values;
      const response = await resetPassword(
        token,
        newPassword,
        confirmNewPassword
      );

      if (response.success) {
        toast({
          title: "Success",
          description: "You will be redirected to the login page shortly",
          variant: "success",
        });
        setSuccessMessage(response.message);

        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } else {
        setGlobalError(response.message);
      }
    } catch (error) {
      setGlobalError("Oops, something went wrong. Please try again later.");
    }
  }

  const [passwordFieldsVisibility, setPasswordFieldsVisibility] = useState<
    "hidden" | "text"
  >("hidden");

  const togglePasswordVisibility = () => {
    setPasswordFieldsVisibility(
      passwordFieldsVisibility === "hidden" ? "text" : "hidden"
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {globalError && <SingleAlertDestructive description={globalError} />}
        {successMessage && (
          <Alert variant="success">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="*****"
                    type={
                      passwordFieldsVisibility === "text" ? "text" : "password"
                    }
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={togglePasswordVisibility}
                    aria-label={
                      passwordFieldsVisibility === "hidden"
                        ? "Show password"
                        : "Hide password"
                    }
                  >
                    {passwordFieldsVisibility === "hidden" ? (
                      <FaRegEye size={25} />
                    ) : (
                      <FaRegEyeSlash
                        size={25}
                        className="text-muted-foreground"
                      />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormDescription className="sr-only">
                This is your new password.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm new password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="*****"
                    type={
                      passwordFieldsVisibility === "text" ? "text" : "password"
                    }
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={togglePasswordVisibility}
                    aria-label={
                      passwordFieldsVisibility === "hidden"
                        ? "Show password"
                        : "Hide password"
                    }
                  >
                    {passwordFieldsVisibility === "hidden" ? (
                      <FaRegEye size={25} />
                    ) : (
                      <FaRegEyeSlash
                        size={25}
                        className="text-muted-foreground"
                      />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormDescription className="sr-only">
                Confirm your new password.
              </FormDescription>
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
            "Confirm New Password"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PasswordResetForm;
