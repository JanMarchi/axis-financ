# PROMPT INICIAL — Axis Finance · Colar no Claude Code para começar

---

## COMO USAR

1. Crie uma pasta: `mkdir mepoupe-plus && cd mepoupe-plus`
2. Copie `CLAUDE.md` e `TASKS.md` para dentro da pasta
3. Abra o Claude Code: `claude` (na pasta do projeto)
4. Cole o prompt abaixo na primeira mensagem

---

## PROMPT PARA INICIAR (copie e cole inteiro no Claude Code)

```
Leia completamente o arquivo CLAUDE.md e o TASKS.md antes de qualquer ação.

Você vai construir o Axis Finance — uma plataforma SaaS de gestão financeira pessoal com IA.

Regras de execução obrigatórias:
1. Execute as tasks NA ORDEM EXATA do TASKS.md, uma por vez
2. Marque [x] no TASKS.md ao concluir cada task ANTES de avançar
3. Atualize a seção "ESTADO ATUAL" do CLAUDE.md ao concluir cada fase
4. NUNCA pule fases ou tasks — se uma task falhar 2x, documente em ERRORS.md e avance
5. Ao final de cada fase: faça git commit com a mensagem indicada no TASKS.md
6. NUNCA hardcode API keys ou secrets — use variáveis de ambiente de .env

Comece agora pela task FASE-0-001.
Execute cada task completamente antes de prosseguir para a próxima.
Quando concluir todas as tasks da Fase 0, me informe e aguarde confirmação para continuar com a Fase 1.
```

---

## PROMPT PARA RETOMAR (se a sessão cair)

```
Leia o CLAUDE.md (especialmente a seção "ESTADO ATUAL") e o TASKS.md.

Identifique a primeira task com [ ] (não concluída) no TASKS.md.

Me informe:
- Qual fase está em andamento
- Qual é a próxima task a executar (ID e descrição)
- Se há algum erro pendente no ERRORS.md

Depois aguarde minha confirmação para continuar.
```

---

## PROMPT PARA FASE ESPECÍFICA (se quiser retomar em uma fase)

Substitua N pelo número da fase:

```
Leia o CLAUDE.md e TASKS.md.
Continue a partir da FASE-N — encontre a primeira task [ ] dessa fase e execute.
Siga todas as regras de execução do CLAUDE.md.
```

---

## DICAS PARA EVITAR QUEBRAS DE CONTEXTO

### 1. Sessões longas

Claude Code tem limite de contexto. Se a sessão ficar muito longa:

- Faça commit do progresso
- Atualize "ESTADO ATUAL" no CLAUDE.md
- Inicie nova sessão com o "PROMPT PARA RETOMAR" acima

### 2. Tasks que dependem de API keys externas

Nas fases 4-7 (Pluggy, Z-API, Stripe, Anthropic), o Claude Code vai precisar das API keys.
Tenha-as prontas antes de iniciar cada fase:

- Fase 4: `PLUGGY_CLIENT_ID` + `PLUGGY_CLIENT_SECRET`
- Fase 5: `ZAPI_INSTANCE_ID` + `ZAPI_TOKEN`
- Fase 6: `ANTHROPIC_API_KEY`
- Fase 7: `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET`

### 3. Ambiente local

Antes de iniciar, certifique-se que tem instalado:

- Node.js 20+
- Docker Desktop (para PostgreSQL e Redis locais)
- Git configurado

### 4. Controle de fases por sessão

Recomendado: 1 fase por sessão do Claude Code.
Não tente fazer tudo de uma vez — o contexto do agente vai degradar.

Ordem sugerida de sessões:

- Sessão 1: Fase 0 + Fase 1
- Sessão 2: Fase 2
- Sessão 3: Fase 3
- Sessão 4: Fase 4
- Sessão 5: Fase 5 + Fase 6
- Sessão 6: Fase 7 + Fase 8
- Sessão 7: Fase 9

---

## CHECKLIST PRÉ-INÍCIO

Antes de rodar o prompt inicial, confirme:

- [ ] Node.js 20+ instalado (`node --version`)
- [ ] Docker Desktop rodando (`docker info`)
- [ ] Git configurado (`git config --global user.email`)
- [ ] Claude Code instalado (`claude --version`)
- [ ] Pasta `mepoupe-plus/` criada com `CLAUDE.md` e `TASKS.md` dentro
- [ ] API keys das integrações anotadas (Pluggy, Stripe, Anthropic, Z-API)
- [ ] Conta Supabase criada e projeto configurado

Tudo pronto? Execute o prompt inicial e veja o app nascer. 🚀
