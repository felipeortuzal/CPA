# CPA Study — Nova CPA ANBIMA 2026

Plataforma local, gratuita e offline-first para estudar a **CPA — Certificado Profissional ANBIMA** do modelo vigente em 2026.

## Estado atual — v0.23

A plataforma está focada exclusivamente na CPA e contém:

- Programa Detalhado CPA v1.2 estruturado em **590 nós curriculares**;
- **445 aulas completas**, uma para cada PD terminal;
- **1.780 flashcards** de aula, além de flashcards pessoais;
- **545 questões** (100 autorais e 445 exercícios gerados automaticamente; revisão individual pendente);
- cobertura de questões em todos os 445 PDs terminais;
- Treino completo com **50 questões autorais** e 2h30, sem estimativa de aprovação;
- Simulado 10, Simulado 20, por tema, pontos fracos e somente inéditas;
- Indicadores internos de estudo com domínio, confiança e detecção de baixa evidência;
- Plano de Estudos adaptativo à data da prova;
- Central de Revisão, repetição espaçada e Caderno de Erros;
- Estatísticas avançadas e heatmap por PD;
- Estudo Ativo com interleaving, recuperação ativa, treino de fraquezas e revisão de véspera;
- Central de Fontes e Atualizações oficiais;
- PWA, uso offline e backup JSON.

Nenhuma questão privada ou vazada é usada. O banco é autoral e usa materiais públicos da ANBIMA como referência de estilo.

## Base oficial

Referências cadastradas na V21 (data legada: 20/09/2026; isso não comprova revisão individual de cada questão):

- Programa Detalhado CPA ANBIMA v1.2;
- revisão 04/06/2025;
- vigência 01/01/2026;
- distribuição de estudo atualmente configurada:
  - Tema 1: 20%;
  - Tema 2: 40%;
  - Tema 3: 30%;
  - Tema 4: 10%;
- Edital dos Exames de Certificação Profissional ANBIMA v1.4, de 28/05/2026;
- CPA: 50 questões;
- duração: 2h30;
- aprovação: 35 acertos.

O repositório também monitora Guia de Elaboração de Questões, Caderno de Questões CPA e demais fontes regulatórias oficiais usadas nas aulas.

## Abrir o arquivo local — sem instalar nada

1. Baixe **[CPA_Study.html](CPA_Study.html)** (no GitHub, use o botão de baixar arquivo bruto).
2. Guarde em uma pasta fixa e abra com Chrome ou Edge.
3. Informe um nome local ou clique em **Já tenho um backup** para restaurar seu JSON.
4. Use **Configurações → Exportar progresso** ao terminar os estudos.

O arquivo contém a mesma aplicação, aulas e questões do site, inclusive as rotas antes carregadas sob demanda. Funciona sem servidor, npm, instalação ou conexão. Links das fontes exigem internet.

**O progresso fica no navegador, não dentro do HTML.** Não há identificação da máquina ou sincronização entre dispositivos. Antes de mover, renomear ou substituir o HTML, exporte o JSON. O site e o HTML podem ter armazenamentos separados; transfira o progresso por backup. Não use uma janela privada para guardar progresso duradouro.

Para atualizar: exporte o JSON, baixe o HTML novo, abra e importe o backup se necessário. Uma importação substitui os dados locais; pela interface, uma cópia dos dados anteriores é baixada antes da substituição. Backups legados v1/v2 válidos continuam aceitos; payloads malformados são recusados.

### Limites editoriais atuais

As 445 questões de cobertura são geradas por regras e permanecem identificadas como rascunhos. As outras 100 são autorais, também sem conferência individual comprovada nesta auditoria. Os links de referência e datas antigas não constituem validação de gabarito. A aplicação conserva todos os IDs existentes.

Os diálogos atuais são questões objetivas, **não árvores de decisão com ramificações**. O treino completo exclui a cobertura gerada e não mostra aprovação/reprovação. Não há ainda um simulado fiel homologado ao formato oficial. O indicador de estudo é descritivo do desempenho neste banco.

## Acesso pelo site

A plataforma também está preparada para **GitHub Pages**. Depois que o Pages for habilitado no repositório, o acesso será:

```text
https://felipeortuzal.github.io/CPA/
```

Para o Thó, esse é o modo recomendado:

1. abrir o link no Chrome/Edge/Safari;
2. informar o nome na primeira abertura;
3. estudar normalmente;
4. voltar sempre pelo mesmo link e pelo mesmo navegador.

Ele **não precisa instalar Git, Node.js, clonar o repositório ou executar arquivos .bat**.

