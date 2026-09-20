import { module2 } from '../module-2'
import { macro2InvestmentDefinitions } from './macro-2-investments-definitions'
import { lessonSources, type LessonSourceId } from './sources'
import type { CPALesson, LessonComparison, LessonFormula, LessonQuizQuestion } from './types'

const verifiedAt='2026-09-20'

const formulas:Record<string,LessonFormula[]>={
  '2.1.1.1.11':[{name:'IR sobre o rendimento tributável',expression:'IR = rendimento tributável × alíquota aplicável',explanation:'Para pessoa física, a alíquota normalmente depende do prazo na tabela regressiva vigente. A base é o rendimento, não o principal investido.'}],
  '2.1.1.3.1':[{name:'Imposto sobre ganho líquido',expression:'IR = ganho líquido tributável × alíquota da modalidade',explanation:'A modalidade da operação importa: operação comum e day trade seguem tratamentos diferentes.'}],
  '2.1.1.3.3':[{name:'Ganho líquido após compensação',expression:'Base tributável = ganhos tributáveis − perdas compensáveis',explanation:'A compensação depende das regras da modalidade; perdas de categorias distintas não devem ser misturadas automaticamente.'}],
  '2.1.2.2.6':[{name:'Valor econômico simplificado da cota',expression:'Valor da cota = patrimônio líquido da classe / número de cotas',explanation:'Na prática, o regulamento e a metodologia da classe determinam horários, critérios e eventos de conversão.'}],
  '2.1.4.3':[{name:'Dividend yield simplificado',expression:'Yield no período = distribuição por cota / preço da cota',explanation:'É uma relação histórica do período, não uma promessa de distribuição futura.'}],
  '2.1.4.6':[{name:'Ganho na alienação de cotas',expression:'Ganho líquido = valor de venda − custo de aquisição ajustado',explanation:'A tributação efetiva depende das regras vigentes, despesas admitidas e forma de negociação.'}],
}

const comparisons:Record<string,LessonComparison[]>={
  '2.1.1.1.1.1':[{left:'NTN-B com juros semestrais',right:'NTN-B Principal',explanation:'As duas combinam IPCA e taxa real; a primeira distribui cupons e a Principal concentra os fluxos no vencimento.'}],
  '2.1.1.1.1.2':[{left:'LFT / Tesouro Selic',right:'LTN / Tesouro Prefixado',explanation:'A LFT acompanha uma taxa pós-fixada e tende a oscilar menos; a LTN trava taxa no momento da compra, mas seu preço é mais sensível às mudanças de juros.'}],
  '2.1.1.1.3.1':[{left:'CDB',right:'Debênture',explanation:'CDB é dívida bancária e pode ter FGC quando elegível; debênture é dívida corporativa e não possui garantia ordinária do FGC.'}],
  '2.1.1.1.3.3':[{left:'LCI/LCA',right:'CDB',explanation:'Todos podem ser emitidos por instituições financeiras, mas LCI/LCA têm destinação específica e tratamento tributário próprio; CDB é captação bancária geral.'}],
  '2.1.1.1.5':[{left:'CRI/CRA',right:'LCI/LCA',explanation:'CRI/CRA são valores mobiliários de securitização sem FGC; LCI/LCA são letras emitidas por instituições financeiras e podem ter FGC quando elegíveis.'}],
  '2.1.1.2.2.1.6':[{left:'IPO',right:'OPA',explanation:'IPO é oferta inicial de valores mobiliários ao mercado; OPA é oferta para aquisição de ações em situações previstas pela regulação.'}],
  '2.1.1.2.2.1.8':[{left:'Mercado primário',right:'Mercado secundário',explanation:'No primário ocorre a colocação de emissão; no secundário, investidores negociam ativos que já foram emitidos.'}],
  '2.1.1.2.2.2.6':[{left:'Grupamento',right:'Desdobramento',explanation:'Grupamento reduz quantidade e aumenta preço unitário teórico; desdobramento aumenta quantidade e reduz preço unitário teórico, sem criar valor por si só.'}],
  '2.1.1.4.2':[{left:'Valor nominal protegido',right:'Valor nominal em risco',explanation:'No protegido, o desenho preserva o nominal nas condições do certificado; no nominal em risco, o investidor pode perder parte ou todo o valor aplicado. Em ambos existe risco de crédito do emissor.'}],
  '2.1.2.2.7':[{left:'Classe aberta',right:'Classe fechada',explanation:'Classe aberta admite resgates segundo o regulamento; classe fechada normalmente não permite resgate antes do prazo, podendo ter negociação secundária.'}],
  '2.1.2.2.9':[{left:'Subscrição',right:'Integralização',explanation:'Subscrição é o compromisso de adquirir cotas; integralização é a entrega efetiva dos recursos ou ativos aceitos.'}],
  '2.1.2.2.10':[{left:'Resgate',right:'Amortização',explanation:'Resgate extingue cotas conforme as regras da classe; amortização devolve parte do valor sem necessariamente encerrar a posição.'}],
  '2.1.2.2.19.2':[{left:'Administrador',right:'Gestor',explanation:'O administrador cuida da estrutura e obrigações fiduciárias; o gestor toma decisões de investimento dentro da política e dos limites.'}],
  '2.1.2.3.6.1':[{left:'Renda fixa',right:'Multimercado',explanation:'Renda fixa concentra seu principal fator de risco em juros/índices; multimercado pode combinar vários fatores e estratégias.'}],
  '2.1.2.3.6.2':[{left:'Fundo de ações',right:'Fundo de renda fixa',explanation:'O primeiro mantém exposição predominante ao mercado acionário; o segundo tem como fator principal juros e índices de preços conforme o enquadramento.'}],
  '2.1.4.5':[{left:'FII de tijolo',right:'FII de papel',explanation:'Tijolo concentra exposição a imóveis físicos e renda imobiliária; papel concentra títulos e recebíveis ligados ao setor imobiliário.'}],
}

