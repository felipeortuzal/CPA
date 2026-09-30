import reviews from './editorial-review.json'
import { questionRevision } from '../../../src/lib/questionSnapshot'
import type { CPAQuestion, CognitiveLevel, QuestionDifficulty, QuestionType } from './types'
const byId = new Map(reviews.map(review => [review.id, review]))

function recalibrate(question: CPAQuestion): CPAQuestion {
  // O modelo atual de CPAQuestion é objetivo: ele não armazena nós, escolhas intermediárias ou ramificações.
  // Itens legados rotulados como dialog_tree são, portanto, normalizados como casos até existir árvore real.
  const objectiveQuestion: CPAQuestion = question.questionType === 'dialog_tree' ? {...question, questionType:'case'} : question
  if (!objectiveQuestion.id.startsWith('CPA-V25-')) return objectiveQuestion
  const text = `${objectiveQuestion.context} ${objectiveQuestion.prompt}`.toLocaleLowerCase('pt-BR')
  const directDefinition = /o que (é|significa)|qual (conceito|definição|instituição)|quem (define|supervisiona|regula)|como se chama/.test(text)
  const calculation = /r\$|%|calcule|montante|retorno|taxa|parcela|valor presente|valor futuro/.test(text)
  const multiFactor = /mais adequad|considerando|ao mesmo tempo|combina|prioriz|implica|avaliar|qual risco|qual conduta|qual conclusão/.test(text)

  let cognitiveLevel: CognitiveLevel = 'application'
  if (directDefinition && objectiveQuestion.context.length < 120) cognitiveLevel = 'comprehension'
  else if (multiFactor || objectiveQuestion.context.length > 220) cognitiveLevel = 'analysis'

  let difficulty: QuestionDifficulty = 'medium'
  if (cognitiveLevel === 'comprehension' || (calculation && objectiveQuestion.context.length < 110)) difficulty = 'easy'
  if (cognitiveLevel === 'analysis' && (objectiveQuestion.context.length > 150 || multiFactor)) difficulty = 'hard'

  const questionType: QuestionType = objectiveQuestion.context.length < 55 && cognitiveLevel === 'comprehension' ? 'multiple_choice' : 'case'
  return {...objectiveQuestion, difficulty, cognitiveLevel, questionType}
}

// Approval is tied to the exact reviewed stem/options/explanation, never just to a persistent ID.
// V26 recalibrates pedagogical metadata afterwards; it does not rewrite the reviewed question text.
export function applyEditorialReview(question: CPAQuestion): CPAQuestion {
  const review = byId.get(question.id)
  if (question.origin !== 'authored' || !review || review.revision !== questionRevision(question)) return {...question, reviewStatus:'draft', reviewEvidence:undefined}
  return recalibrate({...question, reviewStatus:'reviewed', reviewEvidence:`${review.reviewedAt} · ${review.evidence} · metadados pedagógicos recalibrados na V26`})
}
