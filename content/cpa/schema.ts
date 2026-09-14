export interface CurriculumOfficialSource {
  id: string
  name: string
  url: string
}

export interface CurriculumUnit {
  certification: 'CPA'
  title: string
  pdCode: string
  parentCode: string | null
  order: number
  description: string
  officialSources: CurriculumOfficialSource[]
  officialSource: string
  sourceUrl: string
  sourceDate: string
  lastVerified: string
  contentVersion: string
  programVersion: string
  topic: string
  subtopic: string | null
  itemType: 'macro' | 'topic' | 'subtopic' | 'micro'
  weight?: number
}

const officialSource: CurriculumOfficialSource = {
  id: 'ANBIMA_CPA_PD_1_2',
  name: 'ANBIMA — Programa Detalhado CPA',
  url: 'https://www.anbima.com.br/data/files/6A/52/6F/A1/BED73910B07B2739B82BA2A8/Programa-Detalhado-CPA-ANBIMA.pdf',
}

function itemTypeFor(pdCode: string): CurriculumUnit['itemType'] {
  const depth = pdCode.split('.').length
  if (depth === 1) return 'macro'
  if (depth === 2) return 'topic'
  if (depth === 3) return 'subtopic'
  return 'micro'
}

export function createCurriculumModule(raw: string, macroWeight: number): CurriculumUnit[] {
  return raw.trim().split('\n').map((row, index) => {
    const separator = row.indexOf('|')
    if (separator < 1) throw new Error(`Linha curricular inválida: ${row}`)
    const pdCode = row.slice(0, separator).trim()
    const title = row.slice(separator + 1).trim()
    const parts = pdCode.split('.')
    const parentCode = parts.length === 1 ? null : parts.slice(0, -1).join('.')
    return {
      certification: 'CPA',
      title,
      pdCode,
      parentCode,
      order: index + 1,
      description: `Tópico oficial correspondente ao item ${pdCode} do Programa Detalhado da CPA.`,
      officialSources: [officialSource],
      officialSource: officialSource.name,
      sourceUrl: officialSource.url,
      sourceDate: '2025-06-04',
      lastVerified: '2026-09-14',
      contentVersion: '1.2',
      programVersion: '1.2',
      topic: title,
      subtopic: parentCode,
      itemType: itemTypeFor(pdCode),
      ...(parts.length === 1 ? { weight: macroWeight } : {}),
    }
  })
}
