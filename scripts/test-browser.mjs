import { chromium, expect } from '@playwright/test'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { mkdir, readFile } from 'node:fs/promises'

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CPA_BROWSER_EXECUTABLE || undefined,
  args: ['--no-sandbox'],
})
const errors = []
const requests = []
const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1440, height: 1000 }, offline: true })
const page = await context.newPage()
page.on('pageerror', (error) => errors.push(error.message))
page.on('request', (request) => { if (/^https?:/.test(request.url())) requests.push(request.url()) })
const fileUrl = pathToFileURL(resolve('CPA_Study.html')).href
const goto = async (route = '') => { await page.goto(`${fileUrl}#/${route}`) }
const getData = (store) => page.evaluate(async (store) => {
  const db = await new Promise((resolve, reject) => { const r = indexedDB.open('cpa-study-local'); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error) })
  return new Promise((resolve, reject) => { const r = db.transaction(store).objectStore(store).getAll(); r.onsuccess = () => { db.close(); resolve(r.result) }; r.onerror = () => reject(r.error) })
}, store)
try {
  await goto()
  await page.getByPlaceholder('Felipe, Thó...').fill('Teste offline')
  await page.getByRole('button', { name: 'Começar a estudar' }).click()
  await expect(page.getByRole('heading', { name: /Indicador de estudo/ })).toBeVisible()
  await goto('questoes')
  await expect(page.getByRole('heading', { name: 'Questões', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Não respondidas', exact: true }).click()
  const questionPrompt = await page.locator('p.text-lg.font-bold').innerText()
  await page.locator('button').filter({ has: page.locator('span', { hasText: /^A$/ }) }).first().click()
  await page.getByRole('button', { name: 'Responder', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Explicação', exact: true })).toBeVisible()
  await expect(page.locator('p.text-lg.font-bold')).toHaveText(questionPrompt)
  const attempts = await getData('questionAttempts')
  expect(attempts).toHaveLength(1)
  expect(attempts[0].questionVersion).toBeTruthy()
  await page.reload()
  expect(await getData('questionAttempts')).toHaveLength(1)

  await goto('simulados')
  await page.getByRole('button', { name: 'Iniciar', exact: true }).first().click()
  await expect(page.getByText('Questão 1 de 10', { exact: true })).toBeVisible()
  await page.locator('button').filter({ has: page.locator('span', { hasText: /^A$/ }) }).first().click()
  await expect(page.getByText('1 respondidas · 0 marcadas', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Notas', exact: true }).click()
  await page.locator('textarea').fill('Notas offline que devem sobreviver à recarga')
  await page.getByRole('button', { name: 'Fechar', exact: true }).click()
  await page.getByRole('button', { name: 'Próxima', exact: true }).click()
  await expect.poll(async () => (await getData('simulations'))[0].payload.currentIndex).toBe(1)
  await page.reload()
  await expect(page.getByText('Questão 2 de 10', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Notas', exact: true }).click()
  await expect(page.locator('textarea')).toHaveValue('Notas offline que devem sobreviver à recarga')
  await page.getByRole('button', { name: 'Fechar', exact: true }).click()
  await page.getByRole('button', { name: 'Finalizar', exact: true }).click()
  await page.getByRole('button', { name: 'Finalizar agora', exact: true }).click()
  await expect(page).toHaveURL(/resultado$/)
  expect((await getData('simulations'))[0].payload.result.unansweredCount).toBe(9)

  await goto('configuracoes')
  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Exportar progresso' }).click()
  const download = await downloadEvent
  const backup = JSON.parse(await readFile(await download.path(), 'utf8'))
  expect(backup.questionAttempts).toHaveLength(1)
  expect(backup.simulations[0].payload.questionSnapshots).toHaveLength(10)

  const otherContext = await browser.newContext({ offline: true })
  const other = await otherContext.newPage()
  other.on('pageerror', (error) => errors.push(error.message))
  await other.goto(fileUrl)
  await other.locator('input[type=file]').setInputFiles(await download.path())
  await expect(other.getByRole('heading', { name: /Indicador de estudo/ })).toBeVisible()
  await other.goto(`${fileUrl}#/estatisticas`)
  await expect(other.getByText('Primeira tentativa', { exact: true })).toBeVisible()
  await otherContext.close()

  await goto('estatisticas')
  await expect(page.getByText('Primeira tentativa', { exact: true })).toBeVisible()
  await mkdir('test-results', { recursive: true })
  await page.screenshot({ path: 'test-results/offline-desktop.png', fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  await goto('questoes')
  await expect(page.getByRole('heading', { name: 'Questões', exact: true })).toBeVisible()
  await page.screenshot({ path: 'test-results/offline-mobile.png', fullPage: true })
  const overflow = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(el=>el.getBoundingClientRect().right>innerWidth+1).slice(0,8).map(el=>({tag:el.tagName,classes:el.className,width:el.getBoundingClientRect().width})))
  if(overflow.length) console.log('Mobile overflow:',overflow)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  const blockedContext = await browser.newContext({ offline: true })
  await blockedContext.addInitScript(() => { IDBFactory.prototype.open = () => { throw new DOMException('Storage blocked', 'SecurityError') } })
  const blockedPage = await blockedContext.newPage()
  await blockedPage.goto(fileUrl)
  await expect(blockedPage.getByRole('heading', { name: 'Progresso indisponível' })).toBeVisible()
  await blockedContext.close()
  expect(requests).toEqual([])
  expect(errors).toEqual([])
  console.log('PASS: file:// offline, first launch, answer feedback, reload, exam resume/notes/result, backup export/import in a fresh browser context, desktop/mobile, blocked-storage recovery screen, zero network requests and zero page errors.')
} finally { await browser.close() }
