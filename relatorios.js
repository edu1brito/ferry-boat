// ============================================================================
// FERRY BOT - MÓDULO DE RELATÓRIOS (15 dias de operação)
// ============================================================================
// Simula 15 dias de operação e compara sistemas com e sem reservas
// Fornece dados prontos para gráficos e visualizações
// ============================================================================

let SimuladorFerries; // declaração vazia

function setSimuladorClasse(classe) {
  SimuladorFerries = classe;
}

class GeradorRelatorios {
  static gerarRelatorio() {
    try {
      console.log('🔄 Gerando relatório de 15 dias...');

      const diasSimulacao = 15;
      const historico = {
        normal: [],
        comReservas: []
      };

      // === SIMULA 15 DIAS ===
      for (let dia = 1; dia <= diasSimulacao; dia++) {
        // Dia normal (sem reservas)
        const simuladorNormal = new SimuladorFerries();
        const resultadoNormal = simuladorNormal.processar();

        historico.normal.push({
          dia: dia,
          data: this._gerarData(dia),
          tempoMedioEspera: resultadoNormal.tempoMedioEspera,
          veiculosProcessados: resultadoNormal.veiculosProcessados,
          veiculosNaoAtendidos: resultadoNormal.veiculosNaoAtendidos,
          utilizacaoMedia: this._mediaUtilizacao(resultadoNormal.utilizacaoEmbarcacoes),
          viagensRealizadas: resultadoNormal.viagensRealizadas,
          // Métricas de teoria de filas
          metricas: resultadoNormal.metricasTeoriaFilas
        });

        // Dia com reservas
        const simuladorComReservas = new SimuladorFerries();
        const resultadoComReservas = simuladorComReservas.simularComReservas(0.3).detalhes;

        historico.comReservas.push({
          dia: dia,
          data: this._gerarData(dia),
          tempoMedioEspera: resultadoComReservas.tempoMedioEspera,
          tempoMedioReservas: resultadoComReservas.tempoMedioEsperaReservas,
          tempoMedioNormais: resultadoComReservas.tempoMedioEsperaNormais,
          veiculosProcessados: resultadoComReservas.veiculosProcessados,
          veiculosNaoAtendidos: resultadoComReservas.veiculosNaoAtendidos,
          utilizacaoMedia: this._mediaUtilizacao(resultadoComReservas.utilizacaoEmbarcacoes),
          viagensRealizadas: resultadoComReservas.viagensRealizadas,
          diferenca: resultadoComReservas.tempoMedioEsperaNormais - resultadoComReservas.tempoMedioEsperaReservas,
          // Métricas de teoria de filas
          metricas: resultadoComReservas.metricasTeoriaFilas
        });

        console.log(`✅ Dia ${dia}/15 simulado`);
      }

      // === CALCULA ESTATÍSTICAS DOS 15 DIAS ===
      const estatisticas = this._calcularEstatisticas(historico);

      // === PREPARA DADOS PARA GRÁFICOS ===
      const dadosGraficos = this._prepararDadosGraficos(historico);

      // === MÉTRICAS DE TEORIA DE FILAS (MÉDIA DOS 15 DIAS) ===
      const metricasConsolidadas = this._consolidarMetricas(historico);

      const relatorio = {
        dataGeracao: new Date().toLocaleString("pt-BR"),
        periodo: `15 dias de operação (${historico.normal[0].data} a ${historico.normal[14].data})`,

        // Histórico completo (para gráficos)
        historico: historico,

        // Dados formatados para gráficos
        graficos: dadosGraficos,

        // Estatísticas consolidadas
        estatisticas: estatisticas,

        // Métricas de teoria de filas consolidadas (média 15 dias)
        metricasTeoriaFilas: metricasConsolidadas,

        // Recomendações
        analise: this._gerarAnalise(estatisticas)
      };

      console.log('✅ Relatório de 15 dias gerado com sucesso!');
      return { sucesso: true, mensagem: "Relatório de 15 dias gerado com sucesso", relatorio };

    } catch (erro) {
      console.error("❌ Erro ao gerar relatório:", erro);
      return { sucesso: false, erro: erro.message };
    }
  }

