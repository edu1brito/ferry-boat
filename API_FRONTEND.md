# API Ferry Bot - Guia para Frontend

## 📌 Visão Geral

Backend desenvolvido em Node.js + Express que fornece APIs REST para o sistema Ferry Bot.

**Servidor:** `http://localhost:3000`
**Armazenamento:** Em memória (dados perdidos ao reiniciar)
**CORS:** Habilitado para todos os domínios

---

## 📡 Endpoints da API

### 1. Simulações

#### 1.1 Simulação Normal (sem reservas)
```http
POST /simular
Content-Type: application/json

{}
```

**Resposta:**
```json
{
  "sucesso": true,
  "resultados": {
    "tempoSimulacao": 16,
    "veiculosProcessados": 1610,
    "veiculosNaoAtendidos": 71,
    "tempoMedioEspera": 30.62,
    "utilizacaoEmbarcacoes": [
      {
        "id": 1,
        "percentualUtilizacao": 100,
        "viagensRealizadas": 32
      }
    ],
    "viagensRealizadas": 128
  }
}
```

---

#### 1.2 Simulação com Reservas
```http
POST /simular/com-reservas
Content-Type: application/json

{
  "percentualReservas": 0.3
}
```

**Resposta:**
```json
{
  "sucesso": true,
  "percentualReservasSimulado": 0.3,
  "resumo": {
    "tempoMedioEsperaGeral": "29.23 min",
    "tempoMedioReservas": "18.77 min",
    "tempoMedioNormais": "33.74 min",
    "diferenca": "14.97 min",
    "veiculosProcessados": 1556
  },
  "detalhes": {
    "tempoSimulacao": 16,
    "veiculosProcessados": 1556,
    "veiculosNaoAtendidos": 77,
    "tempoMedioEspera": 29.23,
    "tempoMedioEsperaReservas": 18.77,
    "tempoMedioEsperaNormais": 33.74,
    "utilizacaoEmbarcacoes": [...],
    "viagensRealizadas": 128
  },
  "analise": {
    "mensagem": "Comparativo entre usuários com e sem reserva",
    "diferencaTempo": "14.97 min",
    "tempoMedioComReserva": "18.77 min",
    "tempoMedioSemReserva": "33.74 min"
  }
}
```

---

### 2. Relatórios de 15 Dias

#### 2.1 Gerar Relatório Consolidado
```http
GET /relatorios
```

