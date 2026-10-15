import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

import type { Fire } from "../services/fireService";
import type { Hotspot } from "../services/hotspotService";

interface FireMapProps {
  fires: Fire[];
  hotspots: Hotspot[];
  showHotspots: boolean;
}

function formatConfidence(value: string | null): string {
  if (!value) return "Não informada";

  const labels: Record<string, string> = {
    l: "Baixa",
    low: "Baixa",
    n: "Nominal",
    nominal: "Nominal",
    h: "Alta",
    high: "Alta",
  };

  return labels[value.trim().toLowerCase()] ?? value;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("pt-BR");
}

const fireIcon = L.divIcon({
  className: "fire-marker-container",
  html: '<div class="fire-marker" aria-label="Detecção de incêndio"><span>🔥</span></div>',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
});

function FitBounds({ fires }: { fires: Fire[] }) {
  const map = useMap();

  useEffect(() => {
    const validFires = fires.filter(
      (fire) =>
        Number.isFinite(fire.latitude) &&
        Number.isFinite(fire.longitude) &&
        Math.abs(fire.latitude) <= 90 &&
        Math.abs(fire.longitude) <= 180
    );

    if (validFires.length === 0) return;

    if (validFires.length === 1) {
      map.flyTo(
        [validFires[0].latitude, validFires[0].longitude],
        8,
        { duration: 0.8 }
      );
      return;
    }

    const bounds = L.latLngBounds(
      validFires.map((fire) => [fire.latitude, fire.longitude])
    );

    map.flyToBounds(bounds, {
      padding: [36, 36],
      maxZoom: 8,
      duration: 0.8,
    });
  }, [fires, map]);

  return null;
}

function FireMap({ fires, hotspots, showHotspots }: FireMapProps) {
  const validFires = fires.filter(
    (fire) =>
      Number.isFinite(fire.latitude) &&
      Number.isFinite(fire.longitude) &&
      Math.abs(fire.latitude) <= 90 &&
      Math.abs(fire.longitude) <= 180
  );

  const validHotspots = hotspots.filter(
    (hotspot) =>
      Number.isFinite(hotspot.center.latitude) &&
      Number.isFinite(hotspot.center.longitude) &&
      Math.abs(hotspot.center.latitude) <= 90 &&
      Math.abs(hotspot.center.longitude) <= 180
  );

  const maxDetections = Math.max(
    1,
    ...validHotspots.map((hotspot) => hotspot.detections)
  );

  return (
    <MapContainer
      center={[-1.4558, -48.4902]}
      zoom={6}
      scrollWheelZoom
      zoomControl
      preferCanvas
      style={{ height: "65vh", minHeight: "380px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds fires={validFires} />

      {showHotspots &&
        validHotspots.map((hotspot) => {
          const radius =
            8 + (hotspot.detections / maxDetections) * 20;

          return (
            <CircleMarker
              key={hotspot.cluster_id}
              center={[
                hotspot.center.latitude,
                hotspot.center.longitude,
              ]}
              radius={radius}
              pathOptions={{
                color: "#ff7849",
                fillColor: "#ff4d32",
                fillOpacity: 0.28,
                weight: 2,
              }}
            >
              <Popup>
                <div className="fire-popup">
                  <strong>
                    Área de concentração #{hotspot.cluster_id}
                  </strong>
                  <span>
                    Detecções agrupadas: {hotspot.detections}
                  </span>
                  <span>
                    FRP médio:{" "}
                    {hotspot.average_frp == null
                      ? "Não informado"
                      : `${hotspot.average_frp.toLocaleString("pt-BR", {
                          maximumFractionDigits: 2,
                        })} MW`}
                  </span>
                  <span>
                    Primeira detecção: {formatDate(hotspot.first_detection)}
                  </span>
                  <span>
                    Última detecção: {formatDate(hotspot.last_detection)}
                  </span>
                  <span>
                    Centro: {hotspot.center.latitude.toFixed(4)},{" "}
                    {hotspot.center.longitude.toFixed(4)}
                  </span>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

      {validFires.map((fire) => (
        <Marker
          key={fire.id}
          position={[fire.latitude, fire.longitude]}
          icon={fireIcon}
        >
          <Popup>
            <div className="fire-popup">
              <strong>Ocorrência #{fire.id}</strong>
              <span>Fonte: {fire.source}</span>
              <span>Data: {formatDate(fire.detected_at)}</span>
              <span>Confiança: {formatConfidence(fire.confidence)}</span>
              <span>
                FRP: {fire.frp == null ? "Não informado" : `${fire.frp} MW`}
              </span>
              <span>Satélite: {fire.satellite ?? "Não informado"}</span>
              <span>Instrumento: {fire.instrument ?? "Não informado"}</span>
              <span>
                Coordenadas: {fire.latitude.toFixed(4)},{" "}
                {fire.longitude.toFixed(4)}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default FireMap;