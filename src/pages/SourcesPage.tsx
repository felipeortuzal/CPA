import { CalendarDays, ExternalLink, FileCheck2, ShieldCheck } from 'lucide-react'
import metadata from '../../content/cpa/metadata.json'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'

export function SourcesPage() {
  const source = metadata.officialSource
  return <div className="mx-auto max-w-5xl space-y-6">
    <div>
      <div className="mb-2 flex items-center gap-2"><Badge>Fontes oficiais</Badge><span className="text-sm text-slate-500">Rastreabilidade do conteúdo</span></div>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Fontes</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">A trilha usa o Programa Detalhado vigente da CPA publicado pela ANBIMA como fonte de verdade. A antiga CPA-10 e a CPA-20 não fazem parte deste currículo.</p>
    </div>

    <Card className="overflow-hidden p-0">
      <div className="border-b border-slate-200 bg-emerald-50 p-5 dark:border-white/10 dark:bg-emerald-400/[0.06] sm:p-6">
        <div className="flex items-start gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-400 text-slate-950"><FileCheck2 className="h-5 w-5" /></div><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">Programa oficial vigente</p><h2 className="mt-1 text-xl font-bold">Programa Detalhado · CPA — Certificado Profissional ANBIMA</h2></div></div>
      </div>
      <div className="grid gap-px bg-slate-200 dark:bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
        {[['Versão', metadata.programVersion], ['Revisão', '04/06/2025'], ['Vigência', '01/01/2026'], ['Última verificação', '14/09/2026']].map(([label, value]) => <div key={label} className="bg-white p-5 dark:bg-[#0b1824]"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p><p className="mt-1 font-bold">{value}</p></div>)}
      </div>
      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><CalendarDays className="h-4 w-4 text-slate-400" />Data de elaboração: 02/09/2024</div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">Abrir Programa Detalhado oficial <ExternalLink className="h-4 w-4" /></a>
          <a href={source.landingPage} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold transition hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/10">Página oficial dos programas <ExternalLink className="h-4 w-4" /></a>
        </div>
      </div>
    </Card>

    <Card><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" /><div><h2 className="font-semibold">Política de atualização</h2><p className="mt-1 text-sm leading-6 text-slate-500">Antes de qualquer alteração regulatória, a plataforma deve verificar novamente os canais oficiais da ANBIMA. Uma versão posterior do Programa Detalhado prevalece e deve gerar nova versão do conteúdo e das migrations.</p></div></div></Card>
  </div>
}
