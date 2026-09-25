import { build } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdir, writeFile } from 'node:fs/promises'

// The same React application, compiled into a classic script with every lazy
// route inlined. No server, CDN, service worker, fetch or module imports needed.
const result = await build({
  configFile: false,
  plugins: [react()],
  publicDir: false,
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    write: false,
    cssCodeSplit: false,
    lib: { entry: 'src/main.tsx', name: 'CPAStudy', formats: ['iife'] },
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
})
const output = (Array.isArray(result) ? result[0] : result).output
const scripts = output.filter((item) => item.type === 'chunk')
if (scripts.length !== 1 || scripts[0].imports.length || scripts[0].dynamicImports.length) {
  throw new Error('O HTML local ainda depende de scripts externos.')
}
const css = output.filter((item) => item.type === 'asset' && item.fileName.endsWith('.css')).map((item) => item.source).join('\n')
const script = scripts[0].code.replace(/<\/script/gi, '<\\/script')
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>CPA Study — estudos offline</title><style>${css.replace(/<\/style/gi, '<\\/style')}</style></head><body><div id="root"></div><noscript>Ative o JavaScript do navegador para estudar.</noscript><script>${script}</script></body></html>`
await mkdir('dist', { recursive: true })
await writeFile('dist/CPA_Study.html', html)
await writeFile('CPA_Study.html', html)
console.log(`CPA_Study.html gerado: ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB, sem dependências externas.`)
