"use client";

import LoadingIndicator from "@/components/loading-indicator";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type LatLngTuple = [number, number];

export default function LocationMap() {
  const lastKnownLocation = useQuery(api.users.getLastKnownLocation);
  const point: LatLngTuple | null = lastKnownLocation
    ? [lastKnownLocation.lat!, lastKnownLocation.lng!]
    : null;

  const customIcon = new L.Icon({
    iconUrl:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
        <path fill="#32c238" stroke="#000000" stroke-width="1" d="M12.5 0C5.596 0 0 5.596 0 12.5C0 21.875 12.5 41 12.5 41S25 21.875 25 12.5C25 5.596 19.404 0 12.5 0zm0 18.75c-3.452 0-6.25-2.798-6.25-6.25s2.798-6.25 6.25-6.25 6.25 2.798 6.25 6.25-2.798 6.25-6.25 6.25z"/>
      </svg>
    `),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  if (!point) {
    return <LoadingIndicator />;
  }

  return (
    <div>
      <MapContainer
        center={point}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={point} icon={customIcon} />
      </MapContainer>
    </div>
  );
}
