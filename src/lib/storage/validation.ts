import type { CPAQuestion } from '../../../content/cpa/questions/types'
import type { SimulationRecord } from './types'

export const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)
export const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)
export const natural = (value: unknown): value is number => finite(value) && Number.isInteger(value) && value >= 0
export const date = (value: unknown): value is string => typeof value === 'string' && Number.isFinite(Date.parse(value))
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every((v) => typeof v === 'string')
const answer = (value: unknown) => value === null || (natural(value) && value < 4)
const performance = (value: unknown) => isRecord(value) && natural(value.correct) && natural(value.total) && value.correct <= value.total && finite(value.percent) && value.percent >= 0 && value.percent <= 100
const performanceMap = (value: unknown) => isRecord(value) && Object.values(value).every(performance)

export function validQuestion(value: unknown): value is CPAQuestion {
  if (!isRecord(value)) return false
  return ['id', 'pdCode', 'macroTopic', 'topic', 'context', 'prompt', 'explanation', 'verifiedAt'].every((key) => typeof value[key] === 'string') && value.certification === 'CPA' && date(value.verifiedAt)
    && ['easy', 'medium', 'hard'].includes(String(value.difficulty))
    && ['comprehension', 'application', 'analysis'].includes(String(value.cognitiveLevel))
    && ['multiple_choice', 'case', 'dialog_tree'].includes(String(value.questionType))
    && strings(value.options) && value.options.length === 4 && natural(value.correctAnswer) && value.correctAnswer < 4
    && strings(value.whyOthersAreWrong) && value.whyOthersAreWrong.length === 4
    && Array.isArray(value.officialSources) && value.officialSources.every((source) => isRecord(source) && ['id', 'institution', 'title', 'url', 'verifiedAt'].every((key) => typeof source[key] === 'string') && /^https?:\/\//.test(String(source.url)))
}

export function validSimulation(value: unknown): value is SimulationRecord {
  if (!isRecord(value) || typeof value.id !== 'string' || value.certification !== 'CPA' || !natural(value.questionCount) || value.questionCount === 0 || !isRecord(value.payload)) return false
  const p = value.payload
  if (!['official_exam', 'quick10', 'quick20', 'theme', 'weak', 'unseen'].includes(String(p.mode)) || typeof p.label !== 'string' || !(p.theme === null || typeof p.theme === 'string')) return false
  if (!strings(p.questionIds) || p.questionIds.length !== value.questionCount || new Set(p.questionIds).size !== p.questionIds.length || !isRecord(p.answers)) return false
  const ids = new Set(p.questionIds)
  if (Object.keys(p.answers).length !== ids.size || !Object.entries(p.answers).every(([id, v]) => ids.has(id) && answer(v))) return false
  if (!strings(p.markedForReview) || !p.markedForReview.every((id) => ids.has(id)) || new Set(p.markedForReview).size !== p.markedForReview.length) return false
  if (typeof p.notes !== 'string' || !date(p.startedAt) || !finite(p.durationSeconds) || p.durationSeconds <= 0 || !(p.cutoff === null || (natural(p.cutoff) && p.cutoff <= value.questionCount))) return false
  if (p.currentIndex !== undefined && (!natural(p.currentIndex) || p.currentIndex >= value.questionCount)) return false
  if (p.questionSnapshots !== undefined && (!Array.isArray(p.questionSnapshots) || p.questionSnapshots.length !== ids.size || !p.questionSnapshots.every(validQuestion) || new Set(p.questionSnapshots.map((q) => q.id)).size !== ids.size || !p.questionSnapshots.every((q) => ids.has(q.id)))) return false
  if (value.completedAt === null) return value.score === null && p.result === null
  if (!date(value.completedAt) || !finite(value.score) || value.score < 0 || value.score > 100 || !isRecord(p.result)) return false
  const r = p.result
  if (!natural(r.correct) || r.total !== value.questionCount || r.correct > value.questionCount || r.scorePercent !== value.score || value.score !== Math.round(r.correct / value.questionCount * 100) || r.cutoff !== p.cutoff) return false
  if (r.passed !== (p.cutoff === null ? null : r.correct >= Number(p.cutoff))) return false
  if (!finite(r.timeUsedSeconds) || r.timeUsedSeconds < 0 || r.timeUsedSeconds > p.durationSeconds || !natural(r.markedCount) || r.markedCount > value.questionCount || !natural(r.unansweredCount) || r.unansweredCount > value.questionCount) return false
  if (!performanceMap(r.themePerformance) || !performanceMap(r.pdPerformance) || !isRecord(r.difficultyPerformance) || !['easy', 'medium', 'hard'].every((key) => performance((r.difficultyPerformance as Record<string, unknown>)[key]))) return false
  if (!Array.isArray(r.questionResults) || r.questionResults.length !== ids.size) return false
  if (!r.questionResults.every((row) => isRecord(row) && typeof row.questionId === 'string' && ids.has(row.questionId) && ['pdCode', 'macroTopic', 'topic'].every((key) => typeof row[key] === 'string') && ['easy', 'medium', 'hard'].includes(String(row.difficulty)) && answer(row.selectedAnswer) && natural(row.correctAnswer) && row.correctAnswer < 4 && row.isCorrect === (row.selectedAnswer === row.correctAnswer))) return false
  return new Set(r.questionResults.map((row) => row.questionId)).size === ids.size && r.correct === r.questionResults.filter((row) => row.isCorrect).length && r.unansweredCount === r.questionResults.filter((row) => row.selectedAnswer === null).length
}
