import { Trash2, GripVertical } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { deleteLocation } from "@/lib/actions/actions";
import { Location } from "@/generated/prisma";
import { useDeleteLocation } from "@/lib/actions/hooks";

function SortableItem({ item, tripId }: { item: Location; tripId: string }) {
  const queryClient = useQueryClient();

  const { mutate: deleteLocation, isPending: isPendingDelete } =
    useDeleteLocation(tripId);
  // const deleteMutation = useMutation({
  //   mutationFn: (id: string) => deleteLocation(id),
  //   onSuccess: () => {
  //     toast.success("Location deleted");
  //     queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
  //   },
  //   onError: () => {
  //     toast.error("Failed to delete location");
  //   },
  // });

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg p-4 shadow-sm bg-white flex justify-between items-center"
    >
      {/* 🟢 Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab p-2 text-gray-400 hover:text-gray-600"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* 🏷️ Location info */}
      <div className="flex-1 ml-3">
        <div className="font-medium">{item.locationTitle}</div>
        <p className="text-sm text-gray-500">{item.address}</p>
      </div>

      {/* 🗑️ Delete button */}
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-600">Day {item.order + 1}</div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            console.log("Deleting:", item.id);
            deleteLocation(item.id);
          }}
          disabled={isPendingDelete}
          className="cursor-pointer hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
}

export default SortableItem;
