"use client";

import { Trip } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarDays, Trash2 } from "lucide-react";
import { useDeleteTrip } from "@/lib/actions/hooks";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function TripCard({ trip }: { trip: Trip }) {
  const { mutate: deleteTrip, isPending: isPendingDeleteTrip } =
    useDeleteTrip();

  const start = new Date(trip.startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const end = new Date(trip.endDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const handleDelete = () => {
    deleteTrip(trip.id, {
      onSuccess: () => toast.success("Trip deleted successfully!"),
      onError: () => toast.error("Failed to delete trip."),
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 relative group py-0">
      {/* 🗑️ Delete Button */}
      <div className="absolute top-3 right-3 z-20">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              disabled={isPendingDeleteTrip}
            >
              <Trash2 size={16} />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this trip?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. All locations under this trip will
                also be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* 👇 Make only this area clickable */}
      <Link href={`/trips/${trip.id}`} className="block">
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
      </Link>
    </Card>
  );
}
