import { QUESTION_VERIFIED_AT, questionSources } from './sources'
import type { CPAQuestion, QuestionDraft } from './types'

export function makeQuestion(draft: QuestionDraft): CPAQuestion {
  return {
    id: draft.id,
    certification: 'CPA',
    pdCode: draft.pdCode,
    macroTopic: draft.macroTopic,
    topic: draft.topic,
    difficulty: draft.difficulty,
    cognitiveLevel: draft.cognitiveLevel,
    questionType: draft.questionType,
    context: draft.context,
    prompt: draft.prompt,
    options: draft.options,
    correctAnswer: draft.correctAnswer,
    explanation: draft.explanation,
    whyOthersAreWrong: draft.whyOthersAreWrong,
    officialSources: draft.sourceIds.map((id) => questionSources[id]),
    verifiedAt: QUESTION_VERIFIED_AT,
  }
}
