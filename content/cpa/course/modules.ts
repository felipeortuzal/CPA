export type CourseStage =
  | '1. Estrutura e dinâmica do Sistema Financeiro Nacional'
  | '2. Produtos do mercado financeiro'
  | '3. Relacionamento com o cliente — prospecção, atendimento e suporte'
  | '4. Inovação e desenvolvimento de mercado'

export interface CourseModule {
  id: string
  title: string
  subtitle: string
  prefixes: string[]
  stage: CourseStage
}

export const courseModules: CourseModule[] = [
  {id:'sistema-financeiro',title:'Sistema Financeiro Nacional',subtitle:'Órgãos normativos, supervisores, operadores, participantes e proteção.',prefixes:['1.1'],stage:'1. Estrutura e dinâmica do Sistema Financeiro Nacional'},
  {id:'economia',title:'Política econômica e indicadores',subtitle:'Inflação, Selic, Copom, PIB, câmbio, política monetária e fiscal.',prefixes:['1.2'],stage:'1. Estrutura e dinâmica do Sistema Financeiro Nacional'},
  {id:'matematica-financeira',title:'Operações e matemática financeira',subtitle:'Juros, taxas, valor presente, valor futuro, descontos e amortização.',prefixes:['1.3'],stage:'1. Estrutura e dinâmica do Sistema Financeiro Nacional'},
  {id:'infraestrutura',title:'Regulação e infraestrutura do mercado',subtitle:'Negociação, registro, compensação, liquidação, custódia, SPB e distribuição.',prefixes:['1.4'],stage:'1. Estrutura e dinâmica do Sistema Financeiro Nacional'},

  {id:'renda-fixa',title:'Renda fixa',subtitle:'Títulos públicos e privados, indexadores, marcação a mercado, riscos e tributação.',prefixes:['2.1.1.1'],stage:'2. Produtos do mercado financeiro'},
  {id:'renda-variavel',title:'Renda variável, derivativos e COE',subtitle:'Ações, proventos, mercados, hedge, opções, futuros e estruturas de retorno.',prefixes:['2.1.1.2','2.1.1.3','2.1.1.4'],stage:'2. Produtos do mercado financeiro'},
  {id:'fundos',title:'Fundos de investimento',subtitle:'Cotas, classes, prestadores, política de investimento, taxas, riscos e tributação.',prefixes:['2.1.2','2.1.3'],stage:'2. Produtos do mercado financeiro'},
  {id:'fundos-imobiliarios',title:'Fundos imobiliários e investimentos imobiliários',subtitle:'FIIs, imóveis, recebíveis, rendimentos, vacância, crédito e liquidez.',prefixes:['2.1.4'],stage:'2. Produtos do mercado financeiro'},
  {id:'previdencia',title:'Previdência complementar — PGBL e VGBL',subtitle:'Planos, regimes tributários, portabilidade, beneficiários e adequação.',prefixes:['2.2'],stage:'2. Produtos do mercado financeiro'},
  {id:'credito',title:'Produtos de financiamento e crédito',subtitle:'Empréstimos, financiamentos, CET, garantias, amortização e capacidade de pagamento.',prefixes:['2.3'],stage:'2. Produtos do mercado financeiro'},
  {id:'servicos-bancarios',title:'Serviços bancários e meios de pagamento',subtitle:'Contas, Pix, cartões, boletos, transferências, tarifas e segurança.',prefixes:['2.4'],stage:'2. Produtos do mercado financeiro'},
  {id:'seguros',title:'Seguros de vida e patrimoniais',subtitle:'Prêmio, cobertura, indenização, franquia, carência, exclusões e capitalização.',prefixes:['2.5'],stage:'2. Produtos do mercado financeiro'},

  {id:'planejamento',title:'Finanças pessoais',subtitle:'Orçamento, fluxo de caixa, patrimônio, endividamento, reserva e objetivos.',prefixes:['3.1'],stage:'3. Relacionamento com o cliente — prospecção, atendimento e suporte'},
  {id:'carteiras',title:'Orientações financeiras para o cliente',subtitle:'Objetivos, alocação, diversificação, liquidez, risco e acompanhamento.',prefixes:['3.2'],stage:'3. Relacionamento com o cliente — prospecção, atendimento e suporte'},
  {id:'perfil',title:'Classificação das pessoas investidoras',subtitle:'Perfil, capacidade e tolerância a risco, suitability e adequação.',prefixes:['3.3'],stage:'3. Relacionamento com o cliente — prospecção, atendimento e suporte'},
  {id:'atendimento-etica',title:'Conduta e relacionamento com o cliente',subtitle:'Ética, conflitos, comunicação, PLD/FTP, dados, segurança e integridade.',prefixes:['3.4'],stage:'3. Relacionamento com o cliente — prospecção, atendimento e suporte'},

  {id:'sustentabilidade',title:'ESG e investimentos sustentáveis',subtitle:'ESG no mercado financeiro, estratégias, fundos IS e integração de fatores ESG.',prefixes:['4.1','4.2','4.3'],stage:'4. Inovação e desenvolvimento de mercado'},
  {id:'ativos-digitais',title:'DeFi, blockchain e ativos digitais',subtitle:'Tokens, criptoativos, smart contracts, finanças descentralizadas e riscos.',prefixes:['4.4'],stage:'4. Inovação e desenvolvimento de mercado'},
  {id:'open-finance',title:'Open Finance, Open Investment e Open Insurance',subtitle:'Consentimento, compartilhamento de dados, iniciação, portabilidade e segurança.',prefixes:['4.5'],stage:'4. Inovação e desenvolvimento de mercado'},
  {id:'tecnologia',title:'Inteligência Artificial, fintechs e inovação',subtitle:'IA, fintechs, novos meios de pagamento, automação, riscos e proteção de dados.',prefixes:['4.6','4.7'],stage:'4. Inovação e desenvolvimento de mercado'},
]

export const courseModuleMap = new Map(courseModules.map(module => [module.id,module]))
export const matchesModule = (module: CourseModule, pdCode: string) => module.prefixes.some(prefix => pdCode === prefix || pdCode.startsWith(prefix+'.'))
export const moduleForPd = (pdCode: string) => courseModules.find(module => matchesModule(module,pdCode))
