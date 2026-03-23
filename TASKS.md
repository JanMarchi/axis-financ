# TASKS.md — Axis Finance · Plano de Execução Autônomo

> **MODO AUTÔNOMO:** Execute TODAS as tasks em sequência sem parar.
> Marque [x] ao concluir cada task. Avance imediatamente para a próxima.
> Nunca pergunte. Nunca espere. Nunca peça permissão.
> Se travar: documente em ERRORS.md, continue na próxima task.

---

## FASE 0 — SETUP E FUNDAÇÃO

**Meta:** Monorepo, Docker, banco e schema prontos. Build passando.

- [ ] **FASE-0-001** — Criar estrutura do monorepo

  ```bash
  mkdir -p mepoupe-plus/apps/web mepoupe-plus/apps/api mepoupe-plus/packages/shared
  cd mepoupe-plus && git init
  ```

  Criar `package.json` raiz:

  ```json
  {
    "name": "axisfinance",
    "private": true,
    "workspaces": ["apps/*", "packages/*"],
    "engines": { "node": ">=20" }
  }
  ```

- [ ] **FASE-0-002** — Criar `docker-compose.yml`

  ```yaml
  version: "3.9"
  services:
    db:
      image: postgres:16-alpine
      environment:
        POSTGRES_USER: mepoupe
        POSTGRES_PASSWORD: mepoupe123
        POSTGRES_DB: mepoupe_dev
      ports: ["5432:5432"]
      volumes: [postgres_data:/var/lib/postgresql/data]
      healthcheck:
        test: ["CMD-SHELL", "pg_isready -U mepoupe"]
        interval: 5s
        timeout: 5s
        retries: 10

    redis:
      image: redis:7-alpine
      ports: ["6379:6379"]
      command: redis-server --appendonly yes
      volumes: [redis_data:/data]
      healthcheck:
        test: ["CMD", "redis-cli", "ping"]
        interval: 5s

  volumes:
    postgres_data:
    redis_data:
  ```

  Rodar: `docker-compose up -d`

- [ ] **FASE-0-003** — Inicializar Next.js 15

  ```bash
  cd apps/web
  npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes
  ```

  Instalar dependências:

  ```bash
  npm install framer-motion recharts react-hook-form zod @hookform/resolvers
  npm install @supabase/ssr @supabase/supabase-js
  npm install react-countup date-fns
  npx shadcn@latest init --yes --base-color zinc --css-variables
  npx shadcn@latest add --yes button card dialog dropdown-menu form input label select separator sheet skeleton tabs toast badge progress avatar
  ```

- [ ] **FASE-0-004** — Instalar fontes premium no Next.js
  Editar `apps/web/src/app/layout.tsx`:

  ```typescript
  import { Geist, Geist_Mono, Bricolage_Grotesque } from 'next/font/google'

  const geist = Geist({
    subsets: ['latin'],
    variable: '--font-geist',
    weight: ['300','400','500','600'],
  })
  const geistMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-geist-mono',
    weight: ['400','500','600'],
  })
  const bricolage = Bricolage_Grotesque({
    subsets: ['latin'],
    variable: '--font-bricolage',
    weight: ['400','500','600','700','800'],
  })
  // Aplicar: className={`${geist.variable} ${geistMono.variable} ${bricolage.variable}`}
  ```

- [ ] **FASE-0-005** — Configurar design system no Tailwind
  Substituir `apps/web/tailwind.config.ts` com:

  ```typescript
  import type { Config } from 'tailwindcss'

  const config: Config = {
    darkMode: ['class'],
    content: ['./src/**/*.{ts,tsx}'],
    theme: {
      extend: {
        fontFamily: {
          display: ['var(--font-bricolage)', 'sans-serif'],
          sans: ['var(--font-geist)', 'sans-serif'],
          mono: ['var(--font-geist-mono)', 'monospace'],
        },
        colors: {
          brand: {
            400: '#33DC83', 500: '#00D46A', 600: '#00A854',
            glow: 'rgba(0, 212, 106, 0.15)',
          },
          accent: { 400: '#F7BC50', 500: '#F5A623', 600: '#D48B1A' },
          envelope: {
            essential: '#3B82F6',
            'non-essential': '#F97316',
            growth: '#10B981',
            investment: '#8B5CF6',
          },
          bg: {
            base: '#0A0A0B',
            elevated: '#111113',
            overlay: '#18181B',
            subtle: '#1C1C1F',
            muted: '#27272A',
          },
        },
        borderRadius: { card: '16px', btn: '10px', input: '10px' },
        backgroundImage: {
          'card-brand': 'linear-gradient(135deg, #0F1F15 0%, #111113 60%)',
        },
        fontSize: {
          'display-hero': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.04em', fontWeight: '800' }],
          'display-lg': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.03em', fontWeight: '700' }],
          'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
        },
        animation: {
          'pulse-brand': 'pulse-brand 2s cubic-bezier(0.4,0,0.6,1) infinite',
          shimmer: 'shimmer 2s linear infinite',
        },
        keyframes: {
          'pulse-brand': {
            '0%, 100%': { boxShadow: '0 0 0 0 rgba(0,212,106,0.4)' },
            '50%': { boxShadow: '0 0 0 8px rgba(0,212,106,0)' },
          },
          shimmer: {
            '0%': { backgroundPosition: '-200% 0' },
            '100%': { backgroundPosition: '200% 0' },
          },
        },
      },
    },
  }
  export default config
  ```

