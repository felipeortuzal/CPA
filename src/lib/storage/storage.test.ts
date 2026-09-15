import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cpaQuestions } from '../../../content/cpa/questions'
import { createBackup, importBackup, resetAllProgress, validateBackup } from './backup'
import { closeDatabase, DB_VERSION, getDatabase } from './database'
import { calculateStreak } from './repositories/activityRepository'
import { getLessonProgress, getQuizAttempts, markLessonOpened, markLessonStudied, saveQuizAttempt } from './repositories/learningRepository'
import { createProfile, getProfile } from './repositories/profileRepository'
import { answerQuestion, getQuestionAttempts, getQuestionErrors, getQuestionFavorites, toggleQuestionFavorite } from './repositories/questionRepository'

describe('persistência local CPA', () => {
  beforeEach(async () => { await resetAllProgress() })
  afterEach(async () => { await closeDatabase() })

  it('salva uma aula concluída', async () => {
    await createProfile('Felipe')
    const progress = await markLessonStudied('1.1.1.1.1')
    expect(progress.status).toBe('completed')
    expect((await getLessonProgress('1.1.1.1.1'))?.completedAt).toBeTruthy()
  })

  it('recupera o progresso após reabrir o banco', async () => {
    await createProfile('Thó')
    await markLessonStudied('1.1.2.1.1')
    await closeDatabase()
    const restored = await getLessonProgress('1.1.2.1.1')
    expect(restored?.status).toBe('completed')
  })

  it('salva mini quiz e suas respostas', async () => {
    await createProfile('Felipe')
    const { attempt } = await saveQuizAttempt('1.2.4.1', [0, 1, 2], 2, 3)
    expect(attempt.answers).toEqual([0, 1, 2])
    expect(attempt.score).toBe(67)
    expect(await getQuizAttempts('1.2.4.1')).toHaveLength(1)
  })

  it('atualiza progresso de em andamento para estudado e dominado', async () => {
    await createProfile('Felipe')
    expect((await markLessonOpened('1.2.6.1')).status).toBe('in_progress')
    expect((await markLessonStudied('1.2.6.1')).status).toBe('completed')
    const { progress } = await saveQuizAttempt('1.2.6.1', [0, 0, 0], 3, 3)
    expect(progress.status).toBe('mastered')
  })

  it('salva tentativa de questão objetiva', async () => {
    const question = cpaQuestions[0]
    const attempt = await answerQuestion(question, question.correctAnswer)
    expect(attempt.isCorrect).toBe(true)
    expect(attempt.questionId).toBe(question.id)
    expect(await getQuestionAttempts(question.id)).toHaveLength(1)
  })

  it('adiciona questão incorreta automaticamente ao caderno de erros e incrementa recorrência', async () => {
    const question = cpaQuestions[0]
    const wrong = (question.correctAnswer + 1) % 4
    await answerQuestion(question, wrong)
    await answerQuestion(question, wrong)
    const errors = await getQuestionErrors()
    expect(errors).toHaveLength(1)
    expect(errors[0].sourceId).toBe(question.id)
    expect(errors[0].wrongCount).toBe(2)
    expect(errors[0].selectedAnswer).toBe(question.options[wrong])
  })

  it('salva e remove questão favorita', async () => {
    const question = cpaQuestions[1]
    expect(await toggleQuestionFavorite(question.id)).toBe(true)
    expect((await getQuestionFavorites()).map((item) => item.itemId)).toContain(question.id)
    expect(await toggleQuestionFavorite(question.id)).toBe(false)
    expect((await getQuestionFavorites()).map((item) => item.itemId)).not.toContain(question.id)
  })

  it('exporta backup v2 com perfil, progresso e tentativas de questões', async () => {
    await createProfile('Felipe')
    await markLessonStudied('1.3.1')
    await answerQuestion(cpaQuestions[0], cpaQuestions[0].correctAnswer)
    const backup = await createBackup()
    expect(backup.backupVersion).toBe(2)
    expect(backup.profile?.displayName).toBe('Felipe')
    expect(backup.lessonProgress.some((row) => row.pdCode === '1.3.1')).toBe(true)
    expect(backup.questionAttempts).toHaveLength(1)
  })

  it('importa backup v2 válido', async () => {
    await createProfile('Felipe')
    await markLessonStudied('1.4.1.1.1')
    await answerQuestion(cpaQuestions[2], cpaQuestions[2].correctAnswer)
    const backup = await createBackup()
    await resetAllProgress()
    await importBackup(backup)
    expect((await getProfile())?.displayName).toBe('Felipe')
    expect((await getLessonProgress('1.4.1.1.1'))?.status).toBe('completed')
    expect(await getQuestionAttempts(cpaQuestions[2].id)).toHaveLength(1)
  })

  it('continua aceitando backup legado v1 sem tentativas de questões', async () => {
    await createProfile('Thó')
    const current = await createBackup()
    const { questionAttempts: _ignored, ...withoutQuestions } = current
    const legacy = { ...withoutQuestions, backupVersion: 1 as const, databaseVersion: 1 }
    expect(validateBackup(legacy)).toBe(true)
    await resetAllProgress()
    await importBackup(legacy)
    expect((await getProfile())?.displayName).toBe('Thó')
    expect(await getQuestionAttempts()).toHaveLength(0)
  })

  it('rejeita backup inválido', async () => {
    const invalid = { backupVersion: 999, exportedAt: 'qualquer coisa' }
    expect(validateBackup(invalid)).toBe(false)
    await expect(importBackup(invalid as never)).rejects.toThrow(/Backup inválido/)
  })

  it('apaga todos os dados locais', async () => {
    await createProfile('Felipe')
    await markLessonStudied('1.1.1.1.1')
    await answerQuestion(cpaQuestions[0], cpaQuestions[0].correctAnswer)
    await resetAllProgress()
    expect(await getProfile()).toBeUndefined()
    expect(await getLessonProgress('1.1.1.1.1')).toBeUndefined()
    expect(await getQuestionAttempts()).toHaveLength(0)
  })

  it('cria o schema v2 com todas as stores previstas', async () => {
    const db = await getDatabase()
    expect(db.version).toBe(DB_VERSION)
    expect(Array.from(db.objectStoreNames)).toEqual(expect.arrayContaining([
      'profile', 'lessonProgress', 'quizAttempts', 'questionAttempts', 'favorites', 'flashcards', 'flashcardReviews',
      'questionBookmarks', 'errors', 'simulations', 'studySessions', 'activityDays', 'preferences', 'studyPlans',
    ]))
  })

  it('calcula streak por dias consecutivos e tolera hoje sem atividade', () => {
    const today = new Date(2026, 8, 14, 12, 0, 0)
    expect(calculateStreak(['2026-09-12', '2026-09-13', '2026-09-14'], today)).toBe(3)
    expect(calculateStreak(['2026-09-11', '2026-09-12', '2026-09-13'], today)).toBe(3)
    expect(calculateStreak(['2026-09-10'], today)).toBe(0)
  })
})
