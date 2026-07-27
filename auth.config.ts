import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as Record<string, string>;
        token.role = u.role || "student";
        token.id = u.id || token.sub;
        token.grade = u.grade;
        token.section = u.section;
        token.employeeId = u.employeeId;
        token.rollNumber = u.rollNumber;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const su = session.user as unknown as Record<string, unknown>;
        su.role = token.role;
        su.id = token.id;
        su.grade = token.grade;
        su.section = token.section;
        su.employeeId = token.employeeId;
        su.rollNumber = token.rollNumber;
      }
      return session;
    },
  },
  providers: [],
  secret: process.env.AUTH_SECRET,
};
