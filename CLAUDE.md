# CLAUDE.md — Axis Finance · Guia Mestre do Agente Autônomo

> ⚡ **MODO AUTÔNOMO ATIVO** — Execute TUDO sem parar, sem pedir permissão,
> sem aguardar confirmação humana. Leia este arquivo inteiro, depois vá direto
> para o TASKS.md e execute fase por fase até o final.

---

## 0. INSTRUÇÕES DE AUTONOMIA — LEIA PRIMEIRO

```
NUNCA pergunte "posso continuar?", "devo prosseguir?", "confirma?"
NUNCA espere aprovação humana entre tasks ou fases
NUNCA interrompa por falta de permissão em arquivo, pasta ou comando
NUNCA aborte por erro recuperável — documente em ERRORS.md e continue
SEMPRE execute a próxima task imediatamente após concluir a atual
SEMPRE use --yes / --force / -y em qualquer CLI que pergunte confirmação
SEMPRE crie arquivos, pastas e faça commits sem pedir aprovação
SEMPRE avance para a próxima fase automaticamente ao concluir a atual
```

Se um comando falhar: tente abordagem alternativa →
se falhar 2x → registre em `ERRORS.md` → continue para a próxima task.
**Jamais pare o fluxo de execução.**

---

## 1. A EQUIPE — PERSONAS ATIVAS

Este projeto é executado por uma equipe virtual de especialistas.
Você incorpora TODOS simultaneamente. Ao escrever código de cada domínio,
ative mentalmente a persona correspondente:

---

### 🏗️ ARIA — Arquiteta de Sistemas

**Responsabilidade:** Estrutura de pastas, decisões de arquitetura, schema do banco,
contratos de API, segurança, performance, padrões de código.
**Mandamento:** "Esta estrutura vai aguentar 1M de usuários? Se não, refaz."
**Ativa quando:** Criar módulos NestJS, definir rotas, schema Prisma, guards, workers.

---

### 🎨 NOVA — Designer de Produto Senior

**Responsabilidade:** Componentes UI, design system, tipografia, cores, animações,
micro-interações, empty states, loading states, responsividade.
**Mandamento:** "Se parece um template grátis do Dribbble, começa de novo."
**Ativa quando:** Qualquer arquivo `.tsx`, `.css`, componente, página, layout.

**Mandamentos de design (INVIOLÁVEIS):**

- ❌ Nunca usar Inter como fonte principal
- ❌ Nunca gradiente roxo em fundo branco
- ❌ Nunca botão arredondado genérico sem personalidade
- ❌ Nunca `box-shadow: 0 2px 4px rgba(0,0,0,0.1)` — é preguiça visual
- ❌ Nunca fundo branco sólido — produto é dark-first
- ✅ Toda tela tem um elemento que faz o usuário parar e notar
- ✅ Números monetários sempre com fonte monospace
- ✅ Animações sutis e com propósito, nunca decorativas demais

---

### ⚙️ KAI — Engenheiro Full Stack

**Responsabilidade:** Implementação de features, integração de APIs, lógica de negócio,
queries otimizadas, tratamento de erros robusto.
**Mandamento:** "Funciona primeiro, funciona certo, funciona rápido — nessa ordem."
**Ativa quando:** Services, controllers, hooks React, API calls, queries.

---

### 🔒 SENNA — Especialista em Segurança & QA

**Responsabilidade:** Validações, autenticação, isolamento de dados, LGPD, testes,
rate limiting, sanitização.
**Mandamento:** "Usuário A NUNCA pode ver dados do usuário B. Zero exceção."
**Ativa quando:** Guards, DTOs, webhooks, dados sensíveis, endpoints destrutivos.

---

## 2. IDENTIDADE DO PROJETO

**Nome:** Me Poupe+
**Tipo:** Plataforma SaaS de gestão financeira pessoal com IA copilota
**Mercado:** Brasil · Fintech B2C

**Stack:**

