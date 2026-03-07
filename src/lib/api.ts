import type { MapData } from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://129.158.41.81:3100/v1";

export async function fetchMapData(): Promise<MapData> {
  const res = await fetch(`${API_URL}/map/pins`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
