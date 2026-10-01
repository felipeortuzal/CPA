import { cpaLessons } from '../lessons'
import type { CPALesson } from '../lessons/types'
import { courseModuleMap, matchesModule } from './modules'
import { moduleReadings } from './readings'

export const V27_EDITORIAL_REVIEW_DATE = '2026-10-01'

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

export function lessonCoreWordCount(lesson: CPALesson) {
  return wordCount([
    lesson.title,
    lesson.oneSentence,
    lesson.beginnerExplanation,
    ...lesson.essentialConcepts,
    ...lesson.examFocus,
    ...lesson.comparisons.flatMap((item) => [item.left, item.right, item.explanation]),
    ...lesson.formulas.flatMap((item) => [item.name, item.expression, item.explanation]),
    ...lesson.traps,
    ...lesson.reviewSummary,
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
  const overviewWords = reading ? wordCount(JSON.stringify(reading)) : 0
  const readingMinutes = Math.max(8, Math.ceil(overviewWords / 180))
  const coreWords = overviewWords + lessons.reduce((sum, lesson) => sum + lessonCoreWordCount(lesson), 0)
  const fullWords = overviewWords + lessons.reduce((sum, lesson) => sum + lessonWordCount(lesson), 0)
  const formulas = lessons.reduce((sum, lesson) => sum + lesson.formulas.length, 0)
  const comparisons = lessons.reduce((sum, lesson) => sum + lesson.comparisons.length, 0)
  const checkpoints = lessons.reduce((sum, lesson) => sum + lesson.miniQuiz.length, 0)
  // A estimativa mede a trilha principal, não o aprofundamento opcional. O conteúdo integral permanece disponível.
  const minutes = Math.max(12, Math.ceil(coreWords / 210 + formulas * 0.55 + comparisons * 0.08 + checkpoints * 0.02))
  return { lessons, words: coreWords, coreWords, fullWords, readingMinutes, minutes, formulas, comparisons, checkpoints }
}

export function apostilaTotalStats() {
  const moduleIds = [...courseModuleMap.keys()]
  return moduleIds.reduce((acc, moduleId) => {
    const stats = moduleApostilaStats(moduleId)
    acc.words += stats.coreWords
    acc.coreWords += stats.coreWords
    acc.fullWords += stats.fullWords
    acc.minutes += stats.minutes
    acc.formulas += stats.formulas
    acc.comparisons += stats.comparisons
    acc.checkpoints += stats.checkpoints
    acc.lessons += stats.lessons.length
    return acc
  }, { words: 0, coreWords: 0, fullWords: 0, minutes: 0, formulas: 0, comparisons: 0, checkpoints: 0, lessons: 0 })
}
