# CPA Study — Nova CPA ANBIMA 2026

Plataforma gratuita, local-first e offline-first para Felipe e Thó estudarem a **CPA — Certificado Profissional ANBIMA** no modelo vigente em 2026.

## Começar a estudar

Acesse **https://felipeortuzal.github.io/CPA/**, informe seu nome e siga a **Sessão de hoje**.

Também existe o arquivo único `CPA_Study.html`, que pode ser aberto diretamente no Chrome ou Edge sem instalar Git, Node ou qualquer servidor. O conteúdo funciona offline; links para fontes oficiais exigem internet.

> O progresso fica no navegador/IndexedDB. Felipe e Thó têm históricos independentes. Exporte o backup JSON antes de trocar de computador, limpar dados do navegador ou substituir o HTML local.

### Para o Thó

O caminho mais simples é usar o site ou manter `CPA_Study.html` em uma pasta fixa no próprio computador. Antes de trocar o arquivo local por uma versão nova, exporte o backup JSON em **Configurações → Dados e Backup**.

Se estiver usando a pasta clonada do repositório no Windows, `update-cpa.bat` atualiza os arquivos do projeto conforme o fluxo local já existente. Depois da atualização, abra o HTML no mesmo caminho de antes e, se necessário, importe o backup. O progresso do site e o progresso do arquivo local continuam independentes.

## Estado atual — V27 / 0.27.0

A V26 transforma a trilha de 20 módulos em uma **Apostila Digital Completa**, sem abandonar a rastreabilidade do Programa Detalhado.

- **20 módulos** temáticos e progressivos;
- **445 PDs terminais** do Programa Detalhado, cada um pertencendo a um módulo;
- **445 aulas completas**, uma por PD terminal;
- **1.780 flashcards** de aula, além de flashcards pessoais;
- **1.335 checkpoints** dentro da apostila, três por PD;
- comparações, fórmulas, confusões comuns, exemplos e foco de prova;
- **Modo Apostila** contínuo por módulo, com índice, fontes oficiais e impressão/PDF;
- trilha principal separada de **Aprofundamento**, que preserva a teoria integral e exemplos completos sem tornar todo esse volume obrigatório para avançar;
- simulado ao final de cada módulo;
- sessão diária, revisão espaçada, Caderno de Erros, plano de estudos e estatísticas;
- PWA, GitHub Pages, backup JSON e HTML standalone offline.

O tempo mostrado na Apostila é uma **estimativa da trilha principal**, não do acervo integral. Abrir todos os aprofundamentos aumenta bastante o tempo total de estudo.


### V27 — Inteligência da prova

A V27 adiciona uma camada dedicada a entender como transformar o edital em raciocínio de prova:

- Radar CPA integrado à central Fontes e Atualizações;
- benchmark do curso público Retorno Interno / Renan Duarte;
- 12 clusters pedagógicos cobrindo os 20 módulos;
- 23 atalhos mentais;
- 16 padrões de reconhecimento de questões;
- 100 pegadinhas conceituais autorais;
- Radar CPA com separação entre evidência oficial, observada, especialistas e relatos;
- benchmark de materiais externos gratuitos.

A regra editorial da V27 é: ANBIMA é fonte de verdade; terceiros são benchmark. O projeto não copia transcrições, slides ou questões proprietárias.


### V27.1 — Mestre CPA

Antes da V28, a plataforma ganhou um tutor de IA flutuante: o **Mestre CPA**.

- abre sobre a página atual, sem navegação;
- histórico local da conversa;
- explica conceitos do zero e treina raciocínio de prova;
- analisa alternativas e pegadinhas;
- recebe o contexto da página atual;
- pode consultar fontes institucionais atuais por busca web;
- usa GPT-5.6 Luna por padrão;
- a chave da OpenAI fica somente no backend Cloudflare Worker.

O frontend já está instalado. Para ativar a IA em um deploy, publique `workers/cpa-chat` e defina `VITE_CPA_CHAT_ENDPOINT`. Consulte `workers/cpa-chat/README.md`.

