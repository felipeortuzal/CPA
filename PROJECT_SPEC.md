# Atualização vigente — V23 (25/09/2026 UTC)

A V23 mantém o escopo local/offline da V22 e corrige concorrência nas aulas, quizzes, revisões, favoritos, perfil e tempo de estudo; isola o estado por aula; valida campos adicionais de backup; trata falhas de leitura/gravação; amplia os testes de navegador e exige sua aprovação antes do deploy. A agenda usa o dia local e limita o planejamento até a prova aos próximos 366 dias, com aviso na interface. Relatório: `V23_REPORT.md`.

# Histórico — V22 (25/09/2026 UTC)

Esta seção prevalece sobre afirmações de prontidão, validação editorial ou distribuição feitas nas versões históricas abaixo.

- Entrega principal: `CPA_Study.html`, gerado da mesma aplicação por `npm run build`, sem instalação ou servidor para o aluno.
- Persistência no IndexedDB já existente, schema v2 preservado. HTML/site/navegadores podem ter armazenamentos independentes; transferir progresso por JSON.
- Novas respostas e simulados conservam snapshots do conteúdo. Questões geradas mantêm IDs históricos por PD através de `coverage-ids.json`.
- Backup: leitura consistente e substituição transacional, validação de simulados e cópia anterior baixada pela interface. Falhas não podem limpar o histórico.
- Nenhum gabarito ganha status `verified` automaticamente por ter um link ou data. Banco atual: 100 questões autorais e 445 geradas, com revisão individual pendente.
- `dialog_tree` é um identificador legado; o formato implementado é diálogo contextualizado de múltipla escolha. Não há ainda árvores ramificadas validadas.
- `official_exam` é mantido como chave de compatibilidade; novos registros usam o rótulo Treino completo CPA e não classificam aprovação. Excluem a cobertura gerada.
- Primeira tentativa, repetições e questões únicas são exibidas separadamente, com simulados identificados à parte.
- Sem backend, autenticação remota ou infraestrutura paga.
- Validação e limitações: ver `V22_REPORT.md`. As descrições históricas abaixo documentam intenções anteriores, não comprovam testes ou verificação financeira.

---

# PROJECT_SPEC.md

Você está trabalhando no repositório GitHub `CPA`.

## Objetivo

Construir uma plataforma completa de estudos para certificações financeiras brasileiras, começando pela **NOVA CPA — Certificado Profissional ANBIMA**, vigente no novo modelo a partir de 2026.

Não usar conteúdo da antiga CPA-10 ou CPA-20.

A arquitetura deve permitir futuramente CPA, C-Pro R, C-Pro I, CFG, CGA, CGE e outras certificações, sem misturar conteúdos ou progressos.

## Regra nº 1 — conteúdo sempre atualizado

Nunca invente conteúdo regulatório.

Antes de implementar ou alterar conteúdo de estudo, consultar fontes oficiais atualizadas nesta prioridade:

1. ANBIMA / ANBIMA Edu
2. CVM
3. Banco Central do Brasil
4. Tesouro Nacional / Tesouro Direto
5. Receita Federal
6. B3
7. SUSEP / PREVIC / demais órgãos oficiais quando pertinentes

O Programa Detalhado da CPA da ANBIMA é a fonte de verdade sobre o conteúdo cobrado. Se existir versão mais nova, ela prevalece.

Cada conteúdo regulatório deve manter metadata quando aplicável:

- certification
- programVersion
- pdCode
- topic
- subtopic
- officialSource
- sourceUrl
- sourceDate
- lastVerified
- contentVersion

Nunca copiar apostilas comerciais. Produzir explicações originais baseadas em fontes oficiais.

## Programa atual versionado

Programa Detalhado CPA ANBIMA atualmente versionado no projeto:

- versão: 1.2
- revisão: 04/06/2025
- vigência: 01/01/2026
- última verificação: 20/09/2026

Antes de qualquer nova produção de conteúdo, verificar novamente a ANBIMA.

Macrotemas oficiais:

1. Estrutura e dinâmica do Sistema Financeiro Nacional — 20%
2. Produtos do mercado financeiro — 40%
3. Relacionamento com o cliente — 30%
4. Inovação e desenvolvimento de mercado — 10%

Preservar todos os PD Codes do Programa Detalhado.

## Edital de exames atualmente verificado

Edital dos Exames de Certificação Profissional ANBIMA:

- versão: 1.4
- data: 28/05/2026
- verificado em: 20/09/2026

Para a CPA o edital confirma:

- 50 questões
- 2h30 de duração
- mínimo de 35 acertos para aprovação
- questões objetivas de múltipla escolha com quatro alternativas e uma correta, árvore de diálogo e cases

Antes de alterar regras do Modo Prova, verificar novamente o edital oficial mais recente. Uma versão posterior prevalece.

## Arquitetura atual — local-first e custo R$ 0

Esta seção substitui qualquer arquitetura antiga baseada em Supabase, Firebase, login ou backend remoto.

A plataforma é inicialmente **100% local**.

Felipe e Thó usam o mesmo código em computadores/navegadores separados. Cada instalação mantém seu próprio progresso local.

Não exigir:

- Supabase
- Firebase
- autenticação
- login/cadastro
- servidor próprio
- API paga
- `.env` para estudar

Stack:

- React
- TypeScript strict
- Vite
- Tailwind CSS
- React Router
- IndexedDB via biblioteca `idb`
- PWA
- GitHub para versionamento do código e conteúdo

Princípio obrigatório:

- **GitHub = conteúdo da plataforma**
- **IndexedDB = progresso e dados pessoais do aluno**

