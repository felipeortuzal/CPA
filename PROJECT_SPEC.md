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
- última verificação: 16/09/2026

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
- verificado em: 16/09/2026

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
- Revisão
- Flashcards
- Caderno de Erros
- Estatísticas
- Fontes
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

## Flashcards/revisão — evolução futura

As aulas já contêm flashcards e a arquitetura local suporta reviews, mas a fila completa de repetição espaçada e revisão inteligente pertence às próximas etapas.

## Caderno de Erros — implementado

Respostas incorretas do Question Engine e dos simulados entram automaticamente no mesmo Caderno de Erros. O registro deve preservar questão, PD, resposta dada, resposta correta, data, recorrência e estado resolvido/não resolvido.

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
