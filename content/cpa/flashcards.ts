import { macro1Lessons } from './lessons/macro-1'

export interface CPAFlashcard {
  id: string
  certification: 'CPA'
  pdCode: string | null
  front: string
  back: string
  source: 'lesson' | 'custom'
}

export const cpaLessonFlashcards: CPAFlashcard[] = macro1Lessons.flatMap((lesson) =>
  lesson.flashcards.map((card, index) => ({
    id: `lesson:${lesson.pdCode}:${index + 1}`,
    certification: 'CPA' as const,
    pdCode: lesson.pdCode,
    front: card.front,
    back: card.back,
    source: 'lesson' as const,
  })),
)

export const cpaLessonFlashcardMap = new Map(cpaLessonFlashcards.map((card) => [card.id, card]))
