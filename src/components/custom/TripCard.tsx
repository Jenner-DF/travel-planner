import { Trip } from "@/generated/prisma";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

export default function TripCard({ trip }: { trip: Trip }) {
  const start = new Date(trip.startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const end = new Date(trip.endDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/trips/${trip.id}`} className="block group">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={trip.imageUrl}
            alt={trip.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardHeader className="p-4">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {trip.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 text-sm text-muted-foreground">
          <p className="line-clamp-2 mb-2">{trip.description}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <CalendarDays size={14} />
            <span>
              {start} – {end}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
