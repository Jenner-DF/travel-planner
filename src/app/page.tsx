import { Button } from "@/components/ui/button";
import { MapIcon, CalendarDays, PlaneTakeoff } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto px-6 py-20">
      {/* ===== Hero Section ===== */}
      <section className="text-center max-w-3xl mx-auto space-y-6 mb-24">
        <h1 className="text-5xl font-bold tracking-tight text-neutral-900">
          Plan your perfect trip, every time.
        </h1>
        <p className="text-lg text-neutral-600">
          Create itineraries, organize destinations, and share your travel plans
          — all in one elegant workspace.
        </p>
        <Link href="/trips">
          <Button
            size="lg"
            variant="outline"
            className="mt-4 border-neutral-800 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all"
          >
            Get Started
          </Button>
        </Link>
      </section>

      {/* ===== Features Section ===== */}
      <section>
        <h2 className="text-3xl font-semibold text-center mb-12 text-neutral-900">
          Plan with Confidence
        </h2>

        <div className="grid gap-10 md:grid-cols-3 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <MapIcon className="w-10 h-10 text-neutral-800" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900">
              Interactive Maps
            </h3>
            <p className="text-neutral-600">
              Visualize your destinations and see your trip come alive with a
              real-time map.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center">
              <CalendarDays className="w-10 h-10 text-neutral-800" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900">
              Day-by-Day Itineraries
            </h3>
            <p className="text-neutral-600">
              Organize your days with precision — from plans to notes — all in
              one place.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center">
              <PlaneTakeoff className="w-10 h-10 text-neutral-800" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900">
              Drag & Drop Planning
            </h3>
            <p className="text-neutral-600">
              Rearrange your trip stops easily with a smooth and intuitive
              interface.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
