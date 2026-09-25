import type { CPAQuestion } from '../../content/cpa/questions/types'

// A content revision is independent of array position and the app version.
export function contentHash(value: string) {
  let hash = 2166136261
  for (const char of value) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619) }
  return (hash >>> 0).toString(16).padStart(8, '0')
}
export function questionRevision(question: CPAQuestion) {
  return contentHash(JSON.stringify([question.pdCode, question.context, question.prompt, question.options, question.correctAnswer, question.explanation, question.whyOthersAreWrong]))
}
export function optionId(question: CPAQuestion, index: number) {
  return `${question.id}:${contentHash(question.options[index])}`
}
