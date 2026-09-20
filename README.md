# CPA Study — Nova CPA ANBIMA 2026

Plataforma local e gratuita de estudos para a **CPA — Certificado Profissional ANBIMA** do novo modelo vigente em 2026. Não é material da antiga CPA-10 ou CPA-20.

## Arquitetura atual

- React + TypeScript + Vite + Tailwind CSS
- IndexedDB via `idb` para progresso pessoal
- conteúdo, currículo e banco base de questões versionados no GitHub
- PWA para facilitar uso offline depois que os arquivos da aplicação foram carregados
- sem login, sem cadastro, sem Supabase/Firebase e sem servidor obrigatório
- custo operacional obrigatório: **R$ 0**

Princípio:

- **GitHub = conteúdo da plataforma**
- **IndexedDB do navegador = progresso, tentativas, favoritos, simulados e erros do aluno**

Felipe e Thó usam o mesmo código, mas cada computador/navegador possui progresso próprio.

## Como rodar

```bash
git clone https://github.com/felipeortuzal/CPA.git
cd CPA
npm install
npm run dev
```

No Windows também existe `start-cpa.bat`. Para atualizar: `git pull`, `npm install` e `npm run dev`. O `git pull` não apaga o IndexedDB do navegador.

## Backup

Em **Configurações > Dados e Backup** é possível exportar `cpa-backup-YYYY-MM-DD.json`, importar com validação/confirmação e apagar o progresso com confirmação forte. A versão atual do backup é v2 e já inclui o store de simulados; backups v1 continuam importáveis.

## Programa e edital oficiais

Currículo versionado:

- Programa Detalhado CPA ANBIMA v1.2
- revisão 04/06/2025
- vigência 01/01/2026
- verificado novamente em 20/09/2026

Modo Prova:

- Edital dos Exames de Certificação Profissional ANBIMA v1.4, de 28/05/2026
- CPA: **50 questões**
- duração: **2h30**
- aprovação: **35 acertos**
- formatos previstos: múltipla escolha, árvore de diálogo e cases

A estrutura completa do PD possui 590 nós curriculares e preserva os PD Codes oficiais.

## Sistema de aulas

O Macrotema 1 possui 105 aulas terminais completas em `content/cpa/lessons/`, com explicações, conceitos, foco de prova, exemplos, comparações, fórmulas, pegadinhas, revisão, flashcards, mini quiz e fontes oficiais.

Status local: Não iniciado → Em andamento → Estudado → Dominado. Domínio exige aula estudada e melhor mini quiz >= 75%.

## Question Engine

O banco inicial contém **100 questões originais** em `content/cpa/questions/`:

- Tema 1: 20
- Tema 2: 40
- Tema 3: 30
- Tema 4: 10
- dificuldade: 30 fáceis, 45 médias, 25 difíceis
- nível cognitivo: 30 compreensão, 45 aplicação, 25 análise
- tipo: 70 `multiple_choice`, 20 `case`, 10 `dialog_tree`
- posição do gabarito: 25 A, 25 B, 25 C, 25 D

A página **Questões** filtra por tema, subtema, dificuldade, tipo, não respondidas, erradas e favoritas. Respostas incorretas entram automaticamente no **Caderno de Erros**.

## Modo Prova e simulados — v0.6

A página **Simulados** oferece:

- Modo Prova CPA — 50 questões, 2h30, corte 35/50
- Simulado 10
- Simulado 20
- Simulado por tema
- Simulado de assuntos fracos
- Simulado somente com questões inéditas

A prova completa usa exatamente 10/20/15/5 questões dos Temas 1/2/3/4, refletindo 20%/40%/30%/10%.

A interface de prova é separada da navegação normal e contém cronômetro, questão atual, mapa de navegação, respondida/não respondida, marcação para revisão, bloco de notas, calculadora e finalização. Durante a prova não mostra gabarito, correção, tema, dificuldade ou dica.

Ao finalizar são exibidos:

- acertos e percentual
- aprovado/reprovado apenas no modo oficial
- corte 35/50 no modo oficial
- desempenho por macrotema
- tempo utilizado
- questões erradas e em branco
- questões marcadas
- desempenho por dificuldade
- desempenho por PD

Erros respondidos incorretamente entram automaticamente no Caderno de Erros. Questões deixadas em branco não são tratadas como erro conceitual no caderno.

