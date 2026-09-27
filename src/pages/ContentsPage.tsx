import { useState } from 'react'
import { ArrowRight, BookOpen, CheckCircle2, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { courseModules, matchesModule } from '../../content/cpa/course/modules'
import { moduleReadings, readingMinutes } from '../../content/cpa/course/readings'
import { cpaLessons } from '../../content/cpa/lessons'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { FreeMaterials } from '../components/FreeMaterials'
import { useCourseProgress } from '../hooks/useCourseProgress'
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
export function ContentsPage() {
  const [query, setQuery] = useState('')
  const { progress, simulations, loading } = useCourseProgress()
  const finished = (id: string) => progress[id]?.readSections.length === moduleReadings[id].sections.length && simulations.some(row => row.payload.moduleId === id && row.completedAt)
  const completed = courseModules.filter(module => finished(module.id)).length
  const next = courseModules.find(module => !finished(module.id)) ?? courseModules[0]
  const filtered = courseModules.filter(module => {
    const terms = [module.title, module.subtitle, ...moduleReadings[module.id].objectives, ...cpaLessons.filter(lesson => matchesModule(module, lesson.pdCode)).flatMap(lesson => [lesson.title, lesson.pdCode, ...lesson.searchTerms])].join(' ')
    return normalize(terms).includes(normalize(query.trim()))
  })
  return <div className="mx-auto max-w-6xl space-y-8">
    <header className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-400/10 via-transparent to-sky-400/10 p-6 sm:p-8"><Badge>CPA 2026 · 20 módulos</Badge><h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Um assunto de cada vez.</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">Leia para entender, acompanhe um caso e teste o que aprendeu. Cada módulo termina com seu próprio simulado comentado. Os códigos do edital ficam como referência para consulta.</p><div className="mt-5 flex flex-wrap items-center gap-4"><Link to={`/modulos/${next.id}`} className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950">{loading ? 'Abrir primeiro módulo' : completed ? 'Continuar os módulos' : 'Começar a leitura'} <ArrowRight className="h-4 w-4"/></Link><span className="text-sm text-slate-500">{loading ? 'Carregando progresso...' : `${completed}/20 com leitura e simulado concluídos`}</span></div></header>
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center"><div className="relative flex-1"><Search aria-hidden="true" className="absolute left-4 top-4 h-4 w-4 text-slate-400"/><input aria-label="Buscar módulo ou assunto" value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar módulo ou assunto: fundos, Pix, juros..." className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm dark:border-white/10 dark:bg-white/5"/></div><Link to="/edital" className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Consultar mapa do edital →</Link></div>
    {!filtered.length && <Card><p>Nenhum módulo encontrado. Tente outro assunto.</p></Card>}
    {[...new Set(courseModules.map(module => module.stage))].map(stage => {
      const items = filtered.filter(module => module.stage === stage)
      return items.length ? <section key={stage}><h2 className="mb-4 text-xl font-bold">{stage}</h2><div className="grid gap-4 md:grid-cols-2">{items.map(module => {
        const reading = moduleReadings[module.id]; const count = progress[module.id]?.readSections.length ?? 0
        const exam = simulations.find(row => row.payload.moduleId === module.id && row.completedAt)
        return <Link key={module.id} to={`/modulos/${module.id}`} className="group"><Card className="h-full transition group-hover:-translate-y-0.5 group-hover:border-emerald-400/50 group-hover:shadow-lg"><div className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-400/10 text-lg font-bold text-emerald-700 dark:text-emerald-300">{String(courseModules.indexOf(module)+1).padStart(2,'0')}</span><div className="min-w-0 flex-1"><h3 className="font-bold">{module.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{module.subtitle}</p><p className="mt-3 flex items-center gap-2 text-xs text-slate-500"><BookOpen className="h-3.5 w-3.5"/>{readingMinutes(reading)} min de leitura · simulado ao final</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-emerald-400" style={{width:`${count/reading.sections.length*100}%`}}/></div><p className="mt-2 text-xs text-slate-500">Leitura: {count}/{reading.sections.length} partes · {exam ? `Último simulado: ${exam.score}%` : 'Simulado pendente'}</p></div>{finished(module.id) ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500"/> : <ArrowRight className="h-4 w-4 shrink-0 text-slate-400"/>}</div></Card></Link>
      })}</div></section> : null
    })}
    <p className="text-xs leading-6 text-slate-500">As leituras apresentam os conceitos centrais de cada módulo. As 445 aulas de consulta do programa continuam disponíveis dentro dos módulos. Ler o resumo não marca automaticamente essas aulas como estudadas.</p>
    <FreeMaterials/>
  </div>
}
