import { macro1Questions } from './macro-1'
import { macro2QuestionsA } from './macro-2a'
import { macro2QuestionsB } from './macro-2b'
import { macro3Questions } from './macro-3'
import { macro4Questions } from './macro-4'
import type { CPAQuestion } from './types'

export const cpaQuestions: CPAQuestion[] = [
  ...macro1Questions,
  ...macro2QuestionsA,
  ...macro2QuestionsB,
  ...macro3Questions,
  ...macro4Questions,
]

export const cpaQuestionMap = new Map(cpaQuestions.map((question) => [question.id, question]))

export function getQuestionsByPdCode(pdCode: string) {
  return cpaQuestions.filter((question) => question.pdCode === pdCode)
}
