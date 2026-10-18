
export interface Hotspot {
  cluster_id: number;
  detections: number;
  center: {
    latitude: number;
    longitude: number;
  };
  average_frp: number | null;
  high_confidence_detections?: number;
  high_confidence_ratio?: number;
  priority?: {
    level: "critica" | "alta" | "moderada" | "baixa" | string;
    score: number;
    reasons: string[];
  };
  first_detection: string;
  last_detection: string;
}

export interface HotspotResponse {
  algorithm: string;
  radius_km: number;
  min_samples: number;
  total_detections: number;
  clusters_found: number;
  noise_points: number;
  clusters: Hotspot[];
}

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://petra-api-2ofy.onrender.com"
).replace(/\/+$/, "");

export async function getHotspots(
  source: string = "all",
  confidence: string = "all"
): Promise<HotspotResponse> {
  const params = new URLSearchParams();

  if (source !== "all") {
    params.set("source", source);
  }

  if (confidence !== "all") {
    params.set("confidence", confidence);
  }

  const query = params.toString();

  const url = `${API_URL}/api/ai/hotspots${
    query ? `?${query}` : ""
  }`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Erro ao obter agrupamentos: HTTP ${response.status}`
    );
  }

  return response.json();
}
