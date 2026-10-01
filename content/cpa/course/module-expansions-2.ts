import type { ReadingSection } from './readings'

export const moduleExpansionSections2: Record<string, ReadingSection[]> = {
  "servicos-bancarios": [
    {
      "id": "robusto-serv-conta",
      "title": "Conta corrente, depósitos e serviços: o que a conta realmente representa",
      "paragraphs": [
        "Conta corrente é uma relação de prestação de serviços financeiros que permite movimentar recursos, receber valores e utilizar diferentes meios de pagamento. Depósito à vista é recurso mantido na instituição e disponível conforme as regras da conta. Receber salário, pagar boletos, fazer transferências e utilizar serviços digitais são usos diferentes da mesma relação bancária. A existência da conta não significa que todos os serviços sejam gratuitos.",
        "Depósitos à vista fazem parte da estrutura de captação dos bancos e estão sujeitos às regras prudenciais e de compulsório aplicáveis. A garantia de depósitos também depende do instrumento e das condições do mecanismo de proteção. A prova pode colocar “saldo em conta” ao lado de “investimento” e perguntar se possuem a mesma natureza. Não trate toda quantia que aparece no aplicativo como investimento.",
        "Para estudar, separe: recurso próprio disponível, crédito concedido, investimento financeiro e serviço bancário. Essa classificação resolve várias questões."
      ]
    },
    {
      "id": "robusto-serv-pix",
      "title": "Pix por dentro: chave, iniciação, liquidação e uso empresarial",
      "paragraphs": [
        "Pix é um meio de pagamento instantâneo que permite transferências e pagamentos em tempo integral, conforme as regras do arranjo. A chave Pix é um identificador que facilita a iniciação de uma transação; ela não é a própria conta e não é uma senha. A liquidação ocorre dentro da infraestrutura definida pelo Banco Central, e o processo envolve participantes do sistema.",
        "Para pessoas jurídicas, Pix pode ser utilizado tanto para pagamentos quanto para recebimentos, conciliação e cobrança. A existência de uma operação instantânea não significa que qualquer transação seja irreversível em qualquer circunstância: existem mecanismos e procedimentos específicos para situações de fraude, erro e contestação. O cliente deve conhecer os controles de segurança e conferir destinatário e valor antes de confirmar.",
        "Na prova, não confunda Pix com SPI. Pix é o arranjo/meio de pagamento; SPI é a infraestrutura de liquidação entre participantes diretos. Também não confunda chave Pix com senha."
      ]
    },
    {
      "id": "robusto-serv-tarifas",
      "title": "Tarifas, atendimento e transparência: serviço bancário também é conteúdo de prova",
      "paragraphs": [
        "Tarifa é uma cobrança pela prestação de determinado serviço conforme as regras aplicáveis. A instituição deve observar critérios de transparência, comunicação e eventuais gratuidades previstas. Um pacote de serviços pode ser útil para uma pessoa e caro para outra. A análise deve comparar o que o cliente realmente utiliza com o que está sendo cobrado.",
        "Atendimento bancário envolve horários, canais digitais e presenciais, regras de filas e dias de não atendimento. O profissional não deve criar uma regra de memória quando a situação depende de regulamentação específica. O melhor comportamento é informar com clareza e consultar a fonte aplicável quando necessário.",
        "A prova pode criar um cliente que paga por um pacote cheio de serviços que nunca usa. O conceito testado é gestão financeira: custo recorrente deve ser compatível com utilização e necessidade."
      ]
    },
    {
      "id": "robusto-serv-internacional",
      "title": "Conta internacional e moeda estrangeira: não confunda conta, câmbio e investimento",
      "paragraphs": [
        "Uma conta internacional pode facilitar pagamentos, recebimentos e manutenção de recursos em moeda estrangeira, mas possui regras próprias. Comprar moeda estrangeira é uma operação cambial; manter saldo em moeda estrangeira é diferente de comprar um ativo de investimento; investir no exterior adiciona regras tributárias e de declaração. O profissional precisa identificar qual operação está ocorrendo.",
        "A cotação usada pelo cliente pode incorporar spread e custos. Câmbio comercial e turismo correspondem a contextos diferentes de formação de preço. Recompra de moeda estrangeira também possui regras. Para investimentos internacionais, a pessoa residente no Brasil precisa observar as obrigações tributárias e declarativas vigentes.",
        "Na prova, procure o objeto: estamos pagando uma compra, comprando moeda, mantendo saldo ou investindo? O mesmo dólar pode aparecer em quatro situações economicamente diferentes."
      ]
    }
  ],
  "seguros": [
    {
      "id": "robusto-seguros-fundamentos",
      "title": "Seguro do zero: transferência de risco em troca de prêmio",
      "paragraphs": [
        "Seguro é um contrato pelo qual, mediante prêmio e dentro das condições contratadas, uma seguradora assume determinados riscos e se compromete a pagar uma indenização ou prestação quando ocorre evento coberto. O segurado não está comprando “certeza de receber”; está transferindo uma consequência financeira específica para a seguradora. O contrato define risco, cobertura, exclusões, vigência, limites e condições.",
        "O prêmio é o valor pago pela cobertura. Sinistro é o evento que aciona a análise de cobertura. Indenização é o pagamento/prestação devida conforme o contrato. Franquia é a parcela de determinados prejuízos que permanece a cargo do segurado em estruturas que a preveem. Carência e vigência também precisam ser diferenciadas.",
        "Na prova, separe sempre evento ocorrido de evento coberto. Nem todo prejuízo é sinistro indenizável; a resposta depende do contrato."
      ]
    },
    {
      "id": "robusto-seguros-vida",
      "title": "Seguro de vida: temporário, vida inteira e proteção familiar",
      "paragraphs": [
        "Seguro de vida pode ser estruturado para diferentes necessidades. O temporário busca proteção durante determinado período, podendo ser útil quando a obrigação financeira é maior em uma fase específica da vida. O vida inteira busca cobertura de duração mais longa conforme o contrato. Produtos tradicionais possuem características próprias e não devem ser confundidos automaticamente com planos de previdência ou capitalização.",
        "A análise deve começar pela necessidade econômica. Se a renda de uma família depende fortemente de uma pessoa, a morte ou invalidez pode gerar um impacto financeiro. O seguro pode reduzir esse impacto, mas a cobertura adequada depende de capital segurado, beneficiários, exclusões e capacidade de pagamento do prêmio.",
        "A questão pode apresentar uma família e perguntar qual risco está sendo transferido. Não escolha o produto pela palavra “vida”; analise o evento e a finalidade."
      ]
    },
    {
      "id": "robusto-seguros-patrimoniais",
      "title": "Automóvel, residencial e prestamista: três proteções com lógicas diferentes",
      "paragraphs": [
        "Seguro de automóvel protege contra riscos previstos no contrato relacionados ao veículo, podendo incluir coberturas como colisão, roubo, furto ou danos a terceiros, conforme a apólice. Seguro residencial protege patrimônio e responsabilidades associadas ao imóvel dentro das coberturas contratadas. Seguro prestamista está ligado à quitação ou redução de uma obrigação financeira diante de determinados eventos cobertos.",
        "Franquia e limite máximo de indenização são conceitos diferentes. Franquia é a parcela de um prejuízo que pode permanecer com o segurado; limite é o máximo de cobertura contratada para determinada garantia. Exclusão é uma situação não coberta. Um seguro barato pode ter coberturas menores, franquia maior ou exclusões mais amplas.",
        "Na prova, compare o evento, o objeto protegido, quem recebe a indenização e qual obrigação existe. Isso diferencia produtos com nomes parecidos."
      ]
    }
  ],
  "planejamento": [
    {
      "id": "robusto-plan-orcamento",
      "title": "Orçamento e fluxo de caixa: transforme renda em decisão",
      "paragraphs": [
        "Planejamento financeiro começa com uma fotografia e depois vira um filme. A fotografia mostra patrimônio, dívidas, renda e despesas atuais. O filme acompanha como essas variáveis evoluem ao longo do tempo. Receita é entrada de recursos; despesa é saída; capacidade de poupança é o que sobra de forma sustentável. Sem conhecer o fluxo de caixa, escolher investimentos é começar pela solução antes de entender o problema.",
        "Classifique despesas entre essenciais, discricionárias, recorrentes e extraordinárias. Depois identifique dívidas e seus custos. Um orçamento não precisa prever cada centavo para ser útil; ele precisa revelar os grandes direcionadores de consumo e a capacidade real de poupar.",
        "Na CPA, quando o caso apresentar uma pessoa com renda alta e pouco patrimônio, não conclua que ela investe mal sem analisar despesas e dívidas. O fluxo de caixa é o ponto de partida."
      ]
    },
    {
      "id": "robusto-plan-reserva",
      "title": "Reserva de emergência: liquidez antes de rentabilidade",
      "paragraphs": [
        "Reserva de emergência existe para financiar eventos inesperados sem obrigar a pessoa a vender investimentos de longo prazo em condições ruins ou contrair crédito caro. O montante depende das despesas essenciais, estabilidade da renda, perfil profissional e composição familiar. Uma pessoa autônoma pode precisar de uma reserva diferente de alguém com renda altamente previsível.",
        "O ativo da reserva precisa privilegiar liquidez, baixo risco e disponibilidade. Rentabilidade é relevante, mas não é o primeiro critério. Colocar toda a reserva em um ativo de alta volatilidade pode criar o risco de a pessoa precisar do dinheiro justamente quando o preço caiu.",
        "A prova pode apresentar um cliente com dinheiro parado e perguntar se todo o saldo deve ser investido em um produto de maior retorno. Antes de responder, procure o tamanho da reserva e o horizonte."
      ]
    },
    {
      "id": "robusto-plan-metas",
      "title": "Metas, ciclo de vida e planejamento de longo prazo",
      "paragraphs": [
        "Uma meta financeira precisa de valor, prazo e prioridade. “Quero comprar um imóvel” é uma intenção; “quero acumular R$ 300 mil em oito anos para a entrada” é uma meta que pode ser planejada. O horizonte ajuda a definir liquidez e tolerância a volatilidade. Objetivos de curto prazo normalmente exigem maior previsibilidade; objetivos de longo prazo podem admitir mais oscilação, dependendo do perfil.",
        "O ciclo de vida pode ser dividido didaticamente em acumulação de capital, crescimento patrimonial, preservação e distribuição de renda. Essas fases não são caixas rígidas: uma pessoa pode ter simultaneamente objetivos de acumulação e preservação. O profissional deve identificar o objetivo específico do dinheiro analisado.",
        "Para aposentadoria, o problema vira um fluxo: quanto preciso acumular, por quanto tempo, qual retorno líquido é plausível e quanto precisarei retirar? A matemática ajuda, mas as premissas precisam ser realistas."
      ]
    },
    {
      "id": "robusto-plan-patrimonio",
      "title": "Balanço pessoal, patrimônio líquido e indicadores financeiros",
      "paragraphs": [
        "Balanço patrimonial pessoal organiza ativos e passivos. Ativo é aquilo que possui valor econômico para a pessoa; passivo representa obrigações. Patrimônio líquido é a diferença entre ativos e passivos. É útil separar ativos de uso, como imóvel residencial e veículo, de ativos financeiros e outros ativos que podem gerar renda ou ser vendidos para financiar objetivos.",
        "Indicadores como liquidez, cobertura de despesas e endividamento ajudam a avaliar saúde financeira. Liquidez relaciona recursos disponíveis a obrigações de curto prazo; cobertura de despesas mede por quanto tempo os recursos de alta liquidez conseguem sustentar o padrão essencial; endividamento compara obrigações e renda ou patrimônio conforme o indicador escolhido.",
        "Na prova, patrimônio alto não significa necessariamente liquidez alta. Uma pessoa pode possuir um imóvel valioso e, ainda assim, não ter recursos para pagar uma emergência amanhã."
      ]
    }
  ],
  "carteiras": [
    {
      "id": "robusto-cart-alocacao",
      "title": "Alocação de ativos: a carteira começa pelo objetivo, não pelo produto",
      "paragraphs": [
        "Construir uma carteira significa combinar ativos para atender a objetivos, horizonte, liquidez e risco. A alocação de ativos define quanto do patrimônio será exposto a diferentes classes, como renda fixa, ações, fundos, câmbio ou outras estratégias. O primeiro passo é definir o uso do dinheiro. Só depois faz sentido escolher produtos dentro de cada classe.",
        "Uma carteira para uma reserva de emergência não deve ser tratada como uma carteira para aposentadoria de longo prazo. Uma carteira para compra de imóvel em dois anos possui restrições diferentes de uma carteira para independência financeira em vinte anos. O mesmo investidor pode precisar de várias “caixinhas” de investimento.",
        "Na CPA, a palavra-chave é adequação: o ativo pode ser bom isoladamente e inadequado para aquele objetivo."
      ]
    },
    {
      "id": "robusto-cart-diversificacao",
      "title": "Diversificação: combinar riscos diferentes, não simplesmente comprar muitos ativos",
      "paragraphs": [
        "Diversificação reduz a dependência da carteira em relação a uma única fonte de risco. Comprar dez ações de empresas altamente expostas ao mesmo setor pode produzir menos diversificação do que combinar ativos com fatores de risco diferentes. A correlação entre os retornos importa: quando os ativos não se movem exatamente juntos, a carteira pode apresentar menor volatilidade para determinado retorno esperado.",
        "Diversificação não elimina risco. Uma carteira inteira exposta a juros pode sofrer com mudanças na curva; uma carteira inteira em ações sofre com risco de mercado; uma carteira concentrada em crédito privado possui risco de crédito específico. Diversificar é distribuir as fontes de risco de maneira coerente com o objetivo.",
        "A prova pode apresentar dois portfólios com o mesmo número de ativos e perguntar qual é mais diversificado. Conte as fontes de risco, não apenas os tickers."
      ]
    },
    {
      "id": "robusto-cart-rebalanceamento",
      "title": "Rebalanceamento e acompanhamento: por que a carteira muda mesmo sem você negociar",
      "paragraphs": [
        "Se uma carteira começa com 60% em renda fixa e 40% em ações e as ações sobem muito, a participação percentual de ações aumenta mesmo sem novas compras. O risco da carteira mudou. Rebalancear significa ajustar os pesos para voltar à estratégia definida, respeitando custos, impostos, liquidez e oportunidade.",
        "Rebalanceamento não deve ser uma tentativa de prever o mercado. É uma disciplina de gestão de risco. A frequência pode ser definida por calendário ou por bandas de desvio, dependendo da metodologia. Também é possível usar novos aportes para corrigir pesos sem vender ativos.",
        "Na prova, procure a causa da mudança de peso. Se um ativo valorizou, o percentual dele pode subir. Se houve resgate, todos os pesos podem mudar. A carteira é dinâmica."
      ]
    }
  ],
  "perfil": [
    {
      "id": "robusto-perfil-risco",
      "title": "Risco tem três dimensões: capacidade, disposição e necessidade",
      "paragraphs": [
        "A pessoa investidora pode dizer que aceita perder 30%, mas isso não significa que tenha capacidade financeira ou emocional para suportar essa perda. Capacidade de risco está ligada às condições financeiras, estabilidade da renda, patrimônio, obrigações e horizonte. Disposição/tolerância está ligada à forma como a pessoa reage à volatilidade. Necessidade de risco relaciona-se ao retorno necessário para atingir determinado objetivo.",
        "Um investidor jovem não é automaticamente agressivo. Idade é apenas uma variável. Uma pessoa jovem que precisa do dinheiro em seis meses para comprar um imóvel possui horizonte curto. Uma pessoa mais velha com patrimônio elevado e renda estável pode ter capacidade diferente para assumir risco.",
        "Na prova, não associe idade diretamente ao perfil. Leia objetivo, horizonte, liquidez, conhecimento, situação financeira e reação a perdas."
      ]
    },
    {
      "id": "robusto-perfil-suitability",
      "title": "Adequação: o produto precisa caber no cliente e no objetivo",
      "paragraphs": [
        "Suitability busca verificar se produtos e serviços são adequados ao perfil e às necessidades da pessoa investidora. A análise considera informações como objetivos, horizonte, situação financeira, conhecimento e tolerância a riscos, conforme as regras aplicáveis. Não é apenas perguntar “qual produto você quer?”.",
        "Um produto pode ser adequado para um objetivo e inadequado para outro. Uma aplicação volátil de longo prazo pode fazer sentido para crescimento patrimonial, mas ser inadequada para uma entrada de imóvel em três meses. Um produto de alta liquidez pode ser necessário para emergência, mesmo que outro ofereça retorno esperado maior.",
        "Na questão, se o cliente pede um produto incompatível, a resposta correta não é simplesmente “vender porque ele pediu”. O profissional deve seguir as regras de adequação, comunicação e procedimentos da instituição."
      ]
    },
    {
      "id": "robusto-perfil-diversificacao",
      "title": "Risco e retorno: não procure o maior retorno, procure o retorno coerente com o risco",
      "paragraphs": [
        "Em finanças, retorno esperado e risco precisam ser analisados juntos. Dois investimentos podem ter o mesmo retorno histórico e riscos completamente diferentes. Um investimento com retorno potencial maior pode envolver maior volatilidade, crédito mais frágil, menor liquidez ou estrutura mais complexa.",
        "Diversificação permite combinar ativos e reduzir a dependência de uma única fonte de risco. O perfil não é uma etiqueta permanente: mudanças de renda, patrimônio, objetivos ou horizonte podem alterar a adequação. O acompanhamento deve refletir a situação atual.",
        "Na prova, desconfie de frases como “quanto maior o retorno, melhor” ou “cliente conservador deve sempre comprar X”. A adequação depende do conjunto de características."
      ]
    }
  ],
  "atendimento-etica": [
    {
      "id": "robusto-atendimento-escuta",
      "title": "Atendimento de verdade: escuta ativa antes da recomendação",
      "paragraphs": [
        "A nova CPA foi desenhada para avaliar aplicação do conhecimento em situações práticas, e a ANBIMA disponibilizou caderno com questões de múltipla escolha e cases, além de formatos de árvore de decisão. Isso torna importante estudar atendimento como processo, não como uma lista de frases. A escuta ativa significa identificar o que o cliente realmente quer resolver, confirmar informações relevantes e evitar preencher lacunas com suposições.",
        "Personalização não significa dizer ao cliente aquilo que ele quer ouvir. Significa adaptar a explicação ao conhecimento, objetivo e contexto da pessoa. Se o cliente não entende marcação a mercado, repetir o nome técnico não resolve. É preciso explicar o mecanismo em linguagem compreensível e verificar se ele entendeu.",
        "Na prova, a melhor alternativa costuma combinar coleta de informação, explicação clara, respeito às regras e confirmação da compreensão."
      ]
    },
    {
      "id": "robusto-atendimento-etica",
      "title": "Os nove princípios éticos: transforme princípios em comportamento",
      "paragraphs": [
        "Os princípios éticos da certificação existem para orientar decisões profissionais. Em vez de decorar frases isoladas, transforme cada princípio em uma pergunta prática: estou agindo com integridade? estou tratando o cliente com respeito? estou evitando conflito? estou mantendo confidencialidade? estou atuando dentro das minhas competências? estou fornecendo informação verdadeira e suficiente?",
        "Ética aparece principalmente quando existe incentivo para fazer algo diferente do interesse do cliente. Uma comissão maior não transforma um produto inadequado em produto adequado. Uma relação pessoal com o cliente não elimina regras. Uma meta comercial não autoriza omitir risco. A conduta profissional precisa sobreviver justamente quando existe pressão.",
        "Na prova, leia o contexto antes da ação. Muitas alternativas descrevem uma atitude comercialmente eficiente, mas incompatível com transparência, adequação ou conflito de interesses."
      ]
    },
    {
      "id": "robusto-atendimento-suitability",
      "title": "Suitability, KYC e conflitos: o núcleo do atendimento financeiro",
      "paragraphs": [
        "KYC — conheça seu cliente — procura reunir informações necessárias para conhecer a pessoa, seu contexto financeiro e, dentro das obrigações aplicáveis, prevenir riscos. Suitability olha para adequação de produtos e serviços ao perfil e objetivos. São conceitos relacionados, mas não idênticos. KYC não é apenas preencher cadastro; cadastro desatualizado pode comprometer análises e controles.",
        "Conflito de interesses surge quando interesses do profissional, instituição ou terceiros podem influenciar a decisão de maneira incompatível com o interesse legítimo do cliente. Gestão de conflitos pode envolver políticas, divulgação, segregação de funções, treinamento e monitoramento. A transparência sobre remuneração é parte importante da distribuição.",
        "Na prova, quando uma alternativa diz “venda o produto que paga maior comissão”, pergunte imediatamente: qual é o conflito? qual é a adequação? qual informação deveria ser transparente? O raciocínio geralmente aparece em cadeia."
      ]
    },
    {
      "id": "robusto-atendimento-pld",
      "title": "PLDFT: atipicidade não é culpa, e KYC é uma ferramenta de proteção",
      "paragraphs": [
        "Prevenção à lavagem de dinheiro e financiamento do terrorismo utiliza abordagem baseada em risco. A instituição conhece seu cliente, identifica beneficiários, entende características das operações e monitora situações atípicas. Uma operação atípica é um sinal para análise; não é prova automática de crime. O procedimento deve seguir as regras internas e legais aplicáveis.",
        "Fracionamento, movimentações incompatíveis com o perfil, origem de recursos sem explicação e estruturas complexas podem exigir atenção conforme o contexto. A pessoa profissional não deve improvisar investigação nem acusar o cliente. Também deve respeitar a confidencialidade das comunicações e dos procedimentos.",
        "Na questão, a alternativa correta geralmente evita dois extremos: ignorar a operação porque o cliente é antigo ou acusar o cliente sem análise. O caminho é registrar, analisar e encaminhar pelo procedimento adequado."
      ]
    },
    {
      "id": "robusto-atendimento-lgpd",
      "title": "LGPD, sigilo bancário e segurança: dado de cliente não é material de treinamento pessoal",
      "paragraphs": [
        "A LGPD estabelece princípios e bases legais para o tratamento de dados pessoais. Finalidade, adequação, necessidade, segurança e transparência são importantes. O profissional deve utilizar dados apenas dentro das finalidades e ambientes autorizados. “Tenho acesso ao dado” não significa “posso usar para qualquer finalidade”.",
        "Sigilo bancário possui disciplina própria e se relaciona com a proteção de informações financeiras. Em ambientes digitais, riscos aumentam quando dados são copiados para dispositivos pessoais, aplicativos não autorizados ou ferramentas de IA sem controle institucional. Um incidente deve ser tratado conforme os procedimentos internos, preservando evidências e acionando responsáveis.",
        "A prova pode apresentar um funcionário querendo usar dados reais de clientes para testar uma ferramenta. A pergunta central é: existe autorização, finalidade, segurança e ambiente adequado? Se não, a velocidade da ferramenta não justifica o risco."
      ]
    },
    {
      "id": "robusto-atendimento-mercado",
      "title": "Ilícitos de mercado: manipulação, insider, front running e churning",
      "paragraphs": [
        "Manipulação de mercado envolve práticas destinadas a criar condições artificiais ou alterar preços e condições de negociação de forma ilícita. Spoofing e layering, por exemplo, envolvem ordens com comportamento destinado a criar sinais artificiais no livro de ofertas. Manipulação de benchmark busca interferir indevidamente em uma referência de mercado. A prova pode descrever o comportamento sem usar o nome do ilícito.",
        "Insider trading envolve uso indevido de informação relevante ainda não pública. Insider primário e secundário diferenciam situações relacionadas à origem ou recebimento da informação. Front running ocorre quando alguém usa conhecimento de uma ordem de cliente para se posicionar antes dela. Churning envolve giro excessivo de operações visando benefício do intermediário, sem interesse econômico adequado para o cliente.",
        "Não memorize só os nomes. Pergunte: houve informação não pública? houve ordem fictícia ou sinal artificial? alguém se antecipou à ordem do cliente? houve excesso de operações para gerar remuneração? Essas perguntas transformam a lista de ilícitos em um mapa."
      ]
    }
  ],
  "sustentabilidade": [
    {
      "id": "robusto-esg-fundamentos",
      "title": "ESG de verdade: ambiente, social e governança como fatores econômicos",
      "paragraphs": [
        "ESG não é simplesmente escolher empresas “boas”. A dimensão ambiental envolve emissões, recursos naturais, clima e impactos físicos; a social envolve trabalhadores, consumidores, comunidades e direitos; governança envolve estrutura de decisão, controles, incentivos, transparência e relacionamento entre acionistas e administração. Esses fatores podem afetar receitas, custos, investimentos, acesso a capital e continuidade operacional.",
        "Um evento climático que interrompe uma fábrica é risco físico. Uma mudança regulatória que encarece uma atividade intensiva em carbono é risco de transição. Uma falha de governança que permite fraude pode gerar perdas financeiras, multas e danos reputacionais. O ponto central é conectar sustentabilidade ao fluxo econômico da empresa.",
        "Na prova, ESG deve ser analisado como informação relevante para risco e oportunidade, não como sinônimo de retorno garantido."
      ]
    },
    {
      "id": "robusto-esg-estrategias",
      "title": "Integração, exclusão, seleção positiva, temáticos e impacto",
      "paragraphs": [
        "Estratégias ESG não são intercambiáveis. Integração ESG incorpora fatores ambientais, sociais e de governança à análise de investimento. Exclusão retira determinados emissores ou setores segundo critérios. Seleção positiva prioriza características ou práticas consideradas favoráveis. Investimento temático concentra-se em temas específicos. Investimento de impacto procura intenção e mensuração de resultados socioambientais, além da análise financeira aplicável.",
        "Um fundo pode integrar risco climático sem ter objetivo sustentável principal. Outro pode possuir objetivo sustentável e metodologia específica. O nome do produto não basta para concluir a estratégia. É preciso olhar regulamento, política, metodologia e indicadores.",
        "A prova pode apresentar dois fundos com linguagem verde e perguntar se possuem a mesma classificação. A resposta depende da estratégia formal e dos requisitos aplicáveis."
      ]
    },
    {
      "id": "robusto-esg-greenwashing",
      "title": "Como identificar greenwashing sem cair no marketing",
      "paragraphs": [
        "Greenwashing ocorre quando uma comunicação apresenta atributos ambientais ou sustentáveis de maneira enganosa, exagerada ou sem sustentação suficiente. Para analisar uma alegação, procure quatro coisas: objetivo declarado, critérios de seleção, evidências e acompanhamento. Quanto mais específica a promessa, mais importante é saber como ela é medida.",
        "No mercado financeiro, identificação de fundos sustentáveis e integração ESG dependem das regras aplicáveis da CVM e da autorregulação da ANBIMA. A classificação não elimina risco financeiro e não garante impacto positivo em todos os cenários.",
        "Na prova, se o enunciado disser “fundo verde” sem apresentar metodologia, não invente a classificação. Procure o documento e a evidência."
      ]
    }
  ],
  "ativos-digitais": [
    {
      "id": "robusto-digital-blockchain",
      "title": "Blockchain, token e ativo digital: tecnologia não substitui direito econômico",
      "paragraphs": [
        "Blockchain é uma tecnologia de registro distribuído que permite manter um histórico compartilhado de transações segundo regras de validação. Redes podem ser públicas ou permissionadas e podem utilizar mecanismos diferentes de consenso. A existência de um registro imutável ou difícil de alterar não garante que a informação inserida originalmente seja verdadeira.",
        "Token é uma representação digital criada em determinada infraestrutura. O que importa economicamente é o direito ou utilidade associado ao token: participação, acesso, crédito, representação de um ativo ou outra função. Tokenizar um ativo não cria automaticamente liquidez, solvência ou proteção jurídica. É necessário identificar emissor, direitos, regras de transferência e possibilidade de exigir o cumprimento.",
        "Na prova, se alguém disser “é blockchain, portanto é seguro”, procure o risco que foi ignorado: tecnologia, custódia, mercado, liquidez, contrato ou regulação."
      ]
    },
    {
      "id": "robusto-digital-defi",
      "title": "DeFi e smart contracts: o intermediário muda, o risco não desaparece",
      "paragraphs": [
        "Finanças descentralizadas utilizam protocolos e software para oferecer funções como troca, empréstimo, garantia e negociação sem reproduzir exatamente a estrutura de um banco ou corretora tradicional. Smart contracts são programas que executam regras quando determinadas condições são atendidas. Eles podem automatizar operações, mas dependem de código, governança, oráculos e infraestrutura.",
        "Um contrato autoexecutável pode executar perfeitamente um código errado. Oráculos podem fornecer dados externos incorretos. Uma chave administrativa pode ter poderes relevantes. Um protocolo pode sofrer ataque ou falha. Portanto, “automatizado” não significa “sem risco operacional”. DEXs também possuem riscos próprios de liquidez, preço, tecnologia e execução.",
        "Na CPA, compare finanças tradicionais e DeFi pelo desenho de responsabilidades. Quem custodia? Quem valida? Quem pode alterar o protocolo? Quem fornece o dado externo? Quem assume a perda em caso de falha?"
      ]
    },
    {
      "id": "robusto-digital-tokenizacao",
      "title": "Tokenização, stablecoins, NFT, ETFs e Drex: organize os conceitos",
      "paragraphs": [
        "Tokenização representa direitos ou ativos em formato digital dentro de uma estrutura tecnológica. Pode ser aplicada a ativos financeiros, imóveis ou outros bens. O benefício potencial inclui fracionamento, automação e eficiência operacional, mas os desafios envolvem segurança, regulação, governança e conexão entre o token e o direito jurídico real.",
        "Stablecoins buscam manter referência de valor por mecanismos que podem envolver reservas ou outras estruturas; “stable” não significa ausência de risco. NFT é um token não fungível, adequado para representar itens únicos dentro de uma estrutura digital. ETFs de criptoativos oferecem exposição por meio de um veículo regulado específico, quando disponíveis. Drex é a infraestrutura/moeda digital do Banco Central dentro do projeto brasileiro de moeda digital, e não é sinônimo de bitcoin.",
        "A técnica de prova é sempre separar tecnologia, veículo, ativo de referência e direito econômico. Dois produtos podem usar blockchain e terem riscos completamente diferentes."
      ]
    }
  ],
  "open-finance": [
    {
      "id": "robusto-open-conceito",
      "title": "Open Finance: o cliente controla o compartilhamento, não entrega a senha",
      "paragraphs": [
        "Open Finance é um ecossistema de compartilhamento padronizado de dados e serviços financeiros entre participantes, mediante autorização do cliente e dentro das regras. O objetivo é permitir que informações do relacionamento financeiro possam ser utilizadas por outra instituição para oferecer serviços, comparar produtos ou melhorar análises. Isso não significa tornar os dados públicos.",
        "O consentimento é contextual: envolve instituição destinatária, dados, finalidade e período/condições do compartilhamento conforme o fluxo. Autenticação e confirmação ocorrem nos canais apropriados. O cliente não precisa entregar sua senha bancária a um atendente para que os dados sejam compartilhados.",
        "Na prova, desconfie de alternativas que tratem Open Finance como uma autorização irrestrita. O cliente continua tendo direitos e controles."
      ]
    },
    {
      "id": "robusto-open-utilidade",
      "title": "Open Finance, crédito e competição: potencial não é garantia",
      "paragraphs": [
        "Com acesso autorizado a dados financeiros, uma instituição pode compreender melhor renda, movimentação e comportamento de pagamento. Isso pode melhorar modelos de crédito, reduzir assimetria de informação e facilitar comparação de ofertas. Mas compartilhar dados não obriga uma instituição a aprovar crédito, reduzir juros ou aceitar determinado cliente.",
        "A qualidade da decisão depende de dados, modelos e políticas. Um score pode melhorar porque a instituição recebeu informações adicionais, mas a decisão final continua sujeita a critérios de risco. Para o cliente, é importante comparar condições completas: CET, prazo, garantias, tarifas e flexibilidade.",
        "Na questão, se uma alternativa disser “compartilhar dados garante crédito mais barato”, a afirmação é excessiva. O compartilhamento pode aumentar informação; não determina o preço final."
      ]
    },
    {
      "id": "robusto-open-investment",
      "title": "Open Investment, Open Insurance e portabilidade: dados não são automaticamente patrimônio",
      "paragraphs": [
        "Compartilhar dados de investimentos não é o mesmo que transferir investimentos. A portabilidade de valores mobiliários possui procedimentos próprios e regras específicas. Da mesma forma, Open Insurance trata do compartilhamento no mercado de seguros, enquanto Open Finance possui escopo mais amplo. Cada ecossistema possui participantes, consentimento e regras próprios.",
        "Quando uma pessoa quer “levar tudo para outra instituição”, pergunte o que exatamente ela quer levar: histórico de dados, uma dívida, uma posição de investimento, um plano de previdência ou uma apólice. A operação correspondente pode ser compartilhamento, portabilidade ou contratação nova. Misturar os conceitos é uma pegadinha comum.",
        "A prova pode usar linguagem comercial como “leve seus investimentos com um clique”. O profissional precisa separar experiência digital de processo jurídico e operacional."
      ]
    }
  ],
  "tecnologia": [
    {
      "id": "robusto-tech-ia",
      "title": "IA generativa e modelos preditivos: o que muda no atendimento financeiro",
      "paragraphs": [
        "IA generativa produz conteúdo novo a partir de padrões aprendidos em dados, podendo gerar texto, resumo, imagem ou código. Modelos preditivos procuram estimar resultados, como probabilidade de inadimplência ou propensão de determinado comportamento. As duas categorias podem usar aprendizado de máquina, mas respondem a problemas diferentes.",
        "No atendimento financeiro, IA pode apoiar triagem, resumo de documentos, busca de informações e respostas preliminares. Isso não elimina a necessidade de validação humana quando a resposta envolve regras, dados pessoais, cálculo financeiro ou decisão relevante. Um modelo pode produzir uma resposta convincente e incorreta.",
        "Na prova, a palavra “IA” não é sinônimo de “decisão automática”. Pergunte qual tarefa está sendo automatizada e quais controles existem."
      ]
    },
    {
      "id": "robusto-tech-governanca",
      "title": "Dados, vieses, alucinação e validação: o risco está também no processo",
      "paragraphs": [
        "Modelos dependem da qualidade dos dados. Dados incompletos ou enviesados podem gerar resultados inadequados. Um modelo pode funcionar bem em dados históricos e perder desempenho quando o comportamento do mercado muda. Por isso, validação, monitoramento e revisão são partes da governança.",
        "Modelos generativos também podem produzir informações falsas com linguagem segura. Em finanças, isso é especialmente relevante porque uma alíquota errada, prazo incorreto ou regra desatualizada pode prejudicar o cliente. O profissional deve conferir fonte, data e cálculo antes de transformar uma saída de IA em informação ao cliente.",
        "Privacidade também importa. Dados de clientes só devem ser utilizados em ambientes autorizados e para finalidades legítimas. Eficiência não substitui segurança."
      ]
    },
    {
      "id": "robusto-tech-fintech",
      "title": "Fintechs, sandbox e meios de pagamento: inovação continua sujeita a regras",
      "paragraphs": [
        "Fintech é uma empresa que utiliza tecnologia para oferecer ou apoiar serviços financeiros. O termo não representa uma licença única. A atividade efetivamente exercida determina o enquadramento regulatório: pagamentos, crédito, investimento, seguros e infraestrutura possuem regras diferentes.",
        "Sandbox regulatório permite testar modelos inovadores sob condições e supervisão específicas. Não é uma autorização permanente nem um selo de investimento seguro. A lógica é criar um ambiente controlado para aprender sobre uma inovação sem abandonar controles relevantes.",
        "Nos meios de pagamento, entenda os papéis de arranjo, instituição participante, adquirente e subadquirente. O objetivo é acompanhar o fluxo: quem cria as regras do arranjo, quem aceita o pagamento, quem processa e quem liquida."
      ]
    }
  ]
}
