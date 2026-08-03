import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import { APP_URL } from "@/lib/url";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  try {
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
        return NextResponse.redirect(new URL("/login", APP_URL));
      }
      if (userRole !== "admin") {
        const redirectTarget = userRole === "teacher" ? "/teacher" : "/student";
        return NextResponse.redirect(new URL(redirectTarget, APP_URL));
      }
    }

    // Teacher route protection
    if (isTeacherRoute) {
      if (!isLoggedIn) {
        return NextResponse.redirect(new URL("/login", APP_URL));
      }
      if (userRole !== "teacher" && userRole !== "admin") {
        return NextResponse.redirect(new URL("/student", APP_URL));
      }
    }

    // Student route protection
    if (isStudentRoute) {
      if (!isLoggedIn) {
        return NextResponse.redirect(new URL("/login", APP_URL));
      }
      if (userRole !== "student" && userRole !== "admin") {
        return NextResponse.redirect(new URL("/teacher", APP_URL));
      }
    }

    return NextResponse.next();
  } catch (err) {
    console.error("[middleware] Error during execution:", err);
    return NextResponse.next();
  }
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