- [ ] **FASE-0-006** — Configurar CSS variables globais
  Substituir `apps/web/src/app/globals.css`:

  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  :root {
    --bg-base: #0A0A0B;
    --bg-elevated: #111113;
    --bg-overlay: #18181B;
    --bg-subtle: #1C1C1F;
    --bg-muted: #27272A;
    --brand-500: #00D46A;
    --brand-400: #33DC83;
    --brand-600: #00A854;
    --brand-glow: rgba(0, 212, 106, 0.15);
    --accent-500: #F5A623;
    --env-essential: #3B82F6;
    --env-non-ess: #F97316;
    --env-growth: #10B981;
    --env-invest: #8B5CF6;
    --success: #22C55E;
    --warning: #EAB308;
    --danger: #EF4444;
    --text-primary: #FAFAFA;
    --text-secondary: #A1A1AA;
    --text-tertiary: #71717A;
    --text-disabled: #3F3F46;
    --border-subtle: rgba(255,255,255,0.06);
    --border-default: rgba(255,255,255,0.10);
    --border-strong: rgba(255,255,255,0.18);
    --border-brand: rgba(0,212,106,0.30);
  }

  * { box-sizing: border-box; }
  html { background: var(--bg-base); color: var(--text-primary); }
  body { font-family: var(--font-geist), sans-serif; -webkit-font-smoothing: antialiased; }

  /* Shimmer skeleton */
  .skeleton {
    background: linear-gradient(90deg, var(--bg-subtle) 25%, var(--bg-overlay) 50%, var(--bg-subtle) 75%);
    background-size: 200% 100%;
    animation: shimmer 2s linear infinite;
    border-radius: 8px;
  }

  /* Money display */
  .money {
    font-family: var(--font-geist-mono), monospace;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }

  /* Scrollbar custom */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--bg-muted); border-radius: 2px; }
  ```

- [ ] **FASE-0-007** — Inicializar NestJS

  ```bash
  cd apps/api
  npx @nestjs/cli new . --skip-git --package-manager npm --language typescript --yes
  npm install @nestjs/config @nestjs/throttler @nestjs/bull @nestjs/schedule
  npm install bullmq ioredis
  npm install prisma @prisma/client
  npm install class-validator class-transformer
  npm install bcrypt @types/bcrypt
  npm install @nestjs/swagger swagger-ui-express
  npm install axios
  npx prisma init
  ```

- [ ] **FASE-0-008** — Configurar schema Prisma
  Copiar schema completo do CLAUDE.md seção 5 para `apps/api/prisma/schema.prisma`

  ```bash
  npx prisma migrate dev --name init --skip-seed
  npx prisma generate
  ```

- [ ] **FASE-0-009** — Criar `packages/shared`
  Criar `packages/shared/package.json`:

  ```json
  { "name": "@axisfinance/shared", "version": "1.0.0", "main": "src/index.ts" }
  ```

  Criar `packages/shared/src/index.ts` com:
  - Interface `ApiResponse<T>`, `PaginatedResponse<T>`, `PaginationMeta`
  - Constante `ENVELOPE_PERCENTAGES`: `{ essential: 55, nonEssential: 10, growth: 10, investment: 25 }`
  - Constante `PLAN_LIMITS`: `{ free: { transactionsPerMonth: 50, accounts: 1, openFinance: false, aiMessages: 10 } }`
  - Helper `formatMoney(value: number): string` → `'R$ 1.234,56'`
  - Helper `formatPercent(value: number): string` → `'23,5%'`

- [ ] **FASE-0-010** — Criar arquivos `.env` de desenvolvimento
  Criar `apps/api/.env` e `apps/web/.env.local` com os valores do CLAUDE.md seção 4
  (usar "PREENCHER" como placeholder para chaves externas)

- [ ] **FASE-0-011** — Seed inicial do banco
  Criar `apps/api/prisma/seed.ts` com 20 categorias de sistema:

  ```
  Essencial: Moradia, Alimentação, Transporte, Saúde, Educação, Serviços Básicos, Seguros
  Não Essencial: Lazer, Restaurantes, Compras, Assinaturas, Beleza, Pets
  Crescimento: Cursos, Livros, Investimento em Carreira
  Investimento: Renda Fixa, Ações, Fundos, Reserva de Emergência
  Receita: Salário, Freelance, Renda Extra, Outros
  ```

  Rodar: `npx prisma db seed`

- [ ] **FASE-0-012** — Endpoint de health check
  Criar `apps/api/src/health/health.controller.ts`:

  ```typescript
  @Get('/health')
  health() { return { status: 'ok', timestamp: new Date().toISOString() } }
  ```

  Verificar: `curl http://localhost:3001/health` retorna `{ status: "ok" }`

