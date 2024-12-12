"use server";
import bcrypt from "bcryptjs";
import { emailOnlySchema, passwordsSchema } from "./../schemas/index";
import prisma from "@/lib/db";
import { nanoid } from "nanoid";
import { sendPasswordResetEmail, sendVerificationEmail } from "./mailing";
import { getUserByEmail } from "./userActions";
import { BCRYPT_SALT_ROUNDS } from "@/lib/constants";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const token = await prisma.verificationToken.findFirst({
      where: {
        email,
      },
    });

    if (!token) {
      return null;
    }

    return token;
  } catch (error) {
    return null;
  }
};
export const getVerificationTokenByToken = async (token: string) => {
  try {
    const existingToken = await prisma.verificationToken.findFirst({
      where: {
        token,
      },
    });

    if (!token) {
      return null;
    }

    return existingToken;
  } catch (error) {
    return null;
  }
};

export const generateEmailVerificationToken = async (email: string) => {
  // generate token
  const token = nanoid();

  const expires = new Date(Date.now() + 60 * 60 * 1000); // expires in an hour

  // check if user already has a token

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    // delete existing token

    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // create the token

  const generatedToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return generatedToken;
};

export const generatePasswordResetToken = async (email: string) => {
  // generate token
  const token = nanoid();

  const expires = new Date(Date.now() + 60 * 15 * 1000); // expires 15 minutes from now

  // check if user already has a token

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    // delete existing token

    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // create the token

  const generatedToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return generatedToken;
};

export const requestEmailVerification = async (email: string) => {
  // check if user exists
  const user = await getUserByEmail(email);

  if (!user) {
    return {
      success: false,
      message: "Invalid operation.",
    };
  }

  // user exists, let's generate the token
  const { token } = await generateEmailVerificationToken(email);

  // send the verification email
  try {
    const response = await sendVerificationEmail(
      email,
      token,
      user.username as string
    );

    if (!response.success) {
      return {
        success: false,
        message: response.message,
      };
    } else {
      return {
        success: true,
        message: "Verification email sent",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
};

export const verifyAccount = async (token: string) => {
  // get token from database by token

  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return {
      success: false,
      message: "Invalid token",
    };
  }

  const { email, expires } = existingToken;

  const hasExpired = expires < new Date();

  if (hasExpired) {
    return {
      success: false,
      message: "Token has expired",
    };
  }

  // validate the email address

  const updatedUser = await prisma.user.update({
    where: {
      email,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  // delete the token

  await prisma.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return {
    success: true,
    message: "Email verified Successfully!",
  };
};

export const requestPasswordReset = async (email: string) => {
  // validate input
  const validatedEmail = emailOnlySchema.safeParse({ email });
  if (!validatedEmail.success) {
    return {
      success: false,
      message: "Invalid email address",
    };
  }
  try {
    // check if user exists

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return {
        success: false,
        message: "Invalid operation",
      };
    }
    // generate token

    const { token } = await generatePasswordResetToken(email);

    // send email

    const response = await sendPasswordResetEmail(
      email,
      token,
      existingUser.username as string
    );

    if (!response.success) {
      return {
        success: false,
        message: response.message,
      };
    } else {
      return {
        success: true,
        message: "Password reset email sent",
      };
    }

    // return success
  } catch (error) {
    return {
      success: false,
      message: "Failed to send password reset email",
    };
  }
};

export const resetPassword = async (
  token: string,
  newPassword: string,
  confirmNewPassword: string
) => {
  // check if password conforms to password policy

  const validatedInputs = passwordsSchema.safeParse({
    newPassword,
    confirmNewPassword,
  });

  if (!validatedInputs.success) {
    return {
      success: false,
      message: "Invalid passwords, check the passwords policy",
    };
  }

  try {
    // check if token exists

    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
      return {
        success: false,
        message: "Invalid token",
      };
    }

    // check if token has expired

    const hasExpired = existingToken.expires < new Date();

    if (hasExpired) {
      return {
        success: false,
        message: "Token has expired",
      };
    }
    // hash the new password

    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

    // update the user's password in the database

    const updatedUser = await prisma.user.update({
      where: {
        email: existingToken.email,
      },
      data: {
        password: hashedPassword,
      },
    });

    // delete the token from the database

    if (updatedUser) {
      await prisma.verificationToken.delete({
        where: {
          id: existingToken.id,
        },
      });
      // return success

      return {
        success: true,
        message: "Password reset successfully",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to reset password",
    };
  }
};
