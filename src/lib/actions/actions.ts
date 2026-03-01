"use server";

import { newTripFormSchema } from "@/lib/validations/validations";
import { NewLocationData } from "../types/types";
import { stackServerApp } from "@/stack/server";
import { put } from "@vercel/blob";
import { Location } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Create a new trip and upload image to Vercel Blob
 */
export async function createTrip(data: unknown) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("User not authenticated");

  const parsed = newTripFormSchema.parse(data);

  if (!parsed.imageUrl) throw new Error("Image is required");
  const file = parsed.imageUrl as File;

  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  console.log("Uploading file to:", filePath);

  const { url: publicUrl } = await put(`trip-images/${filePath}`, file, {
    access: "public",
  });

  console.log("Uploaded file URL:", publicUrl);

  const trip = await prisma.trip.create({
    data: {
      title: parsed.name,
      description: parsed.description,
      startDate: parsed.startDate,
      endDate: parsed.endDate,
      userId: user.id,
      imageUrl: publicUrl,
    },
  });

  return trip;
}

/**
 * Get current authenticated user
 */
export async function getUser() {
  const user = await stackServerApp.getUser();
  return user || null;
}

/**
 * Get trips for the current authenticated user
 */
export async function getUserTrips() {
  const user = await stackServerApp.getUser();
  if (!user) return null;

  return await prisma.trip.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { locations: true },
  });
}

/**
 * Get a specific trip and its locations
 */
export async function getUserTripWithLocations(tripId: string) {
  return await prisma.trip.findUnique({
    where: { id: tripId },
    include: { locations: true },
  });
}
export async function isTripOwner(tripId: string, userId: string) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { userId: true },
  });

  if (!trip) throw new Error("Trip not found");

  return trip.userId === userId;
}
/**
 * Add a new location to a trip
 */
export async function addTripLocation(newLocationData: NewLocationData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("User is required");

  const { tripId, address, locationTitle, coords } = newLocationData;

  const owner = await isTripOwner(tripId, user.id);
  if (!owner) throw new Error("You are not allowed to modify this trip.");
  const countLocations = await prisma.location.count({
    where: { tripId },
  });

  return await prisma.location.create({
    data: {
      locationTitle,
      address,
      lat: coords[0],
      long: coords[1],
      trip: { connect: { id: tripId } },
      order: countLocations,
    },
  });
}

/**
 * Reorder locations in a trip
 */
export async function reorderLocations(newLocationsOrder: Location[]) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("User is required");
  return await prisma.$transaction(
    newLocationsOrder.map((loc) =>
      prisma.location.update({
        where: { id: loc.id },
        data: { order: loc.order },
      }),
    ),
  );
}

/**
 * Delete a trip and all its locations
 */
export async function deleteTrip(tripId: string) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("User is required");

  return await prisma.trip.delete({
    where: { id: tripId },
  });
}

/**
 * Delete a single location and reorder remaining ones
 */
export async function deleteLocation(locationId: string) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("User is required");

  // Find the location to know which trip it belongs to
  const loc = await prisma.location.findUnique({
    where: { id: locationId },
    select: { tripId: true },
  });
  // if (!loc) throw new Error("Cannot find the location in your trip");

  // Delete the location
  await prisma.location.delete({ where: { id: locationId } });

  // Reorder remaining locations
  const remaining = await prisma.location.findMany({
    where: { tripId: loc.tripId },
    orderBy: { order: "asc" },
  });

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