function sourceIdsFor(code:string):LessonSourceId[]{
  if(code.startsWith('2.1.1.1.1')||code==='2.1.1.1.2')return['ANBIMA_PD','TESOURO_DIRETO','BCB_SELIC']
  if(code.startsWith('2.1.1.1.3')||code.startsWith('2.1.1.1.8'))return['ANBIMA_PD','FGC','BCB_SFN']
  if(code==='2.1.1.1.11'||code==='2.1.1.1.12'||code.startsWith('2.1.1.3')||code.startsWith('2.1.3'))return['ANBIMA_PD','RECEITA_2026']
  if(code.startsWith('2.1.1.4'))return['ANBIMA_PD','BCB_COE','CVM_COE','B3']
  if(code.startsWith('2.1.1.2'))return['ANBIMA_PD','B3','CVM']
  if(code.startsWith('2.1.1.1'))return['ANBIMA_PD','B3','CVM']
  if(code.startsWith('2.1.2'))return['ANBIMA_PD','CVM_175','ANBIMA_DISTRIBUICAO']
  if(code.startsWith('2.1.4'))return['ANBIMA_PD','CVM_175','B3','RECEITA_2026']
  return['ANBIMA_PD','CVM_175']
}

function area(code:string){
  if(code.startsWith('2.1.1.1'))return'renda fixa'
  if(code.startsWith('2.1.1.2'))return'renda variável'
  if(code.startsWith('2.1.1.3'))return'tributação de renda variável'
  if(code.startsWith('2.1.1.4'))return'COE'
  if(code.startsWith('2.1.2'))return'fundos de investimento e Resolução CVM 175'
  if(code.startsWith('2.1.3'))return'tributação de fundos'
  return'fundos imobiliários'
}

