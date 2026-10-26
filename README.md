Petra — Monitoramento Geográfico Inteligente de Focos de Incêndio
1. Sobre o projeto
O Petra é uma plataforma de monitoramento geográfico de focos de incêndio que utiliza dados de detecção por satélite para visualizar ocorrências em um mapa interativo e identificar concentrações geográficas de atividade térmica.

O projeto integra dados do NASA FIRMS (Fire Information for Resource Management System) a uma aplicação web com backend em Python, banco de dados geográfico e frontend interativo. Também incorpora um módulo de análise baseado em agrupamento espacial e classificação heurística de prioridade.

O objetivo é facilitar a visualização e a análise de ocorrências, contribuindo para o monitoramento ambiental e para a identificação de áreas que merecem atenção.
2. Problema que o projeto busca resolver
Incêndios florestais e queimadas podem causar impactos ambientais, sociais e econômicos. O acompanhamento dessas ocorrências exige a análise de dados geográficos que, sem ferramentas adequadas de visualização, podem ser difíceis de interpretar.

O Petra busca tornar essas informações mais acessíveis por meio de um mapa interativo, filtros de consulta e análises espaciais que ajudam a identificar concentrações de detecções.

A plataforma tem caráter de apoio ao monitoramento. Seus resultados não substituem a confirmação em campo nem os sistemas oficiais de prevenção e resposta a incêndios.
3. Objetivos
- Consultar e armazenar dados de detecções de focos de calor.
- Exibir ocorrências georreferenciadas em um mapa interativo.
- Permitir a visualização de informações como data, fonte, confiança e potência radiativa do fogo.
- Agrupar detecções geograficamente próximas.
- Calcular indicadores descritivos para apoiar a identificação de áreas prioritárias.
- Disponibilizar uma arquitetura que permita futuras integrações com outras fontes ambientais e técnicas de análise.
4. Funcionalidades
Monitoramento geográfico
O frontend apresenta um mapa interativo baseado em Leaflet e OpenStreetMap, com marcadores que representam as detecções disponíveis na API.
Consulta de ocorrências
Os dados podem incluir:
- Coordenadas geográficas;
- Data e horário da detecção;
- Fonte dos dados;
- Nível de confiança informado pela fonte;
- FRP (Fire Radiative Power);
- Satélite e instrumento responsáveis pela detecção.
A disponibilidade de cada informação depende dos dados retornados pela API.
Integração com NASA FIRMS
O backend possui integração com o NASA FIRMS para importar dados de detecção de atividade térmica por satélite.

A disponibilidade e a atualização dos registros dependem da fonte consultada e do processo de importação.
Agrupamento espacial
O módulo de análise utiliza DBSCAN para agrupar detecções geograficamente próximas, considerando um raio configurável e os filtros disponíveis.

Os agrupamentos ajudam a identificar regiões com concentração de ocorrências.
Classificação heurística de prioridade
O sistema calcula uma pontuação indicativa de prioridade com base em critérios como:
- Quantidade de detecções no agrupamento;
- FRP médio;
- Proporção de detecções classificadas com confiança alta.
A pontuação é convertida em níveis de prioridade: baixa, moderada, alta e crítica.

