import type { CPAQuestion } from '../../../../content/cpa/questions/types'
import { getDatabase } from '../database'
import { notifyStorageChanged } from '../events'
import type { ErrorRecord, FavoriteRecord, QuestionAttemptRecord } from '../types'
import { recordSignificantActivity } from './activityRepository'

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
    correctAnswer: question.correctAnswer,
    isCorrect: selectedAnswer === question.correctAnswer,
    answeredAt: now,
  }
  await db.put('questionAttempts', attempt)

  if (!attempt.isCorrect) {
    const errorId = `question:${question.id}`
    const current = await db.get('errors', errorId)
    const error: ErrorRecord = {
      id: errorId,
      sourceType: 'question',
      sourceId: question.id,
      pdCode: question.pdCode,
      prompt: question.prompt,
      selectedAnswer: question.options[selectedAnswer],
      correctAnswer: question.options[question.correctAnswer],
      createdAt: current?.createdAt ?? now,
      resolvedAt: null,
      wrongCount: (current?.wrongCount ?? 0) + 1,
      lastWrongAt: now,
    }
    await db.put('errors', error)
  }

  await recordSignificantActivity()
  notifyStorageChanged()
  return attempt
}

export async function isQuestionFavorite(questionId: string) {
  return Boolean(await (await getDatabase()).get('favorites', `question:${questionId}`))
}

export async function toggleQuestionFavorite(questionId: string) {
  const db = await getDatabase(); const id = `question:${questionId}`; const current = await db.get('favorites', id)
  if (current) { await db.delete('favorites', id); notifyStorageChanged(); return false }
  const favorite: FavoriteRecord = { id, itemType: 'question', itemId: questionId, createdAt: new Date().toISOString() }
  await db.put('favorites', favorite); notifyStorageChanged(); return true
}

export async function getQuestionFavorites() {
  const favorites = await (await getDatabase()).getAll('favorites')
  return favorites.filter((favorite) => favorite.itemType === 'question')
}

export async function getQuestionErrors(includeResolved = false) {
  const errors = await (await getDatabase()).getAll('errors')
  return errors.filter((error) => error.sourceType === 'question' && (includeResolved || !error.resolvedAt))
}

export async function markQuestionErrorResolved(errorId: string) {
  const db = await getDatabase(); const current = await db.get('errors', errorId)
  if (!current || current.sourceType !== 'question') return null
  const next: ErrorRecord = { ...current, resolvedAt: new Date().toISOString() }
  await db.put('errors', next); await recordSignificantActivity(); notifyStorageChanged(); return next
}
