import { module3 } from '../module-3'
import { buildTerminalLessons } from './build-terminal-lessons'
import type { LessonComparison, LessonFormula } from './types'

function definitionFor(code:string,title:string){
  const lower=title.toLocaleLowerCase('pt-BR')
  if(code==='3.1.1')return'Faixa etária não determina sozinha o perfil de risco: horizonte, patrimônio, renda, objetivos, conhecimento, capacidade de perda e necessidade de liquidez precisam ser avaliados em conjunto antes de orientar produtos.'
  if(lower.includes('acumulação de capital'))return'Acumulação de capital é a fase em que a pessoa prioriza formar patrimônio por meio de poupança e investimento recorrentes, normalmente com horizonte mais longo e capacidade de assumir risco compatível com seus objetivos.'
  if(lower.includes('crescimento patrimonial'))return'Crescimento patrimonial busca aumentar o valor real do patrimônio ao longo do tempo, equilibrando retorno esperado, risco, diversificação, horizonte e capacidade de suportar perdas.'
  if(lower.includes('preservação de capital'))return'Preservação de capital prioriza reduzir a probabilidade de perdas relevantes e proteger o poder de compra, normalmente aceitando menor retorno esperado em troca de maior estabilidade.'
  if(lower.includes('distribuição de renda'))return'Distribuição de renda é a fase em que o patrimônio passa a financiar despesas e objetivos por meio de fluxos periódicos, exigindo atenção a liquidez, sustentabilidade dos saques e risco de longevidade.'
  if(lower.includes('educação financeira'))return'Educação financeira organiza decisões sobre orçamento, crédito, poupança, proteção e investimentos para que a pessoa compreenda custos, riscos e consequências antes de contratar.'
  if(lower.includes('receitas e despesas'))return'Capacidade de poupança é a diferença sustentável entre receitas e despesas após considerar obrigações e imprevistos; ela define quanto pode ser direcionado a metas sem comprometer o orçamento.'
  if(lower.includes('melhor dívida'))return'A melhor dívida é a que resolve a necessidade com custo, prazo, garantia e parcela compatíveis com a capacidade de pagamento, e não simplesmente a operação com maior limite disponível.'
  if(lower.includes('empréstimo e financiamento'))return'Empréstimo geralmente entrega recursos sem destinação obrigatória; financiamento costuma estar vinculado a um bem ou finalidade específica e pode contar com garantia associada.'
  if(lower.includes('modalidades de operações de crédito'))return'Crédito pessoal, consignado e CDC atendem finalidades e perfis diferentes; a comparação adequada usa CET, prazo, garantia, parcela e valor total a pagar.'
  if(lower.includes('garantias'))return'Garantias reduzem o risco do credor ao vincular bens, recebíveis ou terceiros à obrigação, podendo melhorar condições de crédito, mas não eliminam o risco de endividamento do cliente.'
  if(lower.includes('controle de gastos')||lower.includes('orçamento'))return'Orçamento pessoal organiza receitas, despesas fixas e variáveis, dívidas e metas para tornar decisões financeiras compatíveis com a renda e evitar déficits recorrentes.'
  if(lower.includes('reserva de emergência')||lower.includes('montante necessário'))return'Reserva de emergência deve cobrir um número adequado de meses de despesas essenciais conforme estabilidade de renda, dependentes e riscos pessoais, mantendo liquidez e baixo risco.'
  if(lower.includes('ativos de alta liquidez'))return'Ativos de alta liquidez permitem conversão rápida em dinheiro com baixa perda esperada, característica central para reserva de emergência e necessidades de curto prazo.'
  if(lower.includes('liquidez, cobertura de despesas')||lower.includes('endividamento'))return'Indicadores pessoais de liquidez, cobertura de despesas e endividamento ajudam a medir capacidade de enfrentar imprevistos, sustentar o padrão de gastos e honrar obrigações.'
  if(lower.includes('ativos de uso e não uso'))return'Ativos de uso atendem necessidades pessoais, como moradia e veículo; ativos de não uso têm função predominantemente patrimonial ou de investimento e devem ser avaliados separadamente no balanço pessoal.'
  if(lower.includes('patrimônio líquido pessoal'))return'Patrimônio líquido pessoal é a diferença entre ativos e passivos de uma pessoa ou família e mostra, em uma fotografia, a riqueza líquida acumulada.'
  if(lower.includes('etapas do processo'))return'Planejamento financeiro é processo contínuo: entender objetivos, diagnosticar situação atual, construir plano, implementar ações e revisar periodicamente diante de mudanças de vida e mercado.'
  if(lower.includes('momento de vida'))return'Momento de vida e situação financeira alteram prioridades de liquidez, proteção, risco e horizonte; orientação adequada deve refletir a fase concreta do cliente.'
  if(lower.includes('metas financeiras'))return'Meta financeira eficaz combina objetivo, valor, prazo, prioridade e estratégia de financiamento, permitindo acompanhar progresso e ajustar o plano.'
  if(lower.includes('planejamento de investimentos'))return'Planejamento de investimentos conecta objetivos e prazos a uma carteira diversificada compatível com liquidez, risco, tributação e capacidade de perda.'
  if(lower.includes('fundo educacional'))return'Planejamento educacional estima valor futuro dos estudos, prazo até o desembolso e contribuições necessárias, reduzindo risco conforme a data de uso se aproxima.'
  if(lower.includes('aposentadoria'))return'Planejamento de aposentadoria estima patrimônio necessário para sustentar renda desejada, considerando tempo de acumulação, inflação, longevidade, retorno e taxa de retirada.'
  if(lower.includes('declaração de imposto'))return'A declaração de IRPF reúne bens, direitos, dívidas e rendimentos conforme regras da Receita; investimentos podem gerar informações e eventos tributáveis distintos.'
  if(lower.includes('classificação de rendimentos'))return'Classificar corretamente rendimentos como tributáveis, isentos ou sujeitos à tributação exclusiva é essencial para compreender sua apresentação na declaração e seu impacto fiscal.'
  if(lower.includes('modelo completo'))return'A comparação entre deduções legais e desconto simplificado depende da situação do contribuinte; o melhor modelo é o que resulta em menor imposto dentro das regras aplicáveis.'
  if(code.startsWith('3.2'))return`${title} integra a organização financeira do cliente: a decisão adequada deve equilibrar objetivo, horizonte, risco, liquidez, dívida, proteção e capacidade de manter o plano ao longo do tempo.`
  if(lower.includes('perfis da pessoa investidora'))return'Perfil do investidor sintetiza objetivos, situação financeira, conhecimento, experiência e tolerância/capacidade de risco para orientar a adequação de produtos e serviços.'
  if(lower.includes('adequação de produtos financeiros'))return'Adequação exige compatibilidade entre características e riscos do produto e o perfil, objetivos, horizonte, situação financeira e conhecimento do cliente.'
  if(lower.includes('avaliação de risco e retorno'))return'Risco e retorno devem ser avaliados em conjunto: maior retorno esperado costuma exigir aceitar maior incerteza, e a capacidade de suportar perdas limita a exposição adequada.'
  if(lower.includes('diversificação'))return'Diversificação distribui exposições entre ativos e fatores de risco para reduzir dependência de um único evento, sem eliminar risco de mercado ou garantir ganho.'
  if(lower.includes('profissional e qualificada'))return'Investidores profissionais e qualificados são categorias regulatórias definidas por critérios objetivos; experiência percebida ou renda isolada não substituem o enquadramento normativo.'
  if(lower.includes('nove princípios éticos'))return'Os princípios éticos orientam integridade, objetividade, competência, diligência, confidencialidade e prioridade ao interesse legítimo do cliente no exercício profissional.'
  if(lower.includes('regras gerais de conduta'))return'Regras de conduta exigem atuação íntegra, diligente, transparente e compatível com responsabilidades profissionais, evitando fraude, omissão e conflito não tratado.'
  if(lower.includes('deveres profissionais'))return'Deveres profissionais incluem competência, atualização, diligência, registro, confidencialidade e comunicação clara, sempre respeitando limites de atuação e normas aplicáveis.'
  if(code.startsWith('3.4.2'))return`${title} faz parte do processo de suitability e relacionamento: a instituição precisa conhecer o cliente, documentar informações, avaliar adequação, comunicar riscos e revisar o enquadramento ao longo do tempo.`
  if(lower.includes('escuta ativa'))return'Escuta ativa significa compreender a necessidade antes de responder, fazendo perguntas, confirmando entendimento e evitando oferecer solução padronizada sem contexto.'
  if(lower.includes('personalização'))return'Personalização do atendimento usa informações relevantes do cliente para adaptar linguagem, solução e sequência de atendimento sem violar regras de igualdade, privacidade ou suitability.'
  if(lower.includes('solução proativa'))return'Solução proativa antecipa riscos e próximos passos, busca resolver a causa do problema e mantém o cliente informado em vez de apenas reagir à reclamação.'
  if(lower.includes('educação continuada'))return'Conhecimento atualizado de produtos, normas e riscos é requisito para explicar alternativas com precisão e reconhecer quando uma demanda exige especialista ou informação adicional.'
  if(lower.includes('gerenciamento de expectativas'))return'Gerenciar expectativas significa comunicar cenários, riscos, prazos e limites reais do serviço, evitando promessas de resultado ou garantias que não existem.'
  if(lower.includes('ética e responsabilidade'))return'Atendimento ético coloca transparência, respeito, diligência e interesse legítimo do cliente acima de metas comerciais incompatíveis com sua necessidade.'
  if(code.startsWith('3.4.3.3'))return`${title} é um potencial foco de conflito de interesses; deve ser identificado, prevenido ou mitigado com transparência, controles, segregação, monitoramento e prioridade ao cliente.`
  if(code.startsWith('3.4.4'))return`${title} pode gerar perdas financeiras, sanções ou dano reputacional; a gestão exige identificação, controles preventivos, monitoramento, registro de incidentes e correção tempestiva.`
  if(code.startsWith('3.4.5'))return`${title} integra prevenção à lavagem de dinheiro e gestão do relacionamento: instituições precisam aplicar abordagem baseada em risco, cadastro atualizado, controles e diligência compatíveis com o perfil do cliente e da operação.`
  if(lower.includes('lei n° 13.709')||lower==='conceito'&&code.startsWith('3.4.6')||lower.includes('aplicabilidade')&&code.startsWith('3.4.6')||lower.includes('confidencialidade de dados'))return`${title} deve ser analisado sob a LGPD: tratamento de dados exige base legal, finalidade, necessidade, segurança e respeito aos direitos do titular.`
  if(lower.includes('sigilo bancário'))return'Sigilo bancário protege informações sobre operações e serviços financeiros, admitindo compartilhamento apenas nas hipóteses legais e regulatórias aplicáveis.'
  if(lower.includes('registro de operações'))return'Registro de operações cria trilha de auditoria para controles, investigação e cumprimento de obrigações regulatórias, devendo preservar integridade e disponibilidade das informações.'
  if(lower.includes('operações suspeitas')||lower.includes('caracterização')||lower.includes('obrigatoriedade de comunicação'))return`${title} integra prevenção à lavagem de dinheiro: sinais atípicos precisam ser analisados segundo risco e, quando cabível, comunicados às autoridades sem avisar indevidamente o cliente.`
  if(lower.includes('indisponibilidade de bens'))return'Ordens de indisponibilidade ligadas a sanções do Conselho de Segurança da ONU devem ser cumpridas conforme legislação e procedimentos aplicáveis, com bloqueio e comunicação tempestivos.'
  if(lower.includes('conheça sua parceria'))return'Conheça sua parceria aplica diligência a fornecedores, correspondentes e parceiros para reduzir risco de integridade, lavagem de dinheiro, fraude e dano reputacional.'
  if(lower.includes('manipulação do mercado'))return'Manipulação de mercado usa práticas ou operações para criar condições artificiais de preço, demanda ou liquidez e é conduta ilícita no mercado de valores mobiliários.'
  if(lower.includes('insider trading primário'))return'Insider trading primário ocorre quando pessoa que detém informação relevante ainda não divulgada em razão de sua posição negocia ou usa essa informação em benefício próprio ou de terceiros.'
  if(lower.includes('insider trading secundário'))return'Insider trading secundário ocorre quando alguém que recebeu informação privilegiada de outra fonte negocia sabendo de seu caráter relevante e não público.'
  if(lower.includes('repasse de informação privilegiada'))return'Repassar informação relevante ainda não divulgada pode permitir negociação indevida e constitui conduta ilícita quando presentes os elementos previstos na legislação.'
  if(lower.includes('exercício irregular'))return'Exercício irregular ocorre quando alguém desempenha atividade, cargo ou função regulada sem atender requisitos legais ou autorização necessária.'
  if(lower.includes('omissão imprópria'))return'Omissão imprópria ocorre quando quem tinha dever jurídico de agir para evitar resultado relevante deixa de fazê-lo e pode responder como garantidor nas hipóteses legais.'
  if(lower.includes('tipologia aberta'))return'Tipologia aberta significa que práticas ilícitas podem assumir formas novas; profissionais devem reconhecer o efeito econômico e a intenção da conduta, e não apenas nomes conhecidos.'
  if(lower.includes('money pass'))return'Money pass é prática em que operações aparentemente legítimas são coordenadas para transferir recursos entre partes, podendo mascarar favorecimento ou manipulação.'
  if(lower.includes('spoofing'))return'Spoofing envolve inserir ofertas sem intenção real de execução para criar falsa percepção de oferta ou demanda e induzir outros participantes.'
  if(lower.includes('layering'))return'Layering usa múltiplas ofertas em níveis de preço para criar aparência artificial de profundidade e pressionar outros participantes, cancelando-as antes da execução pretendida.'
  if(lower.includes('benchmark'))return'Manipulação de benchmark busca influenciar artificialmente índice ou referência de mercado para beneficiar posições, contratos ou remunerações vinculadas.'
  if(lower.includes('churning'))return'Churning é giro excessivo de operações sem justificativa econômica adequada para o cliente, frequentemente associado a geração de comissões em conflito com seu interesse.'
  if(lower.includes('front running'))return'Front running ocorre quando alguém negocia antecipadamente sabendo de ordem relevante de cliente ou instituição que pode impactar o mercado, buscando obter vantagem indevida.'
  if(lower==='conceito'&&code.startsWith('3.4.7.2.2.4'))return'Uso indevido de informação relevante não pública cria vantagem informacional incompatível com a integridade do mercado e pode caracterizar insider trading ou front running conforme a origem e a conduta.'
  return`${title} deve ser compreendido como parte do relacionamento responsável com o cliente, considerando objetivo, risco, transparência, documentação e regras aplicáveis antes de qualquer recomendação ou decisão.`
}

