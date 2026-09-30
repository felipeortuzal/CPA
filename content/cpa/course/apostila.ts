import { cpaLessons } from '../lessons'
import type { CPALesson } from '../lessons/types'
import { courseModuleMap, matchesModule } from './modules'
import { moduleReadings } from './readings'

export const V26_EDITORIAL_REVIEW_DATE = '2026-09-30'

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

export function lessonWordCount(lesson: CPALesson) {
  return wordCount([
    lesson.title,
    lesson.oneSentence,
    lesson.beginnerExplanation,
    ...lesson.completeExplanation,
    ...lesson.essentialConcepts,
    ...lesson.examFocus,
    lesson.practicalExample,
    ...lesson.comparisons.flatMap((item) => [item.left, item.right, item.explanation]),
    ...lesson.formulas.flatMap((item) => [item.name, item.expression, item.explanation]),
    ...lesson.traps,
    ...lesson.reviewSummary,
    ...lesson.flashcards.flatMap((item) => [item.front, item.back]),
    ...lesson.miniQuiz.flatMap((item) => [item.question, ...item.options, item.explanation]),
  ].join(' '))
}

export function getModuleLessons(moduleId: string) {
  const module = courseModuleMap.get(moduleId)
  if (!module) return []
  return cpaLessons.filter((lesson) => matchesModule(module, lesson.pdCode))
}

export function moduleApostilaStats(moduleId: string) {
  const reading = moduleReadings[moduleId]
  const lessons = getModuleLessons(moduleId)
  const lessonWords = lessons.reduce((sum, lesson) => sum + lessonWordCount(lesson), 0)
  const overviewWords = reading ? wordCount(JSON.stringify(reading)) : 0
  const words = lessonWords + overviewWords
  const formulas = lessons.reduce((sum, lesson) => sum + lesson.formulas.length, 0)
  const comparisons = lessons.reduce((sum, lesson) => sum + lesson.comparisons.length, 0)
  const checkpoints = lessons.reduce((sum, lesson) => sum + lesson.miniQuiz.length, 0)
  // Leitura ativa é mais lenta que leitura corrida; fórmulas, tabelas e checkpoints recebem overhead.
  const minutes = Math.max(12, Math.ceil(words / 145 + formulas * 1.1 + comparisons * 0.35 + checkpoints * 0.2))
  return { lessons, words, minutes, formulas, comparisons, checkpoints }
}

export function apostilaTotalStats() {
  const moduleIds = [...courseModuleMap.keys()]
  return moduleIds.reduce((acc, moduleId) => {
    const stats = moduleApostilaStats(moduleId)
    acc.words += stats.words
    acc.minutes += stats.minutes
    acc.formulas += stats.formulas
    acc.comparisons += stats.comparisons
    acc.checkpoints += stats.checkpoints
    acc.lessons += stats.lessons.length
    return acc
  }, { words: 0, minutes: 0, formulas: 0, comparisons: 0, checkpoints: 0, lessons: 0 })
}
