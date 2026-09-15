import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const contentDir = path.join(root, 'content', 'cpa')
const metadata = JSON.parse(fs.readFileSync(path.join(contentDir, 'metadata.json'), 'utf8'))

function extractModule(moduleNumber) {
  const file = fs.readFileSync(path.join(contentDir, `module-${moduleNumber}.ts`), 'utf8')
  const match = file.match(/const raw = `([\s\S]*?)`/)
  if (!match) throw new Error(`Não foi possível extrair module-${moduleNumber}.ts`)
  return match[1].trim().split('\n').map((line, index) => {
    const separator = line.indexOf('|')
    if (separator < 1) throw new Error(`Linha inválida no módulo ${moduleNumber}: ${line}`)
    const pdCode = line.slice(0, separator).trim()
    const title = line.slice(separator + 1).trim()
    const parts = pdCode.split('.')
    return { title, pdCode, parentCode: parts.length === 1 ? null : parts.slice(0, -1).join('.'), order: index + 1 }
  })
}

const modules = [1, 2, 3, 4].map(extractModule)
const items = modules.flat()
const codes = new Set()
for (const item of items) {
  if (!/^\d+(?:\.\d+)*$/.test(item.pdCode)) throw new Error(`Código PD inválido: ${item.pdCode}`)
  if (!item.title) throw new Error(`Título vazio em ${item.pdCode}`)
  if (codes.has(item.pdCode)) throw new Error(`Código PD duplicado: ${item.pdCode}`)
  codes.add(item.pdCode)
}
for (const item of items) if (item.parentCode && !codes.has(item.parentCode)) throw new Error(`Pai ausente: ${item.pdCode} -> ${item.parentCode}`)

const roots = items.filter((item) => item.parentCode === null).map((item) => item.pdCode)
if (roots.join(',') !== '1,2,3,4') throw new Error(`Raízes inesperadas: ${roots.join(',')}`)
if (items.length !== 590) throw new Error(`Esperados 590 itens no PD 1.2; encontrados ${items.length}`)
if (metadata.programVersion !== '1.2') throw new Error(`Versão inesperada: ${metadata.programVersion}`)
if (metadata.revisionDate !== '2025-06-04') throw new Error(`Revisão inesperada: ${metadata.revisionDate}`)
if (metadata.effectiveFrom !== '2026-01-01') throw new Error(`Vigência inesperada: ${metadata.effectiveFrom}`)
const weightSum = metadata.macroTopics.reduce((sum, topic) => sum + topic.weight, 0)
if (weightSum !== 100) throw new Error(`Pesos somam ${weightSum}, não 100`)

const module1 = modules[0]
const module1Codes = new Set(module1.map((item) => item.pdCode))
const terminalCodes = module1.filter((item) => !module1.some((candidate) => candidate.parentCode === item.pdCode)).map((item) => item.pdCode)
const definitionsFile = fs.readFileSync(path.join(contentDir, 'lessons', 'macro-1-definitions.ts'), 'utf8')
const definitionCodes = [...definitionsFile.matchAll(/^'([0-9]+(?:\.[0-9]+)*)':/gm)].map((match) => match[1])
const definitionSet = new Set(definitionCodes)
if (definitionCodes.length !== definitionSet.size) throw new Error('Há PD Codes duplicados em macro-1-definitions.ts')
if (terminalCodes.length !== 105) throw new Error(`Esperadas 105 aulas terminais no Macrotema 1; encontradas ${terminalCodes.length}`)
if (definitionCodes.length !== 105) throw new Error(`Esperadas 105 definições de aula; encontradas ${definitionCodes.length}`)
for (const code of terminalCodes) if (!definitionSet.has(code)) throw new Error(`Aula terminal sem definição: ${code}`)
for (const code of definitionCodes) if (!module1Codes.has(code) || !terminalCodes.includes(code)) throw new Error(`Definição não corresponde a item terminal oficial: ${code}`)

const sourceFile = fs.readFileSync(path.join(contentDir, 'lessons', 'sources.ts'), 'utf8')
if (!sourceFile.includes("lastVerified:'2026-09-14'") && !sourceFile.includes("lastVerified: '2026-09-14'")) throw new Error('Fontes das aulas não registram lastVerified 2026-09-14')

console.log(`CPA ${metadata.programVersion}: ${items.length} itens curriculares, 4 macrotemas, pesos ${weightSum}% e ${terminalCodes.length} aulas terminais do Macrotema 1 validadas.`)