- [ ] **FASE-0-013** — Commit da Fase 0

  ```bash
  git add -A && git commit -m "chore(fase-0): monorepo, docker, prisma schema, design system base"
  ```

  Atualizar seção "ESTADO ATUAL" no CLAUDE.md: marcar Fase 0 como `[x] CONCLUÍDO`

---

## FASE 1 — LAYOUT E DESIGN SYSTEM

**Meta:** Todas as páginas navegáveis com design premium. Sem dados reais ainda.

- [x] **FASE-1-001** — Componentes de design base
  Criar `apps/web/src/components/ui/money-display.tsx`:

  ```tsx
  // Props: value (number|Decimal), size ('sm'|'md'|'lg'|'hero'), colored (boolean)
  // Usar Geist Mono, tabular-nums, verde se positivo, text-primary se negativo
  // Size hero: text-display-hero, brand-500
  ```

  Criar `apps/web/src/components/ui/skeleton-card.tsx` — shimmer animation
  Criar `apps/web/src/components/ui/empty-state.tsx` — ícone + título + descrição + CTA
  Criar `apps/web/src/components/ui/status-badge.tsx` — badge colorido por status
  Criar `apps/web/src/components/ui/page-header.tsx` — título Bricolage + breadcrumb + ação

- [x] **FASE-1-002** — Layout da sidebar
  Criar `apps/web/src/components/layout/sidebar.tsx`:
  - Logo "Axis Finance" — Bricolage Grotesque 600, "+" em brand-500
  - Nav links com ícones Lucide: Dashboard, Transações, Contas, Orçamento, Metas, Contas a Pagar, Chat Na_th, Relatórios, Configurações
  - Item ativo: border-left 2px brand-500, bg-subtle
  - Footer: avatar + nome + badge plano + CTA upgrade (pulse animation) se free
  - Responsivo: oculta labels em < 768px, mostra só ícones

- [x] **FASE-1-003** — Layout principal autenticado
  Criar `apps/web/src/app/(app)/layout.tsx`:
  - Sidebar fixa à esquerda (240px)
  - Header fixo no topo: saudação + data + notificações + avatar
  - Main content: padding responsivo, scroll independente
  - Usar `framer-motion` `AnimatePresence` para transição entre páginas

- [x] **FASE-1-004** — Dashboard page
  Criar `apps/web/src/app/(app)/dashboard/page.tsx`:

  **Card Saldo Total** (2 colunas de largura):
  - Fundo: `bg-card-brand`, borda brand, glow verde
  - Número: Bricolage 800, 4.5rem, brand-500, animação countup
  - "Patrimônio total" em text-tertiary uppercase tracking-widest 11px
  - Variação do mês: badge "+X,X%" verde ou "-X,X%" vermelho

  **Card Situação do Mês** (1 coluna):
  - Donut chart Recharts: receitas vs despesas
  - Centro do donut: valor de saldo do mês
  - Cores: success (receitas), danger (despesas)

  **Cards Envelopes** (4 cards em row):
  - Por envelope: ícone colorido + nome + valor gasto / valor orçado
  - Progress bar estilizada: cor do envelope, arredondada, fundo bg-muted
  - % no canto direito

  **Card Próximas Contas** (1 coluna):
  - Lista de 5 bills com: nome, valor (Geist Mono), dias até vencimento
  - Urgente (< 2 dias): texto danger + background danger/10

  **Card Metas** (1 coluna):
  - 3 metas com progress bar e % concluído

  **Feed Transações** (full width):
  - 10 transações: ícone da categoria, descrição, data, valor ± colorido, badge status

  **Card Na_th** (1 coluna):
  - Avatar da Na_th (círculo brand-500 com emoji 🤖 ou SVG)
  - Insight do dia (texto estático mockado por ora)
  - Botão "Conversar com Na_th" → /chat

  Todos os cards com: `motion.div` fadeUp, stagger entre cards

- [x] **FASE-1-005** — Transactions page
  Criar `apps/web/src/app/(app)/transactions/page.tsx`:
  - Header com filtros: DateRangePicker, Select de conta, Select de categoria, Select de tipo
  - Tabela dark: header bg-muted, rows bg-elevated hover bg-overlay
  - Colunas: Data · Descrição · Categoria (ícone+nome) · Conta · Valor (Geist Mono ±cor) · Status
  - FAB "+" fixo canto inferior direito: brand-500, sombra glow verde
  - Modal `TransactionModal` com todos os campos

