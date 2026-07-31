import type { NextAuthConfig } from "next-auth";

// Sanitize AUTH_URL and NEXTAUTH_URL to prevent ERR_INVALID_URL if protocol scheme is missing
if (process.env.AUTH_URL && !process.env.AUTH_URL.startsWith("http://") && !process.env.AUTH_URL.startsWith("https://")) {
  process.env.AUTH_URL = `https://${process.env.AUTH_URL}`;
}
if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.startsWith("http://") && !process.env.NEXTAUTH_URL.startsWith("https://")) {
  process.env.NEXTAUTH_URL = `https://${process.env.NEXTAUTH_URL}`;
}

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
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
        su.role = token.role as string;
        su.id = token.id as string;
        su.grade = token.grade as string;
        su.section = token.section as string;
        su.employeeId = token.employeeId as string;
        su.rollNumber = token.rollNumber as string;
      }
      return session;
    },
  },
  providers: [],
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "sunshine-public-school-secure-auth-secret-key-2026",
};
