import { describe, expect, it } from 'vitest'
import { cpaCurriculum } from '../curriculum'
import { cpaQuestions } from './index'

const pdCodes = new Set(cpaCurriculum.map((item) => item.pdCode))
const countBy = <T extends string>(values: T[]) => values.reduce<Record<string, number>>((acc, value) => { acc[value] = (acc[value] ?? 0) + 1; return acc }, {})

describe('banco original de questões CPA', () => {
  it('possui exatamente 100 questões únicas e distribuição oficial 20/40/30/10', () => {
    expect(cpaQuestions).toHaveLength(100)
    expect(new Set(cpaQuestions.map((q) => q.id)).size).toBe(100)
    expect(countBy(cpaQuestions.map((q) => q.pdCode.split('.')[0]))).toEqual({ '1': 20, '2': 40, '3': 30, '4': 10 })
  })

  it('mantém a distribuição planejada de dificuldade, cognição e tipo', () => {
    expect(countBy(cpaQuestions.map((q) => q.difficulty))).toEqual({ easy: 30, medium: 45, hard: 25 })
    expect(countBy(cpaQuestions.map((q) => q.cognitiveLevel))).toEqual({ comprehension: 30, application: 45, analysis: 25 })
    expect(countBy(cpaQuestions.map((q) => q.questionType))).toEqual({ multiple_choice: 70, case: 20, dialog_tree: 10 })
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
