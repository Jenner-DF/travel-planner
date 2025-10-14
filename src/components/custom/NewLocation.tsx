"use client";

import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader } from "../ui/card";
import { newLocationFormSchema } from "@/lib/validations/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { NominatimLocation } from "@/lib/types/types";
import { addTripLocation } from "@/lib/actions/actions";
import { toast } from "sonner";
import { redirect } from "next/navigation";

const TestMap = dynamic(() => import("@/components/custom/TestMap"), {
  ssr: false, // 👈 VERY IMPORTANT
});

export default function NewLocationClient({ tripid }: { tripid: string }) {
  const [location, setLocation] = useState<NominatimLocation | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  console.log(location);
  const form = useForm<z.infer<typeof newLocationFormSchema>>({
    resolver: zodResolver(newLocationFormSchema),
    defaultValues: {
      location: "",
      address: address || "",
    },
    mode: "onSubmit",
  });
  // Update form when location changes (title)
  useEffect(() => {
    if (location) {
      form.setValue("address", location.display_name);
    }
  }, [location, form]);

  // Update form when address changes (map click)
  useEffect(() => {
    if (address) {
      form.setValue("address", address);
    }
  }, [address, form]);

  const handleSubmit = async (
    formData: z.infer<typeof newLocationFormSchema>
  ) => {
    setLoading(true);

    try {
      if (!location) {
        toast.error("Please select a location first");
        return; // exits early if no location
      }

      await addTripLocation(tripid, formData.location, formData.address, [
        parseFloat(location.lat),
        parseFloat(location.lon),
      ]);

      toast.success("Location added successfully!");
    } catch (error) {
      console.error("Error adding trip location:", error);
      toast.error("Failed to add location");
    } finally {
      setLoading(false); // ✅ always runs even if error or early return
    }
    redirect(`/trips/${tripid}`);
  };

  const handleSearchMap = async () => {
    const query = form.getValues("location")?.trim();

    if (!query) {
      toast.error("Please enter a location");
      return;
    }

    console.log("Searching map for:", query);
    setLoading(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

      if (!res.ok) {
        throw new Error(`Failed request: ${res.status}`);
      }

      const searchedLocation = await res.json();

      if (!Array.isArray(searchedLocation) || searchedLocation.length === 0) {
        toast.error("No location found");
        return;
      }

      setLocation(searchedLocation[0]); // ✅ First result is usually most accurate
      toast.success(`Found: ${searchedLocation[0].display_name}`);
    } catch (error) {
      console.error("Error fetching location:", error);
      toast.error("Error fetching location");
    } finally {
      setLoading(false);
    }
  };

  const addressValue = form.watch("address");
  return (
    <div className="space-y-4">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <h2 className="text-2xl font-bold">Add New Location</h2>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div className="flex">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter location address"
                          {...field}
                          className="overflow-x-auto whitespace-nowrap"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
                <Button
                  type="button"
                  className="ml-2 mt-6"
                  onClick={handleSearchMap}
                  disabled={loading}
                >
                  Search Map
                </Button>
              </div>
              {addressValue && (
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <textarea
                          {...field}
                          placeholder="Enter location address"
                          disabled
                          className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground resize-none"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting || loading}
              >
                {form.formState.isSubmitting
                  ? "Adding new location..."
                  : "Add Location"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="w-full max-w-6xl mx-auto h-[400px] lg:h-[600px] p-0">
        <CardContent className="p-0 h-full">
          <TestMap location={location} setAddress={setAddress} />
        </CardContent>
      </Card>
    </div>
  );
}
