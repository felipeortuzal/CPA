import 'fake-indexeddb/auto'
import { afterEach, beforeEach, expect, it } from 'vitest'
import { closeDatabase, getDatabase } from './database'
import { createBackup, importBackup, resetAllProgress, validateBackup } from './backup'
import { getCourseProgress, setSectionRead } from './repositories/courseRepository'
import { createSimulation, finishSimulation, saveSimulationAnswer } from './repositories/simulationRepository'
import { generateSimulation } from '../simulations/engine'
import { cpaQuestions } from '../../../content/cpa/questions'
import { moduleReadings } from '../../../content/cpa/course/readings'
beforeEach(resetAllProgress)
afterEach(closeDatabase)
it('preserva leituras concorrentes e não conclui aulas automaticamente', async () => {
  const sections = moduleReadings.economia.sections
  await Promise.all(sections.map(s => setSectionRead('economia',s.id,true)))
  await closeDatabase()
  expect((await getCourseProgress()).economia.readSections).toHaveLength(sections.length)
  expect(await (await getDatabase()).getAll('lessonProgress')).toHaveLength(0)
  await setSectionRead('economia',sections[0].id,false)
  expect((await getCourseProgress()).economia.readSections).not.toContain(sections[0].id)
})
it('restaura leitura e simulado do módulo no backup, junto ao histórico legado', async () => {
  await setSectionRead('economia',moduleReadings.economia.sections[0].id,true)
  await createSimulation(generateSimulation(cpaQuestions,{mode:'quick10'}))
  const exam = await createSimulation(generateSimulation(cpaQuestions,{mode:'module',moduleId:'economia'}))
  const q = cpaQuestions.find(q => q.id === exam.payload.questionIds[0])!
  await saveSimulationAnswer(exam.id,q.id,q.correctAnswer)
  await finishSimulation(exam.id)
  const backup = await createBackup()
  expect(validateBackup(backup)).toBe(true)
  await resetAllProgress(); await importBackup(backup)
  expect((await getCourseProgress()).economia.readSections).toHaveLength(1)
  const restored = await (await getDatabase()).get('simulations',exam.id)
  expect(restored?.payload.moduleId).toBe('economia')
  expect(restored?.payload.result?.correct).toBe(1)
  expect(await (await getDatabase()).getAll('simulations')).toHaveLength(2)
  const malformed = structuredClone(backup)
  malformed.studyPlans[0].payload = {version:1,moduleId:'economia',readSections:['inexistente']}
  expect(validateBackup(malformed)).toBe(false)
  const invalidExam = structuredClone(backup)
  invalidExam.simulations.find(row => row.id === exam.id)!.payload.moduleId = 'invalido'
  expect(validateBackup(invalidExam)).toBe(false)
})
