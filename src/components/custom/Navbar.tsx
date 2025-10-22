"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Globe, LogInIcon, Menu, Plane } from "lucide-react";
import { signOut } from "@/app/auth/login/actions";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/actions/actions";

export default function Navbar() {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  return (
    <nav className="w-full border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* === Logo + Brand === */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Travel Planner Logo"
            width={36}
            height={36}
            className="rounded-md"
          />
          <span className="text-lg font-semibold tracking-tight text-neutral-900">
            Travel Planner
          </span>
        </Link>

        {/* === Desktop Nav === */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/trips"
            className="text-sm font-medium text-neutral-800 hover:text-neutral-500 transition-colors"
          >
            {user
              ? `${user.user_metadata.full_name?.split(" ")[0]}'s Trips`
              : "My Trips"}
          </Link>

          <Link
            href="/globe"
            className="text-sm font-medium text-neutral-800 hover:text-neutral-500 transition-colors"
          >
            Globe
          </Link>

          {user ? (
            <Button
              variant="outline"
              onClick={async () => await signOut()}
              className="border-neutral-400 text-neutral-800 hover:bg-neutral-900 hover:text-white"
            >
              Sign Out
            </Button>
          ) : (
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="border-neutral-400 text-neutral-800 hover:bg-neutral-900 hover:text-white"
              >
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* === Mobile Nav === */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-64 border-l border-neutral-200"
            >
              <SheetHeader>
                <SheetTitle className="text-lg font-semibold text-neutral-900">
                  Menu
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-4">
                <Link
                  href="/trips"
                  className="flex items-center gap-2 text-neutral-800 hover:text-neutral-500 transition-colors"
                >
                  <Plane className="h-4 w-4" />
                  My Trips
                </Link>

                <Link
                  href="/globe"
                  className="flex items-center gap-2 text-neutral-800 hover:text-neutral-500 transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  Globe
                </Link>

                <SheetClose asChild>
                  {user ? (
                    <Button
                      variant="outline"
                      onClick={async () => await signOut()}
                      className="border-neutral-400 text-neutral-800 hover:bg-neutral-900 hover:text-white"
                    >
                      Sign Out
                    </Button>
                  ) : (
                    <Link href="/auth/login">
                      <Button
                        variant="outline"
                        className="border-neutral-400 text-neutral-800 hover:bg-neutral-900 hover:text-white"
                      >
                        Login
                      </Button>
                    </Link>
                  )}
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
