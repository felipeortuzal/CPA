import { describe, expect, it } from 'vitest'
import { courseModules } from './modules'
import { examBlueprints } from './exam-blueprint'
import { moduleApostilaStats } from './apostila'

const officialBlocks = [
  '1. Estrutura e dinâmica do Sistema Financeiro Nacional',
  '2. Produtos do mercado financeiro',
  '3. Relacionamento com o cliente — prospecção, atendimento e suporte',
  '4. Inovação e desenvolvimento de mercado',
]

describe('V29 exam-first course', () => {
  it('groups the 20 study chapters into the four Nova CPA blocks', () => {
    expect(courseModules).toHaveLength(20)
    expect([...new Set(courseModules.map(module => module.stage))]).toEqual(officialBlocks)
  })

  it('gives every chapter a strong exam blueprint', () => {
    for (const module of courseModules) {
      const blueprint = examBlueprints[module.id]
      expect(blueprint, `missing blueprint for ${module.id}`).toBeTruthy()
      expect(blueprint.mustMaster.length).toBeGreaterThanOrEqual(4)
      expect(blueprint.examPatterns.length).toBeGreaterThanOrEqual(3)
      expect(blueprint.traps.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('catalog reading time represents the complete apostila, not the legacy 3-part summary', () => {
    for (const module of courseModules) {
      const stats = moduleApostilaStats(module.id)
      expect(stats.minutes, `${module.id} complete reading should not look like a 4-minute summary`).toBeGreaterThanOrEqual(15)
      expect(stats.lessons.length).toBeGreaterThan(0)
    }
  })
})
