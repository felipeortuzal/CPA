import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { buildStudyEngineSnapshot } from './engine'
import { resetAllProgress } from '../storage/backup'
import { closeDatabase } from '../storage/database'
import { getStudyPlans, saveDailyStudyPlan } from '../storage/repositories/studyPlanRepository'

describe('persistência do plano V7',()=>{
  beforeEach(async()=>{await resetAllProgress()})
  afterEach(async()=>{await closeDatabase()})

  it('salva um snapshot diário no store já existente sem criar schema novo',async()=>{
    const snapshot=buildStudyEngineSnapshot({
      lessonProgress:[],quizAttempts:[],questionAttempts:[],simulations:[],errors:[],
      lessonPdCodes:new Set(),questionPdCodes:new Set(),dailyGoalMinutes:30,
      now:new Date('2026-09-20T12:00:00.000Z'),
    })
    await saveDailyStudyPlan(snapshot)
    const plans=await getStudyPlans()
    expect(plans).toHaveLength(1)
    expect(plans[0].id).toBe('daily:2026-09-20')
    expect((plans[0].payload as {overallMastery:number}).overallMastery).toBe(0)
  })
})