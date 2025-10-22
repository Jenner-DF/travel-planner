import { getUserTrips } from "@/lib/actions/actions";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "../ui/button";

export default function TripSummary() {
  const { data: allTrips = [], isPending } = useQuery({
    queryKey: ["trips"],
    queryFn: async () => {
      const trips = await getUserTrips();
      return trips ?? []; // ✅ ensures it never returns null/undefined
    },
  });

  if (isPending) {
    return <div>Loading trip summary...</div>;
  }

  if (allTrips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-center space-y-4">
        <h2 className="text-2xl font-semibold">No trips found yet.</h2>
        <p className="text-muted-foreground text-sm">
          Start planning your next journey.
        </p>
        <Button className=" border border-black rounded-xl py-3 text-sm font-medium hover:bg-black hover:text-white transition-colors">
          <Link href="/trips/new">Create New Trip</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between bg-neutral-50 border border-neutral-200 rounded-2xl shadow-sm p-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Trip Summary</h2>
        <p className="text-neutral-600 leading-relaxed mb-6">
          Review your destinations, highlights, and routes. Explore the world
          map on the right to see where you’ve been and where you’ll go next.
        </p>

        {allTrips.map((trip) => (
          <div key={trip.id} className="mb-4 hover:bg-gray-300 p-2 rounded-lg">
            <Link href={`/trips/${trip.id}`}>
              <h3 className="text-lg font-medium">{trip.title}</h3>
              <p className="text-neutral-600">
                {new Date(trip.startDate).toDateString()} —{" "}
                {new Date(trip.endDate).toDateString()}
              </p>
            </Link>
          </div>
        ))}
      </div>

      <Link href="/trips/new" className="w-full mt-8">
        <button className="w-full border border-black rounded-xl py-3 text-sm font-medium hover:bg-black hover:text-white transition-colors">
          Add New Trip
        </button>
      </Link>
    </div>
  );
}