- [x] **FASE-1-006** — Accounts page
  Criar `apps/web/src/app/(app)/accounts/page.tsx`:
  - Agrupamento por tipo com header da seção
  - Cada conta: card com ícone da instituição (cor configurável), nome, saldo grande (Geist Mono)
  - Badge "Open Finance" vs "Manual"
  - Botões: "+ Conectar banco" (brand-500), "+ Adicionar manual" (ghost)

- [x] **FASE-1-007** — Budget page
  Criar `apps/web/src/app/(app)/budget/page.tsx`:
  - Seletor mês/ano com chevrons de navegação
  - 4 seções de envelopes com cor temática
  - Por envelope: total orçado vs gasto + barra de progresso grossa (8px)
  - Subcategorias expandíveis
  - Indicador de saúde: ✅ dentro do orçamento, ⚠️ acima de 80%, 🔴 acima de 100%

- [x] **FASE-1-008** — Goals page
  Criar `apps/web/src/app/(app)/goals/page.tsx`:
  - Grid de cards de metas
  - Cada meta: ícone emoji grande, nome, valor atual/alvo (Geist Mono), progress bar circular (SVG), deadline, % concluído
  - Botão "Nova Meta" no header

- [x] **FASE-1-009** — Bills page
  Criar `apps/web/src/app/(app)/bills/page.tsx`:
  - Layout duplo: calendário à esquerda + lista à direita
  - Calendário: dias com contas têm indicador de cor (verde=pago, vermelho=vencido, azul=pendente)
  - Lista filtrada por status com tabs (Tudo / Pendente / Vencido / Pago)
  - Cada bill: nome, valor (Geist Mono), data vencimento, status badge

- [x] **FASE-1-010** — Chat page
  Criar `apps/web/src/app/(app)/chat/page.tsx`:
  - Layout de messaging full-height
  - Header: avatar Na_th + "Na_th · Copilota Financeira" + badge online
  - Histórico: scroll com `ref` auto-scroll para fim
  - Bubble usuário: direita, bg brand-500, texto preto, Bricolage 14px
  - Bubble Na_th: esquerda, bg bg-elevated, borda border-subtle, avatar pequeno
  - Input fixo no bottom: bg-subtle, border, placeholder "Pergunte à Na_th..."
  - Welcome state: cards de sugestão "Como estou esse mês?", "Análise dos gastos", "Criar meta"

- [x] **FASE-1-011** — Reports page
  Criar `apps/web/src/app/(app)/reports/page.tsx`:
  - Tabs estilizadas: Fluxo de Caixa · Por Categoria · Patrimônio · Envelopes
  - Recharts dark theme: background transparente, grid lines bg-muted, tooltips bg-overlay
  - Bar chart (Fluxo): barras arredondadas, success=receita, danger=despesa
  - Donut chart (Categorias): cores dos envelopes, legenda lateral
  - Line chart (Patrimônio): linha brand-500, área fill brand-glow
  - Botão "Exportar PDF" e "Exportar CSV" no header

- [x] **FASE-1-012** — Auth pages
  Criar páginas em `apps/web/src/app/(auth)/`:

  **Login** (`login/page.tsx`):
  - Layout dois painéis: esquerda (form) / direita (visual/brand)
  - Painel direito: gradiente dark + logo gigante + tagline "Organize. Economize. Invista."
  - Form: inputs com ícones Lucide, botão "Entrar com Google" (border ghost)
  - Link "Criar conta" e "Esqueci a senha"

  **Register** (`register/page.tsx`):
  - Similar ao login com campos: nome completo, email, telefone (WhatsApp), senha
  - Password strength indicator (barras coloridas)
  - Checkbox de aceite dos termos

  **Forgot/Reset**: formulários simples e limpos

- [x] **FASE-1-013** — Onboarding wizard
  Criar `apps/web/src/app/(auth)/onboarding/layout.tsx`:
  - Progress bar no topo: 5 etapas, brand-500 como fill
  - Logo centralizado
  - Container max-w-lg centralizado

  Criar steps:
  - `step-1/`: saudação + resumo do que vem a seguir (visual motivador)
  - `step-2/`: OTP input — 6 caixas individuais, auto-focus next
  - `step-3/`: slider de renda + cards de situação financeira + cards de objetivo
  - `step-4/`: escolha "Adicionar manual" vs "Conectar banco" (placeholder Pluggy)
  - `step-5/`: tour dos envelopes com porcentagens + donut animado + botão "Começar"

- [x] **FASE-1-014** — Loading e empty states globais
  Criar variantes de skeleton para: card de saldo, lista de transações, card de conta
  Criar empty states para: sem transações, sem contas, sem metas, sem contas a pagar
  Todos com ilustração SVG inline estilizada com brand colors