O histórico em **Simulados > Histórico** mostra gráfico de evolução, média, melhor resultado e acesso ao detalhamento de cada tentativa.

## Study Engine — v0.7

A página **Revisão** agora é alimentada por um Study Engine local que calcula um score de domínio **0–100 por PD** e um score separado de confiança.

O cálculo usa somente evidências reais já salvas:

- status da aula e mini quiz;
- tentativas de questões;
- respostas em simulados;
- recência do estudo;
- dúvidas marcadas;
- erros ainda não resolvidos.

O motor respeita a hierarquia completa do Programa Detalhado: evidências ancoradas em PDs intermediários também entram no score agregado dos nós-pai. O plano diário, porém, recomenda apenas ações realmente disponíveis na versão atual (aula, treino de questões ou correção de erro).

A V7 gera automaticamente:

- domínio ponderado pelos pesos oficiais 20/40/30/10;
- cobertura com evidência;
- domínio e confiança por PD;
- revisões vencidas;
- assuntos fracos;
- recomendação do que estudar hoje;
- duração sugerida baseada na meta diária configurada;
- ciclos de revisão entre 1 e 30 dias conforme o domínio;
- indicador interno de preparação, combinando domínio, cobertura e os últimos simulados completos.

O indicador de preparação é apenas uma ferramenta de estudo e **não é garantia de aprovação**.

Um snapshot compacto do plano diário é salvo no store `studyPlans`, já existente desde a v1. Não foi necessária nova migration do IndexedDB.

## Central de Revisão, Flashcards e Caderno de Erros — v0.8

A V8 transforma **Revisão**, **Flashcards** e **Caderno de Erros** em um único ciclo de recuperação ativa.

### Central de Revisão

A fila automática combina:

- flashcards vencidos;
- questões erradas ainda pendentes;
- erros recorrentes;
- PDs com baixo domínio;
- dúvidas marcadas;
- conteúdos antigos cuja revisão venceu.

Modos disponíveis:

- 5 minutos;
- 10 minutos;
- 20 minutos;
- Revisão de Véspera — somente conteúdo já visto, sem introduzir matéria nova.

A fila é priorizada, mas cada sessão congela os itens escolhidos no início para não mudar de ordem durante o estudo.

### Flashcards

Os **420 flashcards** das 105 aulas do Macrotema 1 continuam versionados no GitHub. Eles só entram na fila depois que a respectiva aula foi aberta. O IndexedDB guarda apenas o histórico pessoal.

Avaliações:

- `Again`
- `Hard`
- `Good`
- `Easy`

Cada revisão persiste:

- `lastReviewed`
- `nextReview`
- `interval`
- `ease`
- `reviewCount`
- `correctStreak`

O histórico completo de avaliações é mantido. Também é possível criar flashcards pessoais locais.

### Caderno de Erros

Erros do Question Engine e dos simulados preservam histórico e recorrência. Registros novos mantêm, além dos campos legados, `questionId`, data, contagem de tentativas, contagem de erros, último erro e estado resolvido.

Estados de revisão:

- Ainda tenho dúvida
- Entendi
- Revisar depois

Marcar um erro como entendido não apaga seu histórico. Se a mesma questão for errada novamente, o erro é reaberto automaticamente e volta à fila.

A V8 reutiliza os stores `flashcardReviews`, `errors` e `studyPlans` já existentes. **Não foi necessária migration do IndexedDB**, então o progresso anterior é preservado.

## Study Engine e Prontidão CPA — v0.9

A V9 substitui o score simplificado da V7 por um motor de domínio mais conservador e baseado em múltiplas evidências.

Por **PD Code**, o domínio 0–100 agora considera:

- status da aula, sem tratar simples abertura como domínio;
- mini quiz;
- questões recentes, com peso maior para questões difíceis;
- erros pendentes e recorrentes;
- simulados, com peso maior para Modo Prova completo e recente;
- revisões de flashcards;
- recência da evidência e tempo desde revisão.

Níveis centralizados:

- 0–29: Fraco
- 30–59: Em aprendizado
- 60–79: Bom
- 80–100: Dominado

O motor mantém um estado separado de suficiência da amostra. Com pouca evidência, a interface mostra **Dados insuficientes** em vez de inventar uma pontuação precisa.

### Falsa confiança

Aula marcada como estudada/dominada não basta. Quando há prática suficiente e o desempenho continua baixo, o PD recebe o alerta:

> Estudado, mas precisa de prática.

