# Rwanda Agri-Hub: Development Roadmap

> **Status:** Phase 1 Complete ✅ → Phase 2 In Progress 🔧  
> **Last Updated:** 2026-03-29

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

### Recent Additions (2026-03-22)
- [x] Environment setup documentation (.env.example)
- [x] Comprehensive development roadmap (ROADMAP.md)
- [x] Testing infrastructure (Vitest)
- [x] CSV validation tests (3 test cases)
- [x] Import retry logic (3 attempts with exponential backoff)
- [x] Improved progress tracking (real-time updates)
- [x] Public/protected route separation
- [x] Landing page with dynamic auth state
- [x] Middleware configuration for public routes

### Recent Additions (2026-03-25)
- [x] Last import timestamp on dashboard
- [x] Error boundaries (error.tsx)
- [x] Loading skeletons (loading.tsx)
- [x] Transactions page foundation (basic table + pagination)
- [x] Empty states for stock table
- [x] Dashboard header as client component

### Recent Additions (2026-03-28)
- [x] Transaction / stock row detail modal (ProductDetailModal) with role-gated editing
- [x] StockOnHandTable wired with click-to-open modal + userRole prop
- [x] updateProductAction used from modal (MANAGER/ADMIN only, ANALYST read-only)
- [x] Admin User Management page (`/admin/users`)
- [x] Server actions for user CRUD: createUserAction, updateUserRoleAction, deleteUserAction
- [x] UsersTable with role badges, initials avatar, self-protection on action buttons
- [x] CreateUserModal — bcrypt hashed password, duplicate email guard
- [x] EditRoleModal — live role description, disabled Save when no change
- [x] DangerModal reused for delete confirmation
- [x] AdminPageHeader component (client, dark-mode aware, consistent with app style)
- [x] Clean URL via `(users)` route group (`/admin/users` not `/admin/users/users`)
- [x] CSV export for transactions (`/api/transactions/export`) — filter-aware, auth-checked, 10k row limit
- [x] FiltersBar Export CSV button wired to API route
- [x] Sale page + SalePageHeader + SalePageSidebar (dark mode)
- [x] QuickAdd (Receive Stock) page + QuickAddHeader with role validation
- [x] Auth checks hardened on sale and purchase server actions
- [x] Deployed to Vercel production (agrihub-z.vercel.app)

