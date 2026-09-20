# AUDIT_REPORT.md — Auditoria Final V13

Data da auditoria: **20/09/2026**  
Escopo: repositório `felipeortuzal/CPA` após a V12.  
Objetivo: verificar se o estado atual é consistente, seguro para o progresso local, alinhado às fontes oficiais vigentes e operacional para Felipe e Thó.

## Resultado executivo

**Status operacional: APROVADO.**

A plataforma está consistente para uso local na versão atual: currículo, Question Engine, simulados, Study Engine, plano de estudos, revisão, backup, PWA, atualização local e persistência possuem validações automatizadas.

**Status acadêmico: PARCIAL POR ESCOPO CONHECIDO.**

O currículo completo da CPA está estruturado e o banco de questões cobre os quatro macrotemas, porém as aulas didáticas completas existem atualmente apenas para o **Macrotema 1**. Isso não é regressão da V13; é a principal pendência acadêmica real do roadmap.

## 1. Base oficial verificada

### Programa Detalhado CPA

Verificação direta nos canais oficiais da ANBIMA em 20/09/2026:

- versão: **1.2**
- elaboração: **02/09/2024**
- revisão: **04/06/2025**
- vigência: **01/01/2026**
- macrotemas: 4
- pesos: **20% / 40% / 30% / 10%**

Fonte:
https://www.anbima.com.br/data/files/6A/52/6F/A1/BED73910B07B2739B82BA2A8/Programa-Detalhado-CPA-ANBIMA.pdf

Não foi localizada versão oficial posterior nos canais pesquisados em 20/09/2026.

### Edital dos exames

Verificação direta em 20/09/2026:

- versão: **1.4**
- data: **28/05/2026**
- CPA: **50 questões**
- duração: **2h30**
- mínimo: **35 acertos**
- formatos previstos: múltipla escolha, árvore de diálogo e cases

Fonte:
https://www.anbima.com.br/data/files/98/96/A6/10/9C24C910CF6A83C9F82BA2A8/Edital-dos-Exames-de-Certificacao-Profissional-Anbima.pdf

### Materiais de elaboração de questões

Continuam publicados na página oficial dos novos Programas Detalhados:

- Guia de Elaboração de Questões;
- Caderno de Questões CPA;
- materiais de árvore de decisão.

A plataforma usa esses materiais como referência de estilo e mantém seu banco autoral.

## 2. Cobertura do produto

| Área | Estado auditado |
|---|---|
| Programa Detalhado | **590 nós curriculares** validados |
| Macrotemas | **4**, pesos oficiais preservados |
| Aulas completas | **105**, todas do Macrotema 1 |
| Flashcards de aula | **420**, derivados das 105 aulas |
| Banco inicial | **100 questões originais** |
| Distribuição das questões | **20 / 40 / 30 / 10** por Tema 1–4 |
| Modo Prova | **50 questões / 2h30 / corte 35** |
| Composição local do Modo Prova | **10 / 20 / 15 / 5** |
| Simulados adicionais | 10, 20, tema, fracos e inéditas |
| Study Engine | domínio, confiança, falsa confiança e prontidão |
| Plano de Estudos | adaptativo à data da prova e ao histórico |
| Revisão | fila priorizada, flashcards e Caderno de Erros |
| Fontes | **38 fontes oficiais** no manifesto |
| Persistência | IndexedDB local, `DB_VERSION = 2` |
| Backup | v2, compatível com v1 |
| PWA/offline | presente e auditado |
| Backend obrigatório | **nenhum** |
| Login obrigatório | **nenhum** |
| API paga | **nenhuma** |

## 3. Question Engine

Validações existentes confirmam:

- exatamente 100 questões no banco inicial;
- toda questão possui `pdCode` existente;
- quatro alternativas;
- exatamente uma resposta correta;
- fontes oficiais;
- ausência de alternativas duplicadas;
- ausência de enunciado completo duplicado;
- ausência de “todas as anteriores” / “nenhuma das anteriores”;
- distribuição equilibrada de gabarito;
- tipos `multiple_choice`, `case` e `dialog_tree`;
- distribuição de dificuldade e nível cognitivo.

Erros continuam entrando automaticamente no Caderno de Erros.

## 4. Modo Prova e simulados

O engine mantém como constantes locais:

- `questionCount: 50`;
- `durationSeconds: 9000`;
- `cutoff: 35`;
- `themeCounts: 10 / 20 / 15 / 5`.

O cronômetro usa o horário de início persistido e não depende somente de estado visual da página.

Durante o exame não há correção imediata. O resultado final guarda desempenho por tema, dificuldade, PD e tempo.

