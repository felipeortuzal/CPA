import { courseModules } from '../../content/cpa/course/modules'
import { moduleReadings } from '../../content/cpa/course/readings'
import { v28SectionsFor } from '../../content/cpa/course/v28-course'
import { cpaLessons } from '../../content/cpa/lessons'

export interface LocalMentorSource {
  title: string
  url: string
}

export interface LocalMentorAnswer {
  content: string
  sources: LocalMentorSource[]
}

const stopWords = new Set([
  'a','o','as','os','um','uma','uns','umas','de','da','do','das','dos','e','ou','em','no','na','nos','nas','para','por','com','sem','que','qual','quais','como','me','eu','voce','voces','isso','isto','essa','esse','explica','explique','ensine','entenda','entender','sobre','entre','do','zero','pra','pro','pela','pelo','mais','muito','muita','muitas','muitos','ser','sao','eh','e','tem','tenho','duvida'
])

const aliases: Record<string, string[]> = {
  cmn: ['conselho monetario nacional','cmn'],
  bcb: ['banco central','bcb','bacen'],
  bacen: ['banco central','bcb','bacen'],
  cvm: ['comissao de valores mobiliarios','cvm'],
  fgc: ['fundo garantidor de creditos','fgc'],
  pgbl: ['pgbl','previdencia'],
  vgbl: ['vgbl','previdencia'],
  suitability: ['suitability','perfil do investidor','adequacao'],
  'marcacao a mercado': ['marcacao a mercado','renda fixa','preco taxa'],
  duration: ['duration','renda fixa','sensibilidade juros'],
  cdi: ['cdi','certificado de deposito interbancario','taxa'],
  selic: ['selic','politica monetaria','taxa de juros'],
  coe: ['coe','certificado de operacoes estruturadas'],
  fii: ['fii','fundos imobiliarios'],
  defi: ['defi','financas descentralizadas','ativos digitais'],
  pix: ['pix','pagamentos instantaneos'],
  pl: ['pld','lavagem de dinheiro'],
  pld: ['pld','lavagem de dinheiro','financiamento do terrorismo'],
}

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9%]+/g, ' ').trim()
}

function queryTerms(query: string) {
  const normalized = normalize(query)
  const raw = normalized.split(/\s+/).filter(term => term.length > 1 && !stopWords.has(term))
  const expanded = [...raw]
  for (const [alias, values] of Object.entries(aliases)) {
    if (normalized.includes(normalize(alias))) {
      for (const value of values) expanded.push(...normalize(value).split(/\s+/))
    }
  }
  return [...new Set(expanded.filter(term => term.length > 1 && !stopWords.has(term)))]
}

function excerpt(text: string, max = 540) {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max)
  const last = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('; '), cut.lastIndexOf(', '))
  return `${cut.slice(0, last > 260 ? last + 1 : max).trim()}…`
}

type Candidate = {
  moduleId: string
  moduleTitle: string
  title: string
  body: string
  pdCode?: string
  score: number
}

function scoreCandidate(title: string, body: string, terms: string[]) {
  const nt = normalize(title)
  const nb = normalize(body)
  let score = 0
  for (const term of terms) {
    if (nt.includes(term)) score += 8
    const matches = nb.split(term).length - 1
    score += Math.min(matches, 5) * 1.5
  }
  return score
}

function candidatesFor(query: string): Candidate[] {
  const terms = queryTerms(query)
  if (!terms.length) return []
  const rows: Candidate[] = []

  for (const module of courseModules) {
    for (const section of v28SectionsFor(module.id)) {
      const body = section.paragraphs.join(' ')
      rows.push({ moduleId: module.id, moduleTitle: module.title, title: section.title, body, score: scoreCandidate(`${module.title} ${section.title}`, body, terms) })
    }
    const reading = moduleReadings[module.id]
    if (reading) {
      const body = [...reading.objectives, ...reading.traps, ...reading.recall.flatMap(item => [item.question, item.answer])].join(' ')
      rows.push({ moduleId: module.id, moduleTitle: module.title, title: `Visão geral de ${module.title}`, body, score: scoreCandidate(module.title, body, terms) })
    }
  }

  for (const lesson of cpaLessons) {
    const module = courseModules.find(item => item.prefixes.some(prefix => lesson.pdCode === prefix || lesson.pdCode.startsWith(`${prefix}.`)))
    if (!module) continue
    const body = [lesson.oneSentence, lesson.beginnerExplanation, ...lesson.completeExplanation, ...lesson.essentialConcepts, ...lesson.examFocus, lesson.practicalExample, ...lesson.reviewSummary].join(' ')
    rows.push({ moduleId: module.id, moduleTitle: module.title, title: lesson.title, body, pdCode: lesson.pdCode, score: scoreCandidate(`${lesson.pdCode} ${lesson.title} ${module.title}`, body, terms) + 1 })
  }

  return rows.filter(row => row.score > 0).sort((a,b) => b.score - a.score)
}

function intentLead(query: string) {
  const q = normalize(query)
  if (/diferenca|versus| vs | x /.test(` ${q} `)) return 'A diferença essencial, olhando para o material da CPA, é esta:'
  if (/questao|prova|pegadinha|cobrad/.test(q)) return 'Pensando em como isso pode aparecer na prova:'
  if (/exemplo|pratico|pratica/.test(q)) return 'Vamos pelo mecanismo e por um exemplo mental simples:'
  return 'Pelo material da V28, a forma mais segura de entender é esta:'
}

export function answerLocally(query: string): LocalMentorAnswer {
  const ranked = candidatesFor(query)
  if (!ranked.length) {
    return {
      content: 'Não encontrei uma correspondência forte no material local para essa pergunta.\n\nTente usar o nome do conceito — por exemplo: “FGC”, “PGBL x VGBL”, “marcação a mercado”, “CMN BCB CVM”, “suitability” ou “Pix”. Se a IA online estiver conectada, ela consegue interpretar perguntas mais abertas.',
      sources: [],
    }
  }

  const primary = ranked[0]
  const secondary = ranked.find(row => row.moduleId !== primary.moduleId || row.title !== primary.title)
  const parts = [
    intentLead(query),
    '',
    excerpt(primary.body, 720),
  ]
  if (secondary && secondary.score >= primary.score * 0.45) {
    parts.push('', `Complemento importante — ${secondary.pdCode ? `PD ${secondary.pdCode} · ` : ''}${secondary.title}:`, excerpt(secondary.body, 430))
  }
  parts.push('', `Onde revisar: ${primary.moduleTitle}${primary.pdCode ? ` · PD ${primary.pdCode}` : ''}.`)
  parts.push('', 'Modo local: esta resposta foi montada somente com o conteúdo autoral da CPA Study V28, sem enviar sua pergunta para a internet. Para regras que possam mudar, confira as fontes oficiais indicadas no módulo.')

  const sourceRows = [primary, secondary].filter((row): row is Candidate => Boolean(row))
  return {
    content: parts.join('\n'),
    sources: sourceRows.map(row => ({
      title: `${row.moduleTitle}${row.pdCode ? ` · PD ${row.pdCode}` : ''}`,
      url: `#/modulos/${row.moduleId}`,
    })),
  }
}
