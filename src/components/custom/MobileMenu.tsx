// MobileMenu.tsx
"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Plane, Globe, LogOut, Settings, LogIn } from "lucide-react";
import Link from "next/link";
import { useUser } from "@stackframe/stack";
import { ElementType } from "react";
import { toast } from "sonner";
type NavLink = {
  href: string;
  icon: ElementType; // Component reference (Globe, Plane, etc.)
  displayName: string;
};
function mobileLink({ href, displayName, icon: Icon }: NavLink) {
  return (
    <Link
      key={href}
      href={href}
      className="p-2 justify-end active:bg-neutral-200 font-semibold  flex items-center gap-2 text-neutral-800 hover:text-neutral-500 transition-colors"
    >
      {displayName}
      <Icon className="h-4 w-4" />
    </Link>
  );
}
const links: NavLink[] = [
  { href: "/globe", icon: Globe, displayName: "Globe" },
  { href: "/trips", icon: Plane, displayName: "My Trips" },
  {
    href: "/handler/account-settings",
    icon: Settings,
    displayName: "Account Settings",
  },
];
export default function MobileMenu() {
  const user = useUser();
  console.log(user);
  const handleSignOut = async () => {
    try {
      await user?.signOut(); // or your stackClient signOut method
      console.log("Signed out!");
      toast.success("Log out successfully");
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-48 border-l border-neutral-200">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold text-neutral-900">
            Menu
          </SheetTitle>
        </SheetHeader>

        <div className=" flex flex-col gap-1">
          {/* Trips Link */}
          {links.map((link) => mobileLink(link))}
          {/* User Button */}
          <SheetClose asChild>
            {user ? (
              <Button
                onClick={handleSignOut}
                className="font-semibold justify-end rounded-none"
              >
                Sign out
                <LogOut className="h-4 w-4" />
              </Button>
            ) : (
              mobileLink({
                href: "/handler/login",
                displayName: "Sign in",
                icon: LogIn,
              })
            )}
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
