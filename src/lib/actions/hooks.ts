"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteLocation, reorderLocations } from "./actions";
import { Location } from "@/generated/prisma";

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
