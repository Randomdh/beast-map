"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import type { MapData } from "@/lib/types";

const BeastMap = dynamic(() => import("@/components/BeastMap"), { ssr: false });

// Use /api proxy in production (avoids HTTPS->HTTP mixed content block)
// Falls back to direct URL for local dev
const API_URL =
  typeof window !== "undefined" && window.location.protocol === "https:"
    ? "/api"
    : process.env.NEXT_PUBLIC_API_URL || "http://129.158.41.81:3100/v1";

export default function Home() {
  const [data, setData] = useState<MapData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/map/pins`)
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <main className="h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-xl font-bold text-white mb-2">Beast Map</div>
          <div>Failed to load map data</div>
          <div className="text-sm mt-1">{error}</div>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-xl font-bold text-white mb-2">Beast Map</div>
          <div className="animate-pulse">Loading map data...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative h-screen bg-gray-950">
      {/* Stats overlay (visible on mobile, hidden on desktop where sidebar shows) */}
      <div className="md:hidden absolute top-4 left-4 z-10 bg-gray-900/90 backdrop-blur rounded-lg px-4 py-3 text-white">
        <div className="text-lg font-bold">Beast Map</div>
        <div className="text-sm text-gray-400">
          {data.stats.totalPins.toLocaleString()} holders &middot;{" "}
          {data.stats.countries} countries
        </div>
      </div>

      {/* Map takes full width, sidebar overlays on right */}
      <div className="md:mr-80">
        <BeastMap pins={data.pins} />
      </div>

      <Sidebar pins={data.pins} stats={data.stats} />
    </main>
  );
}
