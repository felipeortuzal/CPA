import { cpaLessons } from '../lessons'
import type { CPAQuestion, CognitiveLevel, QuestionDifficulty, QuestionType } from './types'

const macroLabels:Record<string,string>={
  '1':'Estrutura e dinâmica do Sistema Financeiro Nacional',
  '2':'Produtos do mercado financeiro',
  '3':'Relacionamento com o cliente',
  '4':'Inovação e desenvolvimento de mercado',
}

function hash(value:string){let out=2166136261;for(const char of value){out^=char.charCodeAt(0);out=Math.imul(out,16777619)}return out>>>0}
function lowerFirst(value:string){return value?value[0].toLocaleLowerCase('pt-BR')+value.slice(1):value}
function stripNegative(value:string){
  return value.replace(/^Não\s+/i,'').replace(/^Evite\s+/i,'').replace(/^Cuidado com\s+/i,'')
}
function typeFor(seed:number):QuestionType{
  const n=seed%10
  return n===0?'dialog_tree':n<=3?'multiple_choice':'case'
}
function difficultyFor(seed:number):QuestionDifficulty{
  const n=seed%10
  return n<3?'easy':n<8?'medium':'hard'
}
function cognitiveFor(seed:number):CognitiveLevel{
  const n=seed%10
  return n<2?'comprehension':n<8?'application':'analysis'
}
function contextFor(title:string,example:string,type:QuestionType,seed:number){
  const names=['Marina','Rafael','Camila','Bruno','Ana','Lucas','Renata','Paulo','Carolina','Felipe']
  const name=names[seed%names.length]
  if(type==='dialog_tree')return`Cliente: “Estou em dúvida sobre ${title}. Como isso afeta minha decisão?”\n\n${name}, profissional CPA, precisa responder usando as informações do caso: ${example}`
  if(type==='case')return`${name}, profissional CPA, atende uma pessoa que precisa tomar uma decisão relacionada a ${title}. ${example} A orientação deve ser compatível com o Programa Detalhado, o perfil do cliente e os riscos envolvidos.`
  return`Durante um atendimento, ${name} precisa explicar ${title} de forma tecnicamente correta e aplicável à situação do cliente. ${example}`
}

export const generatedCoverageQuestions:CPAQuestion[]=cpaLessons.map((lesson,index)=>{
  const seed=hash(lesson.pdCode)
  const questionType=typeFor(seed)
  const difficulty=difficultyFor(seed>>>2)
  const cognitiveLevel=cognitiveFor(seed>>>4)
  const correct=`A orientação deve ${lowerFirst(lesson.examFocus[0]).replace(/\.$/,'')}, relacionando a decisão ao contexto do cliente e às condições do produto ou regra.`
  const trap0=stripNegative(lesson.traps[0]).replace(/\.$/,'')
  const trap1=stripNegative(lesson.traps[1]??lesson.traps[0]).replace(/\.$/,'')
  const comparison=lesson.comparisons[0]
  const distractors=[
    `Basear a orientação principalmente em ${lowerFirst(trap0)}, tratando esse elemento como suficiente para decidir.`,
    `Priorizar ${lowerFirst(trap1)}, mesmo sem confirmar se as demais condições do caso continuam compatíveis.`,
    comparison
      ?`Tratar ${comparison.left} e ${comparison.right} como equivalentes para simplificar a recomendação, sem considerar a diferença de função entre eles.`
      :`Aplicar a mesma solução usada em produtos semelhantes, sem verificar as particularidades de ${lesson.title}.`,
  ]
  const correctAnswer=(seed%4) as 0|1|2|3
  const options=[...distractors] as string[]
  options.splice(correctAnswer,0,correct)
  const why=['','','',''] as [string,string,string,string]
  for(let optionIndex=0;optionIndex<4;optionIndex++){
    if(optionIndex===correctAnswer)continue
    const wrongIndex=optionIndex<correctAnswer?optionIndex:optionIndex-1
    why[optionIndex]=wrongIndex===0
      ?`A alternativa transforma uma armadilha de prova em critério principal. ${lesson.traps[0]}`
      :wrongIndex===1
        ?`A orientação é incompleta porque isola um elemento e deixa de aplicar o raciocínio exigido no PD ${lesson.pdCode}.`
        :comparison
          ?`${comparison.explanation} Por isso, tratá-los como equivalentes leva à conclusão errada.`
          :`O PD ${lesson.pdCode} exige analisar as características específicas do tema, e não importar automaticamente a regra de outro produto.`
  }
  return{
    id:`CPA-COV-${String(index+1).padStart(3,'0')}`,
    certification:'CPA',
    pdCode:lesson.pdCode,
    macroTopic:macroLabels[lesson.pdCode.split('.')[0]]??'CPA',
    topic:lesson.title,
    difficulty,
    cognitiveLevel,
    questionType,
    context:contextFor(lesson.title,lesson.practicalExample,questionType,seed),
    prompt:questionType==='dialog_tree'
      ?'Qual resposta mantém o atendimento tecnicamente correto e adequado ao contexto apresentado?'
      :'Qual orientação está mais alinhada ao conteúdo avaliado e à situação descrita?',
    options:options as [string,string,string,string],
    correctAnswer,
    explanation:`${lesson.oneSentence} ${lesson.examFocus[0]} A decisão deve ser contextualizada; a CPA busca aplicação profissional, e não mera repetição de uma definição.`,
    whyOthersAreWrong:why,
    officialSources:lesson.officialSources.map((source)=>({...source})),
    verifiedAt:lesson.lastVerified,
  }
})

if(generatedCoverageQuestions.length!==445)throw new Error(`O banco de cobertura deveria gerar 445 questões; foram geradas ${generatedCoverageQuestions.length}.`)
