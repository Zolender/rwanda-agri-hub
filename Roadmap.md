# Rwanda Agri-Hub: Development Roadmap

> **Status:** Phase 1 (Foundation) → 70% Complete  
> **Last Updated:** 2026-03-21

---

## 🎯 Mission
Build a production-ready inventory management system for agri-input distributors in Rwanda.

---

## ✅ Completed

### Foundation
- [x] Next.js 16 + TypeScript setup
- [x] Prisma 7 schema with PostgreSQL (Supabase)
- [x] NextAuth v5 with role-based access (ADMIN, MANAGER, ANALYST)
- [x] CSV import with chunking (handles 2,000+ rows)
- [x] Server Actions for secure mutations
- [x] Zod validation for data integrity
- [x] Basic UI with Tailwind CSS
- [x] Edge Runtime compatibility (split auth config)
- [x] Database singleton pattern (Prisma 7 adapter)

### Challenges Solved (16 total)
- [x] Prisma v7 driver adapter configuration
- [x] Edge Runtime crypto module compatibility
- [x] Database seeding in Prisma 7
- [x] File extension sensitivity (.ts vs .tsx)
- [x] NextAuth role-based access control
- [x] Schema-code naming alignment (snake_case → camelCase)
- [x] CSV "ghost row" greedy parsing
- [x] Session context in Server Actions
- [x] Zod v3.x error handling
- [x] Infinite redirect loop (middleware + layout)
- [x] Client-side context (SessionProvider)
- [x] 1MB payload limit (client-side chunking)
- [x] Prisma transaction timeout (Promise.all instead)
- [x] Navigation protection during import

---

## 🚧 Phase 1: Foundation & Core Features

### 1.1 Documentation & Setup
- [x] Create `.env.example` with all required variables
- [x] Add setup instructions to README
- [ ] Document database schema design decisions
- [ ] Add API documentation (Server Actions)

### 1.2 Code Quality & Testing
- [ ] Install Vitest + testing dependencies
- [ ] Write CSV validation tests (Zod schemas)
- [ ] Write Server Action tests (import logic)
- [ ] Add ESLint rules for best practices
- [x] Set up Prettier for consistent formatting
- [ ] Add pre-commit hooks (Husky + lint-staged)

### 1.3 Project Structure Refactoring
- [ ] Refactor `app/app/` → `app/(dashboard)/` route group
- [ ] Refactor `app/login/` → `app/(public)/login/`
- [ ] Create `app/(public)/page.tsx` (landing page)
- [ ] Organize components into feature folders
- [ ] Move shared utilities to `lib/utils/`
- [ ] Create `lib/schemas/` for Zod schemas

### 1.4 Import Feature (Polish)
- [ ] Add retry logic (3 attempts per row)
- [ ] Improve progress tracking (show row numbers)
- [ ] Add "partial success" UI (show failed rows)
- [ ] Add "download error report" button (CSV export)
- [ ] Add import history tracking (who imported when)
- [ ] Add file size validation (warn if >5MB)
- [ ] Add estimated time display

### 1.5 Dashboard
- [ ] Fix KPI cards (total products, low stock, recent imports)
- [ ] Add stock-on-hand table with sorting
- [ ] Add search/filter functionality
- [ ] Add "low stock alerts" section
- [ ] Add last import timestamp
- [ ] Add role-based dashboard views

### 1.6 Transactions Page
- [ ] Implement date range filter
- [ ] Implement movement type filter (Sale/Purchase/Adjustment)
- [ ] Implement region filter
- [ ] Add product search
- [ ] Add server-side pagination (with page count)
- [ ] Add CSV export functionality
- [ ] Add transaction details modal

---

## 🔧 Phase 2: Production Readiness

### 2.1 Error Handling & Logging
- [ ] Add error boundaries (React Error Boundary)
- [ ] Add structured logging (Winston or Pino)
- [ ] Add error tracking (Sentry integration)
- [ ] Improve Server Action error messages
- [ ] Add database query error handling
- [ ] Add network error retry logic

### 2.2 Performance Optimization
- [ ] Add database indexes (products, transactions)
- [ ] Analyze slow queries (EXPLAIN ANALYZE)
- [ ] Implement React.lazy for code splitting
- [ ] Add image optimization (if needed later)
- [ ] Add caching strategy (React Cache)
- [ ] Optimize bundle size (analyze with webpack-bundle-analyzer)

### 2.3 Security Hardening
- [ ] Add rate limiting (Upstash Redis or in-memory)
- [ ] Add CSRF protection (NextAuth handles this)
- [ ] Implement audit logs (who did what, when)
- [ ] Add session timeout configuration
- [ ] Add password strength requirements
- [ ] Add 2FA support (optional, future)

### 2.4 User Management (Admin Only)
- [ ] Create `/admin` route (ADMIN role only)
- [ ] Add user listing page
- [ ] Add "create user" form
- [ ] Add "edit user" form (change role, deactivate)
- [ ] Add "delete user" confirmation
- [ ] Add user activity logs

