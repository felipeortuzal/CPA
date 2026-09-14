# CPA Study Platform

Plataforma web de estudos para certificações financeiras brasileiras, iniciando pela nova **CPA — Certificado Profissional ANBIMA** vigente em 2026.

> O projeto segue integralmente `PROJECT_SPEC.md`. Conteúdo regulatório só deve ser adicionado após validação em fontes oficiais.

## Stack

- React 18
- TypeScript strict
- Vite
- Tailwind CSS
- React Router
- Supabase Free Tier: Auth + PostgreSQL + Row Level Security
- Vite PWA / Workbox
- Cloudflare Pages

## Instalação

```bash
npm install
cp .env.example .env.local
```

Preencha somente as credenciais públicas do frontend:

```env
VITE_SUPABASE_URL=https://SEU_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA_ANON_OU_PUBLISHABLE
```

**Nunca** coloque `SERVICE_ROLE_KEY`, senha do banco ou qualquer segredo administrativo em variáveis `VITE_*`. Tudo que começa com `VITE_` é exposto ao navegador.

## Supabase: primeira configuração

1. Crie um projeto no Supabase Free Tier.
2. Em **Project Settings / API**, copie a Project URL e a chave pública client-side (anon/publishable) para `.env.local`.
3. Em **Authentication**, mantenha Email/Password habilitado.
4. Em **Authentication > URL Configuration**, configure o Site URL do ambiente de produção e adicione como Redirect URLs:
   - `http://localhost:5173/**`
   - a URL do Cloudflare Pages, incluindo `/login` e `/nova-senha` (ou um wildcard equivalente para previews).
5. Instale/execute a Supabase CLI e vincule o repositório ao projeto:

```bash
npx supabase login
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase db push --dry-run
npx supabase db push
```

As migrations ficam em `supabase/migrations/` e são a fonte de verdade do schema. Para desenvolvimento local com Docker:

```bash
npx supabase start
npx supabase db reset
```

`db reset` recria o banco local, aplica todas as migrations em ordem e executa `supabase/seed.sql`.

## Como Felipe e Thó criam as contas

Depois que o Supabase e as variáveis de ambiente estiverem configurados:

1. Rode `npm run dev` e abra `http://localhost:5173`.
2. Na tela de login, clique em **Criar conta**.
3. Felipe cria uma conta com o próprio e-mail e nome `Felipe`.
4. Thó cria outra conta com o próprio e-mail e nome `Thó`.
5. Se a confirmação de e-mail estiver habilitada no Supabase, cada um confirma o link recebido antes de entrar.
6. No primeiro cadastro, um trigger cria automaticamente uma linha em `profiles` ligada ao `auth.users.id` daquela conta.
7. Cada usuário acessa **Configurações** para ajustar nome, certificação atual e meta diária.

Felipe e Thó **não compartilham** progresso. RLS garante que cada conta só consiga consultar e alterar seus próprios progressos, tentativas, simulados, respostas, reviews de flashcards, bookmarks e sessões de estudo. Conteúdos da plataforma (`certifications`, `curriculum_items`, `questions` e `simulations`) são somente leitura para usuários autenticados.

## Autenticação

Fluxos implementados:

- cadastro por e-mail e senha;
- login;
- logout;
- recuperação de senha por e-mail;
- definição de nova senha;
- sessão persistente e refresh automático via Supabase Auth;
- perfil individual criado automaticamente no cadastro.

## Banco de dados

Tabelas versionadas:

- `profiles`
- `certifications`
- `curriculum_items`
- `lesson_progress`
- `questions`
- `question_attempts`
- `simulations`
- `simulation_attempts`
- `simulation_answers`
- `flashcards`
- `flashcard_reviews`
- `bookmarks`
- `study_sessions`

O schema usa foreign keys, constraints, índices e RLS. Flashcards de plataforma podem ter `user_id = null` e são legíveis por usuários autenticados; flashcards pessoais só podem ser alterados e lidos pelo dono.

## Seed

`supabase/seed.sql` é opcional e propositalmente conservador: ele não cria usuários, senhas, questões ou conteúdo regulatório. Serve apenas para garantir os registros-base de certificações no ambiente de desenvolvimento.

## Dashboard

Quando o Supabase está configurado, o Dashboard utiliza dados reais para:

- progresso curricular;
- quantidade de questões respondidas;
- taxa de acerto;
- horas de estudo;
- sequência de estudos;
- progresso/acerto por macrotema;
- assuntos fracos;
- simulados recentes;
- indicador orientativo de preparação.

O indicador **Pronto para a prova** continua sendo uma estimativa e nunca é apresentado como garantia de aprovação.

## Comandos

```bash
npm run dev
npm run typecheck
npm run build
npm run preview
```

## Arquitetura

```text
src/
  components/       componentes compartilhados e design system
  layouts/          shell autenticado da aplicação
  pages/            páginas roteáveis, incluindo Auth e Configurações
  features/
    auth/            sessão e perfil Supabase
    dashboard/       agregação dos dados reais do usuário
    curriculum/
    lessons/
    questions/
    simulations/
    flashcards/
    review/
    analytics/
  data/             definições estáticas não sensíveis
  lib/               infraestrutura, incluindo supabase.ts
  hooks/             hooks React reutilizáveis
  types/             contratos TypeScript

supabase/
  config.toml
  migrations/        schema versionado
  seed.sql            seed opcional de desenvolvimento
```

## Segurança

- nenhuma `SERVICE_ROLE_KEY` é usada no frontend;
- o cliente usa somente `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`;
- tabelas expostas têm RLS habilitado;
- dados pessoais usam políticas baseadas em `auth.uid()`;
- conteúdo público da plataforma exige usuário autenticado;
- `.env` e `.env.local` ficam fora do Git.

## Conteúdo regulatório

Antes de adicionar ou alterar aulas, questões ou dados regulatórios, consulte as fontes oficiais indicadas em `PROJECT_SPEC.md`. O Programa Detalhado vigente da ANBIMA é a fonte de verdade para o conteúdo da CPA.