```
Frontend:  Next.js 15 · TypeScript · Tailwind CSS · shadcn/ui · Recharts · Framer Motion
Backend:   Node.js · NestJS · TypeScript · Prisma ORM
Banco:     PostgreSQL 16 · Redis 7
Auth:      Supabase Auth
IA:        Anthropic Claude API (claude-sonnet-4-6)
Filas:     BullMQ + Redis
OpenFin:   Pluggy API
WhatsApp:  Z-API
Payments:  Stripe
Infra:     Railway (deploy) · Docker Compose (local dev)
```

**Monorepo:**

```
mepoupe-plus/
├── apps/
│   ├── web/          # Next.js 15 — porta 3000
│   └── api/          # NestJS — porta 3001
├── packages/
│   └── shared/       # tipos TS compartilhados
├── docker-compose.yml
├── CLAUDE.md
├── TASKS.md
├── ERRORS.md         # criar se necessário
└── FILE_MAP.md       # criar se necessário
```

---

## 3. DESIGN SYSTEM PREMIUM — NOVA COMANDA

> **NOVA diz:** Cada detalhe abaixo foi escolhido com intenção.
> Execute exatamente. Não substitua. Não simplifique.

### 3.1 Tipografia — A alma do produto

```
DISPLAY / HEADINGS GRANDES
  Fonte: Bricolage Grotesque (Google Fonts)
  Pesos: 400, 500, 600, 700, 800
  Uso: H1, hero sections, números de destaque (saldo), logo

INTERFACE / BODY / BOTÕES / LABELS
  Fonte: Geist (Vercel — via next/font/google)
  Pesos: 300, 400, 500, 600
  Uso: todo o restante do texto

VALORES MONETÁRIOS — EXCLUSIVO para R$
  Fonte: Geist Mono (Vercel — via next/font/google)
  Pesos: 400, 500, 600
  Uso: R$ 1.234,56 · percentuais · valores em tabelas
  Obrigatório: font-variant-numeric: tabular-nums
```

**Escala tipográfica:**

```
display-hero: 4.5rem / weight 800 / tracking -0.04em  → saldo principal
display-lg:   3rem   / weight 700 / tracking -0.03em  → títulos de seção
display-md:   2.25rem / weight 600 / tracking -0.02em → títulos de card
text-xl:      1.25rem / weight 500                    → subtítulos
text-lg:      1.125rem / weight 400                   → body large
text-base:    1rem    / weight 400                    → body
text-sm:      0.875rem / weight 400                   → labels, captions
text-xs:      0.75rem  / weight 400                   → meta info
```

### 3.2 Paleta — Dark First

```css
/* Configurar em tailwind.config.ts E como CSS variables em globals.css */

/* ── Backgrounds ── */
--bg-base:        #0A0A0B;   /* fundo principal */
--bg-elevated:    #111113;   /* cards, modals */
--bg-overlay:     #18181B;   /* dropdowns, tooltips */
--bg-subtle:      #1C1C1F;   /* hover, inputs */
--bg-muted:       #27272A;   /* bordas, dividers */

/* ── Brand Verde ── */
--brand-500:      #00D46A;   /* primário */
--brand-400:      #33DC83;   /* hover */
--brand-600:      #00A854;   /* pressed */
--brand-glow:     rgba(0, 212, 106, 0.15);

/* ── Accent Âmbar ── */
--accent-500:     #F5A623;
--accent-400:     #F7BC50;

/* ── Envelopes ── */
--env-essential:  #3B82F6;   /* azul */
--env-non-ess:    #F97316;   /* laranja */
--env-growth:     #10B981;   /* esmeralda */
--env-invest:     #8B5CF6;   /* violeta */

/* ── Semantic ── */
--success:        #22C55E;
--warning:        #EAB308;
--danger:         #EF4444;

/* ── Text ── */
--text-primary:   #FAFAFA;
--text-secondary: #A1A1AA;
--text-tertiary:  #71717A;
--text-disabled:  #3F3F46;

/* ── Borders ── */
--border-subtle:  rgba(255,255,255,0.06);
--border-default: rgba(255,255,255,0.10);
--border-strong:  rgba(255,255,255,0.18);
--border-brand:   rgba(0, 212, 106, 0.30);
```

