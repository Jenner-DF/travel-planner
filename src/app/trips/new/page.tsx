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
} from "@radix-ui/react-popover";
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
    <div className="max-w-md mx-auto p-4 sm:p-6">
      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-semibold">
            Create a New Trip
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit, (errors) => {
                console.log("Validation errors:", errors);
              })}
              className="space-y-4"
            >
              {/* Trip Name */}
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trip Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter trip name" {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter trip description"
                        rows={4}
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
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full sm:w-[240px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? format(field.value, "PPP")
                              : "Pick a date"}
                            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
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
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full sm:w-[240px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? format(field.value, "PPP")
                                : "Pick a date"}
                              <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
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
                    <FormLabel>Upload Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>

                    {field.value && (
                      <div className="mt-2 flex justify-center">
                        <img
                          src={URL.createObjectURL(field.value)}
                          alt="Preview"
                          className="h-32 w-full object-contain rounded-md border"
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating your trip..." : "Create Trip"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
