import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-6 py-20 animate-pulse">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 mb-24">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-full mx-auto" />
        <Skeleton className="h-6 w-5/6 mx-auto" />
        <Skeleton className="h-12 w-40 mx-auto mt-4" />
      </section>

      {/* Features Section */}
      <section>
        <Skeleton className="h-10 w-64 mx-auto mb-12" />

        <div className="grid gap-10 md:grid-cols-3 text-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-4 flex flex-col items-center">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-4 w-48" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