**Resposta:**
```json
{
  "sucesso": true,
  "mensagem": "Relatório de 15 dias gerado com sucesso",
  "relatorio": {
    "dataGeracao": "11/11/2025 10:30:00",
    "periodo": "15 dias de operação (28/10/2025 a 11/11/2025)",

    "historico": {
      "normal": [
        {
          "dia": 1,
          "data": "28/10/2025",
          "tempoMedioEspera": 30.62,
          "veiculosProcessados": 1610,
          "veiculosNaoAtendidos": 71,
          "utilizacaoMedia": 100,
          "viagensRealizadas": 128
        }
      ],
      "comReservas": [
        {
          "dia": 1,
          "data": "28/10/2025",
          "tempoMedioEspera": 29.23,
          "tempoMedioReservas": 18.77,
          "tempoMedioNormais": 33.74,
          "veiculosProcessados": 1556,
          "veiculosNaoAtendidos": 77,
          "utilizacaoMedia": 100,
          "viagensRealizadas": 128,
          "diferenca": 14.97
        }
      ]
    },

    "graficos": {
      "temposPorDia": {
        "labels": ["28/10/2025", "29/10/2025", ...],
        "datasets": [
          {
            "label": "Sistema Normal",
            "data": ["30.62", "31.15", ...],
            "borderColor": "#FF6384",
            "backgroundColor": "rgba(255, 99, 132, 0.2)"
          },
          {
            "label": "Com Reservas (Geral)",
            "data": ["29.23", "28.97", ...],
            "borderColor": "#36A2EB"
          },
          {
            "label": "Com Reserva (30%)",
            "data": ["18.77", "19.05", ...],
            "borderColor": "#4BC0C0"
          },
          {
            "label": "Sem Reserva (70%)",
            "data": ["33.74", "32.88", ...],
            "borderColor": "#FF9F40"
          }
        ]
      },

      "comparacaoMedia": {
        "labels": ["Normal", "Com Reservas (Geral)", "Com Reserva (30%)", "Sem Reserva (70%)"],
        "datasets": [{
          "label": "Tempo Médio de Espera (min)",
          "data": ["30.62", "29.23", "18.77", "33.74"],
          "backgroundColor": [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 159, 64, 0.6)"
          ]
        }]
      },

      "distribuicaoVeiculos": {
        "labels": ["Com Reserva (30%)", "Sem Reserva (70%)"],
        "datasets": [{
          "data": [30, 70],
          "backgroundColor": [
            "rgba(75, 192, 192, 0.8)",
            "rgba(255, 159, 64, 0.8)"
          ]
        }]
      },

      "diferencaPorDia": {
        "labels": ["28/10/2025", ...],
        "datasets": [{
          "label": "Diferença (Sem Reserva - Com Reserva)",
          "data": ["14.97", "13.83", ...],
          "borderColor": "#9966FF",
          "backgroundColor": "rgba(153, 102, 255, 0.2)",
          "fill": true
        }]
      },

      "veiculosPorDia": {
        "labels": ["28/10/2025", ...],
        "datasets": [
          {
            "label": "Sistema Normal",
            "data": [1610, 1598, ...],
            "backgroundColor": "rgba(255, 99, 132, 0.6)"
          },
          {
            "label": "Com Reservas",
            "data": [1556, 1570, ...],
            "backgroundColor": "rgba(54, 162, 235, 0.6)"
          }
        ]
      }
    },

    "estatisticas": {
      "normal": {
        "tempoMedio": 30.62,
        "desvioPadrao": 1.23,
        "minimo": 28.45,
        "maximo": 32.88,
        "veiculosMedio": 1605,
        "veiculosTotal": 24075
      },
      "comReservas": {
        "tempoMedioGeral": 29.23,
        "tempoMedioReservas": 18.77,
        "tempoMedioNormais": 33.74,
        "desvioPadraoGeral": 1.15,
        "diferencaMedia": 14.97,
        "veiculosMedio": 1558,
        "veiculosTotal": 23370
      },
      "comparativo": {
        "reducaoTempoGeral": 4.54,
        "reducaoTempoReservas": 38.69,
        "aumentoTempoNormais": 10.19,
        "ganhoMedioDiario": 1.39,
        "diferencaMediaReservaNormal": 14.97
      }
    },

    "analise": {
      "resumo": "Em 15 dias de operação, o sistema com reservas reduziu o tempo médio geral em 4.54%, economizando 1.39 minutos por veículo em média.",
      "beneficios": [
        "Redução de 38.69% no tempo para quem reserva",
        "Diferença média de 14.97 minutos entre ter e não ter reserva",
        "23370 veículos processados em 15 dias com sistema de reservas",
        "Tempo médio com reserva: 18.77 min (consistente)"
      ],
      "tradeoffs": [
        "Aumento de 10.19% para quem não reserva",
        "Variação no tempo: ±1.15 min (desvio padrão)",
        "705 veículos de diferença no total processado"
      ],
      "recomendacao": "✅ Implementar sistema de reservas (ganhos significativos)"
    }
  }
}
```

---

### 3. Reservas

#### 3.1 Criar Reserva
```http
POST /reserva
Content-Type: application/json

{
  "nomeUsuario": "João Silva",
  "tipoVeiculo": "carro",
  "horarioPreferencia": "08:00",
  "telefone": "98988887777",
  "placa": "ABC1234"
}
```

