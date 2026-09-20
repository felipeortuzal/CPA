import { describe, expect, it } from 'vitest'
import type { StudyEngineSnapshot, PDMastery } from '../study-engine/types'
import type { ErrorRecord } from '../storage/types'
import { buildReviewCenter, selectReviewQueue } from './queue'

function pd(overrides:Partial<PDMastery>):PDMastery{
  return{pdCode:'1.1',title:'PD',macroCode:'1',macroTitle:'Tema 1',score:45,confidence:50,dataStatus:'partial',level:'learning',evidenceCount:3,practiceAttempts:1,practiceAccuracy:0,weightedQuestionAccuracy:0,simulationAccuracy:null,flashcardRecall:null,officialExamSamples:0,unresolvedErrors:0,hasDoubt:false,falseConfidence:false,falseConfidenceMessage:null,lastEvidenceAt:'2026-09-01T12:00:00Z',nextReviewAt:'2026-09-10T12:00:00Z',reviewIntervalDays:4,overdue:true,lessonAvailable:true,questionAvailable:true,...overrides}
}
const study:StudyEngineSnapshot={
  generatedAt:'2026-09-20T12:00:00Z',overallMastery:40,coveragePercent:20,sufficientCoveragePercent:10,readinessScore:null,readinessDataStatus:'insufficient',readinessLabel:'Dados insuficientes',readinessMessage:'Amostra insuficiente.',readinessBreakdown:{coverage:20,mastery:40,fullExams:0,recentPerformance:0,consistency:0,themeBalance:20},readyForExam:false,recentOfficialExamAverage:null,officialExamCount:0,recentPracticeAccuracy:null,dueReviews:1,recommendedMinutes:20,today:[],recommendations:[],
  macroSummary:[
    {macroCode:'1',title:'Tema 1',officialWeight:20,score:50,coveragePercent:50,sufficientPercent:20,dueReviews:1,weakItems:1,totalItems:10},
    {macroCode:'2',title:'Tema 2',officialWeight:40,score:30,coveragePercent:10,sufficientPercent:0,dueReviews:0,weakItems:1,totalItems:10},
    {macroCode:'3',title:'Tema 3',officialWeight:30,score:0,coveragePercent:0,sufficientPercent:0,dueReviews:0,weakItems:0,totalItems:10},
    {macroCode:'4',title:'Tema 4',officialWeight:10,score:0,coveragePercent:0,sufficientPercent:0,dueReviews:0,weakItems:0,totalItems:10},
  ],
  mastery:[pd({pdCode:'1.1',title:'PD estudado'}),pd({pdCode:'2.1',title:'PD sem evidência',macroCode:'2',macroTitle:'Tema 2',score:0,confidence:0,dataStatus:'insufficient',level:'weak',evidenceCount:0,practiceAttempts:0,practiceAccuracy:null,weightedQuestionAccuracy:null,lastEvidenceAt:null,nextReviewAt:null,reviewIntervalDays:1,overdue:false,lessonAvailable:false,questionAvailable:true})],
  weakTopics:[],falseConfidencePdCodes:[],weakPdCodes:['1.1'],masteredPdCodes:[],
}

describe('V9 review queue compatibility',()=>{
  it('prioriza erro recorrente acima de flashcard e conteúdo fraco',()=>{
    const error:ErrorRecord={id:'question:q1',sourceType:'question',sourceId:'q1',pdCode:'1.1',prompt:'Questão',selectedAnswer:'B',correctAnswer:'A',createdAt:'2026-09-10T12:00:00Z',resolvedAt:null,errorCount:3,lastWrongAt:'2026-09-19T12:00:00Z'}
    const center=buildReviewCenter(study,[{id:'lesson:1.1:1',certification:'CPA',pdCode:'1.1',front:'F',back:'V',source:'lesson'}],[],[error],new Date('2026-09-20T12:00:00Z'))
    expect(center.queue[0].type).toBe('error')
    expect(center.recurrentErrors).toBe(1)
    expect(center.dueFlashcards).toBe(1)
  })

  it('coloca Revisar depois abaixo de Ainda tenho dúvida',()=>{
    const doubt:ErrorRecord={id:'question:q1',sourceType:'question',sourceId:'q1',pdCode:'1.1',prompt:'Dúvida',selectedAnswer:'B',correctAnswer:'A',createdAt:'2026-09-10T12:00:00Z',resolvedAt:null,errorCount:1,reviewStatus:'doubt'}
    const later:ErrorRecord={id:'question:q2',sourceType:'question',sourceId:'q2',pdCode:'1.2',prompt:'Depois',selectedAnswer:'B',correctAnswer:'A',createdAt:'2026-09-10T12:00:00Z',resolvedAt:null,errorCount:1,reviewStatus:'review_later'}
    const center=buildReviewCenter(study,[],[],[later,doubt],new Date('2026-09-20T12:00:00Z'))
    expect(center.queue.filter((item)=>item.type==='error').map((item)=>item.errorId)).toEqual([doubt.id,later.id])
  })

  it('não transforma conteúdo nunca estudado em revisão',()=>{
    const center=buildReviewCenter(study,[],[],[],new Date('2026-09-20T12:00:00Z'))
    expect(center.queue.some((item)=>item.pdCode==='2.1')).toBe(false)
    expect(center.queue.some((item)=>item.pdCode==='1.1')).toBe(true)
  })

  it('prioriza falsa confiança para prática',()=>{
    const falseConfidenceStudy={...study,mastery:[pd({falseConfidence:true,falseConfidenceMessage:'Estudado, mas precisa de prática.',score:55,overdue:false})]}
    const center=buildReviewCenter(falseConfidenceStudy,[],[],[],new Date('2026-09-20T12:00:00Z'))
    expect(center.queue[0].reason).toContain('precisa de prática')
    expect(center.queue[0].route).toContain('/questoes')
  })

  it('respeita o orçamento dos modos rápidos',()=>{
    const queue=[
      {id:'a',type:'error' as const,pdCode:'1',title:'A',reason:'',priority:10,estimatedMinutes:3,route:null},
      {id:'b',type:'flashcard' as const,pdCode:'1',title:'B',reason:'',priority:9,estimatedMinutes:1,route:null},
      {id:'c',type:'content' as const,pdCode:'1',title:'C',reason:'',priority:8,estimatedMinutes:5,route:null},
      {id:'d',type:'flashcard' as const,pdCode:'1',title:'D',reason:'',priority:7,estimatedMinutes:1,route:null},
    ]
    const five=selectReviewQueue(queue,'5')
    expect(five.reduce((sum,item)=>sum+item.estimatedMinutes,0)).toBeLessThanOrEqual(5)
    expect(five.map((item)=>item.id)).toEqual(['a','b','d'])
  })

  it('Revisão de Véspera exclui conteúdo de baixa prioridade',()=>{
    const queue=[
      {id:'e',type:'error' as const,pdCode:'1',title:'Erro',reason:'',priority:250,estimatedMinutes:3,route:null},
      {id:'f',type:'flashcard' as const,pdCode:'1',title:'Card',reason:'',priority:150,estimatedMinutes:1,route:null},
      {id:'c',type:'content' as const,pdCode:'1',title:'Conteúdo',reason:'',priority:120,estimatedMinutes:5,route:null},
    ]
    expect(selectReviewQueue(queue,'eve').map((item)=>item.id)).toEqual(['e','f'])
  })
})
