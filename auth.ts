// auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./src/lib/db";
import authConfig from "./auth.config";
import { getUserByEmail, getUserById } from "@/actions/userActions";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserByEmail(user.email as string);

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) {
        return `/auth/email-verification-reminder?email=${user.email}`;
      }

      // otherwise continue login
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, token }) {
      // persist id username role email emailVerified image on session

      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.displayName = token.displayName;
        session.user.username = token.username;
        session.user.emailVerified = token.emailVerified;
        session.user.image = token.image;
        session.user.email = token.email; // Ensuring this works with the extended session
      }

      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) {
        return token;
      }
      // add id, username, email, emailVerified, image to token
      token.username = existingUser.username;
      token.email = existingUser.email;
      token.emailVerified = existingUser.emailVerified;
      token.displayName = existingUser.displayName;
      token.image = existingUser.image;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.isOAuth = existingUser.isOAuth;
      return token;
    },
  },
  ...authConfig,
});
