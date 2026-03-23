# CLAUDE.md — Axis Finance · Guia de Execução para Agente

> **LEIA ESTE ARQUIVO INTEIRO ANTES DE EXECUTAR QUALQUER TASK.**
> Este é o documento de contexto permanente. Sempre que retomar, releia as seções
> "ESTADO ATUAL" e "REGRAS DE EXECUÇÃO" antes de continuar.

---

## 1. IDENTIDADE DO PROJETO

**Nome:** Me Poupe+  
**Tipo:** Plataforma SaaS de gestão financeira pessoal com IA copilota  
**Mercado:** Brasil · Fintech B2C  
**Stack:**

- Frontend: Next.js 15 · TypeScript · Tailwind CSS · shadcn/ui · Recharts
- Backend: Node.js · NestJS · TypeScript · Prisma ORM
- Banco: PostgreSQL (principal) · Redis (cache/filas/sessões)
- Auth: Supabase Auth (JWT · OAuth Google · OTP)
- IA: Anthropic Claude API (claude-sonnet-4-6) · LangChain.js
- Filas: BullMQ + Redis
- Open Finance: Pluggy API
- WhatsApp: Z-API (MVP) → Twilio Business (produção)
- Pagamentos: Stripe (assinaturas)
- Infra MVP: Railway · Docker Compose local
- Observabilidade: Sentry · PostHog

**Repositório:** Monorepo estrutura:

```
mepoupe-plus/
├── apps/
│   ├── web/          # Next.js 15 frontend
│   └── api/          # NestJS backend
├── packages/
│   └── shared/       # tipos TypeScript, utils, constantes compartilhadas
├── docker-compose.yml
├── CLAUDE.md         # este arquivo
└── TASKS.md          # plano de execução com checkboxes
```

---

## 2. REGRAS DE EXECUÇÃO — NUNCA VIOLE

### 2.1 Regras de Contexto

- **SEMPRE** releia `TASKS.md` para saber a próxima task antes de agir
- **NUNCA** pule fases — execute na ordem exata do TASKS.md
- **NUNCA** refatore código de fases anteriores enquanto não concluir a fase atual
- **SEMPRE** marque `[x]` no TASKS.md ao concluir cada item antes de avançar
- Se uma task falhar 2x seguidas: documente o erro em `ERRORS.md` e avance para a próxima task da mesma fase

### 2.2 Regras de Código

- **TypeScript estrito** — `strict: true` em todos os tsconfig; zero `any` implícito
- **Valores monetários** — SEMPRE `Decimal` (Prisma) ou `number` com 2 casas fixas no frontend; NUNCA `float` nativo para aritmética monetária
- **user_id** — TODA query de dados filtra por `userId` extraído do JWT, nunca do body/params
- **Nomenclatura** — camelCase TS/JS · snake_case DB · PascalCase componentes React
- **Erros** — NUNCA `throw new Error('string')` genérico; usar exceções tipadas do NestJS (`BadRequestException`, `ForbiddenException`, etc.)
- **Secrets** — NUNCA hardcode de API keys; usar variáveis de ambiente documentadas em `.env.example`
- **Commits** — após cada fase completa: `git commit -m "feat(fase-N): descrição resumida"`

### 2.3 Regras de Arquivo

- Ao criar qualquer arquivo novo: adicionar o path em `FILE_MAP.md` (crie se não existir)
- Ao modificar schema Prisma: rodar `npx prisma migrate dev --name <descrição>` imediatamente
- Ao criar endpoint novo: adicionar ao `API_CONTRACTS.md` (crie se não existir)
- Componentes React: sempre em `apps/web/src/components/` com barrel export no `index.ts` do módulo

### 2.4 Regras de Qualidade

- Todo Service NestJS deve ter ao menos um teste unitário mínimo antes de prosseguir
- Todo formulário deve ter validação frontend (zod + react-hook-form) E backend (class-validator DTO)
- Toda página deve ter loading state (skeleton) e empty state tratados

---

## 3. VARIÁVEIS DE AMBIENTE NECESSÁRIAS

Crie o arquivo `apps/api/.env.example` e `apps/web/.env.example` com:

