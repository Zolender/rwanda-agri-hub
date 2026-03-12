# Frontend Structure Plan: Rwanda Agri-Hub (Modernized)

This plan describes the frontend architecture for a Next.js + TypeScript app that:
- authenticates multiple users,
- enforces roles (RBAC),
- imports inventory transactions from CSV,
- displays dashboards and a transaction ledger.

> Out of scope (for now): AI/ML suggestions, forecasting, hedging signals.

---

## 1) Routes (Next.js App Router)

### Public
- `/` — Landing page (Public)
  - Purpose: brief overview + login link.
- `/login` — Authentication page (NextAuth)
  - Purpose: sign in; redirect to `/dashboard`.
- `/unauthorized` — Friendly “no access” page

### Protected (signed-in)
- `/dashboard` — Overview page
  - KPI cards + stock-on-hand summary.
- `/transactions` — Inventory ledger viewer
  - Filterable table for movement history.

### Role-protected
- `/import` — CSV Import (Admin + Manager)
  - Upload CSV, validate, ingest, show errors.
- `/admin` — User & role management (Admin only)
  - Manage users and roles (can be phased in).

**Why `/import` separate from `/transactions`?**
- Import is a workflow (upload → validate → results/errors).
- Transactions is read-heavy analytics (filters, pagination).
- Keeping them separate reduces complexity and makes permissions clearer.

---

## 2) Roles (RBAC)

RBAC = Role-Based Access Control (role determines permissions).

### Roles
- **Admin**
  - Access: all pages
  - Can: import CSV, manage users/roles, view everything
- **Manager**
  - Access: dashboard, transactions, import
  - Can: import CSV, view everything (no user admin)
- **Analyst**
  - Access: dashboard, transactions
  - Can: view-only (no import, no admin)

### Enforcement principle (important)
- Frontend: hide links/buttons + show `/unauthorized`
- Backend: always enforce roles again in Server Actions / API routes

(Frontend-only checks are never enough.)

---

## 3) Core UI Components (and responsibilities)

### Layout / Navigation
- `AppShell`
  - wraps all protected pages
  - contains `SidebarNav` + `TopBar`
- `SidebarNav`
  - renders links based on role:
    - Dashboard, Transactions for all signed-in users
    - Import for Admin/Manager
    - Admin for Admin only
- `TopBar`
  - user dropdown (name/role) + logout

**Why:** consistent navigation and role-aware menus prevent confusion.

### Dashboard components
- `StatCard`
  - reusable KPI card
  - examples: total products, low stock products, last import time
- `StockOnHandTable` (or `DataTable` configured)
  - shows latest stock per product

**Why:** dashboard should answer “what’s going on?” quickly.

### Transactions components
- `FiltersBar`
  - date range
  - movement_type (Sale/Purchase/Adjustment)
  - region
  - product_id search (later)
- `DataTable`
  - server-side pagination friendly
  - consistent loading/empty/error UI

**Why:** filtering and reviewing the ledger is the core user loop.

### Import components
- `FileUploader`
  - drag-and-drop + click upload
  - shows selected file + size
- `ImportResultPanel`
  - summary: processed/imported/failed
  - errors table: row number + message + field

**Why:** CSV import is where most “user frustration” happens; good UX is critical.

---

## 4) Data Strategy (Server Components + Server Actions)

### Reads (data fetching)
Use **Server Components** to fetch initial data:
- `/dashboard`: KPIs + stock summary
- `/transactions`: initial page of transactions using query params

**Why:**
- Prisma access stays server-only
- Fast initial load, less client JavaScript
- Easier to secure

### Interactivity (filters/pagination)
Use Client Components for:
- updating filters
- controlling table UI
- pushing filters into URL query parameters

Approach:
- store filters in the URL (e.g. `?from=...&to=...&type=Sale&region=Musanze`)
- server component reads params and returns correct dataset

**Why:**
- shareable links
- back/forward navigation works
- minimal global state

### Writes (mutations)
Use **Server Actions** for:
- CSV import submission
- user role updates (Admin page)
- profile changes (optional)

**Why:** keeps write logic secure and close to the server.

### Validation
Use **Zod** schemas shared across:
- CSV parsing/validation
- server action inputs
- form validation

**Why:** one source of truth for data shape and error messages.

---

## 5) Auth Strategy (NextAuth.js / Auth.js)

### Auth implementation
- NextAuth.js with Prisma Adapter
- Session-based authentication

### Route protection
- Middleware can enforce “must be signed in”.
- Role checks should be enforced:
  - in server components (before fetching data)
  - in server actions (before writing data)

**Why:** middleware is good for broad gating; server checks prevent bypassing.

---

## 6) Styling and UI
- Tailwind CSS for fast iteration + consistent design
- Lucide React for icons

Conventions:
- consistent spacing and typography
- consistent table density
- consistent empty/loading/error states

---

## 7) Suggested folder layout (practical)

- `src/app/`
  - `(public)/`
    - `page.tsx` (landing)
    - `login/page.tsx`
    - `unauthorized/page.tsx`
  - `(app)/`
    - `layout.tsx` (AppShell)
    - `dashboard/page.tsx`
    - `transactions/page.tsx`
    - `import/page.tsx`
    - `admin/page.tsx`
- `src/components/`
  - `AppShell.tsx`
  - `SidebarNav.tsx`
  - `TopBar.tsx`
  - `StatCard.tsx`
  - `DataTable.tsx`
  - `FiltersBar.tsx`
  - `FileUploader.tsx`
  - `ImportResultPanel.tsx`
- `src/features/`
  - `auth/roles.ts` (role helpers)
  - `transactions/types.ts`
  - `transactions/columns.ts`
- `src/lib/`
  - `api/` (optional if using route handlers too)
  - `schemas/` (Zod schemas)
  - `dates.ts` (UTC+2 parsing helpers)
  - `formatters.ts`

---

## 8) Minimum acceptance criteria (v1)

### Dashboard
- loads for signed-in users
- shows ≥ 3 KPIs
- shows stock-on-hand table

### Transactions
- filter by date range, movement_type, region
- server-side pagination (or simple limit/offset)

### Import (Admin/Manager)
- accepts CSV upload
- validates rows and reports errors (row number + message)
- Analyst cannot access

### Admin (optional v1)
- list users
- update role
- non-admin blocked

---

## 9) Next build order (frontend-first)

1) App router structure + layouts
2) NextAuth setup + session display
3) Role-aware navigation in sidebar
4) Dashboard with mock data
5) Transactions page with mock data + URL filters
6) Import page UI with mock upload + mock results
7) Connect to backend (server actions + Prisma) when backend is ready