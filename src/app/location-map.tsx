"use client";

import React, { useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type LatLngTuple = [number, number];

// Create organic-styled marker with sage green color scheme
const createCustomIcon = (opacity: number, isLatest: boolean = false) => {
  const color = isLatest ? "#5b8a72" : "#5b8a72"; // Sage green
  const size = isLatest ? 32 : 25;
  const innerSize = isLatest ? 12 : 8;

  return new L.Icon({
    iconUrl:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size * 1.5}" viewBox="0 0 ${size} ${size * 1.5}">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="${color}" flood-opacity="0.3"/>
          </filter>
        </defs>
        <path
          fill="${color}"
          fill-opacity="${opacity}"
          filter="url(#shadow)"
          d="M${size / 2} 0C${size * 0.22} 0 0 ${size * 0.22} 0 ${size / 2}C0 ${size * 0.875} ${size / 2} ${size * 1.5} ${size / 2} ${size * 1.5}S${size} ${size * 0.875} ${size} ${size / 2}C${size} ${size * 0.22} ${size * 0.78} 0 ${size / 2} 0z"
        />
        <circle
          cx="${size / 2}"
          cy="${size / 2}"
          r="${innerSize / 2}"
          fill="white"
          fill-opacity="${opacity * 0.9}"
        />
        ${isLatest ? `
          <circle
            cx="${size / 2}"
            cy="${size / 2}"
            r="${size / 2 - 2}"
            fill="none"
            stroke="white"
            stroke-width="2"
            stroke-opacity="0.5"
          />
        ` : ''}
      </svg>
    `),
    iconSize: [size, size * 1.5],
    iconAnchor: [size / 2, size * 1.5],
    popupAnchor: [1, -size],
  });
};

const icons = [
  createCustomIcon(1, true),    // Latest - full opacity, larger
  createCustomIcon(0.7),
  createCustomIcon(0.5),
  createCustomIcon(0.35),
  createCustomIcon(0.2),
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

    if (mapRef.current) {
      return;
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
    }).setView(points[0], 17);

    mapRef.current = map;

    // Add zoom control to bottom right for better mobile UX
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Use a warm, muted tile style
    L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png", {
      attribution: "",
      maxZoom: 20,
    }).addTo(map);

    // Add markers with decreasing opacity for history
    points.forEach((point, i) => {
      const marker = L.marker(point, {
        icon: icons[Math.min(i, icons.length - 1)]
      }).addTo(map);

      // Add popup for the latest marker
      if (i === 0) {
        marker.bindPopup(
          `<div style="font-family: 'DM Sans', sans-serif; padding: 4px;">
            <strong style="color: #5b8a72;">Current Location</strong>
          </div>`,
          {
            closeButton: false,
            className: 'organic-popup'
          }
        );
      }
    });

    // Draw a subtle path connecting the points
    if (points.length > 1) {
      L.polyline(points, {
        color: '#5b8a72',
        weight: 2,
        opacity: 0.3,
        dashArray: '8, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [points]);

  if (!points || points.length === 0) {
    return (
      <div className="h-[400px] rounded-2xl bg-muted/30 flex items-center justify-center text-muted-foreground">
        Loading map...
      </div>
    );
  }

  return (
    <div
      ref={mapContainerRef}
      className="h-[400px] w-full rounded-2xl"
      style={{ background: 'hsl(var(--muted))' }}
    />
  );
}