### V27.2 — Leitura completa

Os 20 módulos agora têm leitura aprofundada autoral, com mais de 1.000 palavras por módulo em média, além da base anterior. A estrutura foi aproximada da lógica de cursos preparatórios em vídeo:

**conceito → explicação → mecanismo → exemplo → aplicação em prova → confusão comum → checklist → simulado.**

O conteúdo foi elaborado a partir do Programa Detalhado vigente e usado o curso público CPA 2026 do Retorno Interno/Renan Duarte como referência de cobertura e didática. Não são reproduzidos slides, apostilas ou roteiros.
## Como estudar na V27

1. Use a trilha principal e a Apostila V26 como base.
2. Abra Inteligência da prova para revisar os clusters e o 80/20 interno.
3. Antes de fazer um simulado, revise os padrões de questão e os atalhos mentais.
4. Depois do simulado, use as pegadinhas para transformar erros conceituais em recuperação ativa.
5. Consulte os materiais externos apenas como benchmark e confirme regras atuais nas fontes oficiais.

## Como estudar na V26

Fluxo recomendado:

1. abra o próximo módulo da trilha;
2. leia as seções introdutórias;
3. use **Ler como apostila completa**;
4. em cada PD, domine `Comece por aqui`, `Entenda`, `Como pode ser cobrado`, comparações, fórmulas, confusões e resumo;
5. abra **Aprofundamento** quando precisar de mais contexto, teoria completa ou exemplo detalhado;
6. responda os checkpoints;
7. faça o simulado do módulo;
8. use a revisão diária para erros, flashcards e recuperação espaçada.

A página inicial oferece sessões rápidas de **10, 25 ou 45 minutos**, além da sua meta. A meta diária configurável aceita **10–120 minutos**.

## Conclusão e domínio

**Concluir não é dominar.**

Conclusão significa terminar a leitura introdutória do módulo e finalizar um simulado, independentemente da nota.

O status de **Domínio** é uma meta interna de estudo e exige evidências adicionais: leitura e simulado concluídos, pelo menos 12 questões distintas, prática em três dias, intervalo mínimo de sete dias, acerto recente de pelo menos 80%, duas práticas recentes consistentes, simulado elegível de pelo menos 70% e evidência recente.

A própria página do módulo mostra esse checklist. Ele **não é previsão de aprovação na certificação**.

## Banco de questões

O banco bruto possui **745 questões**/itens no total:

- **300 questões autorais revisadas**, usadas como base confiável de treino e simulados;
- **445 exercícios de cobertura gerados**, um por PD terminal, mantidos fora da base revisada enquanto não passam por revisão individual.

Nenhuma questão privada ou vazada é usada.

Na V26, dificuldade, nível cognitivo e tipo das questões revisadas foram recalibrados a partir da estrutura real do item, sem mudar enunciado, alternativas ou gabarito.

### Status editorial

`reviewed` significa que o texto passou pela revisão editorial registrada no projeto.

`verified` exige confronto específico de gabarito, explicação e regra central com a fonte oficial correspondente. **A V26 não promove questões a `verified` apenas para aumentar um contador.**

Itens de diálogo continuam sendo questões objetivas. O projeto **não afirma implementar árvore de decisão** enquanto não houver nós e ramificações reais.

## Simulados

A plataforma oferece:

- simulado por módulo;
- Simulado 10;
- Simulado 20;
- por tema;
- assuntos fracos;
- somente inéditas;
- treino completo de 50 questões e 2h30.

Em um conjunto de 50 itens, **35 acertos** correspondem aritmeticamente a 70%. A V26 não usa esse número, sozinho, como declaração de aprovação oficial: nosso treino não é prova homologada e ainda não reproduz árvores de decisão dinâmicas.

O motor da V26 prioriza questões ainda não vistas e diversidade de `conceptId`, PD, dificuldade, nível cognitivo e tipo, reduzindo a chance de uma prova curta repetir praticamente o mesmo conceito.

