import coverageIds from './coverage-ids.json'
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
const caseProfiles=[
  'o cliente quer compreender custo e risco antes de decidir',
  'a liquidez disponível precisa ser preservada com planejamento',
  'a decisão precisa ser compatível com um objetivo de médio prazo',
  'o cliente já conhece produtos básicos, mas pede uma comparação clara',
  'o cliente prioriza transparência sobre o pior cenário possível',
  'o cliente quer saber o que muda se precisar rever a decisão antes do previsto',
  'o cliente busca simplicidade sem abrir mão de segurança',
  'o cliente está comparando alternativas que parecem semelhantes',
  'o cliente quer entender quem assume cada risco da operação',
  'o cliente valoriza previsibilidade mais do que o retorno máximo',
  'o cliente aceita alguma incerteza desde que seus limites sejam explicados',
  'a decisão também afeta o planejamento financeiro familiar',
  'o cliente pede uma explicação sem jargões',
  'o cliente quer entender custos diretos e indiretos',
  'a situação exige avaliar proteção e liquidez em conjunto',
  'o cliente quer saber quais condições podem mudar ao longo do tempo',
  'o cliente valoriza flexibilidade, mas precisa conhecer as contrapartidas',
  'o cliente quer confirmar como as regras oficiais afetam a decisão',
  'o profissional precisa verificar se a expectativa do cliente é realista',
  'o cliente compara a solução com a alternativa de manter a situação atual',
] as const

const caseConstraints=[
  'o profissional deve distinguir regra de prática comercial',
  'a recomendação precisa considerar também um cenário adverso',
  'a resposta deve deixar claros os limites da solução',
  'rentabilidade passada não pode ser tratada como promessa',
  'é necessário separar conveniência de adequação',
  'os riscos relevantes precisam ser explicitados quando aplicáveis',
  'as responsabilidades das partes precisam ficar claras',
  'prazo e consequências de uma eventual saída ou alteração devem ser considerados',
  'o nome do produto ou da regra não pode substituir a análise',
  'tributação e custos devem ser considerados quando aplicáveis',
  'as premissas relevantes do atendimento precisam ser documentadas',
  'direitos, obrigações e benefícios precisam ser distinguidos',
  'a comparação deve considerar o efeito econômico, e não apenas a forma',
  'eventuais conflitos de interesse precisam ser tratados com transparência',
  'a proteção de dados deve ser observada quando houver uso de informações pessoais',
  'a fonte oficial e a regra vigente devem prevalecer quando aplicáveis',
  'a explicação técnica precisa ser traduzida em uma decisão compreensível para o cliente',
  'a alternativa também deve fazer sentido em um cenário menos favorável',
  'o profissional deve confirmar se o cliente entendeu os principais riscos',
  'risco do produto e risco do emissor devem ser separados quando houver emissor',
  'liquidez e horizonte precisam ser considerados quando aplicáveis',
  'elegibilidade e condições regulatórias precisam ser verificadas',
  'o profissional deve explicar também o que a solução não garante',
] as const

function contextFor(title:string,example:string,type:QuestionType,seed:number,index:number){
  const names=['Marina','Rafael','Camila','Bruno','Ana','Lucas','Renata','Paulo','Carolina','Felipe']
  const name=names[seed%names.length]
  const profile=caseProfiles[index%caseProfiles.length]
  const constraint=caseConstraints[Math.floor(index/caseProfiles.length)%caseConstraints.length]
  const detail=`No caso, ${profile}; além disso, ${constraint}.`
  if(type==='dialog_tree')return`Cliente: “Estou em dúvida sobre ${title}. Como isso afeta minha decisão?”\n\n${name}, profissional CPA, precisa responder usando as informações do caso: ${example} ${detail}`
  if(type==='case')return`${name}, profissional CPA, atende uma pessoa que precisa tomar uma decisão relacionada a ${title}. ${example} ${detail} A orientação deve ser compatível com o Programa Detalhado, o perfil do cliente e os riscos envolvidos.`
  return`Durante um atendimento, ${name} precisa explicar ${title} de forma tecnicamente correta e aplicável à situação do cliente. ${example} ${detail}`
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
    // Preserve V21 IDs even if lessons are reordered or inserted.
    id:(coverageIds as Record<string,string>)[lesson.pdCode] ?? `CPA-COV-PD-${lesson.pdCode}`,
    certification:'CPA',
    origin:'generated',
    reviewStatus:'draft',
    conceptId:lesson.pdCode,
    pdCode:lesson.pdCode,
    macroTopic:macroLabels[lesson.pdCode.split('.')[0]]??'CPA',
    topic:lesson.title,
    difficulty,
    cognitiveLevel,
    questionType,
    context:contextFor(lesson.title,lesson.practicalExample,questionType,seed,index),
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
