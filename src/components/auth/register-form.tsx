"use client";
import { registrationSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { z } from "zod";
import { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { registerUser } from "@/actions/authActions";
import { useToast } from "@/hooks/use-toast";
import { AlertDestructive } from "../ui/error-alert";
import { ApiError } from "@/types";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

//

const RegisterForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [globalErrors, setGlobalErrors] = useState<ApiError[]>([]);
  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
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

  async function onSubmit(values: z.infer<typeof registrationSchema>) {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("confirmPassword", values.confirmPassword);

    try {
      const response = await registerUser(formData);

      if (response.success) {
        setGlobalErrors([]);
        toast({
          title: "Registration successful",
          description: "You will be redirected to the login page",
          variant: "success",
        });

        // redirect after 3 seconds
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } else {
        const { errors } = response;
        setGlobalErrors(errors);
      }
    } catch (error) {
      setGlobalErrors([
        {
          type: "GENERAL_ERROR",
          message: "An error occurred. Please try again later.",
        },
      ]);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 w-[350px] "
      >
        {globalErrors.length !== 0 && (
          <AlertDestructive errors={globalErrors} />
        )}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription className="sr-only">
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="johndoe@email.com" {...field} />
              </FormControl>
              <FormDescription className="sr-only">
                This is your email address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
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
                This is your password.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
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
                Confirm your password
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
