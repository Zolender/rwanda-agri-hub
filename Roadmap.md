# Rwanda AgriHub: Development Roadmap

> **Status:** Phase 2 In Progress 🔧  
> **Last Updated:** 2026-04-01

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
- [x] Tailwind CSS + Framer Motion UI
- [x] Edge Runtime compatibility (split auth config)
- [x] Database singleton pattern (Prisma 7 driver adapter)

### Checkpoint 1 (2026-03-22)
- [x] Environment setup documentation (.env.example)
- [x] Vitest testing infrastructure
- [x] CSV validation tests (3 test cases)
- [x] Import retry logic (3 attempts with exponential backoff)
- [x] Real-time import progress tracking
- [x] Public/protected route separation
- [x] Landing page with dynamic auth state
- [x] Middleware configuration for public routes

### Checkpoint 2 (2026-03-25)
- [x] Dashboard KPI cards (total products, low stock, inventory value, last import)
- [x] Stock-on-hand table with sorting + search
- [x] Error boundaries (error.tsx)
- [x] Loading skeletons (loading.tsx)
- [x] Transactions page — basic table + pagination
- [x] Empty states for stock table

### Checkpoint 3 (2026-03-28)
- [x] ProductDetailModal — click any stock row → full detail view
- [x] Role-gated editing in modal (MANAGER/ADMIN edit, ANALYST read-only)
- [x] Admin User Management page (`/admin/users`)
- [x] createUserAction, updateUserRoleAction, deleteUserAction (with self-protection)
- [x] UsersTable — role badges, initials avatar, action buttons
- [x] CreateUserModal — bcrypt hashed password, duplicate email guard, password strength bar
- [x] EditRoleModal — live role descriptions, disabled Save when no change
- [x] DangerModal — reused for all delete confirmations
- [x] CSV export for transactions (`/api/transactions/export`)
- [x] Sale page + Receive Stock page (role-validated)
- [x] Deployed to Vercel (agrihub-z.vercel.app)

### Checkpoint 4 (2026-03-29)
- [x] Phase 1 audit confirmed 100% complete
- [x] Fixed NEXTAUTH_URL after domain rename
- [x] Established dev → main branch workflow
- [x] Audit Log model + AuditAction enum in schema.prisma
- [x] logAction() helper in lib/utils/audit.ts
- [x] Audit log wired into all admin + inventory server actions
- [x] /admin/audit page — server fetch + AuditLogTable client component
- [x] Sidebar Admin section (Users + Audit Log, ADMIN only)
- [x] Password strength requirements (checkPasswordStrength utility)
- [x] Database performance indexes (Transaction + Product models)

### Checkpoint 5 (2026-04-01)
- [x] Audit log pagination (PAGE_SIZE=20, parallel count + data queries)
- [x] User profile page (`/profile`) — account info + change password form
- [x] changePasswordAction — current password verification + bcrypt + audit log
- [x] CHANGE_PASSWORD added to AuditAction enum
- [x] Profile link in sidebar (all roles, above Sign Out)
- [x] Login rate limiting — Upstash Redis, 5 attempts / 15 min per IP
- [x] loginAction server action wrapping signIn with rate limit check
- [x] Rate limited UI — amber warning, form disabled, cooldown timer
- [x] Fixed `session.user.id` never populated (missing token.id in JWT callback)
- [x] Fixed middleware.ts location (must be at project root, not inside app/)
- [x] Fixed sidebar double-highlight on /dashboard sub-paths
- [x] Moved project out of OneDrive (node_modules + Turbopack incompatibility)

### Challenges Solved (26 total)
*(see Challenges_encountered.md for full details)*

---

## 🔧 Phase 2: Production Readiness

### 2.1 Error Handling & Logging
- [ ] Add structured logging (Pino)
- [ ] Add error tracking (Sentry integration)
- [ ] Improve Server Action error messages
- [ ] Add database query error handling

### 2.2 Performance Optimization
- [x] Add database indexes (products, transactions)
- [ ] Analyze slow queries (EXPLAIN ANALYZE)
- [ ] Implement React.lazy for code splitting
- [ ] Add caching strategy (React Cache)
- [ ] Optimize bundle size

### 2.3 Security Hardening
- [x] Rate limiting on login (Upstash Redis)
- [x] Audit logs for all mutations
- [x] Password strength requirements
- [ ] Add session timeout configuration
- [ ] Add 2FA support (optional, future)

### 2.4 User Management ✅
- [x] User CRUD (create, edit role, delete)
- [x] Self-protection guards
- [x] User profile + change own password
- [x] Audit log for all user mutations

