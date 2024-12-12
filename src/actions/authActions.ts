"use server";

import { registrationSchema, signInSchema } from "@/schemas";
import prisma from "../lib/db";
import bcrypt from "bcryptjs";
import { ApiResponse, UserData } from "@/types";
import { signIn, signOut } from "../../auth";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/routes";
import { getUserByEmail } from "./userActions";
import { redirect } from "next/navigation";
import { BCRYPT_SALT_ROUNDS } from "@/lib/constants";

export async function registerUser(
  formData: FormData
): Promise<ApiResponse<UserData>> {
  const validatedData = registrationSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedData.success) {
    return {
      success: false,
      errors: Object.entries(validatedData.error.flatten().fieldErrors).map(
        ([, message]) => ({
          type: "VALIDATION_ERROR",
          message: message.join(", "),
        })
      ),
    };
  }

  const { username, email, password } = validatedData.data;

  try {
    // check if email or username already exists

    const userExists = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            username,
          },
        ],
      },
    });

    if (userExists) {
      const message =
        userExists.email === email
          ? "Email already exists"
          : "Username already exists";

      return {
        success: false,
        errors: [
          {
            type: "GENERAL_ERROR",
            message,
          },
        ],
      };
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      data: {
        id: newUser.id,
        username: newUser.username as string,
        email: newUser.email,
      },
    };
  } catch (error) {
    return {
      success: false,
      errors: [
        {
          type: "DATABASE_ERROR",
          message: "Oops, something went wrong",
        },
      ],
    };
  }
}

export async function signInUser(formData: FormData, redirectPath?: string) {
  const validatedData = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  const { email, password } = validatedData.data;
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      redirectTo: redirectPath || DEFAULT_LOGIN_REDIRECT,
    });
    return {
      success: true,
      message: "Successful login, redirecting",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          redirect(`/auth/login?error=CredentialsSignin&code=${error.code}`);
        default:
          return {
            success: false,
            message: "An error occurred. Please try again later.",
          };
      }
    }
    throw error;
  }
}

export async function logOutUserAction() {
  await signOut({
    redirect: true,
    redirectTo: "/auth/login",
  });
}
