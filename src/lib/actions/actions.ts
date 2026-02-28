"use server";
import { Location } from "./../../generated/prisma/index.d";

import { newTripFormSchema } from "@/lib/validations/validations";
import prisma from "../prisma";
// import { createClient } from "@/utils/supabase/server";

import { NewLocationData } from "../types/types";

export async function createTrip(data: unknown) {
  // validate again on server (never trust client input)
  const parsed = newTripFormSchema.parse(data);
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (user.data.user == null) return null;
  const userId = user.data.user.id;

  if (!parsed.imageUrl) return;
  const file = parsed.imageUrl as File;

  // Generate unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  // Upload to: trip-images/{userId}/{fileName}
  const filePath = `${userId}/${fileName}`;
  console.log("FILEPATH KO TO!", filePath);
  const { error } = await supabase.storage
    .from("trip-images") // bucket name
    .upload(filePath, file);

  if (error) throw new Error(`Error uploading image: ${error}`);

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("trip-images").getPublicUrl(filePath);

  console.log("Uploaded file URL:", publicUrl);

  // Create trip
  const trip = await prisma.trip.create({
    data: {
      title: parsed.name,
      description: parsed.description,
      startDate: parsed.startDate,
      endDate: parsed.endDate,
      userId: userId,
      imageUrl: publicUrl,
    },
  });
  return trip; // return the created trip for debugging
}
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserTrips() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (user.data.user == null) return null;

  const trips = await prisma.trip.findMany({
    where: { userId: user.data.user.id },
    orderBy: { createdAt: "desc" },
    include: { locations: true },
  });
  return trips;
}

export async function getUserTripWithLocations(tripId: string) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { locations: true },
  });
  return trip;
}

export async function addTripLocation(newLocationData: NewLocationData) {
  const { tripId, address, locationTitle, coords } = newLocationData;
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (user.data.user == null) return null;
  //coords: [lat, lon]
  const countLocations = await prisma.location.count({
    where: { tripId },
  });
  await prisma.location.create({
    data: {
      locationTitle,
      address,
      lat: coords[0],
      long: coords[1],
      tripId,
      order: countLocations,
    },
  });
}

export async function reorderLocations(newLocationsOrder: Location[]) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (user.data.user == null) return null;

  await prisma.$transaction(
    newLocationsOrder.map((loc) =>
      prisma.location.update({
        where: { id: loc.id },
        data: { order: loc.order },
      }),
    ),
  );
}
export async function deleteTrip(tripId: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (user.data.user == null) return null;
  await prisma.trip.delete({
    where: { id: tripId },
  });
}
export async function deleteLocation(locationId: string) {
  console.log(`Deleting location with id: ${locationId}`);
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) return null;

  // 1️⃣ Find the location to know which trip it belongs to
  const deletedLoc = await prisma.location.findUnique({
    where: { id: locationId },
    select: { tripId: true },
  });

  if (!deletedLoc) return null;

  // 2️⃣ Delete that location
  await prisma.location.delete({
    where: { id: locationId },
  });

  // 3️⃣ Fetch remaining locations for that trip, sorted by order
  const remaining = await prisma.location.findMany({
    where: { tripId: deletedLoc.tripId },
    orderBy: { order: "asc" },
  });

  // 4️⃣ Reassign order values (0, 1, 2, ...)
  await prisma.$transaction(
    remaining.map((loc, index) =>
      prisma.location.update({
        where: { id: loc.id },
        data: { order: index },
      }),
    ),
  );

  return { success: true };
}

// export async function getTripSignedUrl(userId: string, fileName: string) {
//   const supabase = await createClient();
//   const { data, error } = await supabase.storage
//     .from("trip-images")
//     .createSignedUrl(`${userId}/${fileName}`, 60 * 60); // 1 hour

//   if (error) throw error;
//   return data.signedUrl;
// }
