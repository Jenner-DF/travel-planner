"use client";

import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import type { Location, Location as TripLocation } from "@/generated/prisma";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Fix missing default marker icons in Leaflet
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";
const DefaultIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});
L.Marker.prototype.options.icon = DefaultIcon;

// ------------------------------------
// 📍 Helper: Detect clicks and move marker
// ------------------------------------

export default function MapWithPins({
  locations = [],
}: {
  locations: Location[];
}) {
  return (
    <MapContainer
      center={
        locations.length > 0
          ? [locations[0].lat, locations[0].long]
          : [51.505, -0.09]
      }
      zoom={13}
      scrollWheelZoom
      className="h-full w-full rounded-md"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 🟣 Show all trip markers */}
      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.lat, loc.long]}>
          <Popup>
            <strong>{loc.locationTitle}</strong>
            <br />
            {loc.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
