
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

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://petra-api-2ofy.onrender.com"
).replace(/\/+$/, "");

export async function getFires(): Promise<Fire[]> {
  const response = await fetch(`${API_URL}/api/fires/`);

  if (!response.ok) {
    throw new Error(
      `Erro ao obter ocorrências: HTTP ${response.status}`
    );
  }

  return response.json();
}