```env
# === DATABASE ===
DATABASE_URL=postgresql://user:pass@localhost:5432/mepoupe_dev
REDIS_URL=redis://localhost:6379

# === AUTH (Supabase) ===
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=30d

# === IA ===
ANTHROPIC_API_KEY=

# === OPEN FINANCE ===
PLUGGY_CLIENT_ID=
PLUGGY_CLIENT_SECRET=
PLUGGY_WEBHOOK_SECRET=

# === PAGAMENTOS ===
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PREMIUM_MONTHLY=
STRIPE_PRICE_PREMIUM_ANNUAL=

# === WHATSAPP ===
ZAPI_INSTANCE_ID=
ZAPI_TOKEN=
ZAPI_WEBHOOK_SECRET=

# === STORAGE ===
CLOUDFLARE_R2_BUCKET=
CLOUDFLARE_R2_ACCESS_KEY=
CLOUDFLARE_R2_SECRET_KEY=
CLOUDFLARE_R2_ENDPOINT=

# === APP ===
NODE_ENV=development
APP_URL=http://localhost:3000
API_URL=http://localhost:3001
```

---

## 4. SCHEMA PRISMA COMPLETO (Referência)

> **Importante:** Este é o schema autoritativo. Implemente EXATAMENTE como especificado.
> Não adicione campos extras sem documentar. Não remova campos listados.