O conteúdo oficial, aulas e banco base de questões não devem ser duplicados no IndexedDB.

## Persistência local

A camada de storage deve ficar centralizada em `src/lib/storage/` ou arquitetura equivalente. Não espalhar chamadas IndexedDB pela aplicação.

O banco local deve ser versionado por `DB_VERSION` e evoluir por migrations aditivas (`v1 → v2 → v3`). Nunca apagar o banco como estratégia de migration.

Schema atual: `DB_VERSION = 2`.

- v1: perfil, progresso de aulas, mini quizzes, favoritos, flashcards, revisões, erros, simulados, sessões de estudo, dias ativos, preferências e plano de estudos.
- v2: adiciona `questionAttempts` com índices por questão, PD e data.

O Modo Prova usa o store `simulations` já existente desde v1; não foi necessária migration de schema para a v0.6.

Persistir localmente, conforme implementados:

- perfil/nome
- aulas iniciadas/concluídas/dominadas
- progresso por PD
- favoritos
- mini quizzes e respostas
- tentativas de questões
- erros e recorrência
- questões marcadas
- flashcards e revisões
- simulados, respostas, marcações, notas, tempo e resultados
- tempo estudado
- streak
- estatísticas
- preferências
- plano de estudos

Atualizações via `git pull` não podem apagar o IndexedDB do navegador.

## Identidade local

Na primeira abertura perguntar apenas:

> Bem-vindo ao CPA
> Como podemos te chamar?

Salvar o nome localmente. Isso não é autenticação.

Nas próximas visitas entrar direto no Dashboard e mostrar discretamente `Olá, <nome>`.

Configurações deve permitir alterar o nome.

## Backup obrigatório

Configurações > Dados e Backup deve oferecer:

- Exportar progresso para `cpa-backup-YYYY-MM-DD.json`
- Importar progresso com validação de estrutura e versão e confirmação explícita
- Apagar todo o progresso com confirmação forte

A versão atual do backup é v2 e inclui tentativas de questões e simulados. Backups v1 devem continuar importáveis.

Nunca substituir ou apagar dados silenciosamente.

## Funcionamento offline

Depois que dependências e assets da aplicação estiverem instalados/carregados, estudar deve funcionar sem internet obrigatória para:

- abrir aulas
- marcar progresso
- responder mini quiz
- responder questões do banco local
- fazer simulados
- favoritos
- caderno de erros
- flashcards
- dashboard
- trilha

Links de fontes oficiais podem abrir páginas externas, mas o conteúdo local não pode depender dessas chamadas em tempo de uso.

## Design

Interface premium de educação financeira, limpa, moderna, profissional, responsiva e desktop-first com boa experiência mobile.

Manter dark/light mode. Evitar aparência infantil ou template genérico.

## Estrutura principal

Sidebar:

- Dashboard
- Trilha de Estudos
- Conteúdos
- Questões
- Simulados
- Plano de Estudos
- Revisão
- Flashcards
- Caderno de Erros
- Estatísticas
- Fontes e Atualizações
- Configurações

Topo com seletor de certificação, preparado para expansão futura.

## Dashboard

Usar apenas dados locais reais. Não inventar números.

Mostrar conforme houver dados:

- nome
- certificação
- progresso geral
- aulas estudadas
- progresso por macrotema
- mini quizzes realizados
- questões respondidas quando aplicável
- taxa de acerto
- tempo estudado
- streak
- última atividade
- continuar estudando
- simulados e assuntos fracos quando existirem dados suficientes

Estados sem histórico devem aparecer como vazios, não como mocks.

## Trilha

Representar todo o Programa Detalhado e preservar hierarquia PD.

Estados:

- Não iniciado
- Em andamento
- Estudado
- Dominado

Nós-pai agregam dinamicamente o status dos itens estudáveis abaixo deles.

## Sistema de aulas

Cada aula completa deve conter:

1. Em uma frase
2. Explicação para iniciante
3. Explicação completa
4. Conceitos essenciais
5. Como pode aparecer na prova
6. Exemplo prático
7. Comparações importantes
8. Fórmulas quando aplicável
9. Pegadinhas
10. Resumo para revisão
11. Flashcards
12. Mini quiz
13. Fontes oficiais

Sempre apresentar nome completo antes da primeira ocorrência relevante de uma sigla.

Recursos:

- Marcar como estudado
- Tenho dúvida
- Favoritar
- Treinar este assunto
- Aula anterior / próxima aula
- índice lateral
- busca por título, palavra, conceito, sigla e PD Code

`Treinar este assunto` deve direcionar ao Question Engine filtrado pelo PD quando existirem questões correspondentes.

Conteúdo regulatório deve exibir `Verificado em: DD/MM/YYYY` e fonte.

Critério atual de status:

- abrir pela primeira vez → Em andamento
- marcar como estudada → Estudado
- Estudado + melhor mini quiz >= 75% → Dominado

## Conteúdo atual de aulas

O mecanismo de aulas está implementado para os 105 itens terminais do Macrotema 1.

Macrotemas 2, 3 e 4 continuam no currículo/trilha, mas ainda não possuem aulas completas. O Question Engine pode conter questões desses macrotemas porque cada questão é ancorada diretamente no Programa Detalhado e em fontes oficiais.

## Busca

A busca de aulas deve localizar por:

- título
- palavra/conceito
- sigla
- PD Code

A busca de questões pode localizar por ID, PD, tema/subtema, contexto, comando e conceito.

## Tempo e streak

Não contar indefinidamente tempo de aba aberta.

Usar visibility API, atividade recente e sessões de estudo.

