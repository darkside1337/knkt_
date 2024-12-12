import { User as NextAuthUser, DefaultSession } from "next-auth";
import { Role, emailVerified } from "@prisma/client";
import { JWT } from "next-auth/jwt";

interface User extends NextAuthUser {
  id: string;
  role: Role;
  displayName: string | null;
  username: string | null;
  email: string;
  emailVerified: emailVerified;
  image: string | null;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
      displayName: string | null;
      username: string | null;
      email: string;
      emailVerified: emailVerified;
      image: string | null;
      isTwoFactorEnabled: boolean;
      isOAuth: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    username: string | null;
    email: string;
    emailVerified: emailVerified;
    displayName: string | null;
    image: string | null;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
  }
}
