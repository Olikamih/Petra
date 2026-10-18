
import { useEffect, useMemo } from "react";
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
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("pt-BR");
}

const fireIcon = L.divIcon({
  className: "fire-marker-container",
  html: '<div class="fire-marker"><span>🔥</span></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

function FitBounds({ fires }: { fires: Fire[] }) {
  const map = useMap();

  useEffect(() => {
    if (fires.length === 0) return;

    if (fires.length === 1) {
      map.setView(
        [fires[0].latitude, fires[0].longitude],
        8,
        { animate: false }
      );
      return;
    }

    const bounds = L.latLngBounds(
      fires.map((fire) => [fire.latitude, fire.longitude])
    );

    map.fitBounds(bounds, {
      padding: [24, 24],
      maxZoom: 8,
      animate: false,
    });
  }, [fires, map]);

  return null;
}

function FireMap({ fires, hotspots, showHotspots }: FireMapProps) {
  const validFires = useMemo(
    () =>
      fires.filter(
        (fire) =>
          Number.isFinite(fire.latitude) &&
          Number.isFinite(fire.longitude) &&
          Math.abs(fire.latitude) <= 90 &&
          Math.abs(fire.longitude) <= 180
      ),
    [fires]
  );

  const validHotspots = useMemo(
    () =>
      hotspots.filter(
        (hotspot) =>
          Number.isFinite(hotspot.center.latitude) &&
          Number.isFinite(hotspot.center.longitude) &&
          Math.abs(hotspot.center.latitude) <= 90 &&
          Math.abs(hotspot.center.longitude) <= 180
      ),
    [hotspots]
  );

  // Limita os elementos visuais mais pesados do Leaflet.
  // A API e a lista completa de ocorrências continuam intactas.
  const visibleFires = useMemo(
    () =>
      [...validFires]
        .sort((a, b) => (b.frp ?? 0) - (a.frp ?? 0))
        .slice(0, 500),
    [validFires]
  );

  const maxDetections = useMemo(
    () =>
      Math.max(
        1,
        ...validHotspots.map((hotspot) => hotspot.detections)
      ),
    [validHotspots]
  );

  const priorityColors: Record<string, string> = {
    critica: "#ff1744",
    alta: "#ff7849",
    moderada: "#ffc857",
    baixa: "#a3e635",
  };

  return (
    <MapContainer
      center={[-1.4558, -48.4902]}
      zoom={6}
      scrollWheelZoom={false}
      zoomControl
      preferCanvas
      style={{
        height: "min(65vh, 600px)",
        minHeight: "320px",
        width: "100%",
        background: "#101820",
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        updateWhenIdle
        keepBuffer={2}
      />

      <FitBounds fires={validFires} />

      {showHotspots &&
        validHotspots.map((hotspot) => {
          const color =
            priorityColors[hotspot.priority?.level ?? ""] ?? "#a3e635";

          const radius =
            8 + (hotspot.detections / maxDetections) * 16;

          return (
            <CircleMarker
              key={hotspot.cluster_id}
              center={[
                hotspot.center.latitude,
                hotspot.center.longitude,
              ]}
              radius={radius}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.35,
                weight: 2,
              }}
            >
              <Popup>
                <div className="fire-popup">
                  <strong>
                    Área de concentração #{hotspot.cluster_id}
                  </strong>

                  <span>
                    Prioridade: {(
                      hotspot.priority?.level ?? "Sem classificação"
                    ).toUpperCase()}
                  </span>

                  <span>
                    Pontuação: {hotspot.priority?.score ?? "N/A"}
                  </span>

                  {hotspot.priority?.reasons.map((reason, index) => (
                    <span key={index}>• {reason}</span>
                  ))}

                  <span>Detecções agrupadas: {hotspot.detections}</span>

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

      {visibleFires.map((fire) => (
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
