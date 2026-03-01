"use client";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useId, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { reorderLocations } from "@/lib/actions/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDeleteLocation, useReorderLocations } from "@/lib/actions/hooks";
import { Button } from "../ui/button";
import SortableItem from "./SortableItem";
import { Location } from "@prisma/client";

export default function SortableItinerary({
  locations,
  tripId,
}: {
  locations: Location[];
  tripId: string;
}) {
  const id = useId();
  // // ✅ local state to reflect immediate UI changes
  // const [localLocations, setLocalLocations] = useState(locations);

  const { mutate: reorderLocations } = useReorderLocations(tripId);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = locations.findIndex((item) => item.id === active.id);
    const newIndex = locations.findIndex((item) => item.id === over.id);

    // ✅ new order for UI
    const newOrder = arrayMove(locations, oldIndex, newIndex).map(
      (item, index) => ({ ...item, order: index }),
    );

    // ✅ update UI immediately
    // setLocalLocations(newOrder);

    // ✅ send new order to server
    reorderLocations(newOrder); //optimistic
  };
  // const handleDelete = (locationId: string) => {
  //   setLocalLocations((prev) => prev.filter((loc) => loc.id !== locationId));
  //   queryClient.invalidateQueries({ queryKey: ["trip", tripId], exact: true });
  // };
  return (
    <DndContext
      id={id}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        strategy={verticalListSortingStrategy}
        items={locations.map((loc) => loc.id)}
      >
        <div className="space-y-4">
          {locations.map((loc, i) => (
            <SortableItem
              key={loc.id}
              item={loc}
              tripId={tripId}
              // handleDelete={(locationId) => handleDelete(locationId)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
