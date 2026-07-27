import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as { role?: string })?.role;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isTeacherRoute = nextUrl.pathname.startsWith("/teacher");
  const isStudentRoute = nextUrl.pathname.startsWith("/student");
  const isAdminApiRoute = nextUrl.pathname.startsWith("/api/admin");
  const isTeacherApiRoute = nextUrl.pathname.startsWith("/api/teacher");
  const isStudentApiRoute = nextUrl.pathname.startsWith("/api/student");
  const isLoginPage = nextUrl.pathname === "/login" || nextUrl.pathname === "/admin/login";

  // API protection
  if (isAdminApiRoute || isTeacherApiRoute || isStudentApiRoute) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
  }

  // Admin route protection
  if (isAdminRoute && !isLoginPage) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (userRole !== "admin") {
      // Redirect teachers or students to their respective portal if accessing /admin
      const redirectTarget = userRole === "teacher" ? "/teacher" : "/student";
      return NextResponse.redirect(new URL(redirectTarget, nextUrl));
    }
  }

  // Teacher route protection
  if (isTeacherRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (userRole !== "teacher" && userRole !== "admin") {
      return NextResponse.redirect(new URL("/student", nextUrl));
    }
  }

  // Student route protection
  if (isStudentRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (userRole !== "student" && userRole !== "admin") {
      return NextResponse.redirect(new URL("/teacher", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/teacher/:path*",
    "/student/:path*",
    "/api/admin/:path*",
    "/api/teacher/:path*",
    "/api/student/:path*",
  ],
};