Dia de streak só conta por atividade significativa, como concluir aula, responder mini quiz, revisar flashcard, responder questão ou concluir simulado. Abrir o site sozinho não conta.

## Question Engine — implementado

Antes de criar ou ampliar o banco de questões, estudar novamente:

1. Programa Detalhado CPA vigente da ANBIMA;
2. Guia de Elaboração de Questões das Certificações ANBIMA;
3. Caderno de Questões CPA publicado pela própria ANBIMA;
4. modelos interativos/árvores de diálogo oficiais da ANBIMA.

Materiais públicos de cursos e simulados podem ser consultados apenas para calibrar extensão, dificuldade e linguagem. Nunca copiar questões privadas, vazadas, comerciais ou de terceiros.

O banco inicial possui **100 questões originais**:

- Tema 1: 20
- Tema 2: 40
- Tema 3: 30
- Tema 4: 10
- dificuldade: 30 fáceis, 45 médias, 25 difíceis
- cognição: 30 compreensão, 45 aplicação, 25 análise
- tipo: 70 `multiple_choice`, 20 `case`, 10 `dialog_tree`
- posição do gabarito: 25 em A, 25 em B, 25 em C, 25 em D

Toda questão deve possuir:

- certification: `CPA`
- pdCode existente no currículo
- macroTopic
- topic
- difficulty
- cognitiveLevel
- questionType
- context
- prompt
- exatamente quatro options únicas
- exactly one correctAnswer válido
- explanation
- whyOthersAreWrong alinhado às quatro alternativas
- pelo menos uma officialSource
- verifiedAt

Regras pedagógicas:

- priorizar situações reais de atendimento e mercado;
- contexto deve ser relevante, não decorativo;
- comando claro e direto;
- distratores plausíveis no mesmo universo semântico da resposta correta;
- evitar respostas óbvias, pistas gramaticais, absolutos artificiais, negativas desnecessárias e pegadinhas;
- nunca usar `todas as anteriores` ou `nenhuma das anteriores`;
- avaliar aplicação/análise sempre que o PD permitir, em vez de memorização isolada;
- `dialog_tree` deve representar decisões em conversa/atendimento, inspirado no formato oficial sem copiar exemplos.

Página Questões deve oferecer filtros por:

- Tema
- Subtema
- Dificuldade
- Tipo
- Não respondidas
- Erradas
- Favoritas

Após responder, mostrar:

- correto/incorreto
- resposta correta
- explicação
- motivo das alternativas incorretas
- PD correspondente
- fontes oficiais e data de verificação
- botão Revisar conteúdo

Toda tentativa é registrada no IndexedDB. Questão incorreta entra automaticamente no Caderno de Erros, com recorrência de erro. Favoritos também são locais.

Validação automática deve impedir merge quando:

- total/distribuições esperadas divergirem;
- PD Code não existir;
- fonte estiver ausente;
- houver alternativa duplicada;
- correctAnswer não apontar para exatamente uma das quatro alternativas;
- enunciado completo estiver duplicado;
- houver `todas as anteriores` ou `nenhuma das anteriores`;
- distribuição de posição do gabarito ficar previsível na versão atual.

## Modo Prova e Simulados — implementado na v0.6

### Modo Prova CPA

Configuração oficial atualmente verificada:

- 50 questões
- 2h30
- corte 35/50
- composição local: 10 questões do Tema 1, 20 do Tema 2, 15 do Tema 3 e 5 do Tema 4

A interface de prova deve ficar fora da navegação normal e mostrar apenas recursos compatíveis com prova:

- cronômetro
- questão atual
- navegação numérica
- respondida
- não respondida
- marcada para revisão
- anterior
- próxima
- marcar/desmarcar para revisão
- bloco de notas
- calculadora
- finalizar

Durante a prova nunca mostrar:

- correção imediata
- dica
- macrotema/assunto
- dificuldade
- resposta correta
- explicação

O cronômetro é calculado a partir do `startedAt`, portanto reload da página não reinicia o tempo. Ao chegar a zero, finalizar automaticamente.

Ao finalizar mostrar:

- acertos / total
- percentual
- APROVADO/REPROVADO apenas no Modo Prova oficial
- corte 35
- desempenho por Tema 1–4
- tempo utilizado
- questões erradas
- questões em branco
- questões marcadas
- desempenho por dificuldade
- desempenho por PD
- links para revisar conteúdo e refazer questões

Respostas incorretas entram automaticamente no Caderno de Erros. Questões deixadas em branco contam como não acertadas no resultado, mas não entram no Caderno de Erros como erro conceitual.

### Modos adicionais

Implementados:

- Simulado 10 — 2/4/3/1 por tema, 30 min
- Simulado 20 — 4/8/6/2 por tema, 60 min
- Simulado por tema — até 20 questões do macrotema escolhido
- Simulado assuntos fracos — prioriza PDs e macrotemas com erros no histórico local
- Simulado somente questões inéditas — exclui questões já vistas no Question Engine ou em simulados anteriores

Os modos adicionais não exibem selo APROVADO/REPROVADO nem corte inventado, porque o corte oficial 35/50 vale para o exame CPA completo.

### Histórico

Salvar cada simulado no IndexedDB com:

- modo
- questionIds
- respostas
- questões marcadas
- notas
- startedAt
- duração
- resultado
- desempenho por tema
- dificuldade
- PD
- tempo utilizado

A página `Simulados > Histórico` deve mostrar gráfico de evolução, média, melhor resultado e acesso ao detalhamento de cada tentativa.

## Study Engine e Revisão — implementado na v0.7

A página **Revisão** é alimentada por um Study Engine local e determinístico.

Objetivos:

