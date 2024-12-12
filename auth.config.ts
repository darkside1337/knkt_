// auth.config.ts
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { type NextAuthConfig } from "next-auth";
import { signInSchema } from "@/schemas";
import { getUserByEmail } from "@/actions/userActions";
import { CustomSignInError } from "@/lib/errors";

// Notice this is only an object, not a full Auth.js instance
export default {
  secret: process.env.AUTH_SECRET,
  providers: [
    /*  Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }), */
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // validate credentials
        const validatedInputs = signInSchema.safeParse({
          email: credentials.email,
          password: credentials.password,
        });

        if (!validatedInputs.success) {
          throw new CustomSignInError("Invalid credentials");
        }

        // check if user exists, return if not
        const { email, password } = validatedInputs.data;

        const user = await getUserByEmail(email);

        if (!user || !user.password) {
          // not specefic for security reasons
          throw new CustomSignInError("Invalid credentials");
        }

        // passwordsMatch check
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          throw new CustomSignInError("Invalid credentials");
        }

        // return user
        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
