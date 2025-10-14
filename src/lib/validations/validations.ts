import z from "zod";
//for image
export const tripImageSchema = z
  .custom<File>((file) => file instanceof File, {
    message: "File is required",
  })
  .refine((file) => file.size <= 2 * 1024 * 1024, {
    // 2 MB
    message: "File size must be less than 2MB",
  })
  .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
    message: "Only JPG or PNG images are allowed",
  });
//for form
export const newTripFormSchema = z
  .object({
    name: z.string().min(1, "Trip name is required"),
    startDate: z.date({ error: "Start date is required" }),
    endDate: z.date({ error: "End date is required" }),
    description: z.string().min(1, "Description is required"),
    imageUrl: tripImageSchema,
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date cannot be before start date",
    path: ["endDate"], // attach error to endDate field
  });

export const newLocationFormSchema = z.object({
  location: z.string().min(1, "Location is required"),
  address: z.string().min(1, "Address is required"),
});
