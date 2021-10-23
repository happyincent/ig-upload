// Reverse API: http://nominatim.org/release-docs/latest/api/Reverse/

import fetch from "node-fetch";

interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon?: string;
  address: NominatimAddress;
}

interface NominatimAddress {
  amenity?: string;
  building?: string;
  city?: string;
  country?: string;
  county?: string;
  hamlet?: string;
  highway?: string;
  leisure?: string;
  neighbourhood?: string;
  postcode?: string;
  road?: string;
  shop?: string;
  state?: string;
  suburb?: string;
  tourism?: string;
  town?: string;
  village?: string;
}

async function reverse(props: { lat: number; lon: number; zoom?: number; language?: string }) {
  const url = "https://nominatim.openstreetmap.org/reverse";
  const params = new URLSearchParams({ format: "json" });

  for (const [key, value] of Object.entries(props)) {
    params.set(key.replace("language", "accept-language"), `${value}`);
  }

  const res = await fetch(`${url}?${params.toString()}`);
  return (await res.json()) as Promise<NominatimResult>;
}

export { reverse };
