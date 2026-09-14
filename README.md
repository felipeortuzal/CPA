# CPA Study Platform

Plataforma web de estudos para certificações financeiras brasileiras, iniciando pela nova **CPA — Certificado Profissional ANBIMA** vigente em 2026.

> O projeto segue `PROJECT_SPEC.md`. Conteúdo regulatório só é versionado após validação em fontes oficiais.

## Programa oficial da CPA

A trilha atualmente versionada usa o **Programa Detalhado CPA da ANBIMA — versão 1.2**:

- elaboração: **02/09/2024**;
- revisão: **04/06/2025**;
- vigência: **01/01/2026**;
- última verificação no projeto: **14/09/2026**;
- pesos: **20% / 40% / 30% / 10%**.

Fonte oficial: `content/cpa/metadata.json`. A antiga CPA-10 e a CPA-20 não são usadas como currículo da plataforma.

## Currículo versionado

```text
content/cpa/
  metadata.json      versão, vigência, fonte e pesos oficiais
  schema.ts          contrato de cada unidade curricular
  curriculum.ts      agregador da trilha completa
  module-1.ts        macrotema 1
  module-2.ts        macrotema 2
  module-3.ts        macrotema 3
  module-4.ts        macrotema 4
```

A versão 1.2 contém **590 códigos PD únicos**. Cada unidade gerada possui `title`, `pdCode`, `parentCode`, `order`, `description`, `officialSources`, `lastVerified` e metadados de versão. Os `parentCode` preservam integralmente a hierarquia oficial.

As migrations `20260914230000` a `20260914230400` sincronizam o mesmo currículo com `public.curriculum_items`, permitindo ligar o progresso individual do aluno aos códigos PD.

## Trilha de Estudos

A página `/trilha` mostra os quatro macrotemas oficiais, seus pesos, toda a árvore expansível/recolhível e os estados de progresso:

- Não iniciado;
- Em andamento;
- Estudado;
- Dominado.

O progresso é lido de `lesson_progress` e continua isolado por usuário via RLS.

## Fontes

A página `/fontes` mostra programa oficial, versão, revisão, vigência, URL e data da última verificação, além da política de atualização regulatória.

## Stack

- React 18
- TypeScript strict
- Vite
- Tailwind CSS
- React Router
- Supabase Free Tier: Auth + PostgreSQL + RLS
- Vite PWA / Workbox
- Cloudflare Pages

## Instalação

```bash
npm install
cp .env.example .env.local
```

Preencha somente as credenciais públicas:

```env
VITE_SUPABASE_URL=https://SEU_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA
```

Nunca coloque `SERVICE_ROLE_KEY`, senha do banco ou segredo administrativo em variáveis `VITE_*`.

## Supabase

Crie um projeto no Supabase Free Tier, mantenha Email/Password habilitado e configure as URLs de redirect para localhost e produção. Depois:

```bash
npx supabase login
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase db push --dry-run
npx supabase db push
```

Para desenvolvimento local com Docker:

```bash
npx supabase start
npx supabase db reset
```

As migrations ficam em `supabase/migrations/` e são a fonte de verdade do schema e do currículo persistido.

## Contas de Felipe e Thó

1. Rode `npm run dev`.
2. Cada pessoa usa **Criar conta** com seu próprio e-mail e senha.
3. O trigger de cadastro cria uma linha separada em `profiles`.
4. Em **Configurações**, cada usuário define nome, certificação e meta diária.
5. RLS garante que progresso, tentativas, simulados, respostas, flashcards pessoais, bookmarks e sessões de estudo não sejam compartilhados entre as contas.

## Validação

Validação do currículo:

```bash
npm run validate:curriculum
```

Ela verifica versão, datas, 590 códigos únicos, pais existentes, quatro raízes, soma de pesos igual a 100% e igualdade entre os arquivos de conteúdo e as migrations.

Validação completa do frontend:

```bash
npm run validate
```

Comandos individuais:

```bash
npm run typecheck
npm run build
```

O GitHub Actions também executa validação curricular, TypeScript, build e recria um Supabase local do zero com todas as migrations.

## Segurança

- frontend usa somente `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`;
- nenhuma `SERVICE_ROLE_KEY` é exposta;
- tabelas expostas possuem RLS;
- dados privados usam políticas baseadas em `auth.uid()`;
- currículo e demais conteúdos da plataforma são somente leitura para usuários autenticados.

## Regra para futuras atualizações

Antes de alterar aulas, questões ou estrutura do currículo, consulte novamente os canais oficiais da ANBIMA. Se o Programa Detalhado da CPA tiver versão posterior à 1.2, a versão mais nova prevalece e deve gerar atualização de `metadata`, módulos, migrations e testes de validação.
