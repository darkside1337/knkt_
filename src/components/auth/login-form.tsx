"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../ui/form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { ReloadIcon } from "@radix-ui/react-icons";
import { signInUser } from "@/actions/authActions";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { SingleAlertDestructive } from "../ui/SingleAlertDestructive";

export const description =
  "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image.";

export function LoginForm() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("code") || "";
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [passwordFieldsVisibility, setPasswordFieldsVisibility] = useState<
    "hidden" | "text"
  >("hidden");

  const togglePasswordVisibility = () => {
    setPasswordFieldsVisibility(
      passwordFieldsVisibility === "hidden" ? "text" : "hidden"
    );
  };

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    try {
      const response = await signInUser(formData);
    } catch (error) {
      console.log("Error occurred", error);
    }
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">
            Welcome to{" "}
            <span className="underline underline-offset-8 decoration-8 decoration-blue-400 dark:decoration-blue-600">
              KNKT_
            </span>
            <br /> Login now!
          </h1>
          <p className="text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            {errorCode && <SingleAlertDestructive description={errorCode} />}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel />
                  <FormControl>
                    <Input placeholder="johndoe@gmail.com" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel />
                  <FormControl>
                    {/* Your form field */}
                    <div className="relative">
                      <Input
                        placeholder="******"
                        type={
                          passwordFieldsVisibility === "hidden"
                            ? "password"
                            : "text"
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
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="text-center text-sm">
              Forgot your password?{" "}
              <Link href="/auth/forgot-password" className="underline">
                Click here
              </Link>{" "}
              to reset it
            </p>

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Please
                  wait
                </>
              ) : (
                "Login"
              )}
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
