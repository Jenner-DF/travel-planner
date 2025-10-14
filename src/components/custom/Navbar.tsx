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
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { signOut } from "@/app/auth/login/actions";

export default function Navbar() {
  const supabase = createClient();
  const [user, setUser] = useState<unknown>(null);

  useEffect(() => {
    // get user on mount
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // subscribe to login/logout events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);
  console.log(user);
  return (
    <nav className="w-full border-b bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo + Title */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          <span className="text-xl font-bold tracking-tight">
            Travel Planner
          </span>
        </Link>

        {/* Right: Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/trips" className="font-medium hover:text-primary">
            {user
              ? `${user.user_metadata.full_name.split(" ")[0]}'s trips `
              : "My Trips"}
          </Link>
          <Link href="/globe" className="font-medium hover:text-primary">
            Globe
          </Link>
          <Button asChild>
            {user ? (
              <Button onClick={async () => await signOut()}>Sign out</Button>
            ) : (
              <Link href="/auth/login">Login</Link>
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="lg">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4 px-4">
                <Link
                  href="/trips"
                  className="flex items-center gap-2 font-medium hover:text-primary"
                >
                  <Plane className="h-4 w-4" />
                  My Trips
                </Link>

                <Link
                  href="/globe"
                  className="flex items-center gap-2 font-medium hover:text-primary"
                >
                  <Globe className="h-4 w-4" />
                  Globe
                </Link>

                <SheetClose asChild>
                  {user ? (
                    <Button onClick={async () => await signOut()}>
                      Sign out
                    </Button>
                  ) : (
                    <Button>
                      <Link href="/auth/login">Login</Link>
                    </Button>
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
