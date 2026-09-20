import { describe, expect, it } from 'vitest'
import { cpaCurriculum } from '../curriculum'
import { cpaLessons, availableLessonCounts } from './index'

const parentCodes=new Set(cpaCurriculum.flatMap((item)=>item.parentCode?[item.parentCode]:[]))
const terminalCodes=cpaCurriculum.filter((item)=>!parentCodes.has(item.pdCode)).map((item)=>item.pdCode)

describe('V14-V18 cobertura completa de aulas CPA',()=>{
  it('possui exatamente uma aula para cada um dos 445 PDs terminais',()=>{
    expect(terminalCodes).toHaveLength(445)
    expect(cpaLessons).toHaveLength(445)
    expect(new Set(cpaLessons.map((lesson)=>lesson.pdCode)).size).toBe(445)
    expect(new Set(cpaLessons.map((lesson)=>lesson.pdCode))).toEqual(new Set(terminalCodes))
    expect(availableLessonCounts).toEqual({total:445,theme1:105,theme2:167,theme3:110,theme4:63})
  })

  it('mantém todas as seções didáticas, flashcards, mini quiz e fontes',()=>{
    for(const lesson of cpaLessons){
      expect(lesson.certification).toBe('CPA')
      expect(lesson.programVersion).toBe('1.2')
      expect(lesson.title.trim().length,lesson.pdCode).toBeGreaterThan(0)
      expect(lesson.oneSentence.trim().length,lesson.pdCode).toBeGreaterThan(25)
      expect(lesson.beginnerExplanation.trim().length,lesson.pdCode).toBeGreaterThan(60)
      expect(lesson.completeExplanation.length,lesson.pdCode).toBeGreaterThanOrEqual(3)
      expect(lesson.essentialConcepts.length,lesson.pdCode).toBeGreaterThanOrEqual(4)
      expect(lesson.examFocus.length,lesson.pdCode).toBeGreaterThanOrEqual(3)
      expect(lesson.practicalExample.trim().length,lesson.pdCode).toBeGreaterThan(50)
      expect(lesson.comparisons.length,lesson.pdCode).toBeGreaterThan(0)
      expect(lesson.traps.length,lesson.pdCode).toBeGreaterThanOrEqual(3)
      expect(lesson.reviewSummary.length,lesson.pdCode).toBeGreaterThanOrEqual(3)
      expect(lesson.flashcards,lesson.pdCode).toHaveLength(4)
      expect(lesson.miniQuiz,lesson.pdCode).toHaveLength(3)
      expect(lesson.officialSources.length,lesson.pdCode).toBeGreaterThan(0)
      expect(lesson.searchTerms.length,lesson.pdCode).toBeGreaterThan(3)
      expect(lesson.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/)

      for(const question of lesson.miniQuiz){
        expect(question.options,lesson.pdCode).toHaveLength(4)
        expect(new Set(question.options.map((option)=>option.trim().toLocaleLowerCase('pt-BR'))).size,lesson.pdCode).toBe(4)
        expect(question.correctIndex).toBeGreaterThanOrEqual(0)
        expect(question.correctIndex).toBeLessThan(4)
        expect(question.explanation.trim().length).toBeGreaterThan(20)
      }
    }
  })

  it('mantém os pesos e macrotemas do Programa Detalhado sem criar conteúdo fora do PD',()=>{
    expect(cpaCurriculum.filter((item)=>!item.parentCode).map((item)=>[item.pdCode,item.weight])).toEqual([
      ['1',20],['2',40],['3',30],['4',10],
    ])
    const officialCodes=new Set(cpaCurriculum.map((item)=>item.pdCode))
    expect(cpaLessons.every((lesson)=>officialCodes.has(lesson.pdCode))).toBe(true)
  })
})