- [x] **FASE-1-015** — Commit da Fase 1

  ```bash
  git add -A && git commit -m "feat(fase-1): design system premium, layout completo, todas as páginas"
  ```

  Atualizar CLAUDE.md: marcar Fase 1 como concluída.

---

## FASE 2 — AUTENTICAÇÃO E ONBOARDING

**Meta:** Fluxo completo de registro → OTP → onboarding → dashboard.

- [x] **FASE-2-001** — Módulo Auth no NestJS
  Criar `apps/api/src/auth/` com: módulo, service, controller, JWT strategy, guard, decorator `@GetUser()`
  Rate limiting: 5 tentativas/15min em `/auth/login` via `@nestjs/throttler`

- [x] **FASE-2-002** — Endpoints de auth

  ```
  POST /auth/register   → cria user + subscription(free,trialing) + preferences
  POST /auth/login      → valida credenciais → tokens em HttpOnly cookies
  POST /auth/refresh    → renova access token
  POST /auth/logout     → limpa cookies
  POST /auth/forgot-password
  POST /auth/reset-password
  ```

- [x] **FASE-2-003** — Supabase Auth no Next.js
  Instalar e configurar `@supabase/ssr`
  Criar `apps/web/src/lib/supabase/client.ts` e `server.ts`
  Criar `apps/web/src/middleware.ts`: proteger `(app)/*`, redirecionar por `onboarding_completed`

- [x] **FASE-2-004** — Form de Register funcional
  Conectar à `POST /api/auth/register` (via API Route Next.js como BFF)
  Validação zod: email válido, senha 8+ chars 1 maiúscula 1 número, nome obrigatório
  Feedback: toast de sucesso, erros inline por campo

- [x] **FASE-2-005** — Form de Login funcional
  Conectar à API, armazenar tokens em cookies, redirect para dashboard ou onboarding
  OAuth Google: configurar via Supabase
  "Esqueci a senha": fluxo completo

- [x] **FASE-2-006** — Onboarding steps funcionais
  Cada step: `PATCH /api/onboarding/progress { step: N, data: {...} }`
  Estado do step salvo no banco — se fechar e reabrir, continua de onde parou
  Step final: `PATCH /api/onboarding/complete` → ativa trial 14 dias

- [x] **FASE-2-007** — Middleware de proteção de rotas
  Verificar JWT em todo request de `(app)/*`
  Verificar `onboarding_completed` → redirect se false
  Verificar plano para rotas premium → redirect com parâmetro `upgrade=true`

- [x] **FASE-2-008** — Commit da Fase 2

  ```bash
  git add -A && git commit -m "feat(fase-2): auth completo supabase, onboarding 5 etapas"
  ```

---

## FASE 3 — CRUD CORE

**Meta:** Todos os módulos financeiros funcionais com dados reais no banco.

- [x] **FASE-3-001** — Módulo Accounts (NestJS + Frontend)
  Service: CRUD com `userId` obrigatório em toda query
  Cálculo de fatura de cartão: despesas entre `closingDay` e `dueDay`
  Frontend: conectar página `/accounts`, formulário validado, confirmação de exclusão

- [x] **FASE-3-002** — Módulo Categories (NestJS + Frontend)
  Listar categorias do sistema + personalizadas do usuário
  CRUD de categorias personalizadas
  Configurações de categorias na página `/settings`

- [x] **FASE-3-003** — Módulo Transactions (NestJS)
  Listagem com filtros: `startDate`, `endDate`, `accountId`, `categoryId`, `type`, `status`, `search`
  Paginação: `page` + `limit` com `meta: { total, page, perPage, totalPages }`
  Lógica de recorrência: criar instâncias futuras para 12 meses
  Lógica de parcelamento: criar N instâncias com `installmentNumber`
  Atualizar `account.balance` em toda criação/edição/deleção
  Soft delete + registro em `audit_logs`

- [x] **FASE-3-004** — Módulo Transactions (Frontend)
  Tabela com infinite scroll ou paginação
  Filtros funcionais com debounce
  Modal criar/editar com todos os campos
  Campos condicionais: conta destino (se transferência), frequência (se recorrente), parcelas (se parcelado)

- [x] **FASE-3-005** — Módulo Bills (NestJS + Frontend)
  Cron job diário: atualizar `status = overdue` se vencida e não paga
  `POST /bills/:id/pay`: atualiza status, cria transaction, registra `paid_at`
  Frontend: calendário funcional, lista por status, formulário de criação

- [x] **FASE-3-006** — Módulo Goals (NestJS + Frontend)
  `POST /goals/:id/contribute`: adiciona aporte, atualiza `currentAmount`
  Cálculo automático de `monthlyContribution` sugerida
  Frontend: grid de cards com progress circular SVG, modal de detalhe com histórico

