import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import { BillsModule } from './bills/bills.module';
import { GoalsModule } from './goals/goals.module';
import { BudgetsModule } from './budgets/budgets.module';
import { PluggyModule } from './pluggy/pluggy.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { WorkersModule } from './workers/workers.module';
import { AiModule } from './ai/ai.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      } as any,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    AccountsModule,
    TransactionsModule,
    CategoriesModule,
    BillsModule,
    GoalsModule,
    BudgetsModule,
    PluggyModule,
    WebhooksModule,
    WorkersModule,
    AiModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