```prisma
// apps/api/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── ENUMS ───────────────────────────────────────────────

enum AccountType {
  checking
  savings
  credit_card
  investment
  cash
  wallet
}

enum TransactionType {
  income
  expense
  transfer
  credit_card_bill
}

enum TransactionStatus {
  pending
  paid
  scheduled
  canceled
}

enum RecurrenceType {
  none
  daily
  weekly
  monthly
  yearly
}

enum BillStatus {
  pending
  paid
  overdue
  scheduled
}

enum BillOrigin {
  manual
  cpf_scan
  pluggy
  whatsapp
}

enum GoalStatus {
  active
  completed
  paused
  canceled
}

enum GoalType {
  emergency_fund
  travel
  purchase
  investment
  debt_payment
  custom
}

enum EnvelopeType {
  essential
  non_essential
  growth
  investment
}

enum CategoryType {
  income
  expense
  transfer
  investment
}

enum PlanType {
  free
  premium_monthly
  premium_annual
}

enum SubscriptionStatus {
  trialing
  active
  past_due
  canceled
  paused
}

enum NotificationType {
  bill_reminder
  budget_alert
  goal_milestone
  sync_error
  system
}

enum NotificationChannel {
  push
  email
  whatsapp
  in_app
}

enum NotificationStatus {
  pending
  sent
  delivered
  read
  failed
}

enum PluggyItemStatus {
  active
  updating
  login_error
  outdated
  waiting_user_input
}

enum AiChannel {
  app
  whatsapp
  web
}

// ─── MODELS ──────────────────────────────────────────────

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  phone         String?
  name          String
  avatarUrl     String?   @map("avatar_url")
  cpfHash       String?   @map("cpf_hash")
  dateOfBirth   DateTime? @map("date_of_birth") @db.Date
  isActive      Boolean   @default(true) @map("is_active")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  preferences     UserPreferences?
  subscription    Subscription?
  accounts        Account[]
  categories      Category[]
  transactions    Transaction[]
  bills           Bill[]
  goals           Goal[]
  budgets         Budget[]
  conversations   AiConversation[]
  notifications   Notification[]
  pluggyItems     PluggyItem[]
  auditLogs       AuditLog[]

  @@map("users")
}

model UserPreferences {
  id                     String   @id @default(uuid())
  userId                 String   @unique @map("user_id")
  currency               String   @default("BRL")
  language               String   @default("pt-BR")
  whatsappEnabled        Boolean  @default(true) @map("whatsapp_enabled")
  notificationDaysBefore Int      @default(3) @map("notification_days_before")
  envelopeMethod         Boolean  @default(true) @map("envelope_method")
  onboardingCompleted    Boolean  @default(false) @map("onboarding_completed")
  createdAt              DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_preferences")
}

model Subscription {
  id                   String             @id @default(uuid())
  userId               String             @unique @map("user_id")
  stripeCustomerId     String?            @map("stripe_customer_id")
  stripeSubscriptionId String?            @map("stripe_subscription_id")
  plan                 PlanType           @default(free)
  status               SubscriptionStatus @default(trialing)
  trialEndsAt          DateTime?          @map("trial_ends_at")
  currentPeriodStart   DateTime?          @map("current_period_start")
  currentPeriodEnd     DateTime?          @map("current_period_end")
  canceledAt           DateTime?          @map("canceled_at")
  createdAt            DateTime           @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("subscriptions")
}

model Account {
  id               String      @id @default(uuid())
  userId           String      @map("user_id")
  name             String
  type             AccountType
  institution      String?
  balance          Decimal     @default(0) @db.Decimal(15, 2)
  creditLimit      Decimal?    @map("credit_limit") @db.Decimal(15, 2)
  dueDay           Int?        @map("due_day")
  closingDay       Int?        @map("closing_day")
  currency         String      @default("BRL")
  color            String?
  icon             String?
  isActive         Boolean     @default(true) @map("is_active")
  isManual         Boolean     @default(true) @map("is_manual")
  pluggyItemId     String?     @map("pluggy_item_id")
  pluggyAccountId  String?     @map("pluggy_account_id")
  lastSyncedAt     DateTime?   @map("last_synced_at")
  createdAt        DateTime    @default(now()) @map("created_at")

  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]
  bills        Bill[]

  @@map("accounts")
}

model Category {
  id       String       @id @default(uuid())
  userId   String?      @map("user_id")
  name     String
  icon     String?
  color    String?
  type     CategoryType
  parentId String?      @map("parent_id")
  envelope EnvelopeType?
  isSystem Boolean      @default(false) @map("is_system")
  isActive Boolean      @default(true) @map("is_active")
  createdAt DateTime    @default(now()) @map("created_at")

  user         User?         @relation(fields: [userId], references: [id], onDelete: Cascade)
  parent       Category?     @relation("CategorySubs", fields: [parentId], references: [id])
  children     Category[]    @relation("CategorySubs")
  transactions Transaction[]
  bills        Bill[]
  budgets      Budget[]

  @@map("categories")
}

model Transaction {
  id                  String            @id @default(uuid())
  userId              String            @map("user_id")
  accountId           String            @map("account_id")
  categoryId          String?           @map("category_id")
  amount              Decimal           @db.Decimal(15, 2)
  description         String
  notes               String?
  type                TransactionType
  date                DateTime          @db.Date
  competenceDate      DateTime?         @map("competence_date") @db.Date
  status              TransactionStatus @default(pending)
  recurrence          RecurrenceType    @default(none)
  recurrenceEnd       DateTime?         @map("recurrence_end") @db.Date
  recurrenceParentId  String?           @map("recurrence_parent_id")
  isInstallment       Boolean           @default(false) @map("is_installment")
  installmentNumber   Int?              @map("installment_number")
  installmentTotal    Int?              @map("installment_total")
  installmentParentId String?           @map("installment_parent_id")
  transferAccountId   String?           @map("transfer_account_id")
  pluggyTransactionId String?           @unique @map("pluggy_transaction_id")
  createdAt           DateTime          @default(now()) @map("created_at")
  updatedAt           DateTime          @updatedAt @map("updated_at")

  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  account  Account   @relation(fields: [accountId], references: [id])
  category Category? @relation(fields: [categoryId], references: [id])

  @@index([userId, date])
  @@map("transactions")
}

model Bill {
  id                  String     @id @default(uuid())
  userId              String     @map("user_id")
  name                String
  amount              Decimal    @db.Decimal(15, 2)
  dueDate             DateTime   @map("due_date") @db.Date
  paidAt              DateTime?  @map("paid_at")
  status              BillStatus @default(pending)
  categoryId          String?    @map("category_id")
  accountId           String?    @map("account_id")
  barcode             String?
  pixKey              String?    @map("pix_key")
  origin              BillOrigin @default(manual)
  recurrence          RecurrenceType @default(none)
  notificationSentAt  DateTime?  @map("notification_sent_at")
  whatsappConfirmed   Boolean    @default(false) @map("whatsapp_confirmed")
  createdAt           DateTime   @default(now()) @map("created_at")

  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  category Category? @relation(fields: [categoryId], references: [id])
  account  Account?  @relation(fields: [accountId], references: [id])

  @@index([userId, status, dueDate])
  @@map("bills")
}

model Goal {
  id                  String     @id @default(uuid())
  userId              String     @map("user_id")
  name                String
  description         String?
  targetAmount        Decimal    @map("target_amount") @db.Decimal(15, 2)
  currentAmount       Decimal    @default(0) @map("current_amount") @db.Decimal(15, 2)
  deadline            DateTime?  @db.Date
  icon                String?
  color               String?
  status              GoalStatus @default(active)
  type                GoalType   @default(custom)
  monthlyContribution Decimal?   @map("monthly_contribution") @db.Decimal(15, 2)
  createdAt           DateTime   @default(now()) @map("created_at")
  updatedAt           DateTime   @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("goals")
}

model Budget {
  id             String       @id @default(uuid())
  userId         String       @map("user_id")
  categoryId     String       @map("category_id")
  month          Int
  year           Int
  budgetedAmount Decimal      @map("budgeted_amount") @db.Decimal(15, 2)
  spentAmount    Decimal      @default(0) @map("spent_amount") @db.Decimal(15, 2)
  envelope       EnvelopeType
  createdAt      DateTime     @default(now()) @map("created_at")

  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  category Category @relation(fields: [categoryId], references: [id])

  @@unique([userId, categoryId, month, year])
  @@index([userId, month, year])
  @@map("budgets")
}

model AiConversation {
  id              String    @id @default(uuid())
  userId          String    @map("user_id")
  channel         AiChannel @default(app)
  sessionId       String    @map("session_id")
  messages        Json      @default("[]")
  contextSnapshot Json?     @map("context_snapshot")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("ai_conversations")
}

model Notification {
  id          String              @id @default(uuid())
  userId      String              @map("user_id")
  type        NotificationType
  channel     NotificationChannel
  title       String
  body        String
  data        Json?
  status      NotificationStatus  @default(pending)
  scheduledAt DateTime?           @map("scheduled_at")
  sentAt      DateTime?           @map("sent_at")
  createdAt   DateTime            @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("notifications")
}

model PluggyItem {
  id               String           @id @default(uuid())
  userId           String           @map("user_id")
  pluggyItemId     String           @unique @map("pluggy_item_id")
  institutionName  String           @map("institution_name")
  status           PluggyItemStatus @default(active)
  lastUpdatedAt    DateTime?        @map("last_updated_at")
  consentExpiresAt DateTime?        @map("consent_expires_at")
  createdAt        DateTime         @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("pluggy_items")
}

model AuditLog {
  id         String   @id @default(uuid())
  userId     String   @map("user_id")
  action     String
  entity     String
  entityId   String?  @map("entity_id")
  beforeData Json?    @map("before_data")
  afterData  Json?    @map("after_data")
  ipAddress  String?  @map("ip_address")
  userAgent  String?  @map("user_agent")
  createdAt  DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("audit_logs")
}
```