O aplicativo continua local-first: o site é carregado pelo GitHub Pages, mas **perfil, progresso, respostas, simulados, flashcards, erros e planos ficam no IndexedDB do navegador dele**. O seu progresso e o dele continuam separados.

As rotas usam hash routing, então páginas internas continuam funcionando no GitHub Pages sem servidor próprio. A PWA continua podendo ser instalada pelo navegador se vocês quiserem, mas isso é opcional.

> Importante: limpar os dados do site/navegador pode apagar o progresso local. Para segurança, use Configurações > Dados e Backup periodicamente.

## Como abrir — Felipe

Se o projeto já está instalado:

1. feche qualquer janela antiga do servidor CPA;
2. dê duplo clique em **`update-cpa.bat`** para trazer a versão mais recente;
3. quando terminar, dê duplo clique em **`start-cpa.bat`**;
4. o navegador abrirá automaticamente.

O progresso salvo no navegador não é apagado pelo update.

Também é possível usar o terminal:

```bash
git pull --ff-only
npm install --no-package-lock
npm run dev
```

## Para o Thó — primeira instalação

Requisitos:

- Git;
- Node.js 22 ou superior.

No Prompt de Comando:

```bash
git clone https://github.com/felipeortuzal/CPA.git
cd CPA
npm install --no-package-lock
```

Depois da primeira instalação:

- **estudar:** duplo clique em `start-cpa.bat`;
- **atualizar:** duplo clique em `update-cpa.bat`.

Na primeira abertura, basta informar o nome. Não existe login ou cadastro remoto.

Cada computador/navegador possui seu próprio progresso.

## Como os dados funcionam

Princípio da arquitetura:

- **GitHub = conteúdo da plataforma**;
- **IndexedDB do navegador = progresso pessoal**.

O IndexedDB salva:

- perfil local;
- aulas e mini quizzes;
- respostas de questões;
- favoritos;
- flashcards e revisões;
- Caderno de Erros;
- simulados;
- tempo ativo;
- streak;
- preferências;
- planos de estudo.

O schema continua em `DB_VERSION = 2`.

Atualizar o código com Git não apaga o banco do navegador.

## Backup

Em **Configurações > Dados e Backup**:

- exportar `cpa-backup-YYYY-MM-DD.json`;
- importar um backup validado;
- conferir resumo antes de substituir os dados atuais;
- restaurar em outro computador/navegador;
- apagar progresso somente com confirmação forte.

Backup v2 continua compatível com backups v1.

## Aulas

Todos os **445 PDs terminais** possuem aula.

Cada aula possui:

1. explicação em uma frase;
2. explicação para iniciante;
3. explicação completa;
4. conceitos essenciais;
5. foco de prova;
6. exemplo prático;
7. comparações;
8. fórmulas quando aplicáveis;
9. pegadinhas;
10. resumo para revisão;
11. 4 flashcards;
12. mini quiz com 3 perguntas;
13. fontes oficiais.

Status:

`Não iniciado → Em andamento → Estudado → Dominado`

Dominado exige aula estudada e melhor mini quiz >= 75%.

## Question Engine — 545 questões

O banco preserva as 100 questões originais das primeiras versões e adiciona **445 novas questões autorais**, garantindo pelo menos uma questão em cada PD terminal.

Tipos:

- `multiple_choice`;
- `case`;
- `dialog_tree`.

As questões possuem:

- PD Code;
- macrotema;
- tópico;
- dificuldade;
- nível cognitivo;
- contexto;
- alternativas;
- gabarito;
- explicação;
- motivo das alternativas incorretas;
- fontes oficiais;
- data de verificação.

A página Questões permite filtrar por tema, subtema, dificuldade, tipo, não respondidas, erradas e favoritas.

Resposta errada entra automaticamente no Caderno de Erros.

## Treino completo

Configuração pedagógica local, não uma réplica validada do exame:

- 50 questões;
- 2h30;
- sem classificação de aprovação;
- Tema 1: 10 questões;
- Tema 2: 20;
- Tema 3: 15;
- Tema 4: 5.

Durante a prova não são mostrados gabarito, correção, assunto ou dica.

Ao finalizar:

- resultado;
- percentual de acertos (sem previsão de aprovação);
- tempo utilizado;
- desempenho por tema;
- dificuldade;
- PD;
- erradas;
- em branco;
- marcadas para revisão.

## Study Engine e Plano de Estudos

O Study Engine usa apenas evidências reais do IndexedDB:

- aula;
- mini quiz;
- questões;
- simulados;
- erros;
- flashcards;
- recência.