function beginner(code:string,title:string,definition:string){
  if(code.startsWith('2.1.1.1'))return`Em renda fixa, o nome do produto importa menos do que quatro perguntas: quem deve o dinheiro, como a remuneração é calculada, quando o dinheiro volta e qual proteção existe. ${definition} Ao estudar ${title}, sempre separe risco do emissor, indexador, prazo, liquidez e tributação.`
  if(code.startsWith('2.1.1.2'))return`Renda variável significa que o retorno não vem pronto no contrato. ${definition} Para entender ${title}, pense em quem recebe o dinheiro, quais direitos o investidor possui e como preço e eventos corporativos alteram o resultado.`
  if(code.startsWith('2.1.1.3')||code.startsWith('2.1.3'))return`Tributação é uma camada do investimento, não o investimento em si. ${definition} Primeiro identifique o produto e o evento tributável; só depois aplique alíquota, isenção, compensação ou prazo.`
  if(code.startsWith('2.1.1.4'))return`Um COE empacota cenários de mercado em um único certificado. ${definition} Na prova, desenhe mentalmente o que acontece se o ativo subir, cair ou ficar parado e lembre que proteção do nominal não é proteção contra o emissor.`
  if(code.startsWith('2.1.2'))return`Um fundo é uma carteira coletiva com regras próprias. ${definition} Em vez de decorar termos soltos, pergunte quem administra, quem gere, de quem é o patrimônio, quando o cotista entra ou sai e qual risco a carteira assume.`
  return`FII é uma forma coletiva de acessar o mercado imobiliário por cotas. ${definition} Para a CPA, conecte renda, preço da cota, liquidez, vacância, crédito e tributação ao tipo concreto de carteira.`
}

function examFocus(code:string,title:string){
  if(code.startsWith('2.1.1.1'))return[
    `Escolher entre produtos de renda fixa em um caso de cliente envolvendo ${title}.`,
    'Separar indexador, risco de crédito, liquidez, FGC e tributação.',
    'Entender o efeito da venda antes do vencimento e da marcação a mercado quando aplicável.',
  ]
  if(code.startsWith('2.1.1.2'))return[
    `Aplicar ${title} a uma decisão societária, emissão ou negociação.`,
    'Distinguir direito econômico, direito político e efeito mecânico sobre preço/quantidade.',
    'Separar mercado primário, secundário e eventos corporativos.',
  ]
  if(code.startsWith('2.1.1.3')||code.startsWith('2.1.3'))return[
    `Identificar o tratamento tributário correto em uma situação envolvendo ${title}.`,
    'Separar alíquota, base, isenção, prazo e possibilidade de compensação.',
    'Calcular retorno líquido sem confundir principal com rendimento.',
  ]
  if(code.startsWith('2.1.1.4'))return[
    `Interpretar o payoff e o risco de um COE envolvendo ${title}.`,
    'Distinguir valor nominal protegido de ausência de risco.',
    'Reconhecer risco de crédito do emissor e adequação ao perfil do cliente.',
  ]
  if(code.startsWith('2.1.2'))return[
    `Resolver um caso de fundo envolvendo ${title}.`,
    'Distinguir administrador, gestor, custodiante, distribuidor e direitos do cotista.',
    'Aplicar estrutura de classes/subclasses, liquidez, taxas, limites e política de investimento.',
  ]
  return[
    `Avaliar um FII em caso prático envolvendo ${title}.`,
    'Relacionar tipo de carteira a vacância, crédito, liquidez e oscilação da cota.',
    'Separar distribuição de rendimentos de ganho na negociação das cotas.',
  ]
}

