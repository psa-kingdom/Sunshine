import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/db";
import { Admin } from "@/db/models/Admin";
import { Teacher } from "@/db/models/Teacher";
import { Student } from "@/db/models/Student";
import { authConfig } from "./auth.config";

// Sanitize AUTH_URL and NEXTAUTH_URL to prevent ERR_INVALID_URL if protocol scheme is missing
if (process.env.AUTH_URL && !process.env.AUTH_URL.startsWith("http://") && !process.env.AUTH_URL.startsWith("https://")) {
  process.env.AUTH_URL = `https://${process.env.AUTH_URL}`;
}
if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.startsWith("http://") && !process.env.NEXTAUTH_URL.startsWith("https://")) {
  process.env.NEXTAUTH_URL = `https://${process.env.NEXTAUTH_URL}`;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "sunshine-public-school-secure-auth-secret-key-2026",
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        console.log("[AUTH_INSTRUMENT] === AUTHORIZE INVOKED ===");
        console.log("[AUTH_INSTRUMENT] Input credentials:", {
          email: credentials?.email,
          role: credentials?.role,
          hasPassword: !!credentials?.password,
        });

        if (!credentials?.email || !credentials?.password) {
          console.log("[AUTH_INSTRUMENT] Early return NULL: Missing email or password credentials");
          return null;
        }

        const email = (credentials.email as string).toLowerCase().trim();
        const password = credentials.password as string;
        const targetRole = (credentials.role as string | undefined)?.toLowerCase().trim();

        let dbConn;
        try {
          dbConn = await connectDB();
          console.log("[AUTH_INSTRUMENT] connectDB() SUCCESS:", {
            host: dbConn?.connection?.host,
            dbName: dbConn?.connection?.name,
            readyState: dbConn?.connection?.readyState,
          });
        } catch (dbError) {
          console.error("[AUTH_INSTRUMENT] connectDB() FAILED with exception:", dbError);
          return null;
        }

        try {
          // Target specific role collection if specified
          if (targetRole === "admin") {
            console.log("[AUTH_INSTRUMENT] Searching Admin collection for email:", email);
            const admin = await Admin.findOne({ email });
            console.log("[AUTH_INSTRUMENT] Admin.findOne() result:", {
              found: !!admin,
              id: admin?._id?.toString(),
              hasPasswordHash: !!admin?.passwordHash,
              hashLength: admin?.passwordHash ? admin.passwordHash.length : 0,
            });

            if (!admin) {
              console.log("[AUTH_INSTRUMENT] Early return NULL: Admin document not found for email:", email);
              return null;
            }

            if (!admin.passwordHash) {
              console.log("[AUTH_INSTRUMENT] Early return NULL: Admin document missing passwordHash");
              return null;
            }

            const isValid = await bcrypt.compare(password, admin.passwordHash);
            console.log("[AUTH_INSTRUMENT] bcrypt.compare() result for admin:", isValid);

            if (isValid) {
              console.log("[AUTH_INSTRUMENT] SUCCESS: Admin credentials verified. Returning user object.");
              return {
                id: admin._id.toString(),
                email: admin.email,
                name: "Administrator",
                role: "admin",
              };
            } else {
              console.log("[AUTH_INSTRUMENT] Early return NULL: bcrypt.compare() returned FALSE for admin");
              return null;
            }
          }

          if (targetRole === "teacher") {
            console.log("[AUTH_INSTRUMENT] Searching Teacher collection for email:", email);
            const teacher = await Teacher.findOne({ email });
            console.log("[AUTH_INSTRUMENT] Teacher.findOne() result:", {
              found: !!teacher,
              id: teacher?._id?.toString(),
              hasPasswordHash: !!teacher?.passwordHash,
            });

            if (!teacher || !teacher.passwordHash) {
              console.log("[AUTH_INSTRUMENT] Early return NULL: Teacher document or passwordHash missing");
              return null;
            }

            const isValid = await bcrypt.compare(password, teacher.passwordHash);
            console.log("[AUTH_INSTRUMENT] bcrypt.compare() result for teacher:", isValid);

            if (isValid) {
              console.log("[AUTH_INSTRUMENT] SUCCESS: Teacher credentials verified.");
              return {
                id: teacher._id.toString(),
                email: teacher.email,
                name: teacher.name,
                role: "teacher",
                employeeId: teacher.employeeId,
                assignedClass: teacher.assignedClass,
              };
            } else {
              console.log("[AUTH_INSTRUMENT] Early return NULL: bcrypt.compare() returned FALSE for teacher");
              return null;
            }
          }

          if (targetRole === "student") {
            console.log("[AUTH_INSTRUMENT] Searching Student collection for email:", email);
            const student = await Student.findOne({ email });
            console.log("[AUTH_INSTRUMENT] Student.findOne() result:", {
              found: !!student,
              id: student?._id?.toString(),
              hasPasswordHash: !!student?.passwordHash,
            });

            if (!student || !student.passwordHash) {
              console.log("[AUTH_INSTRUMENT] Early return NULL: Student document or passwordHash missing");
              return null;
            }

            const isValid = await bcrypt.compare(password, student.passwordHash);
            console.log("[AUTH_INSTRUMENT] bcrypt.compare() result for student:", isValid);

            if (isValid) {
              console.log("[AUTH_INSTRUMENT] SUCCESS: Student credentials verified.");
              return {
                id: student._id.toString(),
                email: student.email,
                name: student.name,
                role: "student",
                rollNumber: student.rollNumber,
                grade: student.grade,
                section: student.section,
              };
            } else {
              console.log("[AUTH_INSTRUMENT] Early return NULL: bcrypt.compare() returned FALSE for student");
              return null;
            }
          }

          // Fallback for general authentication if targetRole is unspecified or unrecognized
          console.log("[AUTH_INSTRUMENT] Fallback role search initiated for email:", email, "targetRole:", targetRole);
          const admin = await Admin.findOne({ email });
          if (admin && admin.passwordHash) {
            const isValid = await bcrypt.compare(password, admin.passwordHash);
            if (isValid) {
              console.log("[AUTH_INSTRUMENT] SUCCESS (fallback): Admin credentials verified.");
              return {
                id: admin._id.toString(),
                email: admin.email,
                name: "Administrator",
                role: "admin",
              };
            }
          }

          const teacher = await Teacher.findOne({ email });
          if (teacher && teacher.passwordHash) {
            const isValid = await bcrypt.compare(password, teacher.passwordHash);
            if (isValid) {
              console.log("[AUTH_INSTRUMENT] SUCCESS (fallback): Teacher credentials verified.");
              return {
                id: teacher._id.toString(),
                email: teacher.email,
                name: teacher.name,
                role: "teacher",
                employeeId: teacher.employeeId,
                assignedClass: teacher.assignedClass,
              };
            }
          }

          const student = await Student.findOne({ email });
          if (student && student.passwordHash) {
            const isValid = await bcrypt.compare(password, student.passwordHash);
            if (isValid) {
              console.log("[AUTH_INSTRUMENT] SUCCESS (fallback): Student credentials verified.");
              return {
                id: student._id.toString(),
                email: student.email,
                name: student.name,
                role: "student",
                rollNumber: student.rollNumber,
                grade: student.grade,
                section: student.section,
              };
            }
          }

          console.log("[AUTH_INSTRUMENT] Early return NULL: Fallback search exhausted with no match.");
          return null;
        } catch (err) {
          console.error("[AUTH_INSTRUMENT] Exception caught during authorize execution:", err);
          return null;
        }
      },
    }),
  ],
});
