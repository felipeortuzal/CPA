import { macro1Lessons } from './macro-1'
import { macro2InvestmentLessons } from './macro-2-investments'
import { macro2PrevidenciaCreditoLessons } from './macro-2-previdencia-credito'
import { macro2ServicesInsuranceLessons } from './macro-2-services-insurance'
import { macro3Lessons } from './macro-3'
import { macro4Lessons } from './macro-4'

export const cpaLessons=[
  ...macro1Lessons,
  ...macro2InvestmentLessons,
  ...macro2PrevidenciaCreditoLessons,
  ...macro2ServicesInsuranceLessons,
  ...macro3Lessons,
  ...macro4Lessons,
].sort((a,b)=>a.pdCode.localeCompare(b.pdCode,undefined,{numeric:true,sensitivity:'base'}))

export const cpaLessonMap=new Map(cpaLessons.map((lesson)=>[lesson.pdCode,lesson]))

export const lessonGroups=[
  {code:'1.1',title:'Sistema Financeiro Nacional'},
  {code:'1.2',title:'Política econômica e indicadores'},
  {code:'1.3',title:'Operações e matemática financeira'},
  {code:'1.4',title:'Regulação e infraestrutura de mercado'},
  {code:'2.1.1',title:'Renda fixa, renda variável e COE'},
  {code:'2.1.2',title:'Fundos de investimento'},
  {code:'2.1.3',title:'Tributação em fundos'},
  {code:'2.1.4',title:'Fundos Imobiliários (FIIs)'},
  {code:'2.2',title:'Previdência complementar'},
  {code:'2.3',title:'Produtos de financiamento'},
  {code:'2.4',title:'Serviços bancários'},
  {code:'2.5',title:'Seguros'},
  {code:'3.1',title:'Planejamento financeiro pessoal'},
  {code:'3.2',title:'Gestão financeira e de investimentos'},
  {code:'3.3',title:'Perfil e adequação'},
  {code:'3.4',title:'Ética, conduta e integridade'},
  {code:'4.1',title:'ESG — fundamentos'},
  {code:'4.2',title:'ESG e investimentos'},
  {code:'4.3',title:'Fundos sustentáveis'},
  {code:'4.4',title:'Blockchain e ativos digitais'},
  {code:'4.5',title:'Open Finance e portabilidade'},
  {code:'4.6',title:'IA e machine learning'},
  {code:'4.7',title:'Fintechs e pagamentos'},
] as const

export const availableLessonCounts={
  total:cpaLessons.length,
  theme1:macro1Lessons.length,
  theme2:macro2InvestmentLessons.length+macro2PrevidenciaCreditoLessons.length+macro2ServicesInsuranceLessons.length,
  theme3:macro3Lessons.length,
  theme4:macro4Lessons.length,
} as const

if(cpaLessons.length!==445)throw new Error(`A CPA deveria possuir 445 aulas terminais; foram geradas ${cpaLessons.length}.`)