### 2.5 Deployment ✅
- [x] Deployed to Vercel
- [x] Environment variables configured (including Upstash)
- [x] Supabase connection pooling
- [x] Health check endpoint (/api/health)
- [x] UptimeRobot monitoring
- [ ] Add deployment checklist
- [ ] Add database backup strategy documentation

---

## 🚀 Phase 3: Advanced Features

### 3.1 Data Export
- [x] CSV export for transactions
- [ ] CSV export for products
- [ ] PDF report generation (optional)
- [ ] Scheduled reports (email digest)

### 3.2 Analytics & Insights
- [ ] Charts (Recharts or Chart.js)
  - [ ] Stock trends over time
  - [ ] Sales by region
  - [ ] Top-selling products
  - [ ] Inventory turnover rate
- [ ] Simple moving average forecasting
- [ ] Demand planning alerts

### 3.3 Multi-SKU Order Support
- [ ] Design order schema (multiple products per order)
- [ ] Create order entry UI
- [ ] Add order fulfillment tracking
- [ ] Add order history page

### 3.4 Supplier & Customer Management
- [ ] Add supplier table (schema update)
- [ ] Add customer table (schema update)
- [ ] Supplier/customer CRUD pages
- [ ] Link transactions to suppliers/customers

### 3.5 Mobile Responsiveness
- [ ] Audit mobile layout (all pages)
- [ ] Optimize tables for mobile
- [ ] Test on real mobile devices

---

## 🎨 Phase 4: UX Enhancements

### 4.1 Onboarding
- [ ] First-time user tour (React Joyride)
- [ ] Sample data seeder (demo mode)
- [ ] Contextual help tooltips

### 4.2 Accessibility (a11y)
- [ ] Run axe-core accessibility audit
- [ ] Add proper ARIA labels
- [ ] Ensure keyboard navigation works
- [ ] Add focus indicators

### 4.3 Internationalization (i18n)
- [ ] Add i18n library (next-intl)
- [ ] English + French translations
- [ ] Language switcher

---

## 🧪 Testing Strategy

### Unit Tests
- [x] Zod schema validation (CSV rows)
- [ ] Utility functions (date formatters, price cleaners)
- [ ] Auth helper functions (role checks)

### Integration Tests
- [ ] Server Actions (import, product CRUD, user CRUD)
- [ ] Database queries (Prisma operations)
- [ ] API routes

### End-to-End Tests (Playwright)
- [ ] User login flow (including rate limit)
- [ ] CSV import flow (happy path + error handling)
- [ ] Dashboard navigation
- [ ] Transaction filtering + CSV export
- [ ] Product detail modal (role-gated edit)
- [ ] User management (Admin)
- [ ] Profile — change password flow

---

## 📅 Progress Log

### 2026-03-22 (Checkpoint 1)
**Focus:** Foundation & Testing Setup  
**Time Invested:** ~2-3 hours | **Tests:** 3/3 ✅ | **Deployment:** Local only

### 2026-03-25 (Checkpoint 2)
**Focus:** Dashboard Polish + Error Handling + Transactions Foundation  
**Time Invested:** ~2 hours | **Phase 1:** ~85% | **Deployment:** Local only

### 2026-03-28 (Checkpoint 3)
**Focus:** Role-Gated Modal + Admin User Management + CSV Export  
**Time Invested:** ~3 hours | **Phase 1:** ✅ 100% | **Deployment:** ✅ Live

### 2026-03-29 (Checkpoint 4)
**Focus:** Phase 1 audit + Audit Log + Password Strength + DB Indexes  
**Time Invested:** ~2 hours | **Phase 2:** 🔧 Starting | **Deployment:** ✅ Live

### 2026-04-01 (Checkpoint 5)
**Focus:** Audit log pagination + User profile + Rate limiting + Bug fixes  
**Time Invested:** ~4 hours | **Phase 2:** 🔧 In progress | **Deployment:** ✅ Live

**Key fixes this session:**
- `session.user.id` was never populated — JWT callback was missing `token.id = user.id`
- `middleware.ts` was inside `app/` folder — Next.js requires it at project root
- Turbopack stale module hashes caused by OneDrive syncing `.next/` and `node_modules/` — resolved by moving project to `C:\Projects\`
- Sidebar double-highlight on `/dashboard` sub-paths — `startsWith` check now scoped to `/admin` routes only

---

## 📝 Notes
- Keep updating this roadmap as tasks complete
- Add new discoveries to Challenges_encountered.md
- Celebrate small wins! 🎉

---

**Version:** 1.5  
**Maintainer:** [@Zolender](https://github.com/Zolender)  
**License:** MIT