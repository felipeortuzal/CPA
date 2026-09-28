import type { CPAQuestion } from './types'
export const qualityLabels = { draft: 'Rascunho', reviewed: 'Revisada', verified: 'Verificada' } as const
export function isReviewed(question: CPAQuestion | undefined): boolean {
  return Boolean(question?.origin === 'authored' && (question.reviewStatus === 'reviewed' || question.reviewStatus === 'verified') && question.reviewEvidence?.trim())
}
export function bankQuality(questions: CPAQuestion[]) {
  return { total: questions.length, authored: questions.filter(q => q.origin === 'authored').length, generated: questions.filter(q => q.origin === 'generated').length, draft: questions.filter(q => !isReviewed(q) && q.origin !== 'generated').length, reviewed: questions.filter(q => isReviewed(q) && q.reviewStatus === 'reviewed').length, verified: questions.filter(q => isReviewed(q) && q.reviewStatus === 'verified').length }
}
