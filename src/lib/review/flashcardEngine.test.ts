import { describe, expect, it } from 'vitest'
import { cpaLessonFlashcards } from '../../../content/cpa/flashcards'
import { getLatestFlashcardState, scheduleFlashcardReview } from './flashcardEngine'
import type { FlashcardReviewRecord } from '../storage/types'

describe('V8 flashcard spaced repetition',()=>{
  it('gera IDs únicos para os flashcards de todas as 445 aulas',()=>{
    expect(cpaLessonFlashcards).toHaveLength(1780)
    expect(new Set(cpaLessonFlashcards.map((card)=>card.id)).size).toBe(1780)
  })

  it('considera cartão sem histórico como vencido e novo',()=>{
    const state=getLatestFlashcardState('card:1',[],new Date('2026-09-20T12:00:00Z'))
    expect(state.due).toBe(true)
    expect(state.reviewCount).toBe(0)
    expect(state.ease).toBe(2.5)
  })

  it('Again reinicia a sequência e agenda para o dia seguinte',()=>{
    const now=new Date('2026-09-20T12:00:00Z')
    const review=scheduleFlashcardReview('card:1','again',[],now)
    expect(review.interval).toBe(1)
    expect(review.correctStreak).toBe(0)
    expect(review.ease).toBe(2.3)
    expect(review.lastReviewed).toBe(now.toISOString())
    expect(review.nextReview).toBe('2026-09-21T12:00:00.000Z')
  })

  it('Good e Easy expandem o intervalo preservando histórico',()=>{
    const first=scheduleFlashcardReview('card:1','good',[],new Date('2026-09-20T12:00:00Z'))
    const second=scheduleFlashcardReview('card:1','good',[first],new Date('2026-09-21T12:00:00Z'))
    const third=scheduleFlashcardReview('card:1','easy',[first,second],new Date('2026-09-24T12:00:00Z'))
    expect(first.interval).toBe(1)
    expect(second.interval).toBe(3)
    expect(third.interval).toBeGreaterThan(second.interval!)
    expect(third.reviewCount).toBe(3)
    expect(third.correctStreak).toBe(3)
    expect(third.ease).toBeGreaterThan(2.5)
  })

  it('continua entendendo o formato legado com nextReviewAt',()=>{
    const legacy:FlashcardReviewRecord={id:'old',flashcardId:'card:1',rating:'good',reviewedAt:'2026-09-19T12:00:00Z',nextReviewAt:'2026-09-21T12:00:00Z'}
    const state=getLatestFlashcardState('card:1',[legacy],new Date('2026-09-20T12:00:00Z'))
    expect(state.due).toBe(false)
    expect(state.nextReviewAt).toBe('2026-09-21T12:00:00Z')
  })
})