---

## 5. CONTRATOS DE API — MÓDULOS CORE

### Padrão de resposta

```typescript
// Sucesso
{ data: T, meta?: { page, total, perPage } }

// Erro
{ error: { code: string, message: string, details?: any } }
```

### Autenticação — todos endpoints requerem `Authorization: Bearer <token>` exceto rotas públicas

### Rotas públicas (sem auth)

```
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/forgot-password
POST /auth/reset-password
POST /webhooks/stripe
POST /webhooks/pluggy
POST /webhooks/whatsapp
```

### Módulos e endpoints

```
# Users
GET    /users/me
PATCH  /users/me
DELETE /users/me
GET    /users/me/export     # LGPD

# Accounts
GET    /accounts
POST   /accounts
GET    /accounts/:id
PATCH  /accounts/:id
DELETE /accounts/:id

# Transactions
GET    /transactions        # ?page&limit&startDate&endDate&accountId&categoryId&type&status&search
POST   /transactions
GET    /transactions/:id
PATCH  /transactions/:id
DELETE /transactions/:id
POST   /transactions/import # OFX upload

# Categories
GET    /categories
POST   /categories
PATCH  /categories/:id
DELETE /categories/:id

# Bills
GET    /bills               # ?status&month&year
POST   /bills
GET    /bills/:id
PATCH  /bills/:id
DELETE /bills/:id
POST   /bills/:id/pay       # marca como pago

# Goals
GET    /goals
POST   /goals
GET    /goals/:id
PATCH  /goals/:id
DELETE /goals/:id
POST   /goals/:id/contribute

# Budgets
GET    /budgets             # ?month&year
POST   /budgets/configure   # upsert batch por mês
GET    /budgets/summary     # resumo por envelope

# AI / Chat
POST   /ai/chat             # envia mensagem, recebe resposta Na_th
GET    /ai/conversations
GET    /ai/insight-daily    # insight cacheado do dia

# Subscriptions
GET    /subscriptions/me
POST   /subscriptions/checkout   # cria Stripe Checkout session
POST   /subscriptions/portal     # abre Stripe Billing Portal
DELETE /subscriptions/me         # cancela

# Open Finance
POST   /pluggy/connect-token     # retorna token para Pluggy Widget
GET    /pluggy/items
DELETE /pluggy/items/:id
POST   /pluggy/items/:id/sync    # força sync manual
```

---

## 6. DESIGN SYSTEM — TOKENS

