import { describe, expect, it } from 'vitest'
import { courseModules, matchesModule } from './modules'
import { moduleReadings } from './readings'
import { cpaLessons } from '../lessons'
import { cpaQuestions } from '../questions'
import { lessonSources } from '../lessons/sources'
import { generateSimulation } from '../../../src/lib/simulations/engine'

describe('Trilha de módulos CPA', () => {
  it('distribui os 445 pontos de consulta em exatamente um dos 20 módulos', () => {
    expect(courseModules).toHaveLength(20)
    expect(new Set(courseModules.map(m => m.id)).size).toBe(20)
    for (const lesson of cpaLessons) expect(courseModules.filter(m => matchesModule(m,lesson.pdCode)), lesson.pdCode).toHaveLength(1)
  })
  it('tem leitura, exemplo, comparação, revisão e fontes em todos os módulos', () => {
    expect(Object.keys(moduleReadings).sort()).toEqual(courseModules.map(m => m.id).sort())
    for (const module of courseModules) {
      const r = moduleReadings[module.id]
      const moduleWords = r.sections.flatMap(s => s.paragraphs).join(' ').trim().split(/\s+/).length
      expect(r.sections.length).toBeGreaterThanOrEqual(6)
      expect(moduleWords, module.id).toBeGreaterThan(1300)
      if (module.id === 'sistema-financeiro') expect(moduleWords, module.id).toBeGreaterThan(2500)
      expect(new Set(r.sections.map(s => s.id)).size).toBe(r.sections.length)
      expect(r.sections.every(s => s.paragraphs.length >= 2 && s.paragraphs.every(p => p.length > 100))).toBe(true)
      expect(r.example.steps.length).toBeGreaterThanOrEqual(3)
      expect(r.comparison.rows.length).toBeGreaterThanOrEqual(3)
      expect(r.recall.length).toBeGreaterThanOrEqual(2)
      expect(r.traps.length).toBeGreaterThanOrEqual(3)
      expect(r.sources.every(id => lessonSources[id]?.url.startsWith('https://'))).toBe(true)
    }
  })
  it('gera 6–10 questões autorais exclusivas do assunto para cada módulo', () => {
    for (const module of courseModules) {
      const result = generateSimulation(cpaQuestions,{mode:'module',moduleId:module.id,random:()=>0.4})
      expect(result.moduleId).toBe(module.id)
      expect(result.questionCount, module.id).toBeGreaterThanOrEqual(6)
      expect(result.questionCount).toBeLessThanOrEqual(10)
      expect(new Set(result.questionIds).size).toBe(result.questionCount)
      expect(result.cutoff).toBeNull()
      expect(result.durationSeconds).toBe(result.questionCount*180)
      for (const id of result.questionIds) {
        const q = cpaQuestions.find(q => q.id === id)!
        expect(q.origin).toBe('authored')
        expect(matchesModule(module,q.pdCode)).toBe(true)
      }
    }
  })
  it('rejeita módulo desconhecido ou banco insuficiente sem usar questões de outro assunto', () => {
    expect(() => generateSimulation(cpaQuestions,{mode:'module',moduleId:'invalido'})).toThrow('Módulo')
    expect(() => generateSimulation([],{mode:'module',moduleId:'economia'})).toThrow('suficientes')
  })
})
