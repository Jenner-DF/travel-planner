import TripDetails from "@/components/custom/TripDetails";
import { getUserTripWithLocations } from "@/lib/actions/actions";
import { getQueryClient } from "@/providers/getQueryClient";

export default async function TripPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  console.log(tripId);

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["trip", tripId],
    queryFn: () => getUserTripWithLocations(tripId),
  });

  return (
    <div>
      {/* <div>TITE </div> */}
      <TripDetails tripId={tripId} />
    </div>
  );
}