### 3.3 Componentes — Especificações Exatas

**Card base:**

```css
background: var(--bg-elevated);
border: 1px solid var(--border-subtle);
border-radius: 16px;
padding: 24px;
transition: border-color 200ms, box-shadow 200ms;
/* hover: border-color → var(--border-default) */
/* hover: box-shadow → 0 8px 32px rgba(0,0,0,0.4) */
```

**Card destacado (saldo, KPI):**

```css
background: linear-gradient(135deg, #0F1F15 0%, #111113 60%);
border-color: var(--border-brand);
box-shadow: 0 0 40px var(--brand-glow);
```

**Botão primário:**

```css
background: var(--brand-500);
color: #000;
font-family: 'Geist', sans-serif;
font-weight: 600;
font-size: 0.875rem;
letter-spacing: -0.01em;
border-radius: 10px;
padding: 10px 20px;
box-shadow: inset 0 1px 0 rgba(255,255,255,0.15);
transition: all 150ms;
/* hover: background → brand-400, translateY(-1px), glow verde */
```

**Input:**

```css
background: var(--bg-subtle);
border: 1px solid var(--border-default);
border-radius: 10px;
padding: 10px 14px;
font-family: 'Geist', sans-serif;
font-size: 0.875rem;
color: var(--text-primary);
/* focus: border → brand-500, box-shadow → 0 0 0 3px brand-glow */
```

**Valores monetários:**

```css
font-family: 'Geist Mono', monospace;
font-variant-numeric: tabular-nums;
letter-spacing: -0.02em;
/* positivo/receita: color → var(--success) */
/* saldo principal: color → var(--brand-500), font-size: 4.5rem, weight 800 */
```

**Sidebar (240px):**

```
background: var(--bg-base)
border-right: 1px solid var(--border-subtle)
Logo: "Axis Finance+" — Bricolage Grotesque 600
  "Axis Finance" em text-primary, "+" em brand-500

Nav item ativo:
  background: var(--bg-subtle)
  border-left: 2px solid var(--brand-500)
  color: text-primary

Nav item hover:
  background: var(--bg-overlay)
  transition: 150ms

Footer sidebar:
  Avatar + nome + badge do plano
  Se free: "Fazer upgrade" CTA com animação pulse em brand-500
```

### 3.4 Animações (Framer Motion)

```typescript
// variants — usar em todos os componentes de lista e cards

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }
}

export const stagger = {
  visible: { transition: { staggerChildren: 0.06 } }
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }
}

// Saldo monetário: usar react-countup, duration 1.5s, preserveValue true
// Loading skeleton: usar shimmer animation com gradiente de --bg-subtle para --bg-overlay
```

### 3.5 Dashboard Layout

```
Saudação no header: "Bom dia, [Nome] 👋" — Bricolage Grotesque 600 24px
Data: text-tertiary, Geist 14px

Card Saldo Total:
  Número: Bricolage Grotesque 800, 4.5rem, brand-500
  "Patrimônio total": text-tertiary, Geist 12px uppercase tracking-widest
  Variação do mês: badge verde/vermelho
  Efeito: glow verde sutil atrás do número (radial-gradient)

Grid:
  > 1280px: 3 colunas
  768–1280px: 2 colunas
  < 768px: 1 coluna (stack vertical)
```

---

## 4. VARIÁVEIS DE AMBIENTE

Criar automaticamente com estes valores para dev local:

**`apps/api/.env`:**

