import type { CPAQuestion, QuestionDifficulty } from '../../../content/cpa/questions/types'
import type { QuestionAttemptRecord, SimulationRecord, SimulationResultSnapshot } from '../storage/types'

export type SimulationMode = 'official_exam' | 'quick10' | 'quick20' | 'theme' | 'weak' | 'unseen'

export interface SimulationRequest {
  mode: SimulationMode
  theme?: '1' | '2' | '3' | '4'
  seenQuestionIds?: Set<string>
  performanceSamples?: Array<{ pdCode: string; isCorrect: boolean }>
  random?: () => number
}

export interface SimulationDefinition {
  mode: SimulationMode
  label: string
  questionCount: number
  durationSeconds: number
  cutoff: number | null
  questionIds: string[]
  theme: string | null
}

export const OFFICIAL_EXAM = {
  questionCount: 50,
  durationSeconds: 2 * 60 * 60 + 30 * 60,
  cutoff: 35,
  themeCounts: { '1': 10, '2': 20, '3': 15, '4': 5 } as const,
}

export const QUICK10_COUNTS = { '1': 2, '2': 4, '3': 3, '4': 1 } as const
export const QUICK20_COUNTS = { '1': 4, '2': 8, '3': 6, '4': 2 } as const

const modeLabels: Record<SimulationMode, string> = {
  official_exam: 'Modo Prova CPA',
  quick10: 'Simulado 10',
  quick20: 'Simulado 20',
  theme: 'Simulado por tema',
  weak: 'Assuntos fracos',
  unseen: 'Somente inéditas',
}

function shuffle<T>(items: T[], random: () => number) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function macroOf(question: CPAQuestion) { return question.pdCode.split('.')[0] }

function pickWeighted(questions: CPAQuestion[], counts: Record<string, number>, random: () => number) {
  const selected: CPAQuestion[] = []
  for (const [theme, count] of Object.entries(counts)) {
    const pool = shuffle(questions.filter((question) => macroOf(question) === theme), random)
    if (pool.length < count) throw new Error(`Banco insuficiente para o Tema ${theme}: necessário ${count}, disponível ${pool.length}.`)
    selected.push(...pool.slice(0, count))
  }
  return shuffle(selected, random)
}

export function deriveWeakPdCodes(samples: Array<{ pdCode: string; isCorrect: boolean }>) {
  const stats = new Map<string, { correct: number; total: number }>()
  for (const sample of samples) {
    const current = stats.get(sample.pdCode) ?? { correct: 0, total: 0 }
    current.total += 1
    if (sample.isCorrect) current.correct += 1
    stats.set(sample.pdCode, current)
  }
  return [...stats.entries()]
    .filter(([, value]) => value.total > 0 && value.correct < value.total)
    .sort((a, b) => {
      const accuracyA = a[1].correct / a[1].total
      const accuracyB = b[1].correct / b[1].total
      if (accuracyA !== accuracyB) return accuracyA - accuracyB
      return b[1].total - a[1].total
    })
    .map(([pdCode]) => pdCode)
}

export function samplesFromAttempts(attempts: QuestionAttemptRecord[]) {
  return attempts.map((attempt) => ({ pdCode: attempt.pdCode, isCorrect: attempt.isCorrect }))
}

export function samplesFromSimulations(simulations: SimulationRecord[]) {
  return simulations.flatMap((simulation) => simulation.payload.result?.questionResults.map((row) => ({ pdCode: row.pdCode, isCorrect: row.isCorrect })) ?? [])
}

