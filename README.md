# Petra â€” Monitoramento GeogrÃ¡fico Inteligente de Focos de IncÃªndio

## 1. Sobre o projeto

O Petra Ã© uma plataforma de monitoramento geogrÃ¡fico de focos de incÃªndio que utiliza dados de detecÃ§Ã£o por satÃ©lite para visualizar ocorrÃªncias em um mapa interativo e identificar concentraÃ§Ãµes geogrÃ¡ficas de atividade tÃ©rmica.

O projeto integra dados do NASA FIRMS (Fire Information for Resource Management System) a uma aplicaÃ§Ã£o web com backend em Python, banco de dados geogrÃ¡fico e frontend interativo. TambÃ©m incorpora um mÃ³dulo de anÃ¡lise baseado em agrupamento espacial e classificaÃ§Ã£o heurÃ­stica de prioridade.

O objetivo Ã© facilitar a visualizaÃ§Ã£o e a anÃ¡lise de ocorrÃªncias, contribuindo para o monitoramento ambiental e para a identificaÃ§Ã£o de Ã¡reas que merecem atenÃ§Ã£o.

## 2. Problema que o projeto busca resolver

IncÃªndios florestais e queimadas podem causar impactos ambientais, sociais e econÃ´micos. O acompanhamento dessas ocorrÃªncias exige a anÃ¡lise de dados geogrÃ¡ficos que, sem ferramentas adequadas de visualizaÃ§Ã£o, podem ser difÃ­ceis de interpretar.

O Petra busca tornar essas informaÃ§Ãµes mais acessÃ­veis por meio de um mapa interativo, filtros de consulta e anÃ¡lises espaciais que ajudam a identificar concentraÃ§Ãµes de detecÃ§Ãµes.

A plataforma tem carÃ¡ter de apoio ao monitoramento. Seus resultados nÃ£o substituem a confirmaÃ§Ã£o em campo nem os sistemas oficiais de prevenÃ§Ã£o e resposta a incÃªndios.

## 3. Objetivos

- Consultar e armazenar dados de detecÃ§Ãµes de focos de calor.
- Exibir ocorrÃªncias georreferenciadas em um mapa interativo.
- Permitir a visualizaÃ§Ã£o de informaÃ§Ãµes como data, fonte, confianÃ§a e potÃªncia radiativa do fogo.
- Agrupar detecÃ§Ãµes geograficamente prÃ³ximas.
- Calcular indicadores descritivos para apoiar a identificaÃ§Ã£o de Ã¡reas prioritÃ¡rias.
- Disponibilizar uma arquitetura que permita futuras integraÃ§Ãµes com outras fontes ambientais e tÃ©cnicas de anÃ¡lise.

## 4. Funcionalidades

### Monitoramento geogrÃ¡fico

O frontend apresenta um mapa interativo baseado em Leaflet e OpenStreetMap, com marcadores que representam as detecÃ§Ãµes disponÃ­veis na API.

### Consulta de ocorrÃªncias

Os dados podem incluir:

- Coordenadas geogrÃ¡ficas;
- Data e horÃ¡rio da detecÃ§Ã£o;
- Fonte dos dados;
- NÃ­vel de confianÃ§a informado pela fonte;
- FRP (*Fire Radiative Power*);
- SatÃ©lite e instrumento responsÃ¡veis pela detecÃ§Ã£o.

A disponibilidade de cada informaÃ§Ã£o depende dos dados retornados pela API.

### IntegraÃ§Ã£o com NASA FIRMS

O backend possui integraÃ§Ã£o com o NASA FIRMS para importar dados de detecÃ§Ã£o de atividade tÃ©rmica por satÃ©lite.

A disponibilidade e a atualizaÃ§Ã£o dos registros dependem da fonte consultada e do processo de importaÃ§Ã£o.

### Agrupamento espacial

O mÃ³dulo de anÃ¡lise utiliza DBSCAN para agrupar detecÃ§Ãµes geograficamente prÃ³ximas, considerando um raio configurÃ¡vel e os filtros disponÃ­veis.

Os agrupamentos ajudam a identificar regiÃµes com concentraÃ§Ã£o de ocorrÃªncias.

### ClassificaÃ§Ã£o heurÃ­stica de prioridade

