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
    return {
      title,
      pdCode,
      parentCode: parts.length === 1 ? null : parts.slice(0, -1).join('.'),
      order: index + 1,
      description: `Tópico oficial correspondente ao item ${pdCode} do Programa Detalhado da CPA.`,
      officialSources: [metadata.officialSource],
      lastVerified: metadata.lastVerified,
    }
  })
}

const modules = [1, 2, 3, 4].map(extractModule)
const items = modules.flat()
const required = ['title', 'pdCode', 'parentCode', 'order', 'description', 'officialSources', 'lastVerified']
const codes = new Set()

for (const item of items) {
  for (const field of required) if (!(field in item)) throw new Error(`${item.pdCode ?? 'item'} sem ${field}`)
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

for (const moduleNumber of [1, 2, 3, 4]) {
  const migrationPath = path.join(root, 'supabase', 'migrations', `20260914230${moduleNumber}00_cpa_curriculum_module_${moduleNumber}.sql`)
  const migration = fs.readFileSync(migrationPath, 'utf8')
  const match = migration.match(/\$curriculum\$([\s\S]*?)\$curriculum\$/)
  if (!match) throw new Error(`Bloco curricular ausente na migration do módulo ${moduleNumber}`)
  const migrationRows = match[1].trim().split('\n')
  const sourceRows = modules[moduleNumber - 1].map((item) => `${item.pdCode}|${item.title}`)
  if (migrationRows.join('\n') !== sourceRows.join('\n')) throw new Error(`Migration do módulo ${moduleNumber} diverge do conteúdo versionado`)
}

console.log(`CPA ${metadata.programVersion}: ${items.length} itens validados, 4 macrotemas, pesos ${weightSum}%, migrations sincronizadas.`)
