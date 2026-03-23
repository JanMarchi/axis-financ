import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário de teste
  const testUser = await prisma.user.upsert({
    where: { email: 'test@mepoupe.dev' },
    update: {},
    create: {
      email: 'test@mepoupe.dev',
      name: 'Test User',
      isActive: true,
      preferences: {
        create: {
          currency: 'BRL',
          language: 'pt-BR',
          onboardingCompleted: false,
        },
      },
      subscription: {
        create: {
          plan: 'premium_monthly',
          status: 'active',
        },
      },
    },
  });

  console.log(`✓ Usuário de teste criado: ${testUser.email}`);

  // Categorias de sistema
  const systemCategories = [
    // Essencial - Despesas
    { name: 'Alimentação', type: 'expense', envelope: 'essential', icon: '🍔', isSystem: true },
    { name: 'Transporte', type: 'expense', envelope: 'essential', icon: '🚗', isSystem: true },
    { name: 'Moradia', type: 'expense', envelope: 'essential', icon: '🏠', isSystem: true },
    { name: 'Saúde', type: 'expense', envelope: 'essential', icon: '🏥', isSystem: true },
    { name: 'Educação', type: 'expense', envelope: 'essential', icon: '📚', isSystem: true },
    { name: 'Utilidades', type: 'expense', envelope: 'essential', icon: '💡', isSystem: true },

    // Não Essencial - Despesas
    { name: 'Diversão', type: 'expense', envelope: 'non_essential', icon: '🎬', isSystem: true },
    { name: 'Restaurante', type: 'expense', envelope: 'non_essential', icon: '🍽️', isSystem: true },
    { name: 'Compras', type: 'expense', envelope: 'non_essential', icon: '🛍️', isSystem: true },
    { name: 'Viagem', type: 'expense', envelope: 'non_essential', icon: '✈️', isSystem: true },
    { name: 'Subscriptions', type: 'expense', envelope: 'non_essential', icon: '📱', isSystem: true },
    { name: 'Cuidados pessoais', type: 'expense', envelope: 'non_essential', icon: '💅', isSystem: true },

    // Crescimento
    { name: 'Poupança', type: 'expense', envelope: 'growth', icon: '💰', isSystem: true },
    { name: 'Seguro', type: 'expense', envelope: 'growth', icon: '🛡️', isSystem: true },

    // Investimento
    { name: 'Investimentos', type: 'expense', envelope: 'investment', icon: '📈', isSystem: true },

    // Renda
    { name: 'Salário', type: 'income', icon: '💵', isSystem: true },
    { name: 'Freelance', type: 'income', icon: '💼', isSystem: true },
    { name: 'Bônus', type: 'income', icon: '🎁', isSystem: true },
    { name: 'Aplicações', type: 'income', icon: '💹', isSystem: true },
    { name: 'Outro', type: 'income', icon: '❓', isSystem: true },
  ];

  for (const category of systemCategories) {
    await prisma.category.upsert({
      where: { name_userId: { name: category.name, userId: null } },
      update: {},
      create: {
        name: category.name,
        type: category.type as any,
        envelope: category.envelope as any,
        icon: category.icon,
        isSystem: true,
        isActive: true,
      },
    });
  }

  console.log(`✓ ${systemCategories.length} categorias de sistema criadas`);

  // Criar conta padrão para o usuário de teste
  const testAccount = await prisma.account.create({
    data: {
      userId: testUser.id,
      name: 'Conta Corrente',
      type: 'checking',
      institution: 'Test Bank',
      balance: 10000,
      isActive: true,
      isManual: true,
      currency: 'BRL',
    },
  });

  console.log(`✓ Conta de teste criada: ${testAccount.name}`);

  console.log('✅ Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
