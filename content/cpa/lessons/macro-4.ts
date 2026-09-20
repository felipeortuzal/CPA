import { module4 } from '../module-4'
import { buildTerminalLessons } from './build-terminal-lessons'
import type { LessonComparison } from './types'

function definitionFor(code:string,title:string){
  const lower=title.toLocaleLowerCase('pt-BR')
  if(lower.includes('conceitos de esg'))return'ESG organiza fatores ambientais, sociais e de governança que podem afetar riscos, oportunidades, reputação, custo de capital e sustentabilidade econômica de empresas e investimentos.'
  if(lower.includes('aspectos ambientais'))return'Aspectos ambientais abrangem uso de recursos, emissões, clima, biodiversidade, resíduos e impactos físicos ou de transição que podem alterar resultados e riscos financeiros.'
  if(lower.includes('aspectos sociais'))return'Aspectos sociais incluem relações de trabalho, direitos humanos, diversidade, segurança, consumidores e impacto sobre comunidades, podendo afetar produtividade, reputação e continuidade do negócio.'
  if(lower.includes('governança corporativa'))return'Governança corporativa trata de estruturas de decisão, controles, direitos de acionistas, incentivos, transparência e prestação de contas para reduzir conflitos e melhorar supervisão.'
  if(code.startsWith('4.2')){
    if(lower.includes('relação entre esg e finanças'))return'Fatores ESG podem alterar fluxo de caixa, risco, custo de capital, valor dos ativos e acesso a financiamento, por isso precisam ser integrados à análise financeira quando materialmente relevantes.'
    if(lower.includes('impactos de esg'))return'ESG influencia seleção de ativos, análise de risco, engajamento, divulgação e desenho de produtos na indústria de investimentos, sem substituir fundamentos financeiros.'
    if(lower.includes('conceitos de investimentos esg'))return'Investimento ESG incorpora fatores ambientais, sociais e de governança ao processo de análise e decisão, podendo combinar integração, filtros, temáticos, impacto e stewardship.'
    if(lower.includes('produtos esg'))return'Produtos ESG devem alinhar nome, objetivo, estratégia, carteira e divulgação às características sustentáveis alegadas, reduzindo risco de greenwashing.'
    if(lower.includes('estratégias de investimento esg'))return'Estratégias ESG incluem integração de fatores materiais, filtros positivos/negativos, investimento temático, impacto e engajamento, cada uma com objetivo e metodologia diferentes.'
    if(lower.includes('desafios'))return'Comparabilidade de dados, métricas inconsistentes, materialidade, greenwashing e falta de histórico são desafios centrais para evolução de investimentos ESG.'
    if(lower.includes('autorregulação'))return'A autorregulação ANBIMA complementa a regulação ao estabelecer critérios de identificação, transparência e práticas para fundos e produtos que usam atributos de sustentabilidade.'
    if(lower.includes('regulação cvm 175'))return'A Resolução CVM 175 exige coerência e transparência quando classes de fundos utilizam terminologia ou objetivos associados a sustentabilidade, conforme regras e anexos aplicáveis.'
    if(lower==='cvm')return'A CVM regula e supervisiona valores mobiliários e fundos, incluindo requisitos de divulgação e integridade relacionados a produtos que incorporam aspectos de sustentabilidade.'
    if(lower.includes('pri'))return'Os Princípios para Investimento Responsável (PRI) são iniciativa internacional voluntária que incentiva integração de fatores ESG, propriedade ativa e transparência por investidores signatários.'
  }
  if(code==='4.3')return'Fundos de Investimento Sustentável e fundos que integram questões ESG devem ser identificados conforme critérios de estratégia, objetivo e divulgação, evitando que simples menção a ESG seja tratada como prova de sustentabilidade.'
  if(lower.includes('finanças tradicionais versus finanças descentralizadas'))return'Finanças tradicionais dependem de intermediários e infraestruturas centralizadas; DeFi usa protocolos em blockchain para executar serviços financeiros por código, introduzindo riscos tecnológicos, de governança e regulação.'
  if(lower.includes('conceito de blockchain'))return'Blockchain é registro distribuído em que transações são agrupadas e validadas segundo regras de consenso, permitindo histórico compartilhado e resistente a alterações sem depender de um único banco de dados central.'
  if(lower.includes('smart contracts')||lower.includes('contratos autoexecutáveis'))return`${title} refere-se a código executado em blockchain que aplica condições programadas automaticamente quando os eventos previstos são satisfeitos; automação não elimina risco jurídico, tecnológico ou de dados.`
  if(lower.includes('plataformas de smart contracts'))return'Plataformas de smart contracts fornecem infraestrutura de blockchain para criar e executar aplicações descentralizadas, com diferenças de segurança, escalabilidade, governança e custos.'
  if(lower.includes('aplicações práticas de smart contracts'))return'Smart contracts podem automatizar liquidação, garantias, seguros, empréstimos e outras rotinas quando os dados e condições necessários podem ser representados digitalmente.'
  if(lower.includes('contratos de empréstimos'))return'Smart contracts podem automatizar juros, garantias e liquidação de empréstimos digitais, mas dependem da qualidade do código, dos oráculos e da robustez das garantias.'
  if(lower.includes('exchanges descentralizadas'))return'DEXs são protocolos que permitem troca de ativos digitais por regras automatizadas, sem a mesma estrutura de intermediação de uma corretora centralizada, expondo usuários a riscos de contrato, liquidez e execução.'
  if(lower.includes('apólices automatizadas'))return'Apólices automatizadas usam código para acionar pagamentos quando condições verificáveis são cumpridas, reduzindo etapas operacionais mas criando dependência de dados externos e segurança do contrato.'
  if(lower.includes('compra e venda de propriedades'))return'Tokenização e smart contracts podem automatizar etapas econômicas de compra e venda de propriedades, mas direitos reais continuam sujeitos ao arcabouço jurídico e registral aplicável.'
  if(lower.includes('daos'))return'DAOs são organizações coordenadas por regras e votações registradas em blockchain, com governança distribuída que não elimina responsabilidades jurídicas, conflitos ou risco de concentração de poder.'
  if(lower.includes('conceito básico')&&code.startsWith('4.4.4'))return'Tokenização representa direitos ou ativos por tokens digitais em infraestrutura de registro, permitindo fracionamento e automação, sem alterar automaticamente a natureza jurídica do ativo subjacente.'
  if(lower.includes('tipos de tokens'))return'Tokens podem representar utilidade, pagamento, governança, valores mobiliários, ativos do mundo real ou outros direitos; a classificação depende da função econômica e do enquadramento jurídico.'
  if(lower.includes('benefícios da tokenização'))return'Tokenização pode ampliar fracionamento, programabilidade, rastreabilidade e eficiência operacional, desde que infraestrutura, custódia, liquidação e direitos do investidor sejam robustos.'
  if(lower.includes('risco e desafios'))return'Riscos de tokenização incluem falhas de código, custódia, fraude, interoperabilidade, liquidez, incerteza regulatória e divergência entre token e direito econômico real.'
  if(lower.includes('ativos financeiros, imóveis e artes'))return'Tokenizar ativos financeiros, imóveis ou arte exige definir que direito o token representa, como ele é custodiado e transferido e qual legislação se aplica ao ativo subjacente.'
  if(lower.startsWith('nft'))return'NFT é token não fungível com identificação individual, usado para representar itens digitais ou direitos específicos; sua singularidade técnica não garante valor, propriedade intelectual ou liquidez.'
  if(lower.includes('stable coins'))return'Stablecoins buscam manter valor estável em relação a referência como moeda fiduciária, usando reservas, colateral ou mecanismos algorítmicos; estabilidade depende do desenho e dos riscos de emissor e liquidez.'
  if(lower.includes('renda fixa digital'))return'Renda fixa digital usa infraestrutura de registro ou tokenização para representar instrumentos de dívida, mantendo análise tradicional de emissor, fluxo, garantia, prazo e crédito.'
  if(lower.includes('etf bitcoin'))return'ETF de bitcoin oferece exposição econômica ao bitcoin por fundo negociado em bolsa, transferindo ao cotista a variação do ativo dentro de estrutura regulada, com taxas e riscos próprios.'
  if(lower.includes('etf novas moedas'))return'ETFs ligados a outros criptoativos ou índices digitais oferecem exposição por veículo de mercado, mas continuam sujeitos a volatilidade, liquidez, custódia e regras de elegibilidade.'
  if(lower.includes('drex'))return'Drex é iniciativa do Banco Central para infraestrutura de ativos digitais e liquidação tokenizada no sistema financeiro, com foco em programabilidade e segurança dentro de ambiente regulado.'
  if(lower.includes('creditscore'))return'Credit score resume, por metodologia estatística, sinais associados à probabilidade de pagamento; é insumo de decisão de crédito e não garantia de adimplência ou inadimplência.'
  if(lower.includes('adimplência'))return'Dados e modelos podem melhorar precificação e prevenção de inadimplência ao segmentar risco, mas decisões precisam observar qualidade de dados, vieses, transparência e regras de crédito.'
  if(lower.includes('novo marco regulatório'))return'Open Finance e a modernização regulatória ampliam compartilhamento consentido de dados e serviços, criando novas formas de análise e competição sem retirar obrigações de segurança e proteção de dados.'
  if(lower.includes('consequências no mercado financeiro brasileiro'))return'Open Finance aumenta portabilidade de dados e competição entre instituições, favorecendo comparação e personalização, enquanto exige governança, consentimento, segurança e interoperabilidade.'
  if(lower.includes('vantagens e desvantagens')&&code.startsWith('4.5.3'))return'Portabilidade reduz fricção para mover relacionamento ou ativos, mas exige processos seguros, conciliação correta e atenção a prazos, custos e ativos elegíveis.'
  if(lower.includes('resoluções cvm 229'))return'As regras recentes de portabilidade de valores mobiliários padronizam responsabilidades e procedimentos para transferir posições entre intermediários, buscando reduzir fricção e aumentar proteção do investidor.'
  if(lower==='conceitos'&&code.startsWith('4.5.4'))return'Iniciação e compartilhamento de serviços em Open Finance permitem experiências financeiras integradas mediante consentimento, autenticação e APIs padronizadas.'
  if(lower.includes('vantagens e desvantagens')&&code.startsWith('4.5.4'))return'Open Finance pode ampliar conveniência, comparação e personalização, mas aumenta a importância de consentimento informado, segurança, governança de APIs e proteção contra fraude.'
  if(code.startsWith('4.6.1'))return`${title} em Inteligência Artificial envolve sistemas capazes de executar tarefas de previsão, classificação ou decisão a partir de dados e modelos; a aplicação financeira exige governança, explicabilidade proporcional e monitoramento de risco.`
  if(code.startsWith('4.6.2'))return`${title} em Machine Learning envolve modelos que aprendem padrões dos dados para prever ou classificar resultados; desempenho histórico não elimina risco de erro, viés ou mudança de comportamento futuro.`
  if(lower.includes('chatbots'))return'Chatbots automatizam conversas para orientar, informar ou executar tarefas, devendo reconhecer limites, proteger dados e encaminhar casos que exigem intervenção humana.'
  if(lower.includes('assistentes virtuais'))return'Assistentes virtuais combinam linguagem, automação e dados para apoiar jornadas financeiras, mas precisam de controles para privacidade, precisão, autorização e responsabilidade.'
  if(lower.includes('fintechs de hoje'))return'Fintechs usam tecnologia para oferecer ou reorganizar serviços financeiros com experiência digital, dados e automação; fintech descreve modelo de negócio e não uma categoria regulatória única.'
  if(lower.includes('sandbox regulatório'))return'Sandbox regulatório permite testar modelos inovadores sob supervisão e condições controladas do regulador, sem equivaler a autorização irrestrita ou dispensa geral de normas.'
  if(lower.includes('relação com o open finance'))return'Fintechs podem usar Open Finance para acessar dados e iniciar serviços mediante consentimento, aumentando competição e personalização dentro das regras de participação e segurança.'
  if(lower==='regulação'&&code.startsWith('4.7'))return'Fintechs precisam se enquadrar nas licenças e normas correspondentes às atividades exercidas; inovação tecnológica não afasta regulação financeira, de pagamentos, valores mobiliários ou dados.'
  if(lower.includes('desintermediação'))return'Desintermediação reduz etapas ou intermediários tradicionais na conexão entre poupadores, tomadores e usuários, mas novas plataformas continuam assumindo funções e riscos que precisam ser compreendidos.'
  if(lower==='conceitos'&&code.startsWith('4.7.6'))return'Arranjos de pagamento organizam regras e participantes para aceitar e liquidar pagamentos entre pagadores e recebedores, incluindo emissores, credenciadores e subcredenciadores.'
  if(lower==='arranjo')return'Arranjo de pagamento define regras e procedimentos que disciplinam determinado serviço de pagamento e a interação entre seus participantes.'
  if(lower==='adquirente')return'Adquirente ou credenciador habilita estabelecimentos a aceitar instrumentos de pagamento e participa do fluxo de captura, autorização e liquidação.'
  if(lower.includes('sub-adquitente')||lower.includes('sub-adquirente'))return'Subadquirente conecta estabelecimentos ao ecossistema de pagamentos por meio de credenciadores e outros participantes, oferecendo serviços de aceitação e agregação.'
  return`${title} faz parte da inovação do mercado financeiro e deve ser analisado pelo benefício econômico, riscos tecnológicos, proteção do usuário, governança e enquadramento regulatório.`
}