  // === MÉTODOS AUXILIARES ===

  static _gerarData(dia) {
    const hoje = new Date();
    const data = new Date(hoje);
    data.setDate(hoje.getDate() - (15 - dia)); // Retrocede para começar há 15 dias
    return data.toLocaleDateString('pt-BR');
  }

  static _mediaUtilizacao(lista) {
    if (!lista || lista.length === 0) return 0;
    const soma = lista.reduce((acc, e) => acc + Math.min(100, e.percentualUtilizacao), 0);
    return soma / lista.length;
  }

  static _calcularMedia(array) {
    if (array.length === 0) return 0;
    const soma = array.reduce((a, b) => a + b, 0);
    return soma / array.length;
  }

  // Consolida métricas de teoria de filas (média dos 15 dias)
  static _consolidarMetricas(historico) {
    // Extrai métricas de cada dia (normal)
    const lambdas = historico.normal.map(d => d.metricas.lambda.valor);
    const mus = historico.normal.map(d => d.metricas.mu.valor);
    const rhos = historico.normal.map(d => d.metricas.rho.valor);
    const Wqs = historico.normal.map(d => d.metricas.Wq.valor);
    const Ws = historico.normal.map(d => d.metricas.W.valor);
    const Lqs = historico.normal.map(d => d.metricas.Lq.valor);
    const Ls = historico.normal.map(d => d.metricas.L.valor);
    const throughputs = historico.normal.map(d => d.metricas.throughput.valor);

    // Extrai métricas de cada dia (com reservas)
    const lambdasReserva = historico.comReservas.map(d => d.metricas.lambda.valor);
    const rhosReserva = historico.comReservas.map(d => d.metricas.rho.valor);
    const WqsReserva = historico.comReservas.map(d => d.metricas.Wq.valor);
    const WsReserva = historico.comReservas.map(d => d.metricas.W.valor);
    const LqsReserva = historico.comReservas.map(d => d.metricas.Lq.valor);
    const LsReserva = historico.comReservas.map(d => d.metricas.L.valor);
    const throughputsReserva = historico.comReservas.map(d => d.metricas.throughput.valor);

    return {
      normal: {
        lambda: { valor: this._calcularMedia(lambdas).toFixed(2), unidade: 'veículos/hora', simbolo: 'λ' },
        mu: { valor: this._calcularMedia(mus).toFixed(3), unidade: 'veículos/min/servidor', simbolo: 'μ' },
        rho: { valor: (this._calcularMedia(rhos) * 100).toFixed(2), unidade: '%', simbolo: 'ρ' },
        Wq: { valor: this._calcularMedia(Wqs).toFixed(2), unidade: 'minutos', simbolo: 'Wq' },
        W: { valor: this._calcularMedia(Ws).toFixed(2), unidade: 'minutos', simbolo: 'W' },
        Lq: { valor: this._calcularMedia(Lqs).toFixed(2), unidade: 'veículos', simbolo: 'Lq' },
        L: { valor: this._calcularMedia(Ls).toFixed(2), unidade: 'veículos', simbolo: 'L' },
        throughput: { valor: this._calcularMedia(throughputs).toFixed(2), unidade: 'veículos/hora', simbolo: 'X' }
      },
      comReservas: {
        lambda: { valor: this._calcularMedia(lambdasReserva).toFixed(2), unidade: 'veículos/hora', simbolo: 'λ' },
        rho: { valor: (this._calcularMedia(rhosReserva) * 100).toFixed(2), unidade: '%', simbolo: 'ρ' },
        Wq: { valor: this._calcularMedia(WqsReserva).toFixed(2), unidade: 'minutos', simbolo: 'Wq' },
        W: { valor: this._calcularMedia(WsReserva).toFixed(2), unidade: 'minutos', simbolo: 'W' },
        Lq: { valor: this._calcularMedia(LqsReserva).toFixed(2), unidade: 'veículos', simbolo: 'Lq' },
        L: { valor: this._calcularMedia(LsReserva).toFixed(2), unidade: 'veículos', simbolo: 'L' },
        throughput: { valor: this._calcularMedia(throughputsReserva).toFixed(2), unidade: 'veículos/hora', simbolo: 'X' }
      },
      comparativo: {
        reducaoWq: ((this._calcularMedia(Wqs) - this._calcularMedia(WqsReserva)) / this._calcularMedia(Wqs) * 100).toFixed(2) + '%',
        reducaoLq: ((this._calcularMedia(Lqs) - this._calcularMedia(LqsReserva)) / this._calcularMedia(Lqs) * 100).toFixed(2) + '%',
        aumentoThroughput: ((this._calcularMedia(throughputsReserva) - this._calcularMedia(throughputs)) / this._calcularMedia(throughputs) * 100).toFixed(2) + '%'
      }
    };
  }