**Resposta:**
```json
{
  "sucesso": true,
  "mensagem": "Reserva criada com sucesso! Chegue 15 minutos antes do horário.",
  "reserva": {
    "id": "abc123def",
    "nomeUsuario": "João Silva",
    "tipoVeiculo": "carro",
    "horarioPreferencia": "08:00",
    "telefone": "98988887777",
    "placa": "ABC1234",
    "status": "confirmada",
    "dataCriacao": "2025-11-11T10:30:00.000Z",
    "dataUso": "2025-11-11T08:00:00.000Z"
  }
}
```

---

#### 3.2 Listar Reservas
```http
GET /reservas
GET /reservas?data=2025-11-11
```

**Resposta:**
```json
{
  "sucesso": true,
  "reservas": [
    {
      "id": "abc123",
      "nomeUsuario": "João Silva",
      "status": "confirmada",
      "horarioPreferencia": "08:00",
      "dataCriacao": "2025-11-11T10:30:00.000Z"
    }
  ],
  "total": 15
}
```

---

### 4. Problemas

#### 4.1 Relatar Problema
```http
POST /relatar-problema
Content-Type: application/json

{
  "categoria": "Atraso excessivo",
  "descricao": "Esperando há 2 horas",
  "nomeUsuario": "Maria Santos",
  "telefone": "98977776666",
  "email": "maria@email.com",
  "localizacao": "Terminal Praia Grande"
}
```

**Categorias válidas:**
- `"Embarcação com defeito"` (prioridade alta)
- `"Fila desorganizada"` (prioridade média)
- `"Atraso excessivo"` (prioridade média)
- `"Funcionário"` (prioridade normal)
- `"Segurança"` (prioridade alta)
- `"Infraestrutura"` (prioridade normal)
- `"Outro"` (prioridade normal)

**Resposta:**
```json
{
  "sucesso": true,
  "mensagem": "Problema relatado com sucesso!",
  "problema": {
    "id": "xyz789abc",
    "protocolo": "FB-123XYZ",
    "prioridade": "alta",
    "status": "aberto",
    "dataAbertura": "2025-11-11T10:30:00.000Z",
    "previsaoResposta": "2025-11-12T10:30:00.000Z"
  }
}
```

---

#### 4.2 Listar Problemas
```http
GET /problemas
GET /problemas?status=aberto
GET /problemas?prioridade=alta
GET /problemas?categoria=Segurança
```

**Resposta:**
```json
{
  "sucesso": true,
  "problemas": [
    {
      "id": "xyz789",
      "protocolo": "FB-123XYZ",
      "categoria": "Atraso excessivo",
      "status": "aberto",
      "prioridade": "média",
      "dataAbertura": "2025-11-11T10:30:00.000Z"
    }
  ],
  "total": 5
}
```

---

### 5. Status das Embarcações

```http
GET /embarcacoes/status
```

**Resposta:**
```json
{
  "sucesso": true,
  "horarioAtual": "10:30:00",
  "embarcacoes": [
    {
      "id": 1,
      "disponivel": true,
      "emManutencao": false,
      "capacidade": 50,
      "veiculosAbordo": 0,
      "viagensRealizadas": 0,
      "estado": "Disponível",
      "proximaManutencao": "2025-11-15T08:00:00Z",
      "diasParaManutencao": 4
    },
    {
      "id": 2,
      "disponivel": false,
      "emManutencao": true,
      "capacidade": 50,
      "veiculosAbordo": 0,
      "viagensRealizadas": 45,
      "estado": "Em manutenção",
      "motivoManutencao": "Manutenção preventiva programada",
      "previsaoRetorno": "2025-11-11T14:00:00Z"
    }
  ],
  "totalEmbarcacoes": 4,
  "embarcacoesDisponiveis": 3,
  "embarcacoesEmManutencao": 1,
  "capacidadeTotal": 200,
  "capacidadeDisponivel": 150,
  "alertas": [
    {
      "tipo": "manutencao",
      "severidade": "info",
      "mensagem": "Embarcação #2 em manutenção preventiva",
      "previsaoRetorno": "2025-11-11T14:00:00Z"
    },
    {
      "tipo": "capacidade_reduzida",
      "severidade": "warning",
      "mensagem": "Capacidade operacional em 75% (3 de 4 embarcações)",
      "impacto": "Pode haver aumento no tempo de espera"
    }
  ]
}
```

