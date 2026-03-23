# TASKS.md — Axis Finance · Plano de Execução Atômico

> **REGRA DE OURO:** Execute uma task por vez. Marque `[x]` ao concluir.
> Nunca avance para próxima fase sem concluir todas as tasks da fase atual.
> Ao retomar: leia o "ESTADO ATUAL" no CLAUDE.md e encontre a primeira task `[ ]`.

---

## FASE 0 — SETUP E FUNDAÇÃO

**Objetivo:** Repositório, tooling, Docker, CI/CD e schema base prontos.
**Critério de conclusão:** `docker-compose up` sobe tudo; `prisma migrate` roda sem erro; build passa.

- [x] **FASE-0-001** — Criar estrutura de monorepo

  ```
  mkdir mepoupe-plus && cd mepoupe-plus
  mkdir -p apps/web apps/api packages/shared
  git init
  ```

  Criar `package.json` raiz com workspaces: `["apps/*", "packages/*"]`

- [x] **FASE-0-002** — Setup Docker Compose
  Criar `docker-compose.yml` com serviços:
  - `db`: postgres:16-alpine, porta 5432, volume persistente
  - `redis`: redis:7-alpine, porta 6379
  - `api`: build do `apps/api`, porta 3001, depends_on db+redis
  - `web`: build do `apps/web`, porta 3000, depends_on api

- [x] **FASE-0-003** — Inicializar Next.js 15 em `apps/web`

  ```
  cd apps/web
  npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
  ```

  Instalar: `shadcn/ui` (init), `recharts`, `react-hook-form`, `zod`, `@hookform/resolvers`

- [x] **FASE-0-004** — Inicializar NestJS em `apps/api`

  ```
  cd apps/api
  npx @nestjs/cli new . --skip-git --package-manager npm
  ```

  Instalar: `@nestjs/config`, `@nestjs/throttler`, `@nestjs/bull`, `bullmq`,
  `prisma`, `@prisma/client`, `class-validator`, `class-transformer`,
  `ioredis`, `bcrypt`, `@types/bcrypt`

- [x] **FASE-0-005** — Configurar Prisma

  ```
  cd apps/api && npx prisma init
  ```

  Copiar schema completo do CLAUDE.md seção 4 para `prisma/schema.prisma`
  Rodar: `npx prisma migrate dev --name init`
  Rodar: `npx prisma generate`

- [x] **FASE-0-006** — Criar `packages/shared`
  Criar `packages/shared/src/index.ts` com tipos compartilhados:
  - `Money`: tipo helper para Decimal display
  - `ApiResponse<T>`: wrapper padrão de resposta
  - `PaginatedResponse<T>`: wrapper com meta
  - Constantes: `ENVELOPE_PERCENTAGES`, `PLAN_LIMITS`, `CATEGORY_ICONS`

- [x] **FASE-0-007** — Criar arquivos `.env.example`
  Copiar template de variáveis do CLAUDE.md seção 3 para:
  - `apps/api/.env.example` → `apps/api/.env` (com valores dev)
  - `apps/web/.env.example` → `apps/web/.env.local` (com valores dev)

- [x] **FASE-0-008** — Configurar GitHub Actions CI
  Criar `.github/workflows/ci.yml`:
  - Trigger: push em `main` e PRs
  - Jobs: `lint` (eslint), `type-check` (tsc), `test` (jest), `build`
  - Usar `docker-compose` para subir serviços de teste

- [x] **FASE-0-009** — Seed inicial do banco
  Criar `apps/api/prisma/seed.ts` com:
  - Categorias de sistema (is_system: true) — 20 categorias padrão BR
  - Usuário de teste: `test@mepoupe.dev` / `Test@123`
  - Rodar: `npx prisma db seed`

- [ ] **FASE-0-010** — Validar setup

  ```
  docker-compose up -d
  cd apps/api && npm run start:dev    # deve iniciar na porta 3001
  cd apps/web && npm run dev          # deve iniciar na porta 3000
  ```

  Confirmar: `GET http://localhost:3001/health` retorna `{ status: "ok" }`
  **COMMIT:** `git commit -m "chore(fase-0): setup monorepo, docker, prisma, ci"`

---

## FASE 1 — UI E DESIGN SYSTEM

**Objetivo:** Layout, design system e todas as páginas em skeleton prontos.
**Critério de conclusão:** Todas as rotas navegáveis com dados mockados; design consistente.

- [ ] **FASE-1-001** — Configurar Tailwind com tokens do design system
  Editar `apps/web/tailwind.config.ts`:
  Adicionar `colors.brand`, `colors.envelope` do CLAUDE.md seção 6
  Adicionar fonte Inter via `next/font`

- [ ] **FASE-1-002** — Configurar shadcn/ui com tema customizado
  Rodar `npx shadcn@latest add` para os componentes:
  `button card dialog dropdown-menu form input label select separator sheet skeleton tabs toast badge progress`
  Customizar `globals.css` com CSS variables do tema Me Poupe+