- calcular domínio 0–100 por PD;
- manter confiança separada do score para não tratar pouca evidência como domínio sólido;
- respeitar a hierarquia completa do Programa Detalhado;
- decidir automaticamente o que estudar hoje;
- priorizar erros pendentes, dúvidas, revisões vencidas e lacunas relevantes;
- ponderar o domínio geral pelos pesos oficiais 20/40/30/10;
- usar a meta diária configurada pelo aluno para dimensionar o plano;
- criar revisão espaçada com intervalos heurísticos de 1 a 30 dias;
- usar simulados completos recentes como uma das evidências do indicador interno de preparação.

Evidências aceitas pelo motor:

- status/progresso de aula;
- melhor mini quiz;
- tentativas de questões;
- respostas em simulados;
- recência;
- dúvidas;
- erros ainda não resolvidos.

O score de preparação nunca deve ser apresentado como garantia de aprovação.

As recomendações do plano diário só podem apontar para ações realmente disponíveis na versão atual. Não recomendar uma aula inexistente dos Macrotemas 2–4; quando houver questão ancorada nesses PDs, usar treino de questões.

Um snapshot compacto por dia é salvo em `studyPlans`, store já existente desde v1. Não foi necessária migration de schema na v0.7.

## Central de Revisão, Flashcards e Caderno de Erros — implementado na v0.8

### Central de Revisão

A página **Revisão** combina o Study Engine da V7 com uma fila operacional priorizada por:

- flashcards vencidos;
- questões erradas;
- erros recorrentes;
- baixo desempenho;
- dúvidas;
- conteúdos antigos/não dominados que já possuem evidência de estudo.

Modos:

- 5 minutos;
- 10 minutos;
- 20 minutos;
- Revisão de Véspera.

A Revisão de Véspera não deve introduzir matéria nova. Só pode usar conteúdo já ativado/estudado, erros, flashcards vencidos e pontos fracos.

Cada sessão congela a fila escolhida no início para evitar reordenação enquanto o aluno revisa.

### Flashcards

O conteúdo dos flashcards oficiais das aulas continua no GitHub e não deve ser duplicado no IndexedDB.

Flashcards de aula são ativados quando a aula correspondente é aberta. Flashcards pessoais podem existir apenas localmente.

Avaliações obrigatórias:

- Again;
- Hard;
- Good;
- Easy.

Cada nova revisão deve persistir:

- lastReviewed;
- nextReview;
- interval;
- ease;
- reviewCount;
- correctStreak.

Manter histórico completo de revisões. Backups antigos com o campo legado `nextReviewAt` devem continuar compatíveis.

A heurística de repetição espaçada é local e transparente; não deve ser apresentada como modelo científico infalível.

### Caderno de Erros

Respostas incorretas do Question Engine e dos simulados entram automaticamente no mesmo Caderno de Erros.

Registros novos preservam:

- questionId;
- pdCode;
- date/criado em;
- selectedAnswer;
- correctAnswer;
- attemptCount;
- errorCount;
- lastErrorAt;
- resolved/resolvedAt;
- recorrência.

Estados de revisão:

- Ainda tenho dúvida;
- Entendi;
- Revisar depois.

Nenhum desses estados apaga o histórico. Se uma questão marcada como entendida for errada novamente, o erro deve ser reaberto automaticamente.

Erros recorrentes e erros marcados como dúvida devem receber prioridade maior na Central de Revisão.

### Persistência da V8

A V8 reutiliza os stores locais existentes `flashcardReviews`, `flashcards`, `errors` e `studyPlans`. Não foi necessária migration de schema; `DB_VERSION` permanece 2.

Testes obrigatórios da V8:

- agendamento Again/Hard/Good/Easy;
- compatibilidade com reviews legados;
- histórico/persistência dos flashcards;
- ativação de flashcards conforme aula estudada;
- priorização da fila;
- orçamento dos modos 5/10/20;
- Revisão de Véspera sem conteúdo novo;
- estados e reabertura do Caderno de Erros.

## Study Engine e Prontidão para a Prova — implementado na v0.9

A V9 refina o Study Engine sem IA externa, sem API e sem backend. Todo cálculo é determinístico, local e baseado no histórico real do IndexedDB.

### Domínio por PD

Cada PD mantém score interno de domínio 0–100, confiança e suficiência da amostra.

Evidências permitidas:

- aula/progresso;
- mini quiz;
- questões, com peso por dificuldade e recência;
- erros e recorrência;
- simulados;
- flashcards;
- tempo desde a última evidência/revisão.

Abrir uma aula, concluir uma aula ou obter um único acerto nunca pode produzir domínio alto sozinho.

Níveis obrigatórios e centralizados:

- 0–29: Fraco;
- 30–59: Em aprendizado;
- 60–79: Bom;
- 80–100: Dominado.

O motor deve distinguir `insufficient`, `partial` e `sufficient`. Quando a amostra for insuficiente, a UI deve escrever **Dados insuficientes** em vez de apresentar uma precisão artificial.

### Dificuldade, recência e simulados

Questões difíceis têm peso maior que questões médias e fáceis na evidência prática.

Evidências recentes têm peso maior que evidências antigas.

Respostas de simulados entram no domínio por PD. Modo Prova completo deve ter peso maior do que simulados curtos, e resultados completos recentes devem ter prioridade na Prontidão CPA.

### Falsa confiança

Detectar quando o aluno marcou/atingiu aula como estudada ou dominada, mas possui amostra prática suficiente com baixo desempenho.

Mensagem obrigatória:

> Estudado, mas precisa de prática.

