"use client";

import { useState } from "react";
import type { MapPin, MapStats } from "@/lib/types";

const TIER_COLORS: Record<string, string> = {
  holder: "#6b7280",
  collector: "#cd7f32",
  whale_room: "#c0c0c0",
  conviction: "#ffd700",
  legend: "#b9f2ff",
};

interface SidebarProps {
  pins: MapPin[];
  stats: MapStats;
}

export default function Sidebar({ pins, stats }: SidebarProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = search
    ? pins.filter(
        (p) =>
          (p.username || "").toLowerCase().includes(search.toLowerCase()) ||
          p.country.toLowerCase().includes(search.toLowerCase()) ||
          (p.xHandle || "").toLowerCase().includes(search.toLowerCase())
      )
    : pins;

  const sorted = [...filtered].sort((a, b) => b.holderCount - a.holderCount);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed bottom-4 right-4 z-20 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg border border-gray-700"
      >
        {open ? "Map" : `Holders (${stats.totalPins})`}
      </button>

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 right-0 h-full w-80 bg-gray-900/95 backdrop-blur z-10
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"} md:translate-x-0
        overflow-y-auto border-l border-gray-800
      `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-white">Beast Map</h2>
            <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded">
              LIVE
            </span>
          </div>
          <div className="text-gray-400 text-sm">
            {stats.totalPins.toLocaleString()} holders &middot;{" "}
            {stats.countries} countries
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {stats.topCountries.slice(0, 5).map((c) => (
              <span
                key={c.country}
                className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded"
              >
                {c.country}: {c.count}
              </span>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="p-4 pb-2">
          <input
            type="text"
            placeholder="Search by name, country, or @handle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
          />
          {search && (
            <div className="text-xs text-gray-500 mt-1">
              {filtered.length} results
            </div>
          )}
        </div>

        {/* Member list */}
        <div className="px-4 pb-4 space-y-1">
          {sorted.slice(0, 100).map((pin) => (
            <div
              key={pin.id}
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-800/50 transition-colors"
            >
              {pin.pfpToken ? (
                <img
                  src={`https://a.akidcalledbeast.com/0x77372a4cc66063575b05b44481f059be356964a4/pfp-webp/${pin.pfpToken}.webp`}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  style={{
                    border: `2px solid ${TIER_COLORS[pin.tier] || "#6b7280"}`,
                  }}
                  alt=""
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0"
                  style={{
                    border: `2px solid ${TIER_COLORS[pin.tier] || "#6b7280"}`,
                  }}
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white truncate">
                  {pin.username || "Anonymous"}
                </div>
                <div className="text-xs text-gray-500">
                  {pin.country}
                  {pin.holderCount > 0 && ` · ${pin.holderCount} beasts`}
                </div>
              </div>
              {pin.tier !== "holder" && (
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    background: TIER_COLORS[pin.tier],
                  }}
                  title={pin.tier}
                />
              )}
            </div>
          ))}
          {sorted.length > 100 && (
            <div className="text-xs text-gray-600 text-center py-2">
              Showing top 100 of {sorted.length}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
