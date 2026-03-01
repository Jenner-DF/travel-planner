"use client";
import TripCard from "@/components/custom/TripCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getUserTrips } from "@/lib/actions/actions";
import Link from "next/link";
import { Plane, MapPin, CalendarDays, MapPinPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { Skeleton } from "@/components/ui/skeleton";

export default function TripsPage() {
  const { data: trips = [], isPending } = useQuery({
    queryKey: ["trips"],
    queryFn: async () => {
      const trips = await getUserTrips();
      return trips ?? []; // ✅ ensures it never returns null/undefined
    },
  });

  const user = useUser();
  // const { data: user, isPending: isPendingUser } = useQuery({
  //   queryKey: ["user"],
  //   queryFn: async () => {
  //     return await getUser();
  //   },
  // });

  if (isPending) {
    return <TripsPageSkeleton />;
  }
  if (!user) redirect("/handler/login");

  if (!trips || trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <h2 className="text-2xl font-semibold">No trips found yet.</h2>
        <p className="text-muted-foreground text-sm">
          Start planning your next journey.
        </p>
        <Link href="/trips/new">
          <Button variant="outline" size="lg">
            + Create New Trip
          </Button>
        </Link>
      </div>
    );
  }

  const upcomingTrips = trips.filter(
    (t) => new Date(t.startDate) > new Date(),
  ).length;

  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-200 border border-neutral-300">
        <div className="relative p-8 sm:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-neutral-900">
              Welcome back, {user.displayName || "Traveler"}
            </h1>
            <p className="text-neutral-600">
              You have <strong>{trips.length}</strong> trip
              {trips.length > 1 ? "s" : ""} planned and{" "}
              <strong>{upcomingTrips}</strong> upcoming.
            </p>
          </div>
          <Link href="/trips/new">
            <Button
              size="lg"
              variant="outline"
              className="border-neutral-500 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all"
            >
              <MapPinPlus /> Add Trip
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all border-neutral-200">
          <CardContent className="flex flex-col items-center justify-center text-center p-6 space-y-2">
            <Plane className="w-7 h-7 text-neutral-700" />
            <p className="text-2xl font-bold text-neutral-900">
              {trips.length}
            </p>
            <p className="text-muted-foreground text-sm">Total Trips</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all border-neutral-200">
          <CardContent className="flex flex-col items-center justify-center text-center p-6 space-y-2">
            <CalendarDays className="w-7 h-7 text-neutral-700" />
            <p className="text-2xl font-bold text-neutral-900">
              {upcomingTrips}
            </p>
            <p className="text-muted-foreground text-sm">Upcoming</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all border-neutral-200">
          <CardContent className="flex flex-col items-center justify-center text-center p-6 space-y-2">
            <MapPin className="w-7 h-7 text-neutral-700" />
            <p className="text-2xl font-bold text-neutral-900">
              {trips.reduce((acc, t) => acc + t.locations.length, 0)}
            </p>
            <p className="text-muted-foreground text-sm">Total Locations</p>
          </CardContent>
        </Card>
      </div>

      {/* Trips Grid */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">
          Your Trips
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="animate-fadeIn border border-neutral-200 rounded-xl hover:shadow-md transition-all"
            >
              <TripCard trip={trip} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TripsPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-10 space-y-10 animate-pulse">
      {/* Header */}
      <div className="rounded-2xl border border-neutral-200 p-8 space-y-4">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-5 w-96" />
        <Skeleton className="h-10 w-40 mt-4" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border border-neutral-200 rounded-xl p-6 space-y-3"
          >
            <Skeleton className="h-6 w-6 mx-auto" />
            <Skeleton className="h-8 w-16 mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
        ))}
      </div>

      {/* Trips Grid */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border border-neutral-200 rounded-xl p-6 space-y-4"
            >
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
