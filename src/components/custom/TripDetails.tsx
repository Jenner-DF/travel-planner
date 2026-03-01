"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Calendar } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { differenceInDays, isBefore, isAfter } from "date-fns";
import { TripWithLocations } from "@/lib/types/types";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import SortableItinerary from "./SortableItinerary";
import { useQuery } from "@tanstack/react-query";
import { getUserTripWithLocations } from "@/lib/actions/actions";

const MapWithPins = dynamic(() => import("@/components/custom/MapWithPins"), {
  ssr: false,
});

export default function TripDetails({ tripId }: { tripId: string }) {
  const { data: trip } = useQuery({
    queryKey: ["trip", tripId],
    queryFn: () => getUserTripWithLocations(tripId),
  });

  if (!trip)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading trip...
      </div>
    );
  // return <div>{JSON.stringify(trip)}</div>;
  const today = new Date();
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);

  const getTripStatus = () => {
    if (isAfter(today, end))
      return <span className="text-red-500 font-medium">Trip ended</span>;
    if (isBefore(today, start)) {
      const daysLeft = differenceInDays(start, today);
      return (
        <span className="text-blue-500 font-medium">
          Starts in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
        </span>
      );
    }
    const daysLeft = differenceInDays(end, today);
    return (
      <span className="text-green-500 font-medium">
        Ongoing ({daysLeft} day{daysLeft !== 1 ? "s" : ""} left)
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Cover Image */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-md">
        <Image
          src={trip.imageUrl}
          alt={trip.title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <Link href="/trips">
        <Button variant="ghost" className="mb-2">
          ← Back to Trips
        </Button>
      </Link>
      {/* Trip Header Card */}
      <Card className="border-0 shadow-sm bg-muted/20">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-3xl font-bold">{trip.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1 text-sm">
              <Calendar className="h-4 w-4" />
              {new Date(trip.startDate).toLocaleDateString()} —{" "}
              {new Date(trip.endDate).toLocaleDateString()}
            </CardDescription>
          </div>

          <Link href={`/trips/${trip.id}/itinerary/new`}>
            <Button>Add Location</Button>
          </Link>
        </CardHeader>
      </Card>

      {/* Tabs Section */}
      <Card className="border-0 shadow-sm">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-xl bg-muted/40 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="md:p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* LEFT SIDE: Trip Summary */}
                <div className="space-y-6">
                  <div className="border rounded-xl p-5 bg-muted/10">
                    <h2 className="text-xl font-semibold mb-2">{trip.title}</h2>
                    <p className="text-muted-foreground mb-3">
                      {trip.description}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      {getTripStatus()}
                      <span className="text-sm text-muted-foreground">
                        {new Date(trip.startDate).toLocaleDateString()} —{" "}
                        {new Date(trip.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="border rounded-xl p-5 bg-muted/10">
                    <h3 className="font-semibold mb-3">📍 Locations</h3>
                    {trip.locations.length > 0 ? (
                      <ul className="space-y-1">
                        {trip.locations.map((loc) => (
                          <li key={loc.id}>
                            <span className="font-medium">
                              {loc.locationTitle}
                            </span>{" "}
                            <span className="text-muted-foreground text-sm">
                              — {loc.address}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No locations added yet.
                      </p>
                    )}
                  </div>
                </div>

                {/* RIGHT SIDE: Map */}
                <Card className="w-full h-[400px] lg:h-[600px] p-0 overflow-hidden">
                  <CardContent className="p-0 h-full">
                    <MapWithPins locations={trip.locations} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Itinerary Tab */}
          <TabsContent value="itinerary">
            <div className="p-4 sm:p-6">
              {trip.locations.length === 0 ? (
                <div className="text-center space-y-3">
                  <p className="text-muted-foreground">
                    No locations added yet.
                  </p>
                  <Link href={`/trips/${trip.id}/itinerary/new`}>
                    <Button>Add Location</Button>
                  </Link>
                </div>
              ) : (
                <SortableItinerary locations={trip.locations} tripId={tripId} />
              )}
            </div>
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map">
            <Card className="w-full h-[400px] lg:h-[600px] p-0 overflow-hidden">
              <CardContent className="p-0 h-full">
                <MapWithPins locations={trip.locations} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
