// ─── TYPES ──────────────────────────────────────────────

export type Money = number & { readonly __brand: 'Money' };

export function asMoney(value: number): Money {
  return value as Money;
}

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

// ─── ENUMS ──────────────────────────────────────────────

export enum EnvelopeType {
  ESSENTIAL = 'essential',
  NON_ESSENTIAL = 'non_essential',
  GROWTH = 'growth',
  INVESTMENT = 'investment',
}

export enum PlanType {
  FREE = 'free',
  PREMIUM_MONTHLY = 'premium_monthly',
  PREMIUM_ANNUAL = 'premium_annual',
}

// ─── CONSTANTS ──────────────────────────────────────────

export const ENVELOPE_PERCENTAGES: Record<EnvelopeType, number> = {
  [EnvelopeType.ESSENTIAL]: 0.5,
  [EnvelopeType.NON_ESSENTIAL]: 0.3,
  [EnvelopeType.GROWTH]: 0.15,
  [EnvelopeType.INVESTMENT]: 0.05,
};

export const PLAN_LIMITS = {
  [PlanType.FREE]: {
    accountsLimit: 3,
    categoriesLimit: 10,
    goalsLimit: 3,
    aiMessagesPerMonth: 50,
    openFinanceSync: false,
    whatsappIntegration: false,
  },
  [PlanType.PREMIUM_MONTHLY]: {
    accountsLimit: 20,
    categoriesLimit: 100,
    goalsLimit: 50,
    aiMessagesPerMonth: 1000,
    openFinanceSync: true,
    whatsappIntegration: true,
  },
  [PlanType.PREMIUM_ANNUAL]: {
    accountsLimit: 20,
    categoriesLimit: 100,
    goalsLimit: 50,
    aiMessagesPerMonth: 1000,
    openFinanceSync: true,
    whatsappIntegration: true,
  },
};

export const CATEGORY_ICONS = {
  // Essencial
  'Alimentação': '🍔',
  'Transporte': '🚗',
  'Moradia': '🏠',
  'Saúde': '🏥',
  'Educação': '📚',
  'Utilidades': '💡',

  // Não essencial
  'Diversão': '🎬',
  'Restaurante': '🍽️',
  'Compras': '🛍️',
  'Viagem': '✈️',
  'Subscriptions': '📱',
  'Cuidados pessoais': '💅',

  // Crescimento
  'Poupança': '💰',
  'Investimentos': '📈',
  'Seguro': '🛡️',

  // Renda
  'Salário': '💵',
  'Freelance': '💼',
  'Bônus': '🎁',
  'Investimento': '💹',
  'Outro': '❓',
};

export const TRANSACTION_TYPES = {
  income: 'Renda',
  expense: 'Despesa',
  transfer: 'Transferência',
  credit_card_bill: 'Fatura CC',
};

export const BILL_STATUS_LABELS = {
  pending: 'Pendente',
  paid: 'Paga',
  overdue: 'Vencida',
  scheduled: 'Agendada',
};

export const GOAL_STATUS_LABELS = {
  active: 'Ativo',
  completed: 'Concluído',
  paused: 'Pausado',
  canceled: 'Cancelado',
};

export const GOAL_TYPES = {
  emergency_fund: 'Fundo de Emergência',
  travel: 'Viagem',
  purchase: 'Compra',
  investment: 'Investimento',
  debt_payment: 'Quitação de Dívida',
  custom: 'Personalizado',
};

// ─── DEFAULTS ───────────────────────────────────────────

export const DEFAULT_CATEGORIES = [
  // Sistema - Essencial
  { name: 'Alimentação', type: 'expense', envelope: 'essential', icon: '🍔', isSystem: true },
  { name: 'Transporte', type: 'expense', envelope: 'essential', icon: '🚗', isSystem: true },
  { name: 'Moradia', type: 'expense', envelope: 'essential', icon: '🏠', isSystem: true },
  { name: 'Saúde', type: 'expense', envelope: 'essential', icon: '🏥', isSystem: true },
  { name: 'Educação', type: 'expense', envelope: 'essential', icon: '📚', isSystem: true },
  { name: 'Utilidades', type: 'expense', envelope: 'essential', icon: '💡', isSystem: true },

  // Sistema - Não Essencial
  { name: 'Diversão', type: 'expense', envelope: 'non_essential', icon: '🎬', isSystem: true },
  { name: 'Restaurante', type: 'expense', envelope: 'non_essential', icon: '🍽️', isSystem: true },
  { name: 'Compras', type: 'expense', envelope: 'non_essential', icon: '🛍️', isSystem: true },
  { name: 'Viagem', type: 'expense', envelope: 'non_essential', icon: '✈️', isSystem: true },
  { name: 'Subscriptions', type: 'expense', envelope: 'non_essential', icon: '📱', isSystem: true },
  { name: 'Cuidados pessoais', type: 'expense', envelope: 'non_essential', icon: '💅', isSystem: true },

  // Sistema - Crescimento
  { name: 'Poupança', type: 'expense', envelope: 'growth', icon: '💰', isSystem: true },
  { name: 'Investimentos', type: 'expense', envelope: 'investment', icon: '📈', isSystem: true },
  { name: 'Seguro', type: 'expense', envelope: 'growth', icon: '🛡️', isSystem: true },

  // Sistema - Renda
  { name: 'Salário', type: 'income', icon: '💵', isSystem: true },
  { name: 'Freelance', type: 'income', icon: '💼', isSystem: true },
  { name: 'Bônus', type: 'income', icon: '🎁', isSystem: true },
  { name: 'Investimento', type: 'income', icon: '💹', isSystem: true },
  { name: 'Outro', type: 'income', icon: '❓', isSystem: true },
];
