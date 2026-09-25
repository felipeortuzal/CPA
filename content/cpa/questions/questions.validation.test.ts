import coverageIds from './coverage-ids.json'
import { describe, expect, it } from 'vitest'
import { cpaCurriculum } from '../curriculum'
import { cpaLessons } from '../lessons'
import { cpaQuestions } from './index'

const pdCodes = new Set(cpaCurriculum.map((item) => item.pdCode))
const terminalPdCodes = new Set(cpaLessons.map((lesson) => lesson.pdCode))
const countBy = <T extends string | number>(values: T[]) => values.reduce<Record<string, number>>((acc, value) => { const key = String(value); acc[key] = (acc[key] ?? 0) + 1; return acc }, {})

describe('banco original de questões CPA', () => {
  it('possui 545 questões únicas e cobre todos os 445 PDs terminais', () => {
    expect(cpaQuestions).toHaveLength(545)
    expect(new Set(cpaQuestions.map((q) => q.id)).size).toBe(545)
    const covered=new Set(cpaQuestions.map((q)=>q.pdCode))
    for(const pdCode of terminalPdCodes)expect(covered.has(pdCode),`PD terminal sem questão: ${pdCode}`).toBe(true)
  })

  it('mantém as quatro áreas da CPA e variedade de dificuldade, cognição e tipo', () => {
    const macro=countBy(cpaQuestions.map((q) => q.pdCode.split('.')[0]))
    expect(Object.keys(macro).sort()).toEqual(['1','2','3','4'])
    expect(macro['1']).toBeGreaterThan(100)
    expect(macro['2']).toBeGreaterThan(160)
    expect(macro['3']).toBeGreaterThan(100)
    expect(macro['4']).toBeGreaterThan(60)

    const difficulty=countBy(cpaQuestions.map((q)=>q.difficulty))
    const cognition=countBy(cpaQuestions.map((q)=>q.cognitiveLevel))
    const type=countBy(cpaQuestions.map((q)=>q.questionType))
    for(const value of ['easy','medium','hard'])expect(difficulty[value]).toBeGreaterThan(50)
    for(const value of ['comprehension','application','analysis'])expect(cognition[value]).toBeGreaterThan(50)
    expect(type.multiple_choice).toBeGreaterThan(100)
    expect(type.case).toBeGreaterThan(200)
    expect(type.dialog_tree).toBeGreaterThan(40)
  })

  it('mantém posição de gabarito sem concentração artificial', () => {
    const counts=countBy(cpaQuestions.map((q)=>q.correctAnswer))
    const values=[0,1,2,3].map((key)=>counts[String(key)]??0)
    expect(Math.max(...values)-Math.min(...values)).toBeLessThanOrEqual(40)
  })

  it('valida todos os campos, PD Codes, fontes e exatamente uma resposta correta', () => {
    for (const question of cpaQuestions) {
      expect(question.certification).toBe('CPA')
      expect(pdCodes.has(question.pdCode), `${question.id}: PD inexistente ${question.pdCode}`).toBe(true)
      expect(question.macroTopic.trim().length).toBeGreaterThan(0)
      expect(question.topic.trim().length).toBeGreaterThan(0)
      expect(question.context.trim().length).toBeGreaterThan(20)
      expect(question.prompt.trim().length).toBeGreaterThan(10)
      expect(question.options).toHaveLength(4)
      expect(Number.isInteger(question.correctAnswer)).toBe(true)
      expect(question.correctAnswer).toBeGreaterThanOrEqual(0)
      expect(question.correctAnswer).toBeLessThan(4)
      expect(question.explanation.trim().length).toBeGreaterThan(20)
      expect(question.whyOthersAreWrong).toHaveLength(4)
      expect(question.officialSources.length).toBeGreaterThan(0)
      expect(question.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(Number.isNaN(Date.parse(question.verifiedAt))).toBe(false)
      expect(question.officialSources.every((source) => source.url.startsWith('https://') && source.institution.length > 0)).toBe(true)
      expect(question.whyOthersAreWrong[question.correctAnswer]).toBe('')
      question.whyOthersAreWrong.forEach((reason, index) => { if (index !== question.correctAnswer) expect(reason.trim().length).toBeGreaterThan(10) })
    }
  })

  it('não contém alternativas duplicadas, enunciados completos duplicados ou atalhos proibidos', () => {
    const stems = new Set<string>()
    for (const question of cpaQuestions) {
      const normalizedOptions = question.options.map((option) => option.trim().toLocaleLowerCase('pt-BR'))
      expect(new Set(normalizedOptions).size, `${question.id}: alternativa duplicada`).toBe(4)
      const stem = `${question.context} ${question.prompt}`.trim().toLocaleLowerCase('pt-BR')
      expect(stems.has(stem), `${question.id}: enunciado completo duplicado`).toBe(false)
      stems.add(stem)
      const text = `${question.prompt} ${question.options.join(' ')}`.toLocaleLowerCase('pt-BR')
      expect(text).not.toContain('todas as anteriores')
      expect(text).not.toContain('nenhuma das anteriores')
    }
  })
})

// Historical IDs must remain associated with the same curriculum concept.
it('keeps generated question IDs stable across lesson ordering', () => {
  const generated = cpaQuestions.filter((question) => question.origin === 'generated')
  expect(Object.fromEntries(generated.map((question) => [question.pdCode, question.id]))).toEqual(coverageIds)
  expect(generated.every((question) => question.conceptId === question.pdCode && question.reviewStatus === 'draft')).toBe(true)
})
