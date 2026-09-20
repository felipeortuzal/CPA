import { describe, expect, it } from 'vitest'
import { cpaCurriculum } from '../../../content/cpa/curriculum'
import { cpaQuestions } from '../../../content/cpa/questions'
import { buildStudyEngineSnapshot, calculatePdMastery } from './engine'
import type { StudyEngineInput } from './types'
import type { SimulationRecord } from '../storage/types'

const now=new Date('2026-09-20T12:00:00.000Z')
const terminal=(()=>{
  const parents=new Set(cpaCurriculum.flatMap((item)=>item.parentCode?[item.parentCode]:[]))
  return cpaCurriculum.find((item)=>!parents.has(item.pdCode))!
})()

function input(overrides:Partial<StudyEngineInput>={}):StudyEngineInput{
  return{
    lessonProgress:[],quizAttempts:[],questionAttempts:[],simulations:[],errors:[],flashcardReviews:[],
    flashcardPdById:new Map(),questionDifficultyById:new Map(cpaQuestions.map((q)=>[q.id,q.difficulty])),
    lessonPdCodes:new Set([terminal.pdCode]),questionPdCodes:new Set(cpaQuestions.map((q)=>q.pdCode)),
    dailyGoalMinutes:30,now,...overrides,
  }
}

function lesson(status:'in_progress'|'completed'|'mastered'='mastered',quizBestScore:number|null=100){
  return{pdCode:terminal.pdCode,status,openedAt:'2026-09-20T09:00:00.000Z',lastStudiedAt:'2026-09-20T10:00:00.000Z',completedAt:status==='in_progress'?null:'2026-09-20T09:30:00.000Z',masteredAt:status==='mastered'?'2026-09-20T10:00:00.000Z':null,hasDoubt:false,quizBestScore}
}

function officialExam(score:number,completedAt:string):SimulationRecord{
  const results=Array.from({length:10},(_,index)=>({questionId:`exam-${score}-${index}`,pdCode:terminal.pdCode,macroTopic:'Tema 1',topic:'Teste',difficulty:'medium' as const,selectedAnswer:0,correctAnswer:0,isCorrect:index<Math.round(score/10)}))
  return{id:`exam-${score}-${completedAt}`,certification:'CPA',score,questionCount:50,completedAt,payload:{mode:'official_exam',label:'Modo Prova',theme:null,questionIds:results.map((r)=>r.questionId),answers:Object.fromEntries(results.map((r)=>[r.questionId,0])),markedForReview:[],notes:'',startedAt:completedAt,durationSeconds:9000,cutoff:35,result:{correct:Math.round(score/2),total:50,scorePercent:score,passed:score>=70,cutoff:35,timeUsedSeconds:7000,markedCount:0,unansweredCount:0,themePerformance:{},difficultyPerformance:{easy:{correct:0,total:0,percent:0},medium:{correct:0,total:0,percent:0},hard:{correct:0,total:0,percent:0}},pdPerformance:{},questionResults:results}}}
}

