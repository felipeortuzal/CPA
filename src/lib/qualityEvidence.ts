import { cpaQuestionMap } from '../../content/cpa/questions'
import { isReviewed } from '../../content/cpa/questions/quality'
import type { CPAQuestion } from '../../content/cpa/questions/types'
import { questionRevision } from './questionSnapshot'
import type { ErrorRecord, QuestionAttemptRecord, SimulationRecord } from './storage/types'
// A previous answer only inherits current editorial approval when its content is identical.
export function reliableQuestion(id: string, snapshot?: CPAQuestion) {
  const current = cpaQuestionMap.get(id)
  if (!current || !isReviewed(current)) return false
  return !snapshot || questionRevision(snapshot) === questionRevision(current)
}
export const reliableAttempt = (row: QuestionAttemptRecord) => reliableQuestion(row.questionId,row.questionSnapshot)
export const reliableError = (row: ErrorRecord) => row.sourceType === 'question' && reliableQuestion(row.questionId ?? row.sourceId,row.questionSnapshot)
export function reliableSimulation(row: SimulationRecord) {
  return Boolean(row.completedAt && row.payload.result && row.payload.questionIds.every(id => reliableQuestion(id,row.payload.questionSnapshots?.find(q => q.id === id))))
}
export function reviewedEvidence(attempts: QuestionAttemptRecord[], simulations: SimulationRecord[], errors: ErrorRecord[]) {
  return { attempts: attempts.filter(reliableAttempt), simulations: simulations.filter(reliableSimulation), errors: errors.filter(reliableError) }
}
export interface PracticeEvidence { id: string; questionId: string; pdCode: string; correct: boolean; at: string }
export function practiceEvidence(attempts: QuestionAttemptRecord[], simulations: SimulationRecord[]): PracticeEvidence[] {
  return [
    ...attempts.filter(reliableAttempt).map(row => ({id:row.id,questionId:row.questionId,pdCode:row.pdCode,correct:row.isCorrect,at:row.answeredAt})),
    ...simulations.flatMap(sim => !sim.completedAt ? [] : (sim.payload.result?.questionResults ?? []).filter(row => row.selectedAnswer !== null && reliableQuestion(row.questionId,sim.payload.questionSnapshots?.find(q => q.id === row.questionId))).map(row => ({id:`${sim.id}:${row.questionId}`,questionId:row.questionId,pdCode:row.pdCode,correct:row.isCorrect,at:sim.completedAt!}))),
  ].sort((a,b) => a.at.localeCompare(b.at) || a.id.localeCompare(b.id))
}
