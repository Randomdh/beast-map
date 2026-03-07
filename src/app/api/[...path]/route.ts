import { NextRequest, NextResponse } from "next/server";

const API_BASE = "http://129.158.41.81:3100/v1";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join("/");
  const url = `${API_BASE}/${path}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

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
