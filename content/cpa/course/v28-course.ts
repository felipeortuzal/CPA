import { v28ReadingSectionsA } from './v28-readings-a'
import { v28ReadingSectionsB } from './v28-readings-b'

export interface V28ReadingSection {
  id: string
  title: string
  paragraphs: string[]
}

export interface StudyVideo {
  title: string
  url: string
  videoId?: string
  note: string
}

export const V28_EDITORIAL_REVIEW_DATE = '2026-10-04'
export const RENAN_CHANNEL_URL = 'https://www.youtube.com/@retornointernooficial'
export const RENAN_CPA_SEARCH_URL = 'https://www.youtube.com/@retornointernooficial/search?query=Curso%20CPA%202026'

const searchVideo = (topic: string): StudyVideo => ({
  title: `Buscar aula de ${topic} no curso CPA 2026`,
  url: `https://www.youtube.com/@retornointernooficial/search?query=${encodeURIComponent(`CPA 2026 ${topic}`)}`,
  note: 'Atalho para a busca do tema no canal Retorno Interno. Use a ordem da playlist do curso quando houver mais de uma aula sobre o assunto.',
})

export const renanVideosByModule: Record<string, StudyVideo[]> = {
  'sistema-financeiro': [
    { title:'Aula 01: Sistema Financeiro Nacional', url:'https://www.youtube.com/watch?v=N0XoBIH5lRQ', videoId:'N0XoBIH5lRQ', note:'Visão geral do SFN, intermediação, mercados e divisão entre participantes.' },
    { title:'Aula 02: Conselho Monetário Nacional', url:'https://www.youtube.com/watch?v=xYygK21nTtE', videoId:'xYygK21nTtE', note:'Aprofundamento do papel normativo do CMN.' },
    { title:'Aula 03: Banco Central', url:'https://www.youtube.com/watch?v=tm6GNCPxpsQ', videoId:'tm6GNCPxpsQ', note:'Competências do Banco Central e sua posição na estrutura do sistema.' },
    { title:'Aula 04: Comissão de Valores Mobiliários', url:'https://www.youtube.com/watch?v=fketQyTvl9Y', videoId:'fketQyTvl9Y', note:'Mercado de valores mobiliários e atuação da CVM.' },
    { title:'Aula 05: Seguros Privados e Previdência Complementar Fechada', url:'https://www.youtube.com/watch?v=2udvH9SI9Dk', videoId:'2udvH9SI9Dk', note:'CNSP, Susep, CNPC e Previc dentro do mapa institucional.' },
  ],
  'economia': [searchVideo('economia indicadores inflação juros câmbio')],
  'matematica-financeira': [searchVideo('matemática financeira fluxo de pagamentos')],
  'infraestrutura': [
    { title:'Aula 06: Operadores Monetários', url:'https://www.youtube.com/watch?v=QtXygRFUhC8', videoId:'QtXygRFUhC8', note:'Operadores monetários e funcionamento prático da intermediação.' },
    { title:'Aula 07: Operadores Não Monetários I', url:'https://www.youtube.com/watch?v=Xn5so08yDwY', videoId:'Xn5so08yDwY', note:'Continuação do mapa dos participantes e atividades do sistema.' },
  ],
  'renda-fixa': [searchVideo('renda fixa crédito privado riscos financeiros prazo vencimento')],
  'renda-variavel': [searchVideo('ações renda variável derivativos COE')],
  'fundos': [searchVideo('fundos de investimento CVM 175')],
  'fundos-imobiliarios': [searchVideo('fundos imobiliários FII')],
  'previdencia': [searchVideo('previdência PGBL VGBL tributação')],
  'credito': [searchVideo('crédito financiamento CET garantias')],
  'servicos-bancarios': [
    { title:'Aula 10: Instituições de Pagamento', url:'https://www.youtube.com/watch?v=fe4Q-vpEU8Q', videoId:'fe4Q-vpEU8Q', note:'Instituições de pagamento, contas de pagamento e diferenças para bancos.' },
    searchVideo('Pix cartões serviços bancários'),
  ],
  'seguros': [
    { title:'Aula 05: Seguros Privados e Previdência Complementar Fechada', url:'https://www.youtube.com/watch?v=2udvH9SI9Dk', videoId:'2udvH9SI9Dk', note:'Retome esta aula para encaixar seguro na estrutura regulatória antes de estudar o produto.' },
    searchVideo('seguros capitalização proteção patrimonial'),
  ],
  'planejamento': [searchVideo('planejamento financeiro reserva orçamento patrimônio')],
  'carteiras': [searchVideo('carteiras diversificação retorno risco')],
  'perfil': [searchVideo('suitability perfil do investidor classificação de investidores')],
  'atendimento-etica': [searchVideo('ética PLD suitability relacionamento cliente')],
  'sustentabilidade': [searchVideo('ESG sustentabilidade finanças sustentáveis')],
  'ativos-digitais': [searchVideo('ativos digitais cripto blockchain DeFi')],
  'open-finance': [searchVideo('Open Finance portabilidade dados')],
  'tecnologia': [
    { title:'Aula 11: Fintechs', url:'https://www.youtube.com/watch?v=9ageDhFZwUs', videoId:'9ageDhFZwUs', note:'Fintechs e transformação dos serviços financeiros.' },
    searchVideo('inteligência artificial inovação pagamentos'),
  ],
}

export const v28ReadingSections: Record<string, V28ReadingSection[]> = {
  ...v28ReadingSectionsA,
  ...v28ReadingSectionsB,
}

export function v28SectionsFor(moduleId: string) {
  return v28ReadingSections[moduleId] ?? []
}

export function studyVideosFor(moduleId: string) {
  return renanVideosByModule[moduleId] ?? [searchVideo(moduleId.replaceAll('-', ' '))]
}

export function v28WordCount(moduleId: string) {
  return JSON.stringify(v28SectionsFor(moduleId)).trim().split(/\s+/).filter(Boolean).length
}
