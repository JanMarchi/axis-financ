# 🚀 Quick Start Local — Sem Docker

## ⚙️ Requisitos

1. **Node.js** ≥ 18 ✅ (você tem)
2. **PostgreSQL** 16
3. **Redis** 7

## 📦 Instalação

### 1. Instalar PostgreSQL (Windows)

```powershell
# Baixar do site
https://www.postgresql.org/download/windows/

# Instalar com:
# - Port: 5432
# - Password: mepoupe_dev_pass
# - Username: mepoupe
```

Ou usar **WSL + apt**:
```bash
wsl
sudo apt install postgresql-16 redis-server
sudo service postgresql start
sudo service redis-server start
```

### 2. Criar Database

```bash
# Via psql
psql -U postgres
CREATE USER mepoupe WITH PASSWORD 'mepoupe_dev_pass';
CREATE DATABASE mepoupe_dev OWNER mepoupe;
GRANT ALL PRIVILEGES ON DATABASE mepoupe_dev TO mepoupe;
\q
```

### 3. Instalar Redis

```powershell
# Windows: Usar WSL
wsl
sudo apt install redis-server
sudo service redis-server start

# Verificar
redis-cli ping
# → PONG
```

### 4. Instalar Dependências Node

```bash
cd apps/api
npm install

cd ../web
npm install
```

### 5. Prisma Migrations

```bash
cd apps/api
npx prisma migrate deploy
npx prisma db seed   # Opcional: seed com dados de teste
```

## 🚀 Iniciar Serviços

### Terminal 1 — Backend (NestJS)
```bash
cd apps/api
npm run start:dev
# → Listening on port 3001
```

### Terminal 2 — Frontend (Next.js)
```bash
cd apps/web
npm run dev
# → Ready on http://localhost:3000
```

## ✅ Verificar Status

- **Frontend:** http://localhost:3000
- **Backend Health:** http://localhost:3001/health
- **API Docs:** http://localhost:3001/api/docs (Swagger)

## 🧪 Testar Endpoints

### Register
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@"
  }'
```

### Get Pricing Plans (sem auth)
```bash
curl http://localhost:3001/billing/plans
```

### Get Dashboard (com JWT token)
```bash
curl http://localhost:3001/accounts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 Troubleshooting

### PostgreSQL Connection Refused
```bash
# Verificar se PostgreSQL está rodando
psql -U mepoupe -d mepoupe_dev -c "SELECT version();"

# Se falhar, reiniciar
sudo service postgresql restart  # WSL
```

### Redis Connection Refused
```bash
# Verificar se Redis está rodando
redis-cli ping

# Se falhar, reiniciar
sudo service redis-server restart  # WSL
```

### Port Already in Use
```bash
# Mudar porta em .env
PORT=3002  # para backend
# ou
NEXT_PUBLIC_PORT=3001  # para frontend
```

### TypeScript Errors
```bash
cd apps/api
npx tsc --noEmit 2>&1 | head -20
```

### Build Errors
```bash
# Limpar e reconstruir
rm -rf dist node_modules
npm install
npm run build
```

## 📝 Environment Variables

Os arquivos `.env` e `.env.local` foram criados com valores de placeholder.

**Para testar funcionalidades premium, adicione as chaves reais:**

```env
# apps/api/.env
ANTHROPIC_API_KEY=sk-ant-...
STRIPE_SECRET_KEY=sk_test_...
PLUGGY_CLIENT_ID=...
```

**Sem essas chaves:**
- ✅ Registro, login, CRUD funcionam
- ❌ IA Na_th não funciona
- ❌ Open Finance (Pluggy) não funciona
- ❌ Stripe pagamentos não funcionam

## 🎯 Testar Fluxo Completo

1. **Abrir http://localhost:3000**
2. **Clicar em "Register"**
3. **Preencher formulário (5 etapas)**
4. **Login**
5. **Dashboard carrega com saldo R$ 0**
6. **Criar transação manual**
7. **Verificar em "Relatórios"**

## 📊 Dados de Teste

```json
{
  "email": "test@axis.local",
  "password": "Teste@123",
  "name": "João Silva",
  "cpf": "12345678901",
  "monthlyIncome": 3000,
  "goal": "Economizar para viagem"
}
```

## 💡 Dicas

- Use **Thunder Client** ou **Postman** para testar API
- Logs detalhados com `LOG_LEVEL=debug` no .env
- Banco reset: `npx prisma migrate reset`
- Prisma Studio: `npx prisma studio`

---

**Pronto! Sua aplicação está rodando localmente.** 🚀
