import reviews from './editorial-review.json'
import { questionRevision } from '../../../src/lib/questionSnapshot'
import type { CPAQuestion } from './types'
const byId = new Map(reviews.map(review => [review.id, review]))
// Approval is tied to the exact reviewed text, never just to a persistent ID.
export function applyEditorialReview(question: CPAQuestion): CPAQuestion {
  const review = byId.get(question.id)
  if (question.origin !== 'authored' || !review || review.revision !== questionRevision(question)) return {...question, reviewStatus:'draft', reviewEvidence:undefined}
  return {...question, reviewStatus:'reviewed', reviewEvidence:`${review.reviewedAt} · ${review.evidence}`}
}
