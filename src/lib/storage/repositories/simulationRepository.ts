import { cpaQuestionMap } from '../../../../content/cpa/questions'
import type { SimulationDefinition } from '../../simulations/engine'
import { gradeSimulation } from '../../simulations/engine'
import { getDatabase } from '../database'
import { notifyStorageChanged } from '../events'
import type { ErrorRecord, SimulationRecord } from '../types'
import { recordSignificantActivity } from './activityRepository'

export async function createSimulation(definition: SimulationDefinition) {
  const now = new Date().toISOString()
  const record: SimulationRecord = {
    id: crypto.randomUUID(),
    certification: 'CPA',
    score: null,
    questionCount: definition.questionCount,
    completedAt: null,
    payload: {
      mode: definition.mode,
      label: definition.label,
      theme: definition.theme,
      questionIds: definition.questionIds,
      answers: Object.fromEntries(definition.questionIds.map((id) => [id, null])),
      markedForReview: [],
      notes: '',
      startedAt: now,
      durationSeconds: definition.durationSeconds,
      cutoff: definition.cutoff,
      result: null,
    },
  }
  await (await getDatabase()).put('simulations', record)
  notifyStorageChanged()
  return record
}

export async function getSimulation(id: string) { return (await getDatabase()).get('simulations', id) }

export async function getSimulations() {
  const rows = await (await getDatabase()).getAll('simulations')
  return rows.sort((a, b) => b.payload.startedAt.localeCompare(a.payload.startedAt))
}

export async function saveSimulationAnswer(id: string, questionId: string, selectedAnswer: number | null) {
  if (selectedAnswer !== null && (!Number.isInteger(selectedAnswer) || selectedAnswer < 0 || selectedAnswer > 3)) throw new Error('Alternativa inválida.')
  const db = await getDatabase(); const record = await db.get('simulations', id)
  if (!record || record.completedAt) return null
  if (!record.payload.questionIds.includes(questionId)) throw new Error('Questão não pertence a este simulado.')
  const next: SimulationRecord = { ...record, payload: { ...record.payload, answers: { ...record.payload.answers, [questionId]: selectedAnswer } } }
  await db.put('simulations', next); notifyStorageChanged(); return next
}

export async function toggleSimulationReview(id: string, questionId: string) {
  const db = await getDatabase(); const record = await db.get('simulations', id)
  if (!record || record.completedAt) return null
  const marked = new Set(record.payload.markedForReview)
  if (marked.has(questionId)) marked.delete(questionId); else marked.add(questionId)
  const next: SimulationRecord = { ...record, payload: { ...record.payload, markedForReview: [...marked] } }
  await db.put('simulations', next); notifyStorageChanged(); return next
}

export async function saveSimulationNotes(id: string, notes: string) {
  const db = await getDatabase(); const record = await db.get('simulations', id)
  if (!record || record.completedAt) return null
  const next: SimulationRecord = { ...record, payload: { ...record.payload, notes: notes.slice(0, 10000) } }
  await db.put('simulations', next); notifyStorageChanged(); return next
}

export async function finishSimulation(id: string, forcedTimeUsedSeconds?: number) {
  const db = await getDatabase(); const record = await db.get('simulations', id)
  if (!record) throw new Error('Simulado não encontrado.')
  if (record.completedAt && record.payload.result) return record
  const questions = record.payload.questionIds.map((questionId) => cpaQuestionMap.get(questionId)).filter((question): question is NonNullable<typeof question> => Boolean(question))
  if (questions.length !== record.payload.questionIds.length) throw new Error('Uma ou mais questões deste simulado não existem mais no banco atual.')
  const now = new Date()
  const elapsed = forcedTimeUsedSeconds ?? Math.max(0, Math.min(record.payload.durationSeconds, Math.floor((now.getTime() - new Date(record.payload.startedAt).getTime()) / 1000)))
  const result = gradeSimulation(questions, record.payload.answers, record.payload.markedForReview, record.payload.cutoff, elapsed)
  const completedAt = now.toISOString()
  const next: SimulationRecord = { ...record, score: result.scorePercent, completedAt, payload: { ...record.payload, result } }
  await db.put('simulations', next)

  for (const row of result.questionResults.filter((item) => !item.isCorrect && item.selectedAnswer !== null)) {
    const question = cpaQuestionMap.get(row.questionId)
    if (!question) continue
    const errorId = `question:${question.id}`
    const current = await db.get('errors', errorId)
    const error: ErrorRecord = {
      id: errorId,
      sourceType: 'question',
      sourceId: question.id,
      pdCode: question.pdCode,
      prompt: question.prompt,
      selectedAnswer: question.options[row.selectedAnswer!],
      correctAnswer: question.options[question.correctAnswer],
      createdAt: current?.createdAt ?? completedAt,
      resolvedAt: null,
      wrongCount: (current?.wrongCount ?? 0) + 1,
      lastWrongAt: completedAt,
    }
    await db.put('errors', error)
  }

  await recordSignificantActivity()
  notifyStorageChanged()
  return next
}

export async function getSeenQuestionIds() {
  const db = await getDatabase()
  const [attempts, simulations] = await Promise.all([db.getAll('questionAttempts'), db.getAll('simulations')])
  return new Set([...attempts.map((item) => item.questionId), ...simulations.flatMap((item) => item.payload.questionIds)])
}
