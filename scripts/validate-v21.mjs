import fs from 'node:fs/promises'

const files={
  pkg:JSON.parse(await fs.readFile('package.json','utf8')),
  lessons:await fs.readFile('content/cpa/lessons/index.ts','utf8'),
  questions:await fs.readFile('content/cpa/questions/index.ts','utf8'),
  flashcards:await fs.readFile('content/cpa/flashcards.ts','utf8'),
  app:await fs.readFile('src/App.tsx','utf8'),
  layout:await fs.readFile('src/layouts/AppLayout.tsx','utf8'),
  analytics:await fs.readFile('src/pages/AnalyticsPage.tsx','utf8'),
  active:await fs.readFile('src/pages/ActiveStudyPage.tsx','utf8'),
  vite:await fs.readFile('vite.config.ts','utf8'),
  db:await fs.readFile('src/lib/storage/database.ts','utf8'),
  update:await fs.readFile('update-cpa.bat','utf8'),
  readme:await fs.readFile('README.md','utf8'),
}
const errors=[]
const expect=(condition,message)=>{if(!condition)errors.push(message)}
const has=(content,needle,label)=>expect(content.includes(needle),label+': missing '+needle)

expect(files.pkg.version==='0.21.0','package.json must be version 0.21.0')
has(files.lessons,'cpaLessons.length!==445','lessons index')
has(files.questions,'cpaQuestions.length!==545','questions index')
has(files.flashcards,'cpaLessons.flatMap','flashcards')
has(files.app,"path:'estatisticas', element:<AnalyticsPage/>",'App analytics route')
has(files.app,"path:'estudo-ativo', element:<ActiveStudyPage/>",'App active-study route')
expect(!files.app.includes('PlaceholderPage'),'statistics placeholder must be removed')
has(files.layout,"['Estudo Ativo','/estudo-ativo'","navigation")
has(files.analytics,'Heatmap de PDs praticados','analytics page')
has(files.active,'Intercalar assuntos','active study page')
has(files.active,'Glossário, conceitos e fórmulas','active study page')
has(files.vite,"cacheId: 'cpa-study-v21'",'PWA')
has(files.db,'export const DB_VERSION = 2','database')
has(files.update,'git pull --ff-only','updater')
expect(!/git reset --hard|git clean -f/i.test(files.update),'updater contains destructive Git command')
has(files.readme,'445 aulas completas','README')
has(files.readme,'1.780 flashcards','README')
has(files.readme,'545 questões','README')
has(files.readme,'update-cpa.bat','README')
expect(!/C-Pro\s*[RI]/i.test(files.readme),'README should remain CPA-only for this roadmap')

if(errors.length){
  console.error('V21 CPA-only validation failed:')
  for(const error of errors)console.error('- '+error)
  process.exit(1)
}
console.log('V21 CPA-only validation passed: 445 lessons, 1,780 flashcards, 545 questions, analytics and active study wired.')
