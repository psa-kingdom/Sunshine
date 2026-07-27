import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/db";
import { Admin } from "@/db/models/Admin";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = (credentials.email as string).toLowerCase().trim();
        const password = credentials.password as string;

        await connectDB();

        const admin = await Admin.findOne({ email });
        if (!admin || !admin.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(password, admin.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: admin._id.toString(),
          email: admin.email,
          role: admin.role || "admin",
        };
      },
    }),
  ],
});
