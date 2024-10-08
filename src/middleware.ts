import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    cookieName: "next-auth.session-token",
    secret: process.env.NEXT_AUTH_SECRET,
  });

  console.log("In middleware", token);

  const url = request.nextUrl;

  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      (url.pathname.startsWith("/verify") &&
        !url.pathname.startsWith("/dashboard")))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (url.pathname.startsWith("/dashboard")) {
    if (!token) return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/dashboard",
    "/dashboard/:path*",
    "/verify/:path*",
  ],
};
