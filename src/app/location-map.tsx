import React, { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type LatLngTuple = [number, number];

// This component handles map updates when points change
function MapUpdater({ points }: { points: LatLngTuple[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length > 0) {
      // Invalidate map size to handle container size changes
      map.invalidateSize();

      // Create bounds that include all points
      const bounds = L.latLngBounds(points);
      // Fit the map to show all points with some padding
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 18,
      });
    }
  }, [map, points]);

  return null;
}

export default function LocationMap() {
  const lastKnownLocations = useQuery(api.users.getLastKnownLocations);
  const points: LatLngTuple[] | undefined = lastKnownLocations?.map((loc) => [
    loc.lat!,
    loc.lng!,
  ]);

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

  if (!points || points.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <MapContainer
        center={points[0]}
        zoom={16}
        style={{ height: "400px", width: "100%" }}
        // Add these options for better performance and UX
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <MapUpdater points={points} />
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
          attribution=""
        />
        {points.map((point, i) => (
          <Marker
            key={i}
            position={point}
            icon={icons[Math.min(i, icons.length - 1)]}
          />
        ))}
      </MapContainer>
    </div>
  );
}