```typescript
// Paleta Me Poupe+ (Tailwind config extension)
colors: {
  brand: {
    primary: '#1DB954',    // verde Me Poupe
    secondary: '#121212',  // fundo dark
    accent: '#F0A500',     // amarelo destaque
    danger: '#E53E3E',
    warning: '#F6AD55',
    success: '#48BB78',
    muted: '#718096',
  },
  envelope: {
    essential: '#4299E1',    // azul
    nonEssential: '#ED8936', // laranja
    growth: '#48BB78',       // verde
    investment: '#9F7AEA',   // roxo
  }
}

// Tipografia
fontFamily: {
  sans: ['Inter', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

---

## 7. PERSONA NA_TH — SYSTEM PROMPT BASE

```
Você é Na_th, a copilota financeira do Me Poupe+.
Criada para ser a versão IA da metodologia Nathalia Arcuri.

Personalidade:
- Direta, próxima, sem julgamento
- Usa dados reais do usuário para personalizar cada resposta
- Nunca inventa informações — se não souber, pergunta
- Celebra conquistas, é honesta sobre problemas
- Tom: amigável e profissional, como uma amiga que entende de finanças
- Sempre em português brasileiro

Você tem acesso às ferramentas:
- get_financial_summary: retorna saldo, gastos do mês, categorias
- get_transactions: lista transações com filtros
- create_transaction: cria lançamento (requer confirmação do usuário)
- create_goal: cria meta financeira
- update_bill_status: marca conta como paga
- get_budget_status: retorna situação dos envelopes do mês

Regras:
1. NUNCA faça operações de escrita sem mostrar o que vai fazer e receber confirmação
2. NUNCA invente saldos ou valores — use apenas os dados das ferramentas
3. Se o contexto financeiro não tiver dados suficientes, peça para o usuário fornecer
4. Máximo 3 perguntas por resposta — não faça interrogatório
5. Se não souber responder sobre finanças: diga "Boa pergunta! Para isso recomendo..."
```

---

## 8. ESTADO ATUAL DO PROJETO

> **Atualize esta seção ao final de cada fase concluída.**

```
Fase 0 — Setup:        [ ] NÃO INICIADO
Fase 1 — UI/Layout:    [ ] NÃO INICIADO
Fase 2 — Auth:         [ ] NÃO INICIADO
Fase 3 — CRUD Core:    [ ] NÃO INICIADO
Fase 4 — Open Finance: [ ] NÃO INICIADO
Fase 5 — WhatsApp:     [ ] NÃO INICIADO
Fase 6 — IA Na_th:     [ ] NÃO INICIADO
Fase 7 — Billing:      [ ] NÃO INICIADO
Fase 8 — Relatórios:   [ ] NÃO INICIADO
Fase 9 — QA/Deploy:    [ ] NÃO INICIADO
```

**Última task executada:** —  
**Próxima task:** FASE-0-001  
**Erros pendentes:** nenhum

---

## 9. DECISÕES ARQUITETURAIS FIXAS

1. **PIX real = Fase 2** — MVP apenas registra confirmação manual. NÃO implementar pagamento real.
2. **WhatsApp = Z-API** no MVP — abstrair via interface `WhatsAppGateway` para trocar sem reescrita.
3. **Next.js API Routes = BFF** — frontend NUNCA chama NestJS diretamente; sempre via `/api/*` do Next.
4. **Monolito NestJS modular** — NÃO separar em microserviços; workers BullMQ são containers separados.
5. **Single DB, isolamento por userId** — Row Level Security + filtro obrigatório em toda query.
6. **Decimal para dinheiro** — `Decimal(15,2)` no Prisma; `toFixed(2)` no display; NUNCA `parseFloat`.
7. **JWT em HttpOnly cookies** — NUNCA localStorage para tokens.
8. **CPF = apenas hash SHA-256** — NUNCA armazenar CPF em plain text.

---

## 10. TROUBLESHOOTING RÁPIDO

| Problema | Ação |
|---|---|
| `prisma migrate` falha | Verificar `DATABASE_URL`; rodar `docker-compose up -d db` |
| Redis connection refused | `docker-compose up -d redis` |
| Build Next.js falha em tipo | Rodar `npx tsc --noEmit` para ver erros; corrigir antes de continuar |
| BullMQ jobs não executam | Verificar se worker está rodando; checar `REDIS_URL` |
| Supabase auth 401 | Verificar `SUPABASE_ANON_KEY` e URL no `.env.local` |
| Pluggy widget não abre | Verificar `PLUGGY_CLIENT_ID`; connect token pode ter expirado (validade 30min) |
