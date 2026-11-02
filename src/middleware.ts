import { NextRequest, NextResponse } from "next/server";

// Lightweight gate: redirects when no session cookie exists.
// Tokens are fully verified in API routes and server pages via getSession().
export function middleware(req: NextRequest) {
  const has = req.cookies.has("mca_token");
  if (!has) return NextResponse.redirect(new URL("/login", req.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/portfolio/:path*", "/faculty/:path*", "/subjects/:path*",
    "/faculty-feedback/:path*", "/course-feedback/:path*", "/general-feedback/:path*",
    "/feedback-history/:path*", "/notifications/:path*", "/support/:path*", "/api/profile"],
};
