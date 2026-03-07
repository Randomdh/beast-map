"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MapPin } from "@/lib/types";

// Fix Leaflet default icon paths in Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const TIER_COLORS: Record<string, string> = {
  holder: "#6b7280",
  collector: "#cd7f32",
  whale_room: "#c0c0c0",
  conviction: "#ffd700",
  legend: "#b9f2ff",
};

const TIER_LABELS: Record<string, string> = {
  holder: "Holder",
  collector: "Collector",
  whale_room: "Whale Room",
  conviction: "Conviction",
  legend: "Legend",
};

function createBeastIcon(pin: MapPin): L.DivIcon {
  const borderColor = TIER_COLORS[pin.tier] || "#6b7280";
  const size = pin.pfpToken ? 36 : 28;

  if (pin.pfpToken) {
    const imgSrc = `https://a.akidcalledbeast.com/0x77372a4cc66063575b05b44481f059be356964a4/pfp-webp/${pin.pfpToken}.webp`;
    return L.divIcon({
      className: "beast-pin",
      html: `<div style="
        width: ${size}px; height: ${size}px; border-radius: 50%;
        border: 3px solid ${borderColor};
        overflow: hidden; background: #1a1a2e;
        box-shadow: 0 2px 6px rgba(0,0,0,0.5);
      "><img src="${imgSrc}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'" /></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }

  // No PFP — use a simple dot
  return L.divIcon({
    className: "beast-pin",
    html: `<div style="
      width: ${size}px; height: ${size}px; border-radius: 50%;
      background: ${borderColor}; opacity: 0.7;
      box-shadow: 0 2px 6px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

interface BeastMapProps {
  pins: MapPin[];
}

export default function BeastMap({ pins }: BeastMapProps) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      maxZoom={12}
      style={{ height: "100vh", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {pins.map((pin) => (
        <Marker
          key={pin.id}
          position={[pin.lat, pin.lng]}
          icon={createBeastIcon(pin)}
        >
          <Popup>
            <PinCard pin={pin} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

function PinCard({ pin }: { pin: MapPin }) {
  const borderColor = TIER_COLORS[pin.tier] || "#6b7280";

  return (
    <div className="min-w-[200px] text-sm">
      <div className="flex items-center gap-3 mb-2">
        {pin.pfpToken ? (
          <img
            src={`https://a.akidcalledbeast.com/0x77372a4cc66063575b05b44481f059be356964a4/pfp-webp/${pin.pfpToken}.webp`}
            className="w-12 h-12 rounded-full object-cover"
            style={{ border: `2px solid ${borderColor}` }}
            alt=""
          />
        ) : (
          <div
            className="w-12 h-12 rounded-full bg-gray-700"
            style={{ border: `2px solid ${borderColor}` }}
          />
        )}
        <div>
          <div className="font-bold text-base">
            {pin.username || "Anonymous"}
          </div>
          <div className="text-gray-500">{pin.country}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-1">
        {pin.holderCount > 0 && (
          <span className="text-gray-700">{pin.holderCount} Beasts</span>
        )}
        {pin.tier !== "holder" && (
          <span
            className="text-xs px-1.5 py-0.5 rounded font-medium"
            style={{ background: borderColor, color: "#000" }}
          >
            {TIER_LABELS[pin.tier]}
          </span>
        )}
      </div>

      {pin.bio && (
        <div className="text-gray-500 text-xs mt-1 italic">{pin.bio}</div>
      )}

      {pin.xHandle && (
        <a
          href={`https://x.com/${pin.xHandle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline block mt-1 text-xs"
        >
          @{pin.xHandle}
        </a>
      )}
    </div>
  );
}