Falsa confiança deve aumentar a prioridade de treino/revisão e aparecer no Dashboard/Central de Revisão.

### Prontidão CPA

Criar indicador `Prontidão CPA` 0–100 apenas quando houver amostra mínima.

Fatores:

- cobertura do edital;
- domínio dos PDs;
- simulados completos;
- desempenho recente;
- consistência;
- equilíbrio entre os macrotemas.

O domínio geral continua ponderado pelos pesos oficiais:

- Tema 1: 20%;
- Tema 2: 40%;
- Tema 3: 30%;
- Tema 4: 10%.

Se os dados forem insuficientes, não inventar score: mostrar **Dados insuficientes**.

Disclaimer obrigatório:

> Indicador interno baseado no seu desempenho na plataforma. Não é garantia de aprovação.

O indicador serve para orientar estudo e nunca deve ser descrito como previsão de aprovação.

### Recomendações e fraquezas

Gerar no máximo **3 recomendações** por vez, sempre justificadas por dados reais.

Exemplos de justificativa aceitável:

- baixo acerto recente;
- erros recorrentes;
- falsa confiança;
- revisão vencida;
- falta de prática suficiente;
- PD relevante ainda sem evidência.

Manter ranking de pontos fracos com PD, macrotema, domínio, amostra, acurácia quando houver, erros e motivo.

### Persistência da V9

Persistir snapshot diário compacto no store `studyPlans`, incluindo prontidão, breakdown, recomendações e fraquezas.

A V9 reutiliza os stores existentes. Não foi necessária migration; `DB_VERSION` permanece 2.

### Testes obrigatórios da V9

Cobrir, no mínimo:

- estado vazio com Dados insuficientes;
- aula isolada sem domínio artificial;
- falsa confiança;
- peso maior de questão difícil;
- efeito moderado de flashcards;
- peso maior de simulado completo recente;
- faixas Fraco / Em aprendizado / Bom / Dominado;
- máximo de 3 recomendações;
- prontidão somente com amostra suficiente;
- compatibilidade com a Central de Revisão V8;
- persistência do snapshot diário.

## Plano de Estudos para a Data da Prova — implementado na v0.10

A V10 adiciona planejamento adaptativo e local, sem IA externa, backend ou API paga.

### Entradas

O aluno pode informar:

- data prevista da prova;
- dias da semana disponíveis;
- minutos por dia;
- data de início, opcional.

A data da prova é opcional. Sem data definida, a plataforma deve continuar útil em um plano contínuo e nunca inventar contagem regressiva.

### Evidências usadas

O plano deve considerar:

- Programa Detalhado e pesos oficiais 20% / 40% / 30% / 10%;
- progresso e cobertura;
- domínio e prontidão da V9;
- erros e recorrência;
- flashcards/revisões;
- simulados;
- tempo disponível por sessão;
- dias restantes e dias da semana disponíveis.

### Fases obrigatórias

Quando houver data e tempo suficiente, distribuir o cronograma entre:

1. Fundamentos;
2. Cobertura;
3. Prática;
4. Consolidação;
5. Simulados;
6. Revisão final.

Com janelas curtas, comprimir as fases sem remover prática, simulados e revisão final. A proximidade da prova deve aumentar proporcionalmente a presença de simulados e reduzir introdução de conteúdo novo.

### Agenda diária

Gerar agenda clicável com:

- data;
- fase;
- minutos planejados;
- atividades;
- rota direta para a funcionalidade correspondente.

Rotas podem levar a:

- aula/trilha;
- questões;
- revisão;
- flashcards;
- Caderno de Erros;
- Simulados.

Nenhuma tarefa pode ultrapassar a disponibilidade diária configurada.

### Recálculo

O plano deve ser derivado do estado atual, não de uma agenda rígida.

Recalcular quando houver:

- atraso em relação ao cronograma;
- avanço acima do esperado;
- melhora ou piora de domínio/desempenho;
- novos erros;
- revisões vencidas;
- mudança de data;
- remoção da data.

Usuário adiantado deve deslocar relativamente mais tempo para prática, consolidação e simulados. Usuário atrasado deve comprimir cobertura e priorizar lacunas de maior impacto sem abandonar prática.

### Funcionamento sem data

Sem prova definida:

- gerar janela móvel de 14 sessões disponíveis;
- usar dias e minutos configurados;
- escolher fases de acordo com cobertura e domínio atuais;
- não exibir dias restantes;
- não ativar artificialmente uma Revisão Final.

### Persistência e backup

Reutilizar `studyPlans`:

- `exam-plan:settings` para configuração;
- `exam-plan:current` para snapshot gerado.

Esses registros já entram no backup JSON porque `studyPlans` faz parte do backup v2.

Não foi necessária migration do IndexedDB. `DB_VERSION` permanece 2.

### Testes obrigatórios da V10

Cobrir:

- prova em 90 dias;
- prova em 30 dias;
- prova em 7 dias;
- maior proporção de simulados perto da prova;
- aluno atrasado;
- aluno adiantado;
- melhora/piora com recálculo;
- funcionamento sem data;
- alteração de data;
- remoção de data;
- persistência e inclusão no backup;
- limite de minutos por sessão;
- rotas clicáveis válidas.

## Central de Atualizações Oficiais — implementado na v0.11

A V11 adiciona monitoramento de fontes oficiais sem tornar o estudo dependente de rede e sem permitir reescrita automática de conteúdo regulatório.

### Manifesto

Manter `content/sources.json` como catálogo versionado das fontes oficiais monitoradas.

Cada fonte deve possuir, no mínimo:

- id/sourceId;
- instituição;
- título;
- URL oficial;
- tipo/categoria;
- certification;
- sourceType;
- lastVerified;
- knownVersion quando aplicável;
- fingerprintMode;
- scope;
- topics;
- note/status.

Fontes centrais obrigatórias:

- Programa Detalhado CPA;
- página oficial dos Programas Detalhados;
- edital de exames vigente;
- Guia de Elaboração de Questões;
- Caderno de Questões CPA.

### Política obrigatória

O monitor nunca pode:

- reescrever aulas;
- alterar questões;
- trocar PD Codes;
- alterar regras do Modo Prova;
- mudar gabaritos;
- atualizar versões automaticamente.

Toda mudança detectada deve virar **sinal para revisão humana**.

Falha de internet, timeout, bloqueio por CORS/site ou indisponibilidade de fonte nunca pode impedir o uso offline da plataforma.

### Mapa de impacto

A aplicação deve conseguir mapear uma fonte para o conteúdo potencialmente afetado:

- sourceId;
- pdCode;
- tópicos;
- itens do currículo;
- aulas;
- questões;
- funcionalidades.

O Programa Detalhado deve ser tratado como impacto crítico sobre o currículo completo.

O edital deve ser tratado como impacto crítico sobre Modo Prova/Simulados.

Guia e Caderno de Questões devem ser tratados como impacto de desenho sobre o Question Engine, sem copiar questões oficiais.

### Página Fontes e Atualizações

A rota `/fontes` deve apresentar:

- documentos centrais e versões conhecidas;
- data da última verificação editorial;
- status;
- política de atualização;
- explicação do monitor automático;
- busca por fonte, tema ou PD Code;
- filtro por instituição;
- mapa de impacto expansível;
- links oficiais.

O status mostrado pela aplicação vem do manifesto versionado. A checagem remota ocorre fora do runtime de estudo.

### Checagem remota

`scripts/check-official-sources.mjs` deve:

- funcionar em Node sem dependências pagas;
- usar timeout e concorrência limitada;
- calcular fingerprint de conteúdo ou metadados;
- manter estado anterior separado;
- gerar relatório JSON local;
- detectar baseline, unchanged, changed e unreachable;
- sair com sucesso em falhas individuais de rede;
- oferecer modo estrito opcional apenas para mudanças.

`scripts/validate-official-sources.mjs` deve validar estrutura, IDs, domínios oficiais, datas e documentos centrais.

### Automação

Criar workflow `Official Source Watch`:

- execução semanal;
- execução manual;
- Node 22;
- cache do estado anterior;
- relatório como artifact;
- resumo visível no GitHub Actions;
- permissão somente de leitura do conteúdo.

O workflow não deve criar commits nem atualizar material didático automaticamente.

### Testes/validação obrigatórios da V11

Cobrir:

- IDs únicos;
- fontes centrais obrigatórias;
- toda fonte usada por aulas/questões presente no manifesto;
- Programa Detalhado impactando os 590 itens;
- guia/caderno de questões mapeados para as 100 questões autorais;
- política `automaticRewrite=false`;
- política `networkFailureBlocksStudy=false`;
- validação estrutural do manifesto;
- monitor tolerando internet indisponível;
- monitor detectando mudança de fingerprint;
- TypeScript strict;
- build de produção.

## Experiência final, offline e facilidade de uso — implementado na v0.12

A V12 é uma etapa de acabamento operacional. Não deve introduzir grande funcionalidade acadêmica nova nem alterar conteúdo regulatório já validado.

### Objetivo

Felipe e Thó devem conseguir usar a mesma base de código em computadores separados, com progresso independente e local, sem login, Supabase, Firebase, servidor remoto ou API paga.

Fluxo esperado no Windows para uma instalação já configurada:

1. duplo clique em `start-cpa.bat`;
2. navegador abre a aplicação;
3. estudar normalmente;
4. fechar sem perder progresso.

Para atualizar:

1. fechar o servidor local;
2. executar `update-cpa.bat`;
3. fazer pull somente por fast-forward;
4. sincronizar dependências;
5. preservar IndexedDB.

### Scripts Windows

`start-cpa.bat` deve:

- trabalhar a partir da própria pasta do projeto;
- validar `package.json`, Node e npm;
- exigir Node.js 22 ou superior;
- instalar dependências apenas quando `node_modules` não existir;
- iniciar Vite e abrir o navegador;
- não executar reset, limpeza ou qualquer operação no IndexedDB.

`update-cpa.bat` deve:

- validar Git, Node e npm;
- recusar atualização automática quando houver alterações locais não commitadas;
- usar `git pull --ff-only`;
- executar `npm install --no-audit --no-fund`;
- nunca usar `git reset --hard`, `git clean -f` ou comando destrutivo equivalente;
- explicar claramente que o progresso do navegador não é apagado.

### PWA e offline

O PWA deve:

- manter cache versionado;
- limpar caches obsoletos;
- precachear assets empacotados;
- suportar fallback de navegação para `index.html`;
- atualizar o service worker de forma segura;
- não depender de rede para o conteúdo local já empacotado.

A interface deve detectar `navigator.onLine` e mostrar estado offline informativo. Estar offline não pode bloquear aulas, questões, simulados, revisão, flashcards, Dashboard, trilha ou progresso local.

### Performance

Aplicar code splitting/lazy loading nas páginas pesadas para reduzir o bundle inicial.

Manter fallback de carregamento consistente e não exibir tela branca enquanto chunks são carregados.

### Tratamento de erro

Adicionar Error Boundary global.

Se houver falha inesperada de renderização:

- informar que os dados locais continuam preservados;
- permitir recarregar;
- permitir voltar ao início;
- nunca sugerir apagar o IndexedDB como correção automática.

