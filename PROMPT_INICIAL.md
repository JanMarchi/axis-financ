# PROMPT_INICIAL.md — Axis Finance · Instrução de Ignição Autônoma

---

## COMO PREPARAR O AMBIENTE (fazer uma vez antes de dormir)

```bash
# 1. Criar a pasta do projeto
mkdir mepoupe-plus && cd mepoupe-plus

# 2. Colocar CLAUDE.md e TASKS.md nesta pasta

# 3. Verificar pré-requisitos
node --version       # precisa ser 20+
docker info          # Docker Desktop precisa estar rodando
git --version        # Git configurado
claude --version     # Claude Code instalado

# 4. Abrir o Claude Code em modo autônomo total
claude --dangerously-skip-permissions
```

---

## O PROMPT — COLE INTEIRO NO CLAUDE CODE

```
Você é uma equipe de engenharia autônoma construindo o Me Poupe+.

PASSO 1: Leia o arquivo CLAUDE.md inteiro antes de qualquer ação.
PASSO 2: Leia o arquivo TASKS.md inteiro.
PASSO 3: Execute TODAS as tasks do TASKS.md em ordem, do FASE-0-001 até FASE-9-011.

REGRAS ABSOLUTAS DE AUTONOMIA:
- NUNCA pare para pedir permissão ou confirmação
- NUNCA pergunte "posso continuar?" ou "devo prosseguir?"
- NUNCA espere input humano entre tasks ou fases
- SEMPRE use --yes, --force, -y em comandos interativos
- SEMPRE avance para a próxima task imediatamente após concluir a atual
- SEMPRE avance para a próxima fase automaticamente após concluir a atual
- Se um comando falhar: tente alternativa → se falhar 2x → crie/atualize ERRORS.md com o erro → continue
- Ao concluir cada fase: faça o git commit indicado → atualize CLAUDE.md → prossiga

EQUIPE ATIVA:
- ARIA (Arquiteta): toda decisão de estrutura, módulos, schema
- NOVA (Designer): todo código de UI — seguir design system do CLAUDE.md EXATAMENTE
  Fontes obrigatórias: Bricolage Grotesque (display) + Geist (interface) + Geist Mono (valores R$)
  Dark mode first. Background: #0A0A0B. Brand: #00D46A. Nunca usar Inter como fonte principal.
- KAI (Engenheiro): implementação de features, integrações, lógica de negócio
- SENNA (Segurança): validações, isolamento userId, guards, DTOs

OBJETIVO: Ao final das 9 fases, o Me Poupe+ estará:
✓ Rodando localmente com docker-compose
✓ Com design premium dark (Bricolage Grotesque + Geist + Geist Mono)
✓ Auth funcional (Supabase)
✓ CRUD completo de transações, contas, orçamentos, metas, bills
✓ Open Finance (Pluggy) integrado
✓ WhatsApp (Z-API) com lembretes e confirmação por SIM
✓ Copilota Na_th com Claude API e tool calling
✓ Billing com Stripe
✓ Relatórios com exportação PDF/CSV
✓ Deployado no Railway
✓ Commitado e taggeado como v1.0.0-mvp

Comece agora. Execute sem parar. Não aguarde.
```

---

## PROMPT PARA RETOMAR (se a sessão cair)

```bash
cd mepoupe-plus
claude --dangerously-skip-permissions
```

Cole no Claude Code:

```
Leia o CLAUDE.md (especialmente a seção "ESTADO ATUAL" e "PRÓXIMA TASK").
Leia o TASKS.md e localize a primeira task com [ ] (não concluída).
Se existir ERRORS.md, leia e verifique se algum erro pode ser resolvido agora.

Retome a execução autônoma a partir da primeira task pendente.
Mesmas regras: sem parar, sem pedir permissão, sem aguardar input.
Execute até o FASE-9-011 ou até esgotar as tasks pendentes.
```

---

## PROMPT PARA FASE ESPECÍFICA

```
Leia o CLAUDE.md e TASKS.md.
Execute autonomamente apenas as tasks da FASE-[N] que ainda estejam com [ ].
Mesmas regras de autonomia: sem parar, sem perguntar.
Ao concluir a fase, faça o commit e me informe que terminou.
```

---

## CHECKLIST PRÉ-SONO

Confirme antes de dormir:

- [ ] `node --version` → 20+
- [ ] `docker info` → Docker Desktop rodando
- [ ] `claude --version` → instalado
- [ ] `CLAUDE.md` e `TASKS.md` na pasta `mepoupe-plus/`
- [ ] Anotou as API keys que vai precisar (mesmo que preenchimento seja depois):
  - Supabase URL + anon key + service role key
  - Anthropic API key
  - Pluggy client ID + secret
  - Stripe secret key + price IDs
  - Z-API instance ID + token
- [ ] Claude Code aberto com `--dangerously-skip-permissions`
- [ ] Prompt colado e executando

**Boa noite. Quando acordar, o Me Poupe+ estará construído. 🚀**

---

## NOTAS TÉCNICAS

### Por que `--dangerously-skip-permissions`?

Essa flag do Claude Code desabilita as confirmações interativas de cada operação de arquivo,
execução de comando e acesso ao sistema. Sem ela, o agente para a cada ação pedindo "posso fazer isso?".
Com ela, executa continuamente — exatamente o comportamento que queremos para rodar overnight.

### Sessões longas e limite de contexto

Se a sessão ultrapassar ~4-6 horas de execução contínua, o contexto pode degradar.
O CLAUDE.md foi projetado para ser relido a qualquer momento e reorientar o agente.
Se notar comportamento errático: encerrar sessão, abrir nova com o "PROMPT PARA RETOMAR".

### API keys faltando

O agente vai criar os `.env` com placeholder `PREENCHER` onde as keys estão ausentes.
Ele continuará o build — os módulos que dependem dessas keys serão implementados corretamente,
mas só funcionarão quando as keys forem preenchidas manualmente depois.
