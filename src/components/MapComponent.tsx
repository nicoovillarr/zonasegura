"use client";

import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { Utils } from "@/lib/utils";

const MapComponent = () => {
  const [barrios, setBarrios] = useState(null);

  useEffect(() => {
    fetch("/barrios.geojson")
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        return res;
      })
      .then((data) => setBarrios(data));
  }, []);

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
          style={() => ({
            color: "blue",
            weight: 1,
            fillColor: "lightblue",
            fillOpacity: 0.8,
          })}
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
