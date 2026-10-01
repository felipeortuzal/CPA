import type { ReadingSection } from './readings'

export const masteryReadingSections: Record<string, ReadingSection[]> = {
  'sistema-financeiro': [
    {id:'mastery-mapa-mental',title:'6. Mapa mental para memorizar o SFN',paragraphs:[
      'Monte mentalmente quatro caixas: normatização, supervisão, operação e infraestrutura. Depois coloque as entidades e participantes nas caixas de acordo com a função exercida. O objetivo não é decorar uma tabela isolada, mas conseguir reconstruí-la quando uma questão apresentar um caso novo. Se o enunciado disser “define diretrizes”, pense em órgão normativo; se disser “fiscaliza”, pense em supervisor; se disser “intermedeia recursos”, pense em instituição operacional.',
      'Esse método também ajuda quando a questão troca a ordem das informações. Uma alternativa pode apresentar uma instituição correta, mas atribuir a ela a função errada. Em vez de reconhecer apenas o nome, confronte nome e competência. É exatamente esse tipo de detalhe que transforma uma questão aparentemente simples em uma questão de aplicação.'
    ]},
    {id:'mastery-sfn-revisao',title:'7. Checklist de domínio',paragraphs:[
      'Antes de sair deste módulo, você deve conseguir explicar com suas palavras por que existe intermediação financeira, diferenciar credor de tomador, separar órgão normativo de supervisor, identificar os principais mercados e explicar por que o produto comprado no banco não é necessariamente emitido pelo banco. Também deve saber que mecanismos de proteção possuem regras e limites próprios.',
      'Se você consegue fazer isso sem consultar a tela, passe para o simulado. Se não consegue, volte somente ao bloco em que travou. O objetivo da leitura completa não é decorar um texto longo: é construir um mapa que permita interpretar questões novas.'
    ]}
  ],
  'economia': [
    {id:'mastery-causalidade-economia',title:'6. Cadeias causais que resolvem questões',paragraphs:[
      'Quando uma questão disser que determinada variável mudou, não pule direto para a alternativa. Construa uma cadeia: variável inicial → mecanismo → variável intermediária → possível efeito. Exemplo: política monetária mais restritiva → condições financeiras mais apertadas → crédito e demanda podem desacelerar → pressões inflacionárias podem diminuir com defasagem. A cadeia deixa explícitas as hipóteses que a alternativa pode estar escondendo.',
      'O mesmo vale para câmbio e fiscal. Uma depreciação cambial pode elevar custos de importados e alterar competitividade de exportadores; uma expansão fiscal pode afetar demanda e expectativas. O resultado final depende do contexto. A prova valoriza a capacidade de interpretar o mecanismo, e não frases absolutas.'
    ]},
    {id:'mastery-indicadores',title:'7. Checklist de domínio',paragraphs:[
      'Você deve conseguir dizer o que cada indicador mede, diferenciar fluxo de estoque quando aplicável, explicar por que inflação percebida pode ser diferente da inflação do índice e conectar juros, crédito, atividade, câmbio e expectativas. Também deve saber que política monetária e fiscal são diferentes e podem interagir.',
      'Se uma questão apresentar um gráfico, leia primeiro os eixos, unidades, período e direção da mudança. Depois procure o mecanismo econômico. Nunca comece pelas alternativas antes de entender o que os dados mostram.'
    ]}
  ],
  'matematica-financeira': [
    {id:'mastery-linha-do-tempo',title:'6. A linha do tempo resolve metade da matemática',paragraphs:[
      'Desenhar uma linha do tempo é uma das técnicas mais úteis. Coloque o valor presente em t=0, os pagamentos e recebimentos nos períodos corretos e a taxa correspondente. Depois pergunte qual data deve ser usada para comparar os fluxos. Esse procedimento reduz erros em valor presente, valor futuro, VPL, payback e amortização.',
      'Também torna evidente quando uma taxa precisa ser convertida. Se os fluxos são mensais, uma taxa anual precisa ser tratada de acordo com a convenção de capitalização. A questão pode fornecer uma taxa “ao ano” e pagamentos mensais justamente para testar essa compatibilidade temporal.'
    ]},
    {id:'mastery-calculos',title:'7. Checklist de domínio',paragraphs:[
      'Você deve conseguir diferenciar simples de composto, converter taxas equivalentes em regime composto, calcular valor presente e futuro, interpretar VPL e TIR, explicar SAC e Price, calcular desconto comercial e identificar a limitação do payback simples.',
      'Mais importante: você deve conseguir explicar o resultado. Se uma conta produz valor presente maior, isso significa algo sobre a taxa de desconto; se a taxa de mercado sobe e o preço de um prefixado cai, isso é marcação a mercado. A prova pode perguntar a interpretação mesmo sem exigir cálculo.'
    ]}
  ],
  'infraestrutura': [
    {id:'mastery-ciclo-operacao',title:'6. O ciclo completo de uma operação',paragraphs:[
      'Uma forma de consolidar infraestrutura é imaginar uma ordem do começo ao fim. O cliente envia uma ordem ou inicia um pagamento; o sistema identifica participantes; a operação é registrada e/ou compensada; mecanismos de gerenciamento de risco podem ser acionados; finalmente ocorre a liquidação. Cada etapa possui responsabilidades próprias.',
      'Esse ciclo explica por que infraestrutura é importante para estabilidade. Se os processos fossem feitos sem padronização, controle de risco e registros confiáveis, a chance de falhas e disputas seria maior. A questão pode omitir nomes de instituições e descrever apenas uma função: reconheça a função primeiro.'
    ]},
    {id:'mastery-infra',title:'7. Checklist de domínio',paragraphs:[
      'Você deve conseguir diferenciar SPB, SPI, Selic e infraestruturas da B3; explicar em termos simples o papel de contraparte central, depositário central e entidade registradora; diferenciar risco sistêmico de risco individual; e entender que supervisão não é a mesma coisa que infraestrutura.',
      'Se você ainda mistura “quem fiscaliza” com “quem liquida”, revise este módulo antes do simulado. Esse é um erro de classificação, e a melhor correção é voltar ao papel de cada participante.'
    ]}
  ],
  'renda-fixa': [
    {id:'mastery-rf-precificacao',title:'6. O raciocínio de precificação em uma frase',paragraphs:[
      'Em termos simplificados, o preço de um título é o valor presente dos fluxos futuros descontados pela taxa exigida pelo mercado. Essa ideia explica a relação inversa entre taxa e preço de títulos prefixados. Se a taxa de desconto usada pelo mercado aumenta, o valor presente dos mesmos fluxos diminui.',
      'O prazo importa porque fluxos mais distantes sofrem maior efeito de mudanças na taxa. Por isso, dois títulos com a mesma taxa contratada podem reagir de maneira diferente a um choque de mercado. Essa é uma boa ponte entre matemática financeira e renda fixa.'
    ]},
    {id:'mastery-rf',title:'7. Checklist de domínio',paragraphs:[
      'Você deve conseguir explicar prefixado, pós-fixado e híbrido; diferenciar retorno contratado de preço de mercado; explicar marcação a mercado; identificar risco de crédito, liquidez e mercado; e verificar se uma eventual proteção se aplica ao instrumento.',
      'Antes do simulado, tente responder sem olhar: “se a taxa subir, o que acontece com um prefixado já comprado?”, “se o emissor entrar em dificuldade, qual risco estou enfrentando?” e “se preciso vender antes do vencimento, qual risco adicional aparece?”. Se você responder rapidamente, o núcleo do tema está consolidado.'
    ]}
  ],
  'renda-variavel': [
    {id:'mastery-rv-cenarios',title:'6. Monte cenários antes de responder',paragraphs:[
      'Em ações e estruturas como COE, a melhor técnica é montar cenários. O que acontece se o ativo subir, cair ou ficar próximo do nível inicial? Quem recebe o fluxo? Há limite de ganho? Existe perda de principal? O investimento pode ser vendido antes? Esse procedimento transforma uma descrição comercial em um mapa econômico.',
      'Nos derivativos, acrescente a pergunta “qual risco está sendo transferido?”. Se uma empresa possui exposição cambial, o hedge deve ser analisado em relação a essa exposição. Se não existe risco a proteger, uma estratégia derivativa pode aumentar exposição em vez de reduzi-la.'
    ]},
    {id:'mastery-rv',title:'7. Checklist de domínio',paragraphs:[
      'Você deve diferenciar acionista e credor, mercado primário e secundário, risco de mercado e risco de crédito, hedge e especulação, e entender a lógica de estruturas condicionais de COE. Também deve saber que liquidez e preço de mercado podem variar independentemente de a empresa continuar operacional.',
      'Se uma alternativa promete “rentabilidade garantida” sem explicar a estrutura, procure a condição escondida. Produtos com cenários têm regras específicas; o nome comercial não substitui a leitura da estrutura.'
    ]}
  ],
  'fundos': [
    {id:'mastery-fundos-documentos',title:'6. Quais documentos respondem às dúvidas',paragraphs:[
      'Quando o cliente pergunta “onde está escrito?”, a resposta é consultar os documentos oficiais do fundo. Política de investimento, regulamento, lâmina e informações periódicas ajudam a entender estratégia, riscos, custos e condições. O material de marketing pode resumir o produto, mas não substitui a documentação aplicável.',
      'Essa mentalidade é útil para a prova. Se uma alternativa fizer uma afirmação absoluta sobre resgate, taxa ou composição da carteira, pergunte qual documento sustentaria a afirmação. Fundos são estruturas contratuais e regulatórias; detalhes importam.'
    ]},
    {id:'mastery-fundos',title:'7. Checklist de domínio',paragraphs:[
      'Você deve explicar cota, patrimônio, gestor, administrador, custodiante e distribuidor; interpretar taxas; diferenciar risco de crédito, mercado e liquidez; e entender por que rentabilidade passada não garante resultado futuro. Também deve saber analisar o fundo pelo objetivo do cliente.',
      'O melhor teste é explicar um fundo para alguém que nunca investiu: “você compra uma participação em uma carteira administrada conforme regras; o valor da cota oscila; custos são descontados; e você precisa verificar prazo, liquidez e riscos”. Se conseguir, avance.'
    ]}
  ],
  'fundos-imobiliarios': [
    {id:'mastery-fii-fluxo',title:'6. Leia o FII pelo fluxo econômico',paragraphs:[
      'Para um FII, pergunte de onde vem o dinheiro que chega ao fundo. Em tijolo, pode vir de aluguéis e operações com imóveis; em recebíveis, de juros, amortizações e pagamentos dos devedores. Depois, pergunte quais eventos podem interromper esse fluxo. Vacância, inadimplência, renegociação, queda de preços e custos podem afetar o resultado.',
      'Esse mapa ajuda a interpretar relatórios e questões. Distribuição elevada pode ser sustentável, extraordinária ou resultado de uma carteira com risco maior. O número isolado não explica a qualidade do fluxo.'
    ]},
    {id:'mastery-fii',title:'7. Checklist de domínio',paragraphs:[
      'Você deve diferenciar FII de propriedade direta, tijolo de recebíveis, renda distribuída de retorno total e risco de crédito de risco de mercado. Também deve saber que liquidez da cota e liquidez dos imóveis são coisas diferentes.',
      'Antes do simulado, tente explicar por que um FII pode distribuir renda e ainda assim cair de preço. Se a resposta vier naturalmente, você entendeu o ponto central.'
    ]}
  ],
  'previdencia': [
    {id:'mastery-prev-decisoes',title:'6. Uma árvore de decisão para previdência',paragraphs:[
      'Comece pelo objetivo: acumulação de longo prazo, sucessão, renda futura ou outro propósito. Depois analise situação tributária, forma de contribuição, horizonte, liquidez, regime tributário e características do plano. Só então compare PGBL e VGBL. Essa ordem evita escolher o produto antes de entender o problema.',
      'Em seguida, pergunte se o cliente pretende resgatar ou receber benefício e em qual horizonte. Portabilidade pode preservar a estrutura de previdência, mas precisa ser comparada com custos, regras e características do novo plano. A decisão é multidimensional.'
    ]},
    {id:'mastery-prev',title:'7. Checklist de domínio',paragraphs:[
      'Você deve conseguir explicar a lógica de PGBL e VGBL, diferenciar regimes tributários, distinguir portabilidade de resgate, identificar fase de acumulação e recebimento e relacionar previdência a planejamento de longo prazo.',
      'Como regras tributárias podem mudar, trate tabelas de alíquotas como informação que precisa de verificação na fonte vigente. O conceito permanece; a tabela pode ser atualizada.'
    ]}
  ],
  'credito': [
    {id:'mastery-credito-analise',title:'6. A sequência mental da análise de crédito',paragraphs:[
      'Use a sequência: finalidade → capacidade de pagamento → custo → garantias → risco → condições. A finalidade ajuda a entender o fluxo econômico; capacidade indica se a parcela cabe; custo mostra quanto a operação realmente pesa; garantias mitigam exposição; risco resume a incerteza; condições determinam prazo e estrutura.',
      'Essa sequência evita dois erros. O primeiro é aprovar porque existe garantia. O segundo é aprovar porque a parcela “parece pequena” sem considerar outras dívidas. Crédito é análise conjunta de variáveis.'
    ]},
    {id:'mastery-credito',title:'7. Checklist de domínio',paragraphs:[
      'Você deve saber explicar CET, diferença entre taxa nominal e custo total, capacidade de pagamento, risco de crédito, garantias e consequências da inadimplência. Também deve saber que garantia não elimina risco.',
      'Se uma questão fornecer duas propostas, não escolha pela menor taxa sem comparar o custo efetivo. Se fornecer um cliente com renda alta e muitas dívidas, não escolha pela renda isolada. O contexto determina a resposta.'
    ]}
  ],
  'servicos-bancarios': [
    {id:'mastery-banco-fluxo',title:'6. Desenhe o fluxo do pagamento',paragraphs:[
      'Em pagamentos, identifique pagador, recebedor, instrumento, instituição que emite ou inicia, participantes que aceitam e infraestrutura de liquidação. Esse mapa é suficiente para diferenciar grande parte dos termos do tema. Em cartões, por exemplo, emissor e credenciador exercem funções diferentes.',
      'Em Pix, o fluxo é diferente do cartão e ocorre dentro de infraestrutura própria. A prova pode colocar os dois no mesmo caso para testar se você reconhece as diferenças.'
    ]},
    {id:'mastery-banco',title:'7. Checklist de domínio',paragraphs:[
      'Você deve conseguir explicar conta, cartão, Pix, crédito rotativo, arranjos de pagamento, segurança e proteção de dados. Também deve identificar quando uma situação é comercial e quando é de prevenção a fraude.',
      'Se o cliente relata uma fraude, não comece oferecendo outro produto. Primeiro resolva o problema e siga o procedimento de segurança. Esse raciocínio de prioridade é muito útil no novo modelo contextualizado.'
    ]}
  ],
  'seguros': [
    {id:'mastery-seguro-leitura',title:'6. Leia a apólice como um contrato',paragraphs:[
      'Uma leitura correta começa pelo risco coberto, passa pelas condições de acionamento e termina nas limitações. Identifique cobertura, exclusões, franquia, capital segurado, prêmio, vigência e procedimentos de sinistro quando esses elementos estiverem no caso.',
      'A questão pode usar uma situação emocional para induzir uma resposta intuitiva. Volte ao contrato. Seguro é um mecanismo de proteção com condições, não uma promessa aberta de ressarcimento.'
    ]},
    {id:'mastery-seguro',title:'7. Checklist de domínio',paragraphs:[
      'Você deve diferenciar prêmio e indenização, cobertura e exclusão, franquia e coparticipação quando aplicável, seguro e capitalização, além de compreender o processo básico de sinistro.',
      'Se uma alternativa disser que “todo dano está coberto porque existe seguro”, desconfie. A resposta correta deve considerar o contrato.'
    ]}
  ],
  'planejamento': [
    {id:'mastery-planejamento',title:'6. Do objetivo para a carteira',paragraphs:[
      'O planejamento pode ser pensado como uma sequência: mapear situação atual → definir objetivos → estabelecer prazo → estimar necessidade → avaliar capacidade de poupança → escolher instrumentos → acompanhar. Pular a etapa de objetivo costuma produzir carteiras desconectadas da vida financeira.',
      'Esse processo também permite explicar por que dois clientes com patrimônio semelhante podem receber orientações diferentes. Objetivos e restrições podem ser completamente diferentes.'
    ]},
    {id:'mastery-planejamento-check',title:'7. Checklist de domínio',paragraphs:[
      'Você deve conseguir diferenciar renda de patrimônio, despesa de objetivo, reserva de emergência de investimento de longo prazo e dívida de investimento. Também deve conseguir explicar por que liquidez é uma característica do planejamento.',
      'Se o cliente tem três objetivos, não procure um único produto. Separe os objetivos e monte a lógica de cada um. Esse é o comportamento que a prova contextualizada tende a exigir.'
    ]}
  ],

  'carteiras': [
    {id:'mastery-carteira-decisao',title:'6. Como sair do produto e voltar para a carteira',paragraphs:[
      'Uma carteira não deve ser construída como uma lista de produtos favoritos. Primeiro se define a política de alocação e as restrições; depois se escolhem instrumentos que implementem essa política. Isso reduz a chance de acumular ativos com o mesmo risco sem perceber.',
      'Em uma questão, se o cliente muda de objetivo, a carteira pode precisar mudar mesmo que os produtos individualmente continuem bons. A adequação é dinâmica.'
    ]},
    {id:'mastery-carteira-check',title:'7. Checklist de domínio',paragraphs:[
      'Você deve explicar alocação, diversificação, correlação, risco e retorno esperado e rebalanceamento. Também deve reconhecer que retorno histórico não é garantia e que concentração pode aumentar risco.',
      'A pergunta-chave é: “o que aconteceria com a carteira se este fator específico mudasse?”. Essa pergunta revela a verdadeira exposição.'
    ]}
  ],
  'perfil': [
    {id:'mastery-perfil-perguntas',title:'6. Perguntas que revelam adequação',paragraphs:[
      'Quando o cliente diz “quero segurança”, transforme a frase em perguntas objetivas: para quando é o dinheiro? Quanto pode perder? Precisa de liquidez? Possui reserva? Tem experiência? Qual é o objetivo? Essas perguntas convertem preferências vagas em restrições de investimento.',
      'O profissional não precisa adivinhar o perfil. Ele coleta informações, registra e utiliza as regras da instituição para avaliar adequação.'
    ]},
    {id:'mastery-perfil-check',title:'7. Checklist de domínio',paragraphs:[
      'Você deve diferenciar capacidade de disposição a assumir risco, reconhecer o papel do horizonte e entender por que o produto também precisa ser analisado. Perfil não é autorização para ignorar liquidez, custo ou complexidade.',
      'Se uma alternativa recomenda produto apenas porque o cliente se declarou agressivo, procure uma análise incompleta. O perfil é multidimensional.'
    ]}
  ],
  'atendimento-etica': [
    {id:'mastery-etica-conflitos',title:'6. Como reconhecer conflito de interesse em uma questão',paragraphs:[
      'Procure incentivos. Quem ganha se o cliente escolher o produto? Existe remuneração diferenciada? O profissional omitiu uma característica importante? A instituição possui procedimento de tratamento do conflito? Essas perguntas ajudam a identificar o ponto ético do caso.',
      'Nem toda remuneração é ilícita. O problema é a falta de transparência, a inadequação ou a priorização indevida do interesse do distribuidor. A análise precisa seguir as regras aplicáveis.'
    ]},
    {id:'mastery-etica-check',title:'7. Checklist de domínio',paragraphs:[
      'Você deve reconhecer KYC, PLD/FT, sigilo, proteção de dados, conflitos de interesse, boa-fé, transparência e diligência. Também deve saber que suspeita não é prova de crime e que procedimentos internos precisam ser respeitados.',
      'Em caso de dúvida, escolha a alternativa que preserva informação correta, segurança, adequação e encaminhamento formal. Evite improvisos.'
    ]}
  ],
  'sustentabilidade': [
    {id:'mastery-esg-materialidade',title:'6. Materialidade: o elo entre ESG e valor econômico',paragraphs:[
      'Um fator ESG é material quando pode influenciar de forma relevante os resultados, riscos ou oportunidades de uma empresa ou investimento, conforme a abordagem utilizada. Materialidade evita que o profissional trate qualquer indicador como igualmente importante.',
      'Uma seca prolongada pode ser material para uma empresa agrícola e menos relevante para outra atividade. Uma falha de governança pode afetar qualquer setor. A análise deve considerar o modelo de negócio e a exposição específica.'
    ]},
    {id:'mastery-esg-check',title:'7. Checklist de domínio',paragraphs:[
      'Você deve diferenciar ESG de sustentabilidade como slogan, integração de exclusão, investimento temático de impacto e risco físico de transição. Também deve reconhecer greenwashing como problema de coerência entre alegação e evidência.',
      'A pergunta-chave é: “qual evidência sustenta a característica sustentável alegada?”. Se não houver método, objetivo ou transparência, a conclusão precisa ser cautelosa.'
    ]}
  ],
  'ativos-digitais': [
    {id:'mastery-digital-risco',title:'6. O risco migra; não desaparece',paragraphs:[
      'A tecnologia pode remover um intermediário e criar dependência de código, protocolo ou governança. Pode facilitar transferência e aumentar exposição operacional. Pode ampliar acesso e aumentar risco de fraude. Esse princípio — risco migra — é uma das melhores chaves para questões de inovação.',
      'Quando uma alternativa afirma que blockchain elimina risco de fraude ou que smart contract garante execução sem falhas, procure a generalização. Código e infraestrutura também precisam de controles.'
    ]},
    {id:'mastery-digital-check',title:'7. Checklist de domínio',paragraphs:[
      'Você deve explicar blockchain, tokenização, smart contracts, oráculos, DeFi, custódia e stablecoins. Também deve separar tecnologia de direito econômico e risco financeiro.',
      'Se você consegue responder “o que é?”, “para que serve?”, “qual risco novo aparece?” e “quem controla ou responde?”, está pronto para as questões contextualizadas.'
    ]}
  ],
  'open-finance': [
    {id:'mastery-open-journey',title:'6. A jornada do consentimento',paragraphs:[
      'Pense na jornada como autorização → autenticação → compartilhamento → uso para a finalidade autorizada → possibilidade de controle/revogação conforme as regras. Cada etapa existe para proteger o cliente e permitir rastreabilidade.',
      'Isso ajuda a identificar golpes. Se alguém pede senha ou código fora do fluxo oficial para “ativar Open Finance”, o comportamento é incompatível com uma jornada segura. A conveniência não justifica ignorar autenticação.'
    ]},
    {id:'mastery-open-check',title:'7. Checklist de domínio',paragraphs:[
      'Você deve diferenciar Open Finance de compartilhamento público, consentimento de entrega de senha, dados de transferência de recursos e compartilhamento de portabilidade. Também deve entender que benefício comercial não é garantido.',
      'Na prova, procure o verbo do caso: compartilhar, revogar, portar, iniciar ou pagar. Cada verbo indica uma operação diferente.'
    ]}
  ],
  'tecnologia': [
    {id:'mastery-ia-governanca',title:'6. Governança antes de automação',paragraphs:[
      'Quanto maior o impacto de uma decisão, maior a necessidade de controles. Uma IA que sugere respostas simples pode ter risco diferente de um modelo que influencia concessão de crédito ou classificação de clientes. A governança deve acompanhar o impacto.',
      'Controles podem incluir validação, revisão humana, monitoramento, trilhas de auditoria, segurança de dados e critérios para interromper o modelo. “Automatizar” não é sinônimo de “deixar sem supervisão”.'
    ]},
    {id:'mastery-tecnologia-check',title:'7. Checklist de domínio',paragraphs:[
      'Você deve diferenciar IA de machine learning, entender riscos de dados e viés, saber que fintech não é licença e explicar o propósito de um sandbox regulatório. Também deve reconhecer funções distintas em pagamentos.',
      'Quando uma questão disser que uma solução é “100% segura porque usa IA”, blockchain ou automação, procure o risco que continua existindo. A tecnologia não substitui governança.'
    ]}
  ],

};
