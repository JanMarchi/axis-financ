# DEPLOYMENT.md — Axis Finance Production Deployment Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Railway.app                           │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Next.js  │  │ NestJS   │  │ Redis    │  │ Postgres │   │
│  │ (web)    │  │ (api)    │  │ Cache    │  │ DB       │   │
│  │ :3000    │  │ :3001    │  │ :6379    │  │ :5432    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
         │                │
    Vercel             Railway
   (Alternative)    (Recommended)
```

## Railway Deployment

### Prerequisites
- [ ] Railway account created (railway.app)
- [ ] GitHub repository connected
- [ ] Environment variables configured
- [ ] Database backups tested

### Step 1: Setup Railway Services

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize Railway project
railway init --name axis-finance
```

### Step 2: Configure Services

#### PostgreSQL Database
```yaml
# railway.toml
[services.database]
type = "postgres"
version = "16"

[services.database.env]
POSTGRES_DB = "axisfinance_prod"
POSTGRES_USER = "postgres"
POSTGRES_PASSWORD = "${{ secrets.DATABASE_PASSWORD }}"
```

#### Redis Cache
```yaml
[services.redis]
type = "redis"
version = "7"
```

#### NestJS Backend
```yaml
[services.api]
type = "nodejs"
startCommand = "npm run start:prod"
buildCommand = "npm install && npm run build"
port = 3001

[services.api.env]
NODE_ENV = "production"
DATABASE_URL = "${{ services.database.DATABASE_URL }}"
REDIS_URL = "${{ services.redis.REDIS_URL }}"
JWT_SECRET = "${{ secrets.JWT_SECRET }}"
# ... other secrets
```

#### Next.js Frontend
```yaml
[services.web]
type = "nodejs"
startCommand = "npm run start"
buildCommand = "npm install && npm run build"
port = 3000

[services.web.env]
NEXT_PUBLIC_API_URL = "https://api-prod.railway.app"
NEXT_PUBLIC_SUPABASE_URL = "${{ secrets.SUPABASE_URL }}"
```

### Step 3: Deploy
```bash
# Deploy to Railway
railway up

# View logs
railway logs

# Check status
railway status
```

### Step 4: Verify Deployment
```bash
# Test health endpoints
curl https://api-prod.railway.app/health
curl https://app-prod.railway.app/health
```

---

## Environment Variables

### Production Variables
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/axisfinance_prod

# Redis
REDIS_HOST=redis-prod
REDIS_PORT=6379
REDIS_PASSWORD=<secure-password>

# JWT & Auth
JWT_SECRET=<64-char-random-string>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=30d

# APIs
ANTHROPIC_API_KEY=sk-ant-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
PLUGGY_CLIENT_ID=...
PLUGGY_CLIENT_SECRET=...
ZAPI_INSTANCE_ID=...
ZAPI_TOKEN=...
RESEND_API_KEY=re_...

# URLs
APP_URL=https://app-prod.railway.app
API_URL=https://api-prod.railway.app
NEXT_PUBLIC_API_URL=https://api-prod.railway.app
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Services
NODE_ENV=production
LOG_LEVEL=info
```

### Secrets Management
```bash
# Create secrets in Railway dashboard
railway secret:set JWT_SECRET <value>
railway secret:set DATABASE_PASSWORD <value>
railway secret:set STRIPE_SECRET_KEY <value>
# ... etc
```

---

## Database Migrations

### Pre-Deployment
```bash
# Generate migration
npx prisma migrate dev --name <migration-name>

# Push to production
npx prisma migrate deploy --skip-generate
```

### Backup Strategy
```bash
# Daily automated backups
- 3 retained full backups (daily)
- 7 retained incremental backups (daily)
- 30-day retention for point-in-time recovery

# Backup verification
- Test restore to staging weekly
- Documented recovery time objective (RTO): 1 hour
- Documented recovery point objective (RPO): 1 hour
```

---

## Monitoring & Logging

### Application Metrics
```typescript
// Winston logger configuration
const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});
```

### Monitoring Tools
- [x] Railway built-in metrics
- [ ] Sentry for error tracking (integration pending)
- [ ] Grafana dashboard (optional)
- [ ] CloudWatch logs (if using AWS)

### Health Checks
```bash
# Endpoint health checks every 30s
GET /health → {status: 'ok', db: 'connected', redis: 'connected'}
```

---

## Performance Optimization

### Caching Strategy
```typescript
// Redis caching for:
- User preferences (TTL: 24h)
- Pricing plans (TTL: 7d)
- Category lists (TTL: 7d)
```

### Database Indexes
```sql
-- Already created in schema.prisma
CREATE INDEX idx_transactions_userid_date ON transactions(user_id, date DESC);
CREATE INDEX idx_bills_userid_status_duedate ON bills(user_id, status, due_date);
CREATE INDEX idx_accounts_userid ON accounts(user_id);
```

### CDN Configuration
- [x] Frontend static assets via Railway edge locations
- [ ] Image optimization via next/image
- [ ] API response caching headers set

---

## SSL/TLS Configuration

### Certificate Management
```
- Provider: Railway (automatic)
- Auto-renewal: Enabled
- Certificate expiry: 90 days (auto-renewed at 30 days)
- TLS version: 1.2+
```

### HSTS Headers
```typescript
// Configured in security-headers.middleware.ts
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

