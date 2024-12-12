import { LoginForm } from "@/components/auth/login-form";
import React from "react";
import Image from "next/image";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";

const LoginPage = async () => {
  const session = await auth();

  const isAuthenticated = session?.user ? true : false;

  if (isAuthenticated) {
    redirect("/");
  }

  return (
    <MaxWidthWrapper>
      <div className="w-full lg:grid lg:grid-cols-2 ">
        <LoginForm />
        <div className="hidden bg-muted lg:block">
          <Image
            src="/pattern.webp"
            alt="Image"
            width="1920"
            height="1080"
            className="h-full w-full object-cover"
            priority={true}
          />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default LoginPage;