- [ ] **FASE-1-003** — Criar layout principal autenticado
  `apps/web/src/app/(app)/layout.tsx`:
  - Sidebar esquerda: Logo + nav links (Dashboard, Transações, Contas, Orçamento, Metas, Contas a Pagar, Chat, Relatórios, Config)
  - Header: título da página, notificações, avatar do usuário
  - Main content area com scroll
  - Responsivo: sidebar vira bottom tab bar em mobile

- [ ] **FASE-1-004** — Criar componentes base reutilizáveis
  Criar em `apps/web/src/components/`:
  - `MoneyDisplay`: formata Decimal para `R$ 1.234,56`
  - `LoadingSkeleton`: skeleton genérico configurável
  - `EmptyState`: componente com ilustração + mensagem + CTA opcional
  - `ConfirmDialog`: modal de confirmação com título + descrição + botões
  - `StatusBadge`: badge colorido por status (pending/paid/overdue etc)
  - `PageHeader`: título + breadcrumb + ação primária

- [ ] **FASE-1-005** — Página Dashboard (skeleton)
  `apps/web/src/app/(app)/dashboard/page.tsx`
  Layout com placeholders:
  - Card saldo total consolidado
  - Donut chart receitas vs despesas
  - Cards 4 envelopes com barras de progresso
  - Lista próximas 5 contas
  - Card metas ativas
  - Feed últimas 10 transações
  - Card copilota Na_th com CTA

- [ ] **FASE-1-006** — Página Transações (skeleton)
  `apps/web/src/app/(app)/transactions/page.tsx`
  - Filtros: período, conta, categoria, tipo, status
  - Tabela paginada com colunas: data, descrição, categoria, conta, valor, status
  - FAB "Nova Transação"
  - Modal de criação/edição (todos os campos do CLAUDE.md seção 5.3)

- [ ] **FASE-1-007** — Página Contas (skeleton)
  `apps/web/src/app/(app)/accounts/page.tsx`
  - Lista agrupada por tipo
  - Card por conta com saldo
  - Botão "Conectar banco" (placeholder para Pluggy)
  - Botão "Adicionar manual"

- [ ] **FASE-1-008** — Página Orçamento/Envelopes (skeleton)
  `apps/web/src/app/(app)/budget/page.tsx`
  - Seletor mês/ano
  - 4 seções de envelopes coloridos
  - Barra de progresso por categoria
  - % usada vs orçada

- [ ] **FASE-1-009** — Página Metas (skeleton)
  `apps/web/src/app/(app)/goals/page.tsx`
  - Grid de cards de metas
  - Progress bar circular por meta
  - Modal criação de meta

- [ ] **FASE-1-010** — Página Contas a Pagar / Bills (skeleton)
  `apps/web/src/app/(app)/bills/page.tsx`
  - Calendário mensal
  - Lista por status (pendente/vencida/paga)
  - Modal de adição

- [ ] **FASE-1-011** — Página Chat Na_th (skeleton)
  `apps/web/src/app/(app)/chat/page.tsx`
  - Interface de messaging: histórico + input
  - Bubbles de mensagem (user vs Na_th)
  - Estado vazio: welcome message da Na_th
  - Loading state: "Na_th está pensando..."

- [ ] **FASE-1-012** — Página Relatórios (skeleton)
  `apps/web/src/app/(app)/reports/page.tsx`
  - Tabs: Fluxo de Caixa, Por Categoria, Patrimônio, Envelopes
  - Charts placeholder com Recharts

- [ ] **FASE-1-013** — Páginas de Auth (skeleton)
  `apps/web/src/app/(auth)/`:
  - `login/page.tsx`: email + senha + OAuth Google
  - `register/page.tsx`: nome + email + senha + telefone
  - `forgot-password/page.tsx`
  - `reset-password/page.tsx`

- [ ] **FASE-1-014** — Wizard de Onboarding (skeleton)
  `apps/web/src/app/(auth)/onboarding/`:
  - Layout com ProgressBar (etapa 1 de 5)
  - `step-1/`: cadastro básico
  - `step-2/`: verificação OTP
  - `step-3/`: perfil financeiro
  - `step-4/`: primeira conta
  - `step-5/`: tour dos envelopes

  **COMMIT:** `git commit -m "feat(fase-1): design system, layout, todas as páginas em skeleton"`

---

## FASE 2 — AUTENTICAÇÃO E ONBOARDING

**Objetivo:** Fluxo completo de registro, login, OTP, OAuth e onboarding funcional.
**Critério de conclusão:** Novo usuário consegue criar conta, verificar, onboardar e acessar dashboard.

- [ ] **FASE-2-001** — Configurar Supabase Auth no NestJS
  `apps/api/src/auth/`:
  - `auth.module.ts`, `auth.service.ts`, `auth.controller.ts`
  - `jwt.strategy.ts`: valida token Supabase
  - `jwt-auth.guard.ts`: guard para rotas protegidas
  - `get-user.decorator.ts`: decorator `@GetUser()` extrai user do request

