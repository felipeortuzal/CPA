import { describe, expect, it } from 'vitest'
import { answerLocally } from './cpaMentorLocal'

describe('Mestre CPA local fallback', () => {
  it('answers institutional questions from the V28 course', () => {
    const answer = answerLocally('Qual a diferença entre CMN, BCB e CVM?')
    expect(answer.content).toMatch(/Sistema Financeiro|SFN|CMN|Banco Central|CVM/i)
    expect(answer.content).toContain('Modo local')
    expect(answer.sources.length).toBeGreaterThan(0)
  })

  it('finds retirement-plan content', () => {
    const answer = answerLocally('Me explique PGBL x VGBL do zero')
    expect(answer.content).toMatch(/PGBL|VGBL/i)
    expect(answer.content).toMatch(/Previdência|previdencia/i)
  })

  it('finds FGC without internet', () => {
    const answer = answerLocally('FGC garante tudo que eu compro no banco?')
    expect(answer.content).toMatch(/FGC|Fundo Garantidor/i)
    expect(answer.content).toMatch(/cobertura|garantia|proteção|protecao/i)
  })
})
