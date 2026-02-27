import { Skeleton } from "../ui/skeleton";

export default function NavbarSkeleton() {
  return (
    <nav className="w-full border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Skeleton className="h-9 w-36 rounded-md" />

        {/* Menu items */}
        <div className="hidden md:flex items-center gap-6">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>

        {/* Mobile menu button */}
        <Skeleton className="md:hidden h-9 w-9 rounded-full" />
      </div>
    </nav>
  );
}