- [ ] **FASE-2-002** — Endpoints de Auth no NestJS

  ```
  POST /auth/register    → criar user + subscription free + preferences
  POST /auth/login       → retornar tokens em HttpOnly cookies
  POST /auth/refresh     → renovar access token
  POST /auth/logout      → invalidar cookies
  POST /auth/forgot-password
  POST /auth/reset-password
  ```

  Rate limiting: 5 req/15min no `/auth/login` via `@nestjs/throttler`

- [ ] **FASE-2-003** — Configurar Supabase Auth no Next.js
  Instalar `@supabase/ssr`, `@supabase/supabase-js`
  Criar `apps/web/src/lib/supabase/`:
  - `client.ts`: browser client
  - `server.ts`: server component client
  - `middleware.ts`: refresh de sessão
  Criar `apps/web/src/middleware.ts`: proteger rotas `(app)/*`

- [ ] **FASE-2-004** — Implementar página de Register
  Formulário com `react-hook-form` + `zod`:
  - Validação: email válido, senha forte (8+ chars, 1 maiúscula, 1 número), nome obrigatório
  - Submit: `POST /auth/register` via API route Next.js
  - Feedback: loading state, erro inline, redirect para onboarding step-1

- [ ] **FASE-2-005** — Implementar página de Login
  - Form email + senha
  - "Entrar com Google" via Supabase OAuth
  - Remember me (refresh token persistente)
  - Link "Esqueci a senha"
  - Redirect para dashboard se já autenticado

- [ ] **FASE-2-006** — Implementar Recuperação de Senha
  - `forgot-password`: envia email via Supabase
  - `reset-password`: nova senha + confirmação

- [ ] **FASE-2-007** — Wizard Onboarding Step 1-2 (Cadastro + OTP)
  - Step 1 é o próprio registro (redirecionar se já cadastrou)
  - Step 2: input de 6 dígitos OTP
  - Reenviar OTP após 60s
  - Salvar progresso: `PATCH /onboarding/progress { step: 2 }`

- [ ] **FASE-2-008** — Wizard Onboarding Step 3 (Perfil Financeiro)
  Form:
  - Renda mensal (slider + input numérico)
  - Situação atual: cards selecionáveis (endividado / equilibrado / investindo)
  - Objetivo principal: cards selecionáveis
  Salvar em `user_preferences` + `PATCH /onboarding/progress { step: 3, financialProfile: {...} }`

- [ ] **FASE-2-009** — Wizard Onboarding Step 4 (Primeira Conta)
  Duas opções:
  a) "Adicionar manualmente": form nome + tipo + saldo inicial → `POST /accounts`
  b) "Conectar banco" (placeholder que diz "em breve" — Pluggy vem na Fase 4)
  Salvar progresso: `step: 4`

- [ ] **FASE-2-010** — Wizard Onboarding Step 5 (Tour Envelopes)
  - Explicação animada dos 4 envelopes com as % da metodologia Me Poupe!
  - Essencial ≤55% · Não Essencial ≤10% · Crescimento ≤10% · Investimento ≥25%
  - Botão "Concluir" → `PATCH /onboarding/complete`
  - Backend: `onboarding_completed = true` + ativa trial 14 dias
  - Redirect: `/dashboard` com welcome toast

- [ ] **FASE-2-011** — Middleware de proteção
  `apps/web/src/middleware.ts`:
  - Rotas `(app)/*`: redireciona para `/login` se sem sessão
  - Verifica `onboarding_completed`; redireciona para `/onboarding` se false
  - Rotas `(auth)/*`: redireciona para `/dashboard` se já autenticado

  **COMMIT:** `git commit -m "feat(fase-2): auth completo, onboarding 5 etapas"`

---

## FASE 3 — CRUD CORE

**Objetivo:** Todos os módulos financeiros funcionais com dados reais.
**Critério de conclusão:** Usuário consegue criar, ler, editar, excluir transações, contas, orçamentos, metas e bills.

- [ ] **FASE-3-001** — Módulo Accounts (NestJS)
  `apps/api/src/accounts/`:
  - `AccountsService`: CRUD com filtro userId obrigatório
  - `CreateAccountDto`, `UpdateAccountDto` com class-validator
  - Cálculo de saldo de cartão de crédito (fatura atual)
  - Testes unitários mínimos do service

- [ ] **FASE-3-002** — Módulo Accounts (Frontend)
  Conectar página `/accounts` à API:
  - Listar contas agrupadas por tipo
  - Modal criar conta: form validado com zod
  - Modal editar conta
  - Confirmação de exclusão (`ConfirmDialog`)
  - Saldo formatado com `MoneyDisplay`

