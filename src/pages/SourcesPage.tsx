import { useMemo, useState } from 'react'
import { AlertTriangle, ExternalLink, FileCheck2, Search, ShieldCheck, Waves, WifiOff } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { officialSourceImpacts, officialSourceManifest, sourceFreshness } from '../lib/official-sources/impact'

const keyIds=['ANBIMA_PD','ANBIMA_EXAM_NOTICE','ANBIMA_QUESTION_GUIDE','ANBIMA_QUESTION_BOOK_CPA']
const impactLabel={critical:'Crítico',high:'Alto',medium:'Médio',reference:'Referência'} as const
const kindLabel:Record<string,string>={
  program:'Programa Detalhado',program_index:'Índice oficial',exam_rules:'Regra de exame',question_design:'Elaboração de questões',
  self_regulation:'Autorregulação',regulation:'Regulação',law:'Lei',reference:'Referência oficial',
}
function formatDate(value:string){return new Intl.DateTimeFormat('pt-BR',{dateStyle:'short'}).format(new Date(`${value}T12:00:00Z`))}

export function SourcesPage(){
  const [query,setQuery]=useState('')
  const [institution,setInstitution]=useState('all')
  const impacts=officialSourceImpacts
  const keySources=keyIds.map((id)=>impacts.find((item)=>item.source.id===id)).filter(Boolean)
  const institutions=[...new Set(impacts.map((item)=>item.source.institution))].sort((a,b)=>a.localeCompare(b,'pt-BR'))
  const filtered=useMemo(()=>{
    const normalized=query.trim().toLowerCase()
    return impacts.filter((impact)=>{
      if(institution!=='all'&&impact.source.institution!==institution)return false
      if(!normalized)return true
      return [
        impact.source.id,impact.source.institution,impact.source.title,impact.source.knownVersion??'',
        ...impact.source.topics,...impact.topics,...impact.pdCodes,
      ].join(' ').toLowerCase().includes(normalized)
    })
  },[impacts,institution,query])
  const lastVerified=[...officialSourceManifest.sources].map((source)=>source.lastVerified).sort().at(-1)??officialSourceManifest.generatedAt
  const directLessonSources=impacts.filter((item)=>item.lessonCount>0).length
  const directQuestionSources=impacts.filter((item)=>item.questionCount>0).length

  return <div className="mx-auto max-w-7xl space-y-6">
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2"><Badge>V11 · Fontes e Atualizações</Badge><span className="text-sm text-slate-500">monitoramento oficial sem reescrita automática</span></div>
      <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Fontes e Atualizações</h1>
      <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-500">Esta central mostra o estado conhecido das fontes oficiais, onde elas impactam a plataforma e como mudanças externas são detectadas. Uma alteração nunca modifica aula, questão, currículo ou regra de prova sem revisão humana.</p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card><FileCheck2 className="h-5 w-5 text-emerald-500"/><p className="mt-3 text-2xl font-black">{officialSourceManifest.sources.length}</p><p className="text-sm font-semibold">Fontes registradas</p><p className="mt-1 text-xs text-slate-500">Manifesto versionado em <code>content/sources.json</code>.</p></Card>
      <Card><ShieldCheck className="h-5 w-5 text-sky-500"/><p className="mt-3 text-2xl font-black">{formatDate(lastVerified)}</p><p className="text-sm font-semibold">Verificação editorial mais recente</p><p className="mt-1 text-xs text-slate-500">A data é salva no GitHub, não depende de rede para aparecer.</p></Card>
      <Card><Waves className="h-5 w-5 text-violet-500"/><p className="mt-3 text-2xl font-black">{directLessonSources}</p><p className="text-sm font-semibold">Fontes ligadas a aulas</p><p className="mt-1 text-xs text-slate-500">{directQuestionSources} fontes também impactam questões diretamente.</p></Card>
      <Card><WifiOff className="h-5 w-5 text-amber-500"/><p className="mt-3 text-2xl font-black">Offline-safe</p><p className="text-sm font-semibold">Rede não bloqueia estudo</p><p className="mt-1 text-xs text-slate-500">Falha externa vira relatório; conteúdos locais continuam disponíveis.</p></Card>
    </div>

    <Card className="overflow-hidden p-0">
      <div className="bg-slate-950 p-5 text-white sm:p-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Documentos centrais</p><h2 className="mt-1 text-xl font-black">Estado oficial conhecido</h2></div>
      <div className="grid gap-px bg-slate-200 dark:bg-white/10 lg:grid-cols-2">{keySources.map((impact)=>{
        if(!impact)return null
        const freshness=sourceFreshness(impact.source)
        return <div key={impact.source.id} className="bg-white p-5 dark:bg-[#0b1824]">
          <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-300">{impact.source.id}</p><h3 className="mt-1 font-bold leading-6">{impact.source.title}</h3></div>{impact.source.knownVersion?<Badge>v{impact.source.knownVersion}</Badge>:null}</div>
          <p className="mt-3 text-xs text-slate-500">{freshness.label} · {formatDate(impact.source.lastVerified)}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px]"><span className="rounded-full bg-slate-100 px-2 py-1 font-semibold dark:bg-white/5">Impacto {impactLabel[impact.impactLevel]}</span>{impact.curriculumCount?<span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-white/5">{impact.curriculumCount} itens do currículo</span>:null}{impact.questionCount?<span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-white/5">{impact.questionCount} questões</span>:null}</div>
          <a href={impact.source.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:underline">Abrir fonte oficial <ExternalLink className="h-3.5 w-3.5"/></a>
        </div>
      })}</div>
    </Card>

    <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
      <Card>
        <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500"/><div><h2 className="font-bold">Política de atualização</h2><p className="mt-2 text-sm leading-6 text-slate-500">{officialSourceManifest.policy.changePolicy}</p></div></div>
        <div className="mt-5 space-y-2 text-sm">
          <div className="rounded-xl bg-emerald-400/10 p-3"><strong>GitHub = conteúdo.</strong> Mudanças editoriais entram por commit revisado.</div>
          <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/5"><strong>Monitor = alerta.</strong> Fingerprint diferente aponta possível mudança, mas não aplica nada.</div>
          <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/5"><strong>Offline = estudo continua.</strong> Site oficial indisponível não quebra aulas, questões ou simulados.</div>
        </div>
      </Card>
      <Card>
        <div className="flex items-start gap-3"><Waves className="mt-0.5 h-5 w-5 shrink-0 text-violet-500"/><div><h2 className="font-bold">Monitoramento automático</h2><p className="mt-2 text-sm leading-6 text-slate-500">O workflow semanal <code>Official Source Watch</code> compara fingerprints de conteúdo ou metadados contra o estado anterior. A primeira execução cria a baseline; as seguintes classificam fontes como inalteradas, alteradas ou inacessíveis.</p></div></div>
        <p className="mt-4 rounded-xl bg-amber-400/10 p-3 text-xs leading-5 text-amber-800 dark:text-amber-200"><AlertTriangle className="mr-1 inline h-4 w-4"/>“Alterada” significa <strong>revisar a fonte</strong>, não que o material local esteja automaticamente errado.</p>
      </Card>
    </div>

    <Card>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"><div><h2 className="font-bold">Mapa de impacto</h2><p className="mt-1 text-sm text-slate-500">Encontre quais aulas, questões, PD Codes e funcionalidades podem exigir revisão se uma fonte mudar.</p></div><div className="flex flex-col gap-2 sm:flex-row"><div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400"/><input value={query} onChange={(event)=>setQuery(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm dark:border-white/10 dark:bg-white/5 sm:w-72" placeholder="Fonte, tema, PD Code..."/></div><select value={institution} onChange={(event)=>setInstitution(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-white/5"><option value="all">Todas as instituições</option>{institutions.map((item)=><option key={item} value={item}>{item}</option>)}</select></div></div>
      <div className="mt-5 space-y-3">{filtered.length===0?<p className="py-8 text-center text-sm text-slate-500">Nenhuma fonte encontrada.</p>:filtered.map((impact)=>{
        const freshness=sourceFreshness(impact.source)
        return <details key={impact.source.id} className="group rounded-2xl border border-slate-200 p-4 dark:border-white/10">
          <summary className="cursor-pointer list-none"><div className="flex flex-col gap-3 sm:flex-row sm:items-start"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-300">{impact.source.id}</span><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold dark:bg-white/5">{kindLabel[impact.source.kind]??impact.source.kind}</span><span className={`text-[11px] font-semibold ${freshness.tone==='ok'?'text-emerald-600':'text-amber-600'}`}>{freshness.label}</span></div><p className="mt-1 font-semibold">{impact.source.title}</p><p className="mt-1 text-xs text-slate-500">{impact.source.institution} · verificado em {formatDate(impact.source.lastVerified)}</p></div><div className="flex shrink-0 flex-wrap gap-2 text-[11px]"><span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-white/5">{impact.curriculumCount} currículo</span><span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-white/5">{impact.lessonCount} aulas</span><span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-white/5">{impact.questionCount} questões</span></div></div></summary>
          <div className="mt-4 border-t border-slate-200 pt-4 dark:border-white/10"><p className="text-sm leading-6 text-slate-500">{impact.source.note}</p>{impact.features.length?<div className="mt-3"><p className="text-xs font-bold text-slate-500">Funcionalidades afetadas</p><div className="mt-2 flex flex-wrap gap-2">{impact.features.map((feature)=><span key={feature} className="rounded-full bg-violet-400/10 px-2.5 py-1 text-[11px] font-semibold text-violet-700 dark:text-violet-300">{feature}</span>)}</div></div>:null}{impact.pdCodes.length?<div className="mt-3"><p className="text-xs font-bold text-slate-500">PD Codes afetados · {impact.pdCodes.length}</p><div className="mt-2 flex flex-wrap gap-1.5">{impact.pdCodes.slice(0,18).map((pd)=><span key={pd} className="rounded bg-slate-100 px-2 py-1 font-mono text-[10px] dark:bg-white/5">{pd}</span>)}{impact.pdCodes.length>18?<span className="px-2 py-1 text-[10px] text-slate-400">+{impact.pdCodes.length-18}</span>:null}</div></div>:null}<a href={impact.source.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:underline">Abrir fonte <ExternalLink className="h-3.5 w-3.5"/></a></div>
        </details>
      })}</div>
    </Card>
  </div>
}
