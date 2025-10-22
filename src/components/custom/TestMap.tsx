"use client";

import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "@/lib/leaflet/leaflet-icons";
import { NominatimLocation } from "@/lib/types/types";

export default function GlobeMap({
  location,
  setLocation,
}: {
  location: NominatimLocation | null;
  setLocation: React.Dispatch<React.SetStateAction<NominatimLocation | null>>;
}) {
  const [currentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);
  // ✅ Update position when searched location changes
  useEffect(() => {
    if (location) {
      setCurrentPosition([parseFloat(location.lat), parseFloat(location.lon)]);
      setLocation(location);
    }
  }, [location, setLocation]);

  // ✅ Get user's location only once
  useEffect(() => {
    if (currentPosition || location) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentPosition([latitude, longitude]);
        },
        (err) => {
          console.error("Failed to get location:", err);
        }
      );
    }
  }, [currentPosition, location]);

  return (
    <MapContainer
      center={currentPosition || [51.505, -0.09]} // fallback to London
      zoom={13}
      scrollWheelZoom={true}
      className="h-full w-full rounded-md"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 🟢 Handle map clicks to move marker and fetch address */}
      <MoveMarkerOnClick
        setCurrentPosition={setCurrentPosition}
        setLocation={setLocation}
      />

      {/* 🟠 Show marker */}
      {currentPosition && (
        <>
          <Marker position={currentPosition}>
            <Popup>
              {location ? location.display_name : "Selected Location"}
            </Popup>
          </Marker>
          <ChangeView center={currentPosition} />
        </>
      )}
    </MapContainer>
  );
}

// 🗺️ Change map view when position changes
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

// 👇 Move marker + debounce reverse geocoding when user clicks
function MoveMarkerOnClick({
  setCurrentPosition,
  setLocation,
}: {
  setCurrentPosition: React.Dispatch<
    React.SetStateAction<[number, number] | null>
  >;
  setLocation: React.Dispatch<React.SetStateAction<NominatimLocation | null>>;
}) {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;

      // Immediately move marker
      setCurrentPosition([lat, lon]);

      // 🕒 Debounce reverse geocoding
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/reverseSearch?lat=${lat}&lon=${lon}`);
          const data = await res.json();
          setLocation(data);
          console.log("Reverse geocoded:", data.display_name);
        } catch (err) {
          console.error("Failed to reverse geocode:", err);
          setLocation(null);
        }
      }, 600); // adjust debounce delay (ms)
    },
  });

  return null;
}