describe('V9 Study Engine e Prontidão CPA',()=>{
  it('não inventa domínio nem prontidão com dados insuficientes',()=>{
    const result=calculatePdMastery(terminal,input())
    expect(result.score).toBe(0)
    expect(result.level).toBe('weak')
    expect(result.dataStatus).toBe('insufficient')
    expect(result.confidence).toBe(0)
    const snapshot=buildStudyEngineSnapshot(input())
    expect(snapshot.readinessScore).toBeNull()
    expect(snapshot.readinessLabel).toBe('Dados insuficientes')
    expect(snapshot.readinessDataStatus).toBe('insufficient')
  })

  it('abrir ou concluir aula e acertar mini quiz não cria domínio artificialmente alto',()=>{
    const opened=calculatePdMastery(terminal,input({lessonProgress:[lesson('in_progress',null)]}))
    const studied=calculatePdMastery(terminal,input({lessonProgress:[lesson('mastered',100)]}))
    expect(opened.score).toBeLessThan(30)
    expect(studied.score).toBeLessThan(80)
    expect(studied.dataStatus).not.toBe('sufficient')
  })

  it('detecta falsa confiança quando conteúdo estudado tem prática ruim',()=>{
    const question=cpaQuestions[0]
    const unit=cpaCurriculum.find((item)=>item.pdCode===question.pdCode)!
    const attempts=Array.from({length:5},(_,index)=>({id:String(index),questionId:question.id,pdCode:question.pdCode,selectedAnswer:index<2?question.correctAnswer:(question.correctAnswer+1)%4,correctAnswer:question.correctAnswer,isCorrect:index<2,answeredAt:`2026-09-${String(20-index).padStart(2,'0')}T11:00:00.000Z`}))
    const result=calculatePdMastery(unit,input({lessonProgress:[{...lesson('mastered',100),pdCode:question.pdCode}],questionAttempts:attempts}))
    expect(result.falseConfidence).toBe(true)
    expect(result.falseConfidenceMessage).toBe('Estudado, mas precisa de prática.')
    expect(result.practiceAccuracy).toBeLessThan(60)
  })

  it('pondera dificuldade: acertar a difícil vale mais que acertar a fácil no mesmo par',()=>{
    const q=cpaQuestions[0]
    const unit=cpaCurriculum.find((item)=>item.pdCode===q.pdCode)!
    const difficulty=new Map([['hard','hard' as const],['easy','easy' as const]])
    const hardCorrect=calculatePdMastery(unit,input({questionDifficultyById:difficulty,questionAttempts:[
      {id:'1',questionId:'hard',pdCode:q.pdCode,selectedAnswer:0,correctAnswer:0,isCorrect:true,answeredAt:'2026-09-20T11:00:00.000Z'},
      {id:'2',questionId:'easy',pdCode:q.pdCode,selectedAnswer:1,correctAnswer:0,isCorrect:false,answeredAt:'2026-09-20T11:00:00.000Z'},
    ]}))
    const easyCorrect=calculatePdMastery(unit,input({questionDifficultyById:difficulty,questionAttempts:[
      {id:'1',questionId:'hard',pdCode:q.pdCode,selectedAnswer:1,correctAnswer:0,isCorrect:false,answeredAt:'2026-09-20T11:00:00.000Z'},
      {id:'2',questionId:'easy',pdCode:q.pdCode,selectedAnswer:0,correctAnswer:0,isCorrect:true,answeredAt:'2026-09-20T11:00:00.000Z'},
    ]}))
    expect(hardCorrect.weightedQuestionAccuracy).toBeGreaterThan(easyCorrect.weightedQuestionAccuracy!)
  })

  it('incorpora flashcards ao domínio sem deixá-los dominar a evidência',()=>{
    const cardId=`lesson:${terminal.pdCode}:1`
    const without=calculatePdMastery(terminal,input({lessonProgress:[lesson('completed',70)]}))
    const withCards=calculatePdMastery(terminal,input({lessonProgress:[lesson('completed',70)],flashcardPdById:new Map([[cardId,terminal.pdCode]]),flashcardReviews:[
      {id:'r1',flashcardId:cardId,rating:'good',reviewedAt:'2026-09-20T09:00:00.000Z'},
      {id:'r2',flashcardId:cardId,rating:'easy',reviewedAt:'2026-09-20T10:00:00.000Z'},
      {id:'r3',flashcardId:cardId,rating:'good',reviewedAt:'2026-09-20T11:00:00.000Z'},
    ]}))
    expect(withCards.flashcardRecall).toBeGreaterThan(70)
    expect(withCards.score).toBeGreaterThan(without.score)
    expect(withCards.score).toBeLessThan(90)
  })

  it('dá mais peso ao simulado completo recente na média de prova',()=>{
    const snapshot=buildStudyEngineSnapshot(input({simulations:[
      officialExam(40,'2026-06-01T12:00:00.000Z'),
      officialExam(80,'2026-09-19T12:00:00.000Z'),
    ]}))
    expect(snapshot.recentOfficialExamAverage).toBeGreaterThan(60)
    expect(snapshot.officialExamCount).toBe(2)
  })

  it('centraliza níveis 0–29 / 30–59 / 60–79 / 80–100 e limita recomendações a três',()=>{
    const question=cpaQuestions[0]
    const unit=cpaCurriculum.find((item)=>item.pdCode===question.pdCode)!
    const attempts=Array.from({length:6},(_,index)=>({id:String(index),questionId:question.id,pdCode:question.pdCode,selectedAnswer:question.correctAnswer,correctAnswer:question.correctAnswer,isCorrect:true,answeredAt:'2026-09-20T11:00:00.000Z'}))
    const result=calculatePdMastery(unit,input({questionAttempts:attempts}))
    const expected=result.score<30?'weak':result.score<60?'learning':result.score<80?'good':'mastered'
    expect(result.level).toBe(expected)
    const snapshot=buildStudyEngineSnapshot(input())
    expect(snapshot.recommendations.length).toBeLessThanOrEqual(3)
    expect(snapshot.today.length).toBeLessThanOrEqual(3)
  })

  it('só sinaliza prontidão com amostra suficiente e mantém disclaimer',()=>{
    const direct=Array.from({length:40},(_,index)=>({id:String(index),questionId:`q-${index}`,pdCode:terminal.pdCode,selectedAnswer:0,correctAnswer:0,isCorrect:true,answeredAt:'2026-09-20T11:00:00.000Z'}))
    const snapshot=buildStudyEngineSnapshot(input({questionAttempts:direct,simulations:[
      officialExam(76,'2026-09-17T12:00:00.000Z'),
      officialExam(82,'2026-09-19T12:00:00.000Z'),
    ]}))
    expect(snapshot.readinessDataStatus).not.toBe('insufficient')
    expect(snapshot.readinessScore).not.toBeNull()
    expect(snapshot.readinessMessage.toLowerCase()).toContain('não é garantia')
    expect(snapshot.readinessBreakdown.fullExams).toBeGreaterThan(70)
  })
})