### Challenges Solved (18 total)
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
- [x] Server vs client component boundary for dark mode (AdminPageHeader pattern)
- [x] Self-protection guards in admin actions (can't delete/demote own account)
- [x] `emailVerified` not populated for Credentials users — column removed, noted for future OAuth
- [x] `useTransition` for server action calls without blocking UI (spinner pattern)
- [x] NEXTAUTH_URL env var mismatch after domain rename — fixed in Vercel

---

## 🚧 Phase 1: Foundation & Core Features

### 1.1 Documentation & Setup
- [x] Create `.env.example` with all required variables
- [x] Add setup instructions to README
- [ ] Document database schema design decisions
- [ ] Add API documentation (Server Actions)

### 1.2 Code Quality & Testing
- [x] Install Vitest + testing dependencies
- [x] Write CSV validation tests (Zod schemas)
- [ ] Write Server Action tests (import logic)
- [ ] Add ESLint rules for best practices
- [x] Set up Prettier for consistent formatting
- [ ] Add pre-commit hooks (Husky + lint-staged)

### 1.3 Project Structure Refactoring
- [x] Refactor `app/app/` → `app/(app)/` route group
- [x] Refactor `app/login/` → `app/(public)/login/`
- [x] Create `app/(public)/page.tsx` (landing page)
- [x] Organize components into feature folders (`dashboard/`, `admin/`, `transactions/`, `import/`)
- [x] Move shared utilities to `lib/utils/`
- [x] Create `lib/schemas/` for Zod schemas

### 1.4 Import Feature (Polish)
- [x] Add retry logic (3 attempts per row)
- [x] Improve progress tracking (show row numbers)
- [x] Add "partial success" UI (show failed rows)
- [x] Add "download error report" button (CSV export)
- [x] Add import history tracking (who imported when)
- [x] Add file size validation (warn if >5MB)

### 1.5 Dashboard
- [x] Fix KPI cards (total products, low stock, recent imports)
- [x] Add stock-on-hand table with sorting
- [x] Add search/filter functionality
- [x] Add "low stock alerts" section
- [x] Add last import timestamp
- [x] Add role-based dashboard views (ProductDetailModal gates Edit to MANAGER/ADMIN)

### 1.6 Transactions Page
- [x] Basic page structure + table
- [x] Server-side pagination
- [x] Implement date range filter
- [x] Implement movement type filter
- [x] Implement region filter
- [x] Add product search
- [x] Transaction row detail modal (ProductDetailModal, role-gated)
- [x] Add CSV export functionality (`/api/transactions/export` route)

---

## 🔧 Phase 2: Production Readiness

### 2.1 Error Handling & Logging
- [ ] Add structured logging (Pino)
- [ ] Add error tracking (Sentry integration)
- [ ] Improve Server Action error messages
- [ ] Add database query error handling
- [ ] Add network error retry logic

### 2.2 Performance Optimization
- [ ] Add database indexes (products, transactions)
- [ ] Analyze slow queries (EXPLAIN ANALYZE)
- [ ] Implement React.lazy for code splitting
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
- [x] Create `/admin/users` route (ADMIN role only)
- [x] Add user listing page with role badges
- [x] Add "create user" form (name, email, password, role)
- [x] Add "edit user role" modal (promote/demote between roles)
- [x] Add "delete user" confirmation (DangerModal reused)
- [ ] Add user activity logs

### 2.5 Deployment
- [x] Deploy to Vercel (free tier)
- [x] Set up environment variables in Vercel
- [x] Configure Supabase connection pooling
- [ ] Add deployment checklist
- [ ] Test with production data
- [ ] Add health check endpoint (`/api/health`)
- [ ] Add database backup strategy documentation

---

## 🚀 Phase 3: Advanced Features

### 3.1 Data Export
- [x] Add CSV export for transactions
- [ ] Add CSV export for products
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
- [x] Zod schema validation (CSV rows)
- [ ] Utility functions (date formatters, price cleaners)
- [ ] Auth helper functions (role checks)

### Integration Tests
- [ ] Server Actions (import, product CRUD, user CRUD)
- [ ] Database queries (Prisma operations)
- [ ] API routes

### End-to-End Tests (Playwright)
- [ ] User login flow
- [ ] CSV import flow (happy path)
- [ ] CSV import flow (error handling)
- [ ] Dashboard navigation
- [ ] Transaction filtering
- [ ] Product detail modal (role-gated edit)
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

## 📅 Progress Log

### 2026-03-22 (Checkpoint 1)
**Focus:** Foundation & Testing Setup

**Completed:**
- ✅ Created `.env.example` for environment setup
- ✅ Added comprehensive `ROADMAP.md`
- ✅ Set up Vitest testing infrastructure
- ✅ Wrote 3 CSV validation tests (all passing)
- ✅ Implemented retry logic for import (3 attempts, exponential backoff)
- ✅ Improved progress tracking with real-time updates
- ✅ Refactored to `app/(app)` route group structure
- ✅ Created landing page with auth-aware UI
- ✅ Configured middleware for public/protected routes

**Time Invested:** ~2-3 hours  
**Tests Passing:** 3/3 ✅  
**Build Status:** ✅ Working  
**Deployment Status:** Local dev only

### 2026-03-25 (Checkpoint 2)
**Focus:** Dashboard Polish + Error Handling + Transactions Foundation

**Completed:**
- ✅ Fixed dashboard KPI calculations (low stock, inventory value)
- ✅ Built Stock-on-Hand table with search and sorting
- ✅ Added last import timestamp with refresh button
- ✅ Implemented error boundaries (error.tsx)
- ✅ Added loading skeletons (loading.tsx)
- ✅ Created transactions page with basic table + pagination
- ✅ Added empty states for better UX

**Time Invested:** ~2 hours  
**Phase 1 Progress:** ~85% complete  
**Build Status:** ✅ Working  
**Deployment Status:** Local dev only

### 2026-03-28 (Checkpoint 3)
**Focus:** Role-Gated Detail Modal (Task 3) + Admin User Management (Task 4)

**Completed:**
- ✅ `ProductDetailModal` — click any stock row → modal with full product details
- ✅ Role-gated editing in modal: MANAGER/ADMIN see edit form, ANALYST sees read-only
- ✅ `StockOnHandTable` updated — click handler, `userRole` prop, modal mounted inside
- ✅ `app/lib/actions/admin.ts` — `createUserAction`, `updateUserRoleAction`, `deleteUserAction` with self-protection guards
- ✅ `app/(app)/admin/(users)/page.tsx` — server component, ADMIN-only guard, clean URL via route group
- ✅ `UsersTable` — role badges (colour-coded), initials avatar, action buttons disabled on own row
- ✅ `CreateUserModal` — bcrypt hashing, P2002 duplicate email guard, auto-close on success
- ✅ `EditRoleModal` — seeds current role on open, live role descriptions, Save disabled if no change
- ✅ `AdminPageHeader` — client component, dark-mode aware, consistent typography with rest of app
- ✅ `DangerModal` reused as-is for delete confirmation

**Key patterns learned:**
- `useTransition` + server actions for non-blocking UI with spinner
- `null` state as open/closed signal for modals (vs separate boolean)
- Server components compose client ones — never the reverse
- `requireAdmin()` shared guard to keep server actions DRY
- `emailVerified` not set for Credentials-based auth — skip until OAuth is added

**Time Invested:** ~3 hours  
**Phase 1 Progress:** ✅ 100% complete  
**Phase 2 Progress:** 2.4 User Management ✅ complete  
**Build Status:** ✅ Working  
**Deployment Status:** ✅ Live on Vercel (agrihub-z.vercel.app)

### 2026-03-29 (Checkpoint 4)
**Focus:** Phase 1 audit + Phase 2 kickoff

**Completed:**
- ✅ Confirmed Phase 1 is 100% complete 
- ✅ Confirmed deployment is live and stable
- ✅ Fixed NEXTAUTH_URL after domain rename to agrihub-z.vercel.app
- ✅ Updated Roadmap to reflect true project state
- ✅ Established dev branch workflow (dev → main = dev → production)

**Key patterns learned:**
- `NEXTAUTH_URL` controls where `signOut()` redirects — must match deployed domain
- Supabase pooler URL (port 6543) vs direct URL (port 5432) — same host, different ports, both needed
- `dev` branch for active development, `main` = production

**Time Invested:** ~1 hour  
**Phase 1 Progress:** ✅ 100% complete  
**Phase 2 Progress:** 🔧 Starting  
**Build Status:** ✅ Working  
**Deployment Status:** ✅ Live on Vercel (agrihub-z.vercel.app)

## 📝 Notes

- Keep updating this roadmap as tasks complete
- Move completed items to "Completed" section
- Add new discoveries to "Challenges Solved"
- Celebrate small wins!

---

**Version:** 1.4  
**Maintainer:** @Zolender  
**License:** MIT