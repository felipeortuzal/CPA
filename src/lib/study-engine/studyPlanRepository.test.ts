import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { buildStudyEngineSnapshot } from './engine'
import { resetAllProgress } from '../storage/backup'
import { closeDatabase } from '../storage/database'
import { getStudyPlans, saveDailyStudyPlan } from '../storage/repositories/studyPlanRepository'

describe('persistência do plano V9',()=>{
  beforeEach(async()=>{await resetAllProgress()})
  afterEach(async()=>{await closeDatabase()})

  it('salva prontidão e recomendações sem criar schema novo',async()=>{
    const snapshot=buildStudyEngineSnapshot({
      lessonProgress:[],quizAttempts:[],questionAttempts:[],simulations:[],errors:[],flashcardReviews:[],
      flashcardPdById:new Map(),questionDifficultyById:new Map(),lessonPdCodes:new Set(),questionPdCodes:new Set(),dailyGoalMinutes:30,
      now:new Date('2026-09-20T12:00:00.000Z'),
    })
    await saveDailyStudyPlan(snapshot)
    const plans=await getStudyPlans()
    expect(plans).toHaveLength(1)
    expect(plans[0].id).toBe('daily:2026-09-20')
    const payload=plans[0].payload as {overallMastery:number;readinessScore:number|null;readinessDataStatus:string;recommendations:unknown[]}
    expect(payload.overallMastery).toBe(0)
    expect(payload.readinessScore).toBeNull()
    expect(payload.readinessDataStatus).toBe('insufficient')
    expect(payload.recommendations.length).toBeLessThanOrEqual(3)
  })
})