const parents=new Set(module4.flatMap((item)=>item.parentCode?[item.parentCode]:[]))
const terminals=module4.filter((item)=>!parents.has(item.pdCode))
const definitions=Object.fromEntries(terminals.map((unit)=>[unit.pdCode,definitionFor(unit.pdCode,unit.title.replace(/\.$/,''))]))

const comparisons=(code:string):LessonComparison[]=>{
  if(code.startsWith('4.1')||code.startsWith('4.2')||code==='4.3')return[{left:'ESG integrado',right:'Rótulo ESG',explanation:'Integração exige processo, critérios e evidência na decisão; rótulo sem coerência entre objetivo, estratégia e carteira aumenta risco de greenwashing.'}]
  if(code.startsWith('4.4.2')||code.startsWith('4.4.3'))return[{left:'Registro centralizado',right:'Blockchain',explanation:'Registro centralizado depende de uma entidade controladora; blockchain distribui o registro e usa regras de consenso, com riscos e governança próprios.'}]
  if(code.startsWith('4.4.4')||code.startsWith('4.4.5'))return[{left:'Ativo subjacente',right:'Token',explanation:'O ativo ou direito econômico existe segundo seu regime jurídico; o token é a representação digital e não substitui automaticamente a titularidade legal do subjacente.'}]
  if(code.startsWith('4.5'))return[{left:'Compartilhar dados',right:'Transferir dinheiro/ativo',explanation:'Compartilhar dados mediante consentimento não é o mesmo que transferir saldo ou posição; serviços distintos possuem autorizações e fluxos próprios.'}]
  if(code.startsWith('4.6'))return[{left:'Previsão do modelo',right:'Decisão humana/regulada',explanation:'Modelo produz sinal probabilístico; decisão final pode exigir governança, explicação, validação e responsabilidade humana.'}]
  if(code.startsWith('4.7.6'))return[{left:'Adquirente',right:'Subadquirente',explanation:'Adquirente conecta estabelecimentos diretamente ao arranjo/infraestrutura; subadquirente agrega estabelecimentos e opera apoiado em credenciadores e demais participantes.'}]
  return[{left:'Inovação',right:'Ausência de risco',explanation:'Tecnologia pode reduzir custo e fricção, mas cria ou redistribui riscos operacionais, cibernéticos, de liquidez, governança e regulação.'}]
}