const parents=new Set(module3.flatMap((item)=>item.parentCode?[item.parentCode]:[]))
const terminals=module3.filter((item)=>!parents.has(item.pdCode))
const definitions=Object.fromEntries(terminals.map((unit)=>[unit.pdCode,definitionFor(unit.pdCode,unit.title.replace(/\.$/,''))]))

const comparisons=(code:string):LessonComparison[]=>{
  if(code.startsWith('3.1.3.3'))return[{left:'Necessidade de crédito',right:'Capacidade de pagamento',explanation:'Necessidade explica por que o recurso é usado; capacidade de pagamento determina se a dívida é sustentável no orçamento.'}]
  if(code.startsWith('3.3'))return[{left:'Tolerância a risco',right:'Capacidade de risco',explanation:'Tolerância é psicológica/comportamental; capacidade depende de patrimônio, renda, horizonte e impacto financeiro das perdas.'}]
  if(code.startsWith('3.4.2'))return[{left:'Conhecer o cliente',right:'Adequar o produto',explanation:'Conhecer reúne informações relevantes; adequar compara essas informações às características e riscos do produto.'}]
  if(code.startsWith('3.4.3.3'))return[{left:'Conflito identificado',right:'Conflito não tratado',explanation:'Identificar permite prevenir, mitigar e divulgar; ignorar pode distorcer a recomendação e gerar dano ao cliente e à instituição.'}]
  if(code.startsWith('3.4.5')||code.startsWith('3.4.6'))return[{left:'Cadastro/monitoramento',right:'Comunicação obrigatória',explanation:'Cadastro e monitoramento identificam sinais; comunicação ocorre quando os critérios regulatórios e a análise do caso indicam obrigação.'}]
  if(code.startsWith('3.4.7'))return[{left:'Negociação legítima',right:'Abuso de mercado',explanation:'Negociação legítima reage a informação e interesse reais; abuso cria vantagem indevida ou condição artificial de preço, demanda ou liquidez.'}]
  return[{left:'Objetivo do cliente',right:'Produto disponível',explanation:'A existência de um produto não cria necessidade; a orientação começa pelo objetivo, situação financeira e risco do cliente.'}]
}