### 2.5 Deployment
- [ ] Deploy to Vercel (free tier)
- [ ] Set up environment variables in Vercel
- [ ] Configure Supabase connection pooling
- [ ] Add deployment checklist
- [ ] Test with production data
- [ ] Add health check endpoint (`/api/health`)
- [ ] Add database backup strategy documentation

---

## 🚀 Phase 3: Advanced Features

### 3.1 Data Export
- [ ] Add CSV export for products
- [ ] Add CSV export for transactions
- [ ] Add PDF report generation (optional)
- [ ] Add scheduled reports (email digest)

### 3.2 Multi-SKU Order Support
- [ ] Design order schema (multiple products per order)
- [ ] Create order entry UI
- [ ] Add order fulfillment tracking
- [ ] Add order history page

### 3.3 Analytics & Insights
- [ ] Add charts (Recharts or Chart.js)
  - [ ] Stock trends over time
  - [ ] Sales by region
  - [ ] Top-selling products
  - [ ] Inventory turnover rate
- [ ] Add forecasting (simple moving average)
- [ ] Add demand planning alerts

### 3.4 Supplier & Customer Management
- [ ] Add supplier table (schema update)
- [ ] Add customer table (schema update)
- [ ] Add supplier CRUD pages
- [ ] Add customer CRUD pages
- [ ] Link transactions to suppliers/customers

### 3.5 Mobile Responsiveness
- [ ] Audit mobile layout (all pages)
- [ ] Optimize tables for mobile (horizontal scroll or cards)
- [ ] Add mobile navigation menu
- [ ] Test on real mobile devices

---

## 🎨 Phase 4: UX Enhancements

### 4.1 Onboarding
- [ ] Add first-time user tour (React Joyride)
- [ ] Add sample data seeder (demo mode)
- [ ] Add contextual help tooltips
- [ ] Add video tutorials (optional)

### 4.2 Accessibility (a11y)
- [ ] Run axe-core accessibility audit
- [ ] Add proper ARIA labels
- [ ] Ensure keyboard navigation works
- [ ] Test with screen reader (NVDA/JAWS)
- [ ] Add focus indicators
- [ ] Add skip-to-content link

### 4.3 Internationalization (i18n)
- [ ] Add i18n library (next-intl)
- [ ] Add English translations
- [ ] Add French translations (Kinyarwanda optional)
- [ ] Add language switcher

---

## 🧪 Testing Strategy

### Unit Tests
- [ ] Zod schema validation (CSV rows)
- [ ] Utility functions (date formatters, price cleaners)
- [ ] Auth helper functions (role checks)

### Integration Tests
- [ ] Server Actions (import, product CRUD)
- [ ] Database queries (Prisma operations)
- [ ] API routes (if any)

### End-to-End Tests (Playwright)
- [ ] User login flow
- [ ] CSV import flow (happy path)
- [ ] CSV import flow (error handling)
- [ ] Dashboard navigation
- [ ] Transaction filtering
- [ ] User management (Admin)

### Performance Tests
- [ ] Load testing (1,000 concurrent users)
- [ ] Database query benchmarks
- [ ] CSV import with 10,000 rows

---

## 📊 Definition of "Complete"

The project is considered **production-ready** when:

✅ **Functionality**
- All Phase 1 & 2 features implemented
- No critical bugs in issue tracker
- All user flows tested (manual + automated)

✅ **Quality**
- Test coverage ≥ 70% (unit + integration)
- All E2E critical paths covered
- No high/critical accessibility issues

✅ **Performance**
- Page load time < 2 seconds (Lighthouse)
- CSV import handles 10,000 rows without timeout
- Database queries < 100ms (p95)

✅ **Security**
- OWASP Top 10 vulnerabilities addressed
- Rate limiting on all public endpoints
- Audit logs for all mutations

✅ **Documentation**
- README with setup instructions
- API documentation for Server Actions
- User guide (how to use the system)
- Deployment guide

✅ **Deployment**
- Deployed to production environment
- Environment variables secured
- Database backups configured
- Monitoring/alerting set up

---

## 🎯 Current Priority (Next 5 Tasks)

1. **Create `.env.example`** (5 min)
2. **Refactor folder structure** `app/app/` → `app/(dashboard)/` (30 min)
3. **Write first test** (CSV validation with Vitest) (20 min)
4. **Add retry logic to import** (30 min)
5. **Improve progress tracking UI** (20 min)

**Total time to next checkpoint:** ~2 hours

---

## 📝 Notes

- Keep updating this roadmap as you complete tasks
- Move completed items to "Completed" section
- Add new discoveries to "Challenges Solved"
- Celebrate small wins! 🎉

---

**Version:** 1.0  
**Maintainer:** @Zolender  
**License:** MIT