### Acessibilidade

Obrigatório:

- link para pular ao conteúdo principal;
- `main` identificável e focável;
- `nav`/menus com labels;
- menu mobile fechável por Esc;
- controles principais com aria-label quando necessário;
- foco visível;
- respeitar `prefers-reduced-motion`;
- mensagens de conectividade com região semântica/aria-live.

### Backup

O backup continua na versão v2 e deve manter compatibilidade com v1.

A V12 deve:

- validar estrutura interna dos stores, não somente o envelope;
- continuar cobrindo todos os dados pessoais atuais;
- limitar tamanho de arquivo importado para evitar importação acidental excessiva;
- mostrar resumo antes da confirmação;
- rejeitar backup de `databaseVersion` futura;
- garantir por teste que uma rejeição de versão futura não apaga os dados atuais;
- garantir roundtrip representativo de todos os stores.

Não criar migration se não houver mudança real do schema. `DB_VERSION` deve continuar 2.

### Validação da experiência V12

Criar validação estática para garantir:

- existência e segurança dos scripts Windows;
- ausência de comandos destrutivos no atualizador;
- configuração PWA/cache;
- lazy loading;
- Error Boundary;
- estado offline;
- skip link;
- foco visível e reduced motion;
- documentação simples para o Thó.

A validação entra no CI como `npm run validate:experience`.

### Exclusões

A V12 não deve:

- adicionar ranking Felipe x Thó;
- adicionar IA;
- adicionar API paga;
- adicionar servidor remoto;
- adicionar login;
- implementar outra certificação;
- reescrever conteúdo regulatório;
- alterar a arquitetura local-first.

## Auditoria Final — implementada na v0.13

A V13 não cria uma nova grande funcionalidade acadêmica. Ela audita e estabiliza o estado acumulado das versões anteriores.

### Escopo obrigatório

Auditar:

- Programa Detalhado oficial vigente;
- edital vigente;
- currículo e pesos;
- aulas e flashcards;
- Question Engine;
- Modo Prova e simulados;
- IndexedDB e migrations;
- sobrevivência do progresso após update;
- backup/importação;
- PWA/offline;
- performance/code splitting;
- acessibilidade e UX;
- código morto e resíduos de arquitetura antiga;
- links/fontes oficiais;
- instalação e atualização no computador do Thó.

### Relatório

Manter `AUDIT_REPORT.md` com:

- data;
- base oficial;
- inventário de cobertura;
- status por subsistema;
- problemas encontrados;
- correções aplicadas;
- pendências reais;
- critério de fechamento.

O relatório deve distinguir **pronto operacionalmente** de **conteúdo academicamente completo**.

### Resíduos proibidos

A V13 deve remover:

- referências antigas a Supabase/Firebase sem uso;
- variáveis `VITE_SUPABASE_*`;
- módulos placeholder vazios;
- TODO/FIXME conhecidos quando puderem ser resolvidos no escopo;
- comandos destrutivos no atualizador.

### PWA

Como `start-cpa.bat` usa o servidor Vite local, habilitar o service worker também no modo de desenvolvimento para manter coerência com a experiência PWA/offline descrita.

### Validação automática

Adicionar `npm run audit:v13` ao CI.

A auditoria estática deve falhar se:

- versão do app não for 0.13.0;
- versões oficiais centrais divergirem do estado verificado;
- stores locais obrigatórios desaparecerem;
- DB_VERSION deixar de ser 2 sem migration planejada;
- surgir dependência Supabase/Firebase;
- voltar referência antiga de backend em `src`;
- voltar módulo placeholder vazio conhecido;
- sumir rota principal;
- backup perder proteções da V12;
- updater ganhar comando destrutivo;
- PWA perder cache/fallback/dev mode;
- documentação deixar de registrar contagens e fluxo do Thó.

### Pendências que a V13 não deve mascarar

Registrar explicitamente:

- aulas completas existem atualmente apenas para o Macrotema 1;
- Estatísticas avançadas ainda não estão implementadas;
- expansão do banco de questões é futura;
- demais certificações são futuras;
- ranking Felipe × Thó permanece fora do escopo atual.


## Roadmap CPA-only V14–V21 — implementado

Até nova decisão explícita, o projeto permanece focado exclusivamente na CPA. O objetivo deste ciclo é profundidade acadêmica e qualidade de estudo, não expansão de certificações.

### V14 — Produtos de investimentos

Completar todas as aulas terminais do bloco 2.1:

- renda fixa;
- renda variável;
- COE;
- fundos de investimento;
- tributação de fundos;
- FIIs.

O Lesson Engine deve deixar de assumir que apenas o Macrotema 1 possui aula.

### V15 — Previdência e crédito

Completar:

- 2.2 Produtos de Previdência Complementar;
- 2.3 Produtos de financiamento.

### V16 — Serviços bancários e seguros

Completar:

- 2.4 Serviços bancários;
- 2.5 Seguros de vida e patrimoniais.

Ao final da V16, o Macrotema 2 deve possuir 167 aulas terminais completas.

### V17 — Relacionamento com o cliente

Completar todas as 110 aulas terminais do Macrotema 3, incluindo:

- planejamento financeiro;
- orçamento, crédito e reserva;
- perfil e adequação;
- suitability;
- ética e atendimento;
- conflitos de interesse;
- riscos operacionais/regulatórios;
- PLD/FTP e KYC;
- LGPD e sigilo bancário;
- ilícitos e abusos de mercado.

### V18 — Inovação e desenvolvimento de mercado

Completar as 63 aulas terminais do Macrotema 4, incluindo:

