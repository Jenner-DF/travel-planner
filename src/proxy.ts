// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stackServerApp } from "@/stack/server";

export async function proxy(req: NextRequest) {
  const protectedPaths = ["/trips", "/globe"];
  const user = await stackServerApp.getUser({
    tokenStore: req, // In Next.js Middleware, req acts as the token store
  });
  const pathname = req.nextUrl.pathname;
  console.log("ta");
  if (user && pathname === "/") {
    return NextResponse.redirect(new URL("/trips", req.url));
  }
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!user) {
      const url = new URL("/handler/login", req.url); // Cleaner way to create redirect URLs
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/trips", "/trips/:path*", "/globe"],
};
