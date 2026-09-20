import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cpaQuestions } from '../../../content/cpa/questions'
import { resetAllProgress } from './backup'
import { closeDatabase } from './database'
import { answerQuestion, getQuestionErrors, setQuestionErrorReviewStatus } from './repositories/questionRepository'

describe('V8 caderno de erros',()=>{
  beforeEach(async()=>{await resetAllProgress()})
  afterEach(async()=>{await closeDatabase()})

  it('registra metadados, estados de revisão e reabre erro quando ele volta a ocorrer',async()=>{
    const question=cpaQuestions[0]
    const wrong=(question.correctAnswer+1)%4
    await answerQuestion(question,wrong)
    let error=(await getQuestionErrors(true))[0]
    expect(error.questionId).toBe(question.id)
    expect(error.date).toBeTruthy()
    expect(error.attemptCount).toBe(1)
    expect(error.errorCount).toBe(1)
    expect(error.lastErrorAt).toBeTruthy()
    expect(error.resolved).toBe(false)
    expect(error.reviewStatus).toBe('doubt')

    await setQuestionErrorReviewStatus(error.id,'review_later')
    error=(await getQuestionErrors(true))[0]
    expect(error.reviewStatus).toBe('review_later')
    expect(error.resolvedAt).toBeNull()

    await setQuestionErrorReviewStatus(error.id,'understood')
    error=(await getQuestionErrors(true))[0]
    expect(error.reviewStatus).toBe('understood')
    expect(error.resolved).toBe(true)
    expect(error.resolvedAt).toBeTruthy()

    await answerQuestion(question,wrong)
    error=(await getQuestionErrors(true))[0]
    expect(error.reviewStatus).toBe('doubt')
    expect(error.resolved).toBe(false)
    expect(error.resolvedAt).toBeNull()
    expect(error.errorCount).toBe(2)
  })
})