Isso também aumenta sua prioridade na Central de Revisão.

### Prontidão CPA

O Dashboard possui um indicador **Prontidão CPA** de 0–100 apenas quando há dados mínimos. Ele combina:

- cobertura do edital;
- domínio dos PDs, ponderado pelos pesos oficiais 20/40/30/10;
- simulados completos recentes;
- desempenho recente;
- consistência;
- equilíbrio entre os macrotemas.

Simulados completos recentes possuem peso maior. O texto obrigatório é:

> Indicador interno baseado no seu desempenho na plataforma. Não é garantia de aprovação.

Quando a amostra ainda é pequena, aparece **Dados insuficientes**.

O Dashboard também mostra:

- até 3 recomendações de estudo baseadas em dados reais;
- ranking de pontos fracos;
- falsa confiança;
- cobertura com amostra suficiente;
- média recente de Modo Prova.

A V9 continua 100% local/offline e não usa IA externa, API paga ou backend. Não foi necessária migration do IndexedDB; `DB_VERSION` permanece 2.

## Plano de Estudos para a data da prova — v0.10

A V10 adiciona um planejador local e adaptativo em **Plano de Estudos**.

O aluno informa:

- data prevista da prova, quando houver;
- início do plano, opcional;
- dias da semana disponíveis;
- minutos disponíveis por dia.

O plano combina o Programa Detalhado, pesos oficiais, progresso real, domínio V9, erros, flashcards, simulados, tempo disponível e dias restantes.

Fases:

1. Fundamentos
2. Cobertura
3. Prática
4. Consolidação
5. Simulados
6. Revisão final

A agenda diária é clicável e abre diretamente aula, questões, revisão, flashcards, Caderno de Erros ou Simulados.

O plano é recalculado quando:

- o aluno atrasa ou fica adiantado em relação ao tempo restante;
- cobertura/domínio mudam;
- desempenho melhora ou piora;
- surgem novos erros ou revisões;
- a data da prova é alterada ou removida.

Conforme a prova se aproxima, cresce a proporção de dias com simulados e revisão final. O sistema também funciona **sem data da prova**, em uma janela móvel de 14 sessões, sem inventar contagem regressiva.

Configuração e snapshot atual são persistidos no store `studyPlans` e entram automaticamente no backup JSON já existente. **Não foi necessária migration**; `DB_VERSION` permanece 2.

## Central de Atualizações Oficiais — v0.11

A V11 cria uma camada de rastreabilidade e monitoramento das fontes oficiais sem transformar a plataforma em dependente de internet.

### Manifesto oficial

`content/sources.json` registra as fontes oficiais utilizadas ou monitoradas pela CPA, incluindo:

- Programa Detalhado;
- edital dos exames;
- guia de elaboração de questões;
- caderno oficial de questões CPA;
- ANBIMA, Banco Central, CVM, SUSEP, PREVIC, B3, Tesouro Direto, FGC, ANPD, Planalto e demais fontes já usadas no conteúdo.

Cada entrada mantém ID, instituição, título, URL, tipo, data de verificação, versão conhecida quando aplicável, escopo e estratégia de fingerprint.

### Mapa de impacto

A página **Fontes e Atualizações** mostra, por `sourceId`:

- PD Codes afetados;
- quantidade de itens do currículo;
- aulas afetadas;
- questões afetadas;
- tópicos;
- funcionalidades sensíveis, como Modo Prova e Question Engine.

O Programa Detalhado é indexado contra os 590 itens curriculares. O guia e o caderno oficiais de questões são tratados como referências de desenho para as 100 questões autorais.

### Monitor de mudanças

`npm run check:sources`:

1. acessa as fontes com timeout;
2. calcula fingerprint por conteúdo ou metadados;
3. compara com o estado anterior;
4. gera `.source-monitor/report.json`;
5. classifica cada fonte como `baseline`, `unchanged`, `changed` ou `unreachable`.

A primeira execução cria a baseline. Falha de rede não encerra o processo com erro e nunca impede o estudo offline.

Mudança detectada **não altera conteúdo automaticamente**. Ela apenas sinaliza que currículo, aula, questão ou regra de prova associada deve ser revisada por uma pessoa.

### GitHub Actions

O workflow **Official Source Watch** roda semanalmente e também pode ser executado manualmente. Ele:

