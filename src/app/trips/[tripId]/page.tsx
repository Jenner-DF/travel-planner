import TripDetails from "@/components/custom/TripDetails";
import { getUserTripWithLocations } from "@/lib/actions/actions";
import prisma from "@/lib/prisma";
import { getQueryClient } from "@/providers/getQueryClient";

export default async function TripPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  if (!tripId) return <div>Invalid trip</div>;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["trip", tripId],
    queryFn: () => getUserTripWithLocations(tripId),
  });

  return (
    <div>
      <TripDetails tripId={tripId} />
    </div>
  );
}
