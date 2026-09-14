# CPA Study Platform

Plataforma web de estudos para certificações financeiras brasileiras, iniciando pela nova **CPA — Certificado Profissional ANBIMA** vigente em 2026.

> Este repositório segue as regras definidas em `PROJECT_SPEC.md`. Nesta V1, os dados da interface são mocks e ainda não há conteúdo regulatório completo nem banco real de questões.

## Stack

- React 18
- TypeScript (strict)
- Vite
- Tailwind CSS
- React Router
- Vite PWA / Workbox
- Supabase (previsto para autenticação e persistência nas próximas etapas)
- Cloudflare Pages (deploy planejado)

## Como instalar

```bash
npm install
```

## Como rodar

```bash
npm run dev
```

## Build de produção

```bash
npm run build
```

Os arquivos de produção serão gerados em `dist/`.

## Arquitetura

```text
src/
  components/       componentes compartilhados e design system
  layouts/          shells e layouts de navegação
  pages/            páginas roteáveis
  features/         domínios funcionais da aplicação
    auth/
    dashboard/
    curriculum/
    lessons/
    questions/
    simulations/
    flashcards/
    review/
    analytics/
  data/             dados estáticos e mocks
  lib/              utilitários de infraestrutura
  hooks/            hooks React reutilizáveis
  types/            tipos e contratos TypeScript
  utils/            funções utilitárias gerais
```

## V1

A V1 entrega layout responsivo, seletor de certificação desacoplado da CPA, dashboard com mocks, páginas-base para os módulos, design system, dark/light mode, PWA básico e estrutura pronta para Supabase e expansão para outras certificações.

## Conteúdo e dados

Conteúdos regulatórios devem ser implementados apenas após verificação em fontes oficiais, conforme `PROJECT_SPEC.md`. O Programa Detalhado oficial vigente da ANBIMA é a fonte de verdade para a CPA.
