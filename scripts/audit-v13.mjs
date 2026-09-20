import fs from 'node:fs/promises'
import path from 'node:path'

const root=process.cwd()
const failures=[]
const notes=[]
const requiredRoutes=['/trilha','/conteudos','/questoes','/simulados','/plano','/estudo-ativo','/revisao','/flashcards','/erros','/estatisticas','/fontes','/configuracoes']
const requiredStores=['profile','lessonProgress','quizAttempts','questionAttempts','favorites','flashcards','flashcardReviews','questionBookmarks','errors','simulations','studySessions','activityDays','preferences','studyPlans']

async function read(file){return fs.readFile(path.join(root,file),'utf8')}
async function exists(file){try{await fs.access(path.join(root,file));return true}catch{return false}}
function expect(condition,message){if(!condition)failures.push(message)}
function requireText(text,needle,label){expect(text.includes(needle),`${label}: missing ${needle}`)}

async function walk(dir){
  const out=[]
  for(const entry of await fs.readdir(path.join(root,dir),{withFileTypes:true})){
    const rel=path.join(dir,entry.name)
    if(entry.isDirectory())out.push(...await walk(rel))
    else out.push(rel)
  }
  return out
}

const [pkgRaw,metadataRaw,sourcesRaw,app,layout,db,backup,vite,viteEnv,start,update,readme,spec]=await Promise.all([
  read('package.json'),read('content/cpa/metadata.json'),read('content/sources.json'),read('src/App.tsx'),read('src/layouts/AppLayout.tsx'),
  read('src/lib/storage/database.ts'),read('src/lib/storage/backup.ts'),read('vite.config.ts'),read('src/vite-env.d.ts'),
  read('start-cpa.bat'),read('update-cpa.bat'),read('README.md'),read('PROJECT_SPEC.md')
])

const pkg=JSON.parse(pkgRaw)
const metadata=JSON.parse(metadataRaw)
const sources=JSON.parse(sourcesRaw)

expect(/^0\.(?:1[3-9]|2[0-9])\.0$/.test(pkg.version),`package version must be >=0.13.0 in the CPA-only roadmap, received ${pkg.version}`)
expect(!Object.keys({...pkg.dependencies,...pkg.devDependencies}).some((name)=>/supabase|firebase/i.test(name)),'remote backend dependency found')
expect(metadata.programVersion==='1.2','Programa Detalhado version drifted from 1.2')
expect(metadata.revisionDate==='2025-06-04','Programa Detalhado revision date drifted')
expect(metadata.effectiveFrom==='2026-01-01','Programa Detalhado effective date drifted')
expect(metadata.lastVerified==='2026-09-20','Programa Detalhado verification date is not 2026-09-20')

const sourceById=new Map(sources.sources.map((source)=>[source.id,source]))
expect(sourceById.get('ANBIMA_PD')?.knownVersion==='1.2','ANBIMA_PD version mismatch')
expect(sourceById.get('ANBIMA_EXAM_NOTICE')?.knownVersion==='1.4','ANBIMA_EXAM_NOTICE version mismatch')
for(const id of ['ANBIMA_PD','ANBIMA_PROGRAMS_PAGE','ANBIMA_EXAM_NOTICE','ANBIMA_QUESTION_GUIDE','ANBIMA_QUESTION_BOOK_CPA'])expect(sourceById.has(id),`missing central official source: ${id}`)

for(const route of requiredRoutes)expect(app.includes(route)||layout.includes(route),`required route/navigation missing: ${route}`)
requireText(db,'export const DB_VERSION = 2','database')
for(const store of requiredStores)requireText(db,store,'database')
requireText(backup,'const BACKUP_VERSION = 2 as const','backup')
requireText(backup,'25 * 1024 * 1024','backup')
requireText(backup,'backup.databaseVersion > DB_VERSION','backup')
expect(/cacheId:\s*['"]cpa-study-v\\d+['"]/.test(vite),'vite: missing versioned cpa-study-vN cacheId')
requireText(vite,'devOptions:','vite')
requireText(vite,'enabled: true','vite')
requireText(vite,"navigateFallback: 'index.html'",'vite')
expect(!/SUPABASE|FIREBASE/i.test(viteEnv),'legacy backend environment variables remain in vite-env.d.ts')
requireText(start,'npm run dev -- --open','start-cpa.bat')
requireText(update,'git pull --ff-only','update-cpa.bat')
requireText(update,'git status --porcelain','update-cpa.bat')
for(const unsafe of ['git reset --hard','git clean -f','deleteLocalDatabase','indexedDB.deleteDatabase']){
  expect(!update.toLowerCase().includes(unsafe.toLowerCase()),`unsafe updater command found: ${unsafe}`)
}

const codeFiles=(await walk('src')).filter((file)=>/\.(ts|tsx)$/.test(file))
const scriptFiles=(await walk('scripts')).filter((file)=>/\.(mjs|js)$/.test(file))
for(const file of [...codeFiles,...scriptFiles]){
  const content=await read(file)
  if(/\/\/\s*(?:TODO|FIXME)\b|\/\*\s*(?:TODO|FIXME)\b|^\s*\*\s*(?:TODO|FIXME)\b/m.test(content))failures.push(`${file}: TODO/FIXME comment remains`)
  if(file.startsWith('src/')&&/VITE_SUPABASE|createClient\(|firebase/i.test(content))failures.push(`${file}: legacy remote-backend reference remains`)
}
for(const file of [
  'src/features/analytics/index.ts','src/features/curriculum/index.ts','src/features/flashcards/index.ts',
  'src/features/lessons/index.ts','src/features/questions/index.ts','src/features/simulations/index.ts'
]){
  expect(!(await exists(file)),`dead placeholder file still exists: ${file}`)
}

requireText(readme,'445 aulas','README')
requireText(readme,'1.780 flashcards','README')
requireText(readme,'545 questões','README')
requireText(readme,'50 questões','README')
requireText(readme,'35 acertos','README')
requireText(readme,'Para o Thó','README')
requireText(spec,'DB_VERSION` deve continuar 2','PROJECT_SPEC')

notes.push(`official sources registered: ${sources.sources.length}`)
notes.push(`required local stores checked: ${requiredStores.length}`)
notes.push(`source files scanned for TODO/FIXME/backend remnants: ${codeFiles.length+scriptFiles.length}`)

if(failures.length){
  console.error('V13 audit failed:')
  for(const failure of failures)console.error(`- ${failure}`)
  process.exit(1)
}
console.log('V13 static audit passed.')
for(const note of notes)console.log(`- ${note}`)
