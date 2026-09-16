import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cpaQuestions } from '../../../content/cpa/questions'
import { generateSimulation } from '../simulations/engine'
import { resetAllProgress } from './backup'
import { closeDatabase } from './database'
import { getQuestionErrors } from './repositories/questionRepository'
import { createSimulation, finishSimulation, getSimulation, getSimulations, saveSimulationAnswer, saveSimulationNotes, toggleSimulationReview } from './repositories/simulationRepository'

describe('simulation persistence',()=>{
  beforeEach(async()=>{await resetAllProgress()})
  afterEach(async()=>{await closeDatabase()})

  it('salva respostas, revisão e bloco de notas',async()=>{
    const definition=generateSimulation(cpaQuestions,{mode:'quick10',random:()=>0.4})
    const record=await createSimulation(definition)
    const firstId=record.payload.questionIds[0]
    const firstQuestion=cpaQuestions.find((question)=>question.id===firstId)!
    await saveSimulationAnswer(record.id,firstId,firstQuestion.correctAnswer)
    await toggleSimulationReview(record.id,firstId)
    await saveSimulationNotes(record.id,'Revisar este raciocínio no final.')
    const restored=await getSimulation(record.id)
    expect(restored?.payload.answers[firstId]).toBe(firstQuestion.correctAnswer)
    expect(restored?.payload.markedForReview).toContain(firstId)
    expect(restored?.payload.notes).toContain('Revisar')
  })

  it('finaliza, salva histórico e adiciona somente respostas erradas ao caderno',async()=>{
    const definition=generateSimulation(cpaQuestions,{mode:'quick10',random:()=>0.2})
    const record=await createSimulation(definition)
    const [firstId,secondId]=record.payload.questionIds
    const first=cpaQuestions.find((question)=>question.id===firstId)!
    const second=cpaQuestions.find((question)=>question.id===secondId)!
    await saveSimulationAnswer(record.id,firstId,first.correctAnswer)
    await saveSimulationAnswer(record.id,secondId,(second.correctAnswer+1)%4)
    const finished=await finishSimulation(record.id,420)
    expect(finished.completedAt).toBeTruthy()
    expect(finished.payload.result?.timeUsedSeconds).toBe(420)
    expect(finished.payload.result?.unansweredCount).toBe(8)
    const errors=await getQuestionErrors()
    expect(errors.map((item)=>item.sourceId)).toContain(secondId)
    expect(errors.map((item)=>item.sourceId)).not.toContain(firstId)
    expect(errors).toHaveLength(1)
    expect((await getSimulations()).filter((item)=>item.completedAt)).toHaveLength(1)
  })
})