O treino completo e os simulados são **ferramentas pedagógicas locais**. Eles não são provas oficiais, não são homologados pela ANBIMA e não geram previsão de aprovação.

## Base oficial

A estrutura curricular continua baseada no **Programa Detalhado CPA ANBIMA v1.2**, revisado em 04/06/2025 e vigente desde 01/01/2026.

O projeto também acompanha, entre outras fontes oficiais:

- Guia de Elaboração de Questões ANBIMA;
- Caderno de Questões CPA ANBIMA;
- Edital dos Exames de Certificação Profissional ANBIMA;
- Banco Central do Brasil;
- CVM / Portal do Investidor;
- SUSEP;
- Receita Federal e demais fontes regulatórias aplicáveis.

O manifesto interno possui fontes oficiais rastreáveis e cada PD da Apostila mostra as referências utilizadas e sua data de verificação editorial.

Materiais públicos de cursos e preparatórios podem ser usados como **benchmark didático**, nunca como licença para copiar apostilas, slides ou questões privadas.

## Offline e arquivo local

Para usar sem instalar nada:

1. baixe `CPA_Study.html`;
2. guarde o arquivo em uma pasta fixa;
3. abra no Chrome ou Edge;
4. informe seu nome ou importe um backup;
5. estude normalmente;
6. em **Configurações → Dados e Backup**, exporte o JSON periodicamente.

O standalone contém a aplicação e o conteúdo. O progresso não fica “dentro” do HTML; ele permanece no IndexedDB do navegador.

Mover ou renomear o HTML pode mudar a origem de armazenamento usada pelo navegador. Antes de atualizar ou trocar de local, faça backup.

## Backup

O backup inclui, entre outros dados:

- perfil local;
- progresso de aulas e módulos;
- respostas de questões;
- quizzes;
- favoritos;
- flashcards e revisões;
- Caderno de Erros;
- simulados e resultados;
- sessões e tempo de estudo;
- preferências e plano de estudos.

A importação pela interface mostra um resumo e cria uma cópia dos dados atuais antes da substituição. Backups legados válidos continuam compatíveis.

## Desenvolvimento

Requisitos para desenvolvimento:

- Node.js 22+;
- Git.

```bash
git clone https://github.com/felipeortuzal/CPA.git
cd CPA
npm ci
npm run dev
```

Validação completa:

```bash
npm run validate
```

Principais gates:

```bash
npm run validate:curriculum
npm run validate:lessons
npm run validate:questions
npm run validate:sources
npm run validate:v26
npm test
npm run lint
npm run typecheck
npm run build
npm run test:browser
npm run test:cross-browser
```

O `build` também gera o `CPA_Study.html` standalone.

## Política editorial da V26

A V26 não aumenta números artificialmente. Em particular:

- os 445 exercícios gerados continuam identificados separadamente da base revisada;
- uma questão só pode ser chamada de verificada quando houver evidência específica;
- PDs, fontes e datas permanecem rastreáveis;
- nenhum material externo protegido é reproduzido integralmente;
- indicadores de desempenho descrevem o histórico dentro da plataforma, não a probabilidade de aprovação.

## Relatórios e histórico

- `V26_REPORT.md` — auditoria da release V26;
- `CHANGELOG.md` — mudanças por versão;
- relatórios de versões anteriores permanecem no repositório para rastreabilidade.

## Limites conhecidos

- Não existe sincronização automática entre computadores ou entre o site e o HTML standalone.
- O projeto ainda não implementa árvore de decisão dinâmica no padrão do formato oficial.
- As 445 questões de cobertura gerada ainda precisam de revisão editorial individual antes de entrarem na base confiável.
- Fontes externas podem mudar depois da data registrada; regras vigentes devem ser reconferidas quando houver atualização normativa.
- A plataforma é independente e não é afiliada, certificada ou homologada pela ANBIMA.
