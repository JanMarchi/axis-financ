# 🚀 COMO INICIAR - Axis Finance (Um Clique!)

## ⚡ Modo Rápido (Recomendado)

### 1️⃣ **PRIMEIRA VEZ: Criar o Atalho**

Abra a pasta do projeto:
```
C:\Users\intel\Documents\jan\axis_financ
```

Procure pelo arquivo:
```
CRIAR_ATALHO_AREA_TRABALHO.bat
```

**Clique com o botão DIREITO** → **Executar como administrador**

Uma janela de terminal aparecerá e criará o atalho automaticamente.

---

### 2️⃣ **AGORA: Iniciar Tudo com Um Clique**

Vá para a **Área de Trabalho**

Você verá um novo atalho:
```
🚀 Axis Finance
```

**Clique duplo no atalho**

Uma janela de boas-vindas aparecerá, depois:
- ✅ PostgreSQL será verificado
- ✅ Redis será verificado
- ✅ Database será criado
- ✅ Migrations serão executadas
- ✅ Backend iniciará (port 3001)
- ✅ Frontend iniciará (port 3000)
- ✅ Navegador abrirá automaticamente

**Aguarde ~30 segundos**

---

## 🌐 Acessar

Quando tudo estiver pronto, o navegador abre automaticamente:

```
http://localhost:3000
```

Se não abrir, copie/cole:
```
http://localhost:3000
```

---

## 📋 Opções Alternativas

### Opção A: Executar Script Direto (sem atalho)

Na pasta do projeto, clique com botão DIREITO na pasta vazia:
```
Abrir Terminal Aqui (ou Terminal Aqui como Administrador)
```

Copie e cole:
```powershell
powershell -ExecutionPolicy Bypass -File ".\START_AXIS_FINANCE.ps1"
```

Pressione ENTER

---

### Opção B: Arquivo BAT (Compatível com Todos)

Procure por:
```
START_AXIS_FINANCE.bat
```

Clique duplo para executar

---

## 🎯 O Que Acontece Automaticamente

```
[1] Verifica se PostgreSQL está rodando
    └─ Se não → Inicia via WSL

[2] Verifica se Redis está rodando
    └─ Se não → Inicia via WSL

[3] Verifica database mepoupe_dev
    └─ Se não existe → Cria automaticamente

[4] Executa migrations Prisma
    └─ Cria tabelas e estrutura

[5] Inicia Backend (NestJS)
    └─ Na porta 3001
    └─ Em nova janela de terminal

[6] Inicia Frontend (Next.js)
    └─ Na porta 3000
    └─ Em nova janela de terminal

[7] Abre navegador
    └─ Automaticamente em http://localhost:3000
```

---

## ✅ Verificar Status

### Tudo está rodando? 🎉

**Indicadores:**
- 2 janelas de terminal abertas (Backend + Frontend)
- Navegador abriu em http://localhost:3000
- Consegue fazer login/register

### Tudo funcionando! ✨

Você pode:
- ✏️ Criar transações
- 📊 Ver relatórios
- 💬 Usar chat Na_th (se tiver API keys)
- 💳 Ver planos de preço

---

## 🛑 Como Parar

Para encerrar tudo:

**Opção 1:** Feche as janelas de terminal
- Feche a janela do Backend
- Feche a janela do Frontend

**Opção 2:** Pressione Ctrl+C em cada janela

**Opção 3:** Feche tudo rapidamente
- Pressione `Windows + X`
- Selecione `Gerenciador de Tarefas`
- Procure por `node`
- Clique com botão DIREITO → `Encerrar tarefa`

---

## ❌ Troubleshooting

### "PostgreSQL não está rodando"

**Solução 1: Usar WSL**
```bash
wsl
sudo service postgresql start
```

**Solução 2: Instalar PostgreSQL nativo**
- Baixe em: https://www.postgresql.org/download/windows/
- Instale com:
  - Port: 5432
  - User: postgres
  - Password: sua_senha
  - Depois crie user `mepoupe`

---

### "Redis não está rodando"

**Solução 1: Usar WSL**
```bash
wsl
sudo service redis-server start
```

**Solução 2: Instalar Redis**
- Via WSL é mais fácil
- Ou baixe: https://github.com/microsoftarchive/redis/releases

---

### "Porta 3001 já está em uso"

**Procure qual processo está usando:**
```powershell
netstat -ano | findstr :3001
```

**Encerre o processo:**
```powershell
taskkill /PID <PID> /F
```

---

### "npm command not found"

**Solução:**
- Node.js não está instalado
- Ou não está no PATH

**Reinstale Node.js:**
1. Baixe em: https://nodejs.org (versão LTS)
2. Instale normalmente
3. Reinicie o computador
4. Tente novamente

---

### "Database connection refused"

**Verifique se PostgreSQL está rodando:**
```bash
wsl psql -U mepoupe -d mepoupe_dev -c "\q"
```

Se der erro:
```bash
wsl sudo service postgresql restart
```

---

## 🔑 Dados de Teste

Para fazer login/registro:

```
Email:    teste@axis.local
Senha:    Teste@123
Nome:     João Silva
CPF:      12345678901
Renda:    R$ 3.000
Objetivo: Economizar para viagem
```

---

## 💡 Dicas

✨ **Mantenha as janelas de terminal abertas**
- Elas mostram o que está acontecendo
- Útil para debugging

✨ **Primeira execução é mais lenta**
- npm install acontece
- Migrations executam
- Aguarde 60 segundos

✨ **Próximas execuções são rápidas**
- Tudo já está instalado
- Depende apenas de inicializar os serviços
- ~10-15 segundos

✨ **Se der erro, não desista!**
- Leia a mensagem de erro nas janelas de terminal
- 99% é falta de PostgreSQL/Redis
- Veja "Troubleshooting" acima

---

## 📞 Suporte

Erro que não está aqui?

1. Verifique as janelas de terminal (Backend + Frontend)
2. Procure por mensagens de erro vermelhas
3. Veja o arquivo `QUICKSTART_LOCAL.md` para instruções manuais
4. Cheque: https://github.com/JanMarchi/axis-financ/issues

---

## ✅ Checklist de Inicialização

- [ ] Projeto está em `C:\Users\intel\Documents\jan\axis_financ`
- [ ] Já executei `CRIAR_ATALHO_AREA_TRABALHO.bat` uma vez
- [ ] PostgreSQL está rodando (WSL ou nativo)
- [ ] Redis está rodando (WSL ou nativo)
- [ ] Cliquei duplo no atalho da Área de Trabalho
- [ ] Aguardei ~30 segundos
- [ ] Frontend abriu em http://localhost:3000
- [ ] Consigo fazer login/register
- [ ] ✨ Tudo funcionando!

---

🎉 **PRONTO! Seu Axis Finance está rodando!**

Aproveite! 🚀
