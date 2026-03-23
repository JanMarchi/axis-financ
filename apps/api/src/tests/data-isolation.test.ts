import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('Data Isolation Tests (SENNA)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  let userAId: string;
  let userBId: string;
  let userAToken: string;
  let userBToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    jwtService = moduleFixture.get<JwtService>(JwtService);

    // Create test users
    userAId = 'test-user-a-' + Date.now();
    userBId = 'test-user-b-' + Date.now();

    await prisma.user.create({
      data: {
        id: userAId,
        email: `user-a-${Date.now()}@test.com`,
        name: 'User A',
      },
    });

    await prisma.user.create({
      data: {
        id: userBId,
        email: `user-b-${Date.now()}@test.com`,
        name: 'User B',
      },
    });

    // Generate JWT tokens
    userAToken = jwtService.sign({ sub: userAId, email: `user-a-${Date.now()}@test.com` });
    userBToken = jwtService.sign({ sub: userBId, email: `user-b-${Date.now()}@test.com` });
  });

  afterAll(async () => {
    // Cleanup
    await prisma.user.deleteMany({
      where: {
        OR: [{ id: userAId }, { id: userBId }],
      },
    });
    await app.close();
  });

  describe('Transactions Isolation', () => {
    let userATransactionId: string;

    beforeAll(async () => {
      // Create account for User A
      const accountA = await prisma.account.create({
        data: {
          userId: userAId,
          name: 'Account A',
          type: 'checking',
          balance: 0,
        },
      });

      // Create transaction for User A
      const transaction = await prisma.transaction.create({
        data: {
          userId: userAId,
          accountId: accountA.id,
          amount: 100,
          description: 'Test transaction',
          type: 'income',
          date: new Date(),
        },
      });
      userATransactionId = transaction.id;
    });

    it('User A should access their own transaction', async () => {
      const response = await request(app.getHttpServer())
        .get(`/transactions/${userATransactionId}`)
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(200);

      expect(response.body.data.id).toBe(userATransactionId);
    });

    it('User B should NOT access User A transaction', async () => {
      await request(app.getHttpServer())
        .get(`/transactions/${userATransactionId}`)
        .set('Authorization', `Bearer ${userBToken}`)
        .expect(403 || 404);
    });

    it('User B transaction list should NOT include User A transactions', async () => {
      const response = await request(app.getHttpServer())
        .get('/transactions')
        .set('Authorization', `Bearer ${userBToken}`)
        .expect(200);

      const transactionIds = response.body.data.map((t: any) => t.id);
      expect(transactionIds).not.toContain(userATransactionId);
    });
  });

  describe('Accounts Isolation', () => {
    let userAAccountId: string;

    beforeAll(async () => {
      const account = await prisma.account.create({
        data: {
          userId: userAId,
          name: 'Account A',
          type: 'checking',
          balance: 1000,
        },
      });
      userAAccountId = account.id;
    });

    it('User A should access their own account', async () => {
      const response = await request(app.getHttpServer())
        .get(`/accounts/${userAAccountId}`)
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(200);

      expect(response.body.data.id).toBe(userAAccountId);
    });

    it('User B should NOT access User A account', async () => {
      await request(app.getHttpServer())
        .get(`/accounts/${userAAccountId}`)
        .set('Authorization', `Bearer ${userBToken}`)
        .expect(403 || 404);
    });
  });

  describe('Bills Isolation', () => {
    let userABillId: string;

    beforeAll(async () => {
      const bill = await prisma.bill.create({
        data: {
          userId: userAId,
          name: 'Bill A',
          amount: 50,
          dueDate: new Date(),
        },
      });
      userABillId = bill.id;
    });

    it('User A should access their own bill', async () => {
      const response = await request(app.getHttpServer())
        .get(`/bills/${userABillId}`)
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(200);

      expect(response.body.data.id).toBe(userABillId);
    });

    it('User B should NOT access User A bill', async () => {
      await request(app.getHttpServer())
        .get(`/bills/${userABillId}`)
        .set('Authorization', `Bearer ${userBToken}`)
        .expect(403 || 404);
    });
  });

  describe('Goals Isolation', () => {
    let userAGoalId: string;

    beforeAll(async () => {
      const goal = await prisma.goal.create({
        data: {
          userId: userAId,
          name: 'Goal A',
          targetAmount: 1000,
        },
      });
      userAGoalId = goal.id;
    });

    it('User A should access their own goal', async () => {
      const response = await request(app.getHttpServer())
        .get(`/goals/${userAGoalId}`)
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(200);

      expect(response.body.data.id).toBe(userAGoalId);
    });

    it('User B should NOT access User A goal', async () => {
      await request(app.getHttpServer())
        .get(`/goals/${userAGoalId}`)
        .set('Authorization', `Bearer ${userBToken}`)
        .expect(403 || 404);
    });
  });

  describe('AI Conversations Isolation', () => {
    let userAConversationId: string;

    beforeAll(async () => {
      const conversation = await prisma.aiConversation.create({
        data: {
          userId: userAId,
          sessionId: 'test-session-' + Date.now(),
          channel: 'app',
          messages: [],
        },
      });
      userAConversationId = conversation.id;
    });

    it('User A should access their own conversation', async () => {
      const response = await request(app.getHttpServer())
        .get(`/ai/conversations/${userAConversationId}`)
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(200);

      expect(response.body.data.id).toBe(userAConversationId);
    });

    it('User B should NOT access User A conversation', async () => {
      await request(app.getHttpServer())
        .get(`/ai/conversations/${userAConversationId}`)
        .set('Authorization', `Bearer ${userBToken}`)
        .expect(403 || 404);
    });
  });

  describe('Budgets Isolation', () => {
    let userABudgetId: string;
    let categoryId: string;

    beforeAll(async () => {
      const category = await prisma.category.create({
        data: {
          userId: userAId,
          name: 'Category A',
          type: 'expense',
        },
      });
      categoryId = category.id;

      const budget = await prisma.budget.create({
        data: {
          userId: userAId,
          categoryId,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          budgetedAmount: 500,
          envelope: 'essential',
        },
      });
      userABudgetId = budget.id;
    });

    it('User A should access their own budget', async () => {
      const response = await request(app.getHttpServer())
        .get(`/budgets/${userABudgetId}`)
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(200);

      expect(response.body.data.id).toBe(userABudgetId);
    });

    it('User B should NOT access User A budget', async () => {
      await request(app.getHttpServer())
        .get(`/budgets/${userABudgetId}`)
        .set('Authorization', `Bearer ${userBToken}`)
        .expect(403 || 404);
    });
  });
});
