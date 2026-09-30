import { describe, expect, it } from 'vitest'
import { cpaCurriculum } from '../curriculum'
import { cpaQuestions } from '../questions'
import { bankQuality, isReviewed } from '../questions/quality'
import { cpaLessons } from '../lessons'
import { apostilaTotalStats, getModuleLessons, moduleApostilaStats } from './apostila'
import { courseModules, moduleForPd } from './modules'
import { moduleReadings } from './readings'
import { generateSimulation } from '../../../src/lib/simulations/engine'

const parentCodes = new Set(cpaCurriculum.flatMap(item => item.parentCode ? [item.parentCode] : []))
const terminalCodes = cpaCurriculum.filter(item => !parentCodes.has(item.pdCode)).map(item => item.pdCode)
const countBy = (values:string[]) => Object.fromEntries([...new Set(values)].sort().map(value => [value, values.filter(item => item === value).length]))

describe('V26 · apostila digital completa', () => {
  it('mantém 20 módulos e rastreia os 445 PDs terminais para um módulo', () => {
    expect(courseModules).toHaveLength(20)
    expect(terminalCodes).toHaveLength(445)
    expect(cpaLessons).toHaveLength(445)
    for (const code of terminalCodes) expect(moduleForPd(code), code).toBeDefined()
    expect(new Set(cpaLessons.map(lesson => lesson.pdCode))).toEqual(new Set(terminalCodes))
  })

  it('expõe profundidade substancial e elementos de apostila em todos os módulos', () => {
    const total = apostilaTotalStats()
    expect(total.lessons).toBe(445)
    expect(total.minutes).toBeGreaterThanOrEqual(600)
    expect(total.words).toBeGreaterThan(70_000)
    expect(total.comparisons).toBeGreaterThanOrEqual(445)
    expect(total.checkpoints).toBeGreaterThanOrEqual(1_335)
    for (const module of courseModules) {
      const stats = moduleApostilaStats(module.id)
      expect(getModuleLessons(module.id).length, module.id).toBeGreaterThan(0)
      expect(stats.minutes, module.id).toBeGreaterThanOrEqual(12)
      expect(stats.words, module.id).toBeGreaterThan(1_500)
      expect(moduleReadings[module.id].example.scenario.length, module.id).toBeGreaterThan(30)
      expect(moduleReadings[module.id].comparison.rows.length, module.id).toBeGreaterThan(0)
      expect(moduleReadings[module.id].recall.length, module.id).toBeGreaterThan(0)
    }
  })

  it('mantém fontes oficiais e datas de revisão em cada PD', () => {
    for (const lesson of cpaLessons) {
      expect(lesson.officialSources.length, lesson.pdCode).toBeGreaterThan(0)
      expect(lesson.lastVerified, lesson.pdCode).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(lesson.examFocus.length, lesson.pdCode).toBeGreaterThanOrEqual(3)
      expect(lesson.miniQuiz, lesson.pdCode).toHaveLength(3)
    }
  })
})

describe('V26 · banco confiável e simulados', () => {
  const reviewed = cpaQuestions.filter(isReviewed)

  it('mantém rascunhos fora da base revisada e não inventa verificação oficial', () => {
    const quality = bankQuality(cpaQuestions)
    expect(cpaQuestions).toHaveLength(745)
    expect(reviewed).toHaveLength(300)
    expect(quality.reviewed).toBe(300)
    expect(quality.verified).toBe(0)
    expect(reviewed.every(question => question.origin === 'authored')).toBe(true)
  })

  it('recalibra os metadados pedagógicos dos 300 itens revisados', () => {
    expect(new Set(reviewed.map(question => question.difficulty)).size).toBeGreaterThanOrEqual(3)
    expect(new Set(reviewed.map(question => question.cognitiveLevel)).size).toBeGreaterThanOrEqual(3)
    expect(new Set(reviewed.map(question => question.questionType)).size).toBeGreaterThanOrEqual(2)
    expect(new Set(reviewed.map(question => question.conceptId)).size).toBeGreaterThan(100)
  })

  it('gera simulados de módulo priorizando diversidade conceitual', () => {
    for (const module of courseModules) {
      const exam = generateSimulation(cpaQuestions, { mode:'module', moduleId:module.id, random:()=>0.37 })
      const selected = exam.questionIds.map(id => cpaQuestions.find(question => question.id === id)!)
      expect(selected.length, module.id).toBeGreaterThanOrEqual(6)
      const distinctConcepts = new Set(selected.map(question => question.conceptId ?? question.pdCode)).size
      expect(distinctConcepts, module.id).toBeGreaterThanOrEqual(Math.min(6, selected.length))
    }
  })

  it('emite métricas reprodutíveis para o V26_REPORT', () => {
    const reviewed = cpaQuestions.filter(isReviewed)
    const payload = {
      total: apostilaTotalStats(),
      modules: courseModules.map(module => ({ id:module.id, title:module.title, ...moduleApostilaStats(module.id), lessons:undefined })),
      bank: bankQuality(cpaQuestions),
      difficulty: countBy(reviewed.map(question => question.difficulty)),
      cognition: countBy(reviewed.map(question => question.cognitiveLevel)),
      type: countBy(reviewed.map(question => question.questionType)),
    }
    console.info(`V26_REPORT_METRICS=${JSON.stringify(payload)}`)
    expect(payload.modules).toHaveLength(20)
  })
})
