"use client";

import { newTripFormSchema } from "@/lib/validations/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // ✅ Correct ShadCN import
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { createTrip } from "@/lib/actions/actions";
import { toast } from "sonner";
import z from "zod";
import { useRouter } from "next/navigation";

export default function NewTripPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof newTripFormSchema>>({
    resolver: zodResolver(newTripFormSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: addDays(new Date(), 1),
      endDate: addDays(new Date(), 8),
      imageUrl: undefined,
    },
    mode: "onSubmit",
  });

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  useEffect(() => {
    if (startDate && endDate && endDate < startDate) {
      form.setValue("endDate", startDate, { shouldValidate: true });
    }
  }, [startDate, endDate, form]);

  const handleSubmit = async (formData: z.infer<typeof newTripFormSchema>) => {
    setIsLoading(true);
    try {
      const newTrip = await createTrip(formData);
      toast.success("Trip created successfully");
      form.reset();
      router.push(`/trips/${newTrip?.id}`);
    } catch (error) {
      console.error(error);
      toast.error(`Error creating trip: ${error}`);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-6">
      <Card className="w-full max-w-lg border border-gray-200 shadow-md rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center tracking-tight">
            Create a New Trip
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Trip Name */}
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Trip Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter trip name"
                        className="border-gray-300 focus:border-black focus:ring-black"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your trip..."
                        rows={4}
                        className="border-gray-300 focus:border-black focus:ring-black"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Start Date */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-between border-gray-300 hover:border-black hover:bg-gray-50 text-gray-800",
                              !field.value && "text-gray-400"
                            )}
                          >
                            {field.value
                              ? format(field.value, "PPP")
                              : "Pick a date"}
                            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 z-50 bg-white border border-gray-200 shadow-lg rounded-md"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Date */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => {
                  const startDate = form.watch("startDate");
                  return (
                    <FormItem>
                      <FormLabel className="text-gray-700">End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-between border-gray-300 hover:border-black hover:bg-gray-50 text-gray-800",
                                !field.value && "text-gray-400"
                              )}
                            >
                              {field.value
                                ? format(field.value, "PPP")
                                : "Pick a date"}
                              <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 z-50 bg-white border border-gray-200 shadow-lg rounded-md"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={
                              !startDate
                                ? (date) => date < new Date()
                                : (date) => date < startDate
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Image Upload */}
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Trip Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        className="border-gray-300 focus:border-black focus:ring-black cursor-pointer"
                      />
                    </FormControl>

                    {field.value && (
                      <div className="mt-3 flex justify-center">
                        <img
                          src={URL.createObjectURL(field.value)}
                          alt="Preview"
                          className="h-32 w-full object-cover rounded-md border border-gray-200"
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-900"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Trip"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
