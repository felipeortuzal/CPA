import { QUESTION_VERIFIED_AT, questionSources } from './sources'
import type { CPAQuestion, QuestionDraft } from './types'

const optionIndexes: CPAQuestion['correctAnswer'][] = [0, 1, 2, 3]

function orderAlternatives(draft: QuestionDraft) {
  const numericId = Number(draft.id.match(/(\d+)$/)?.[1] ?? '1')
  const targetIndex = (((numericId - 1) % 4) + 4) % 4 as CPAQuestion['correctAnswer']
  const indexes = optionIndexes.filter((index) => index !== draft.correctAnswer)
  indexes.splice(targetIndex, 0, draft.correctAnswer)

  return {
    options: indexes.map((index) => draft.options[index]) as CPAQuestion['options'],
    whyOthersAreWrong: indexes.map((index) => draft.whyOthersAreWrong[index]) as CPAQuestion['whyOthersAreWrong'],
    correctAnswer: targetIndex,
  }
}

export function makeQuestion(draft: QuestionDraft): CPAQuestion {
  const alternatives = orderAlternatives(draft)
  return {
    id: draft.id,
    origin: 'authored',
    reviewStatus: draft.reviewStatus ?? 'draft',
    conceptId: draft.conceptId ?? draft.pdCode,
    reviewEvidence: draft.reviewEvidence,
    certification: 'CPA',
    pdCode: draft.pdCode,
    macroTopic: draft.macroTopic,
    topic: draft.topic,
    difficulty: draft.difficulty,
    cognitiveLevel: draft.cognitiveLevel,
    questionType: draft.questionType,
    context: draft.context,
    prompt: draft.prompt,
    options: alternatives.options,
    correctAnswer: alternatives.correctAnswer,
    explanation: draft.explanation,
    whyOthersAreWrong: alternatives.whyOthersAreWrong,
    officialSources: draft.sourceIds.map((id) => questionSources[id]),
    verifiedAt: QUESTION_VERIFIED_AT,
  }
}