O sistema calcula uma pontuaÃ§Ã£o indicativa de prioridade com base em critÃ©rios como:

- Quantidade de detecÃ§Ãµes no agrupamento;
- FRP mÃ©dio;
- ProporÃ§Ã£o de detecÃ§Ãµes classificadas com confianÃ§a alta.

A pontuaÃ§Ã£o Ã© convertida em nÃ­veis de prioridade: baixa, moderada, alta e crÃ­tica.

Essa classificaÃ§Ã£o Ã© heurÃ­stica e descritiva. NÃ£o representa uma previsÃ£o validada de incÃªndios futuros, nÃ£o estima probabilidades de propagaÃ§Ã£o e nÃ£o constitui uma avaliaÃ§Ã£o oficial de risco ambiental.

### VisualizaÃ§Ã£o otimizada

O frontend utiliza estratÃ©gias para reduzir o custo de renderizaÃ§Ã£o do mapa, incluindo a limitaÃ§Ã£o de marcadores exibidos simultaneamente. A API e os registros armazenados nÃ£o sÃ£o limitados por essa regra visual.

## 5. Tecnologias utilizadas

### Backend

- Python 3.10 ou versÃ£o compatÃ­vel com as dependÃªncias do projeto;
- FastAPI;
- SQLAlchemy;
- GeoAlchemy2;
- PostgreSQL;
- PostGIS;
- NumPy;
- DBSCAN para agrupamento espacial;
- HTTPX para comunicaÃ§Ã£o HTTP;
- Pydantic Settings para configuraÃ§Ã£o da aplicaÃ§Ã£o.

### Frontend

- React;
- TypeScript;
- Vite;
- Leaflet;
- React-Leaflet;
- OpenStreetMap.

### Fontes de dados e infraestrutura

- NASA FIRMS para dados de detecÃ§Ã£o de atividade tÃ©rmica;
- OpenStreetMap para a camada cartogrÃ¡fica;
- Render como endereÃ§o de API configurado no frontend, sujeito Ã  disponibilidade do serviÃ§o implantado.

## 6. Arquitetura do projeto

O Petra estÃ¡ organizado em duas aplicaÃ§Ãµes principais.

```text
Petra/
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ app/
â”‚   â”‚   â”œâ”€â”€ ai/
â”‚   â”‚   â”‚   â”œâ”€â”€ models/
â”‚   â”‚   â”‚   â””â”€â”€ services/
â”‚   â”‚   â”œâ”€â”€ database/
â”‚   â”‚   â””â”€â”€ ...
â”‚   â”œâ”€â”€ requirements.txt
â”‚   â””â”€â”€ .env
â”‚
â”œâ”€â”€ frontend/
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”‚   â””â”€â”€ FireMap.tsx
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â”‚   â”œâ”€â”€ fireService.ts
â”‚   â”‚   â”‚   â””â”€â”€ hotspotService.ts
â”‚   â”‚   â””â”€â”€ ...
â”‚   â”œâ”€â”€ package.json
â”‚   â””â”€â”€ .gitignore
â”‚
â””â”€â”€ README.md
```

A estrutura acima apresenta os diretÃ³rios e arquivos principais conhecidos do projeto. Outros mÃ³dulos podem existir no repositÃ³rio.

### Fluxo de funcionamento

1. O backend consulta a fonte de dados e importa as detecÃ§Ãµes.
2. Os registros sÃ£o armazenados no PostgreSQL, com suporte geogrÃ¡fico por meio do PostGIS.
3. A API disponibiliza os registros e os resultados das anÃ¡lises.
4. O frontend consulta a API e apresenta as ocorrÃªncias no mapa.
5. O mÃ³dulo de agrupamento analisa a distribuiÃ§Ã£o espacial e calcula indicadores descritivos para os agrupamentos encontrados.

## 7. Requisitos

Para executar o projeto localmente, sÃ£o necessÃ¡rios:

- Python instalado;
- Node.js e npm;
- PostgreSQL;
- PostGIS habilitado no banco de dados;
- Uma chave de acesso vÃ¡lida do NASA FIRMS para os endpoints que a exigirem;
- Git para obter e versionar o cÃ³digo-fonte.

As versÃµes exatas das dependÃªncias devem ser verificadas nos arquivos de configuraÃ§Ã£o do repositÃ³rio.