function traps(code:string,title:string){
  if(code.startsWith('2.1.1.1'))return[
    `Não conclua que ${title} é “seguro” apenas por ser renda fixa; renda fixa define a regra de remuneração, não ausência de risco.`,
    'FGC não cobre todos os produtos e possui limites por titular e instituição/conglomerado.',
    'Taxa contratada até o vencimento e preço de venda antecipada são conceitos diferentes.',
  ]
  if(code.startsWith('2.1.1.2'))return[
    `Não trate ${title} como garantia de retorno; preço e resultados permanecem incertos.`,
    'Evento que muda número de ações não necessariamente cria ou destrói valor econômico.',
    'Direito de acionista, regra de oferta e tributação são camadas diferentes.',
  ]
  if(code.startsWith('2.1.1.3')||code.startsWith('2.1.3'))return[
    `Não aplique regra tributária de outro produto a ${title}.`,
    'Alíquota e base de cálculo são coisas diferentes.',
    'Isenção específica não significa que todas as operações da mesma família sejam isentas.',
  ]
  if(code.startsWith('2.1.1.4'))return[
    'Capital protegido não elimina risco de crédito do emissor.',
    `Não avalie ${title} só pelo cenário de ganho máximo; observe também barreiras, prazo, liquidez e perda possível.`,
    'Payoff estruturado não transforma COE em fundo nem em ação.',
  ]
  if(code.startsWith('2.1.2'))return[
    `Não confunda ${title} com função de outro prestador ou outra camada da estrutura do fundo.`,
    'Classe, subclasse, fundo e cota não são sinônimos.',
    'Rentabilidade passada e valor da cota não garantem resultado futuro.',
  ]
  return[
    `Não trate ${title} como se todo FII tivesse o mesmo risco; carteira e estratégia mudam completamente o perfil.`,
    'Distribuição recorrente não é rendimento garantido.',
    'Liquidez da cota em bolsa é diferente da liquidez dos ativos mantidos pelo fundo.',
  ]
}

function defaultComparison(code:string):LessonComparison[]{
  if(code.startsWith('2.1.1.1'))return[{left:'Remuneração contratual',right:'Preço de mercado',explanation:'A primeira descreve como o título remunera se mantido conforme o contrato; o segundo muda diariamente e importa na saída antecipada.'}]
  if(code.startsWith('2.1.1.2'))return[{left:'Direito econômico',right:'Direito político',explanation:'Direitos econômicos ligam-se a resultados e patrimônio; direitos políticos ligam-se à participação nas decisões societárias.'}]
  if(code.startsWith('2.1.1.3')||code.startsWith('2.1.3'))return[{left:'Retorno bruto',right:'Retorno líquido',explanation:'Bruto ignora tributos e custos; líquido considera o que efetivamente permanece com o investidor.'}]
  if(code.startsWith('2.1.1.4'))return[{left:'Payoff do produto',right:'Risco do emissor',explanation:'O payoff descreve o resultado econômico da estrutura; o risco do emissor determina se a obrigação será honrada.'}]
  if(code.startsWith('2.1.2'))return[{left:'Política de investimento',right:'Carteira efetiva',explanation:'A política define o que pode ser feito; a carteira mostra as posições concretas assumidas dentro desses limites.'}]
  return[{left:'Renda imobiliária',right:'Preço da cota',explanation:'A renda vem dos ativos e operações do fundo; o preço da cota é formado no mercado e pode subir ou cair independentemente da distribuição corrente.'}]
}

function practical(code:string,title:string){
  if(code.startsWith('2.1.1.1'))return`Uma cliente tem R$ 50 mil, horizonte de três anos e pode precisar do dinheiro antes. Ao avaliar ${title}, você compara indexador, prazo, risco do emissor, possibilidade de venda antecipada, FGC quando aplicável e tributação, em vez de olhar apenas a maior taxa anunciada.`
  if(code.startsWith('2.1.1.2'))return`Uma companhia anuncia uma operação envolvendo ${title}. O investidor quer saber se a empresa está captando recursos, se a negociação ocorre entre investidores e quais direitos ou quantidades de ações mudam. A resposta exige separar emissão, mercado e evento societário.`
  if(code.startsWith('2.1.1.3'))return`Um investidor vende ativos com lucro e pergunta quanto realmente ficará no bolso. Em ${title}, você identifica primeiro a modalidade e a base tributável, verifica isenção ou compensação e só depois calcula o imposto.`
  if(code.startsWith('2.1.1.4'))return`Um COE oferece ganho se um índice subir, retorno limitado se ficar estável e perda em um cenário adverso. Para explicar ${title}, você desenha os cenários, destaca o limite de perda e lembra que o pagamento depende do emissor.`
  if(code.startsWith('2.1.2'))return`Um cliente compara dois fundos com nomes parecidos. Em vez de escolher pelo retorno passado, você usa ${title} para verificar estrutura da classe, política, prestadores, liquidez, taxas, riscos e público-alvo.`
  if(code.startsWith('2.1.3'))return`Dois fundos entregam a mesma rentabilidade bruta, mas possuem classificações e prazos diferentes. ${title} pode fazer o retorno líquido divergir, por isso tributação entra depois da análise do produto.`
  return`Um investidor compara um FII de escritórios e um FII de recebíveis. Ao discutir ${title}, você mostra que vacância pesa mais no primeiro, crédito e indexadores pesam mais no segundo e a liquidez da cota depende do mercado.`
}

