// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stackServerApp } from "@/stack/server";

export async function proxy(req: NextRequest) {
  const protectedPaths = ["/home", "/trips", "/dashboard", "/globe"];
  const pathname = req.nextUrl.pathname;

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    // ✅ Use the newer pattern: pass req to the token store or the app instance
    // Stack usually provides a way to bind the request context
    const user = await stackServerApp.getUser({
      tokenStore: req, // In Next.js Middleware, req acts as the token store
    });

    if (!user) {
      const url = new URL("/handler/login", req.url); // Cleaner way to create redirect URLs
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/trips/:path*", "/dashboard/:path*", "/globe"],
};