---

## Security Deployment Checklist

### Pre-Launch
- [x] All environment secrets configured
- [x] Database password changed from default
- [x] JWT secrets generated (128+ chars, random)
- [x] API keys rotated
- [x] CORS configured for production domain only
- [x] Rate limiting enabled
- [x] Security headers configured
- [x] HTTPS enforced
- [x] Error handling sanitized (no stack traces)
- [x] Logging configured (PII excluded)
- [x] Database backups tested
- [x] Monitoring configured
- [x] Incident response plan documented

### Post-Launch (Day 1)
- [ ] Verify HTTPS redirect working
- [ ] Test health endpoints
- [ ] Verify database connectivity
- [ ] Verify Redis connectivity
- [ ] Check logs for errors
- [ ] Monitor resource usage
- [ ] Test authentication flow
- [ ] Verify email notifications working
- [ ] Test payment webhook processing
- [ ] Verify analytics/monitoring data flowing

### Post-Launch (Week 1)
- [ ] Run security headers audit
- [ ] Review all logs for suspicious activity
- [ ] Load testing with realistic traffic patterns
- [ ] Database backup restore test
- [ ] Disaster recovery drill
- [ ] Performance monitoring report
- [ ] User feedback collection

---

## Rollback Plan

### If Critical Issue Detected
1. Immediate Actions:
   ```bash
   # Rollback to previous Railway deployment
   railway rollback <previous-deployment-id>

   # Or redeploy from git tag
   git tag -l                    # List production tags
   git checkout v1.0.0           # Check out previous version
   railway up --from-git-tag
   ```

2. Communication:
   - Notify users of incident
   - Post status update on status page
   - Email affected users

3. Post-Incident:
   - Root cause analysis
   - Fix implementation
   - Testing before redeployment
   - Deployment review process update

---

## Scaling Strategy

### Current Capacity
- NestJS: 1 instance (512MB RAM, 0.5 CPU)
- Next.js: 1 instance (512MB RAM, 0.5 CPU)
- PostgreSQL: 1 instance (1GB RAM, shared CPU)
- Redis: 1 instance (512MB RAM, shared CPU)

### Scaling Triggers
- API CPU > 80% → Scale to 2 instances
- API Memory > 80% → Increase to 1GB
- Database connections > 80 → Scale read replicas
- Request latency > 500ms → Investigate bottleneck

### Horizontal Scaling
```yaml
[services.api]
replicas = 2
loadBalancer = "round-robin"
```

---

## Maintenance Windows

### Scheduled Maintenance
- Weekly: Log rotation (Tuesday 02:00 UTC)
- Monthly: Dependency security updates (First Sunday 01:00 UTC)
- Quarterly: Major version upgrades (TBD after testing)

### Zero-Downtime Deployments
```bash
# Blue-green deployment via Railway
1. New deployment created (green)
2. Health checks passed
3. Traffic shifted to green
4. Blue deployment kept as fallback
5. Blue destroyed after 24h success
```

---

## Disaster Recovery Plan

### Backup Schedule
- Database: Hourly snapshots, 7-day retention
- Application: Git tags at each release
- Secrets: Encrypted backup in secure vault

### Recovery Procedures

**Database Corruption**
1. Stop API services
2. Restore from latest clean backup
3. Verify data integrity
4. Resume API services
5. Monitor for issues

**Complete Infrastructure Failure**
1. Provision new Railway services
2. Restore database from backup
3. Redeploy application
4. Restore DNS records
5. Notify users of recovery

**Data Breach**
1. Immediately disable affected tokens/sessions
2. Force password resets for affected users
3. Review audit logs
4. Report to authorities if required
5. Post incident report

---

## Monitoring & Alerts

### Critical Alerts (PagerDuty/Email)
- [ ] Application error rate > 1%
- [ ] API response time > 5s (p95)
- [ ] Database connection pool exhausted
- [ ] Disk usage > 90%
- [ ] Payment processing failures

### Warning Alerts (Dashboard)
- API response time > 1s (p95)
- Error rate > 0.1%
- Memory usage > 70%
- CPU usage > 70%

---

## Cost Optimization

### Current Estimate (Monthly)
- NestJS (512MB, shared CPU): $5
- Next.js (512MB, shared CPU): $5
- PostgreSQL (1GB): $12
- Redis (512MB): $5
- Network/Storage: $3
- **Total: ~$30/month**

### Cost Reduction Opportunities
- Use Railway's free tier for development
- Implement aggressive caching to reduce DB queries
- Optimize image sizes and CDN usage
- Archive old logs after 90 days

---

**Last Updated:** 2026-03-23
**Next Review:** When scaling becomes necessary
