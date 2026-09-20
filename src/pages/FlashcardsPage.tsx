import { useMemo, useState, type FormEvent } from 'react'
import { Brain, CalendarClock, CheckCircle2, Plus, Search, Trash2 } from 'lucide-react'
import { cpaCurriculumByCode } from '../../content/cpa/curriculum'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useReviewCenter } from '../features/review/useReviewCenter'
import { getLatestFlashcardState, type FlashcardRating } from '../lib/review/flashcardEngine'
import { createCustomFlashcard, deleteCustomFlashcard, reviewFlashcard } from '../lib/storage/repositories/flashcardRepository'

const ratingMeta:Record<FlashcardRating,{label:string;hint:string}> = {
  again:{label:'Again',hint:'errei'},
  hard:{label:'Hard',hint:'difícil'},
  good:{label:'Good',hint:'lembrei'},
  easy:{label:'Easy',hint:'muito fácil'},
}

function formatDate(value:string|null){
  if(!value)return'—'
  return new Intl.DateTimeFormat('pt-BR',{dateStyle:'short'}).format(new Date(value))
}

export function FlashcardsPage(){
  const {flashcards,reviews,loading,refresh}=useReviewCenter()
  const [revealed,setRevealed]=useState(false)
  const [query,setQuery]=useState('')
  const [filter,setFilter]=useState<'due'|'all'>('due')
  const [front,setFront]=useState('')
  const [back,setBack]=useState('')
  const [pdCode,setPdCode]=useState('')
  const [message,setMessage]=useState('')
  const [error,setError]=useState('')

  const cards=useMemo(()=>flashcards.map((card)=>({card,state:getLatestFlashcardState(card.id,reviews)})),[flashcards,reviews])
  const due=useMemo(()=>cards.filter(({state})=>state.due).sort((a,b)=>(a.state.nextReviewAt??'').localeCompare(b.state.nextReviewAt??'')||a.card.id.localeCompare(b.card.id)),[cards])
  const reviewed=cards.filter(({state})=>state.reviewCount>0).length
  const mature=cards.filter(({state})=>state.intervalDays>=7&&state.correctStreak>=2).length
  const current=due[0]

  const visible=useMemo(()=>{
    const normalized=query.trim().toLowerCase()
    return cards.filter(({card,state})=>(filter==='all'||state.due)&&(!normalized||[card.front,card.back,card.pdCode??''].join(' ').toLowerCase().includes(normalized)))
  },[cards,filter,query])

  async function rate(rating:FlashcardRating){
    if(!current)return
    await reviewFlashcard(current.card.id,rating)
    setRevealed(false)
    await refresh()
  }

  async function create(event:FormEvent){
    event.preventDefault();setMessage('');setError('')
    const cleanPd=pdCode.trim()
    if(cleanPd&&!cpaCurriculumByCode.has(cleanPd)){setError('PD Code inexistente no Programa Detalhado atual.');return}
    try{
      await createCustomFlashcard(front,back,cleanPd||null)
      setFront('');setBack('');setPdCode('');setMessage('Flashcard pessoal criado.')
      await refresh()
    }catch(cause){setError(cause instanceof Error?cause.message:'Não foi possível criar o flashcard.')}
  }

  if(loading)return <div className="mx-auto max-w-7xl"><Card><p className="py-12 text-center text-sm text-slate-500">Carregando flashcards...</p></Card></div>

  return <div className="mx-auto max-w-7xl space-y-6">
    <div><div className="mb-2 flex items-center gap-2"><Badge>V8 · Flashcards</Badge><span className="text-sm text-slate-500">repetição espaçada local</span></div><h1 className="text-3xl font-black tracking-tight sm:text-4xl">Flashcards</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Os cartões das aulas são ativados quando você começa a estudar aquele PD. O conteúdo fica no GitHub; seu histórico de revisão fica apenas neste navegador.</p></div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card><Brain className="h-5 w-5 text-emerald-500"/><p className="mt-3 text-2xl font-black">{cards.length}</p><p className="text-sm font-semibold">Ativos</p><p className="mt-1 text-xs text-slate-500">Aulas já abertas + cartões pessoais.</p></Card>
      <Card><CalendarClock className="h-5 w-5 text-amber-500"/><p className="mt-3 text-2xl font-black">{due.length}</p><p className="text-sm font-semibold">Para revisar</p><p className="mt-1 text-xs text-slate-500">Novos ou com próxima revisão vencida.</p></Card>
      <Card><CheckCircle2 className="h-5 w-5 text-sky-500"/><p className="mt-3 text-2xl font-black">{reviewed}</p><p className="text-sm font-semibold">Já revisados</p><p className="mt-1 text-xs text-slate-500">Com pelo menos uma avaliação.</p></Card>
      <Card><CheckCircle2 className="h-5 w-5 text-violet-500"/><p className="mt-3 text-2xl font-black">{mature}</p><p className="text-sm font-semibold">Maduros</p><p className="mt-1 text-xs text-slate-500">Intervalo ≥ 7 dias e sequência ≥ 2.</p></Card>
    </div>

    <Card className="overflow-hidden p-0">
      <div className="bg-slate-950 p-5 text-white sm:p-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Revisão agora</p><h2 className="mt-1 text-xl font-black">{current?'1 cartão vencido por vez':'Fila zerada'}</h2></div>
      {!current?<div className="p-8 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500"/><p className="mt-3 font-bold">Nada vencido agora.</p><p className="mt-1 text-sm text-slate-500">Novos cartões aparecerão conforme você abrir aulas ou criar cartões pessoais.</p></div>:<div className="p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2"><Badge>{current.card.source==='lesson'?'Aula':'Pessoal'}</Badge>{current.card.pdCode?<Badge>PD {current.card.pdCode}</Badge>:null}<span className="text-xs text-slate-500">{current.state.reviewCount===0?'Novo':`Revisões: ${current.state.reviewCount} · sequência: ${current.state.correctStreak}`}</span></div>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-white/10 dark:bg-white/[0.03]"><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Frente</p><p className="mt-3 text-lg font-bold leading-7">{current.card.front}</p>{revealed?<div className="mt-6 border-t border-slate-200 pt-6 dark:border-white/10"><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-300">Resposta</p><p className="mt-3 text-base leading-7">{current.card.back}</p></div>:null}</div>
        {!revealed?<Button className="mt-5 w-full" onClick={()=>setRevealed(true)}>Mostrar resposta</Button>:<div className="mt-5 grid gap-2 sm:grid-cols-4">{(Object.keys(ratingMeta) as FlashcardRating[]).map((rating)=><button key={rating} onClick={()=>void rate(rating)} className="rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold hover:border-emerald-400 hover:bg-emerald-400/5 dark:border-white/10"><span>{ratingMeta[rating].label}</span><span className="mt-0.5 block text-[11px] font-normal text-slate-500">{ratingMeta[rating].hint}</span></button>)}</div>}
      </div>}
    </Card>

    <div className="grid gap-6 lg:grid-cols-[1.4fr_.8fr]">
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold">Biblioteca ativa</h2><p className="mt-1 text-xs text-slate-500">Histórico e próxima revisão reais de cada cartão.</p></div><div className="flex gap-2"><button className={`rounded-xl border px-3 py-2 text-xs font-semibold ${filter==='due'?'border-emerald-400 bg-emerald-400/10':'border-slate-200 dark:border-white/10'}`} onClick={()=>setFilter('due')}>Vencidos</button><button className={`rounded-xl border px-3 py-2 text-xs font-semibold ${filter==='all'?'border-emerald-400 bg-emerald-400/10':'border-slate-200 dark:border-white/10'}`} onClick={()=>setFilter('all')}>Todos</button></div></div>
        <div className="relative mt-4"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400"/><input value={query} onChange={(event)=>setQuery(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm dark:border-white/10 dark:bg-white/5" placeholder="Buscar frente, resposta ou PD..."/></div>
        <div className="mt-4 max-h-[620px] space-y-2 overflow-auto">{visible.length===0?<p className="py-8 text-center text-sm text-slate-500">Nenhum flashcard neste filtro.</p>:visible.map(({card,state})=><div key={card.id} className="rounded-xl border border-slate-200 p-3 dark:border-white/10"><div className="flex items-start gap-3"><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2">{card.pdCode?<span className="font-mono text-[11px] font-bold text-emerald-600">PD {card.pdCode}</span>:null}<span className="text-[11px] text-slate-400">{card.source==='lesson'?'Aula':'Pessoal'}</span></div><p className="mt-1 text-sm font-semibold">{card.front}</p><p className="mt-1 line-clamp-2 text-xs text-slate-500">{card.back}</p><p className="mt-2 text-[11px] text-slate-400">{state.reviewCount} revisão(ões) · intervalo {state.intervalDays}d · próxima {state.due?'agora':formatDate(state.nextReviewAt)}</p></div>{card.source==='custom'?<button onClick={()=>void deleteCustomFlashcard(card.id.replace(/^custom:/,''))} className="rounded-lg p-2 text-rose-500 hover:bg-rose-400/10" aria-label="Excluir flashcard"><Trash2 className="h-4 w-4"/></button>:null}</div></div>)}</div>
      </Card>

      <Card><div className="flex items-center gap-2"><Plus className="h-5 w-5 text-emerald-500"/><h2 className="font-bold">Criar flashcard pessoal</h2></div><form className="mt-4 space-y-3" onSubmit={create}><label className="block"><span className="mb-1 block text-xs font-semibold">Frente</span><textarea value={front} onChange={(event)=>setFront(event.target.value)} className="min-h-24 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-white/10 dark:bg-white/5" required/></label><label className="block"><span className="mb-1 block text-xs font-semibold">Verso</span><textarea value={back} onChange={(event)=>setBack(event.target.value)} className="min-h-28 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-white/10 dark:bg-white/5" required/></label><label className="block"><span className="mb-1 block text-xs font-semibold">PD Code (opcional)</span><input value={pdCode} onChange={(event)=>setPdCode(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-white/5" placeholder="Ex.: 1.1.1"/></label><Button type="submit" className="w-full"><Plus className="h-4 w-4"/>Criar</Button></form>{message?<p className="mt-3 text-xs font-semibold text-emerald-600">{message}</p>:null}{error?<p className="mt-3 text-xs font-semibold text-rose-600">{error}</p>:null}<p className="mt-4 text-xs leading-5 text-slate-500">Again reinicia a sequência; Hard encurta o avanço; Good segue o intervalo normal; Easy amplia o intervalo. O algoritmo é uma heurística de repetição espaçada e fica totalmente local.</p></Card>
    </div>
  </div>
}
