import fs from 'node:fs/promises'

const files = {
  start: await fs.readFile('start-cpa.bat','utf8'),
  update: await fs.readFile('update-cpa.bat','utf8'),
  vite: await fs.readFile('vite.config.ts','utf8'),
  app: await fs.readFile('src/App.tsx','utf8'),
  layout: await fs.readFile('src/layouts/AppLayout.tsx','utf8'),
  styles: await fs.readFile('src/styles.css','utf8'),
  readme: await fs.readFile('README.md','utf8'),
}
const errors=[]
function requireText(name,text,needle){if(!text.includes(needle))errors.push(`${name}: missing ${needle}`)}

requireText('start-cpa.bat',files.start,'npm run dev -- --open')
requireText('start-cpa.bat',files.start,'Node.js 22')
requireText('update-cpa.bat',files.update,'git pull --ff-only')
requireText('update-cpa.bat',files.update,'git status --porcelain')
requireText('update-cpa.bat',files.update,'npm install --no-audit --no-fund')

for(const unsafe of ['git reset --hard','git clean -f','rd /s','rmdir /s','del /s','deleteLocalDatabase','indexeddb.deleteDatabase']){
  if(files.update.toLowerCase().includes(unsafe.toLowerCase()))errors.push(`update-cpa.bat contains unsafe operation: ${unsafe}`)
}

if(!/cacheId:\s*['"]cpa-study-v\d+['"]/.test(files.vite))errors.push('vite.config.ts: missing versioned cpa-study-vN cacheId')
for(const needle of ["cleanupOutdatedCaches: true","navigateFallback: 'index.html'","registerType: 'autoUpdate'"])requireText('vite.config.ts',files.vite,needle)
requireText('src/App.tsx',files.app,"lazy(() => import(")
requireText('src/App.tsx',files.app,'AppErrorBoundary')
requireText('src/layouts/AppLayout.tsx',files.layout,'OfflineBanner')
requireText('src/layouts/AppLayout.tsx',files.layout,'id="main-content"')
requireText('src/layouts/AppLayout.tsx',files.layout,'skip-link')
requireText('src/styles.css',files.styles,':focus-visible')
requireText('src/styles.css',files.styles,'prefers-reduced-motion')
requireText('README.md',files.readme,'Para o Thó')
requireText('README.md',files.readme,'update-cpa.bat')

if(errors.length){
  console.error('V12 experience validation failed:')
  for(const error of errors)console.error(`- ${error}`)
  process.exit(1)
}
console.log('V12 experience validation passed: Windows launch/update, PWA, lazy loading, accessibility and offline states are wired.')