---

### 6. Configurações do Sistema

```http
GET /config
```

**Resposta:**
```json
{
  "sucesso": true,
  "configuracoes": {
    "numEmbarcacoes": 4,
    "capacidadeVeiculos": 50,
    "frequenciaSaidaMinutos": 60,
    "horarioInicio": 6,
    "horarioFim": 22,
    "horasOperacao": 16,
    "veiculosDiarios": 1200,
    "percentualPico": 0.40,
    "tempoEmbarqueMinutos": 15,
    "tempoTravessiaMinutos": 80,
    "picos": [
      { "inicio": 7, "fim": 9 },
      { "inicio": 17, "fim": 19 }
    ]
  },
  "teoriaFilas": {
    "modelo": "M/M/c",
    "descricao": "Chegadas Poisson, Serviço Exponencial, Múltiplos Servidores",
    "parametros": {
      "c": 4,
      "lambda": 75,
      "capacidade": 50
    }
  }
}
```

---

## 📊 Gráficos: Como Usar os Dados

### Exemplo com Chart.js (React)

```jsx
import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';

function Dashboard() {
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/relatorios')
      .then(res => res.json())
      .then(data => {
        setRelatorio(data.relatorio);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Carregando relatório de 15 dias...</div>;

  return (
    <div>
      <h1>Relatório Ferry Bot - 15 Dias</h1>
      <p>{relatorio.periodo}</p>

      {/* Gráfico de Linha: Tempo ao longo dos dias */}
      <section>
        <h2>Tempo ao Longo dos Dias</h2>
        <Line data={relatorio.graficos.temposPorDia} />
      </section>

      {/* Gráfico de Barras: Comparação */}
      <section>
        <h2>Comparação de Médias</h2>
        <Bar data={relatorio.graficos.comparacaoMedia} />
      </section>

      {/* Gráfico de Pizza: Distribuição */}
      <section>
        <h2>Distribuição de Veículos</h2>
        <Pie data={relatorio.graficos.distribuicaoVeiculos} />
      </section>

      {/* Estatísticas */}
      <section>
        <h2>Estatísticas</h2>
        <p>Tempo médio normal: {relatorio.estatisticas.normal.tempoMedio.toFixed(2)} min</p>
        <p>Tempo médio com reservas: {relatorio.estatisticas.comReservas.tempoMedioReservas.toFixed(2)} min</p>
        <p>Redução: {relatorio.estatisticas.comparativo.reducaoTempoReservas.toFixed(2)}%</p>
      </section>
    </div>
  );
}
```

---

## 📸 Snapshots: Como Implementar

### Opção 1: LocalStorage (Frontend)

