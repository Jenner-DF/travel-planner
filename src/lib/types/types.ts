import { Location, Trip } from "@/generated/prisma";

export interface NominatimLocation {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string; // Note: Nominatim returns lat/lon as strings
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string; // short name/title
  display_name: string; // full address
  boundingbox: [string, string, string, string];
}

export interface TripWithLocations extends Trip {
  locations: Location[];
}
