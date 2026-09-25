import { cpaQuestionMap } from '../../../../content/cpa/questions'
import type { SimulationDefinition } from '../../simulations/engine'
import { gradeSimulation } from '../../simulations/engine'
import { getDatabase } from '../database'
import { notifyStorageChanged } from '../events'
import type { ErrorRecord, SimulationRecord } from '../types'
import { toLocalDateKey } from './activityRepository'

export function getSimulationQuestions(record: SimulationRecord) {
  const snapshots = new Map(record.payload.questionSnapshots?.map((question) => [question.id, question]))
  return record.payload.questionIds.map((id) => snapshots.get(id) ?? cpaQuestionMap.get(id)).filter((question): question is NonNullable<typeof question> => Boolean(question))
}

function assertWithinDeadline(record: SimulationRecord) {
  if (Date.now() >= Date.parse(record.payload.startedAt) + record.payload.durationSeconds * 1000) throw new Error('O tempo terminou. Finalize para ver o resultado.')
}

export async function createSimulation(definition: SimulationDefinition) {
  const questions = definition.questionIds.map((id) => cpaQuestionMap.get(id))
  if (!questions.length || questions.some((q) => !q) || new Set(definition.questionIds).size !== definition.questionCount || questions.length !== definition.questionCount) throw new Error('Seleção de questões inválida.')
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
      questionIds: [...definition.questionIds],
      questionSnapshots: structuredClone(questions as NonNullable<typeof questions[number]>[]),
      currentIndex: 0,
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
  const db = await getDatabase(); const tx = db.transaction('simulations', 'readwrite'); const record = await tx.store.get(id)
  if (!record || record.completedAt) return null
  assertWithinDeadline(record)
  if (!record.payload.questionIds.includes(questionId)) throw new Error('Questão não pertence a este simulado.')
  const next: SimulationRecord = { ...record, payload: { ...record.payload, answers: { ...record.payload.answers, [questionId]: selectedAnswer } } }
  await tx.store.put(next); await tx.done; notifyStorageChanged(); return next
}

export async function toggleSimulationReview(id: string, questionId: string) {
  const db = await getDatabase(); const tx = db.transaction('simulations', 'readwrite'); const record = await tx.store.get(id)
  if (!record || record.completedAt) return null
  assertWithinDeadline(record)
  if (!record.payload.questionIds.includes(questionId)) throw new Error('Questão não pertence a este simulado.')
  const marked = new Set(record.payload.markedForReview)
  if (marked.has(questionId)) marked.delete(questionId); else marked.add(questionId)
  const next: SimulationRecord = { ...record, payload: { ...record.payload, markedForReview: [...marked] } }
  await tx.store.put(next); await tx.done; notifyStorageChanged(); return next
}

export async function saveSimulationNotes(id: string, notes: string) {
  const db = await getDatabase(); const tx = db.transaction('simulations', 'readwrite'); const record = await tx.store.get(id)
  if (!record || record.completedAt) return null
  const next: SimulationRecord = { ...record, payload: { ...record.payload, notes: notes.slice(0, 10000) } }
  await tx.store.put(next); await tx.done; notifyStorageChanged(); return next
}

export async function finishSimulation(id: string, forcedTimeUsedSeconds?: number) {
  const db = await getDatabase()
  const tx = db.transaction(['simulations', 'errors', 'activityDays'], 'readwrite')
  const records = tx.objectStore('simulations')
  const errors = tx.objectStore('errors')
  const record = await records.get(id)
  if (!record) throw new Error('Simulado não encontrado.')
  if (record.completedAt && record.payload.result) return record
  const questions = getSimulationQuestions(record)
  if (questions.length !== record.payload.questionIds.length) throw new Error('Uma ou mais questões deste simulado não existem mais no banco atual.')
  const now = new Date()
  const elapsed = Math.max(0, Math.min(record.payload.durationSeconds, forcedTimeUsedSeconds ?? Math.floor((now.getTime() - new Date(record.payload.startedAt).getTime()) / 1000)))
  const result = gradeSimulation(questions, record.payload.answers, record.payload.markedForReview, record.payload.cutoff, elapsed)
  const completedAt = now.toISOString()
  const next: SimulationRecord = { ...record, score: result.scorePercent, completedAt, payload: { ...record.payload, result } }
  await records.put(next)

  for (const row of result.questionResults.filter((item) => !item.isCorrect && item.selectedAnswer !== null)) {
    const question = questions.find((question) => question.id === row.questionId)
    if (!question) continue
    const errorId = `question:${question.id}`
    const current = await errors.get(errorId)
    const errorCount = (current?.errorCount ?? current?.wrongCount ?? 0) + 1
    const error: ErrorRecord = {
      id: errorId,
      sourceType: 'question',
      sourceId: question.id,
      questionId: question.id,
      pdCode: question.pdCode,
      questionSnapshot: structuredClone(question),
      prompt: question.prompt,
      selectedAnswer: question.options[row.selectedAnswer!],
      correctAnswer: question.options[question.correctAnswer],
      createdAt: current?.createdAt ?? completedAt,
      date: current?.date ?? current?.createdAt ?? completedAt,
      resolvedAt: null,
      resolved: false,
      reviewStatus: 'doubt',
      wrongCount: errorCount,
      errorCount,
      attemptCount: (current?.attemptCount ?? 0) + 1,
      lastWrongAt: completedAt,
      lastErrorAt: completedAt,
    }
    await errors.put(error)
  }

  const day = toLocalDateKey(now)
  const activityStore = tx.objectStore('activityDays')
  const activity = await activityStore.get(day)
  await activityStore.put({ date: day, events: (activity?.events ?? 0) + 1, lastActivityAt: completedAt })
  await tx.done
  notifyStorageChanged()
  return next
}

export async function getSeenQuestionIds() {
  const db = await getDatabase()
  const [attempts, simulations] = await Promise.all([db.getAll('questionAttempts'), db.getAll('simulations')])
  return new Set([...attempts.map((item) => item.questionId), ...simulations.flatMap((item) => item.payload.questionIds)])
}

export async function saveSimulationPosition(id: string, index: number) {
  const db = await getDatabase()
  const tx = db.transaction('simulations', 'readwrite')
  const record = await tx.store.get(id)
  if (!record || record.completedAt) return
  if (!Number.isInteger(index) || index < 0 || index >= record.questionCount) throw new Error('Posição inválida.')
  await tx.store.put({ ...record, payload: { ...record.payload, currentIndex: index } })
  await tx.done
}
