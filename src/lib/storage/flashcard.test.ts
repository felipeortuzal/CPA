import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cpaLessonFlashcards } from '../../../content/cpa/flashcards'
import { cpaLessons } from '../../../content/cpa/lessons'
import { createBackup, resetAllProgress } from './backup'
import { closeDatabase } from './database'
import { createCustomFlashcard, getActiveFlashcards, getFlashcardReviews, reviewFlashcard } from './repositories/flashcardRepository'
import { markLessonOpened } from './repositories/learningRepository'
import { createProfile } from './repositories/profileRepository'

describe('V8 flashcards local-first',()=>{
  beforeEach(async()=>{await resetAllProgress();await createProfile('Felipe')})
  afterEach(async()=>{await closeDatabase()})

  it('ativa somente flashcards de aulas abertas e cartões pessoais',async()=>{
    const lesson=cpaLessons[0]
    expect(await getActiveFlashcards()).toHaveLength(0)
    await markLessonOpened(lesson.pdCode)
    const lessonCards=cpaLessonFlashcards.filter((card)=>card.pdCode===lesson.pdCode)
    expect(await getActiveFlashcards()).toHaveLength(lessonCards.length)
    await createCustomFlashcard('Frente pessoal','Verso pessoal',lesson.pdCode)
    expect(await getActiveFlashcards()).toHaveLength(lessonCards.length+1)
  })

  it('salva histórico e métricas de repetição espaçada',async()=>{
    const lesson=cpaLessons[0]
    await markLessonOpened(lesson.pdCode)
    const card=(await getActiveFlashcards())[0]
    await reviewFlashcard(card.id,'good',new Date('2026-09-20T12:00:00Z'))
    await reviewFlashcard(card.id,'easy',new Date('2026-09-21T12:00:00Z'))
    const rows=(await getFlashcardReviews(card.id)).sort((a,b)=>a.reviewedAt.localeCompare(b.reviewedAt))
    expect(rows).toHaveLength(2)
    expect(rows[0].lastReviewed).toBe('2026-09-20T12:00:00.000Z')
    expect(rows[0].nextReview).toBeTruthy()
    expect(rows[0].interval).toBe(1)
    expect(rows[1].reviewCount).toBe(2)
    expect(rows[1].correctStreak).toBe(2)
    expect(rows[1].ease).toBeGreaterThan(2.5)
    const backup=await createBackup()
    const backedUp=backup.flashcardReviews.filter((row)=>row.flashcardId===card.id).sort((a,b)=>a.reviewedAt.localeCompare(b.reviewedAt))
    expect(backedUp).toHaveLength(2)
    expect(backedUp[1].nextReview).toBe(rows[1].nextReview)
    expect(backedUp[1].correctStreak).toBe(2)
  })
})
