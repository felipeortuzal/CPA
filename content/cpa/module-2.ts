import { createCurriculumModule } from './schema'

const raw = `
2|Produtos do mercado financeiro
2.1|Produtos de investimentos.
2.1.1|Instrumentos de renda variável e renda fixa.
2.1.1.1|Renda fixa.
2.1.1.1.1|Títulos públicos federais.
2.1.1.1.1.1|NTN-B e NTN-B Principal.
2.1.1.1.1.2|LFT.
2.1.1.1.1.3|LTN.
2.1.1.1.1.4|Plataforma do tesouro direto.
2.1.1.1.2|Tesouro prefixado, tesouro Selic, tesouro IPCA+, tesouro educa+, tesouro renda+.
2.1.1.1.3|Títulos bancários.
2.1.1.1.3.1|Certificado de Depósito Bancário (CDB).
2.1.1.1.3.2|Recibo de Depósito Bancário (RDB) e Recibo de Depósito Cooperativo (RDC).
2.1.1.1.3.3|Letra de Crédito Imobiliário (LCI).
2.1.1.1.3.4|Letra de Crédito do Agronegócio (LCA).
2.1.1.1.3.5|Letra de Crédito de Desenvolvimento (LCD).
2.1.1.1.4|Debêntures.
2.1.1.1.4.1|Debênture de infraestrutura.
2.1.1.1.4.2|Debêntures conversíveis e permutáveis.
2.1.1.1.5|Certificado Recebível Imobiliário (CRI).
2.1.1.1.6|Certificado Recebível do Agronegócio (CRA).
2.1.1.1.7|Rating.
2.1.1.1.8|Poupança.
2.1.1.1.8.1|Importância da poupança no SFH e garantias.
2.1.1.1.8.2|Custos e tributação.
2.1.1.1.8.3|Rentabilidade e riscos.
2.1.1.1.8.4|Data de aniversário: conceito e prática.
2.1.1.1.9|TR.
2.1.1.1.10|TLP.
2.1.1.1.11|Tributação de aplicações de renda fixa.
2.1.1.1.12|Imposto sobre operações financeiras (IOF).
2.1.1.2|Instrumentos de renda variável.
2.1.1.2.1|Renda variável (definição).
2.1.1.2.2|Ações.
2.1.1.2.2.1|Definições e contexto.
2.1.1.2.2.1.1|Empresa limitada e empresa S/A.
2.1.1.2.2.1.2|S/A aberta versus S/A fechada.
2.1.1.2.2.1.3|Empresa listada e não listada.
2.1.1.2.2.1.4|Classes: ordinárias, preferenciais, units, BDR´s e bônus de subscrição.
2.1.1.2.2.1.5|Capital próprio e de terceiros.
2.1.1.2.2.1.6|IPO e OPA.
2.1.1.2.2.1.7|Follow on.
2.1.1.2.2.1.8|Mercado primário versus secundário.
2.1.1.2.2.2|Eventos corporativos.
2.1.1.2.2.2.1|Assembleia Geral Extraordinária (AGE).
2.1.1.2.2.2.2|Assembleia Geral Ordinária (AGO).
2.1.1.2.2.2.3|Dividendos.
2.1.1.2.2.2.4|Juros sobre Capital Próprio (JCP).
2.1.1.2.2.2.5|Restituição de capital.
2.1.1.2.2.2.6|Grupamentos e desdobramentos.
2.1.1.2.2.2.7|Bonificação.
2.1.1.2.2.2.8|Subscrição.
2.1.1.2.2.3|Índices de mercado: Ibovespa (Índice Bovespa), IBR×100 (Índice Brasil 100) e IBr×50 (Índice Brasil 50).
2.1.1.2.3|Governança corporativa.
2.1.1.2.3.1|Níveis de governança para as empresas.
2.1.1.2.3.1.1|Segmentos de listagem.
2.1.1.2.3.1.2|Conselho de administração.
2.1.1.2.3.1.3|Tag Along, drag along, freefloat.
2.1.1.3|Tributação de aplicações de renda variável.
2.1.1.3.1|Alíquotas.
2.1.1.3.2|Isenções.
2.1.1.3.3|Compensação de perdas.
2.1.1.3.4|Imposto sobre operações financeiras (IOF).
2.1.1.4|Certificado de Operações Estruturadas (COE).
2.1.1.4.1|Principais regras e conhecimento da estrutura via derivativos.
2.1.1.4.2|Diferentes níveis de risco e garantias de rentabilidade (capital protegido ou capital em risco).
2.1.1.4.3|Tributação.
2.1.2|Introdução aos fundos de investimento.
2.1.2.1|Características, estratégias, composição de carteiras, público-alvo e os riscos envolvidos nos fundos.
2.1.2.2|Resolução CVM nº 175, parte geral.
2.1.2.2.1|Características, constituição e comunicação.
2.1.2.2.2|Definição de fundos de investimento.
2.1.2.2.3|Conceito de condomínio, constituição e registro na CVM.
2.1.2.2.4|Estrutura dos fundos de investimento: divisão em classes e subclasses.
2.1.2.2.5|Segregação patrimonial.
2.1.2.2.6|Cotas.
2.1.2.2.7|Classes abertas e fechadas.
2.1.2.2.8|Emissão.
2.1.2.2.9|Subscrição e integralização.
2.1.2.2.10|Resgate e amortização.
2.1.2.2.11|Distribuição.
2.1.2.2.12|Investimento por conta e ordem.
2.1.2.2.13|Participação política da pessoa investidora por conta e ordem.
2.1.2.2.14|Divulgação de informações.
2.1.2.2.15|Envio de comunicações para cotistas.
2.1.2.2.16|Divulgação de Informações e resultados.
2.1.2.2.17|Divulgação de cota e rentabilidade.
2.1.2.2.18|Assembleia de cotistas.
2.1.2.2.18.1|Assembleias gerais de cotistas.
2.1.2.2.18.2|Assembleias especiais de cotistas.
2.1.2.2.19|Prestação de serviços.
2.1.2.2.19.1|Serviços essenciais.
2.1.2.2.19.2|Funções da administração.
2.1.2.2.19.3|Funções da gestão.
2.1.2.2.19.4|Negociação de ativos em mercados organizados.
2.1.2.2.20|Remuneração.
2.1.2.2.20.1|Taxa de administração.
2.1.2.2.20.2|Taxa de ingresso.
2.1.2.2.20.3|Taxa de saída.
2.1.2.2.20.4|Taxa máxima de distribuição.
2.1.2.2.20.5|Acordos de remuneração.
2.1.2.2.21|Vedações.
2.1.2.2.22|Obrigações.
2.1.2.2.23|Normas de conduta.
2.1.2.2.24|Encargos.
2.1.2.2.25|Patrimônio líquido negativo com limitação de responsabilidade.
2.1.2.2.25.1|Responsabilidade limitada de cotistas.
2.1.2.2.25.2|Responsabilidade ilimitada de cotistas.
2.1.2.2.25.3|Patrimônio líquido negativo.
2.1.2.2.25.4|Insolvência da classe de cotas.
2.1.2.3|Fundos de Investimento Financeiro (FIF) – Resolução CVM nº 175/22, Anexo I.
2.1.2.3.1|Prestação de serviços.
2.1.2.3.2|Obrigações da pessoa administradora, gestora e custodiante.
2.1.2.3.3|Disposições gerais.
2.1.2.3.3.1|Vedações.
2.1.2.3.4|Distribuição e subscrição.
2.1.2.3.5|Carteira.
2.1.2.3.5.1|Ativos financeiros no Brasil.
2.1.2.3.5.2|Ativos financeiros no exterior.
2.1.2.3.5.3|Limites para cada emissor.
2.1.2.3.5.4|Limites por modalidade de ativo financeiro.
2.1.2.3.5.5|Deveres quanto aos limites de concentração.
2.1.2.3.6|Tipificação.
2.1.2.3.6.1|Fundos de renda fixa.
2.1.2.3.6.2|Fundo de ações.
2.1.2.3.6.3|Fundos cambiais.
2.1.2.3.6.4|Fundos multimercados.
2.1.2.3.6.5|Fundos Incentivados em Infraestrutura (FI-Infra).
2.1.2.3.6.6|Fundos destinados à garantia de locação imobiliária.
2.1.2.3.6.7|Concentração em crédito privado.
2.1.2.3.7|Investimento em cotas de outros fundos de investimento financeiro.
2.1.2.3.8|Exposição ao risco de capital.
2.1.2.3.9|Classes restritas.
2.1.2.3.10|Encargos.
2.1.3|Tributação em fundos de investimento.
2.1.3.1|Aplicação das normas tributárias.
2.1.3.2|Impostos incidentes sobre rendimentos.
2.1.3.2.1|Imposto sobre Operações Financeiras (IOF).
2.1.3.2.2|Imposto de Renda (IR).
2.1.4|Fundos Imobiliários (FIIs).
2.1.4.1|Ambiente de negociação e regime de cotas.
2.1.4.2|Risco de liquidez, crédito, vacância e composição de ativos.
2.1.4.3|Dinâmica de dividendos e suas regras.
2.1.4.4|Taxas, administração e subscrição.
2.1.4.5|Fundos de tijolos, fundos de papel e híbridos, principais diferenças.
2.1.4.6|Tributação e custos.
2.2|Produtos de Previdência Complementar (PGBL E VGBL).
2.2.1|Modalidades de planos (PGBL e VGBL).
2.2.1.1|PGBL (definição, público-alvo, principais características e utilizações).
2.2.1.2|VGBL (definição, público-alvo, principais características e utilizações).
2.2.2|Regimes de tributação (progressivo e regressivo).
2.2.2.1|Regime progressivo, tributável ou compensável (base de cálculo, alíquotas, aplicação prática da tabela, público-alvo).
2.2.2.2|Regime regressivo, definitivo ou exclusivo (base de cálculo, alíquotas, aplicação prática da tabela, público-alvo).
2.2.3|Conceitos técnicos ligados a previdência complementar.
2.2.3.1|Fases do produto (contribuição e benefícios).
2.2.3.2|Taxa de administração (Conceito, tipos, entrada, saída e forma de cobrança).
2.2.3.3|Portabilidade externa e interna (regras e carências).
2.2.3.4|Transformação da reserva em renda.
2.2.3.4.1|Renda Mensal Vitalícia (RMV).
2.2.3.4.2|Renda Mensal Vitalícia com prazo mínimo garantido.
2.2.3.4.3|Renda Mensal Vitalícia com reversão a beneficiário indicado.
2.2.3.4.4|Renda Mensal Vitalícia reversível para cônjuges com continuidade aos menores.
2.2.3.4.5|Renda mensal temporária.
2.2.3.4.6|Renda mensal por prazo certo.
2.2.3.4.7|Pagamento único.
2.3|Produtos de financiamento.
2.3.1|Princípios para disponibilização de crédito.
2.3.1.1|Rating de crédito, score Serasa, comprovação de renda.
2.3.1.2|Diferenças entre empréstimo, financiamento e leasing.
2.3.1.3|Utilização do SCR.
2.3.2|Cartão de crédito.
2.3.2.1|Limites, incidência de juros, regras de pagamento parcial e refinanciamento.
2.3.2.2|Cálculos da taxa de refinanciamento de faturas.
2.3.3|Cheque especial.
2.3.3.1|Data de vencimento, cálculos dos valores de juros e IOF.
2.3.4|Crédito consignado.
2.3.4.1|Margem de financiamento e desconto.
2.3.4.2|Principais vantagens (juros e prazo).
2.3.5|Crédito Direto ao Consumidor (CDC).
2.3.5.1|Utilização de bens como garantia.
2.3.5.2|Prazos maiores e destinação dos recursos.
2.3.6|Crédito imobiliário.
2.3.7|Capital de giro.
2.3.8|Consórcio.
2.4|Serviços bancários.
2.4.1|Conta corrente.
2.4.1.1|Recebimento de salários.
2.4.1.2|Depósitos à vista.
2.4.1.2.1|Garantias para depósitos à vista.
2.4.1.2.2|Depósito compulsório.
2.4.1.3|Boleto bancário.
2.4.1.4|Serviços digitais.
2.4.1.5|Pagamento Instantâneo Brasileiro (PIX).
2.4.1.5.1|Definição e objetivos.
2.4.1.5.2|Funcionamento (processo de transferência/Chaves PIX/Custos e tarifas/ liquidação).
2.4.1.5.3|Aplicações (transferências e pagamentos).
2.4.1.5.4|Pix na pessoa jurídica (pagamentos e recebimentos).
2.4.1.6|Tarifas.
2.4.1.6.1|Critérios para cobrança de tarifa e direitos a gratuidade.
2.4.1.7|Atendimento bancário.
2.4.1.7.1|Horários de atendimento, regra para filas, atendimento presencial e dias de não atendimento ao público.
2.4.2|Conta internacional.
2.4.2.1|Principais facilidades e inovações.
2.4.2.2|Cobrança de IOF com diferentes alíquotas.
2.4.2.3|Investimento internacional (implicações no imposto renda no Brasil).
2.4.3|Compra e venda de moeda estrangeira.
2.4.3.1|Regras para pessoa correspondente bancária.
2.4.3.2|Regras para compra e venda de moeda em instituições financeiras.
2.4.3.3|Definição e regras para recompra de moeda estrangeira.
2.5|Seguros de vida e patrimoniais.
2.5.1|Seguros de vida.
2.5.1.1|Vida inteira.
2.5.1.2|Vida temporário.
2.5.1.3|Tradicional.
2.5.2|Seguros patrimoniais.
2.5.2.1|Automóveis.
2.5.2.2|Residencial.
2.5.2.3|Prestamista.
`

export const module2 = createCurriculumModule(raw, 40)