const formulas=(code:string):LessonFormula[]=>{
  if(code==='3.1.3.2')return[{name:'Capacidade de poupança',expression:'poupança disponível = receitas líquidas − despesas − obrigações',explanation:'Use valores recorrentes e sustentáveis, não renda excepcional, para planejar metas.'}]
  if(code==='3.1.4.3')return[{name:'Patrimônio líquido pessoal',expression:'patrimônio líquido = ativos − passivos',explanation:'O valor resume a posição patrimonial na data analisada.'}]
  if(code==='3.1.4.1')return[{name:'Cobertura de despesas',expression:'meses de cobertura = ativos líquidos / despesas essenciais mensais',explanation:'Ajuda a dimensionar reserva de emergência e resiliência financeira.'}]
  if(code==='3.1.5.6')return[{name:'Capital para renda',expression:'capital aproximado = renda anual desejada / taxa sustentável de retirada',explanation:'É uma aproximação educacional; planejamento real precisa incorporar inflação, impostos, longevidade e volatilidade.'}]
  return[]
}

const blueprint={
  area:(code:string)=>code.startsWith('3.1')?'planejamento financeiro pessoal':code.startsWith('3.2')?'gestão financeira e de investimentos':code.startsWith('3.3')?'perfil e suitability':'ética, conduta, controles e integridade',
  beginner:(code:string,title:string,def:string)=>code.startsWith('3.4')
    ?`Relacionamento profissional exige técnica e conduta. ${def} Ao estudar ${title}, pergunte qual risco para o cliente ou para o mercado a regra procura evitar e qual comportamento correto é esperado.`
    :`Planejamento começa pela vida real do cliente, não pelo produto. ${def} Em ${title}, organize objetivo, prazo, orçamento, liquidez, proteção e risco antes de escolher uma solução.`,
  complete:(code:string,title:string,def:string)=>[
    `${def} Este item integra ${code.startsWith('3.1')?'planejamento financeiro':code.startsWith('3.2')?'gestão financeira':code.startsWith('3.3')?'perfil e adequação':'ética e integridade'} no Programa Detalhado CPA 1.2.`,
    code.startsWith('3.4')
      ?'A nova CPA privilegia situações de atendimento e julgamento profissional. A resposta correta costuma combinar transparência, diligência, documentação, proteção de dados, gestão de conflitos e cumprimento da regra aplicável.'
      :'A orientação responsável conecta diagnóstico financeiro, objetivos, horizonte, capacidade e tolerância a risco, liquidez, proteção e acompanhamento. Produto é consequência desse diagnóstico.',
    `Para ${title}, diferencie o que é preferência do cliente do que é requisito técnico ou regulatório; os dois precisam conviver sem transformar a recomendação em venda automática.`,
  ],
  essentials:(code:string,title:string,def:string)=>[
    def.split(/[.;]/)[0],
    `PD ${code} · ${title}`,
    code.startsWith('3.4')?'Conduta + documentação + transparência + controle':'Objetivo + situação financeira + prazo + liquidez + risco',
    code.startsWith('3.4')?'Interesse legítimo do cliente e integridade do mercado':'Produto só vem depois do diagnóstico',
  ],
  focus:(code:string,title:string)=>code.startsWith('3.4')?[
    `Escolher a conduta profissional correta em uma situação envolvendo ${title}.`,
    'Reconhecer conflito, obrigação de registro, proteção de dados ou risco de integridade.',
    'Aplicar a regra sem avisar, pressionar ou induzir o cliente de forma inadequada.',
  ]:[
    `Aplicar ${title} a uma situação real de planejamento ou suitability.`,
    'Priorizar objetivo, horizonte, orçamento, liquidez e capacidade de perda.',
    'Revisar a estratégia quando a vida financeira ou o perfil do cliente mudar.',
  ],
  practical:(code:string,title:string)=>code.startsWith('3.4')
    ?`Durante um atendimento surge uma situação envolvendo ${title}. Em vez de buscar a venda mais simples, o profissional identifica o risco, documenta fatos relevantes, aplica o procedimento correto e comunica o cliente com clareza dentro dos limites permitidos.`
    :`Um cliente chega pedindo um produto específico. Ao tratar ${title}, você primeiro levanta objetivo, prazo, renda, despesas, dívidas, reserva, experiência e capacidade de perda; só então compara alternativas compatíveis.`,
  comparisons,
  formulas,
  traps:(code:string,title:string)=>code.startsWith('3.4')?[
    `Não trate ${title} como formalidade burocrática; a regra existe para reduzir risco real de cliente, instituição ou mercado.`,
    'Meta comercial nunca substitui suitability, transparência ou dever de conduta.',
    'Registrar e comunicar internamente não autoriza expor informação confidencial ao cliente ou a terceiros sem base adequada.',
  ]:[
    `Não deduza a solução de ${title} apenas pela idade, renda ou produto que o cliente pediu.`,
    'Tolerância a risco e capacidade financeira de suportar perdas não são a mesma coisa.',
    'Planejamento é processo contínuo; uma recomendação adequada hoje pode precisar de revisão depois.',
  ],
  summary:(code:string,title:string,def:string)=>[
    `${code} · ${title}.`,
    def,
    code.startsWith('3.4')?'Pergunte: qual risco ético/regulatório existe, o que deve ser registrado e qual conduta protege cliente e mercado?':'Pergunte: qual objetivo, qual prazo, qual situação financeira e qual risco o cliente realmente consegue assumir?',
  ],
  sourceIds:(code:string)=>{
    if(code.startsWith('3.4.5'))return ['ANBIMA_PD','ANBIMA_DISTRIBUICAO','PLANALTO_AML'] as const
    if(code.startsWith('3.4.6')){
      if(code==='3.4.6.5')return ['ANBIMA_PD','PLANALTO_SIGILO'] as const
      if(['3.4.6.7','3.4.6.8','3.4.6.9','3.4.6.10','3.4.6.11'].includes(code))return ['ANBIMA_PD','PLANALTO_AML','ANBIMA_DISTRIBUICAO'] as const
      return ['ANBIMA_PD','PLANALTO_LGPD','ANPD_LGPD'] as const
    }
    if(code.startsWith('3.4.7'))return ['ANBIMA_PD','CVM_62','PLANALTO_MERCADO'] as const
    if(code.startsWith('3.4'))return ['ANBIMA_PD','ANBIMA_DISTRIBUICAO','CVM_RES30'] as const
    if(code.startsWith('3.3'))return ['ANBIMA_PD','CVM_RES30','ANBIMA_DISTRIBUICAO'] as const
    return ['ANBIMA_PD','ANBIMA_DISTRIBUICAO'] as const
  },
}

export const macro3Lessons=buildTerminalLessons(module3,'3.',definitions,blueprint)
if(macro3Lessons.length!==110)throw new Error(`Macrotema 3 deveria possuir 110 aulas; foram geradas ${macro3Lessons.length}.`)
export const macro3LessonMap=new Map(macro3Lessons.map((lesson)=>[lesson.pdCode,lesson]))
