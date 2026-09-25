import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cpaQuestionMap, cpaQuestions } from '../../../content/cpa/questions'
import { generateSimulation } from '../simulations/engine'
import { createBackup, importBackup, resetAllProgress, validateBackup } from './backup'
import { closeDatabase, getDatabase } from './database'
import { answerQuestion, getQuestionErrors } from './repositories/questionRepository'
import { createProfile, getProfile } from './repositories/profileRepository'
import { createSimulation, finishSimulation, getSimulation, saveSimulationAnswer, saveSimulationNotes, saveSimulationPosition, toggleSimulationReview } from './repositories/simulationRepository'

beforeEach(resetAllProgress)
afterEach(closeDatabase)
const start = () => createSimulation(generateSimulation(cpaQuestions, { mode: 'quick10', random: () => 0.4 }))

describe('V22 data reliability', () => {
  it('does not lose simultaneous answers, notes, position or review marks', async () => {
    const sim = await start()
    const [a,b] = sim.payload.questionIds
    await Promise.all([saveSimulationAnswer(sim.id,a,1), saveSimulationAnswer(sim.id,b,2), saveSimulationNotes(sim.id,'Persistir'), saveSimulationPosition(sim.id,3), toggleSimulationReview(sim.id,a)])
    await closeDatabase()
    const saved = (await getSimulation(sim.id))!
    expect(saved.payload.answers[a]).toBe(1)
    expect(saved.payload.answers[b]).toBe(2)
    expect(saved.payload.notes).toBe('Persistir')
    expect(saved.payload.currentIndex).toBe(3)
    expect(saved.payload.markedForReview).toEqual([a])
  })

  it('finishes once even when two tabs finish together', async () => {
    const sim = await start()
    const question = sim.payload.questionSnapshots![0]
    await saveSimulationAnswer(sim.id,question.id,(question.correctAnswer+1)%4)
    const [a,b] = await Promise.all([finishSimulation(sim.id),finishSimulation(sim.id)])
    expect(a.completedAt).toBe(b.completedAt)
    expect((await getQuestionErrors())[0].errorCount).toBe(1)
    expect((await createBackup()).activityDays[0].events).toBe(1)
  })

  it('grades stored questions after the live bank changes or removes them', async () => {
    const sim = await start()
    const question = sim.payload.questionSnapshots![0]
    const original = cpaQuestionMap.get(question.id)!
    await saveSimulationAnswer(sim.id,question.id,question.correctAnswer)
    cpaQuestionMap.delete(question.id)
    try {
      const result = await finishSimulation(sim.id)
      expect(result.payload.result?.correct).toBe(1)
      const backup = await createBackup()
      expect(validateBackup(backup)).toBe(true)
      await importBackup(backup)
      expect((await getSimulation(sim.id))?.payload.questionSnapshots?.[0]).toEqual(question)
    } finally { cpaQuestionMap.set(question.id,original) }
  })

  it('rejects answers submitted after the deadline', async () => {
    const sim = await start()
    sim.payload.startedAt = new Date(Date.now()-sim.payload.durationSeconds*1000-1000).toISOString()
    await (await getDatabase()).put('simulations',sim)
    await expect(saveSimulationAnswer(sim.id,sim.payload.questionIds[0],0)).rejects.toThrow(/tempo terminou/)
    expect((await getSimulation(sim.id))?.payload.answers[sim.payload.questionIds[0]]).toBeNull()
    expect((await finishSimulation(sim.id)).payload.result?.timeUsedSeconds).toBe(sim.payload.durationSeconds)
  })

  it('rejects malformed nested payloads and duplicate IDs without replacing progress', async () => {
    await createProfile('Felipe')
    await start()
    const backup = await createBackup()
    backup.profile!.displayName = 'Outro'
    const invalid = structuredClone(backup)
    invalid.simulations[0].payload.answers = {}
    expect(validateBackup(invalid)).toBe(false)
    await expect(importBackup(invalid)).rejects.toThrow(/inválido/)
    expect((await getProfile())?.displayName).toBe('Felipe')
    backup.simulations.push(structuredClone(backup.simulations[0]))
    expect(validateBackup(backup)).toBe(false)
  })

  it('rolls back all cleared stores if a write fails during import', async () => {
    await createProfile('Felipe')
    const backup = await createBackup()
    backup.profile!.displayName = 'Outro'
    // A direct API caller can pass non-cloneable data even though file JSON cannot.
    backup.studyPlans.push({ id: 'bad-clone', updatedAt: new Date().toISOString(), payload: () => {} })
    await expect(importBackup(backup)).rejects.toThrow()
    expect((await getProfile())?.displayName).toBe('Felipe')
  })

  it('keeps historical answer text and revision and counts concurrent mistakes correctly', async () => {
    const q = cpaQuestions[0]
    const wrong = (q.correctAnswer+1)%4
    const [attempt] = await Promise.all([answerQuestion(q,wrong), answerQuestion(q,wrong)])
    expect(attempt.questionVersion).toMatch(/^[a-f0-9]{8}$/)
    expect(attempt.selectedOptionId).toBeTruthy()
    expect(attempt.questionSnapshot?.options[wrong]).toBe(q.options[wrong])
    expect((await getQuestionErrors())[0].errorCount).toBe(2)
    expect(validateBackup(await createBackup())).toBe(true)
  })
})
