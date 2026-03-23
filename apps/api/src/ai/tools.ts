import { PrismaService } from '@/prisma/prisma.service';

export interface ToolDefinition {
  name: string;
  description: string;
  input_schema: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
}

export const AVAILABLE_TOOLS: ToolDefinition[] = [
  {
    name: 'get_financial_summary',
    description: 'Get user financial summary including balance, income and expenses',
    input_schema: {
      type: 'object',
      properties: {
        period: {
          type: 'string',
          enum: ['this_month', 'last_month', 'this_year'],
        },
      },
      required: ['period'],
    },
  },
  {
    name: 'get_transactions',
    description: 'Get recent transactions with optional filtering',
    input_schema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of transactions to return',
        },
        type: {
          type: 'string',
          enum: ['income', 'expense', 'transfer'],
        },
      },
      required: ['limit'],
    },
  },
  {
    name: 'get_upcoming_bills',
    description: 'Get upcoming bills for the next 30 days',
    input_schema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_goals_status',
    description: 'Get current goals and their progress',
    input_schema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'create_transaction',
    description: 'Create a new transaction',
    input_schema: {
      type: 'object',
      properties: {
        accountId: { type: 'string' },
        amount: { type: 'number' },
        description: { type: 'string' },
        type: { type: 'string', enum: ['income', 'expense', 'transfer'] },
        date: { type: 'string' },
      },
      required: ['accountId', 'amount', 'description', 'type'],
    },
  },
  {
    name: 'pay_bill',
    description: 'Mark a bill as paid',
    input_schema: {
      type: 'object',
      properties: {
        billId: { type: 'string' },
      },
      required: ['billId'],
    },
  },
];

export async function executeTool(
  toolName: string,
  toolInput: Record<string, any>,
  userId: string,
  prisma: PrismaService,
): Promise<any> {
  switch (toolName) {
    case 'get_financial_summary':
      return getFinancialSummary(userId, toolInput.period, prisma);
    case 'get_transactions':
      return getTransactions(userId, toolInput.limit, toolInput.type, prisma);
    case 'get_upcoming_bills':
      return getUpcomingBills(userId, prisma);
    case 'get_goals_status':
      return getGoalsStatus(userId, prisma);
    case 'create_transaction':
      return createTransaction(userId, toolInput, prisma);
    case 'pay_bill':
      return payBill(userId, toolInput.billId, prisma);
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}

async function getFinancialSummary(
  userId: string,
  period: string,
  prisma: PrismaService,
): Promise<any> {
  const now = new Date();
  let startDate: Date;

  if (period === 'this_month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (period === 'last_month') {
    startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  } else {
    startDate = new Date(now.getFullYear(), 0, 1);
  }

  const accounts = await prisma.account.findMany({
    where: { userId, isActive: true },
  });

  const balance = accounts.reduce((sum, acc) => sum + acc.balance.toNumber(), 0);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: startDate },
    },
  });

  const income = transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount.toNumber(), 0);

  const expense = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount.toNumber(), 0);

  return {
    totalBalance: balance,
    income,
    expenses: expense,
    net: income - expense,
    period,
  };
}

async function getTransactions(
  userId: string,
  limit: number,
  type: string | undefined,
  prisma: PrismaService,
): Promise<any> {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      ...(type && { type: type as any }),
    },
    orderBy: { date: 'desc' },
    take: limit,
  });

  return transactions;
}

async function getUpcomingBills(userId: string, prisma: PrismaService): Promise<any> {
  const now = new Date();
  const thirtyDaysAhead = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const bills = await prisma.bill.findMany({
    where: {
      userId,
      status: 'pending',
      dueDate: {
        gte: now,
        lte: thirtyDaysAhead,
      },
    },
    orderBy: { dueDate: 'asc' },
  });

  return bills;
}

async function getGoalsStatus(userId: string, prisma: PrismaService): Promise<any> {
  const goals = await prisma.goal.findMany({
    where: {
      userId,
      status: 'active',
    },
  });

  return goals.map((goal) => ({
    name: goal.name,
    current: goal.currentAmount.toNumber(),
    target: goal.targetAmount.toNumber(),
    percentage: Math.round((goal.currentAmount.toNumber() / goal.targetAmount.toNumber()) * 100),
  }));
}

async function createTransaction(
  userId: string,
  input: Record<string, any>,
  prisma: PrismaService,
): Promise<any> {
  return prisma.transaction.create({
    data: {
      userId,
      accountId: input.accountId,
      amount: input.amount,
      description: input.description,
      type: input.type,
      date: new Date(input.date),
      status: 'paid',
    },
  });
}

async function payBill(
  userId: string,
  billId: string,
  prisma: PrismaService,
): Promise<any> {
  const bill = await prisma.bill.findFirst({
    where: { id: billId, userId },
  });

  if (!bill) {
    throw new Error('Bill not found');
  }

  return prisma.bill.update({
    where: { id: billId },
    data: {
      status: 'paid',
      paidAt: new Date(),
    },
  });
}