Essa classificação é heurística e descritiva. Não representa uma previsão validada de incêndios futuros, não estima probabilidades de propagação e não constitui uma avaliação oficial de risco ambiental.
Visualização otimizada
O frontend utiliza estratégias para reduzir o custo de renderização do mapa, incluindo a limitação de marcadores exibidos simultaneamente. A API e os registros armazenados não são limitados por essa regra visual.
5. Tecnologias utilizadas
Backend
- Python 3.10 ou versão compatível com as dependências do projeto;
- FastAPI;
- SQLAlchemy;
- GeoAlchemy2;
- PostgreSQL;
- PostGIS;
- NumPy;
- DBSCAN para agrupamento espacial;
- HTTPX para comunicação HTTP;
- Pydantic Settings para configuração da aplicação.
Frontend
- React;
- TypeScript;
- Vite;
- Leaflet;
- React-Leaflet;
- OpenStreetMap.
Fontes de dados e infraestrutura
- NASA FIRMS para dados de detecção de atividade térmica;
- OpenStreetMap para a camada cartográfica;
- Neon para hospedagem do banco de dados PostgreSQL;
- Render para hospedagem da API/backend;
- Vercel para hospedagem do frontend.
6. Arquitetura do projeto
O Petra está organizado em duas aplicações principais (backend e frontend), com serviços de hospedagem separados para a API, o banco de dados e a interface web.
Petra/
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   │   ├── models/
│   │   │   └── services/
│   │   ├── database/
│   │   └── ...
│   ├── requirements.txt
│   └── .env (local; não versionar)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── FireMap.tsx
│   │   ├── services/
│   │   │   ├── fireService.ts
│   │   │   └── hotspotService.ts
│   │   └── ...
│   ├── package.json
│   └── .gitignore
│
└── README.md
A estrutura acima apresenta os diretórios e arquivos principais conhecidos do projeto. Outros módulos podem existir no repositório.
Fluxo de funcionamento
1. O backend consulta a fonte de dados e importa as detecções.
2. Os registros são armazenados no PostgreSQL, com suporte geográfico por meio do PostGIS.
3. A API disponibiliza os registros e os resultados das análises.
4. O frontend consulta a API e apresenta as ocorrências no mapa.
5. O módulo de agrupamento analisa a distribuição espacial e calcula indicadores descritivos para os agrupamentos encontrados.
7. Requisitos
Para executar o projeto localmente, são necessários:
- Python instalado;
- Node.js e npm;
- Uma instância PostgreSQL acessível (o ambiente publicado utiliza Neon);
- PostGIS habilitado no banco de dados;
- Uma chave de acesso válida do NASA FIRMS para os endpoints que a exigirem;
- Git para obter e versionar o código-fonte.
As versões exatas das dependências devem ser verificadas nos arquivos de configuração do repositório.
8. Configuração do backend
Criar o ambiente virtual
No terminal, entre na pasta do backend:
cd backend
python -m venv .venv
Ative o ambiente virtual no Windows:
.\.venv\Scripts\Activate.ps1
Instale as dependências:
python -m pip install -r requirements.txt
Configurar as variáveis de ambiente
Crie um arquivo .env na pasta backend, utilizando como referência as configurações exigidas pelo código da aplicação.

As variáveis principais incluem:
DATABASE_URL=sua_url_de_conexao_postgresql
NASA_FIRMS_MAP_KEY=sua_chave_nasa_firms
Os valores acima são exemplos de configuração. Devem ser substituídos pelos valores reais do ambiente.

O banco de dados precisa estar criado e configurado de acordo com os modelos e os requisitos geográficos utilizados pelo backend. No ambiente publicado, o PostgreSQL é hospedado no Neon.

Não publique o arquivo .env, chaves de API, senhas ou credenciais no GitHub.
Executar o backend
A partir da pasta backend, execute:
python -m uvicorn app.main:app --reload
Esse comando pressupõe que app.main seja o módulo que inicializa a aplicação FastAPI no repositório.

Quando o servidor estiver em execução, a documentação interativa da API poderá ser acessada em:

http://127.0.0.1:8000/docs
9. Configuração do frontend
Em outro terminal, entre na pasta do frontend:
cd frontend
npm install
Configurar o endereço da API
O frontend aceita a variável de ambiente VITE_API_URL.

Para utilizar uma API local, crie um arquivo .env.local na pasta frontend:
VITE_API_URL=http://127.0.0.1:8000
Se a variável não estiver definida, os serviços do frontend utilizam o endereço padrão configurado no código:

https://petra-api-2ofy.onrender.com

Esse é o endereço configurado como padrão para a API publicada no Render. A disponibilidade depende do serviço implantado.
Executar o frontend
npm run dev
O Vite exibirá o endereço local da aplicação no terminal.
Gerar a versão de produção
npm run build
O comando verifica a compilação do frontend e gera os arquivos de produção conforme a configuração do projeto.
10. Deploy e serviços publicados
A arquitetura publicada utiliza os seguintes serviços:
- Frontend: Vercel.
- Backend/API: Render.
- Banco de dados PostgreSQL/PostGIS: Neon.
As URLs e credenciais devem ser configuradas nas variáveis de ambiente de cada serviço. Não inclua senhas, tokens ou chaves reais neste README nem no repositório. Para desenvolvimento local, use arquivos .env ignorados pelo Git; em produção, configure os segredos no painel do serviço correspondente.
11. Endpoints da API
Entre as operações utilizadas pelo projeto estão:
Método	Endpoint	Descrição
GET	/api/fires/	Consulta as ocorrências disponíveis.
POST	/api/fires/import	Aciona o processo de importação de detecções.
GET	/api/ai/hotspots	Consulta os agrupamentos espaciais e seus indicadores.