function hash(value:string){let out=0;for(const char of value)out=(out*31+char.charCodeAt(0))>>>0;return out}
function question(correct:string,distractors:string[],seed:number,explanation:string):LessonQuizQuestion{
  const position=seed%4
  const options=[...distractors.slice(0,3)]
  options.splice(position,0,correct)
  return{question:'',options,correctIndex:position,explanation}
}
function quiz(code:string,title:string,definition:string,focus:string[],trap:string[]):LessonQuizQuestion[]{
  const family=area(code)
  const q1=question(definition,[
    `${title} elimina os principais riscos do investimento quando usado corretamente.`,
    `${title} é apenas uma expressão comercial e não altera a análise do produto.`,
    `${title} só tem relevância quando o investidor é uma instituição financeira.`,
  ],hash(code),definition)
  q1.question=`Qual alternativa descreve melhor ${title}?`

  const q2=question(focus[0],[
    `Escolher a alternativa com maior retorno nominal, sem avaliar prazo, risco ou estrutura.`,
    `Aplicar automaticamente a regra de outro produto da mesma família de ${family}.`,
    'Ignorar as condições do caso e responder apenas pela palavra-chave do enunciado.',
  ],hash(code+'application'),focus[0])
  q2.question=`Em um caso prático sobre ${title}, qual raciocínio é mais adequado?`

  const q3=question(trap[0],[
    'Assumir que produtos parecidos têm sempre o mesmo risco, liquidez e tributação.',
    'Usar rentabilidade passada como garantia de resultado futuro.',
    'Desconsiderar a fonte oficial quando a questão depende de uma regra vigente.',
  ],hash(code+'trap'),trap[0])
  q3.question=`Qual cuidado evita um erro comum ao analisar ${title}?`
  return[q1,q2,q3]
}

const parents=new Set(module2.flatMap((item)=>item.parentCode?[item.parentCode]:[]))
const units=module2.filter((item)=>item.pdCode.startsWith('2.1.')&&!parents.has(item.pdCode))

