import { useMemo, useState } from 'react'
import { ArrowRight, BookOpen, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import metadata from '../../content/cpa/metadata.json'
import { cpaLessons, lessonGroups } from '../../content/cpa/lessons'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'

export function ContentsPage() {
  const [query,setQuery]=useState('')
  const normalized=query.trim().toLowerCase()
  const lessons=useMemo(()=>!normalized?cpaLessons:cpaLessons.filter((lesson)=>[lesson.pdCode,lesson.title,lesson.oneSentence,...lesson.essentialConcepts,...lesson.searchTerms].join(' ').toLowerCase().includes(normalized)),[normalized])

  return <div className="mx-auto max-w-6xl space-y-6">
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge>CPA · PD {metadata.programVersion}</Badge>
        <span className="text-sm text-slate-500">{cpaLessons.length} aulas completas · 4 macrotemas</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Conteúdos</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Aulas didáticas originais baseadas em fontes oficiais para todos os 445 PDs terminais da CPA: estrutura do SFN, produtos, relacionamento com o cliente e inovação.</p>
    </div>

    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/>
      <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Buscar por título, sigla, conceito ou PD Code..." className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-white/10 dark:bg-white/5"/>
    </div>

    {lessons.length===0?<Card><div className="py-10 text-center"><Search className="mx-auto h-8 w-8 text-slate-300"/><p className="mt-3 font-semibold">Nenhuma aula encontrada</p><p className="mt-1 text-sm text-slate-500">Tente outra palavra, sigla ou código PD.</p></div></Card>:lessonGroups.map((group)=>{
      const groupLessons=lessons.filter((lesson)=>lesson.pdCode.startsWith(`${group.code}.`)||lesson.pdCode===group.code)
      if(!groupLessons.length)return null
      return <section key={group.code} className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div><p className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-300">{group.code}</p><h2 className="text-xl font-bold">{group.title}</h2></div>
          <span className="text-xs text-slate-500">{groupLessons.length} aulas</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">{groupLessons.map((lesson)=><Link key={lesson.pdCode} to={`/conteudos/${lesson.pdCode}`} className="group"><Card className="h-full transition hover:-translate-y-0.5 hover:border-emerald-400/40 hover:shadow-lg"><div className="flex h-full gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-400/12 text-emerald-700 dark:text-emerald-300"><BookOpen className="h-4 w-4"/></div><div className="min-w-0 flex-1"><p className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-300">{lesson.pdCode}</p><h3 className="mt-1 text-sm font-semibold leading-5">{lesson.title}</h3><p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{lesson.oneSentence}</p></div><ArrowRight className="mt-2 h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-500"/></div></Card></Link>)}</div>
      </section>
    })}
  </div>
}
