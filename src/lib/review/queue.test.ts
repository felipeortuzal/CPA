import { describe, expect, it } from 'vitest'
import type { StudyEngineSnapshot } from '../study-engine/types'
import type { ErrorRecord } from '../storage/types'
import { buildReviewCenter, selectReviewQueue } from './queue'

const study:StudyEngineSnapshot={
  generatedAt:'2026-09-20T12:00:00Z',overallMastery:40,coveragePercent:20,readinessScore:30,readinessLabel:'Construindo base',readyForExam:false,recentOfficialExamAverage:null,dueReviews:1,recommendedMinutes:20,today:[],
  macroSummary:[
    {macroCode:'1',title:'Tema 1',officialWeight:20,score:50,coveragePercent:50,dueReviews:1,weakItems:1,totalItems:10},
    {macroCode:'2',title:'Tema 2',officialWeight:40,score:30,coveragePercent:10,dueReviews:0,weakItems:1,totalItems:10},
    {macroCode:'3',title:'Tema 3',officialWeight:30,score:0,coveragePercent:0,dueReviews:0,weakItems:0,totalItems:10},
    {macroCode:'4',title:'Tema 4',officialWeight:10,score:0,coveragePercent:0,dueReviews:0,weakItems:0,totalItems:10},
  ],
  mastery:[
    {pdCode:'1.1',title:'PD estudado',macroCode:'1',macroTitle:'Tema 1',score:45,confidence:50,level:'developing',evidenceCount:3,practiceAttempts:1,practiceAccuracy:0,unresolvedErrors:0,hasDoubt:false,lastEvidenceAt:'2026-09-01T12:00:00Z',nextReviewAt:'2026-09-10T12:00:00Z',reviewIntervalDays:4,overdue:true,lessonAvailable:true,questionAvailable:true},
    {pdCode:'2.1',title:'PD sem evidência',macroCode:'2',macroTitle:'Tema 2',score:0,confidence:0,level:'new',evidenceCount:0,practiceAttempts:0,practiceAccuracy:null,unresolvedErrors:0,hasDoubt:false,lastEvidenceAt:null,nextReviewAt:null,reviewIntervalDays:1,overdue:false,lessonAvailable:false,questionAvailable:true},
  ],
  weakPdCodes:['1.1'],masteredPdCodes:[],
}

describe('V8 review queue',()=>{
  it('prioriza erro recorrente acima de flashcard e conteúdo fraco',()=>{
    const error:ErrorRecord={id:'question:q1',sourceType:'question',sourceId:'q1',pdCode:'1.1',prompt:'Questão',selectedAnswer:'B',correctAnswer:'A',createdAt:'2026-09-10T12:00:00Z',resolvedAt:null,wrongCount:3,lastWrongAt:'2026-09-19T12:00:00Z'}
    const center=buildReviewCenter(study,[{id:'lesson:1.1:1',certification:'CPA',pdCode:'1.1',front:'F',back:'V',source:'lesson'}],[],[error],new Date('2026-09-20T12:00:00Z'))
    expect(center.queue[0].type).toBe('error')
    expect(center.recurrentErrors).toBe(1)
    expect(center.dueFlashcards).toBe(1)
  })

  it('não transforma conteúdo nunca estudado em revisão',()=>{
    const center=buildReviewCenter(study,[],[],[],new Date('2026-09-20T12:00:00Z'))
    expect(center.queue.some((item)=>item.pdCode==='2.1')).toBe(false)
    expect(center.queue.some((item)=>item.pdCode==='1.1')).toBe(true)
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