- [x] **FASE-3-007** — Módulo Budgets (NestJS + Frontend)
  `GET /budgets?month&year` com `spentAmount` calculado das transações
  Recalcular `spentAmount` ao criar/editar/deletar transação (via event ou trigger)
  `GET /budgets/summary`: totais por envelope com % usada
  Frontend: seletor de mês, envelopes coloridos, alertas de 90%+

- [x] **FASE-3-008** — Dashboard com dados reais
  Conectar todas as APIs ao dashboard
  Saldo consolidado = soma de todas as contas ativas
  Receitas/despesas do mês via filtro de transações
  Loading skeletons enquanto carrega (shimmer animation)
  SWR ou React Query para cache e revalidação

- [x] **FASE-3-009** — Commit da Fase 3

  ```bash
  git add -A && git commit -m "feat(fase-3): todos os módulos CRUD funcionais com dados reais"
  ```

---

## FASE 4 — OPEN FINANCE (PLUGGY)

**Meta:** Conectar conta bancária e ver transações sincronizadas automaticamente.

- [x] **FASE-4-001** — Módulo Pluggy (NestJS)
  Wrapper `PluggyService` para Pluggy API
  `POST /pluggy/connect-token`: connect token válido 30min
  `GET /pluggy/items`, `DELETE /pluggy/items/:id`, `POST /pluggy/items/:id/sync`

- [x] **FASE-4-002** — Webhook receiver Pluggy
  `POST /webhooks/pluggy`: validar signature, enfileirar job por evento
  Eventos: `item/updated` → sync · `item/error` → atualizar status + notificar

- [x] **FASE-4-003** — Sync Worker (BullMQ)
  Fila `sync:pluggy`: buscar transações desde `lastSyncedAt`, normalizar, deduplicar
  `INSERT ON CONFLICT (pluggy_transaction_id) DO NOTHING`
  Atualizar saldos e `lastSyncedAt`
  Cron: a cada 6h enfileirar sync de todos os itens ativos

- [x] **FASE-4-004** — Categorização automática por IA
  Batch de até 50 transações → Claude API → array de `{ id, categoryId }`
  Cache Redis: hash(descrição) → categoryId, TTL 30 dias
  Fallback heurístico: keyword matching se Claude offline

- [x] **FASE-4-005** — Pluggy Widget (Frontend)
  Componente `PluggyConnectWidget`: carrega SDK, busca connect token, abre modal
  Sucesso: toast + reload de contas
  Status de sincronização: spinner, "Atualizado há X min", banner de reconexão se erro

- [x] **FASE-4-006** — Commit da Fase 4

  ```bash
  git add -A && git commit -m "feat(fase-4): pluggy open finance, sync worker, categorização IA"
  ```

---

## FASE 5 — NOTIFICAÇÕES E WHATSAPP

**Meta:** Lembrete de bill via WhatsApp → usuário responde SIM → bill marcada como paga.

- [x] **FASE-5-001** — Serviço de notificações multi-canal
  `NotificationsService.send()`: cria registro na tabela, enfileira job `notifications:dispatch`
  Notification Worker: router por channel com retry 3x + fallback email

- [x] **FASE-5-002** — Gateway WhatsApp abstrato
  Interface `WhatsAppGateway` com `sendMessage()` e `sendTemplate()`
  Implementação `ZApiGateway`: POST para Z-API com rate limit (1 msg/usuário/tipo/dia via Redis)
  Formatar número para E.164 (+55...)

- [x] **FASE-5-003** — Webhook WhatsApp inbound
  `POST /webhooks/whatsapp`: validar token, parsear sender + body
  "SIM" (case-insensitive) → `BillsService.confirmPaymentByWhatsApp(userId)`
  "NÃO"/"NAO" → responder com opção de reagendamento
  Número desconhecido → log + ignorar

- [x] **FASE-5-004** — Cron de lembretes de bills
  Cron `0 8 * * *` (08:00 BRT): bills com `dueDate = hoje + N dias` e `notificationSentAt IS NULL`
  Template: "Oi [Nome]! 📅 *[Nome da conta]* vence em [X] dias — R$ [valor]. Responda *SIM* para confirmar."
  Atualizar `notificationSentAt` após envio

- [x] **FASE-5-005** — Preferências de notificação (Frontend)
  Seção em `/settings`: toggle WhatsApp, slider "avisar X dias antes", número do WhatsApp, botão teste

- [x] **FASE-5-006** — Commit da Fase 5

  ```bash
  git add -A && git commit -m "feat(fase-5): notificações, whatsapp lembretes e confirmação"
  ```

---

## FASE 6 — IA COPILOTA NA_TH

**Meta:** Chat funcional com Na_th que lê dados reais e executa ações confirmadas.

- [x] **FASE-6-001** — Módulo AI (NestJS)
  `AiService`: gerencia sessões, monta system prompt, orquestra tool calling
  `POST /ai/chat { message, sessionId }` → `{ reply, sessionId, pendingAction? }`
  `GET /ai/conversations`, `GET /ai/insight-daily` (cache Redis 24h)

