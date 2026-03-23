import { IsEmail, IsString, MinLength, IsOptional, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/[A-Z]/, { message: 'Senha deve ter pelo menos uma letra maiúscula' })
  @Matches(/[0-9]/, { message: 'Senha deve ter pelo menos um número' })
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