export const macro2InvestmentLessons:CPALesson[]=units.map((unit)=>{
  const definition=macro2InvestmentDefinitions[unit.pdCode]
  if(!definition)throw new Error(`Conteúdo ausente para ${unit.pdCode}`)
  const title=unit.title.replace(/.$/,'')
  const focus=examFocus(unit.pdCode,title)
  const trap=traps(unit.pdCode,title)
  const essentials=[
    title,
    definition.split(/[.;]/)[0],
    `Enquadramento no PD ${unit.pdCode}`,
    unit.pdCode.startsWith('2.1.1.1')?'Emissor + indexador + prazo + liquidez + proteção + tributação':
      unit.pdCode.startsWith('2.1.1.2')?'Direitos + emissão + negociação + evento societário':
      unit.pdCode.startsWith('2.1.2')?'Estrutura + prestadores + carteira + liquidez + taxas':
      unit.pdCode.startsWith('2.1.4')?'Carteira + renda + preço da cota + riscos + tributação':
      'Produto + evento tributável + base + alíquota + exceções',
  ]
  return{
    certification:'CPA',
    programVersion:'1.2',
    pdCode:unit.pdCode,
    parentCode:unit.parentCode,
    title,
    oneSentence:definition,
    beginnerExplanation:beginner(unit.pdCode,title,definition),
    completeExplanation:[
      `${definition} Este item pertence ao bloco de ${area(unit.pdCode)} do Programa Detalhado CPA 1.2.`,
      unit.pdCode.startsWith('2.1.1.1')?'A análise correta de renda fixa passa por emissor, indexador, prazo, fluxo, liquidez, marcação a mercado, garantias e tributação. A taxa isolada não resume o risco.':
        unit.pdCode.startsWith('2.1.1.2')?'Em renda variável, conecte direitos societários, forma de captação, eventos corporativos e negociação. Mudança de quantidade de ações não significa, sozinha, criação de valor.':
        unit.pdCode.startsWith('2.1.1.4')?'COE exige leitura de cenários. O investidor precisa entender ativo de referência, fórmula de remuneração, barreiras, perda máxima, prazo, liquidez e crédito do emissor.':
        unit.pdCode.startsWith('2.1.2')?'Na Resolução CVM 175, fundo, classe e subclasse formam camadas diferentes. Administração, gestão, custódia e distribuição também possuem responsabilidades próprias.':
        unit.pdCode.startsWith('2.1.4')?'Em FIIs, o tipo de ativo muda o risco dominante. Imóvel físico traz vacância e gestão; recebíveis trazem crédito e indexadores; a cota acrescenta risco de mercado e liquidez.':
        'Tributação deve ser aplicada ao produto e ao evento corretos. Regras de alíquota, isenção e compensação podem mudar com a legislação e são verificadas pelas fontes oficiais da aula.',
      `Na decisão de um cliente, ${title} deve ser conectado a objetivo, horizonte, liquidez, capacidade de perda e tributação líquida — exatamente o tipo de aplicação contextual que a nova CPA privilegia.`,
    ],
    essentialConcepts:essentials,
    examFocus:focus,
    practicalExample:practical(unit.pdCode,title),
    comparisons:comparisons[unit.pdCode]??defaultComparison(unit.pdCode),
    formulas:formulas[unit.pdCode]??[],
    traps:trap,
    reviewSummary:[
      `${unit.pdCode} · ${title}.`,
      definition,
      unit.pdCode.startsWith('2.1.1.1')?'Pergunte: quem emite, como remunera, quando posso sair e quem absorve o risco?':
        unit.pdCode.startsWith('2.1.2')?'Pergunte: qual estrutura, qual prestador, qual carteira, qual liquidez e qual taxa?':
        unit.pdCode.startsWith('2.1.4')?'Pergunte: de onde vem a renda, qual risco domina e como a cota é negociada?':
        'Pergunte: qual produto, qual evento, qual base e qual regra vigente?',
    ],
    flashcards:[
      {front:`O que é ${title}?`,back:definition},
      {front:`Qual ideia central memorizar no PD ${unit.pdCode}?`,back:essentials[3]},
      {front:`Como ${title} pode aparecer na CPA?`,back:focus[0]},
      {front:`Qual erro evitar em ${unit.pdCode}?`,back:trap[0]},
    ],
    miniQuiz:quiz(unit.pdCode,title,definition,focus,trap),
    officialSources:sourceIdsFor(unit.pdCode).map((id)=>lessonSources[id]),
    searchTerms:Array.from(new Set(([unit.title,definition,...essentials,...focus,...trap].join(' ').match(/[A-Za-zÀ-ÿ0-9.+%-]{2,}/g)??[]).map((term)=>term.toLowerCase()))),
    lastVerified:verifiedAt,
  }
})

if(macro2InvestmentLessons.length!==117)throw new Error(`Tema 2.1 deveria possuir 117 aulas; foram geradas ${macro2InvestmentLessons.length}.`)
export const macro2InvestmentLessonMap=new Map(macro2InvestmentLessons.map((lesson)=>[lesson.pdCode,lesson]))
