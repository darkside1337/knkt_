import RegisterForm from "@/components/auth/register-form";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { auth } from "../../../../auth";
import { redirect } from "next/navigation";

const RegisterPage = async () => {
  const session = await auth();

  const isAuthenticated = session?.user ? true : false;

  if (isAuthenticated) {
    redirect("/");
  }
  return (
    <MaxWidthWrapper className="lg:grid lg:grid-cols-2 lg:place-items-center">
      <Card className="w-fit">
        <CardHeader>
          <CardTitle className="text-center">Register For KNKT_</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
        <CardFooter className="">
          <p className="text-muted-foreground w-full text-center">
            Already have an account?{" "}
            <Link className="underline hover:text-blue-400" href="/auth/login">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
      <div className="hidden lg:block ">
        <Image
          alt="pattern"
          src="/pattern.webp"
          width="1920"
          height="1080"
          className="bg-white w-full h-full"
          priority={true}
        />
      </div>
    </MaxWidthWrapper>
  );
};

export default RegisterPage;
