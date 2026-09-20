import { describe, expect, it } from 'vitest'
import { cpaCurriculum } from '../../../content/cpa/curriculum'
import { cpaQuestions } from '../../../content/cpa/questions'
import { buildStudyEngineSnapshot, calculatePdMastery } from './engine'
import type { StudyEngineInput } from './types'

const now=new Date('2026-09-20T12:00:00.000Z')
const terminal=(()=>{
  const parents=new Set(cpaCurriculum.flatMap((item)=>item.parentCode?[item.parentCode]:[]))
  return cpaCurriculum.find((item)=>!parents.has(item.pdCode))!
})()

function input(overrides:Partial<StudyEngineInput>={}):StudyEngineInput{
  return{
    lessonProgress:[],quizAttempts:[],questionAttempts:[],simulations:[],errors:[],
    lessonPdCodes:new Set([terminal.pdCode]),questionPdCodes:new Set(cpaQuestions.map((q)=>q.pdCode)),
    dailyGoalMinutes:30,now,...overrides,
  }
}

describe('V7 Study Engine',()=>{
  it('começa em zero sem inventar domínio',()=>{
    const result=calculatePdMastery(terminal,input())
    expect(result.score).toBe(0)
    expect(result.level).toBe('new')
    expect(result.confidence).toBe(0)
    expect(result.lastEvidenceAt).toBeNull()
  })

  it('aula dominada e mini quiz forte elevam domínio, mas exigem prática para confiança máxima',()=>{
    const result=calculatePdMastery(terminal,input({
      lessonProgress:[{pdCode:terminal.pdCode,status:'mastered',openedAt:'2026-09-20T10:00:00.000Z',lastStudiedAt:'2026-09-20T10:30:00.000Z',completedAt:'2026-09-20T10:20:00.000Z',masteredAt:'2026-09-20T10:30:00.000Z',hasDoubt:false,quizBestScore:100}],
    }))
    expect(result.score).toBeGreaterThanOrEqual(80)
    expect(result.score).toBeLessThan(90)
    expect(result.confidence).toBeLessThan(60)
  })

  it('prática repetida aumenta a força da evidência em relação a um único acerto',()=>{
    const question=cpaQuestions[0]
    const unit=cpaCurriculum.find((item)=>item.pdCode===question.pdCode)!
    const make=(count:number)=>Array.from({length:count},(_,index)=>({id:String(index),questionId:question.id,pdCode:question.pdCode,selectedAnswer:question.correctAnswer,correctAnswer:question.correctAnswer,isCorrect:true,answeredAt:`2026-09-${String(19-index).padStart(2,'0')}T12:00:00.000Z`}))
    const one=calculatePdMastery(unit,input({questionAttempts:make(1)}))
    const five=calculatePdMastery(unit,input({questionAttempts:make(5)}))
    expect(five.score).toBeGreaterThan(one.score)
    expect(five.confidence).toBeGreaterThan(one.confidence)
  })

  it('erro pendente reduz domínio e vira prioridade de recuperação',()=>{
    const question=cpaQuestions[0]
    const unit=cpaCurriculum.find((item)=>item.pdCode===question.pdCode)!
    const attempt={id:'a',questionId:question.id,pdCode:question.pdCode,selectedAnswer:question.correctAnswer,correctAnswer:question.correctAnswer,isCorrect:true,answeredAt:'2026-09-20T11:00:00.000Z'}
    const error={id:`question:${question.id}`,sourceType:'question' as const,sourceId:question.id,pdCode:question.pdCode,prompt:question.prompt,selectedAnswer:'x',correctAnswer:'y',createdAt:'2026-09-20T11:30:00.000Z',resolvedAt:null,wrongCount:2,lastWrongAt:'2026-09-20T11:30:00.000Z'}
    const clean=calculatePdMastery(unit,input({questionAttempts:[attempt]}))
    const withError=calculatePdMastery(unit,input({questionAttempts:[attempt],errors:[error]}))
    expect(withError.score).toBeLessThan(clean.score)
    const snapshot=buildStudyEngineSnapshot(input({questionAttempts:[attempt],errors:[error]}))
    expect(snapshot.today[0].kind).toBe('recover_error')
  })

  it('intervalo de revisão cresce com domínio',()=>{
    const low=calculatePdMastery(terminal,input())
    const high=calculatePdMastery(terminal,input({
      lessonProgress:[{pdCode:terminal.pdCode,status:'mastered',openedAt:'2026-09-20T10:00:00.000Z',lastStudiedAt:'2026-09-20T10:30:00.000Z',completedAt:'2026-09-20T10:20:00.000Z',masteredAt:'2026-09-20T10:30:00.000Z',hasDoubt:false,quizBestScore:100}],
      questionAttempts:Array.from({length:5},(_,index)=>({id:String(index),questionId:`q${index}`,pdCode:terminal.pdCode,selectedAnswer:0,correctAnswer:0,isCorrect:true,answeredAt:'2026-09-20T11:00:00.000Z'})),
    }))
    expect(high.reviewIntervalDays).toBeGreaterThan(low.reviewIntervalDays)
    expect(high.score).toBeGreaterThanOrEqual(95)
  })

  it('gera plano diário, resumo por macrotema e indicador de preparação sem prometer aprovação',()=>{
    const snapshot=buildStudyEngineSnapshot(input())
    expect(snapshot.today.length).toBeGreaterThan(0)
    expect(snapshot.macroSummary).toHaveLength(4)
    expect(snapshot.overallMastery).toBe(0)
    expect(snapshot.readinessScore).toBe(0)
    expect(snapshot.readyForExam).toBe(false)
    expect(snapshot.recommendedMinutes).toBeGreaterThanOrEqual(15)
  })
})