import { describe, expect, it } from 'vitest'
import rawSources from '../../../content/sources.json'
import { cpaCurriculum } from '../../../content/cpa/curriculum'
import { macro1Lessons } from '../../../content/cpa/lessons/macro-1'
import { cpaQuestions } from '../../../content/cpa/questions'
import { officialSourceById, officialSourceImpactById, officialSources } from './impact'

describe('V11 fontes oficiais e mapa de impacto',()=>{
  it('mantém IDs únicos e registra os documentos centrais da CPA',()=>{
    expect(new Set(officialSources.map((source)=>source.id)).size).toBe(officialSources.length)
    expect(officialSourceById.get('ANBIMA_PD')?.knownVersion).toBe('1.2')
    expect(officialSourceById.get('ANBIMA_EXAM_NOTICE')?.knownVersion).toBe('1.4')
    expect(officialSourceById.has('ANBIMA_QUESTION_GUIDE')).toBe(true)
    expect(officialSourceById.has('ANBIMA_QUESTION_BOOK_CPA')).toBe(true)
  })

  it('cobre toda fonte usada pelas aulas e questões',()=>{
    const used=new Set<string>()
    for(const lesson of macro1Lessons)for(const source of lesson.officialSources)used.add(source.id)
    for(const question of cpaQuestions)for(const source of question.officialSources)used.add(source.id)
    const missing=[...used].filter((id)=>!officialSourceById.has(id))
    expect(missing).toEqual([])
  })

  it('mapeia o Programa Detalhado para todo o currículo',()=>{
    const impact=officialSourceImpactById.get('ANBIMA_PD')!
    expect(impact.curriculumCount).toBe(cpaCurriculum.length)
    expect(impact.curriculumCount).toBe(590)
    expect(impact.pdCodes).toContain('1')
    expect(impact.pdCodes).toContain('4')
    expect(impact.impactLevel).toBe('critical')
  })

  it('mapeia guia e caderno oficiais para o banco autoral sem copiar conteúdo',()=>{
    expect(officialSourceImpactById.get('ANBIMA_QUESTION_GUIDE')?.questionCount).toBe(cpaQuestions.length)
    expect(officialSourceImpactById.get('ANBIMA_QUESTION_BOOK_CPA')?.questionCount).toBe(cpaQuestions.length)
    expect(cpaQuestions).toHaveLength(100)
  })

  it('mantém a política sem reescrita automática e sem dependência de rede para estudar',()=>{
    expect(rawSources.policy.automaticRewrite).toBe(false)
    expect(rawSources.policy.networkFailureBlocksStudy).toBe(false)
  })
})