```javascript
// Salvar snapshot
function salvarSnapshot(nome, dados) {
  const snapshots = JSON.parse(localStorage.getItem('ferry_snapshots') || '[]');

  const snapshot = {
    id: Date.now(),
    nome: nome,
    timestamp: new Date().toISOString(),
    dados: dados
  };

  snapshots.push(snapshot);
  localStorage.setItem('ferry_snapshots', JSON.stringify(snapshots));

  return snapshot;
}

// Listar snapshots
function listarSnapshots() {
  return JSON.parse(localStorage.getItem('ferry_snapshots') || '[]');
}

// Comparar snapshots
function compararSnapshots(id1, id2) {
  const snapshots = listarSnapshots();
  const snap1 = snapshots.find(s => s.id === id1);
  const snap2 = snapshots.find(s => s.id === id2);

  return {
    snapshot1: snap1,
    snapshot2: snap2,
    diferencas: {
      tempoMedio: parseFloat(snap2.dados.resumo.tempoMedioEsperaGeral) -
                  parseFloat(snap1.dados.resumo.tempoMedioEsperaGeral),
      veiculos: snap2.dados.detalhes.veiculosProcessados -
                snap1.dados.detalhes.veiculosProcessados
    }
  };
}

// Exemplo de uso
async function exemplo() {
  // 1. Executar simulação
  const resultado = await fetch('http://localhost:3000/simular/com-reservas', {
    method: 'POST'
  }).then(r => r.json());

  // 2. Salvar snapshot
  salvarSnapshot('Simulação Manhã - 11/11/2025', resultado);

  // 3. Listar snapshots salvos
  const meusSnapshots = listarSnapshots();
  console.log(meusSnapshots);

  // 4. Comparar dois snapshots
  const comparacao = compararSnapshots(snapshot1.id, snapshot2.id);
  console.log('Diferença de tempo:', comparacao.diferencas.tempoMedio, 'min');
}
```

---

### Opção 2: IndexedDB (Para Muitos Dados)

```javascript
const DB_NAME = 'FerrySnapshots';
const STORE_NAME = 'snapshots';

function abrirDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function salvarSnapshotDB(nome, dados) {
  const db = await abrirDB();
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  const snapshot = {
    nome: nome,
    timestamp: new Date().toISOString(),
    dados: dados
  };

  return new Promise((resolve, reject) => {
    const request = store.add(snapshot);
    request.onsuccess = () => resolve({ ...snapshot, id: request.result });
    request.onerror = () => reject(request.error);
  });
}

async function listarSnapshotsDB() {
  const db = await abrirDB();
  const transaction = db.transaction([STORE_NAME], 'readonly');
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
```

---

## 🔧 Exemplos de Requisições

### Fetch API (JavaScript)

```javascript
const API_BASE_URL = "http://localhost:3000";

// Buscar reservas
async function buscarReservas() {
  const response = await fetch(`${API_BASE_URL}/reservas`);
  const data = await response.json();
  return data.reservas;
}

// Criar reserva
async function criarReserva(dados) {
  const response = await fetch(`${API_BASE_URL}/reserva`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nomeUsuario: dados.nome,
      tipoVeiculo: dados.tipoVeiculo,
      horarioPreferencia: dados.horario,
      telefone: dados.telefone,
      placa: dados.placa
    })
  });

  const data = await response.json();
  return data.reserva;
}

// Executar simulação
async function executarSimulacao(comReservas = false) {
  const endpoint = comReservas ? '/simular/com-reservas' : '/simular';
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });

  const data = await response.json();
  return data;
}

// Relatar problema
async function relatarProblema(problema) {
  const response = await fetch(`${API_BASE_URL}/relatar-problema`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      categoria: problema.categoria,
      descricao: problema.descricao,
      nomeUsuario: problema.nome,
      telefone: problema.telefone,
      email: problema.email,
      localizacao: problema.localizacao
    })
  });

  const data = await response.json();
  return data.problema;
}
```

---

## ⚙️ Como Iniciar o Backend

```bash
# 1. Instalar dependências
npm install express cors

# 2. Iniciar servidor
node ferry-backend.js

# 3. Testar
curl http://localhost:3000/
```

---

## ⚠️ Observações Importantes

1. **Dados em memória**: Não há banco de dados, dados são perdidos ao reiniciar o servidor
2. **CORS habilitado**: Frontend pode fazer requisições de qualquer origem
3. **Simulações em tempo real**: Cada requisição executa nova simulação
4. **Snapshots**: Devem ser salvos no frontend (localStorage ou IndexedDB)

---

**Última atualização:** 11/11/2025
