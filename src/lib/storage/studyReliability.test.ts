import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createBackup, resetAllProgress, validateBackup } from './backup'
import { closeDatabase } from './database'
import { getLessonProgress, markLessonStudied, saveQuizAttempt, toggleLessonDoubt } from './repositories/learningRepository'
import { addActiveStudySeconds, beginStudySession, getStudySessions } from './repositories/activityRepository'
import { createCustomFlashcard, getFlashcardReviews, reviewFlashcard } from './repositories/flashcardRepository'
import { createProfile, getProfile, updateProfile } from './repositories/profileRepository'

beforeEach(resetAllProgress)
afterEach(closeDatabase)

describe('study reliability audit', () => {
  it('keeps completion, best quiz score and doubt after simultaneous changes', async () => {
    await Promise.all([markLessonStudied('1.1.1'), saveQuizAttempt('1.1.1', [0,1,2], 3, 3), toggleLessonDoubt('1.1.1')])
    expect(await getLessonProgress('1.1.1')).toMatchObject({ status: 'mastered', quizBestScore: 100, hasDoubt: true })
  })
  it('does not lose accumulated study seconds or independent profile changes', async () => {
    const session = await beginStudySession('lesson', '1.1.1')
    await Promise.all([addActiveStudySeconds(session.id,15), addActiveStudySeconds(session.id,15)])
    expect((await getStudySessions())[0].activeSeconds).toBe(30)
    await createProfile('Felipe')
    await Promise.all([updateProfile({displayName:'Thó'}), updateProfile({dailyGoalMinutes:60})])
    expect(await getProfile()).toMatchObject({displayName:'Thó',dailyGoalMinutes:60})
  })
  it('serializes flashcard scheduling even when review timestamps match', async () => {
    const card = await createCustomFlashcard('Frente','Verso')
    const at = new Date('2026-09-25T12:00:00Z')
    await Promise.all([reviewFlashcard(`custom:${card.id}`,'good',at),reviewFlashcard(`custom:${card.id}`,'good',at)])
    expect((await getFlashcardReviews()).map(row=>row.reviewCount).sort()).toEqual([1,2])
  })
  it.each([
    {nextReview:'not-a-date'}, {interval:-1}, {ease:'broken'}, {reviewCount:-3},
  ])('rejects malformed flashcard schedules %j', async (patch) => {
    const backup = await createBackup()
    backup.flashcardReviews.push({id:'test',flashcardId:'card',rating:'good',reviewedAt:new Date().toISOString(),...patch} as never)
    expect(validateBackup(backup)).toBe(false)
  })
  it('rejects object-shaped error counters that would crash rendering', async () => {
    const backup = await createBackup()
    backup.errors.push({id:'bad',sourceType:'question',sourceId:'q',pdCode:null,prompt:'Teste',selectedAnswer:null,correctAnswer:null,createdAt:new Date().toISOString(),resolvedAt:null,errorCount:{bad:true}} as never)
    expect(validateBackup(backup)).toBe(false)
  })
  it('rejects invalid dates in exam settings before import', async () => {
    const backup = await createBackup()
    backup.studyPlans.push({id:'exam-plan:settings',updatedAt:new Date().toISOString(),payload:{examDate:null,startDate:'invalid',minutesPerDay:30,availableWeekdays:[1],updatedAt:new Date().toISOString()}})
    expect(validateBackup(backup)).toBe(false)
  })
})