- [ ] **FASE-3-003** — Módulo Categories (NestJS)
  `apps/api/src/categories/`:
  - Listar: categorias do sistema + personalizadas do usuário
  - CRUD de categorias personalizadas (userId obrigatório)
  - Seed já populou categorias de sistema na Fase 0

- [ ] **FASE-3-004** — Módulo Transactions (NestJS)
  `apps/api/src/transactions/`:
  - `TransactionsService`: CRUD completo
  - Listagem com filtros: `startDate`, `endDate`, `accountId`, `categoryId`, `type`, `status`, `search`
  - Paginação: `page` + `limit`, retornar `{ data, meta: { total, page, perPage, totalPages } }`
  - Lógica de recorrência: ao criar recorrente, gerar instâncias até 12 meses à frente
  - Lógica de parcelamento: ao criar parcelado, gerar N instâncias
  - Atualização de saldo da conta ao criar/editar/deletar transação
  - Soft delete + audit log

- [ ] **FASE-3-005** — Módulo Transactions (Frontend)
  Conectar página `/transactions`:
  - Tabela com infinite scroll (ou paginação)
  - Filtros funcionais (atualizam query string + refetch)
  - Busca por descrição (debounce 300ms)
  - Modal criar/editar: todos os campos do spec
  - Ao criar transação de transferência: exibir campo "conta destino"
  - Ao marcar recorrente: exibir opções de frequência + data fim
  - Ao marcar parcelado: exibir campo "nº de parcelas"

- [ ] **FASE-3-006** — Módulo Bills (NestJS)
  `apps/api/src/bills/`:
  - CRUD completo
  - Job diário (cron): atualizar status para `overdue` se `due_date < today` e status = `pending`
  - Endpoint `POST /bills/:id/pay`: atualiza status, cria transaction associada

- [ ] **FASE-3-007** — Módulo Bills (Frontend)
  Conectar página `/bills`:
  - Calendário: exibir bills por dia de vencimento
  - Lista por status com filtro
  - Modal adicionar bill: nome, valor, vencimento, categoria, conta
  - Botão "Marcar como pago" → `POST /bills/:id/pay`
  - Badge de status colorido

- [ ] **FASE-3-008** — Módulo Goals (NestJS)
  `apps/api/src/goals/`:
  - CRUD + `POST /goals/:id/contribute` (adicionar aporte)
  - Cálculo: `monthly_contribution` sugerido = `(target - current) / months_remaining`
  - Projeção de conclusão baseada em aportes históricos

- [ ] **FASE-3-009** — Módulo Goals (Frontend)
  Conectar página `/goals`:
  - Grid de cards com progress circular
  - Modal criar meta: campos completos
  - Modal detalhe: histórico de aportes + projeção + "Adicionar aporte"
  - Progress bar animado

- [ ] **FASE-3-010** — Módulo Budgets/Envelopes (NestJS)
  `apps/api/src/budgets/`:
  - `GET /budgets?month&year`: retorna orçamentos do mês com `spent_amount` calculado
  - `POST /budgets/configure`: upsert batch de orçamentos do mês
  - Recalculo automático de `spent_amount` via trigger/job quando transação é criada
  - `GET /budgets/summary`: retorna totais por envelope

- [ ] **FASE-3-011** — Módulo Budgets (Frontend)
  Conectar página `/budget`:
  - Seletor mês/ano com navegação prev/next
  - 4 seções de envelopes com barras de progresso coloridas
  - Alerta visual se > 90% do orçado
  - Modal editar orçamento da categoria
  - Wizard "Configurar orçamento" (primeira vez): pré-sugere com % da metodologia

- [ ] **FASE-3-012** — Dashboard com dados reais
  Conectar página `/dashboard` às APIs:
  - Calcular saldo consolidado: `GET /accounts` → soma balances
  - Receitas vs despesas do mês: `GET /transactions` com filtro mês
  - Envelopes: `GET /budgets/summary`
  - Próximas bills: `GET /bills?status=pending` top 5
  - Metas: `GET /goals` top 3
  - Últimas transações: `GET /transactions?limit=10`
  - Loading skeletons enquanto carrega
  - Refresh automático a cada 5 minutos (ou SWR com revalidate)

  **COMMIT:** `git commit -m "feat(fase-3): todos os módulos CRUD funcionais"`

---

## FASE 4 — OPEN FINANCE (PLUGGY)

**Objetivo:** Usuário consegue conectar conta bancária e ver transações sincronizadas.
**Critério de conclusão:** Nubank conectado → transações aparecem no dashboard < 5min.

- [ ] **FASE-4-001** — Módulo Pluggy (NestJS)
  `apps/api/src/pluggy/`:
  - `PluggyService`: wrapper para Pluggy API (axios)
  - `POST /pluggy/connect-token`: gera connect token (válido 30min) para o widget
  - `GET /pluggy/items`: lista conexões do usuário
  - `DELETE /pluggy/items/:id`: desconectar instituição
  - `POST /pluggy/items/:id/sync`: força sync manual

