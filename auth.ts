import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/db";
import { Admin } from "@/db/models/Admin";
import { Teacher } from "@/db/models/Teacher";
import { Student } from "@/db/models/Student";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
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
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = (credentials.email as string).toLowerCase().trim();
        const password = credentials.password as string;
        const targetRole = (credentials.role as string | undefined)?.toLowerCase().trim();

        try {
          await connectDB();
        } catch (dbError) {
          console.error("[auth] Database connection error during authorize:", dbError);
          return null;
        }

        try {
          // Target specific role collection if specified for optimal performance and role accuracy
          if (targetRole === "admin") {
            const admin = await Admin.findOne({ email });
            if (admin && admin.passwordHash) {
              const isValid = await bcrypt.compare(password, admin.passwordHash);
              if (isValid) {
                return {
                  id: admin._id.toString(),
                  email: admin.email,
                  name: "Administrator",
                  role: "admin",
                };
              }
            }
            return null;
          }

          if (targetRole === "teacher") {
            const teacher = await Teacher.findOne({ email });
            if (teacher && teacher.passwordHash) {
              const isValid = await bcrypt.compare(password, teacher.passwordHash);
              if (isValid) {
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
            return null;
          }

          if (targetRole === "student") {
            const student = await Student.findOne({ email });
            if (student && student.passwordHash) {
              const isValid = await bcrypt.compare(password, student.passwordHash);
              if (isValid) {
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
            return null;
          }

          // Fallback for general authentication if no target role provided
          const admin = await Admin.findOne({ email });
          if (admin && admin.passwordHash) {
            const isValid = await bcrypt.compare(password, admin.passwordHash);
            if (isValid) {
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

          return null;
        } catch (err) {
          console.error("[auth] Error during credentials authorize execution:", err);
          return null;
        }
      },
    }),
  ],
});
