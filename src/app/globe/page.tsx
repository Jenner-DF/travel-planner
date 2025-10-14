"use client";
import GlobeMap from "@/components/custom/TestMap";

import dynamic from "next/dynamic";

const TestMap = dynamic(() => import("@/components/custom/TestMap"), {
  ssr: false, // 👈 VERY IMPORTANT
});

export default function GlobePage() {
  return (
    <div className="h-screen w-full border-2 border-red-500 ">
      <TestMap />
    </div>
  );
}