- [x] **FASE-6-002** — Context builder
  Snapshot financeiro: saldo total, mês atual (receitas/despesas), top 5 categorias, bills pendentes, metas ativas
  Injetado no system prompt a cada sessão. Cache 5min por userId.

- [x] **FASE-6-003** — Tool definitions e executores
  Implementar tools: `get_financial_summary`, `get_transactions`, `create_transaction`,
  `create_goal`, `update_bill_status`, `get_budget_status`
  Tools de escrita: retornam `{ pendingAction }` para confirmação no frontend

- [x] **FASE-6-004** — Orquestração de tool calling
  Processar `stop_reason: "tool_use"`, executar tool, retornar resultado à Claude API
  `POST /ai/chat/confirm-action { actionId }`: executa ação confirmada pelo usuário

- [x] **FASE-6-005** — Interface de chat (Frontend)
  Conectar página `/chat` à API
  Bubbles com animação de entrada, auto-scroll, loading dots animados
  Modal de confirmação para ações pendentes
  Sugestões de perguntas rápidas como chips clicáveis

- [x] **FASE-6-006** — Insight diário no dashboard
  `InsightWorker`: job diário que gera 1 insight por usuário ativo, salva no Redis
  Conectar card Na_th no dashboard ao `GET /ai/insight-daily`

- [ ] **FASE-6-007** — Limite de mensagens por plano
  Free: 10 msg/mês (contador Redis). Premium: ilimitado.
  Frontend: após limite → overlay de upgrade no chat

- [ ] **FASE-6-008** — Commit da Fase 6

  ```bash
  git add -A && git commit -m "feat(fase-6): copilota Na_th tool calling, chat, insights"
  ```

---

## FASE 7 — BILLING E ASSINATURAS

**Meta:** Pagamento premium funcional end-to-end com Stripe.

- [x] **FASE-7-001** — Módulo Subscriptions (NestJS)
  `POST /subscriptions/checkout`: cria Stripe Checkout Session
  `POST /subscriptions/portal`: cria Billing Portal session
  `DELETE /subscriptions/me`: cancela assinatura

- [x] **FASE-7-002** — Webhook Stripe
  Validar `stripe-signature`, processar com idempotency key (Redis)
  Eventos: `subscription.created/updated/deleted`, `invoice.payment_failed`, `trial_will_end`

- [x] **FASE-7-003** — Guard de features premium
  `@RequiresPremium()` decorator + guard
  Aplicar em: `/ai/chat`, `/pluggy/*`, `/reports/export`, transações além de 50/mês

- [x] **FASE-7-004** — Página de planos (Frontend)
  Cards: Free · Premium Mensal · Premium Anual
  Highlight do plano anual: "Economize 2 meses" badge em accent-500
  CTA "Assinar" → Stripe Checkout, "Gerenciar" → Stripe Portal

- [x] **FASE-7-005** — Bloqueios de features (Frontend)
  `<PremiumGate>` component: blur + overlay + CTA de upgrade
  Aplicar em: chat (após 10 msgs), Open Finance, exportação, relatórios longos

- [x] **FASE-7-006** — Emails transacionais
  Configurar Resend: boas-vindas, assinatura ativa, trial expirando, falha de pagamento

- [x] **FASE-7-007** — Commit da Fase 7

  ```bash
  git add -A && git commit -m "feat(fase-7): billing stripe, planos premium, emails"
  ```

---

## FASE 8 — RELATÓRIOS E EXPORTAÇÃO

**Meta:** 6 relatórios visuais com dados reais e exportação PDF/CSV.

- [ ] **FASE-8-001** — Engine de relatórios (NestJS)
  `ReportsService`: `getCashFlow()`, `getExpensesByCategory()`, `getNetWorthHistory()`, `getBudgetHistory()`
  Queries otimizadas com índices, máximo 12 meses

- [ ] **FASE-8-002** — Gráficos (Frontend)
  Recharts com tema dark (fundo transparente, grid bg-muted, tooltips bg-overlay)
  Bar chart (Fluxo de Caixa), Donut (Categorias), Line + Area (Patrimônio), Bar agrupado (Envelopes)
  Filtros de período e conta em todos os relatórios

- [ ] **FASE-8-003** — Exportação PDF (Worker)
  Worker `reports:generate-pdf` com Puppeteer
  Template HTML com logo, dados do usuário, gráficos SVG
  Salvar no R2, notificar com link de download (válido 24h)

- [ ] **FASE-8-004** — Exportação CSV
  Stream direto: `GET /reports/export/csv?type=transactions&startDate&endDate`
  Colunas: data, descrição, categoria, conta, tipo, valor, status

- [ ] **FASE-8-005** — Commit da Fase 8

  ```bash
  git add -A && git commit -m "feat(fase-8): relatórios completos, PDF, CSV"
  ```

---