- valida o manifesto;
- restaura o fingerprint anterior por cache;
- executa a checagem;
- publica resumo no GitHub Actions;
- envia o relatório JSON como artifact por 30 dias.

O workflow não possui permissão para editar aulas ou questões.

A validação estrutural do manifesto (`npm run validate:sources`) faz parte do CI normal e bloqueia IDs duplicados, URLs não oficiais, campos inválidos e divergência das versões centrais atualmente registradas.

## Experiência final, offline e uso simples — v0.12

A V12 não adiciona uma nova grande funcionalidade acadêmica. Ela fecha a experiência operacional para Felipe e Thó: iniciar, atualizar, estudar offline, recuperar backup e usar a plataforma em desktop ou celular sem depender de login ou backend.

### Para o Thó — primeira instalação no Windows

1. Instale **Git** e **Node.js 22 ou superior**.
2. Abra o Prompt de Comando na pasta onde quer guardar o projeto.
3. Execute:

```bash
git clone https://github.com/felipeortuzal/CPA.git
cd CPA
npm install
```

4. Depois disso, para estudar, basta dar duplo clique em **`start-cpa.bat`**.
5. Na primeira abertura, informe **Thó** quando a plataforma perguntar como pode te chamar.

O progresso fica no **IndexedDB do navegador desse computador**. Fechar a janela, desligar o PC, rodar `npm install`, `git pull` ou atualizar o código não apaga esse progresso.

### Uso normal

- **Estudar:** duplo clique em `start-cpa.bat`.
- **Atualizar:** feche o servidor e dê duplo clique em `update-cpa.bat`.
- O atualizador usa `git pull --ff-only`, não executa reset forçado e para se encontrar alterações locais.
- Depois do pull, ele sincroniza as dependências com `npm install`.
- Para levar o progresso a outro computador/navegador, use **Configurações > Dados e Backup**.

### Offline / PWA

O build PWA usa cache versionado `cpa-study-v12`, limpa caches antigos e mantém precache dos assets empacotados. Depois que a aplicação e seus assets já foram carregados, conteúdo local, aulas, questões, simulados e progresso continuam utilizáveis sem conexão.

Quando o navegador fica offline, a interface mostra um aviso discreto. Links e verificações externas podem falhar, mas o estudo local não é bloqueado.

### Segurança do backup

O backup v2 continua cobrindo perfil, aulas, quizzes, tentativas de questões, favoritos, flashcards/revisões, erros, simulados, sessões, streak, preferências e planos de estudo.

A V12 reforça a validação interna do arquivo, limita importações a 25 MB, mostra um resumo antes da confirmação e mantém a importação transacional: se o backup falhar na gravação, a transação não é concluída.

### Acessibilidade e performance

- rotas acadêmicas carregam por **lazy loading/code splitting**;
- fallback de carregamento consistente;
- Error Boundary global com recuperação sem apagar dados;
- link “Pular para o conteúdo principal”;
- navegação principal identificada semanticamente;
- menu mobile fecha com `Esc`;
- foco visível;
- respeito a `prefers-reduced-motion`;
- aviso de estado offline com `aria-live`;
- desktop-first, mantendo responsividade mobile e dark/light mode.

## Persistência local

A camada fica em `src/lib/storage/`. O schema continua em `DB_VERSION = 2` porque o store `simulations` já existia desde v1; esta versão apenas tipa e passa a usar essa estrutura existente.

- v1: perfil, aulas, quizzes, favoritos, flashcards, erros, simulados, sessões, streak, preferências etc.
- v2: adiciona `questionAttempts` com índices por questão, PD e data.

Nunca apagar o banco como estratégia de migration.

## Qualidade

```bash
npm run validate:curriculum
npm run validate:questions
npm run validate:sources
npm run validate:experience
npm test
npm run lint
npm run typecheck
npm run build
```

Ou execute tudo com `npm run validate`.

Os testes cobrem currículo, banco de questões, persistência local, geração dos simulados, composição oficial 10/20/15/5, corte 35, Study Engine V9, prontidão, falsa confiança, plano de estudos V10, cenários de 90/30/7 dias, manifesto/impacto de fontes V11, experiência offline/PWA V12, backup completo, lazy loading e acessibilidade, repetição espaçada, fila de revisão e Caderno de Erros.

## Próximas etapas

Ainda não fazem parte desta versão: analytics avançado, ranking Felipe x Thó, aulas completas dos Macrotemas 2–4 e demais certificações.
