import { nextModule, moduleStateLabels } from '../lib/course/progress'
import { useState } from 'react'
import { ArrowRight, BookOpen, CheckCircle2, FileText, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { courseModules, matchesModule } from '../../content/cpa/course/modules'
import { moduleReadings } from '../../content/cpa/course/readings'
import { moduleApostilaStats } from '../../content/cpa/course/apostila'
import { cpaLessons } from '../../content/cpa/lessons'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { FreeMaterials } from '../components/FreeMaterials'
import { useCourseProgress } from '../hooks/useCourseProgress'

const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const stageNumber = (stage: string) => stage.split('.')[0]

export function ContentsPage() {
  const [query, setQuery] = useState('')
  const { progress, simulations, modules, loading } = useCourseProgress()
  const finished = (id: string) => progress[id]?.readSections.length === moduleReadings[id].sections.length && simulations.some(row => row.payload.moduleId === id && row.completedAt)
  const completed = courseModules.filter(module => finished(module.id)).length
  const next = nextModule(modules).module
  const filtered = courseModules.filter(module => {
    const terms = [module.title, module.subtitle, module.stage, ...moduleReadings[module.id].objectives, ...cpaLessons.filter(lesson => matchesModule(module, lesson.pdCode)).flatMap(lesson => [lesson.title, lesson.pdCode, ...lesson.searchTerms])].join(' ')
    return normalize(terms).includes(normalize(query.trim()))
  })

  return <div className="mx-auto max-w-6xl space-y-8">
    <header className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-400/10 via-transparent to-sky-400/10 p-6 sm:p-8">
      <div className="flex flex-wrap gap-2"><Badge>Nova CPA 2026</Badge><Badge>4 blocos oficiais · 20 capítulos de estudo</Badge></div>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Apostila organizada como a prova.</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">Os 20 capítulos quebram os quatro blocos oficiais da Nova CPA em partes estudáveis. A leitura principal é a apostila completa — com teoria, exemplos, pegadinhas, fórmulas, como cai e os pontos do Programa Detalhado — e não mais o resumo antigo de poucos minutos.</p>
      <div className="mt-4 rounded-2xl border border-emerald-300/30 bg-white/60 p-4 text-xs leading-6 text-slate-600 dark:bg-white/5 dark:text-slate-300"><strong>Referência didática:</strong> sequência pública do curso CPA 2026 do Prof. Renan Duarte / Retorno Interno e organização temática pública da TopInvest. O texto da CPA Study é autoral e a conferência normativa continua sendo feita contra o Programa Detalhado e fontes oficiais da ANBIMA.</div>
      <div className="mt-5 flex flex-wrap items-center gap-4"><Link to={`/apostila/${next.id}`} className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950">{loading ? 'Abrir primeira apostila' : completed ? 'Continuar a apostila' : 'Começar a estudar'} <ArrowRight className="h-4 w-4"/></Link><span className="text-sm text-slate-500">{loading ? 'Carregando progresso...' : `${completed}/20 capítulos com revisão e simulado concluídos`}</span></div>
    </header>

    <div className="flex flex-col gap-3 sm:flex-row sm:items-center"><div className="relative flex-1"><Search aria-hidden="true" className="absolute left-4 top-4 h-4 w-4 text-slate-400"/><input aria-label="Buscar módulo ou assunto" value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar: CMN, Selic, renda fixa, PGBL, suitability, ESG..." className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm dark:border-white/10 dark:bg-white/5"/></div><Link to="/edital" className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Consultar Programa Detalhado →</Link></div>

    {!filtered.length && <Card><p>Nenhum capítulo encontrado. Tente outro assunto.</p></Card>}

    {[...new Set(courseModules.map(module => module.stage))].map(stage => {
      const items = filtered.filter(module => module.stage === stage)
      return items.length ? <section key={stage}>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">Bloco {stageNumber(stage)} da prova</p><h2 className="mt-1 text-xl font-bold">{stage.replace(/^\d+\.\s*/, '')}</h2></div><span className="text-xs text-slate-500">{items.length} capítulos desta trilha</span></div>
        <div className="grid gap-4 md:grid-cols-2">{items.map(module => {
          const reading = moduleReadings[module.id]
          const count = progress[module.id]?.readSections.length ?? 0
          const exam = simulations.find(row => row.payload.moduleId === module.id && row.completedAt)
          const stats = moduleApostilaStats(module.id)
          return <Link key={module.id} to={`/apostila/${module.id}`} className="group"><Card className="h-full transition group-hover:-translate-y-0.5 group-hover:border-emerald-400/50 group-hover:shadow-lg"><div className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-400/10 text-lg font-bold text-emerald-700 dark:text-emerald-300">{String(courseModules.indexOf(module)+1).padStart(2,'0')}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold">{module.title}</h3><Badge>PD {module.prefixes.join(' · ')}</Badge></div><span className="mt-1 inline-block text-xs font-semibold text-emerald-700 dark:text-emerald-300">{moduleStateLabels[modules.find(row=>row.module.id===module.id)!.state]}</span><p className="mt-2 text-sm leading-6 text-slate-500">{module.subtitle}</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500"><span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5"/>~{stats.minutes} min de apostila completa</span><span className="inline-flex items-center gap-1.5"><FileText className="h-3.5 w-3.5"/>{stats.lessons.length} tópicos do edital</span></div><p className="mt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">Teoria + exemplos + como cai + pegadinhas + checkpoint + simulado</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-emerald-400" style={{width:`${reading.sections.length ? count/reading.sections.length*100 : 0}%`}}/></div><p className="mt-2 text-xs text-slate-500">Revisão marcada: {count}/{reading.sections.length} · {exam ? `Último simulado: ${exam.score}%` : 'Simulado pendente'}</p></div>{finished(module.id) ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500"/> : <ArrowRight className="h-4 w-4 shrink-0 text-slate-400"/>}</div></Card></Link>
        })}</div>
      </section> : null
    })}

    <p className="text-xs leading-6 text-slate-500">A divisão em 20 capítulos é somente para estudo. Na prova, o conteúdo pertence aos quatro blocos oficiais acima. A apostila integral cobre os 445 pontos terminais do Programa Detalhado cadastrados na plataforma.</p>
    <FreeMaterials/>
  </div>
}
