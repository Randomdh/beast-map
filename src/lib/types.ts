export interface MapPin {
  id: string;
  username: string | null;
  lat: number;
  lng: number;
  pinType: "country" | "city";
  country: string;
  countryCode: string;
  pfpUrl: string | null;
  pfpToken: number | null;
  holderCount: number;
  tier: "holder" | "collector" | "whale_room" | "conviction" | "legend";
  milestones: string[];
  founder: boolean;
  xHandle: string | null;
  bio: string | null;
}

export interface MapStats {
  totalPins: number;
  countries: number;
  topCountries: { country: string; count: number }[];
}

export interface MapData {
  pins: MapPin[];
  stats: MapStats;
}
