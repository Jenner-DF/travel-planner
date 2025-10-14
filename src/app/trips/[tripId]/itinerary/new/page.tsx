import NewLocationClient from "@/components/custom/NewLocation";

export default async function NewLocation({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  if (!tripId) return <div>Invalid trip</div>;
  return (
    <div>
      <NewLocationClient tripid={tripId} />
    </div>
  );
}
