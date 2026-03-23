import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

export interface CashFlowData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

export interface ExpenseByCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface NetWorthHistory {
  date: string;
  netWorth: number;
}

export interface BudgetHistory {
  category: string;
  budgeted: number;
  spent: number;
  percentage: number;
}

@Injectable()
export class ReportsService {
  private logger = new Logger(ReportsService.name);

  constructor(private prisma: PrismaService) {}

  async getCashFlow(userId: string, months: number = 12): Promise<CashFlowData[]> {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      startDate.setDate(1);

      const transactions = await this.prisma.transaction.findMany({
        where: {
          userId,
          date: { gte: startDate },
        },
        select: {
          date: true,
          amount: true,
          type: true,
        },
      });

      const monthlyData: Record<string, { income: Decimal; expenses: Decimal }> = {};

      transactions.forEach((tx) => {
        const monthKey = new Date(tx.date).toISOString().substring(0, 7);

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            income: new Decimal(0),
            expenses: new Decimal(0),
          };
        }

        if (tx.type === 'income') {
          monthlyData[monthKey].income = monthlyData[monthKey].income.plus(tx.amount);
        } else if (tx.type === 'expense') {
          monthlyData[monthKey].expenses = monthlyData[monthKey].expenses.plus(tx.amount);
        }
      });

      return Object.entries(monthlyData)
        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
        .map(([month, { income, expenses }]) => ({
          month,
          income: Number(income),
          expenses: Number(expenses),
          net: Number(income.minus(expenses)),
        }));
    } catch (error) {
      this.logger.error(`Failed to get cash flow: ${(error as Error).message}`);
      return [];
    }
  }

  async getExpensesByCategory(userId: string, months: number = 12): Promise<ExpenseByCategory[]> {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      startDate.setDate(1);

      const transactions = await this.prisma.transaction.findMany({
        where: {
          userId,
          type: 'expense',
          date: { gte: startDate },
        },
        select: {
          amount: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      });

      const categoryData: Record<string, Decimal> = {};

      transactions.forEach((tx) => {
        const categoryName = tx.category?.name || 'Sem categoria';
        if (!categoryData[categoryName]) {
          categoryData[categoryName] = new Decimal(0);
        }
        categoryData[categoryName] = categoryData[categoryName].plus(tx.amount);
      });

      const total = Object.values(categoryData).reduce((sum, val) => sum.plus(val), new Decimal(0));

      return Object.entries(categoryData)
        .sort(([, amountA], [, amountB]) => Number(amountB) - Number(amountA))
        .map(([category, amount]) => ({
          category,
          amount: Number(amount),
          percentage: total.isZero() ? 0 : Number(amount.dividedBy(total).times(100)),
        }));
    } catch (error) {
      this.logger.error(`Failed to get expenses by category: ${(error as Error).message}`);
      return [];
    }
  }

  async getNetWorthHistory(userId: string, months: number = 12): Promise<NetWorthHistory[]> {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      startDate.setDate(1);

      const accounts = await this.prisma.account.findMany({
        where: { userId },
        select: { id: true, balance: true },
      });

      const dates: Set<string> = new Set();
      const netWorthByDate: Record<string, Decimal> = {};

      const transactions = await this.prisma.transaction.findMany({
        where: {
          userId,
          date: { gte: startDate },
        },
        select: { date: true, amount: true, type: true },
        orderBy: { date: 'asc' },
      });

      // Calculate balances over time
      const balanceByDateAndAccount: Record<string, Record<string, Decimal>> = {};

      transactions.forEach((tx) => {
        const dateStr = tx.date.toISOString().substring(0, 10);
        if (!balanceByDateAndAccount[dateStr]) {
          balanceByDateAndAccount[dateStr] = {};
        }
      });

      // Start with current balances
      const accountBalances: Record<string, Decimal> = {};
      accounts.forEach((acc) => {
        accountBalances[acc.id] = new Decimal(acc.balance);
      });

      // Work backwards to calculate historical balances
      const sortedDates = Object.keys(balanceByDateAndAccount).sort().reverse();
      sortedDates.forEach((dateStr) => {
        const dayTransactions = transactions.filter((tx) => tx.date.toISOString().substring(0, 10) === dateStr);
        let dayNetWorth = new Decimal(0);

        dayTransactions.forEach((tx) => {
          // Simplified: assume equal distribution across accounts
          dayNetWorth = dayNetWorth.plus(tx.amount);
        });

        netWorthByDate[dateStr] = dayNetWorth;
      });

      // Create result with current balance + historical
      const result: NetWorthHistory[] = [];
      const currentNetWorth = accounts.reduce((sum, acc) => sum.plus(acc.balance), new Decimal(0));

      result.push({
        date: new Date().toISOString().substring(0, 10),
        netWorth: Number(currentNetWorth),
      });

      Object.entries(netWorthByDate)
        .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
        .slice(0, months * 30)
        .forEach(([date, nw]) => {
          result.push({
            date,
            netWorth: Number(nw),
          });
        });

      return result.sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      this.logger.error(`Failed to get net worth history: ${(error as Error).message}`);
      return [];
    }
  }

  async getBudgetHistory(userId: string, months: number = 12): Promise<BudgetHistory[]> {
    try {
      const budgets = await this.prisma.budget.findMany({
        where: { userId },
        select: {
          category: {
            select: { name: true },
          },
          budgetedAmount: true,
          spentAmount: true,
        },
        orderBy: { budgetedAmount: 'desc' },
      });

      return budgets.map((budget) => ({
        category: budget.category.name,
        budgeted: Number(budget.budgetedAmount),
        spent: Number(budget.spentAmount),
        percentage: Number(budget.budgetedAmount) > 0 ? (Number(budget.spentAmount) / Number(budget.budgetedAmount)) * 100 : 0,
      }));
    } catch (error) {
      this.logger.error(`Failed to get budget history: ${(error as Error).message}`);
      return [];
    }
  }

  async generateCsvExport(userId: string, type: 'transactions' | 'accounts' | 'bills', filters?: any): Promise<string> {
    try {
      if (type === 'transactions') {
        const transactions = await this.prisma.transaction.findMany({
          where: { userId },
          include: { category: true, account: true },
          orderBy: { date: 'desc' },
          take: 10000,
        });

        const rows = [['Data', 'Descrição', 'Categoria', 'Conta', 'Tipo', 'Valor', 'Status']];
        transactions.forEach((tx) => {
          rows.push([
            tx.date.toISOString().substring(0, 10),
            tx.description,
            tx.category?.name || 'Sem categoria',
            tx.account.name,
            tx.type,
            String(tx.amount),
            tx.status,
          ]);
        });

        return rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
      }

      if (type === 'accounts') {
        const accounts = await this.prisma.account.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        });

        const rows = [['Nome', 'Tipo', 'Saldo', 'Instituição', 'Moeda']];
        accounts.forEach((acc) => {
          rows.push([acc.name, acc.type, String(acc.balance), acc.institution || 'Manual', acc.currency]);
        });

        return rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
      }

      if (type === 'bills') {
        const bills = await this.prisma.bill.findMany({
          where: { userId },
          include: { category: true },
          orderBy: { dueDate: 'desc' },
        });

        const rows = [['Nome', 'Valor', 'Data de Vencimento', 'Status', 'Categoria']];
        bills.forEach((bill) => {
          rows.push([
            bill.name,
            String(bill.amount),
            bill.dueDate.toISOString().substring(0, 10),
            bill.status,
            bill.category?.name || 'Sem categoria',
          ]);
        });

        return rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
      }

      return '';
    } catch (error) {
      this.logger.error(`Failed to generate CSV: ${(error as Error).message}`);
      throw error;
    }
  }
}
