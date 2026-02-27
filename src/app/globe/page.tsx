import GlobeUi from "@/components/custom/GlobeUi";

export default function GlobePage() {
  return (
    <div className="min-h-dvh w-full bg-white text-black">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-center text-4xl font-bold mb-12">
          Your Travel Journey
        </h1>

        {/* Responsive grid layout */}
        <GlobeUi />
      </div>
    </div>
  );
}
