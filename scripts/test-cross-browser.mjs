import { chromium, firefox, webkit, expect } from '@playwright/test'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
const html = await readFile('CPA_Study.html')
const server = createServer((req,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html)})
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))
const url=`http://127.0.0.1:${server.address().port}/`
try {
 for(const name of (process.env.CPA_BROWSERS||'chromium,firefox,webkit').split(',')) {
  const browser=await {chromium,firefox,webkit}[name].launch({headless:true,...(name==='chromium'&&process.env.CPA_BROWSER_EXECUTABLE?{executablePath:process.env.CPA_BROWSER_EXECUTABLE,args:['--no-sandbox']}: {})})
  try {
   const context=await browser.newContext({viewport:{width:390,height:844}})
   const page=await context.newPage();const errors=[]
   page.on('pageerror',e=>errors.push(e.message))
   await page.goto(url)
   await page.getByPlaceholder('Felipe, Thó...').fill('Teste V26')
   await page.getByRole('button',{name:'Começar a estudar'}).click()
   await expect(page.getByRole('heading',{name:'Olá, Teste V26.'})).toBeVisible()
   // Mobile keyboard focus stays inside the modal and returns to its trigger.
   await page.getByRole('button',{name:'Abrir menu'}).click()
   const dialog=page.getByRole('dialog',{name:'Menu de navegação'})
   await expect(dialog).toBeVisible()
   await expect(dialog.getByRole('button',{name:'Fechar menu'})).toBeFocused()
   await page.keyboard.press('Shift+Tab')
   await expect(dialog.getByRole('link',{name:'Configurações',exact:true})).toBeFocused()
   await page.keyboard.press('Tab')
   await expect(dialog.getByRole('button',{name:'Fechar menu'})).toBeFocused()
   await page.keyboard.press('Escape')
   await expect(dialog).toHaveCount(0)
   await expect(page.getByRole('button',{name:'Abrir menu'})).toBeFocused()
   const other=await context.newPage()
   await other.goto(`${url}#/conteudos`)
   other.on('pageerror',e=>errors.push(e.message))
   await page.getByRole('link',{name:'Minha meta',exact:true}).click()
   await expect(page.getByRole('heading',{name:'Sessão de hoje',exact:true})).toBeVisible()
   await page.getByRole('button',{name:'Li esta parte · continuar'}).click()
   await expect(page.getByText(/Etapa 2 de/)).toBeVisible()
   await page.reload()
   await expect(page.getByText(/Etapa 2 de/)).toBeVisible()
   // The other mounted tab reloads data on BroadcastChannel notification.
   const readCount=()=>other.evaluate(async()=>{
    const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('cpa-study-local');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})
    const rows=await new Promise((resolve,reject)=>{const r=db.transaction('studyPlans').objectStore('studyPlans').getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})
    db.close();return rows.filter(r=>r.id.startsWith('course:')).reduce((sum,r)=>sum+r.payload.readSections.length,0)
   })
   expect(await readCount()).toBe(1)
   await expect(other.getByText(/Leitura: 1\/3 partes/).first()).toBeVisible()
   // Advance reading, then answer practice and confirm a reload does not duplicate it.
   if(await page.getByRole('button',{name:'Li esta parte · continuar'}).count()) await page.getByRole('button',{name:'Li esta parte · continuar'}).click()
   const radio=page.getByRole('radio').first()
   await expect(radio).toBeVisible()
   await radio.check()
   await page.getByRole('button',{name:'Responder e conferir'}).evaluate(b=>{b.click();b.click()})
   await expect(page.getByRole('button',{name:'Continuar sessão'})).toBeVisible()
   await page.reload()
   await expect(page.getByRole('button',{name:'Continuar sessão'})).toBeVisible()
   await page.getByRole('button',{name:'Continuar sessão'}).click()
   for(const route of ['revisao','modulos/economia','apostila/economia','estatisticas','configuracoes']) {
    await page.goto(`${url}#/${route}`)
    await expect(page.getByRole('heading',{level:1}).first()).toBeVisible()
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
   }
   expect(errors).toEqual([])
   console.log(`PASS ${name}: mobile focus trap, Escape, daily reading/answer/reload, cross-tab refresh, handbook and main routes.`)
  } finally {await browser.close()}
 }
} finally {await new Promise(resolve=>server.close(resolve))}
