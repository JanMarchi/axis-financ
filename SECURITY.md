# SECURITY.md — Axis Finance Security Checklist

## OWASP Top 10 Compliance

### 1. Injection
- [x] **SQL Injection** — Prisma ORM prevents via parameterized queries
- [x] **NoSQL Injection** — Not applicable
- [x] **Command Injection** — No shell commands executed with user input
- [x] **Input Sanitization** — All DTOs validated with class-validator

### 2. Broken Authentication
- [x] **JWT Token Management** — HttpOnly cookies, secure transmission
- [x] **Token Expiration** — Access token: 15m, Refresh token: 30d
- [x] **Password Hashing** — bcrypt with salt rounds ≥ 10
- [x] **Session Management** — Redis-backed sessions
- [x] **Rate Limiting** — Active on `/auth/login`, max 100 req/15min

### 3. Sensitive Data Exposure
- [x] **HTTPS Enforcement** — HSTS header configured
- [x] **TLS Version** — Only TLS 1.2+ allowed
- [x] **Cipher Suites** — Strong ciphers only
- [x] **Sensitive Data in Logs** — CPF/passwords never logged (grep validation required)
- [x] **PII Encryption** — CPF stored as SHA-256 hash only
- [x] **API Key Storage** — environment variables, never hardcoded

### 4. XML External Entities (XXE)
- [x] **XML Processing** — Not applicable in this stack
- [x] **File Uploads** — Validated before processing

### 5. Broken Access Control
- [x] **RBAC** — Role-based access via subscription plans
- [x] **User Isolation** — All queries filtered by userId
- [x] **Feature Gates** — @RequiresPremium decorator enforced
- [x] **Audit Logs** — All sensitive actions logged to audit_logs table
- [x] **Data Segregation** — Guaranteed via userId check on every query

### 6. Security Misconfiguration
- [x] **Default Credentials** — All changed
- [x] **Unnecessary Services** — Only required services enabled
- [x] **Security Headers** — CSP, X-Frame-Options, X-Content-Type-Options configured
- [x] **Error Handling** — No stack traces exposed to clients
- [x] **CORS** — Configured for frontend origin only

### 7. Cross-Site Scripting (XSS)
- [x] **Content Security Policy** — Strict CSP header configured
- [x] **Input Validation** — All user input validated/escaped
- [x] **Output Encoding** — React automatically escapes by default
- [x] **DOM XSS** — No direct DOM manipulation with user input
- [x] **HTTPOnly Cookies** — XSS-safe token storage

### 8. Insecure Deserialization
- [x] **JSON Validation** — class-validator on all DTOs
- [x] **Type Safety** — TypeScript strict mode enabled
- [x] **Untrusted Data** — Never directly used from external sources

### 9. Using Components with Known Vulnerabilities
- [x] **Dependency Scanning** — npm audit regularly run
- [x] **Dependency Updates** — Security patches applied immediately
- [x] **Vulnerable Packages** — None identified in npm audit

### 10. Insufficient Logging & Monitoring
- [x] **Audit Logging** — All sensitive operations logged
- [x] **Error Logging** — Structured logging with correlation IDs
- [x] **Monitoring** — Application metrics collected
- [x] **Alerting** — Critical errors trigger alerts
- [x] **Log Retention** — 90 days retention policy

---

## Data Isolation Verification

### Isolation Tests
- [x] User A cannot access User B transactions → `data-isolation.test.ts`
- [x] User A cannot access User B accounts → `data-isolation.test.ts`
- [x] User A cannot access User B bills → `data-isolation.test.ts`
- [x] User A cannot access User B goals → `data-isolation.test.ts`
- [x] User A cannot access User B conversations → `data-isolation.test.ts`
- [x] User A cannot access User B budgets → `data-isolation.test.ts`

### Test Command
```bash
npm run test -- data-isolation.test.ts
```

---

## Authentication & Authorization

### JWT Configuration
```typescript
// Token Structure
{
  sub: userId,
  email: userEmail,
  iat: issuedAt,
  exp: expiresAt (15m),
}

// Refresh Token
{
  sub: userId,
  type: 'refresh',
  exp: expiresAt (30d),
}
```

### Guards Implemented
- [x] `JwtAuthGuard` — Validates JWT signature and expiration
- [x] `RequiresPremiumGuard` — Validates subscription plan
- [x] `RateLimitGuard` — Prevents brute force attacks

---

## Secure Coding Practices

### CPF Handling
```typescript
// NEVER store CPF in plain text
const cpfHash = crypto.createHash('sha256').update(cpf).digest('hex');

// NEVER log CPF
// ❌ console.log('User CPF:', cpf);
// ✅ console.log('User CPF: REDACTED');
```

### Password Storage
```typescript
// Use bcrypt with salt rounds ≥ 10
const hashedPassword = await bcrypt.hash(password, 10);
```

### API Key Security
```typescript
// Use environment variables
const apiKey = process.env.STRIPE_SECRET_KEY;
// Never hardcode secrets in code
```

---

## Deployment Security

### Environment Configuration
- [x] `.env` file never committed
- [x] Production secrets in secure vault (Railway env vars)
- [x] Database credentials rotated annually
- [x] API keys rotated quarterly

### Network Security
- [x] Database access restricted to API only
- [x] Redis access restricted to localhost/VPC
- [x] No direct database access from frontend
- [x] API behind reverse proxy (Railway)

### SSL/TLS
- [x] HTTPS enforced in production
- [x] Certificate auto-renewal configured
- [x] Only TLS 1.2+ allowed

---

## Incident Response

### Reporting Security Issues
1. Do NOT create public GitHub issues
2. Email security@axisfinance.app with details
3. Include: vulnerability description, affected component, reproduction steps
4. Response target: 24 hours
5. Fix target: 48 hours (critical), 7 days (high), 30 days (medium)

### Incident Log
- Date | Severity | Description | Status | Resolution

---

## Compliance

### LGPD (Lei Geral de Proteção de Dados)
- [x] User consent collected before data processing
- [x] Privacy policy displayed and accepted
- [x] Right to be forgotten implemented
- [x] Data export functionality available
- [x] PII encrypted at rest and in transit

### PCI DSS (if applicable)
- [x] Credit card data never stored (Stripe handles)
- [x] PCI compliance delegated to Stripe
- [x] No sensitive card data in logs

---

## Security Audit Checklist

### Pre-Deployment
- [x] All dependencies scanned for vulnerabilities
- [x] Code reviewed for security issues
- [x] Security headers configured
- [x] CORS properly configured
- [x] Rate limiting enabled
- [x] Error messages sanitized
- [x] Logging configured (no sensitive data)
- [x] Database backups automated
- [x] Monitoring configured
- [x] Incident response plan documented

### Post-Deployment
- [ ] Security headers verified via headers.io
- [ ] OWASP ZAP scan completed
- [ ] Penetration test conducted (quarterly)
- [ ] SSL/TLS configuration verified via SSL Labs
- [ ] Database backups verified as restorable

---

## Security Contacts

**Security Coordinator:** SENNA
**Report Email:** security@axisfinance.app
**Emergency:** [emergency contact number]

---

**Last Updated:** 2026-03-23
**Next Review:** 2026-06-23 (quarterly)
