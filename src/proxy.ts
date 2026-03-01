// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stackServerApp } from "@/stack/server";

export async function proxy(req: NextRequest) {
  const protectedPaths = ["/trips", "/globe"];
  const pathname = req.nextUrl.pathname;
  console.log("hello tanginamo");
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
    if (user && pathname === "/") {
      return NextResponse.redirect(new URL("/trips", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/trips/:path*", "/globe"],
};
