import { describe, expect, it } from 'vitest'
import { generateExamStudyPlan } from './engine'
import type { ExamStudyPlanSettings } from './types'
import type { StudyEngineSnapshot } from '../study-engine/types'

const now=new Date('2026-09-20T12:00:00.000Z')
function study(overrides:Partial<StudyEngineSnapshot>={}):StudyEngineSnapshot{
  return{
    generatedAt:now.toISOString(),overallMastery:20,coveragePercent:10,sufficientCoveragePercent:5,readinessScore:null,readinessDataStatus:'insufficient',readinessLabel:'Dados insuficientes',readinessMessage:'',readinessBreakdown:{coverage:10,mastery:20,fullExams:0,recentPerformance:0,consistency:0,themeBalance:0},readyForExam:false,recentOfficialExamAverage:null,officialExamCount:0,recentPracticeAccuracy:null,dueReviews:2,recommendedMinutes:30,today:[],
    recommendations:[{pdCode:'1.1',title:'Base do SFN',macroCode:'1',kind:'learn',score:20,priority:100,reason:'Lacuna prioritária.',targetMinutes:20,route:'/conteudos/1.1'}],
    macroSummary:[],mastery:[],weakTopics:[{pdCode:'1.1',title:'Base do SFN',macroCode:'1',score:20,dataStatus:'partial',practiceAccuracy:40,unresolvedErrors:2,falseConfidence:false,reason:'Desempenho baixo.',route:'/questoes?pd=1.1'}],falseConfidencePdCodes:[],weakPdCodes:['1.1'],masteredPdCodes:[],...overrides,
  }
}
function settings(examDate:string|null,startDate:string|null='2026-09-20'):ExamStudyPlanSettings{return{examDate,startDate,availableWeekdays:[0,1,2,3,4,5,6],minutesPerDay:60,updatedAt:now.toISOString()}}

describe('V10 plano de estudos para a data da prova',()=>{
  it.each([['2026-12-19',90],['2026-10-20',30],['2026-09-27',7]] as const)('gera cronograma para %s com %i dias', (examDate,expectedDays)=>{
    const plan=generateExamStudyPlan(settings(examDate),study(),now)
    expect(plan.availableStudyDays).toBe(expectedDays)
    expect(plan.phases).toHaveLength(6)
    expect(plan.phases.every((phase)=>phase.days>=1)).toBe(true)
    expect(plan.agenda.every((day)=>day.tasks.length>0&&day.minutes<=60)).toBe(true)
  })

  it('aumenta a proporção de dias com simulado quando a prova se aproxima',()=>{
    const ninety=generateExamStudyPlan(settings('2026-12-19'),study(),now)
    const seven=generateExamStudyPlan(settings('2026-09-27'),study(),now)
    expect(seven.simulationDays/seven.availableStudyDays).toBeGreaterThan(ninety.simulationDays/ninety.availableStudyDays)
  })

  it('recalcula de forma diferente para aluno atrasado e adiantado',()=>{
    const delayed=study({coveragePercent:0,overallMastery:0,recommendations:[],weakTopics:[]})
    const advanced=study({coveragePercent:85,overallMastery:80,readinessScore:78,readinessDataStatus:'sufficient',weakTopics:[],weakPdCodes:[]})
    const config=settings('2026-12-19','2026-09-01')
    const delayedPlan=generateExamStudyPlan(config,delayed,now)
    const advancedPlan=generateExamStudyPlan(config,advanced,now)
    expect(delayedPlan.paceStatus).toBe('behind')
    expect(advancedPlan.paceStatus).toBe('ahead')
    expect(advancedPlan.simulationDays).toBeGreaterThan(delayedPlan.simulationDays)
  })

  it('reage a melhora e piora do desempenho sem depender de estado manual do cronograma',()=>{
    const poor=generateExamStudyPlan(settings('2026-10-20','2026-09-01'),study({overallMastery:25,coveragePercent:35,falseConfidencePdCodes:['1.1','1.2','1.3']}),now)
    const better=generateExamStudyPlan(settings('2026-10-20','2026-09-01'),study({overallMastery:75,coveragePercent:80,readinessScore:72,readinessDataStatus:'sufficient',falseConfidencePdCodes:[],weakTopics:[]}),now)
    expect(poor.phases.find((phase)=>phase.phase==='coverage')!.days).toBeGreaterThan(better.phases.find((phase)=>phase.phase==='coverage')!.days)
    expect(better.simulationDays).toBeGreaterThan(poor.simulationDays)
  })

  it('funciona sem data da prova em janela móvel de 14 sessões',()=>{
    const plan=generateExamStudyPlan(settings(null,null),study(),now)
    expect(plan.daysUntilExam).toBeNull()
    expect(plan.availableStudyDays).toBe(14)
    expect(plan.paceStatus).toBe('continuous')
    expect(plan.agenda.every((day)=>day.tasks.every((task)=>task.route.startsWith('/')))).toBe(true)
  })
})
