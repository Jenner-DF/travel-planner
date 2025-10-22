"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addTripLocation,
  deleteLocation,
  deleteTrip,
  reorderLocations,
} from "./actions";
import { Location } from "@/generated/prisma";
import { NewLocationData } from "../types/types";

export function useDeleteTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tripId: string) => deleteTrip(tripId),
    onSuccess: () => {
      toast.success("Location deleted");
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
    onError: () => {
      toast.error("Failed to delete location");
    },
  });
}
export function useDeleteLocation(tripId: string) {
  if (!tripId) throw new Error("tripId is required");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (locationId: string) => deleteLocation(locationId),
    onSuccess: () => {
      toast.success("Location deleted");
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    },
    onError: () => {
      toast.error("Failed to delete location");
    },
  });
}
export function useAddLocation(tripId: string) {
  if (!tripId) throw new Error("tripId is required");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newLocationData: NewLocationData) =>
      addTripLocation(newLocationData),
    onSuccess: () => {
      toast.success("New Location added successfully!");
      // ✅ invalidate the trip query so it refetches
      queryClient.invalidateQueries({
        queryKey: ["trip", tripId],
      });
    },
    onError: () => {
      toast.error("Failed to add your new location");
    },
  });
}
export function useReorderLocations(tripId: string) {
  if (!tripId) throw new Error("tripId is required");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newLocationsOrder: Location[]) =>
      reorderLocations(newLocationsOrder),
    onSuccess: () => {
      toast.success("Locations reordered successfully!");
      // ✅ invalidate the trip query so it refetches
      queryClient.invalidateQueries({
        queryKey: ["trip", tripId],
      });
    },
    onError: () => {
      toast.error("Failed to reorder locations");
    },
  });
}
