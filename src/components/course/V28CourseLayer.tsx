import { BookOpen, ExternalLink, PlayCircle } from 'lucide-react'
import { RENAN_CPA_SEARCH_URL, studyVideosFor, v28SectionsFor } from '../../../content/cpa/course/v28-course'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

interface V28CourseLayerProps {
  moduleId: string
  printFriendly?: boolean
}

export function V28CourseLayer({ moduleId, printFriendly = false }: V28CourseLayerProps) {
  const sections = v28SectionsFor(moduleId)
  const videos = studyVideosFor(moduleId)
  const featured = videos.find((video) => video.videoId)

  return <>
    <section className={printFriendly ? 'print:hidden' : ''}>
      <Card className="border-red-300/30 bg-red-400/5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2"><Badge>Trilha em vídeo · CPA 2026</Badge><span className="text-xs font-semibold text-slate-500">Prof. Renan Duarte · Retorno Interno</span></div>
            <h2 className="mt-3 text-2xl font-black tracking-tight">Aulas para estudar o mesmo conteúdo em vídeo</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">A trilha pública CPA 2026 do Renan é usada como referência didática para ordem e explicação dos assuntos. A apostila escrita da CPA Study é autoral e foi organizada para cobrir a mesma matéria de estudo com foco na Nova CPA; quando houver regra normativa, prevalecem o Programa Detalhado e as fontes oficiais indicadas em cada tópico.</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">Para manter o HTML offline, o YouTube só é acessado quando você clicar. Nenhum vídeo é carregado automaticamente.</p>
          </div>
          <a href={RENAN_CPA_SEARCH_URL} target="_blank" rel="noreferrer"><Button variant="secondary"><PlayCircle className="h-4 w-4"/>Abrir curso do Renan</Button></a>
        </div>

        {featured && <div className="mt-6 rounded-2xl border border-red-300/30 bg-white/75 p-5 dark:bg-white/5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2"><PlayCircle className="h-5 w-5 text-red-600 dark:text-red-300"/><span className="text-xs font-black uppercase tracking-widest text-red-700 dark:text-red-300">Aula correspondente sugerida</span></div>
              <h3 className="mt-2 text-lg font-black">{featured.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{featured.note}</p>
            </div>
            <a href={featured.url} target="_blank" rel="noreferrer"><Button>Assistir no YouTube<ExternalLink className="h-4 w-4"/></Button></a>
          </div>
        </div>}

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {videos.map((video) => <a key={`${video.title}-${video.url}`} href={video.url} target="_blank" rel="noreferrer" className="group rounded-2xl border border-slate-200 bg-white/70 p-4 transition hover:border-red-300 hover:bg-red-50/70 dark:border-white/10 dark:bg-white/5 dark:hover:bg-red-400/10">
            <div className="flex items-start justify-between gap-3"><div><p className="font-bold leading-6 group-hover:text-red-700 dark:group-hover:text-red-300">{video.title}</p><p className="mt-2 text-xs leading-5 text-slate-500">{video.note}</p></div><ExternalLink className="mt-1 h-4 w-4 shrink-0 text-slate-400"/></div>
          </a>)}
        </div>
      </Card>
    </section>

    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div><div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300"><BookOpen className="h-4 w-4"/><span className="text-xs font-black uppercase tracking-[0.18em]">Apostila de prova · V29</span></div><h2 className="mt-2 text-2xl font-black tracking-tight">Explicação completa do capítulo</h2><p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">Leia esta parte como uma aula escrita: conceito, mecanismo e conexão entre os assuntos. Depois, desça para os pontos do Programa Detalhado, onde entram definições, exemplos, como pode cair, comparações, fórmulas e pegadinhas. Não é mais um resumo de quatro minutos.</p></div>
        <Badge>{sections.length} blocos de explicação</Badge>
      </div>
      <div className="space-y-5">
        {sections.map((section, index) => <Card key={section.id} className="border-emerald-300/20">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-300">Aula escrita · parte {index + 1}</p>
          <h3 className="mt-2 text-xl font-black tracking-tight">{section.title}</h3>
          <div className="mt-4 max-w-4xl space-y-4 text-base leading-8 text-slate-700 dark:text-slate-300">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </Card>)}
      </div>
    </section>
  </>
}
