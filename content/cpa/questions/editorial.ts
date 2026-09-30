import reviews from './editorial-review.json'
import { questionRevision } from '../../../src/lib/questionSnapshot'
import type { CPAQuestion, CognitiveLevel, QuestionDifficulty, QuestionType } from './types'
const byId = new Map(reviews.map(review => [review.id, review]))

function recalibrate(question: CPAQuestion): CPAQuestion {
  if (!question.id.startsWith('CPA-V25-')) return question
  const text = `${question.context} ${question.prompt}`.toLocaleLowerCase('pt-BR')
  const directDefinition = /o que (é|significa)|qual (conceito|definição|instituição)|quem (define|supervisiona|regula)|como se chama/.test(text)
  const calculation = /r\$|%|calcule|montante|retorno|taxa|parcela|valor presente|valor futuro/.test(text)
  const multiFactor = /mais adequad|considerando|ao mesmo tempo|combina|prioriz|implica|avaliar|qual risco|qual conduta|qual conclusão/.test(text)
  const dialogue = /atendente|assessor|gerente/.test(text) && /cliente|investidor/.test(text) && /orienta|responde|pergunta|conversa|afirma/.test(text)

  let cognitiveLevel: CognitiveLevel = 'application'
  if (directDefinition && question.context.length < 120) cognitiveLevel = 'comprehension'
  else if (multiFactor || question.context.length > 220) cognitiveLevel = 'analysis'

  let difficulty: QuestionDifficulty = 'medium'
  if (cognitiveLevel === 'comprehension' || (calculation && question.context.length < 110)) difficulty = 'easy'
  if (cognitiveLevel === 'analysis' && (question.context.length > 150 || multiFactor)) difficulty = 'hard'

  let questionType: QuestionType = question.context.length < 55 && cognitiveLevel === 'comprehension' ? 'multiple_choice' : 'case'
  // Só classifica como diálogo quando o enunciado efetivamente descreve uma interação de atendimento.
  if (dialogue && question.context.length > 90) questionType = 'dialog_tree'

  return {...question, difficulty, cognitiveLevel, questionType}
}

// Approval is tied to the exact reviewed stem/options/explanation, never just to a persistent ID.
// V26 recalibrates pedagogical metadata afterwards; it does not rewrite the reviewed question text.
export function applyEditorialReview(question: CPAQuestion): CPAQuestion {
  const review = byId.get(question.id)
  if (question.origin !== 'authored' || !review || review.revision !== questionRevision(question)) return {...question, reviewStatus:'draft', reviewEvidence:undefined}
  return recalibrate({...question, reviewStatus:'reviewed', reviewEvidence:`${review.reviewedAt} · ${review.evidence} · metadados pedagógicos recalibrados na V26`})
}