## 5. IndexedDB, updates e sobrevivência do progresso

Schema auditado:

- `DB_VERSION = 2`;
- **14 stores locais**;
- migrations incrementais v1 → v2;
- nenhuma migration da V13;
- atualização do código não chama `deleteLocalDatabase`;
- `update-cpa.bat` usa `git pull --ff-only`;
- o atualizador recusa alterações locais não commitadas;
- não existem `git reset --hard` ou `git clean -f` no fluxo de atualização.

Conclusão: **atualizar o código não apaga o progresso do navegador**.

## 6. Backup e importação

A V12 já reforçou o fluxo, e a V13 revalidou:

- backup v2 cobre todos os stores pessoais atuais;
- backup v1 permanece aceito;
- importação futura incompatível é rejeitada antes de limpar os dados;
- limite de 25 MB;
- validação estrutural interna;
- confirmação com resumo antes de importar;
- importação em transação única.

## 7. Offline e PWA

Correção aplicada pela V13:

- o service worker agora também é habilitado no modo de desenvolvimento usado pelo `start-cpa.bat`;
- cache atualizado para `cpa-study-v13`;
- caches antigos continuam sendo limpos;
- fallback de navegação permanece `index.html`;
- estado offline continua informativo e não bloqueia estudo.

A plataforma continua local-first: mesmo sem internet, o servidor local e o IndexedDB não dependem de serviços externos para o uso acadêmico já empacotado.

## 8. Performance

Estado atual:

- páginas principais usam lazy loading;
- carregamento possui fallback explícito;
- Error Boundary global;
- conteúdo pesado é dividido por rota;
- PWA precacheia os chunks gerados pelo build.

Nenhum problema de performance bloqueante foi encontrado na auditoria.

## 9. Acessibilidade e UX

Verificado:

- skip link;
- `main` focável;
- navegação com label semântico;
- menu mobile fecha com Esc;
- foco visível;
- reduced motion;
- aviso offline com `aria-live`;
- dark/light mode;
- layout responsivo;
- estados de loading;
- mensagens de erro recuperáveis.

## 10. Código morto e resíduos antigos

### Corrigido na V13

1. Removidas declarações antigas de `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
2. Removidos seis módulos vazios sem uso:
   - `src/features/analytics/index.ts`
   - `src/features/curriculum/index.ts`
   - `src/features/flashcards/index.ts`
   - `src/features/lessons/index.ts`
   - `src/features/questions/index.ts`
   - `src/features/simulations/index.ts`
3. PWA habilitado também no modo local de desenvolvimento.
4. Adicionado `npm run audit:v13` para impedir o retorno desses resíduos.

### Sem ocorrência

- TODOs;
- FIXMEs;
- dependência Supabase;
- dependência Firebase;
- login obrigatório;
- segredo necessário para estudar.

## 11. Instalação do Thó

Fluxo auditado:

### Primeira vez

```bash
git clone https://github.com/felipeortuzal/CPA.git
cd CPA
npm install
```

Depois:

- estudar: `start-cpa.bat`;
- atualizar: `update-cpa.bat`;
- migrar progresso para outro navegador/computador: exportar/importar backup em Configurações.

O progresso do Thó permanece independente do progresso do Felipe.

## 12. Pendências reais

Estas pendências são **conhecidas e não bloqueiam o estado atual**, mas impedem chamar a plataforma de academicamente completa para toda a CPA:

1. **Aulas completas dos Macrotemas 2, 3 e 4.**
2. A página **Estatísticas** ainda é um placeholder; os dados existem, mas não há analytics avançado completo.
3. O banco inicial possui 100 questões; futuras expansões podem aumentar variedade sem alterar o engine.
4. Outras certificações ainda não foram implementadas.
5. Ranking Felipe × Thó continua fora do escopo local-first atual.

## 13. Critério de fechamento da V13

A V13 só é considerada concluída se o último commit passar:

- `npm run validate:curriculum`;
- `npm run validate:questions`;
- `npm run validate:sources`;
- `npm run validate:experience`;
- `npm run audit:v13`;
- `npm test`;
- `npm run lint`;
- `npm run typecheck`;
- `npm run build`.

## Conclusão

O estado auditado é **operacionalmente pronto para Felipe e Thó estudarem a CPA de forma local, gratuita e com progresso persistente**.

O núcleo técnico não apresenta bloqueio conhecido. A principal limitação restante é de **expansão de conteúdo didático**: Macrotemas 2–4 ainda precisam receber aulas completas no mesmo padrão do Macrotema 1.
