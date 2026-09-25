import { questionRevision, optionId } from '../../questionSnapshot'
import type { CPAQuestion } from '../../../../content/cpa/questions/types'
import { getDatabase } from '../database'
import { notifyStorageChanged } from '../events'
import type { ErrorRecord, FavoriteRecord, QuestionAttemptRecord } from '../types'
import { recordActivityInStore, toLocalDateKey } from './activityRepository'

export async function getQuestionAttempts(questionId?: string) {
  const db = await getDatabase()
  return questionId ? db.getAllFromIndex('questionAttempts', 'by-question-id', questionId) : db.getAll('questionAttempts')
}

export async function answerQuestion(question: CPAQuestion, selectedAnswer: number): Promise<QuestionAttemptRecord> {
  if (!Number.isInteger(selectedAnswer) || selectedAnswer < 0 || selectedAnswer >= question.options.length) throw new Error('Alternativa inválida.')
  const db = await getDatabase()
  const now = new Date().toISOString()
  const attempt: QuestionAttemptRecord = {
    id: crypto.randomUUID(),
    questionId: question.id,
    pdCode: question.pdCode,
    selectedAnswer,
    questionVersion: questionRevision(question),
    selectedOptionId: optionId(question, selectedAnswer),
    correctOptionId: optionId(question, question.correctAnswer),
    questionSnapshot: structuredClone(question),
    mode: 'practice',
    correctAnswer: question.correctAnswer,
    isCorrect: selectedAnswer === question.correctAnswer,
    answeredAt: now,
  }
  const tx = db.transaction(['questionAttempts', 'errors', 'activityDays'], 'readwrite')
  const attemptsStore = tx.objectStore('questionAttempts')
  const errorsStore = tx.objectStore('errors')
  await attemptsStore.put(attempt)

  if (!attempt.isCorrect) {
    const errorId = `question:${question.id}`
    const current = await errorsStore.get(errorId)
    const attemptsForQuestion = await attemptsStore.index('by-question-id').getAll(question.id)
    const errorCount = (current?.errorCount ?? current?.wrongCount ?? 0) + 1
    const error: ErrorRecord = {
      id: errorId,
      sourceType: 'question',
      sourceId: question.id,
      questionId: question.id,
      pdCode: question.pdCode,
      questionSnapshot: structuredClone(question),
      prompt: question.prompt,
      selectedAnswer: question.options[selectedAnswer],
      correctAnswer: question.options[question.correctAnswer],
      createdAt: current?.createdAt ?? now,
      date: current?.date ?? current?.createdAt ?? now,
      resolvedAt: null,
      resolved: false,
      reviewStatus: 'doubt',
      wrongCount: errorCount,
      errorCount,
      attemptCount: attemptsForQuestion.length,
      lastWrongAt: now,
      lastErrorAt: now,
    }
    await errorsStore.put(error)
  }

  const day = toLocalDateKey(now)
  const activityStore = tx.objectStore('activityDays')
  const activity = await activityStore.get(day)
  await activityStore.put({ date: day, events: (activity?.events ?? 0) + 1, lastActivityAt: now })
  await tx.done
  notifyStorageChanged()
  return attempt
}

export async function isQuestionFavorite(questionId: string) {
  return Boolean(await (await getDatabase()).get('favorites', `question:${questionId}`))
}

export async function toggleQuestionFavorite(questionId: string) {
  const db = await getDatabase(); const id = `question:${questionId}`; const tx = db.transaction('favorites', 'readwrite'); const current = await tx.store.get(id)
  if (current) { await tx.store.delete(id); await tx.done; notifyStorageChanged(); return false }
  const favorite: FavoriteRecord = { id, itemType: 'question', itemId: questionId, createdAt: new Date().toISOString() }
  await tx.store.put(favorite); await tx.done; notifyStorageChanged(); return true
}

export async function getQuestionFavorites() {
  const favorites = await (await getDatabase()).getAll('favorites')
  return favorites.filter((favorite) => favorite.itemType === 'question')
}

export async function getQuestionErrors(includeResolved = false) {
  const errors = await (await getDatabase()).getAll('errors')
  return errors.filter((error) => error.sourceType === 'question' && (includeResolved || !error.resolvedAt))
}

export async function setQuestionErrorReviewStatus(errorId: string, status: 'doubt' | 'understood' | 'review_later') {
  const db = await getDatabase(); const tx = db.transaction(['errors','activityDays'], 'readwrite'); const current = await tx.objectStore('errors').get(errorId)
  if (!current || current.sourceType !== 'question') return null
  const now = new Date().toISOString()
  const understood = status === 'understood'
  const next: ErrorRecord = { ...current, reviewStatus: status, resolved: understood, resolvedAt: understood ? now : null }
  await tx.objectStore('errors').put(next); await recordActivityInStore(tx.objectStore('activityDays')); await tx.done; notifyStorageChanged(); return next
}

export async function markQuestionErrorResolved(errorId: string) {
  return setQuestionErrorReviewStatus(errorId, 'understood')
}
