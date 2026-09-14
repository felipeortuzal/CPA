import { createCurriculumModule } from './schema'

const raw = `
4|Inovação e desenvolvimento de mercado
4.1|ESG no mercado financeiro.
4.1.1|Conceitos de ESG (Environment, Social e Governance).
4.1.2|Aspectos ambientais.
4.1.3|Aspectos sociais.
4.1.4|Aspectos de governança corporativa.
4.2|Introdução aos investimentos ESG.
4.2.1|A relação entre ESG e finanças.
4.2.2|Impactos de ESG na indústria de investimentos.
4.2.3|Conceitos de investimentos ESG.
4.2.4|Produtos ESG.
4.2.5|Estratégias de investimento ESG.
4.2.6|Avaliação de investimentos ESG.
4.2.6.1|Desafios para a evolução dos investimentos ESG.
4.2.6.2|Órgãos reguladores e autorreguladores e outros órgãos relacionados a investimento ESG.
4.2.6.2.1|Anbima.
4.2.6.2.1.1|A autorregulação da Anbima.
4.2.6.2.1.2|A regulação CVM 175 (artigo 49).
4.2.6.2.2|CVM.
4.2.6.2.3|Princípios para Investimentos Responsáveis (PRI).
4.3|Identificação dos fundos de investimento sustentável (IS) e fundos que integram questões ESG.
4.4|Finanças Descentralizadas (DEFI).
4.4.1|Finanças tradicionais versus finanças descentralizadas.
4.4.2|Vantagens do DEFI.
4.4.2.1|Conceito de Blockchain.
4.4.3|Smart contracts.
4.4.3.1|Conceito Smart contracts.
4.4.3.2|Componentes e funcionamento dos Smart contracts.
4.4.3.3|Conceito de contratos autoexecutáveis.
4.4.3.4|Plataformas de smart contracts.
4.4.3.5|Aplicações práticas de smart contracts.
4.4.3.6|Aplicação em contratos de empréstimos.
4.4.3.7|Exchanges Descentralizadas (DEXs).
4.4.3.8|Seguros.
4.4.3.8.1|Apólices automatizadas.
4.4.3.9|Imobiliário.
4.4.3.9.1|Compra e venda de propriedades.
4.4.3.10|Governança descentralizada.
4.4.3.10.1|Organizações Autônomas Descentralizadas (DAOs).
4.4.4|Tokenização.
4.4.4.1|Conceito básico.
4.4.4.2|Tipos de tokens.
4.4.4.3|Benefícios da tokenização.
4.4.4.4|Risco e desafios (segurança, regulação e tecnologia).
4.4.4.5|Tokenização de ativos financeiros, imóveis e artes.
4.4.5|Novas estruturas de mercado para negociações.
4.4.5.1|NFT (Non-Fungible Token).
4.4.5.2|Stable coins.
4.4.5.3|Renda fixa digital.
4.4.5.4|ETF bitcoin.
4.4.5.5|ETF novas moedas digitais.
4.4.5.6|Moeda Digital do Banco Central (CBDC) – DREX.
4.5|Openfinance, open investment e open insurance.
4.5.1|Open finance.
4.5.1.1|Conceitos e aplicabilidade.
4.5.1.1.1|CreditScore.
4.5.1.1.2|Vantagens sob a ótica de adimplência financeira.
4.5.1.1.3|Novo marco regulatório – Regulação CVM 175 e Resolução Conjunta nº 1 de 2020 entre Bacen e CMN.
4.5.2|Consequências no mercado financeiro brasileiro.
4.5.3|Open investment.
4.5.3.1|Vantagens e desvantagens.
4.5.3.2|Resoluções CVM 229, 209 e 210– Portabilidade de Valores Mobiliários.
4.5.4|Open Insurance.
4.5.4.1|Conceitos.
4.5.4.2|Vantagens e desvantagens.
4.6|Inteligência Artificial (IA).
4.6.1|IA Generativa.
4.6.1.1|Conceitos gerais.
4.6.1.2|Aplicabilidade.
4.6.1.3|Modelos preditivos.
4.6.2|IA Regenerativa.
4.6.2.1|Conceitos gerais.
4.6.2.2|Aplicabilidade.
4.6.2.3|Modelos preditivos.
4.6.3|Atendimento e suporte à clientela com IA.
4.6.3.1|Chatbots.
4.6.3.2|Assistentes virtuais.
4.7|Fintechs e meios de pagamento.
4.7.1|O que são as fintechs de hoje.
4.7.2|Sandbox regulatório (BCB e CVM).
4.7.3|Relação com o Open Finance.
4.7.4|Regulação.
4.7.5|Desintermediação financeira.
4.7.6|Meios de pagamento.
4.7.6.1|Conceitos.
4.7.6.2|Arranjo.
4.7.6.3|Adquirente.
4.7.6.4|Sub-adquitente.
`

export const module4 = createCurriculumModule(raw, 10)
