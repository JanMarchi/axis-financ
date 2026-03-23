# Axis Finance — Plataforma de Gestão Financeira com IA

Plataforma SaaS de gestão financeira pessoal com IA copilota (Na_th).

## Stack

- **Frontend:** Next.js 15 · TypeScript · Tailwind CSS · shadcn/ui
- **Backend:** NestJS · TypeScript · Prisma ORM
- **Database:** PostgreSQL · Redis
- **Auth:** Supabase Auth (JWT · OAuth)
- **IA:** Anthropic Claude API
- **Infra:** Docker Compose

## Estrutura do Projeto

```
mepoupe-plus/
├── apps/
│   ├── web/              # Next.js 15 frontend
│   └── api/              # NestJS backend
├── packages/
│   └── shared/           # Tipos e constantes compartilhadas
├── docker-compose.yml    # Orquestração local
└── CLAUDE.md             # Guia de execução (leia primeiro!)
```

## Quickstart

### Pré-requisitos

- Node.js 20+
- Docker & Docker Compose
- npm ou yarn

### Setup Local

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# 3. Iniciar serviços (db, redis, api, web)
docker-compose up -d

# 4. Executar migrações e seed
npm run prisma:migrate -w apps/api
npm run db:seed -w apps/api

# 5. Iniciar desenvolvimento
npm run dev
```

API rodará em `http://localhost:3001`
Frontend rodará em `http://localhost:3000`

### Health Check

```bash
curl http://localhost:3001/health
# { "status": "ok" }
```

## Scripts Principais

```bash
# Desenvolvimento
npm run dev           # Rodar API + Web em watch mode
npm run lint          # Executar ESLint
npm run type-check    # Verificar tipos TypeScript

# Build
npm run build         # Build para produção

# Testes
npm run test          # Rodar testes unitários
npm run test:watch    # Modo watch

# Database
npm run prisma:migrate -w apps/api    # Criar/executar migrações
npm run db:seed -w apps/api           # Executar seed
```

## Documentação

- **[CLAUDE.md](./CLAUDE.md)** — Guia de execução, stack, schema, decisões arquiteturais
- **[TASKS.md](./TASKS.md)** — Plano de execução atômico por fases

## Fases de Desenvolvimento

- [ ] **Fase 0** — Setup e fundação
- [ ] **Fase 1** — UI e Design System
- [ ] **Fase 2** — Autenticação
- [ ] **Fase 3** — CRUD Core
- [ ] **Fase 4** — Open Finance
- [ ] **Fase 5** — WhatsApp
- [ ] **Fase 6** — IA Na_th
- [ ] **Fase 7** — Billing
- [ ] **Fase 8** — Relatórios
- [ ] **Fase 9** — QA/Deploy

## Suporte

Para ajuda, consulte [CLAUDE.md](./CLAUDE.md) seção 10 (Troubleshooting Rápido).
