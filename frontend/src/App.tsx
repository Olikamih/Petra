import { useEffect, useMemo, useState } from "react";

import FireMap from "./components/FireMap";
import {
  getFires,
  type Fire,
} from "./services/fireService";
import {
  getHotspots,
  type Hotspot,
} from "./services/hotspotService";

import "./style.css";

function formatConfidence(value: string | null): string {
  if (!value) return "Não informada";

  const normalized = value.trim().toLowerCase();

  const labels: Record<string, string> = {
    l: "Baixa",
    low: "Baixa",
    n: "Nominal",
    nominal: "Nominal",
    h: "Alta",
    high: "Alta",
  };

  return labels[normalized] ?? value;
}

function App() {
  const [fires, setFires] = useState<Fire[]>([]);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [showHotspots, setShowHotspots] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hotspotError, setHotspotError] = useState<string | null>(null);

  const [sourceFilter, setSourceFilter] = useState("all");
  const [confidenceFilter, setConfidenceFilter] = useState("all");

  useEffect(() => {
    async function loadFires() {
      try {
        const data = await getFires();
        setFires(data);
      } catch (err) {
        console.error("Erro ao carregar detecções:", err);
        setError("Não foi possível carregar as ocorrências.");
      } finally {
        setLoading(false);
      }
    }

    loadFires();
  }, []);

 useEffect(() => {
  let cancelled = false;

  async function loadHotspots() {
    try {
      setHotspotError(null);

      const data = await getHotspots(
        sourceFilter,
        confidenceFilter
      );

      if (!cancelled) {
        setHotspots(data.clusters);
      }
    } catch (err) {
      console.error("Erro ao carregar agrupamentos:", err);

      if (!cancelled) {
        setHotspotError(
          "Não foi possível carregar os agrupamentos do DBSCAN."
        );
      }
    }
  }

  loadHotspots();

  return () => {
    cancelled = true;
  };
}, [sourceFilter, confidenceFilter]);

  const sources = useMemo(
    () => [...new Set(fires.map((fire) => fire.source))],
    [fires]
  );

  const confidences = useMemo(
    () => [
      ...new Set(
        fires
          .map((fire) => fire.confidence)
          .filter((value): value is string => value !== null)
      ),
    ],
    [fires]
  );

  const filteredFires = useMemo(
    () =>
      fires.filter((fire) => {
        const matchesSource =
          sourceFilter === "all" || fire.source === sourceFilter;

        const matchesConfidence =
          confidenceFilter === "all" ||
          fire.confidence === confidenceFilter;

        return matchesSource && matchesConfidence;
      }),
    [fires, sourceFilter, confidenceFilter]
  );

  const totalFrp = filteredFires.reduce(
    (total, fire) => total + (fire.frp ?? 0),
    0
  );

  if (loading) {
    return <main className="status">Carregando Petra...</main>;
  }

  if (error) {
    return <main className="status error">{error}</main>;
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">MONITORAMENTO AMBIENTAL</p>
          <h1>Petra</h1>
          <p className="subtitle">
            Monitoramento geográfico de detecções de incêndios.
          </p>
        </div>

        <span className="status-badge">NASA FIRMS · API</span>
      </header>

      <section className="metrics">
        <article className="metric-card">
          <span>Detecções exibidas</span>
          <strong>{filteredFires.length.toLocaleString("pt-BR")}</strong>
          <small>De {fires.length.toLocaleString("pt-BR")} registros carregados</small>
        </article>

        <article className="metric-card">
          <span>FRP acumulado</span>
          <strong>
            {totalFrp.toLocaleString("pt-BR", {
              maximumFractionDigits: 2,
            })}
          </strong>
          <small>MW · soma dos valores disponíveis</small>
        </article>

        <article className="metric-card">
          <span>Áreas de concentração</span>
          <strong>{hotspots.length.toLocaleString("pt-BR")}</strong>
          <small>Clusters identificados pelo DBSCAN</small>
        </article>
      </section>

      <section className="filters">
        <label>
          Fonte
          <select
            value={sourceFilter}
            onChange={(event) => setSourceFilter(event.target.value)}
          >
            <option value="all">Todas as fontes</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </label>

        <label>
          Confiança
          <select
            value={confidenceFilter}
            onChange={(event) => setConfidenceFilter(event.target.value)}
          >
            <option value="all">Todas as classificações</option>
            {confidences.map((confidence) => (
              <option key={confidence} value={confidence}>
                {formatConfidence(confidence)}
              </option>
            ))}
          </select>
        </label>

        <button
          className="reset-button"
          onClick={() => {
            setSourceFilter("all");
            setConfidenceFilter("all");
          }}
        >
          Limpar filtros
        </button>
      </section>

      <section className="map-section">
        <div className="section-heading">
          <h2>Mapa de detecções</h2>
          <span>{filteredFires.length} pontos</span>
        </div>

        <div className="map-controls">
          <button
            className="reset-button"
            onClick={() => setShowHotspots((current) => !current)}
          >
            {showHotspots
              ? "Ocultar áreas de concentração"
              : "Mostrar áreas de concentração"}
          </button>

          <span>
            {showHotspots
              ? `${hotspots.length} agrupamentos`
              : "Camada de agrupamentos oculta"}
          </span>
        </div>

        {hotspotError && (
          <p className="error-message">{hotspotError}</p>
        )}

        {filteredFires.length > 0 ? (
          <FireMap
            fires={filteredFires}
            hotspots={hotspots}
            showHotspots={showHotspots}
          />
        ) : (
          <div className="empty-state">
            Nenhuma ocorrência corresponde aos filtros selecionados.
          </div>
        )}
      </section>

      <footer className="dashboard-footer">
        Petra · Dados fornecidos pela API do projeto.
      </footer>
    </main>
  );
}

export default App;