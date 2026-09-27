export interface CourseModule {
  id: string
  title: string
  subtitle: string
  prefixes: string[]
  stage: 'Fundamentos' | 'Investimentos e produtos' | 'Cliente e conduta' | 'Inovação'
}
export const courseModules: CourseModule[] = [
  {id:'sistema-financeiro',title:'Quem faz o quê no mercado',subtitle:'Instituições, supervisores e proteção ao investidor.',prefixes:['1.1'],stage:'Fundamentos'},
  {id:'economia',title:'Economia sem complicação',subtitle:'Inflação, juros, câmbio e políticas econômicas.',prefixes:['1.2'],stage:'Fundamentos'},
  {id:'matematica-financeira',title:'O dinheiro no tempo',subtitle:'Juros, taxas, valor presente e amortização.',prefixes:['1.3'],stage:'Fundamentos'},
  {id:'infraestrutura',title:'Como o mercado funciona',subtitle:'Liquidação, custódia, estabilidade e distribuição.',prefixes:['1.4'],stage:'Fundamentos'},
  {id:'renda-fixa',title:'Renda fixa na prática',subtitle:'Tesouro, títulos privados, riscos e retorno líquido.',prefixes:['2.1.1.1'],stage:'Investimentos e produtos'},
  {id:'renda-variavel',title:'Ações, derivativos e COE',subtitle:'Participação nas empresas, proteção e estruturas de retorno.',prefixes:['2.1.1.2','2.1.1.3','2.1.1.4'],stage:'Investimentos e produtos'},
  {id:'fundos',title:'Fundos por dentro',subtitle:'Cotas, classes, prestadores, taxas e tributação.',prefixes:['2.1.2','2.1.3'],stage:'Investimentos e produtos'},
  {id:'fundos-imobiliarios',title:'Investimentos imobiliários',subtitle:'FIIs, imóveis, recebíveis e leitura dos rendimentos.',prefixes:['2.1.4'],stage:'Investimentos e produtos'},
  {id:'previdencia',title:'Previdência e futuro',subtitle:'PGBL, VGBL, regimes tributários e portabilidade.',prefixes:['2.2'],stage:'Investimentos e produtos'},
  {id:'credito',title:'Crédito com critério',subtitle:'Custo efetivo, capacidade de pagamento e garantias.',prefixes:['2.3'],stage:'Investimentos e produtos'},
  {id:'servicos-bancarios',title:'O banco no dia a dia',subtitle:'Contas, pagamentos, cartões e segurança.',prefixes:['2.4'],stage:'Investimentos e produtos'},
  {id:'seguros',title:'Proteção e seguros',subtitle:'Coberturas, exclusões, franquia e capitalização.',prefixes:['2.5'],stage:'Investimentos e produtos'},
  {id:'planejamento',title:'Organize a vida financeira',subtitle:'Orçamento, patrimônio, reserva e objetivos.',prefixes:['3.1'],stage:'Cliente e conduta'},
  {id:'carteiras',title:'Construa e acompanhe carteiras',subtitle:'Alocação, diversificação e rebalanceamento.',prefixes:['3.2'],stage:'Cliente e conduta'},
  {id:'perfil',title:'Risco e perfil do investidor',subtitle:'Capacidade, disposição e adequação dos investimentos.',prefixes:['3.3'],stage:'Cliente e conduta'},
  {id:'atendimento-etica',title:'Atendimento, ética e segurança',subtitle:'Suitability, comunicação, PLD, dados e integridade.',prefixes:['3.4'],stage:'Cliente e conduta'},
  {id:'sustentabilidade',title:'ESG além do nome',subtitle:'Riscos socioambientais, estratégias e fundos sustentáveis.',prefixes:['4.1','4.2','4.3'],stage:'Inovação'},
  {id:'ativos-digitais',title:'Blockchain e ativos digitais',subtitle:'Tokens, contratos inteligentes, DeFi e riscos.',prefixes:['4.4'],stage:'Inovação'},
  {id:'open-finance',title:'Open Finance e portabilidade',subtitle:'Compartilhamento de dados com controle do cliente.',prefixes:['4.5'],stage:'Inovação'},
  {id:'tecnologia',title:'IA, fintechs e novos pagamentos',subtitle:'Inovação com senso crítico e proteção de dados.',prefixes:['4.6','4.7'],stage:'Inovação'},
]
export const courseModuleMap = new Map(courseModules.map(module => [module.id,module]))
export const matchesModule = (module: CourseModule, pdCode: string) => module.prefixes.some(prefix => pdCode === prefix || pdCode.startsWith(prefix+'.'))
export const moduleForPd = (pdCode: string) => courseModules.find(module => matchesModule(module,pdCode))
