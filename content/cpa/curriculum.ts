import { module1 } from './module-1'
import { module2 } from './module-2'
import { module3 } from './module-3'
import { module4 } from './module-4'
import type { CurriculumUnit } from './schema'

export const cpaCurriculum: CurriculumUnit[] = [...module1, ...module2, ...module3, ...module4]
export const cpaCurriculumByCode = new Map(cpaCurriculum.map((item) => [item.pdCode, item]))
export const cpaCurriculumRoots = cpaCurriculum.filter((item) => item.parentCode === null)

export function getCurriculumChildren(parentCode: string | null) {
  return cpaCurriculum.filter((item) => item.parentCode === parentCode)
}
