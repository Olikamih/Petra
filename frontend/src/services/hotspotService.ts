export interface Hotspot {
  cluster_id: number;
  detections: number;
  center: {
    latitude: number;
    longitude: number;
  };
  average_frp: number | null;
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

const API_URL = "http://127.0.0.1:8000";


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
  const url = `${API_URL}/api/ai/hotspots${query ? `?${query}` : ""}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Não foi possível obter os agrupamentos.");
  }

  return response.json();
}