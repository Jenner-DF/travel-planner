import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import Navbar from "@/components/custom/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import Loading from "./loading";
import NavbarSkeleton from "@/components/custom/NavBarSkeleton";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "Travel Planner",
  description: "Plan your trips with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} antialiased`}>
        <QueryProvider>
          <StackProvider app={stackClientApp}>
            <StackTheme>
              <Toaster position="top-center" />
              <Suspense fallback={<NavbarSkeleton />}>
                <Navbar />
              </Suspense>
              {children}
            </StackTheme>
          </StackProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
