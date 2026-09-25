import { useAsyncAction } from '../hooks/useAsyncAction'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink, RotateCcw } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { cpaQuestionMap } from '../../content/cpa/questions'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useReviewCenter } from '../features/review/useReviewCenter'
import { type FlashcardRating } from '../lib/review/flashcardEngine'
import { selectReviewQueue, type ReviewMode, type ReviewQueueItem } from '../lib/review/queue'
import { recordSignificantActivity } from '../lib/storage/repositories/activityRepository'
import { reviewFlashcard } from '../lib/storage/repositories/flashcardRepository'
import { markLessonOpened } from '../lib/storage/repositories/learningRepository'
import { markQuestionErrorResolved } from '../lib/storage/repositories/questionRepository'

const validModes=new Set<ReviewMode>(['5','10','20','eve'])
const ratingLabel:Record<FlashcardRating,string>={again:'Again',hard:'Hard',good:'Good',easy:'Easy'}

export function ReviewSessionPage(){
  const [params]=useSearchParams()
  const requested=params.get('mode') as ReviewMode|null
  const mode:ReviewMode=requested&&validModes.has(requested)?requested:'10'
  const {center,errors,loading}=useReviewCenter()
  const [items,setItems]=useState<ReviewQueueItem[]|null>(null)
  const [index,setIndex]=useState(0)
  const [revealed,setRevealed]=useState(false)
  const { busy: saving, error: saveError, run } = useAsyncAction()
  const [completed,setCompleted]=useState<Set<string>>(() => new Set())

  useEffect(()=>{if(center&&items===null)setItems(selectReviewQueue(center.queue,mode))},[center,items,mode])
  const current=items?.[index]??null
  const total=items?.length??0
  const estimate=useMemo(()=>items?.reduce((sum,item)=>sum+item.estimatedMinutes,0)??0,[items])

  function advance(){setRevealed(false);setCompleted((value)=>new Set([...value,current!.id]));setIndex((value)=>value+1)}

  async function rate(rating:FlashcardRating){
    await run(async () => {
      if(!current?.flashcardId)return
      await reviewFlashcard(current.flashcardId,rating)
      advance()

    })
  }

  async function resolveError(){
    await run(async () => {
      if(!current?.errorId)return
      await markQuestionErrorResolved(current.errorId)
      advance()

    })
  }

  async function reviewContent(){
    await run(async () => {
      if(!current)return
      if(current.pdCode&&current.route?.startsWith('/conteudos/'))await markLessonOpened(current.pdCode)
      await recordSignificantActivity()
      advance()

    })
  }

  if(loading||!items)return <div className="mx-auto max-w-4xl p-4 sm:p-8"><Card><p className="py-12 text-center text-sm text-slate-500">Preparando sessão...</p></Card></div>
  if(total===0)return <div className="mx-auto max-w-3xl p-4 sm:p-8"><Card><div className="py-12 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500"/><h1 className="mt-3 text-2xl font-black">Nada para revisar agora</h1><p className="mt-2 text-sm text-slate-500">Sua fila deste modo está vazia.</p><Link to="/revisao"><Button className="mt-5">Voltar à Central</Button></Link></div></Card></div>
  if(!current)return <div className="mx-auto max-w-3xl p-4 sm:p-8"><Card><div className="py-12 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500"/><h1 className="mt-3 text-2xl font-black">Sessão concluída</h1><p className="mt-2 text-sm text-slate-500">{completed.size} item(ns) revisados em um bloco estimado de {estimate} min.</p><div className="mt-6 flex justify-center gap-2"><Link to="/revisao"><Button>Voltar à Central</Button></Link><Link to="/flashcards"><Button variant="secondary">Flashcards</Button></Link></div></div></Card></div>

  const error=current.errorId?errors.find((row)=>row.id===current.errorId):null
  const question=error?(error.questionSnapshot??cpaQuestionMap.get(error.sourceId)):null

  return <div className="min-h-screen bg-slate-50 p-4 text-slate-950 dark:bg-[#07111c] dark:text-white sm:p-8">
    <div className="mx-auto max-w-4xl space-y-5">
      {saveError?<p role="alert" className="text-sm text-rose-600">{saveError}</p>:null}
      <div className="flex items-center justify-between gap-4"><Link className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600" to="/revisao"><ArrowLeft className="h-4 w-4"/>Sair da sessão</Link><div className="text-right"><p className="text-sm font-black">{index+1} / {total}</p><p className="text-xs text-slate-500">~{estimate} min no total</p></div></div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10"><div className="h-full bg-emerald-500 transition-all" style={{width:`${Math.round(index/total*100)}%`}}/></div>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-200 bg-slate-950 p-5 text-white dark:border-white/10"><div className="flex flex-wrap items-center gap-2"><Badge>{current.type==='flashcard'?'Flashcard':current.type==='error'?'Caderno de Erros':'Revisão de conteúdo'}</Badge>{current.pdCode?<span className="font-mono text-xs font-bold text-emerald-300">PD {current.pdCode}</span>:null}</div><p className="mt-2 text-xs text-slate-400">{current.reason}</p></div>

        {current.type==='flashcard'?<div className="p-6">
          <div className="rounded-2xl bg-slate-50 p-7 text-center dark:bg-white/[0.03]"><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Frente</p><h2 className="mt-3 text-xl font-black leading-8">{current.front}</h2>{revealed?<div className="mt-6 border-t border-slate-200 pt-6 dark:border-white/10"><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-300">Resposta</p><p className="mt-3 text-base leading-7">{current.back}</p></div>:null}</div>
          {!revealed?<Button className="mt-5 w-full" onClick={()=>setRevealed(true)}>Mostrar resposta</Button>:<div className="mt-5 grid gap-2 sm:grid-cols-4">{(['again','hard','good','easy'] as FlashcardRating[]).map((rating)=><button key={rating} disabled={saving} onClick={()=>void rate(rating)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold hover:border-emerald-400 hover:bg-emerald-400/5 dark:border-white/10">{ratingLabel[rating]}</button>)}</div>}
        </div>:null}

        {current.type==='error'?<div className="p-6"><h2 className="text-lg font-black leading-7">{error?.prompt??current.title}</h2>{error?<div className="mt-5 grid gap-3 md:grid-cols-2"><div className="rounded-xl bg-rose-400/10 p-4"><p className="text-xs font-bold text-rose-600">Sua última resposta</p><p className="mt-1 text-sm">{error.selectedAnswer??'—'}</p></div><div className="rounded-xl bg-emerald-400/10 p-4"><p className="text-xs font-bold text-emerald-600">Correta</p><p className="mt-1 text-sm">{error.correctAnswer??'—'}</p></div></div>:null}{question?<p className="mt-5 text-sm leading-6 text-slate-500">{question.explanation}</p>:null}<div className="mt-6 flex flex-wrap gap-2"><Link to={current.route??'/questoes'}><Button variant="secondary"><RotateCcw className="h-4 w-4"/>Refazer questão</Button></Link><Button disabled={saving} onClick={()=>void resolveError()}><CheckCircle2 className="h-4 w-4"/>Entendi o erro</Button></div></div>:null}

        {current.type==='content'?<div className="p-6"><h2 className="text-xl font-black leading-8">{current.title}</h2><p className="mt-3 text-sm leading-6 text-slate-500">{current.reason}</p><div className="mt-6 flex flex-wrap gap-2">{current.route?<Link to={current.route}><Button variant="secondary"><ExternalLink className="h-4 w-4"/>{current.route.startsWith('/questoes')?'Treinar este PD':'Abrir conteúdo'}</Button></Link>:null}{current.route?.startsWith('/conteudos/')?<Button disabled={saving} onClick={()=>void reviewContent()}><CheckCircle2 className="h-4 w-4"/>Revisado</Button>:<Button disabled={saving} variant="secondary" onClick={()=>{setIndex((value)=>value+1);setRevealed(false)}}>Pular por agora</Button>}</div></div>:null}
      </Card>

      <div className="flex items-center justify-between"><Button variant="secondary" disabled={saving||index===0} onClick={()=>{setIndex((value)=>Math.max(0,value-1));setRevealed(false)}}><ArrowLeft className="h-4 w-4"/>Anterior</Button><button disabled={saving} onClick={()=>{setIndex((value)=>value+1);setRevealed(false)}} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600">Pular <ArrowRight className="h-4 w-4"/></button></div>
    </div>
  </div>
}
