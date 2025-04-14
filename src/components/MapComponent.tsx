"use client";

import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { Utils } from "@/lib/utils";

function getColorFromIntensity(intensity: number): string {
  const r = Math.floor(255 * intensity);
  const g = Math.floor(255 * (1 - intensity));
  return `rgb(${r},${g},0)`;
}

const MapComponent = () => {
  const [barrios, setBarrios] = useState(null);
  const [incidents, setIncidents] = useState<{ [gid: string]: number } | null>(null);

  useEffect(() => {
    fetch("/barrios.geojson")
      .then((res) => res.json())
      .then((data) => setBarrios(data));
  }, []);

  useEffect(() => {
    if (barrios) {
      const fetchIncidents = async () => {
        const response = await fetch("/api/incidents");
        const data = await response.json();
        setIncidents(data);
        console.log(data);
      };

      fetchIncidents();
    }
  }, [barrios]);

  if (!barrios || !incidents) {
    return <div>Loading...</div>;
  }

  return (
    <MapContainer
      center={[-34.9011, -56.1645]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {barrios && (
        <GeoJSON
          data={barrios}
          style={(feature) => {
            const gid = feature!.properties.GID;
            const intensidad = incidents[gid] || 0;
            const color = getColorFromIntensity(intensidad);
            return {
              color: "black",
              weight: 1,
              fillColor: color,
              fillOpacity: 0.8,
            };
          }}
          onEachFeature={(feature, layer) => {
            const barrio =
              feature.properties.BARRIO || feature.properties.barrio;
            layer.bindPopup(Utils.toSpanishCamelCase(barrio));
          }}
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;