  static _calcularDesvioPadrao(array) {
    const media = this._calcularMedia(array);
    const variancia = array.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) / array.length;
    return Math.sqrt(variancia);
  }

  static _calcularEstatisticas(historico) {
    // Extrai arrays de valores
    const temposNormal = historico.normal.map(d => d.tempoMedioEspera);
    const temposComReservas = historico.comReservas.map(d => d.tempoMedioEspera);
    const temposReservas = historico.comReservas.map(d => d.tempoMedioReservas);
    const temposNormais = historico.comReservas.map(d => d.tempoMedioNormais);
    const diferencas = historico.comReservas.map(d => d.diferenca);

    const veiculosNormal = historico.normal.map(d => d.veiculosProcessados);
    const veiculosComReservas = historico.comReservas.map(d => d.veiculosProcessados);

    return {
      normal: {
        tempoMedio: this._calcularMedia(temposNormal),
        desvioPadrao: this._calcularDesvioPadrao(temposNormal),
        minimo: Math.min(...temposNormal),
        maximo: Math.max(...temposNormal),
        veiculosMedio: Math.round(this._calcularMedia(veiculosNormal)),
        veiculosTotal: veiculosNormal.reduce((a, b) => a + b, 0)
      },
      comReservas: {
        tempoMedioGeral: this._calcularMedia(temposComReservas),
        tempoMedioReservas: this._calcularMedia(temposReservas),
        tempoMedioNormais: this._calcularMedia(temposNormais),
        desvioPadraoGeral: this._calcularDesvioPadrao(temposComReservas),
        desvioPadraoReservas: this._calcularDesvioPadrao(temposReservas),
        desvioPadraoNormais: this._calcularDesvioPadrao(temposNormais),
        diferencaMedia: this._calcularMedia(diferencas),
        diferencaMinima: Math.min(...diferencas),
        diferencaMaxima: Math.max(...diferencas),
        veiculosMedio: Math.round(this._calcularMedia(veiculosComReservas)),
        veiculosTotal: veiculosComReservas.reduce((a, b) => a + b, 0)
      },
      comparativo: {
        reducaoTempoGeral: ((this._calcularMedia(temposNormal) - this._calcularMedia(temposComReservas)) / this._calcularMedia(temposNormal)) * 100,
        reducaoTempoReservas: ((this._calcularMedia(temposNormal) - this._calcularMedia(temposReservas)) / this._calcularMedia(temposNormal)) * 100,
        aumentoTempoNormais: ((this._calcularMedia(temposNormais) - this._calcularMedia(temposNormal)) / this._calcularMedia(temposNormal)) * 100,
        ganhoMedioDiario: this._calcularMedia(temposNormal) - this._calcularMedia(temposComReservas),
        diferencaMediaReservaNormal: this._calcularMedia(diferencas)
      }
    };
  }

  static _prepararDadosGraficos(historico) {
    return {
      // Dados para gráfico de linha (tempo ao longo dos dias)
      temposPorDia: {
        labels: historico.normal.map(d => d.data),
        datasets: [
          {
            label: 'Sistema Normal',
            data: historico.normal.map(d => d.tempoMedioEspera.toFixed(2)),
            borderColor: '#FF6384',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: false
          },
          {
            label: 'Com Reservas (Geral)',
            data: historico.comReservas.map(d => d.tempoMedioEspera.toFixed(2)),
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: false
          },
          {
            label: 'Com Reserva (30%)',
            data: historico.comReservas.map(d => d.tempoMedioReservas.toFixed(2)),
            borderColor: '#4BC0C0',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false
          },
          {
            label: 'Sem Reserva (70%)',
            data: historico.comReservas.map(d => d.tempoMedioNormais.toFixed(2)),
            borderColor: '#FF9F40',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            fill: false
          }
        ]
      },

      // Dados para gráfico de barras (comparação)
      comparacaoMedia: {
        labels: ['Normal', 'Com Reservas (Geral)', 'Com Reserva (30%)', 'Sem Reserva (70%)'],
        datasets: [
          {
            label: 'Tempo Médio de Espera (min)',
            data: [
              this._calcularMedia(historico.normal.map(d => d.tempoMedioEspera)).toFixed(2),
              this._calcularMedia(historico.comReservas.map(d => d.tempoMedioEspera)).toFixed(2),
              this._calcularMedia(historico.comReservas.map(d => d.tempoMedioReservas)).toFixed(2),
              this._calcularMedia(historico.comReservas.map(d => d.tempoMedioNormais)).toFixed(2)
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(255, 159, 64, 0.6)'
            ]
          }
        ]
      },

      // Dados para gráfico de pizza (distribuição de veículos)
      distribuicaoVeiculos: {
        labels: ['Com Reserva (30%)', 'Sem Reserva (70%)'],
        datasets: [
          {
            data: [30, 70],
            backgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(255, 159, 64, 0.8)']
          }
        ]
      },

      // Dados para gráfico de diferença ao longo dos dias
      diferencaPorDia: {
        labels: historico.comReservas.map(d => d.data),
        datasets: [
          {
            label: 'Diferença (Sem Reserva - Com Reserva)',
            data: historico.comReservas.map(d => d.diferenca.toFixed(2)),
            borderColor: '#9966FF',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            fill: true
          }
        ]
      },

      // Dados para gráfico de veículos processados
      veiculosPorDia: {
        labels: historico.normal.map(d => d.data),
        datasets: [
          {
            label: 'Sistema Normal',
            data: historico.normal.map(d => d.veiculosProcessados),
            backgroundColor: 'rgba(255, 99, 132, 0.6)'
          },
          {
            label: 'Com Reservas',
            data: historico.comReservas.map(d => d.veiculosProcessados),
            backgroundColor: 'rgba(54, 162, 235, 0.6)'
          }
        ]
      }
    };
  }

  static _gerarAnalise(estatisticas) {
    const { normal, comReservas, comparativo } = estatisticas;

    return {
      resumo: `Em 15 dias de operação, o sistema com reservas reduziu o tempo médio geral em ${comparativo.reducaoTempoGeral.toFixed(2)}%, economizando ${comparativo.ganhoMedioDiario.toFixed(2)} minutos por veículo em média.`,

      beneficios: [
        `Redução de ${Math.abs(comparativo.reducaoTempoReservas).toFixed(2)}% no tempo para quem reserva`,
        `Diferença média de ${comparativo.diferencaMediaReservaNormal.toFixed(2)} minutos entre ter e não ter reserva`,
        `${comReservas.veiculosTotal} veículos processados em 15 dias com sistema de reservas`,
        `Tempo médio com reserva: ${comReservas.tempoMedioReservas.toFixed(2)} min (consistente)`
      ],

      tradeoffs: [
        `Aumento de ${comparativo.aumentoTempoNormais.toFixed(2)}% para quem não reserva`,
        `Variação no tempo: ±${comReservas.desvioPadraoGeral.toFixed(2)} min (desvio padrão)`,
        `${Math.abs(comReservas.veiculosTotal - normal.veiculosTotal)} veículos de diferença no total processado`
      ],

      recomendacao: comparativo.reducaoTempoGeral > 3
        ? '✅ Implementar sistema de reservas (ganhos significativos)'
        : '⚠️ Avaliar custos de implementação vs benefícios'
    };
  }
}

module.exports = { GeradorRelatorios, setSimuladorClasse };
