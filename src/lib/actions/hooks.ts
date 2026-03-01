"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addTripLocation,
  deleteLocation,
  deleteTrip,
  reorderLocations,
} from "./actions";
import { NewLocationData, TripWithLocations } from "../types/types";
import type { Location } from "@prisma/client";

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
    onMutate: async (locationId: string) => {
      await queryClient.cancelQueries({ queryKey: ["trip", tripId] });

      const previousData = queryClient.getQueryData(["trip", tripId]);
      queryClient.setQueryData(["trip", tripId], (old: TripWithLocations) => {
        return {
          ...old,
          locations: old.locations.filter(
            (loc: Location) => loc.id !== locationId,
          ),
        };
      });
      return { previousData };
    },
    onSuccess: () => {
      toast.success("Location deleted");
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["trip", tripId], context?.previousData);
      toast.error("Failed to delete location");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    },
  });
}
export function useAddLocation(tripId: string) {
  if (!tripId) throw new Error("tripId is required");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newLocationData: NewLocationData) => {
      console.log("BAGONG LOC NGA TO TANGINA  MO", newLocationData);
      return await addTripLocation(newLocationData);
    },
    //dont use optimistic updates when creating new location
    onSuccess: () => {
      toast.success("New Location added successfully!");
    },
    onError: () => {
      toast.error("Failed to add your new location");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["trip", tripId],
      });
    },
  });
}
export function useReorderLocations(tripId: string) {
  if (!tripId) throw new Error("tripId is required");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newLocationsOrder: Location[]) =>
      reorderLocations(newLocationsOrder),
    //OnMutate runs before finishing the mutation fn, allows optimistic updates!
    onMutate: async (newLocationsOrder) => {
      //cancel upcoming  query
      await queryClient.cancelQueries({ queryKey: ["trip", tripId] });
      //get old data
      const previousData = queryClient.getQueryData(["trip", tripId]);
      //optimistically visual update ui
      queryClient.setQueryData(["trip", tripId], (old: TripWithLocations) => {
        //old = cache, if nothing returns immediately
        if (!old) return old;
        return {
          ...old,
          locations: newLocationsOrder,
        };
      });
      //returns if error (context) react query
      return { previousData };
    },
    onSuccess: () => {
      // toast.success("Locations reordered successfully!");
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["trip", tripId], context?.previousData);
      toast.error("Failed to reorder locations");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    },
  });
}
