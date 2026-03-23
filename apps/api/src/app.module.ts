import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import { BillsModule } from './bills/bills.module';
import { GoalsModule } from './goals/goals.module';
import { BudgetsModule } from './budgets/budgets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    AccountsModule,
    TransactionsModule,
    CategoriesModule,
    BillsModule,
    GoalsModule,
    BudgetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
