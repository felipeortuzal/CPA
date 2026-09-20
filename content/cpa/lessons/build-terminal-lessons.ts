import type { CurriculumUnit } from '../schema'
import { lessonSources, type LessonSourceId } from './sources'
import type { CPALesson, LessonComparison, LessonFormula, LessonQuizQuestion } from './types'

export interface LessonBlueprint {
  area:(code:string,title:string)=>string
  beginner:(code:string,title:string,definition:string)=>string
  complete:(code:string,title:string,definition:string)=>string[]
  essentials:(code:string,title:string,definition:string)=>string[]
  focus:(code:string,title:string)=>string[]
  practical:(code:string,title:string)=>string
  comparisons:(code:string,title:string)=>LessonComparison[]
  formulas?:(code:string,title:string)=>LessonFormula[]
  traps:(code:string,title:string)=>string[]
  summary:(code:string,title:string,definition:string)=>string[]
  sourceIds:(code:string,title:string)=>readonly LessonSourceId[]
}

function hash(value:string){let out=0;for(const char of value)out=(out*31+char.charCodeAt(0))>>>0;return out}
function makeQuestion(question:string,correct:string,distractors:string[],seed:number,explanation:string):LessonQuizQuestion{
  const options=[...distractors.slice(0,3)]
  const correctIndex=seed%4
  options.splice(correctIndex,0,correct)
  return{question,options,correctIndex,explanation}
}

export function buildTerminalLessons(
  module:CurriculumUnit[],
  prefix:string,
  definitions:Record<string,string>,
  blueprint:LessonBlueprint,
  verifiedAt='2026-09-20',
){
  const parents=new Set(module.flatMap((item)=>item.parentCode?[item.parentCode]:[]))
  const units=module.filter((item)=>item.pdCode.startsWith(prefix)&&!parents.has(item.pdCode))
  const lessons:CPALesson[]=units.map((unit)=>{
    const definition=definitions[unit.pdCode]
    if(!definition)throw new Error(`Conteúdo ausente para ${unit.pdCode}`)
    const title=unit.title.replace(/\.$/,'')
    const focus=blueprint.focus(unit.pdCode,title)
    const traps=blueprint.traps(unit.pdCode,title)
    const essentials=blueprint.essentials(unit.pdCode,title,definition)
    const summary=blueprint.summary(unit.pdCode,title,definition)
    const quiz=[
      makeQuestion(
        `Qual alternativa descreve melhor ${title}?`,
        definition,
        [
          `${title} elimina a necessidade de analisar risco, prazo e condições do cliente.`,
          `${title} é apenas um nome comercial e não possui aplicação prática no tema estudado.`,
          `${title} só pode ser analisado pela rentabilidade passada, sem considerar regras vigentes.`,
        ],
        hash(unit.pdCode),
        definition,
      ),
      makeQuestion(
        `Em uma situação prática envolvendo ${title}, qual conduta é mais adequada?`,
        focus[0],
        [
          'Escolher a alternativa de maior retorno aparente sem verificar objetivo, risco ou prazo.',
          'Aplicar a regra de outro produto ou situação apenas porque os nomes parecem semelhantes.',
          'Ignorar informações do cliente e responder somente pela palavra-chave do enunciado.',
        ],
        hash(unit.pdCode+'application'),
        focus[0],
      ),
      makeQuestion(
        `Qual cuidado evita um erro comum sobre ${title}?`,
        traps[0],
        [
          'Tratar conceitos próximos como sinônimos, mesmo quando possuem funções diferentes.',
          'Usar rentabilidade passada como promessa de resultado futuro.',
          'Desconsiderar a fonte oficial mesmo quando a questão depende de regra vigente.',
        ],
        hash(unit.pdCode+'trap'),
        traps[0],
      ),
    ]
    return{
      certification:'CPA',
      programVersion:'1.2',
      pdCode:unit.pdCode,
      parentCode:unit.parentCode,
      title,
      oneSentence:definition,
      beginnerExplanation:blueprint.beginner(unit.pdCode,title,definition),
      completeExplanation:blueprint.complete(unit.pdCode,title,definition),
      essentialConcepts:essentials,
      examFocus:focus,
      practicalExample:blueprint.practical(unit.pdCode,title),
      comparisons:blueprint.comparisons(unit.pdCode,title),
      formulas:blueprint.formulas?.(unit.pdCode,title)??[],
      traps,
      reviewSummary:summary,
      flashcards:[
        {front:`O que é ${title}?`,back:definition},
        {front:`Qual ideia central memorizar no PD ${unit.pdCode}?`,back:essentials[0]??definition},
        {front:`Como ${title} pode aparecer na CPA?`,back:focus[0]},
        {front:`Qual erro evitar em ${unit.pdCode}?`,back:traps[0]},
      ],
      miniQuiz:quiz,
      officialSources:blueprint.sourceIds(unit.pdCode,title).map((id)=>lessonSources[id]),
      searchTerms:Array.from(new Set(([unit.title,definition,...essentials,...focus,...traps,...summary].join(' ').match(/[A-Za-zÀ-ÿ0-9.+%-]{2,}/g)??[]).map((term)=>term.toLowerCase()))),
      lastVerified:verifiedAt,
    }
  })
  return lessons
}
