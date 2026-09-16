import { describe, expect, it } from 'vitest'
import { cpaQuestions } from '../../../content/cpa/questions'
import { deriveWeakPdCodes, generateSimulation, gradeSimulation, OFFICIAL_EXAM } from './engine'

const macroCounts = (ids:string[]) => ids.reduce<Record<string,number>>((acc,id)=>{const question=cpaQuestions.find((item)=>item.id===id)!;const macro=question.pdCode.split('.')[0];acc[macro]=(acc[macro]??0)+1;return acc},{})

describe('simulation engine CPA',()=>{
  it('gera a prova oficial com 50 questões, 2h30, corte 35 e pesos 20/40/30/10',()=>{
    const exam=generateSimulation(cpaQuestions,{mode:'official_exam',random:()=>0.42})
    expect(exam.questionCount).toBe(50)
    expect(exam.durationSeconds).toBe(9000)
    expect(exam.cutoff).toBe(35)
    expect(macroCounts(exam.questionIds)).toEqual({'1':10,'2':20,'3':15,'4':5})
    expect(new Set(exam.questionIds).size).toBe(50)
    expect(OFFICIAL_EXAM.cutoff).toBe(35)
  })

  it('gera simulados 10 e 20 na proporção dos macrotemas',()=>{
    const ten=generateSimulation(cpaQuestions,{mode:'quick10',random:()=>0.3})
    const twenty=generateSimulation(cpaQuestions,{mode:'quick20',random:()=>0.6})
    expect(macroCounts(ten.questionIds)).toEqual({'1':2,'2':4,'3':3,'4':1})
    expect(macroCounts(twenty.questionIds)).toEqual({'1':4,'2':8,'3':6,'4':2})
    expect(ten.cutoff).toBeNull();expect(twenty.cutoff).toBeNull()
  })

  it('gera simulado por tema sem misturar macrotemas',()=>{
    const simulation=generateSimulation(cpaQuestions,{mode:'theme',theme:'3',random:()=>0.5})
    expect(simulation.questionIds.length).toBe(20)
    expect(Object.keys(macroCounts(simulation.questionIds))).toEqual(['3'])
  })

  it('não usa questões vistas no modo somente inéditas',()=>{
    const seen=new Set(cpaQuestions.slice(0,90).map((question)=>question.id))
    const simulation=generateSimulation(cpaQuestions,{mode:'unseen',seenQuestionIds:seen,random:()=>0.5})
    expect(simulation.questionIds.length).toBe(10)
    expect(simulation.questionIds.every((id)=>!seen.has(id))).toBe(true)
  })

  it('detecta PDs fracos por menor acurácia',()=>{
    expect(deriveWeakPdCodes([
      {pdCode:'1.1',isCorrect:false},{pdCode:'1.1',isCorrect:false},{pdCode:'2.1',isCorrect:true},{pdCode:'2.1',isCorrect:false},
    ])).toEqual(['1.1','2.1'])
  })

  it('calcula resultado e aprovação apenas quando há corte',()=>{
    const questions=cpaQuestions.slice(0,4)
    const answers=Object.fromEntries(questions.map((question,index)=>[question.id,index===3?null:question.correctAnswer]))
    const result=gradeSimulation(questions,answers,[questions[0].id],3,120)
    expect(result.correct).toBe(3)
    expect(result.total).toBe(4)
    expect(result.passed).toBe(true)
    expect(result.markedCount).toBe(1)
    expect(result.unansweredCount).toBe(1)
    expect(Object.values(result.themePerformance).reduce((sum,row)=>sum+row.total,0)).toBe(4)
  })
})
