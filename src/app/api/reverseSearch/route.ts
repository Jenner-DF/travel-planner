import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  // ✅ Validate input
  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing lat or lon" }, { status: 400 });
  }

  // ✅ Call OpenStreetMap Nominatim reverse API
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
    {
      headers: {
        "User-Agent": "travel-planner-demo/1.0", // required by Nominatim
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch from Nominatim" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
