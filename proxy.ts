// src/middleware/checkAuthExpired.ts
import { NextResponse } from "next/server";
import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  async function proxy(request: NextRequestWithAuth) {
    const pathname = request.nextUrl.pathname;
    const userRole = request.nextauth.token?.role;

    // 3. redirect ถ้า user ไม่ login และเข้าหน้า admin
    if (!request.nextauth.token && pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 4. redirect ถ้า user login แต่เข้าหน้า login/register
    if (request.nextauth.token && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 5. ตรวจ role จาก token
    if (pathname.startsWith("/admin") && userRole?.toLocaleLowerCase() !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: { authorized: ({ token }) => !!token },
    pages: { signIn: "/login" },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/login", "/changepassword", "/historytopup", "/historybuy"],
};
