import fs from 'node:fs/promises'
import path from 'node:path'

const manifestPath = process.argv[2] ?? path.resolve('content/sources.json')
const raw = JSON.parse(await fs.readFile(manifestPath, 'utf8'))

const errors = []
const requiredTop = ['schemaVersion', 'certification', 'generatedAt', 'policy', 'sources']
for (const key of requiredTop) if (!(key in raw)) errors.push(`missing top-level field: ${key}`)
if (raw.schemaVersion !== 1) errors.push(`schemaVersion must be 1, received ${raw.schemaVersion}`)
if (raw.certification !== 'CPA') errors.push('certification must be CPA')
if (!Array.isArray(raw.sources) || raw.sources.length === 0) errors.push('sources must be a non-empty array')
if (raw.policy?.automaticRewrite !== false) errors.push('policy.automaticRewrite must be false')
if (raw.policy?.networkFailureBlocksStudy !== false) errors.push('policy.networkFailureBlocksStudy must be false')

const ids = new Set()
const allowedModes = new Set(['content', 'metadata', 'availability'])
const allowedStatuses = new Set(['verified', 'review_required'])
const allowedTypes = new Set(['pdf', 'html'])
const allowedHosts = [
  'anbima.com.br', 'www.anbima.com.br', 'bcb.gov.br', 'www.bcb.gov.br', 'gov.br', 'www.gov.br',
  'conteudo.cvm.gov.br', 'fgc.org.br', 'www.fgc.org.br', 'tesourodireto.com.br', 'www.tesourodireto.com.br',
  'b3.com.br', 'www.b3.com.br', 'ibge.gov.br', 'www.ibge.gov.br', 'planalto.gov.br', 'www.planalto.gov.br',
]

for (const [index, source] of (raw.sources ?? []).entries()) {
  const prefix = `sources[${index}]`
  for (const key of ['id','institution','title','url','kind','sourceType','status','lastVerified','fingerprintMode','certification','scope','topics','note']) {
    if (!(key in source)) errors.push(`${prefix} missing ${key}`)
  }
  if (typeof source.id !== 'string' || !/^[A-Z0-9_]+$/.test(source.id)) errors.push(`${prefix}.id must be uppercase snake case`)
  if (ids.has(source.id)) errors.push(`duplicate source id: ${source.id}`)
  ids.add(source.id)
  if (source.certification !== 'CPA') errors.push(`${source.id}: certification must be CPA`)
  if (!allowedModes.has(source.fingerprintMode)) errors.push(`${source.id}: invalid fingerprintMode ${source.fingerprintMode}`)
  if (!allowedStatuses.has(source.status)) errors.push(`${source.id}: invalid status ${source.status}`)
  if (!allowedTypes.has(source.sourceType)) errors.push(`${source.id}: invalid sourceType ${source.sourceType}`)
  if (!Array.isArray(source.scope) || source.scope.length === 0) errors.push(`${source.id}: scope must be a non-empty array`)
  if (!Array.isArray(source.topics)) errors.push(`${source.id}: topics must be an array`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(source.lastVerified) || Number.isNaN(Date.parse(`${source.lastVerified}T00:00:00Z`))) errors.push(`${source.id}: invalid lastVerified`)
  try {
    const url = new URL(source.url)
    if (url.protocol !== 'https:') errors.push(`${source.id}: source URL must use https`)
    if (!allowedHosts.includes(url.hostname)) errors.push(`${source.id}: host is not in the official-source allowlist: ${url.hostname}`)
  } catch {
    errors.push(`${source.id}: invalid URL`)
  }
}

const mandatory = ['ANBIMA_PD','ANBIMA_PROGRAMS_PAGE','ANBIMA_EXAM_NOTICE','ANBIMA_QUESTION_GUIDE','ANBIMA_QUESTION_BOOK_CPA']
for (const id of mandatory) if (!ids.has(id)) errors.push(`mandatory official source missing: ${id}`)
const pd = raw.sources?.find((source) => source.id === 'ANBIMA_PD')
const edital = raw.sources?.find((source) => source.id === 'ANBIMA_EXAM_NOTICE')
if (pd?.knownVersion !== '1.2') errors.push('ANBIMA_PD knownVersion must match the project Program Detalhado version 1.2')
if (edital?.knownVersion !== '1.4') errors.push('ANBIMA_EXAM_NOTICE knownVersion must match the project edital version 1.4')

if (errors.length) {
  console.error('Official source manifest validation failed:')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`Official source manifest valid: ${raw.sources.length} sources, ${ids.size} unique IDs.`)
