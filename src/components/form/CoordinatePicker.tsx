"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMapEvents } from "react-leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

interface CoordinatePickerProps {
  value: { lat: number; lng: number };
  onChange: (value: { lat: number; lng: number }) => void;
}

const CoordinatePicker: React.FC<CoordinatePickerProps> = ({
  value,
  onChange,
}) => {
  const [marker, setMarker] = useState(value);

  useEffect(() => {
    setMarker(value);
  }, [value]);

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        setMarker(e.latlng);
        onChange(e.latlng);
        if (map && typeof map.getZoom === "function") {
          map.setView(e.latlng, map.getZoom());
        }
      },
    });

    useEffect(() => {
      if (map && typeof map.getZoom === "function") {
        map.setView(marker, map.getZoom());
      }
    }, [marker, map]);

    return (
      <Marker
        position={marker}
        draggable
        eventHandlers={{
          dragend: (e) => {
            const coords = e.target.getLatLng();
            setMarker(coords);
            onChange(coords);
            if (map && typeof map.getZoom === "function") {
              map.setView(coords, map.getZoom());
            }
          },
        }}
      />
    );
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      <MapContainer
        center={marker}
        zoom={13}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default CoordinatePicker;
