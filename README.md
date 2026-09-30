# CPA Study — Nova CPA ANBIMA 2026

Plataforma gratuita, local-first e offline-first para Felipe e Thó estudarem a **CPA — Certificado Profissional ANBIMA** no modelo vigente em 2026.

## Começar a estudar

Acesse **https://felipeortuzal.github.io/CPA/**, informe seu nome e siga a **Sessão de hoje**.

Também existe o arquivo único `CPA_Study.html`, que pode ser aberto diretamente no Chrome ou Edge sem instalar Git, Node ou qualquer servidor. O conteúdo funciona offline; links para fontes oficiais exigem internet.

> O progresso fica no navegador/IndexedDB. Felipe e Thó têm históricos independentes. Exporte o backup JSON antes de trocar de computador, limpar dados do navegador ou substituir o HTML local.

## Estado atual — V26 / 0.26.0

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

O projeto mantém **745 itens**:

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