Ele calcula domínio por PD, confiança, amostra, falsa confiança, fraquezas e um indicador interno de **Prontidão CPA**.

> Indicador interno baseado no seu desempenho na plataforma. Não é garantia de aprovação.

O Plano de Estudos usa esses dados, pesos oficiais, disponibilidade semanal e data da prova para distribuir:

1. Fundamentos;
2. Cobertura;
3. Prática;
4. Consolidação;
5. Simulados;
6. Revisão final.

## Estatísticas — v0.20

A página Estatísticas mostra, sem servidor externo:

- acurácia acumulada;
- acurácia recente;
- tempo ativo;
- desempenho por tema;
- desempenho por dificuldade;
- evolução dos simulados;
- heatmap dos PDs praticados;
- erros recorrentes;
- relação descritiva entre tempo de estudo e prática.

Quando não existe amostra, a interface mostra ausência de dados em vez de inventar uma porcentagem.

## Estudo Ativo — v0.21

A página **Estudo Ativo** reúne:

- treino intercalado entre os quatro temas;
- treino focado em assuntos fracos;
- recuperação ativa por flashcards;
- revisão de véspera sem matéria nova;
- glossário pesquisável;
- conceitos essenciais;
- fórmulas;
- links diretos para as aulas completas.

A ideia é reduzir releitura passiva e aumentar prática de recuperação e aplicação.

## Fontes e Atualizações

O manifesto em `content/sources.json` registra as fontes oficiais usadas ou monitoradas.

O workflow **Official Source Watch** pode identificar:

- baseline;
- unchanged;
- changed;
- unreachable.

Mudança detectada nunca reescreve aula, questão, gabarito ou regra do exame automaticamente. Ela sinaliza revisão humana.

Falha da internet não bloqueia estudo local.

## PWA e offline

O PWA usa cache versionado e service worker.

Depois que os arquivos da aplicação foram carregados, a maior parte da experiência acadêmica local continua disponível sem internet:

- aulas;
- questões;
- simulados;
- revisão;
- flashcards;
- trilha;
- Dashboard;
- progresso.

Links para fontes externas naturalmente dependem de conexão.

## Qualidade

Validações:

```bash
npm run validate:curriculum
npm run validate:lessons
npm run validate:questions
npm run validate:sources
npm run validate:experience
npm run audit:v13
npm run validate:v21
npm test
npm run lint
npm run typecheck
npm run build
```

Ou:

```bash
npm run validate
```

As validações impedem, entre outras regressões:

- PD inexistente;
- aula terminal faltante;
- questão sem fonte;
- alternativa duplicada;
- banco sem cobertura completa;
- comando destrutivo no atualizador;
- retorno de dependência remota obrigatória;
- perda de rotas de Estatísticas ou Estudo Ativo.

## Arquitetura

- React;
- TypeScript strict;
- Vite;
- Tailwind CSS;
- React Router;
- IndexedDB via `idb`;
- Vitest;
- PWA via Workbox.

Sem login, sem servidor obrigatório, sem API paga e com custo obrigatório de **R$ 0**.

## Desenvolvimento e validação V22

```sh
npm ci
npm run validate
npx playwright install chromium
npm run test:browser
```

`npm run build` gera o site em `dist/` e o arquivo `CPA_Study.html` na raiz e em `dist/`. O empacotamento usa a mesma aplicação e não precisa de plugin externo de HTML único. Execute novamente o build sempre que alterar o código. A CI publica o HTML como artefato para download.

Novas tentativas guardam revisão do conteúdo, IDs das alternativas e uma cópia da questão. Novos simulados guardam as questões completas para preservar gabaritos, explicações e resultados após atualizações. Registros anteriores à V22 não podem recuperar uma cópia histórica que nunca foi salva; para eles, continua existindo a leitura do banco atual.

Veja [V22_REPORT.md](V22_REPORT.md) para correções, verificação e limitações.


## Auditoria V23

A V23 corrige perda de progresso em gravações simultâneas, respostas de mini quiz que permaneciam ao mudar de aula, avaliações duplicadas de flashcards e links de revisão dos temas 2–4. Backups agora validam também o agendamento dos cartões e as configurações do plano. Datas do plano respeitam o dia local; agendas distantes usam uma janela de 366 dias, indicada na tela.

A publicação no Pages executa os testes de navegador antes do deploy, inclusive quando o envio é feito diretamente em `main`. Vitest foi atualizado para 4.1.11; a auditoria npm desta revisão não apontou vulnerabilidades conhecidas.

Veja [V23_REPORT.md](V23_REPORT.md) para escopo, evidências e limites da varredura.
