import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_BASE = "http://129.158.41.81:3100/v1";

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/map/pins`);
    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    console.error("API proxy error:", err);
    return NextResponse.json(
      { error: "Failed to fetch from API" },
      { status: 502 }
    );
  }
}
