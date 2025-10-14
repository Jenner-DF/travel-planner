import { Location } from "@/generated/prisma";
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

export default function SortableItinerary({
  locations,
  tripId,
}: {
  locations: Location[];
  tripId: string;
}) {
  const id = useId();
  // const [localLocation, setLocalLocation] = useState(locations);
  const { mutate: reorderLocations, isPending: isPendingReorder } =
    useReorderLocations(tripId);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = locations.findIndex((item) => item.id === active.id);
      const newIndex = locations.findIndex((item) => item.id === over?.id);
      const newLocationsOrder = arrayMove(locations, oldIndex, newIndex).map(
        (item, index) => ({ ...item, order: index })
      );
      // setLocalLocation(newLocationsOrder);
      console.log("New Locations Order: ", newLocationsOrder);
      reorderLocations(newLocationsOrder);
    }
  };
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
            <SortableItem key={loc.id} item={loc} tripId={tripId} />
          ))}
        </div>
      </SortableContext>
    </DndContext>

    // <div>
    //   {locations.map((loc) => (
    //     <div key={loc.id}>{loc.locationTitle}</div>
    //   ))}
    // </div>
  );
}