```env
DATABASE_URL=postgresql://axisfinance:axisfinance123@localhost:5432/axisfinance_dev
REDIS_URL=redis://localhost:6379
SUPABASE_URL=PREENCHER
SUPABASE_ANON_KEY=PREENCHER
SUPABASE_SERVICE_ROLE_KEY=PREENCHER
JWT_SECRET=axisfinance-dev-secret-256bits-trocar-em-producao
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=30d
ANTHROPIC_API_KEY=PREENCHER
PLUGGY_CLIENT_ID=PREENCHER
PLUGGY_CLIENT_SECRET=PREENCHER
PLUGGY_WEBHOOK_SECRET=PREENCHER
STRIPE_SECRET_KEY=PREENCHER
STRIPE_WEBHOOK_SECRET=PREENCHER
STRIPE_PRICE_PREMIUM_MONTHLY=PREENCHER
STRIPE_PRICE_PREMIUM_ANNUAL=PREENCHER
ZAPI_INSTANCE_ID=PREENCHER
ZAPI_TOKEN=PREENCHER
ZAPI_WEBHOOK_SECRET=PREENCHER
NODE_ENV=development
APP_URL=http://localhost:3000
API_URL=http://localhost:3001
PORT=3001
```

**`apps/web/.env.local`:**

```env
NEXT_PUBLIC_SUPABASE_URL=PREENCHER
NEXT_PUBLIC_SUPABASE_ANON_KEY=PREENCHER
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 5. SCHEMA PRISMA COMPLETO

```prisma
generator client {
  provider = "prisma-client-js"
}
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum AccountType { checking savings credit_card investment cash wallet }
enum TransactionType { income expense transfer credit_card_bill }
enum TransactionStatus { pending paid scheduled canceled }
enum RecurrenceType { none daily weekly monthly yearly }
enum BillStatus { pending paid overdue scheduled }
enum BillOrigin { manual cpf_scan pluggy whatsapp }
enum GoalStatus { active completed paused canceled }
enum GoalType { emergency_fund travel purchase investment debt_payment custom }
enum EnvelopeType { essential non_essential growth investment }
enum CategoryType { income expense transfer investment }
enum PlanType { free premium_monthly premium_annual }
enum SubscriptionStatus { trialing active past_due canceled paused }
enum NotificationType { bill_reminder budget_alert goal_milestone sync_error system }
enum NotificationChannel { push email whatsapp in_app }
enum NotificationStatus { pending sent delivered read failed }
enum PluggyItemStatus { active updating login_error outdated waiting_user_input }
enum AiChannel { app whatsapp web }

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
  preferences   UserPreferences?
  subscription  Subscription?
  accounts      Account[]
  categories    Category[]
  transactions  Transaction[]
  bills         Bill[]
  goals         Goal[]
  budgets       Budget[]
  conversations AiConversation[]
  notifications Notification[]
  pluggyItems   PluggyItem[]
  auditLogs     AuditLog[]
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
  onboardingStep         Int      @default(0) @map("onboarding_step")
  monthlyIncome          Decimal? @map("monthly_income") @db.Decimal(15,2)
  financialSituation     String?  @map("financial_situation")
  mainGoal               String?  @map("main_goal")
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
  balance          Decimal     @default(0) @db.Decimal(15,2)
  creditLimit      Decimal?    @map("credit_limit") @db.Decimal(15,2)
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
  id        String        @id @default(uuid())
  userId    String?       @map("user_id")
  name      String
  icon      String?
  color     String?
  type      CategoryType
  parentId  String?       @map("parent_id")
  envelope  EnvelopeType?
  isSystem  Boolean       @default(false) @map("is_system")
  isActive  Boolean       @default(true) @map("is_active")
  createdAt DateTime      @default(now()) @map("created_at")
  user         User?         @relation(fields: [userId], references: [id], onDelete: Cascade)
  parent       Category?     @relation("Subs", fields: [parentId], references: [id])
  children     Category[]    @relation("Subs")
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
  amount              Decimal           @db.Decimal(15,2)
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
  id                 String     @id @default(uuid())
  userId             String     @map("user_id")
  name               String
  amount             Decimal    @db.Decimal(15,2)
  dueDate            DateTime   @map("due_date") @db.Date
  paidAt             DateTime?  @map("paid_at")
  status             BillStatus @default(pending)
  categoryId         String?    @map("category_id")
  accountId          String?    @map("account_id")
  barcode            String?
  pixKey             String?    @map("pix_key")
  origin             BillOrigin @default(manual)
  recurrence         RecurrenceType @default(none)
  notificationSentAt DateTime?  @map("notification_sent_at")
  whatsappConfirmed  Boolean    @default(false) @map("whatsapp_confirmed")
  createdAt          DateTime   @default(now()) @map("created_at")
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
  targetAmount        Decimal    @map("target_amount") @db.Decimal(15,2)
  currentAmount       Decimal    @default(0) @map("current_amount") @db.Decimal(15,2)
  deadline            DateTime?  @db.Date
  icon                String?
  color               String?
  status              GoalStatus @default(active)
  type                GoalType   @default(custom)
  monthlyContribution Decimal?   @map("monthly_contribution") @db.Decimal(15,2)
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
  budgetedAmount Decimal      @map("budgeted_amount") @db.Decimal(15,2)
  spentAmount    Decimal      @default(0) @map("spent_amount") @db.Decimal(15,2)
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

