import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createBackup, resetAllProgress } from './backup'
import { closeDatabase } from './database'
import { getExamStudyPlanSettings, getExamStudyPlanSnapshot, saveExamStudyPlanSettings, saveExamStudyPlanSnapshot } from './repositories/examStudyPlanRepository'
import { generateExamStudyPlan } from '../study-plan/engine'
import type { StudyEngineSnapshot } from '../study-engine/types'

const now=new Date('2026-09-20T12:00:00.000Z')
const emptyStudy:StudyEngineSnapshot={generatedAt:now.toISOString(),overallMastery:0,coveragePercent:0,sufficientCoveragePercent:0,readinessScore:null,readinessDataStatus:'insufficient',readinessLabel:'Dados insuficientes',readinessMessage:'',readinessBreakdown:{coverage:0,mastery:0,fullExams:0,recentPerformance:0,consistency:0,themeBalance:0},readyForExam:false,recentOfficialExamAverage:null,officialExamCount:0,recentPracticeAccuracy:null,dueReviews:0,recommendedMinutes:0,today:[],recommendations:[],macroSummary:[],mastery:[],weakTopics:[],falseConfidencePdCodes:[],weakPdCodes:[],masteredPdCodes:[]}

describe('V10 persistência do plano para a prova',()=>{
  beforeEach(async()=>{await resetAllProgress()})
  afterEach(async()=>{await closeDatabase()})

  it('salva, altera e remove a data sem migration de schema',async()=>{
    await saveExamStudyPlanSettings({examDate:'2026-12-19',startDate:'2026-09-20',availableWeekdays:[1,2,3,4,5],minutesPerDay:45,updatedAt:now.toISOString()})
    expect((await getExamStudyPlanSettings())?.examDate).toBe('2026-12-19')
    await saveExamStudyPlanSettings({examDate:'2027-01-10',startDate:null,availableWeekdays:[1,3,5],minutesPerDay:60,updatedAt:'2026-09-21T12:00:00.000Z'})
    expect((await getExamStudyPlanSettings())?.examDate).toBe('2027-01-10')
    await saveExamStudyPlanSettings({examDate:null,startDate:null,availableWeekdays:[1,3,5],minutesPerDay:60,updatedAt:'2026-09-22T12:00:00.000Z'})
    expect((await getExamStudyPlanSettings())?.examDate).toBeNull()
  })

  it('persiste o plano atual e inclui configuração/snapshot no backup JSON existente',async()=>{
    const settings={examDate:'2026-10-20',startDate:'2026-09-20',availableWeekdays:[0,1,2,3,4,5,6],minutesPerDay:30,updatedAt:now.toISOString()}
    await saveExamStudyPlanSettings(settings)
    const plan=generateExamStudyPlan(settings,emptyStudy,now)
    await saveExamStudyPlanSnapshot(plan)
    expect((await getExamStudyPlanSnapshot())?.availableStudyDays).toBe(30)
    const backup=await createBackup()
    expect(backup.studyPlans.some((row)=>row.id==='exam-plan:settings')).toBe(true)
    expect(backup.studyPlans.some((row)=>row.id==='exam-plan:current')).toBe(true)
  })
})
