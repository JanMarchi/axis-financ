import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum AccountType {
  CHECKING = 'checking',
  SAVINGS = 'savings',
  CREDIT_CARD = 'credit_card',
  INVESTMENT = 'investment',
  CASH = 'cash',
  WALLET = 'wallet',
}

export class CreateAccountDto {
  @IsString()
  name: string;

  @IsEnum(AccountType)
  type: AccountType;

  @IsOptional()
  @IsString()
  institution?: string;

  @IsOptional()
  @IsNumber()
  balance?: number;
}
