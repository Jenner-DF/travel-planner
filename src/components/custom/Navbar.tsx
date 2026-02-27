import Image from "next/image";
import Link from "next/link";
// import { signOut } from "@/app/auth/login/actions";
// import { useQuery } from "@tanstack/react-query";
import { UserButton } from "@stackframe/stack";
import { stackServerApp } from "@/stack/server";
import MobileMenu from "./MobileMenu";
// import { getUser } from "@/lib/actions/actions";

export default async function Navbar() {
  // const user = useUser();
  const user = await stackServerApp.getUser();
  // const { data: user } = useQuery({
  //   queryKey: ["user"],
  //   queryFn: getUser,
  // });

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
            {user ? `${user.displayName}'s Trips` : "My Trips"}
          </Link>

          <Link
            href="/globe"
            className="text-sm font-medium text-neutral-800 hover:text-neutral-500 transition-colors"
          >
            Globe
          </Link>

          <UserButton />
        </div>

        {/* === Mobile Nav === */}
        <div className="md:hidden">
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}
