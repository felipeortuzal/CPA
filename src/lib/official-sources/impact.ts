import rawManifest from '../../../content/sources.json'
import { cpaCurriculum } from '../../../content/cpa/curriculum'
import { cpaLessons } from '../../../content/cpa/lessons'
import { cpaQuestions } from '../../../content/cpa/questions'

export type OfficialSourceStatus='verified'|'review_required'
export type FingerprintMode='content'|'metadata'|'availability'

export interface OfficialSourceDefinition{
  id:string
  institution:string
  title:string
  url:string
  kind:string
  sourceType:'pdf'|'html'
  status:OfficialSourceStatus
  lastVerified:string
  knownVersion:string|null
  fingerprintMode:FingerprintMode
  certification:'CPA'
  scope:string[]
  topics:string[]
  note:string
}
export interface OfficialSourceManifest{
  schemaVersion:number
  certification:'CPA'
  generatedAt:string
  policy:{priority:string[];automaticRewrite:false;networkFailureBlocksStudy:false;changePolicy:string}
  sources:OfficialSourceDefinition[]
}
export interface OfficialSourceImpact{
  source:OfficialSourceDefinition
  curriculumCount:number
  lessonCount:number
  questionCount:number
  pdCodes:string[]
  topics:string[]
  features:string[]
  impactLevel:'critical'|'high'|'medium'|'reference'
}

export const officialSourceManifest=rawManifest as unknown as OfficialSourceManifest
export const officialSources=officialSourceManifest.sources
export const officialSourceById=new Map(officialSources.map((source)=>[source.id,source]))

const questionDesignSources=new Set(['ANBIMA_QUESTION_GUIDE','ANBIMA_QUESTION_BOOK_CPA'])
const featureImpact:Record<string,string[]>={
  ANBIMA_PD:['Trilha de Estudos','Conteúdos','Question Engine','Study Engine','Plano de Estudos'],
  ANBIMA_PROGRAMS_PAGE:['Fontes e Atualizações'],
  ANBIMA_EXAM_NOTICE:['Modo Prova','Simulados','Histórico de simulados'],
  ANBIMA_QUESTION_GUIDE:['Question Engine','Simulados'],
  ANBIMA_QUESTION_BOOK_CPA:['Question Engine','Simulados'],
}

function sortPdCodes(values:string[]){
  return [...new Set(values)].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true,sensitivity:'base'}))
}

export function buildOfficialSourceImpacts():OfficialSourceImpact[]{
  return officialSources.map((source)=>{
    const directLessons=cpaLessons.filter((lesson)=>lesson.officialSources.some((item)=>item.id===source.id))
    const directQuestions=questionDesignSources.has(source.id)
      ?cpaQuestions
      :cpaQuestions.filter((question)=>question.officialSources.some((item)=>item.id===source.id))
    const curriculumItems=source.id==='ANBIMA_PD'?cpaCurriculum:[]
    const pdCodes=sortPdCodes([
      ...curriculumItems.map((item)=>item.pdCode),
      ...directLessons.map((lesson)=>lesson.pdCode),
      ...directQuestions.map((question)=>question.pdCode),
    ])
    const topics=[...new Set([
      ...source.topics,
      ...directLessons.map((lesson)=>lesson.title),
      ...directQuestions.map((question)=>question.topic),
    ])].filter(Boolean).sort((a,b)=>a.localeCompare(b,'pt-BR'))
    const total=curriculumItems.length+directLessons.length+directQuestions.length
    const impactLevel=source.id==='ANBIMA_PD'||source.id==='ANBIMA_EXAM_NOTICE'
      ?'critical'
      :total>=20||questionDesignSources.has(source.id)
        ?'high'
        :total>0
          ?'medium'
          :'reference'
    return{
      source,
      curriculumCount:curriculumItems.length,
      lessonCount:directLessons.length,
      questionCount:directQuestions.length,
      pdCodes,
      topics,
      features:featureImpact[source.id]??[],
      impactLevel,
    }
  })
}

export const officialSourceImpacts=buildOfficialSourceImpacts()
export const officialSourceImpactById=new Map(officialSourceImpacts.map((impact)=>[impact.source.id,impact]))

export function sourceFreshness(source:OfficialSourceDefinition,now=new Date()){
  const verified=new Date(`${source.lastVerified}T12:00:00Z`)
  const days=Math.max(0,Math.floor((now.getTime()-verified.getTime())/86_400_000))
  if(source.status==='review_required')return{days,label:'Revisão necessária',tone:'warning' as const}
  if(days>90)return{days,label:'Verificação antiga',tone:'warning' as const}
  return{days,label:'Verificado no projeto',tone:'ok' as const}
}
