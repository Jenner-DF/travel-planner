import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function GlobeSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left Side: Trip Summary Skeleton */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[250px]" /> {/* Title */}
          <Skeleton className="h-4 w-[300px]" /> {/* Subtitle */}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32 rounded-xl" /> {/* Stats Card 1 */}
          <Skeleton className="h-32 rounded-xl" /> {/* Stats Card 2 */}
        </div>
        <Skeleton className="h-[300px] w-full rounded-xl" /> {/* List area */}
      </div>

      {/* Right Side: Globe Container Skeleton */}
      <Card className="bg-neutral-50 border-neutral-200 rounded-2xl p-6">
        <div className="mb-4">
          <Skeleton className="h-8 w-[80%] mb-2" /> {/* Globe Header */}
        </div>

        {/* The Globe Circle */}
        <div className="relative h-[500px] flex items-center justify-center bg-neutral-100 rounded-xl overflow-hidden border border-neutral-100">
          {/* Pulsing Circle to represent the globe */}
          <Skeleton className="h-[400px] w-[400px] rounded-full opacity-50" />
        </div>
      </Card>
    </div>
  );
}