## FASE 9 — QA, SEGURANÇA E DEPLOY

**Meta:** App production-ready, testado, monitorado, deployado.

- [ ] **FASE-9-001** — Testes de isolamento de dados (SENNA manda)
  Criar usuários A e B
  Tentar acessar recursos do usuário A com token do usuário B → deve retornar 403/404
  Verificar em: transactions, accounts, bills, goals, budgets, ai conversations

- [ ] **FASE-9-002** — Testes E2E com Playwright
  `auth.spec.ts`: registro → OTP → onboarding completo → login
  `transaction.spec.ts`: criar → editar → excluir
  `bill.spec.ts`: criar → simular SIM no webhook → verificar status pago
  `subscription.spec.ts`: upgrade → verificar features liberadas

- [ ] **FASE-9-003** — Testes unitários NestJS
  `transactions.service.spec.ts`: recorrência, parcelamento, atualização de saldo
  `bills.service.spec.ts`: cron de overdue, confirmação WhatsApp
  `ai.service.spec.ts`: montagem do system prompt, tool calling

- [ ] **FASE-9-004** — Checklist de segurança OWASP
  - [ ] CPF não aparece em nenhum log (grep nos logs de teste)
  - [ ] JWT expirado retorna 401
  - [ ] Rate limiting ativo no `/auth/login`
  - [ ] Headers de segurança: CORS, HSTS, CSP, X-Frame-Options
  - [ ] Validação de tamanho de payload (1MB max)
  - [ ] Inputs sanitizados em todos os DTOs

- [ ] **FASE-9-005** — Performance e PWA
  Lighthouse score > 85 no `/dashboard`
  `loading.tsx` em todas as rotas do App Router
  Lazy loading: Recharts, chat
  `public/manifest.json` com ícones 192/512
  Service worker via `next-pwa`

- [ ] **FASE-9-006** — Observabilidade
  Sentry: `npm install @sentry/nextjs`; configurar `sentry.client.config.ts` e `sentry.server.config.ts`
  PostHog: script no layout
  Endpoint `/health` retorna status de DB e Redis

- [ ] **FASE-9-007** — LGPD
  `GET /users/me/export`: ZIP assíncrono com todos os dados
  `DELETE /users/me`: soft delete + job de exclusão definitiva em 30 dias
  Página `/settings/privacy` com os botões

- [ ] **FASE-9-008** — Documentação OpenAPI
  `@nestjs/swagger` em `main.ts`
  Todos os DTOs e controllers documentados
  Swagger em `/api/docs` apenas em `NODE_ENV !== 'production'`

- [ ] **FASE-9-009** — Deploy Railway
  Criar `railway.toml` ou configurar via CLI
  Serviços: `api`, `web`, `worker`
  PostgreSQL e Redis gerenciados pelo Railway
  Configurar todas as variáveis de ambiente de produção
  GitHub Actions: deploy automático em push para `main`

- [ ] **FASE-9-010** — Checklist final de aceite
  - [ ] Registro completo em < 3 minutos
  - [ ] Dashboard carrega em < 2 segundos
  - [ ] Transação manual criada em < 30 segundos
  - [ ] WhatsApp SIM → bill paga em < 10 segundos
  - [ ] Pagamento Stripe end-to-end funcional
  - [ ] Usuário A não acessa dados do B (isolamento verificado)
  - [ ] CPF não aparece em logs
  - [ ] Categorização automática > 80% de acerto
  - [ ] Design: Bricolage Grotesque + Geist + Geist Mono aplicados corretamente
  - [ ] Dark mode funcional em todas as páginas

- [ ] **FASE-9-011** — Commit e tag final

  ```bash
  git add -A
  git commit -m "feat(fase-9): QA completo, segurança, deploy, MVP production-ready"
  git tag v1.0.0-mvp
  git push origin main --tags
  ```

  Atualizar CLAUDE.md: marcar todas as fases como `[x] CONCLUÍDO`

---

## APÊNDICE — TROUBLESHOOTING AUTÔNOMO

**Se um comando falhar**, tente esta sequência antes de registrar como erro:

```bash
# Docker não sobe
docker-compose down -v && docker-compose up -d

# Prisma falha
npx prisma migrate reset --force && npx prisma migrate dev --name recovery

# TypeScript com erro de tipo
npx tsc --noEmit 2>&1 | head -30   # ver erros específicos

# Build Next.js falha
rm -rf .next && npm run build

# Redis não conecta
docker exec -it $(docker ps -qf "name=redis") redis-cli ping
```

**Comandos úteis no loop de desenvolvimento:**

```bash
# Rodar tudo local
docker-compose up -d && cd apps/api && npm run start:dev &  cd apps/web && npm run dev

# Reset completo de dev
docker-compose down -v && docker-compose up -d && cd apps/api && npx prisma migrate reset --force --skip-seed && npx prisma migrate dev && npx prisma db seed
```
