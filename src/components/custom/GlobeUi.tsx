"use client";

import { getUserTrips } from "@/lib/actions/actions";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef, useEffect, useMemo, useState } from "react";
import type { GlobeMethods } from "react-globe.gl";
import TripSummary from "./TripSummary";
import { Skeleton } from "../ui/skeleton";
import GlobeSkeleton from "./GlobeSkeleton";

const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-[400px] rounded-full" />,
});

export default function GlobeUi() {
  const { data: trip, isLoading } = useQuery({
    queryKey: ["trips"],
    queryFn: () => getUserTrips(),
  });

  const [visitedCountries, setVisitedCountries] = useState<Set<string>>(
    new Set(),
  );
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const locations = useMemo(
    () => trip?.flatMap((t) => t.locations) ?? [],
    [trip],
  ); // memoize to avoid changing reference on every render

  useEffect(() => {
    if (locations.length === 0) return;

    const countries = locations
      .map((loc) => loc.address?.split(", ").pop()?.trim())
      .filter(Boolean); // removes undefined or empty

    setVisitedCountries(new Set(countries) as Set<string>);
  }, [locations]);
  console.log("all trips:", trip);
  console.log("Visited countries:", Array.from(visitedCountries));
  console.log("All locations:", locations);
  const fixedMarkers = useMemo(() => {
    return locations.map((loc) => ({
      lat: loc.lat,
      lng: loc.long,
      size: 0.5,
      color: visitedCountries.has(loc.address) ? "red" : "blue",
    }));
  }, [locations, visitedCountries]);

  // globe controls
  useEffect(() => {
    const interval = setInterval(() => {
      const globe = globeRef.current;
      if (!globe) return;

      const controls = globe.controls();
      if (!controls) return;

      // ✅ enable spinning
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.6;
      controls.enableZoom = true;
      // ✅ Detect screen size and adjust camera altitude
      const isSmallScreen = window.innerWidth < 768; // Tailwind's "md"
      const altitude = isSmallScreen ? 4 : 2.5; // zoom out more on small screens
      // ✅ set camera position
      globe.pointOfView({ lat: 0, lng: 0, altitude });

      clearInterval(interval); // stop checking once ready
    }, 200);

    return () => clearInterval(interval);
  }, []);
  if (isLoading) {
    return <GlobeSkeleton />;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <TripSummary />
      {/* Right: Globe */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-4">
          See where you’ve been on the globe!
        </h2>
        <div className="relative h-[500px] rounded-xl overflow-hidden border border-neutral-100">
          <div className="relative h-[600px] w-full flex items-center justify-center bg-neutral-100 rounded-xl overflow-hidden">
            <Globe
              ref={globeRef}
              width={800}
              height={600}
              backgroundColor="rgba(0,0,0,0)"
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
              bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
              showAtmosphere
              atmosphereColor="white"
              atmosphereAltitude={0.25}
              pointsData={fixedMarkers}
              pointAltitude="size"
              pointColor="color"
              pointRadius={0.5}
              pointsTransitionDuration={1000}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