- [ ] **FASE-4-002** — Webhook Pluggy (NestJS)
  `apps/api/src/webhooks/pluggy.webhook.ts`:
  - Validar `x-pluggy-signature` header
  - Evento `item/updated` → enfileirar job de sync
  - Evento `item/error` → atualizar status + notificar usuário

- [ ] **FASE-4-003** — Sync Worker (BullMQ)
  `apps/api/src/sync/sync.worker.ts`:
  - Fila `sync:pluggy` processada pelo worker
  - Para cada item: GET transações desde `last_synced_at`
  - Normalizar campos Pluggy → modelo interno
  - Deduplicação: `INSERT ON CONFLICT (pluggy_transaction_id) DO NOTHING`
  - Atualizar `account.balance` e `account.last_synced_at`
  - Enfileirar job de categorização IA em batch

- [ ] **FASE-4-004** — Categorização automática (NestJS + Claude)
  `apps/api/src/ai/categorization.service.ts`:
  - Receber batch de até 50 transações não categorizadas
  - Enviar para Claude API com lista de categorias disponíveis
  - Parsear resposta JSON com `categoryId` por transação
  - Cache Redis: hash da descrição → categoryId (TTL 30 dias)
  - Fallback heurístico: keyword matching se Claude offline

- [ ] **FASE-4-005** — Pluggy Connect Widget (Frontend)
  `apps/web/src/components/PluggyConnectWidget.tsx`:
  - Carregar SDK Pluggy via script tag
  - Buscar connect token: `POST /pluggy/connect-token`
  - Abrir widget ao clicar "Conectar banco"
  - Callback de sucesso: mostrar toast + atualizar lista de contas
  - Callback de erro: mostrar mensagem amigável

- [ ] **FASE-4-006** — UI de status de sincronização
  - Badge "Sincronizando..." com spinner quando `status = updating`
  - Banner amarelo quando `status = login_error`: "Reconecte seu [banco]"
  - Botão "Atualizar" força sync manual
  - Timestamp "Atualizado há X min"
  - Cron no backend: a cada 6h, enfileirar sync de todos os itens ativos

  **COMMIT:** `git commit -m "feat(fase-4): open finance pluggy, sync worker, categorização IA"`

---

## FASE 5 — NOTIFICAÇÕES E WHATSAPP

**Objetivo:** Lembretes de bills via WhatsApp e confirmação de pagamento por "SIM".
**Critério de conclusão:** Bill criada com vencimento em 3 dias → WhatsApp recebido → responde SIM → bill marcada como paga.

- [ ] **FASE-5-001** — Serviço de notificações multi-canal
  `apps/api/src/notifications/`:
  - `NotificationsService`: método `send({ userId, type, channel, title, body, data, scheduledAt })`
  - Cria registro na tabela `notifications`
  - Enfileira job `notifications:dispatch` via BullMQ

- [ ] **FASE-5-002** — Notification Worker
  `apps/api/src/notifications/notification.worker.ts`:
  - Processa fila `notifications:dispatch`
  - Router por channel: `whatsapp`, `email`, `push`, `in_app`
  - Retry 3x com backoff; após falha: fallback para email

- [ ] **FASE-5-003** — Gateway WhatsApp (abstração)
  `apps/api/src/whatsapp/whatsapp.gateway.ts`:

  ```typescript
  interface WhatsAppGateway {
    sendMessage(phone: string, message: string): Promise<void>
    sendTemplate(phone: string, template: string, vars: Record<string, string>): Promise<void>
  }
  ```

  Implementação: `ZApiGateway` (usa Z-API)
  Config: injetado via NestJS DI — trocar implementação sem alterar consumidores

- [ ] **FASE-5-004** — Integração Z-API
  `apps/api/src/whatsapp/zapi.gateway.ts`:
  - `sendMessage`: POST para `https://api.z-api.io/instances/{id}/token/{token}/send-text`
  - Rate limit: máx 1 msg/usuário/tipo/dia (Redis counter)
  - Formatar número para E.164 (+55...)
  - Log de envio na tabela `notifications`

- [ ] **FASE-5-005** — Webhook WhatsApp inbound
  `apps/api/src/webhooks/whatsapp.webhook.ts`:
  - `POST /webhooks/whatsapp`: recebe mensagens do Z-API
  - Validar token no header
  - Parsear `sender_phone` + `message_body`
  - Lookup: `phone → user` via tabela `users`
  - Se mensagem = "SIM" (case-insensitive): chamar `BillsService.confirmPaymentByWhatsApp(userId)`
  - Se mensagem = "NÃO"/"NAO": responder com opção de reagendamento
  - Número desconhecido: logar e ignorar

