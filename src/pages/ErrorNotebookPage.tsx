import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, History, RotateCcw, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cpaQuestionMap } from '../../content/cpa/questions'
import { macro1LessonMap } from '../../content/cpa/lessons/macro-1'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { STORAGE_CHANGED_EVENT } from '../lib/storage/events'
import { getQuestionErrors, markQuestionErrorResolved } from '../lib/storage/repositories/questionRepository'
import type { ErrorRecord } from '../lib/storage/types'

type Filter='pending'|'recurrent'|'resolved'|'all'
function formatDate(value:string){return new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(value))}

export function ErrorNotebookPage(){
  const [errors,setErrors]=useState<ErrorRecord[]>([])
  const [loading,setLoading]=useState(true)
  const [filter,setFilter]=useState<Filter>('pending')

  async function load(){
    const rows=await getQuestionErrors(true)
    setErrors(rows.sort((a,b)=>(b.lastWrongAt??b.createdAt).localeCompare(a.lastWrongAt??a.createdAt)))
    setLoading(false)
  }
  useEffect(()=>{void load();const listener=()=>void load();window.addEventListener(STORAGE_CHANGED_EVENT,listener);return()=>window.removeEventListener(STORAGE_CHANGED_EVENT,listener)},[])

  const pending=errors.filter((error)=>!error.resolvedAt)
  const recurrent=pending.filter((error)=>(error.wrongCount??1)>=2)
  const resolved=errors.filter((error)=>Boolean(error.resolvedAt))
  const visible=useMemo(()=>errors.filter((error)=>{
    if(filter==='pending')return !error.resolvedAt
    if(filter==='recurrent')return !error.resolvedAt&&(error.wrongCount??1)>=2
    if(filter==='resolved')return Boolean(error.resolvedAt)
    return true
  }),[errors,filter])

  return <div className="mx-auto max-w-6xl space-y-6">
    <div><div className="mb-2 flex items-center gap-2"><Badge>V8 · Caderno de Erros</Badge><span className="text-sm text-slate-500">histórico local e recorrência</span></div><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Aprenda com os erros</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Toda questão errada entra aqui automaticamente. Erros repetidos ganham destaque e prioridade na Central de Revisão.</p></div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card><Target className="h-5 w-5 text-rose-500"/><p className="mt-3 text-2xl font-black">{errors.length}</p><p className="text-sm font-semibold">Erros registrados</p></Card>
      <Card><AlertTriangle className="h-5 w-5 text-amber-500"/><p className="mt-3 text-2xl font-black">{pending.length}</p><p className="text-sm font-semibold">Pendentes</p></Card>
      <Card><RotateCcw className="h-5 w-5 text-orange-500"/><p className="mt-3 text-2xl font-black">{recurrent.length}</p><p className="text-sm font-semibold">Recorrentes</p></Card>
      <Card><CheckCircle2 className="h-5 w-5 text-emerald-500"/><p className="mt-3 text-2xl font-black">{resolved.length}</p><p className="text-sm font-semibold">Resolvidos</p></Card>
    </div>

    <div className="flex flex-wrap gap-2">{([
      ['pending','Pendentes'],['recurrent','Recorrentes'],['resolved','Resolvidos'],['all','Todos'],
    ] as [Filter,string][]).map(([value,label])=><button key={value} onClick={()=>setFilter(value)} className={`rounded-xl border px-3 py-2 text-xs font-semibold ${filter===value?'border-emerald-400 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300':'border-slate-200 dark:border-white/10'}`}>{label}</button>)}</div>

    {loading?<Card><p className="py-10 text-center text-sm text-slate-500">Carregando erros...</p></Card>:visible.length===0?<Card><div className="py-12 text-center"><Target className="mx-auto h-9 w-9 text-emerald-400"/><h2 className="mt-3 text-lg font-bold">Nenhum erro neste filtro</h2><p className="mt-1 text-sm text-slate-500">{filter==='pending'?'Sua fila de erros pendentes está limpa.':'Não há registros para esta visualização.'}</p><Link to="/questoes"><Button className="mt-5">Treinar questões</Button></Link></div></Card>:<div className="space-y-4">{visible.map((error)=>{
      const question=cpaQuestionMap.get(error.sourceId)
      const count=error.wrongCount??1
      const recurrentError=count>=2&&!error.resolvedAt
      return <Card key={error.id} className={error.resolvedAt?'opacity-65':''}>
        <div className="flex flex-wrap items-center gap-2"><Badge>{error.sourceId}</Badge>{error.pdCode?<Badge>PD {error.pdCode}</Badge>:null}{recurrentError?<span className="inline-flex items-center gap-1 rounded-full bg-orange-400/10 px-2 py-1 text-[11px] font-bold text-orange-700 dark:text-orange-300"><AlertTriangle className="h-3 w-3"/>Recorrente</span>:null}{error.resolvedAt?<span className="ml-auto text-xs font-semibold text-emerald-600">Resolvido</span>:null}</div>
        <h2 className="mt-4 font-bold leading-6">{error.prompt}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2"><div className="rounded-xl bg-rose-400/10 p-3"><p className="text-xs font-semibold text-rose-700 dark:text-rose-300">Sua última resposta</p><p className="mt-1 text-sm">{error.selectedAnswer??'—'}</p></div><div className="rounded-xl bg-emerald-400/10 p-3"><p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Resposta correta</p><p className="mt-1 text-sm">{error.correctAnswer??'—'}</p></div></div>
        {question?<p className="mt-4 text-sm leading-6 text-slate-500">{question.explanation}</p>:null}
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500 dark:bg-white/[0.03]"><span className="inline-flex items-center gap-1"><History className="h-3.5 w-3.5"/>Primeiro erro: {formatDate(error.createdAt)}</span><span>Último erro: {formatDate(error.lastWrongAt??error.createdAt)}</span><span>Ocorrências: <strong>{count}</strong></span>{error.resolvedAt?<span>Resolvido em: {formatDate(error.resolvedAt)}</span>:null}</div>
        <div className="mt-5 flex flex-wrap gap-2"><Link to={`/questoes?question=${encodeURIComponent(error.sourceId)}`}><Button variant="secondary"><RotateCcw className="h-4 w-4"/>Refazer questão</Button></Link>{error.pdCode?<Link to={macro1LessonMap.has(error.pdCode)?`/conteudos/${error.pdCode}`:'/trilha'}><Button variant="secondary">Revisar conteúdo</Button></Link>:null}{!error.resolvedAt?<Button onClick={()=>void markQuestionErrorResolved(error.id)}><CheckCircle2 className="h-4 w-4"/>Entendi o erro</Button>:null}</div>
      </Card>
    })}</div>}
  </div>
}
