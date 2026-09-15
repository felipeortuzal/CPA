# CPA Study — Nova CPA ANBIMA 2026

Plataforma local e gratuita de estudos para a **CPA — Certificado Profissional ANBIMA** do novo modelo vigente em 2026. Não é material da antiga CPA-10 ou CPA-20.

## Arquitetura atual

- React + TypeScript + Vite + Tailwind CSS
- IndexedDB via `idb` para progresso pessoal
- conteúdo e currículo versionados no GitHub
- PWA para facilitar uso offline depois que os arquivos da aplicação foram carregados
- sem login, sem cadastro, sem Supabase/Firebase e sem servidor obrigatório
- custo operacional obrigatório: **R$ 0**

O princípio é simples:

- **GitHub = conteúdo da plataforma**
- **IndexedDB do navegador = progresso do aluno**

Felipe e Thó usam o mesmo código, mas cada computador/navegador possui progresso próprio.

## Como rodar o CPA no seu computador

### Primeira instalação

No Windows, instale Git e Node.js 22 ou superior. Depois abra o Prompt de Comando/PowerShell e rode:

```bash
git clone https://github.com/felipeortuzal/CPA.git
cd CPA
npm install
npm run dev
```

Abra o endereço exibido pelo Vite, normalmente `http://localhost:5173`.

Na primeira abertura aparecerá:

> Bem-vindo ao CPA
> Como podemos te chamar?

Digite `Felipe`, `Thó` ou outro nome. Não é uma conta: o nome e todo o progresso ficam apenas naquele navegador.

### Próximas vezes

Dentro da pasta `CPA`, basta usar:

```bash
npm run dev
```

No Windows também existe `start-cpa.bat`; dê dois cliques nele dentro da pasta do projeto.

### Quando houver atualização do projeto

```bash
git pull
npm install
npm run dev
```

O `git pull` altera os arquivos do projeto, **não o IndexedDB do navegador**. Portanto o progresso local permanece.

## Backup do progresso

Em **Configurações > Dados e Backup** existem três ações:

- **Exportar progresso**: baixa `cpa-backup-YYYY-MM-DD.json`.
- **Importar progresso**: valida o JSON e pede confirmação antes de substituir os dados locais.
- **Apagar todo o progresso**: exige duas confirmações e nunca apaga silenciosamente.

Faça backups periódicos, principalmente antes de trocar de navegador/computador ou limpar dados do navegador.

## Programa oficial da CPA

O currículo atualmente versionado utiliza o **Programa Detalhado CPA da ANBIMA, versão 1.2**, revisão de **04/06/2025**, vigente desde **01/01/2026**. Antes de alterar conteúdo regulatório, a versão oficial mais recente deve ser verificada novamente na ANBIMA.

A estrutura completa do PD está em `content/cpa/`. O Macrotema 1 possui aulas didáticas completas em `content/cpa/lessons/`.

## Sistema de aulas

Cada aula do Macrotema 1 inclui:

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
13. Fontes oficiais e data de verificação

Status local:

- Não iniciado
- Em andamento ao abrir a aula pela primeira vez
- Estudado ao marcar a aula
- Dominado quando a aula está estudada e o melhor mini quiz é de pelo menos 75%

## Persistência local

A camada fica em `src/lib/storage/` e usa schema versionado (`DB_VERSION`). Atualizações futuras devem criar migrations aditivas; não se deve apagar o banco para resolver mudança de schema.

O IndexedDB já possui stores preparadas para perfil, progresso de aula, quizzes, favoritos, flashcards, revisões, questões marcadas, caderno de erros, simulados, sessões de estudo, dias ativos, preferências e plano futuro.

## Tempo de estudo e streak

O timer de aula só soma tempo quando a aba está visível e houve interação recente. Abrir uma aba e deixá-la parada indefinidamente não gera horas falsas.

Um dia conta para o streak quando ocorre atividade significativa, como concluir aula ou responder mini quiz; abrir o site sozinho não conta.

## Comandos de qualidade

```bash
npm run validate:curriculum
npm test
npm run typecheck
npm run build
```

Ou tudo de uma vez:

```bash
npm run validate
```

O GitHub Actions executa a mesma sequência em cada push/PR.

## Próximas etapas

Ainda não fazem parte desta versão: banco completo de questões, simulado de 50 questões, ranking Felipe x Thó, IA, C-Pro R/C-Pro I e demais certificações. A arquitetura local já deixa stores preparadas para evolução sem perder o progresso existente.