- [ ] **FASE-5-006** — Cron de lembretes de bills
  `apps/api/src/bills/bills.scheduler.ts`:
  - Cron: todo dia às 08:00 BRT (`0 8 * * * America/Sao_Paulo`)
  - Buscar bills com `due_date = today + N days` e `notification_sent_at IS NULL`
  - Para cada bill: enfileirar notificação WhatsApp + email
  - Mensagem template: "Oi [Nome]! 📅 Lembrete: *[nome da conta]* vence em [X] dias — R$ [valor]. Responda *SIM* para confirmar o pagamento."
  - Atualizar `notification_sent_at`

- [ ] **FASE-5-007** — Preferências de notificação (Frontend)
  Página `/settings` → seção "Notificações":
  - Toggle WhatsApp habilitado
  - Slider "avisar X dias antes" (1–7 dias)
  - Número do WhatsApp (editar)
  - Teste de envio: botão "Enviar mensagem de teste"

  **COMMIT:** `git commit -m "feat(fase-5): notificações multi-canal, whatsapp lembretes e confirmação"`

---

## FASE 6 — IA COPILOTA NA_TH

**Objetivo:** Chat funcional com Na_th para análise financeira e ações via tool use.
**Critério de conclusão:** Usuário conversa com Na_th, pergunta saldo, Na_th acessa dados reais e responde.

- [ ] **FASE-6-001** — Módulo AI (NestJS)
  `apps/api/src/ai/`:
  - `AiService`: gerencia conversas, system prompt, tool calling
  - `ConversationsRepository`: CRUD em `ai_conversations`
  - `POST /ai/chat`: recebe `{ message, sessionId }`, retorna `{ reply, sessionId }`
  - `GET /ai/conversations`: histórico de sessões
  - `GET /ai/insight-daily`: retorna/gera insight do dia (cache Redis 24h)

- [ ] **FASE-6-002** — System prompt e contexto financeiro
  `apps/api/src/ai/context.builder.ts`:
  - Gera snapshot financeiro do usuário para injetar no system prompt
  - Inclui: saldo total, receitas/despesas do mês, top 5 categorias, bills pendentes, metas ativas
  - Snapshot gerado a cada nova sessão; cacheado por 5 min
  - System prompt base: copiar da seção 7 do CLAUDE.md + contexto gerado

- [ ] **FASE-6-003** — Tool definitions para Claude API
  `apps/api/src/ai/tools/`:
  Definir e implementar tools:
  - `get_financial_summary`: retorna saldo, mês atual receitas/despesas
  - `get_transactions`: lista transações com filtros (período, categoria, conta)
  - `create_transaction`: cria lançamento (requer flag `requiresConfirmation: true`)
  - `create_goal`: cria meta financeira (requer confirmação)
  - `update_bill_status`: marca bill como paga (requer confirmação)
  - `get_budget_status`: retorna situação dos envelopes

- [ ] **FASE-6-004** — Orquestração de tool calling
  `apps/api/src/ai/tool-executor.ts`:
  - Processar resposta da Claude API com `stop_reason: "tool_use"`
  - Executar a tool chamada passando userId obrigatoriamente
  - Se `requiresConfirmation`: retornar `{ pendingAction: { tool, args, description } }` ao frontend
  - Após confirmação do usuário: `POST /ai/chat/confirm-action { actionId }` → executa

- [ ] **FASE-6-005** — Interface de Chat (Frontend)
  Conectar página `/chat`:
  - Enviar mensagem: `POST /ai/chat`
  - Renderizar histórico de mensagens com scroll automático para o fim
  - Bubble do usuário: direita, fundo brand.primary
  - Bubble Na_th: esquerda, avatar da Na_th, fundo neutro
  - Loading: "Na_th está analisando..." com animação de dots
  - Se resposta tem `pendingAction`: exibir modal de confirmação antes de executar

- [ ] **FASE-6-006** — Insight diário no Dashboard
  - `GET /ai/insight-daily` ao carregar dashboard
  - Exibir no card "Copilota Na_th": uma frase de insight gerado pela IA
  - Exemplo: "Seus gastos com alimentação cresceram 23% em relação ao mês passado 🍔"
  - Cacheado por 24h por usuário; gerado em background job `InsightWorker`

- [ ] **FASE-6-007** — Limite de mensagens por plano
  - Free: 10 mensagens/mês (contador em Redis)
  - Premium: ilimitado
  - Ao atingir limite: exibir modal de upgrade no lugar do input

  **COMMIT:** `git commit -m "feat(fase-6): copilota Na_th com tool calling, chat funcional, insights"`

---

## FASE 7 — BILLING E ASSINATURAS

**Objetivo:** Pagamento de plano premium funcional end-to-end com Stripe.
**Critério de conclusão:** Usuário free faz upgrade → paga com cartão → features premium liberadas imediatamente.

- [ ] **FASE-7-001** — Módulo Subscriptions (NestJS)
  `apps/api/src/subscriptions/`:
  - `SubscriptionsService`: CRUD + verificação de plano
  - `isPremium(userId)`: boolean para middleware de features
  - `POST /subscriptions/checkout`: cria Stripe Checkout Session (hosted)
  - `POST /subscriptions/portal`: cria Stripe Billing Portal session
  - `DELETE /subscriptions/me`: cancela no Stripe + atualiza tabela

