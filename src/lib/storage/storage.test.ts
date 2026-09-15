import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createBackup, importBackup, resetAllProgress, validateBackup } from './backup'
import { closeDatabase, DB_VERSION, getDatabase } from './database'
import { calculateStreak } from './repositories/activityRepository'
import { getLessonProgress, getQuizAttempts, markLessonOpened, markLessonStudied, saveQuizAttempt } from './repositories/learningRepository'
import { createProfile, getProfile } from './repositories/profileRepository'

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

  it('exporta backup com perfil e progresso', async () => {
    await createProfile('Felipe')
    await markLessonStudied('1.3.1')
    const backup = await createBackup()
    expect(backup.backupVersion).toBe(1)
    expect(backup.profile?.displayName).toBe('Felipe')
    expect(backup.lessonProgress.some((row) => row.pdCode === '1.3.1')).toBe(true)
  })

  it('importa backup válido', async () => {
    await createProfile('Felipe')
    await markLessonStudied('1.4.1.1.1')
    const backup = await createBackup()
    await resetAllProgress()
    await importBackup(backup)
    expect((await getProfile())?.displayName).toBe('Felipe')
    expect((await getLessonProgress('1.4.1.1.1'))?.status).toBe('completed')
  })

  it('rejeita backup inválido', async () => {
    const invalid = { backupVersion: 999, exportedAt: 'qualquer coisa' }
    expect(validateBackup(invalid)).toBe(false)
    await expect(importBackup(invalid as never)).rejects.toThrow(/Backup inválido/)
  })

  it('apaga todos os dados locais', async () => {
    await createProfile('Felipe')
    await markLessonStudied('1.1.1.1.1')
    await resetAllProgress()
    expect(await getProfile()).toBeUndefined()
    expect(await getLessonProgress('1.1.1.1.1')).toBeUndefined()
  })

  it('cria o schema v1 com todas as stores previstas', async () => {
    const db = await getDatabase()
    expect(db.version).toBe(DB_VERSION)
    expect(Array.from(db.objectStoreNames)).toEqual(expect.arrayContaining([
      'profile', 'lessonProgress', 'quizAttempts', 'favorites', 'flashcards', 'flashcardReviews',
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
