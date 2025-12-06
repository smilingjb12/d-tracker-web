"use client";

import React, { useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type LatLngTuple = [number, number];

const createCustomIcon = (opacity: number) => {
  return new L.Icon({
    iconUrl:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
        <path fill="#333333" fill-opacity="${opacity}" stroke="#333333" stroke-width="1" d="M12.5 0C5.596 0 0 5.596 0 12.5C0 21.875 12.5 41 12.5 41S25 21.875 25 12.5C25 5.596 19.404 0 12.5 0zm0 18.75c-3.452 0-6.25-2.798-6.25-6.25s2.798-6.25 6.25-6.25 6.25 2.798 6.25 6.25-2.798 6.25-6.25 6.25z"/>
      </svg>
    `),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

const icons = [
  createCustomIcon(1),
  createCustomIcon(0.75),
  createCustomIcon(0.5),
  createCustomIcon(0.25),
  createCustomIcon(0.1),
];

export default function LocationMap() {
  const lastKnownLocations = useQuery(api.users.getLastKnownLocations);
  const points: LatLngTuple[] | undefined = lastKnownLocations?.map((loc) => [
    loc.lat!,
    loc.lng!,
  ]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || !points || points.length === 0) return;

    // If map already exists, just update markers
    if (mapRef.current) {
      return;
    }

    // Create map
    const map = L.map(mapContainerRef.current).setView(points[0], 18);
    mapRef.current = map;

    L.tileLayer("https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png", {
      attribution: "",
    }).addTo(map);

    // Add markers
    points.forEach((point, i) => {
      L.marker(point, { icon: icons[Math.min(i, icons.length - 1)] }).addTo(map);
    });

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [points]);

  if (!points || points.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div
      ref={mapContainerRef}
      style={{ height: "400px", width: "100%" }}
    />
  );
}