- [ ] **FASE-7-002** — Webhook Stripe
  `apps/api/src/webhooks/stripe.webhook.ts`:
  - Validar `stripe-signature` (HMAC)
  - Tratar eventos (idempotente com Redis):
    - `customer.subscription.created` → ativar premium
    - `customer.subscription.updated` → atualizar plan/status
    - `customer.subscription.deleted` → downgrade para free
    - `invoice.payment_failed` → status `past_due` + notificar usuário
    - `customer.subscription.trial_will_end` → email de lembrete (3 dias antes)

- [ ] **FASE-7-003** — Middleware de features premium
  `apps/api/src/common/guards/premium.guard.ts`:
  - `@RequiresPremium()` decorator
  - Consulta `subscriptions` tabela; bloqueia se `plan = free`
  - Aplicar em: `/ai/chat`, `/pluggy/*`, `/reports/export`, `/transactions` (além de 50/mês)

- [ ] **FASE-7-004** — Página de Planos (Frontend)
  `apps/web/src/app/(app)/settings/subscription/page.tsx`:
  - Plano atual + data de renovação
  - Cards: Free vs Premium Mensal vs Premium Anual
  - "Assinar Agora" → `POST /subscriptions/checkout` → redirect para Stripe Checkout
  - "Gerenciar Assinatura" → `POST /subscriptions/portal` → redirect para Stripe Portal
  - Trial: exibir "X dias restantes de trial"

- [ ] **FASE-7-005** — Bloqueios de features free (Frontend)
  - Ao acessar feature premium sem plano: exibir `UpgradePrompt` component
  - No chat: após 10 mensagens, substituir input por banner de upgrade
  - No Open Finance: "Conectar banco" disponível apenas para premium
  - No relatório: exportar PDF → modal de upgrade

- [ ] **FASE-7-006** — Emails transacionais
  Configurar Resend (ou SendGrid):
  - Boas-vindas após registro
  - Confirmação de assinatura premium
  - Trial expirando em 3 dias
  - Falha de pagamento
  - Confirmação de cancelamento

  **COMMIT:** `git commit -m "feat(fase-7): billing stripe, planos, emails transacionais"`

---

## FASE 8 — RELATÓRIOS E EXPORTAÇÃO

**Objetivo:** Relatórios visuais completos com exportação PDF/CSV.
**Critério de conclusão:** Todos os 6 relatórios renderizam com dados reais; exportação PDF funciona.

- [ ] **FASE-8-001** — Engine de relatórios (NestJS)
  `apps/api/src/reports/`:
  - `ReportsService` com métodos:
    - `getCashFlow(userId, startDate, endDate)`: receitas vs despesas por mês
    - `getExpensesByCategory(userId, startDate, endDate)`: totais por categoria
    - `getNetWorthHistory(userId, months)`: saldo total ao longo do tempo
    - `getBudgetHistory(userId, months)`: gastos por envelope histórico
  - Todos os queries otimizados com índices; máximo 12 meses por query

- [ ] **FASE-8-002** — Gráficos de relatórios (Frontend)
  Conectar página `/reports`:
  - Tab "Fluxo de Caixa": BarChart (Recharts) receitas vs despesas por mês
  - Tab "Por Categoria": PieChart/DonutChart + tabela ordenada por valor
  - Tab "Patrimônio": LineChart saldo total ao longo do tempo
  - Tab "Envelopes": BarChart agrupado por envelope por mês
  - Todos com filtro de período e seletor de conta

- [ ] **FASE-8-003** — Exportação PDF (Worker)
  `apps/api/src/reports/pdf.worker.ts`:
  - Job `reports:generate-pdf`
  - Usar `puppeteer` headless para renderizar template HTML em PDF
  - Template: relatório formatado com logo Me Poupe+, dados do usuário, gráficos SVG
  - Salvar no Cloudflare R2
  - Notificar usuário com link de download (válido 24h)

- [ ] **FASE-8-004** — Exportação CSV
  - `GET /reports/export/csv?type=transactions&startDate&endDate`
  - Stream direto (não via worker): gerar CSV on-the-fly com `papaparse` ou manual
  - Colunas: data, descrição, categoria, conta, tipo, valor, status

  **COMMIT:** `git commit -m "feat(fase-8): relatórios completos, exportação PDF/CSV"`

---

## FASE 9 — POLIMENTO, QA E DEPLOY

**Objetivo:** App production-ready, testado, monitorado e deployado.
**Critério de conclusão:** Deploy funcional no Railway; todos os critérios de aceite do CLAUDE.md atendidos.

- [ ] **FASE-9-001** — Testes E2E com Playwright
  Criar `apps/web/e2e/`:
  - `auth.spec.ts`: registro → OTP → onboarding → login
  - `transaction.spec.ts`: criar → editar → deletar transação
  - `bill-whatsapp.spec.ts`: criar bill → simular resposta SIM → verificar status
  - `subscription.spec.ts`: upgrade de plano → verificar features liberadas

