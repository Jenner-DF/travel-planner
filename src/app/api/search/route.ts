import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&limit=1`,
    {
      headers: {
        "User-Agent": "travel-planner-demo/1.0", // Required by Nominatim policy
      },
    }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