- ESG;
- investimentos sustentáveis;
- blockchain;
- smart contracts;
- tokenização;
- criptoativos e Drex;
- Open Finance;
- IA e machine learning;
- fintechs;
- ecossistema de pagamentos.

Ao final da V18 devem existir exatamente:

- 445 aulas terminais;
- 105 no Tema 1;
- 167 no Tema 2;
- 110 no Tema 3;
- 63 no Tema 4;
- 4 flashcards por aula;
- 3 perguntas de mini quiz por aula.

### V19 — Question Bank 2.0

Preservar as 100 questões autorais existentes e acrescentar cobertura autoral de todos os 445 PDs terminais.

Requisitos:

- mínimo de uma questão por PD terminal;
- tipos multiple_choice, case e dialog_tree;
- foco em aplicação profissional;
- distratores plausíveis;
- nenhuma questão privada ou vazada;
- materiais públicos ANBIMA usados apenas como referência de estilo;
- PD, fonte, dificuldade, cognição e explicações obrigatórios;
- validação contra duplicatas e atalhos proibidos.

Estado esperado: 545 questões totais.

### V20 — Estatísticas avançadas

Substituir o placeholder de Estatísticas por análises locais baseadas em dados reais:

- acurácia acumulada;
- acurácia recente;
- desempenho por macrotema;
- desempenho por dificuldade;
- evolução de simulados;
- heatmap de PDs;
- erros recorrentes;
- tempo ativo;
- associação descritiva entre tempo e prática.

Quando a amostra não existir, mostrar ausência de dados em vez de inventar score.

### V21 — Estudo Ativo

Criar uma Central de Estudo Ativo que reutilize os motores existentes:

- interleaving entre temas;
- treino por fraquezas;
- recuperação ativa por flashcards;
- revisão de véspera;
- repetição espaçada;
- busca por conceitos e fórmulas;
- links para aula completa.

O modo intercalado curto deve preservar aproximadamente a distribuição oficial 20/40/30/10.

### Integração obrigatória do ciclo

Ao fim da V21:

- Dashboard deve reconhecer 445 aulas;
- Trilha deve abrir aula de qualquer PD terminal;
- Contents/Lesson devem cobrir os quatro temas;
- Study Engine deve considerar 445 aulas e 545 questões;
- Central de Revisão deve ativar flashcards de qualquer tema estudado;
- Plano de Estudos deve poder recomendar qualquer PD;
- Question Engine deve revisar conteúdo em qualquer tema;
- Central de Fontes deve mapear todas as fontes usadas;
- backup e IndexedDB devem continuar compatíveis;
- DB_VERSION continua 2 porque nenhuma store nova é necessária.

### Validação final V21

Obrigatório:

- `npm run validate:curriculum`;
- `npm run validate:lessons`;
- `npm run validate:questions`;
- `npm run validate:sources`;
- `npm run validate:experience`;
- `npm run audit:v13`;
- `npm run validate:v21`;
- `npm test`;
- `npm run lint`;
- `npm run typecheck`;
- `npm run build`.

A V21 só é concluída quando branch final e `main` estiverem verdes.

## Política de CI e commits — obrigatória a partir da V9

Esta regra vale para todas as próximas versões, branches e conversas que trabalhem neste repositório.

Evitar fazer push de estados intermediários quebrados. Arquivos que dependem uns dos outros devem ser implementados e validados em conjunto antes do commit/push.

Antes de **cada push**, executar localmente todos os checks relevantes disponíveis no projeto, incluindo no mínimo:

- `npm test`
- `npm run typecheck`
- `npm run build`

E, quando existirem/aplicarem:

- `npm run lint`
- `npm run validate:curriculum`
- `npm run validate:questions`
- `npm run validate:sources`
- `npm run validate:experience`
- `npm run audit:v13`
- demais scripts de validação adicionados por versões futuras

Se qualquer check falhar:

1. não fazer push ainda;
2. corrigir a causa real;
3. executar novamente a suíte relevante;
4. só então commitar e enviar.

Evitar o padrão:

`commit A incompleto → CI falha → commit B completa dependência → CI falha → commit C corrige`.

Preferir:

`implementar conjunto dependente localmente → testar → corrigir → commit funcional → push`.

Não desabilitar testes, typecheck, validações ou reduzir cobertura apenas para obter CI verde.

Commits pequenos continuam permitidos quando forem **autocontidos e verdes**. Não agrupar mudanças não relacionadas apenas para reduzir quantidade de commits.

Ao concluir cada versão:

- executar a suíte completa;
- confirmar que o último commit da branch está verde no GitHub Actions;
- somente então considerar a versão concluída ou pronta para merge.

Falhas antigas de commits intermediários não exigem reescrita do histórico se um commit posterior corrigiu a causa e o estado final da branch está verde.

## PWA

Permitir instalação e uso offline dos conteúdos, questões e simulados já empacotados. Não exigir sincronização remota.

## Qualidade

Obrigatório:

- TypeScript strict
- componentes reutilizáveis
- validação de dados
- tratamento de erros
- loading/empty states
- responsividade
- testes de persistência local
- testes do Question Engine
- testes do Simulation Engine
- nenhum segredo ou chave obrigatória

Antes de concluir uma mudança relevante:

1. ler o repositório relevante;
2. preservar funcionalidades boas;
3. implementar sem duplicatas;
4. executar validação curricular;
5. executar validação de questões quando aplicável;
6. executar testes;
7. executar typecheck;
8. executar build;
9. corrigir erros antes de atualizar `main`;
10. documentar mudanças e pendências reais.

Não deixar TODOs quando for possível concluir a implementação.