- [ ] **FASE-9-002** — Testes unitários NestJS
  Para cada service principal adicionar spec com Jest:
  - `transactions.service.spec.ts`: lógica de recorrência, parcelamento, saldo
  - `bills.service.spec.ts`: cron de overdue, confirmação por WhatsApp
  - `ai.service.spec.ts`: montagem do system prompt, tool calling
  - `sync.worker.spec.ts`: deduplicação, categorização

- [ ] **FASE-9-003** — Auditoria de segurança
  Checklist OWASP:
  - [ ] Verificar que user_id de outro usuário retorna 403/404 em todos os endpoints
  - [ ] CPF não aparece em nenhum log (testar com grep nos logs)
  - [ ] JWT expirado retorna 401
  - [ ] Rate limiting ativo no `/auth/login`
  - [ ] Validação de tamanho de payload (max 1MB por request)
  - [ ] Headers de segurança (CORS, HSTS, CSP, X-Frame-Options) no Next.js

- [ ] **FASE-9-004** — Performance
  - Lighthouse PWA score > 85 no `/dashboard`
  - Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms
  - Adicionar `loading.tsx` em todas as rotas do App Router
  - Lazy loading de componentes pesados (Recharts, chat)

- [ ] **FASE-9-005** — Observabilidade
  - Sentry: `npm install @sentry/nextjs @sentry/nestjs`
  - Configurar `sentry.client.config.ts` e `sentry.server.config.ts`
  - PostHog: adicionar script de analytics no Next.js layout
  - Health check endpoint: `GET /health` retorna status de DB, Redis e serviços externos

- [ ] **FASE-9-006** — Deploy Railway (staging)
  - Criar projeto Railway com serviços: `api`, `web`, `worker`
  - Configurar PostgreSQL e Redis gerenciados pelo Railway
  - Adicionar todas as variáveis de ambiente (produção)
  - Deploy automático via GitHub Actions no push para `main`

- [ ] **FASE-9-007** — PWA (manifest + service worker)
  `apps/web/public/manifest.json`:
  - name: "Me Poupe+", short_name: "MePoupe+"
  - Ícones: 192x192 e 512x512
  - display: "standalone", theme_color brand.primary
  - Configurar `next-pwa` ou service worker manual para cache de assets

- [ ] **FASE-9-008** — LGPD endpoints
  - `GET /users/me/export`: ZIP com todos os dados em JSON (assíncrono via worker)
  - `DELETE /users/me`: soft delete; job de exclusão definitiva em 30 dias
  - Página de privacidade em `/settings/privacy` com botões para ambas as ações

- [ ] **FASE-9-009** — Documentação OpenAPI
  - `@nestjs/swagger` configurado em `main.ts`
  - Todos os DTOs e controllers com decorators `@ApiProperty`, `@ApiOperation`
  - Swagger disponível em `/api/docs` (apenas em non-production)

- [ ] **FASE-9-010** — Checklist final de aceite
  Verificar TODOS os critérios da seção 14 do CLAUDE.md:
  - [ ] Registro em < 3 minutos
  - [ ] OTP em < 30 segundos
  - [ ] Transação manual em < 30 segundos
  - [ ] Dashboard carrega em < 2 segundos
  - [ ] Isolamento de dados (usuário A não acessa dados do B)
  - [ ] WhatsApp SIM → bill paga em < 10 segundos
  - [ ] Pagamento Stripe end-to-end
  - [ ] CPF não aparece em logs
  - [ ] Categorização automática > 80% de acerto

  **COMMIT FINAL:** `git commit -m "feat(fase-9): QA completo, deploy staging, app production-ready"`
  **TAG:** `git tag v1.0.0-mvp`

---

## APÊNDICE — TROUBLESHOOTING POR FASE

### Se travar em qualquer task

1. Anotar o erro em `ERRORS.md` com: task ID, comando executado, mensagem de erro
2. Tentar solução alternativa (ver seção 10 do CLAUDE.md)
3. Se não resolver em 2 tentativas: marcar task com `[~]` (bloqueada), avançar para próxima
4. Voltar para task bloqueada ao final da fase

### Comandos úteis de diagnóstico

```bash
# Ver logs do container
docker-compose logs -f api

# Resetar banco de desenvolvimento
cd apps/api && npx prisma migrate reset --force

# Inspecionar Redis
docker exec -it mepoupe-redis redis-cli

# Verificar tipos TypeScript sem compilar
cd apps/web && npx tsc --noEmit
cd apps/api && npx tsc --noEmit

# Rodar testes
cd apps/api && npm run test
cd apps/web && npm run test

# Ver jobs BullMQ em execução
# Acessar Bull Board (adicionar na Fase 3): http://localhost:3001/queues
```