## 8. ConfiguraÃ§Ã£o do backend

### Criar o ambiente virtual

No terminal, entre na pasta do backend:

```powershell
cd backend
python -m venv .venv
```

Ative o ambiente virtual no Windows:

```powershell
.\.venv\Scripts\Activate.ps1
```

Instale as dependÃªncias:

```powershell
python -m pip install -r requirements.txt
```

### Configurar as variÃ¡veis de ambiente

Crie um arquivo `.env` na pasta `backend`, utilizando como referÃªncia as configuraÃ§Ãµes exigidas pelo cÃ³digo da aplicaÃ§Ã£o.

As variÃ¡veis principais incluem:

```dotenv
DATABASE_URL=sua_url_de_conexao_postgresql
NASA_FIRMS_MAP_KEY=sua_chave_nasa_firms
```

Os valores acima sÃ£o exemplos de configuraÃ§Ã£o. Devem ser substituÃ­dos pelos valores reais do ambiente.

O banco de dados precisa estar criado e configurado de acordo com os modelos e os requisitos geogrÃ¡ficos utilizados pelo backend.

NÃ£o publique o arquivo `.env`, chaves de API, senhas ou credenciais no GitHub.

### Executar o backend

A partir da pasta `backend`, execute:

```powershell
python -m uvicorn app.main:app --reload
```

Esse comando pressupÃµe que `app.main` seja o mÃ³dulo que inicializa a aplicaÃ§Ã£o FastAPI no repositÃ³rio.

Quando o servidor estiver em execuÃ§Ã£o, a documentaÃ§Ã£o interativa da API poderÃ¡ ser acessada em:

`http://127.0.0.1:8000/docs`

## 9. ConfiguraÃ§Ã£o do frontend

Em outro terminal, entre na pasta do frontend:

```powershell
cd frontend
npm install
```

### Configurar o endereÃ§o da API

O frontend aceita a variÃ¡vel de ambiente `VITE_API_URL`.

Para utilizar uma API local, crie um arquivo `.env.local` na pasta `frontend`:

```dotenv
VITE_API_URL=http://127.0.0.1:8000
```

Se a variÃ¡vel nÃ£o estiver definida, os serviÃ§os do frontend utilizam o endereÃ§o padrÃ£o configurado no cÃ³digo:

`https://petra-api-2ofy.onrender.com`

Esse endereÃ§o corresponde Ã  configuraÃ§Ã£o presente no cÃ³digo e deve ser confirmado antes de utilizar a aplicaÃ§Ã£o em produÃ§Ã£o.

### Executar o frontend

```powershell
npm run dev
```

O Vite exibirÃ¡ o endereÃ§o local da aplicaÃ§Ã£o no terminal.

### Gerar a versÃ£o de produÃ§Ã£o

```powershell
npm run build
```

O comando verifica a compilaÃ§Ã£o do frontend e gera os arquivos de produÃ§Ã£o conforme a configuraÃ§Ã£o do projeto.

## 10. Endpoints da API

Entre as operaÃ§Ãµes utilizadas pelo projeto estÃ£o:

| MÃ©todo | Endpoint | DescriÃ§Ã£o |
|---|---|---|
| GET | `/api/fires/` | Consulta as ocorrÃªncias disponÃ­veis. |
| POST | `/api/fires/import` | Aciona o processo de importaÃ§Ã£o de detecÃ§Ãµes. |
| GET | `/api/ai/hotspots` | Consulta os agrupamentos espaciais e seus indicadores. |

Os parÃ¢metros aceitos, os formatos das respostas e os requisitos de autenticaÃ§Ã£o, quando existentes, devem ser consultados na documentaÃ§Ã£o gerada pelo FastAPI.

## 11. InteligÃªncia artificial e anÃ¡lise de dados

O mÃ³dulo de anÃ¡lise do Petra utiliza mÃ©todos computacionais para processar detecÃ§Ãµes e identificar padrÃµes espaciais.

O algoritmo DBSCAN agrupa pontos com base na proximidade geogrÃ¡fica e nos parÃ¢metros definidos para a anÃ¡lise. Posteriormente, regras heurÃ­sticas calculam indicadores de prioridade para cada agrupamento.

Ã‰ importante distinguir as funcionalidades implementadas das possibilidades futuras:

- **Implementado no mÃ³dulo descrito:** agrupamento espacial e classificaÃ§Ã£o heurÃ­stica baseada em indicadores.
- **Possibilidades futuras:** modelos de aprendizado de mÃ¡quina treinados e validados com dados histÃ³ricos, integraÃ§Ã£o de variÃ¡veis meteorolÃ³gicas, anÃ¡lise temporal e estimativas preditivas.

A classificaÃ§Ã£o heurÃ­stica atual nÃ£o deve ser apresentada como um modelo de aprendizado de mÃ¡quina treinado nem como um sistema validado de previsÃ£o de incÃªndios.

## 12. SeguranÃ§a e boas prÃ¡ticas

- Manter chaves de API e credenciais fora do controle de versÃ£o.
- NÃ£o publicar arquivos `.env` ou dados sensÃ­veis.
- Utilizar variÃ¡veis de ambiente para configurar os serviÃ§os.
- Validar os dados geogrÃ¡ficos antes de processÃ¡-los.
- Revisar as dependÃªncias e manter os pacotes atualizados.
- Configurar adequadamente as permissÃµes e a conectividade do banco de dados.
- Verificar a configuraÃ§Ã£o de CORS e HTTPS nos ambientes publicados.
- Realizar testes antes de disponibilizar novas versÃµes.

## 13. LimitaÃ§Ãµes atuais

Os resultados dependem da disponibilidade, da cobertura e da qualidade dos dados de satÃ©lite.

Uma detecÃ§Ã£o tÃ©rmica nÃ£o confirma isoladamente a existÃªncia, a extensÃ£o ou a causa de um incÃªndio. AlÃ©m disso, a ausÃªncia de detecÃ§Ãµes nÃ£o garante a ausÃªncia de fogo.

Os agrupamentos e nÃ­veis de prioridade sÃ£o instrumentos de anÃ¡lise exploratÃ³ria e apoio Ã  interpretaÃ§Ã£o dos dados. Sua utilidade operacional depende de validaÃ§Ã£o adicional e de informaÃ§Ãµes complementares.

A disponibilidade dos serviÃ§os publicados tambÃ©m depende da infraestrutura de hospedagem e da configuraÃ§Ã£o da API.

## 14. PossÃ­veis evoluÃ§Ãµes

Entre as melhorias que podem ampliar as capacidades do Petra estÃ£o:

- IntegraÃ§Ã£o com dados do Programa Queimadas do INPE;
- IncorporaÃ§Ã£o de variÃ¡veis meteorolÃ³gicas;
- AnÃ¡lise da evoluÃ§Ã£o temporal das detecÃ§Ãµes;
- Desenvolvimento e validaÃ§Ã£o de modelos de aprendizado de mÃ¡quina;
- Indicadores de tendÃªncia e persistÃªncia de atividade tÃ©rmica;
- Melhorias de acessibilidade e experiÃªncia em dispositivos mÃ³veis;
- Testes automatizados para o backend, frontend e integraÃ§Ã£o;
- Monitoramento de disponibilidade e qualidade dos dados.

Essas evoluÃ§Ãµes dependem de implementaÃ§Ã£o, disponibilidade das fontes e validaÃ§Ã£o dos resultados.

## 15. Fontes e referÃªncias

- **NASA FIRMS â€” Fire Information for Resource Management System:**
  https://firms.modaps.eosdis.nasa.gov/active_fire/

- **INPE â€” Programa Queimadas:**
  https://data.inpe.br/queimadas/

- **OpenStreetMap:**
  https://www.openstreetmap.org/

- **FastAPI:**
  https://fastapi.tiangolo.com/

- **React:**
  https://react.dev/

- **Leaflet:**
  https://leafletjs.com/

- **PostgreSQL:**
  https://www.postgresql.org/

- **PostGIS:**
  https://postgis.net/

## 16. LicenÃ§a

A licenÃ§a do projeto deve ser definida pelos responsÃ¡veis pelo Petra. AtÃ© que uma licenÃ§a seja adicionada ao repositÃ³rio, nÃ£o presuma que o cÃ³digo esteja disponÃ­vel para reutilizaÃ§Ã£o irrestrita.

---

**Petra â€” Monitoramento geogrÃ¡fico inteligente para apoiar a proteÃ§Ã£o ambiental.**