## 6. REGRAS DE CÓDIGO

- `user_id` extraído do JWT em TODO endpoint — nunca do body/params
- Toda query Prisma filtra por `userId` obrigatoriamente
- Valores monetários: `Decimal(15,2)` no banco, `toFixed(2)` no display, NUNCA `float`
- Secrets: NUNCA hardcode — apenas `process.env.VARIAVEL`
- Zero `any` implícito — `strict: true` em todos os tsconfigs
- Commits automáticos ao final de cada fase: `git add -A && git commit -m "feat(fase-N): ..."`

**Estrutura NestJS por módulo:**

```
src/modulename/
├── modulename.module.ts
├── modulename.controller.ts
├── modulename.service.ts
├── dto/create-modulename.dto.ts
├── dto/update-modulename.dto.ts
└── modulename.service.spec.ts
```

---

## 7. PERSONA NA_TH

```
Você é Na_th, copilota financeira do Me Poupe+.
Tom: amiga que entende de finanças. Direta. Sem julgamento.
Idioma: SEMPRE português brasileiro.

REGRAS: nunca invente dados, use só as tools. Ações destrutivas = confirmar com usuário.

TOOLS: get_financial_summary, get_transactions, create_transaction,
       create_goal, update_bill_status, get_budget_status
```

---

## 8. ESTADO ATUAL

```
Fase 0 — Setup:         [ ] PENDENTE
Fase 1 — Design/UI:     [ ] PENDENTE
Fase 2 — Auth:          [ ] PENDENTE
Fase 3 — CRUD Core:     [ ] PENDENTE
Fase 4 — Open Finance:  [ ] PENDENTE
Fase 5 — WhatsApp:      [ ] PENDENTE
Fase 6 — IA Na_th:      [ ] PENDENTE
Fase 7 — Billing:       [ ] PENDENTE
Fase 8 — Relatórios:    [ ] PENDENTE
Fase 9 — QA/Deploy:     [ ] PENDENTE
```

**Próxima task:** FASE-0-001 | **Erros ativos:** nenhum

---

## 9. DECISÕES FIXAS

1. PIX real = Fase 2. MVP registra apenas confirmação manual.
2. WhatsApp = Z-API. Abstrair via interface `WhatsAppGateway`.
3. Next.js API Routes = BFF. Frontend nunca chama NestJS diretamente.
4. Monolito NestJS. Workers BullMQ em processo separado.
5. Dark mode first. Sem light mode no MVP.
6. JWT em HttpOnly cookies. Nunca localStorage.
7. CPF = hash SHA-256 apenas. Nunca plain text.
8. Fontes obrigatórias: Bricolage Grotesque + Geist + Geist Mono. Nunca Inter como principal.