export function generateSimulation(questions: CPAQuestion[], request: SimulationRequest): SimulationDefinition {
  const random = request.random ?? Math.random
  let selected: CPAQuestion[] = []
  let durationSeconds = 60 * 60
  let cutoff: number | null = null
  let theme: string | null = request.theme ?? null

  if (request.mode === 'official_exam') {
    selected = pickWeighted(questions, OFFICIAL_EXAM.themeCounts, random)
    durationSeconds = OFFICIAL_EXAM.durationSeconds
    cutoff = OFFICIAL_EXAM.cutoff
  } else if (request.mode === 'quick10') {
    selected = pickWeighted(questions, QUICK10_COUNTS, random)
    durationSeconds = 30 * 60
  } else if (request.mode === 'quick20') {
    selected = pickWeighted(questions, QUICK20_COUNTS, random)
    durationSeconds = 60 * 60
  } else if (request.mode === 'theme') {
    if (!request.theme) throw new Error('Escolha um tema para gerar o simulado.')
    const pool = shuffle(questions.filter((question) => macroOf(question) === request.theme), random)
    selected = pool.slice(0, Math.min(20, pool.length))
    durationSeconds = selected.length * 3 * 60
  } else if (request.mode === 'unseen') {
    const seen = request.seenQuestionIds ?? new Set<string>()
    const pool = shuffle(questions.filter((question) => !seen.has(question.id)), random)
    if (pool.length === 0) throw new Error('Você já respondeu todas as questões disponíveis no banco atual.')
    selected = pool.slice(0, Math.min(20, pool.length))
    durationSeconds = selected.length * 3 * 60
    theme = null
  } else {
    const weakPdCodes = deriveWeakPdCodes(request.performanceSamples ?? [])
    if (weakPdCodes.length === 0) throw new Error('Ainda não há erros suficientes para identificar assuntos fracos. Responda questões ou conclua um simulado primeiro.')
    const rank = new Map(weakPdCodes.map((pdCode, index) => [pdCode, index]))
    const weakMacros = [...new Set(weakPdCodes.map((pdCode) => pdCode.split('.')[0]))]
    const pool = questions
      .filter((question) => rank.has(question.pdCode) || weakMacros.includes(macroOf(question)))
      .sort((a, b) => (rank.get(a.pdCode) ?? 999) - (rank.get(b.pdCode) ?? 999) || random() - 0.5)
    selected = pool.slice(0, Math.min(20, pool.length))
    durationSeconds = selected.length * 3 * 60
    theme = null
  }

  if (!selected.length) throw new Error('Não foi possível gerar o simulado com os filtros atuais.')
  return {
    mode: request.mode,
    label: modeLabels[request.mode],
    questionCount: selected.length,
    durationSeconds,
    cutoff,
    questionIds: selected.map((question) => question.id),
    theme,
  }
}

function emptyPerformance() { return { correct: 0, total: 0, percent: 0 } }

export function gradeSimulation(
  questions: CPAQuestion[],
  answers: Record<string, number | null>,
  markedForReview: string[],
  cutoff: number | null,
  timeUsedSeconds: number,
): SimulationResultSnapshot {
  const byId = new Map(questions.map((question) => [question.id, question]))
  const themePerformance: Record<string, { correct: number; total: number; percent: number }> = {}
  const difficultyPerformance: Record<QuestionDifficulty, { correct: number; total: number; percent: number }> = {
    easy: emptyPerformance(), medium: emptyPerformance(), hard: emptyPerformance(),
  }
  const pdPerformance: Record<string, { correct: number; total: number; percent: number }> = {}
  const questionResults = questions.map((question) => {
    const selectedAnswer = answers[question.id] ?? null
    const isCorrect = selectedAnswer === question.correctAnswer
    const macro = macroOf(question)
    const themeStats = themePerformance[macro] ?? emptyPerformance()
    themeStats.total += 1
    if (isCorrect) themeStats.correct += 1
    themePerformance[macro] = themeStats
    const difficultyStats = difficultyPerformance[question.difficulty]
    difficultyStats.total += 1
    if (isCorrect) difficultyStats.correct += 1
    const pdStats = pdPerformance[question.pdCode] ?? emptyPerformance()
    pdStats.total += 1
    if (isCorrect) pdStats.correct += 1
    pdPerformance[question.pdCode] = pdStats
    return {
      questionId: question.id,
      pdCode: question.pdCode,
      macroTopic: question.macroTopic,
      topic: question.topic,
      difficulty: question.difficulty,
      selectedAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
    }
  })
  for (const stats of Object.values(themePerformance)) stats.percent = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0
  for (const stats of Object.values(difficultyPerformance)) stats.percent = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0
  for (const stats of Object.values(pdPerformance)) stats.percent = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0

  const correct = questionResults.filter((row) => row.isCorrect).length
  const total = questions.length
  const scorePercent = total ? Math.round((correct / total) * 100) : 0
  return {
    correct,
    total,
    scorePercent,
    passed: cutoff === null ? null : correct >= cutoff,
    cutoff,
    timeUsedSeconds,
    markedCount: markedForReview.filter((id) => byId.has(id)).length,
    unansweredCount: questionResults.filter((row) => row.selectedAnswer === null).length,
    themePerformance,
    difficultyPerformance,
    pdPerformance,
    questionResults,
  }
}