const blueprint={
  area:(code:string)=>code.startsWith('4.1')||code.startsWith('4.2')||code==='4.3'?'ESG e investimentos sustentáveis':code.startsWith('4.4')?'blockchain, tokenização e ativos digitais':code.startsWith('4.5')?'Open Finance e portabilidade':code.startsWith('4.6')?'IA e machine learning':'fintechs e ecossistema de pagamentos',
  beginner:(code:string,title:string,def:string)=>`Inovação financeira precisa ser entendida pela função que resolve e pelos riscos que cria. ${def} Em ${title}, não confunda tecnologia nova com retorno garantido, ausência de regulação ou eliminação de intermediários.`,
  complete:(code:string,title:string,def:string)=>[
    `${def} Este item faz parte de inovação e desenvolvimento de mercado no Programa Detalhado CPA 1.2.`,
    code.startsWith('4.1')||code.startsWith('4.2')||code==='4.3'
      ?'Na análise ESG, materialidade, metodologia, evidências e transparência importam mais que slogans. O profissional deve distinguir característica sustentável real de comunicação promocional.'
      :code.startsWith('4.4')
        ?'Em ativos digitais, separe infraestrutura tecnológica, ativo econômico, direito jurídico, custódia, liquidez e risco de contraparte. Blockchain não transforma automaticamente um ativo em investimento adequado.'
        :code.startsWith('4.5')
          ?'Open Finance e portabilidade dependem de consentimento, autenticação, segurança, padronização e interoperabilidade. Compartilhamento de dados não autoriza uso irrestrito das informações.'
          :code.startsWith('4.6')
            ?'IA e modelos preditivos dependem de dados, validação e monitoramento. Erro de modelo, viés, drift e uso indevido de dados precisam ser tratados como riscos financeiros e operacionais.'
            :'Fintechs e pagamentos reorganizam jornadas e participantes. A análise correta identifica quem presta cada função, qual licença/regra se aplica e onde estão os riscos operacionais e de crédito.',
    `Em situação de cliente, ${title} deve ser explicado por benefício, limitação, risco, custo e regra aplicável; a prova tende a avaliar capacidade de julgamento, não fascínio pela tecnologia.`,
  ],
  essentials:(code:string,title:string,def:string)=>[
    def.split(/[.;]/)[0],
    `PD ${code} · ${title}`,
    code.startsWith('4.1')||code.startsWith('4.2')||code==='4.3'?'Materialidade + metodologia + evidência + transparência':'Função + tecnologia + risco + governança + regulação',
    'Inovação não elimina suitability, proteção de dados ou dever de transparência',
  ],
  focus:(code:string,title:string)=>[
    `Aplicar ${title} a uma situação real de produto, atendimento ou infraestrutura financeira.`,
    'Identificar benefício e risco sem tratar inovação como garantia de eficiência ou retorno.',
    'Reconhecer proteção de dados, governança e enquadramento regulatório relevantes.',
  ],
  practical:(code:string,title:string)=>`Um cliente pergunta sobre uma solução envolvendo ${title}. Você explica primeiro o problema que ela resolve, depois como funciona, quais riscos permanecem, que dados ou intermediários participam e qual proteção/regulação se aplica antes de discutir eventual uso.`,
  comparisons,
  traps:(code:string,title:string)=>[
    `Não trate ${title} como prova automática de modernidade, sustentabilidade ou adequação ao cliente.`,
    'Tecnologia pode reduzir um risco e aumentar outro; sempre identifique onde a exposição foi deslocada.',
    'Descentralização, tokenização ou IA não eliminam obrigações de transparência, segurança e proteção do investidor.',
  ],
  summary:(code:string,title:string,def:string)=>[
    `${code} · ${title}.`,
    def,
    'Pergunte: que problema resolve, como funciona, qual risco novo aparece e qual regra continua valendo?',
  ],
  sourceIds:(code:string)=>{
    if(code.startsWith('4.1')||code.startsWith('4.2')||code==='4.3')return ['ANBIMA_PD','CVM_ESG','CVM_175'] as const
    if(code.startsWith('4.4.5.6'))return ['ANBIMA_PD','BCB_DREX','BCB_SFN'] as const
    if(code.startsWith('4.4'))return ['ANBIMA_PD','CVM','BCB_SFN'] as const
    if(code.startsWith('4.5'))return ['ANBIMA_PD','BCB_OPEN_FINANCE','CVM'] as const
    if(code.startsWith('4.6'))return ['ANBIMA_PD','ANPD_LGPD','PLANALTO_LGPD'] as const
    if(code.startsWith('4.7.2'))return ['ANBIMA_PD','BCB_SFN','CVM'] as const
    if(code.startsWith('4.7.3'))return ['ANBIMA_PD','BCB_OPEN_FINANCE'] as const
    return ['ANBIMA_PD','BCB_SFN','BCB_SPB'] as const
  },
}

export const macro4Lessons=buildTerminalLessons(module4,'4.',definitions,blueprint)
if(macro4Lessons.length!==63)throw new Error(`Macrotema 4 deveria possuir 63 aulas; foram geradas ${macro4Lessons.length}.`)
export const macro4LessonMap=new Map(macro4Lessons.map((lesson)=>[lesson.pdCode,lesson]))