Os parâmetros aceitos, os formatos das respostas e os requisitos de autenticação, quando existentes, devem ser consultados na documentação gerada pelo FastAPI.
12. Inteligência artificial e análise de dados
O módulo de análise do Petra utiliza métodos computacionais para processar detecções e identificar padrões espaciais.

O algoritmo DBSCAN agrupa pontos com base na proximidade geográfica e nos parâmetros definidos para a análise. Posteriormente, regras heurísticas calculam indicadores de prioridade para cada agrupamento.

É importante distinguir as funcionalidades implementadas das possibilidades futuras:
- Implementado no módulo descrito: agrupamento espacial e classificação heurística baseada em indicadores.
- Possibilidades futuras: modelos de aprendizado de máquina treinados e validados com dados históricos, integração de variáveis meteorológicas, análise temporal e estimativas preditivas.
A classificação heurística atual não deve ser apresentada como um modelo de aprendizado de máquina treinado nem como um sistema validado de previsão de incêndios.
13. Segurança e boas práticas
- Manter chaves de API e credenciais fora do controle de versão.
- Não publicar arquivos .env ou dados sensíveis.
- Utilizar variáveis de ambiente para configurar os serviços.
- Validar os dados geográficos antes de processá-los.
- Revisar as dependências e manter os pacotes atualizados.
- Configurar adequadamente as permissões e a conectividade do banco de dados.
- Verificar a configuração de CORS e HTTPS nos ambientes publicados.
- Realizar testes antes de disponibilizar novas versões.
14. Limitações atuais
Os resultados dependem da disponibilidade, da cobertura e da qualidade dos dados de satélite.

Uma detecção térmica não confirma isoladamente a existência, a extensão ou a causa de um incêndio. Além disso, a ausência de detecções não garante a ausência de fogo.

Os agrupamentos e níveis de prioridade são instrumentos de análise exploratória e apoio à interpretação dos dados. Sua utilidade operacional depende de validação adicional e de informações complementares.

A disponibilidade dos serviços publicados depende da infraestrutura de hospedagem e da configuração da API, do banco Neon e do frontend na Vercel.
15. Possíveis evoluções
Entre as melhorias que podem ampliar as capacidades do Petra estão:
- Integração com dados do Programa Queimadas do INPE;
- Incorporação de variáveis meteorológicas;
- Análise da evolução temporal das detecções;
- Desenvolvimento e validação de modelos de aprendizado de máquina;
- Indicadores de tendência e persistência de atividade térmica;
- Melhorias de acessibilidade e experiência em dispositivos móveis;
- Testes automatizados para o backend, frontend e integração;
- Monitoramento de disponibilidade e qualidade dos dados.
Essas evoluções dependem de implementação, disponibilidade das fontes e validação dos resultados.
16. Fontes e referências
- NASA FIRMS — Fire Information for Resource Management System:
  https://firms.modaps.eosdis.nasa.gov/active_fire/
- INPE — Programa Queimadas:
  https://data.inpe.br/queimadas/
- OpenStreetMap:
  https://www.openstreetmap.org/
- FastAPI:
  https://fastapi.tiangolo.com/
- React:
  https://react.dev/
- Leaflet:
  https://leafletjs.com/
- PostgreSQL:
  https://www.postgresql.org/
- PostGIS:
  https://postgis.net/
17. Licença
A licença do projeto deve ser definida pelos responsáveis pelo Petra. Até que uma licença seja adicionada ao repositório, não presuma que o código esteja disponível para reutilização irrestrita.
Petra — Monitoramento geográfico inteligente para apoiar a proteção ambiental.
