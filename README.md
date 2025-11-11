# 🚢 Ferry Bot - Sistema de Simulação de Filas M/M/c

Sistema de gerenciamento e simulação de filas para os ferries de São Luís - MA, desenvolvido com **Teoria de Filas M/M/c** para modelar, analisar e otimizar o transporte aquaviário.

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Uso](#uso)
- [Endpoints da API](#endpoints-da-api)
- [Teoria de Filas](#teoria-de-filas)
- [Resultados](#resultados)
- [Documentação](#documentação)
- [Tecnologias](#tecnologias)

---

## 🎯 Sobre o Projeto

O **Ferry Bot** simula o funcionamento dos ferries utilizando o modelo **M/M/c** da Teoria de Filas:

- **M** (Markoviano): Chegadas seguem distribuição de Poisson
- **M** (Markoviano): Tempo de serviço segue distribuição exponencial
- **c**: Múltiplos servidores (4 embarcações) operando em paralelo

### Objetivos

✅ Simular operação real dos ferries usando modelo M/M/c
✅ Comparar sistema atual (FIFO) vs sistema com reservas (prioridade)
✅ Calcular métricas de performance (Wq, ρ, throughput)
✅ Demonstrar benefícios quantificáveis do sistema de reservas
✅ Fornecer APIs REST para integração com frontend

---

## ✨ Funcionalidades

### 🔬 Simulações

- **Simulação Normal (FIFO)**: Sistema atual com fila por ordem de chegada
- **Simulação com Reservas**: Sistema com prioridade M/M/c (30% com reserva, 70% sem)
- **Relatórios de 15 Dias**: Análise comparativa com estatísticas completas

### 📊 Recursos

- ✅ Sistema de reservas online
- ✅ Relatar problemas e ocorrências
- ✅ Status em tempo real das embarcações
- ✅ Alertas de manutenção
- ✅ Dados prontos para gráficos (Chart.js)
- ✅ Snapshots para comparação

---

## 🚀 Instalação

### Pré-requisitos

- Node.js 16+ ([Download](https://nodejs.org/))
- npm ou yarn

### Passo a Passo

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/ferry-bot.git
cd ferry-bot

# 2. Instale as dependências
npm install

# 3. Inicie o servidor
node ferry-backend.js

# 4. Acesse a API
# http://localhost:3000
```

### Instalação Rápida (Produção)

```bash
npm install express cors
node ferry-backend.js
```

---

## 📖 Uso

### Teste Rápido

```bash
# Verificar se a API está funcionando
curl http://localhost:3000/

# Executar simulação normal
curl -X POST http://localhost:3000/simular

# Executar simulação com reservas
curl -X POST http://localhost:3000/simular/com-reservas

# Ver relatório de 15 dias
curl http://localhost:3000/relatorios

# Verificar status das embarcações
curl http://localhost:3000/embarcacoes/status
```

### Exemplo com JavaScript (Fetch)

```javascript
// Executar simulação com reservas
const response = await fetch('http://localhost:3000/simular/com-reservas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ percentualReservas: 0.3 })
});

const resultado = await response.json();
console.log('Tempo com reserva:', resultado.resumo.tempoMedioReservas);
console.log('Tempo sem reserva:', resultado.resumo.tempoMedioNormais);
console.log('Diferença:', resultado.resumo.diferenca);
```

---

## 📡 Endpoints da API

### Simulações

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/simular` | POST | Simulação normal (FIFO) |
| `/simular/com-reservas` | POST | Simulação com prioridade |
| `/relatorios` | GET | Relatório de 15 dias |

### Reservas

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/reserva` | POST | Criar nova reserva |
| `/reservas` | GET | Listar todas as reservas |

### Problemas

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/relatar-problema` | POST | Relatar problema |
| `/problemas` | GET | Listar problemas |

### Sistema

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/config` | GET | Configurações do sistema |
| `/embarcacoes/status` | GET | Status das embarcações + alertas |
| `/teoria-filas` | GET | Explicação do modelo M/M/c |

### Exemplo de Resposta - Simulação com Reservas

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
  "analise": {
    "mensagem": "Comparativo entre usuários com e sem reserva",
    "diferencaTempo": "14.97 min"
  }
}
```

### Exemplo de Resposta - Status das Embarcações

```json
{
  "sucesso": true,
  "embarcacoes": [
    {
      "id": 1,
      "disponivel": true,
      "emManutencao": false,
      "estado": "Disponível",
      "proximaManutencao": "2025-11-15T08:00:00Z",
      "diasParaManutencao": 4
    }
  ],
  "alertas": [
    {
      "tipo": "operacao_normal",
      "severidade": "success",
      "mensagem": "Todas as embarcações operando normalmente",
      "impacto": "Tempo de espera dentro do esperado"
    }
  ]
}
```

---

## 📚 Teoria de Filas

### Modelo M/M/c (Kendall)

```
M / M / c
│   │   └─── c = número de servidores (4 embarcações)
│   └─────── M = tempo de serviço exponencial
└─────────── M = chegadas seguem processo de Poisson
```

### Parâmetros do Sistema

| Parâmetro | Valor | Descrição |
|-----------|-------|-----------|
| **c** (servidores) | 4 | Número de embarcações |
| **Capacidade** | 50 veículos | Por embarcação |
| **λ** (lambda) | 75 veículos/h | Taxa de chegada (base) |
| **λ_pico** | 187 veículos/h | Durante horários de pico |
| **μ** (mi) | ~0,45 veículos/min | Taxa de atendimento |
| **Horário** | 6h - 22h | 16 horas de operação |

### Métricas Calculadas

| Métrica | Símbolo | Descrição |
|---------|---------|-----------|
| **Tempo de Espera** | Wq | Tempo médio na fila |
| **Tempo no Sistema** | W | Tempo total (fila + serviço) |
| **Tamanho da Fila** | Lq | Veículos médios na fila |
| **Utilização** | ρ | Ocupação dos servidores |
| **Vazão** | X | Veículos processados/hora |

---

## 📈 Resultados

### Comparação: Normal vs Com Reservas

| Métrica | Sistema Normal | Com Reservas | Variação |
|---------|----------------|--------------|----------|
| **Tempo Médio Geral** | 30.62 min | 29.23 min | **-4.5%** ✅ |
| **Tempo com Reserva (30%)** | - | 18.77 min | **-39%** ✅ |
| **Tempo sem Reserva (70%)** | 30.62 min | 33.74 min | **+10%** ⚠️ |
| **Diferença** | - | **14.97 min** | **~15 min** ⭐ |
| **Veículos Processados** | 1610 | 1556 | -3.4% |
| **Utilização** | 100% | 100% | Saturado |

### Conclusão

✅ **Sistema com reservas é 4.5% mais eficiente no geral**
✅ **Usuários com reserva economizam 39% do tempo (~12 min)**
✅ **Diferença significativa de 15 minutos entre ter e não ter reserva**
⚠️ **Trade-off aceitável: +10% para quem não reserva (~3 min)**

---

## 📄 Documentação

O projeto inclui documentação completa:

### 📘 Para Desenvolvedores Frontend

- **[API_FRONTEND.md](API_FRONTEND.md)**: Guia completo de integração
  - Todos os endpoints documentados
  - Exemplos de código Fetch API
  - Dados prontos para Chart.js (5 tipos de gráficos)
  - Implementação de snapshots (localStorage/IndexedDB)

### 📗 Para Compreensão Técnica

- **[DOCUMENTACAO_PROJETO.md](DOCUMENTACAO_PROJETO.md)**: Documentação técnica completa
  - Teoria de Filas M/M/c explicada
  - Todos os cálculos e fórmulas
  - Análise detalhada dos resultados
  - Validação acadêmica

---

## 🛠️ Tecnologias

### Backend

- **Node.js**: Ambiente de execução JavaScript
- **Express.js**: Framework para API REST
- **CORS**: Permite integração com frontend

### Conceitos Aplicados

- ✅ Teoria de Filas (M/M/c com prioridade)
- ✅ Simulação de Eventos Discretos
- ✅ Processo de Poisson (chegadas aleatórias)
- ✅ Distribuição Exponencial (tempo de serviço)
- ✅ API REST
- ✅ Programação Orientada a Objetos

### Estrutura de Arquivos

```
ferry-bot/
├── ferry-backend.js          # Backend principal com simulações
├── relatorios.js             # Módulo de relatórios de 15 dias
├── API_FRONTEND.md           # Guia para integração frontend
├── DOCUMENTACAO_PROJETO.md   # Documentação técnica completa
├── README.md                 # Este arquivo
├── package.json              # Dependências do projeto
└── deploy-to-new-repo.sh     # Script para deploy
```

---

## 🎓 Referências Acadêmicas

1. Kendall, D. G. (1953). "Stochastic Processes Occurring in the Theory of Queues"
2. Kleinrock, L. (1975). "Queueing Systems, Volume 1: Theory"
3. Gross, D., & Harris, C. M. (1998). "Fundamentals of Queueing Theory"
4. Winston, W. L. (2004). "Operations Research: Applications and Algorithms"

---

## 📦 Deploy para Outro Repositório

Use o script automático incluído:

```bash
./deploy-to-new-repo.sh
```

O script irá:
1. Criar repositório git limpo
2. Copiar apenas arquivos essenciais
3. Fazer commit inicial descritivo
4. Push para repositório especificado

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abrir um Pull Request

---

## 📝 Licença

Este projeto é desenvolvido para fins acadêmicos.

---

## 👨‍💻 Autor

**Eduardo Brito**

- Disciplina: Simulação de Software / Pesquisa Operacional
- Instituição: [Sua Universidade]
- Data: Novembro 2025

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique a [documentação completa](DOCUMENTACAO_PROJETO.md)
2. Consulte o [guia de API](API_FRONTEND.md)
3. Abra uma issue no repositório

---

## 🎉 Agradecimentos

- Professor pela orientação no desenvolvimento
- Comunidade Node.js
- Literatura de Teoria de Filas

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela!**

Made with ❤️ using Node.js and Queue Theory

</div>
