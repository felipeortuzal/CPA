import { ExternalLink, Lightbulb, Radar, ShieldCheck, Target, TriangleAlert } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { v27Benchmark, v27Clusters, v27Evidence, v27Metrics, v27QuestionPatterns, v27Radar, v27Resources, v27Shortcuts, v27Traps, v27VerifiedVideos, V27_REVIEW_DATE } from '../../content/cpa/v27/intelligence'
import { courseModules } from '../../content/cpa/course/modules'

const kindLabel = {
  OFICIAL:'Oficial',
  OBSERVADO:'Observado',
  ESPECIALISTAS:'Especialistas',
  CANDIDATOS:'Candidatos',
  NOSSA_CONCLUSAO:'Nossa conclusão',
} as const

const kindClass = {
  OFICIAL:'bg-emerald-400/10 text-emerald-700 dark:text-emerald-300',
  OBSERVADO:'bg-sky-400/10 text-sky-700 dark:text-sky-300',
  ESPECIALISTAS:'bg-violet-400/10 text-violet-700 dark:text-violet-300',
  CANDIDATOS:'bg-amber-400/10 text-amber-800 dark:text-amber-200',
  NOSSA_CONCLUSAO:'bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-slate-200',
} as const

function EvidenceBadge({kind}:{kind:V27Evidence['kind']}) {
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${kindClass[kind]}`}>{kindLabel[kind]}</span>
}

export function ExamIntelligencePage() {
  const coverage = courseModules.map(module => {
    const cluster = v27Clusters.find(item => item.modules.includes(module.id))
    return {module, cluster}
  })
  return <div className="mx-auto max-w-7xl space-y-7">
    <header className="rounded-3xl border border-violet-400/25 bg-gradient-to-br from-violet-400/10 via-emerald-400/5 to-sky-400/10 p-6 sm:p-9">
      <div className="flex flex-wrap items-center gap-2"><Badge>V27 · Inteligência da prova</Badge><span className="text-xs text-slate-500">revisado em {V27_REVIEW_DATE.split('-').reverse().join('/')}</span></div>
      <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Estudar a prova, não só o edital.</h1>
      <p className="mt-3 max-w-4xl text-base leading-7 text-slate-600 dark:text-slate-300">A V27 adiciona uma camada de engenharia de prova ao conteúdo da CPA Study: benchmark de aulas públicas, padrões de questões, atalhos de raciocínio, radar de evidências e um banco de pegadinhas. A fonte de verdade continua sendo a ANBIMA; materiais externos servem para comparar cobertura e didática.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/5"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Escopo benchmark</p><p className="mt-1 text-2xl font-black">{v27Metrics.playlistScopeLessons} aulas</p><p className="mt-1 text-xs text-slate-500">escopo definido para a V27</p></div>
        <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/5"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Vídeos confirmados</p><p className="mt-1 text-2xl font-black">{v27Metrics.verifiedBenchmarkVideos}</p><p className="mt-1 text-xs text-slate-500">títulos públicos verificados</p></div>
        <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/5"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Padrões</p><p className="mt-1 text-2xl font-black">{v27Metrics.questionPatterns}</p><p className="mt-1 text-xs text-slate-500">formas de reconhecer o raciocínio</p></div>
        <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/5"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Pegadinhas</p><p className="mt-1 text-2xl font-black">{v27Metrics.traps}</p><p className="mt-1 text-xs text-slate-500">antídotos contra erros recorrentes</p></div>
      </div>
    </header>

    <section className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
      <Card className="border-violet-400/25">
        <div className="flex items-start gap-3"><Radar className="mt-0.5 h-5 w-5 text-violet-500"/><div><h2 className="text-xl font-bold">Benchmark Retorno Interno</h2><p className="mt-2 text-sm leading-7 text-slate-500">O curso do Prof. Renan Duarte é usado como referência gratuita de sequência e cobertura. Não copiamos a aula: extraímos o que vale comparar e reescrevemos com base em fontes oficiais.</p></div></div>
        <div className="mt-5 flex flex-wrap gap-3"><a href={v27Benchmark.firstVideoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-3 text-sm font-bold text-white">Abrir Aula 01 <ExternalLink className="h-4 w-4"/></a><a href={v27Benchmark.channelUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold dark:border-white/10">Abrir canal <ExternalLink className="h-4 w-4"/></a></div>
        <p className="mt-4 text-xs leading-5 text-slate-500">{v27Benchmark.scopeNote}</p>
      </Card>
      <Card>
        <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-500"/><div><h2 className="text-xl font-bold">Regra de evidência</h2><p className="mt-2 text-sm leading-7 text-slate-500">Cada descoberta é etiquetada para não misturar regra oficial, padrão observado, recomendação de especialista e relato individual.</p></div></div>
        <div className="mt-4 flex flex-wrap gap-2">{(Object.keys(kindLabel) as V27Evidence['kind'][]).map(kind=><EvidenceBadge key={kind} kind={kind}/>)}</div>
      </Card>
    </section>

    <section>
      <div className="mb-4"><h2 className="text-2xl font-black">Aulas do benchmark que conseguimos verificar publicamente</h2><p className="mt-1 text-sm text-slate-500">Os títulos abaixo foram confirmados em páginas públicas indexadas em 2026. Para as demais posições da playlist, a V27 não inventa títulos.</p></div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{v27VerifiedVideos.map(video=><a key={video.lesson} href={video.url} target="_blank" rel="noreferrer" className="group"><Card className="h-full transition group-hover:border-violet-400/50"><div className="flex items-start justify-between gap-3"><Badge>Aula {String(video.lesson).padStart(2,'0')}</Badge><ExternalLink className="h-4 w-4 text-violet-500"/></div><h3 className="mt-4 font-bold leading-6">{video.title}</h3><p className="mt-2 text-xs text-slate-500">Publicada em {video.published.split('-').reverse().join('/')}</p></Card></a>)}</div>
    </section>

    <section>
      <div className="mb-4"><h2 className="text-2xl font-black">80/20 da CPA · índice interno</h2><p className="text-sm leading-6 text-slate-500">Não é peso oficial nem estatística da ANBIMA. É um índice pedagógico interno que combina peso do macrotema, efeito cascata, potencial de aplicação e sinais de benchmark. Use para ordenar o estudo, não para ignorar o restante.</p></div>
      <div className="grid gap-3 lg:grid-cols-2">{v27Clusters.map(cluster=><Card key={cluster.id} className={cluster.priority==='NÚCLEO'?'border-emerald-400/25':''}><div className="flex items-start gap-4"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-950 text-lg font-black text-white">{cluster.index}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><Badge>{cluster.priority}</Badge><span className="text-xs text-slate-500">{cluster.pdPrefixes.join(' · ')}</span></div><h3 className="mt-2 font-bold">{cluster.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{cluster.rationale}</p><p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs leading-5 dark:bg-white/5"><strong>Como pode cair:</strong> {cluster.examPattern}</p></div></div></Card>)}</div>
    </section>

    <section>
      <div className="mb-4 flex items-end justify-between gap-4"><div><h2 className="text-2xl font-black">Mapa dos 20 módulos</h2><p className="text-sm text-slate-500">Cada módulo agora tem uma lente de prova associada.</p></div><Badge>{coverage.filter(item=>item.cluster).length}/20 mapeados</Badge></div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">{coverage.map(({module,cluster})=><div key={module.id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]"><div className="flex items-start justify-between gap-2"><span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{module.stage}</span><span className="text-[10px] font-black text-emerald-600 dark:text-emerald-300">{cluster?.priority}</span></div><p className="mt-2 text-sm font-bold">{module.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{cluster?.title ?? 'Revisão geral'}</p></div>)}</div>
    </section>

    <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <Card><div className="flex items-start gap-3"><Lightbulb className="mt-0.5 h-5 w-5 text-amber-500"/><div><h2 className="text-xl font-bold">Atalhos mentais</h2><p className="mt-1 text-sm text-slate-500">Gatilho → raciocínio → ressalva. O objetivo é chegar à lógica mais rápido, não decorar gabarito.</p></div></div><div className="mt-5 space-y-3">{v27Shortcuts.map(item=><details key={item.id} className="rounded-xl border border-slate-200 p-3 dark:border-white/10"><summary className="cursor-pointer text-sm font-bold">{item.trigger}</summary><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.reasoning}</p><p className="mt-2 text-xs leading-5 text-slate-500"><strong>Cuidado:</strong> {item.caveat}</p></details>)}</div></Card>
      <Card><div className="flex items-start gap-3"><Target className="mt-0.5 h-5 w-5 text-sky-500"/><div><h2 className="text-xl font-bold">Como matar a questão</h2><p className="mt-1 text-sm text-slate-500">Reconheça o padrão antes de olhar a alternativa.</p></div></div><div className="mt-5 space-y-3">{v27QuestionPatterns.map(item=><details key={item.id} className="rounded-xl border border-slate-200 p-3 dark:border-white/10"><summary className="cursor-pointer text-sm font-bold">{item.pattern}</summary><p className="mt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">Pista: {item.cue}</p><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.reasoning}</p><p className="mt-2 text-xs leading-5 text-slate-500"><strong>Erro comum:</strong> {item.commonError}</p></details>)}</div></Card>
    </section>

    <section>
      <div className="mb-4 flex items-end justify-between gap-4"><div><h2 className="text-2xl font-black">100 pegadinhas CPA</h2><p className="text-sm text-slate-500">Banco interno de confusões para revisão. Não são “pegadinhas da banca”; são erros conceituais que a plataforma quer treinar.</p></div><Badge>{v27Traps.length}/100</Badge></div>
      <div className="grid gap-2 md:grid-cols-2">{v27Traps.map(item=><details key={item.id} className="rounded-xl border border-slate-200 p-3 dark:border-white/10"><summary className="cursor-pointer text-sm"><span className="mr-2 font-mono text-[10px] text-slate-400">{item.id}</span><strong>{item.concept}</strong> · {item.trap}</summary><div className="mt-3 text-xs leading-5 text-slate-500"><p><strong>Por que confunde:</strong> {item.why}</p><p className="mt-1"><strong>Como não errar:</strong> {item.avoid}</p></div></details>)}</div>
    </section>

    <section>
      <div className="mb-4"><h2 className="text-2xl font-black">Radar CPA</h2><p className="text-sm text-slate-500">Descobertas da pesquisa, sempre com a natureza da evidência explícita.</p></div>
      <div className="grid gap-3 md:grid-cols-2">{v27Radar.map((item,index)=><Card key={index}><EvidenceBadge kind={item.kind}/><h3 className="mt-3 font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{item.detail}</p>{item.url?<a href={item.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline dark:text-emerald-300">{item.source ?? 'Abrir fonte'} <ExternalLink className="h-3.5 w-3.5"/></a>:null}</Card>)}</div>
    </section>

    <section>
      <div className="mb-4"><h2 className="text-2xl font-black">Materiais externos · benchmark</h2><p className="text-sm text-slate-500">Eles ajudam a comparar profundidade e prática. Nenhum texto ou questão proprietária é incorporado ao CPA Study.</p></div>
      <div className="grid gap-3 md:grid-cols-2">{v27Resources.map(resource=><a key={resource.url} href={resource.url} target="_blank" rel="noreferrer"><Card className="h-full transition hover:border-emerald-400/40"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{resource.name}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{resource.use}</p></div><ExternalLink className="h-4 w-4 shrink-0 text-emerald-500"/></div><div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold">{resource.quality!==null?<span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-white/5">Qualidade interna {resource.quality}/10</span>:null}<span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-white/5">Atualização: {resource.update}</span><span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-white/5">Profundidade: {resource.depth}</span></div></Card></a>)}</div>
    </section>

    <Card className="border-amber-400/30 bg-amber-400/5"><div className="flex items-start gap-3"><TriangleAlert className="mt-0.5 h-5 w-5 text-amber-500"/><div><h2 className="font-bold">Importante sobre a pesquisa</h2><p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">A V27 separa deliberadamente evidência oficial, benchmark externo e relato de candidato. A prova da ANBIMA não publica seu gabarito real para o público; por isso, o CPA Study não transforma comentários de terceiros em “estatística oficial”.</p></div></div></Card>
  </div>
}
