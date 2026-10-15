export interface Fire {
  id: number;
  source: string;
  external_id: string | null;
  detected_at: string;

  latitude: number;
  longitude: number;

  confidence: string | null;
  frp: number | null;

  satellite: string | null;
  instrument: string | null;
}

const API_URL = "http://127.0.0.1:8000";

export async function getFires(): Promise<Fire[]> {
  const response = await fetch(`${API_URL}/api/fires/`);

  if (!response.ok) {
    throw new Error("Não foi possível obter as ocorrências.");
  }

  return response.json();
}