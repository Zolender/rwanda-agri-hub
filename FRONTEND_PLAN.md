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
- `/unauthorized` — Friendly "no access" page

### Protected (signed-in)
- `/dashboard` — Overview page
  - KPI cards + stock-on-hand summary. Click any row → ProductDetailModal.
- `/transactions` — Inventory ledger viewer
  - Filterable table. Click any row → ProductDetailModal (role-gated edit).

### Role-protected
- `/import` — CSV Import (MANAGER + ADMIN)
  - Upload CSV, validate, ingest, show errors.
- `/admin/users` — User management (ADMIN only)
  - Create, edit role, delete users. Clean URL via `(users)` route group.

---

## 2) Roles (RBAC)

RBAC = Role-Based Access Control (role determines permissions).

### Roles
- **ADMIN**
  - Access: all pages
  - Can: import CSV, manage users/roles, edit product details, view everything
- **MANAGER**
  - Access: dashboard, transactions, import, receive stock
  - Can: import CSV, edit product details (via modal), record purchases, view everything
- **ANALYST**
  - Access: dashboard, transactions
  - Can: view-only (read-only modal, no import, no admin, can record sales)

### Enforcement principle (important)
- Frontend: hide links/buttons based on role
- Backend: **always** re-enforce in Server Actions — frontend checks are UX only, never security

---

## 3) Core UI Components (and responsibilities)

### Layout / Navigation ✅
- `DashboardShell` — wraps all protected pages, owns dark mode state + sidebar
- `SidebarNav` — role-aware links (ANALYST sees fewer items)
- Mobile responsive: slide-in sidebar + top bar

### Dashboard components ✅
- `StatCard` — reusable KPI card (total products, low stock, inventory value, last import)
- `StockOnHandTable` — sortable, searchable, click-to-open modal, receives `userRole` prop
- `DashboardHeader` — title + refresh button (client component)
- `ProductDetailModal` — detail view + role-gated edit form using `updateProductAction`

### Transactions components ✅
- `FiltersBar` — date range, movement type, region, product search (URL-based state)
- `TransactionsTable` — server-side pagination, empty/loading states

### Import components ✅
- `FileUploader` — drag-and-drop + click, progress tracking, retry logic
- `ImportResultPanel` — processed/imported/failed summary + error rows

### Admin components ✅
- `AdminPageHeader` — page title + icon, dark-mode aware client component
- `UsersTable` — lists all users, role badges, initials avatar, Edit/Delete actions
- `CreateUserModal` — name, email, password, role form; bcrypt on server
- `EditRoleModal` — role dropdown with live descriptions, seeds current value on open
- `DangerModal` — reused generic confirmation modal (type "DELETE" to confirm)

---

## 4) Data Strategy (Server Components + Server Actions)

### Reads (data fetching) ✅
Server Components fetch all initial data:
- `/dashboard` — KPIs + stock summary
- `/transactions` — paginated transactions via URL query params
- `/admin/users` — all users (no passwords, select only needed fields)

### Interactivity ✅
Client Components handle:
- Modal open/close state (`null` = closed, a value = open — avoids separate boolean)
- Filter state pushed into URL (shareable, back/forward works)
- `useTransition` for server action calls — keeps UI responsive, shows spinner

### Writes (mutations) ✅
Server Actions in `app/lib/actions/`:
- `inventory.ts` — `updateProductAction`, `recordSaleAction`, `recordPurchaseAction`
- `admin.ts` — `createUserAction`, `updateUserRoleAction`, `deleteUserAction`
- All actions re-check session role before mutating — never trust the client
- `revalidatePath()` called after mutations so server components re-fetch automatically

### Validation ✅
- Zod for CSV parsing
- Manual guards in server actions (role check, required fields, self-protection)

---

## 5) Auth Strategy (NextAuth.js / Auth.js) ✅

- NextAuth v5 with PrismaAdapter + JWT strategy
- `role` attached to JWT token on login, available in all server components via `auth()`
- Middleware gates "must be signed-in" broadly
- Individual pages + actions re-check specific role requirements
- `emailVerified` not populated for Credentials users — noted for future OAuth addition

---

## 6) Styling and UI ✅

- Tailwind CSS — stone/emerald colour palette throughout
- Lucide React icons
- Framer Motion — modals (spring animation), mobile sidebar slide
- `DarkModeContext` — localStorage-persisted, provided by `DashboardShell`, consumed via `useDarkMode()`

Conventions:
- All modals: backdrop blur + spring scale-in animation + `e.stopPropagation()` on panel
- Role badges: rose = ADMIN, amber = MANAGER, sky = ANALYST
- `cursor-pointer` on all clickable table rows
- Self-affecting actions always disabled (can't edit/delete own account)

---

## 7) Actual folder layout

```
app/
├── (app)/
│   ├── layout.tsx                        # Auth guard + DashboardShell
│   ├── admin/
│   │   └── (users)/
│   │       └── page.tsx                  # /admin/users — ADMIN only
│   ├── dashboard/
│   │   └── page.tsx
│   ├── transactions/
│   │   └── page.tsx
│   ├── import/
│   │   └── page.tsx
│   └── components/
│       ├── DashboardShell.tsx
│       ├── DarkModeContext.tsx
│       ├── DangerModal.tsx
│       ├── SideBarNav.tsx
│       ├── provider.tsx
│       ├── admin/
│       │   ├── AdminPageHeader.tsx
│       │   ├── UsersTable.tsx
│       │   ├── CreateUserModal.tsx
│       │   └── EditRoleModal.tsx
│       ├── dashboard/
│       │   ├── DashboardHeader.tsx
│       │   ├── DashboardShell.tsx
│       │   ├── ProductDetailModal.tsx
│       │   └── StockOnHandTable.tsx
│       ├── transactions/
│       └── import/
├── lib/
│   ├── actions/
│   │   ├── admin.ts
│   │   ├── inventory.ts
│   │   ├── import-inventory.ts
│   │   └── reset-inventory.ts
│   ├── auth.ts
│   ├── auth.config.ts
│   └── db.ts
```

---

## 8) Minimum acceptance criteria (v1) ✅ ALL COMPLETE

### Dashboard ✅
- loads for signed-in users
- shows ≥ 3 KPIs
- shows stock-on-hand table
- click row → detail modal (role-gated edit)

### Transactions ✅
- filter by date range, movement_type, region
- server-side pagination
- click row → detail modal

### Import (MANAGER/ADMIN) ✅
- accepts CSV upload
- validates rows and reports errors
- ANALYST cannot access

### Admin (ADMIN only) ✅
- list all users with role badges
- create new user (with hashed password)
- edit user role (promote/demote)
- delete user (DangerModal confirmation)
- self-protection on all actions

---

## 9) Build order — completed ✅

1. ✅ App router structure + layouts
2. ✅ NextAuth setup + session + role in JWT
3. ✅ Role-aware navigation in sidebar
4. ✅ Dashboard with real data + KPI cards
5. ✅ Transactions page with URL filters + pagination
6. ✅ Import page with chunked upload + retry logic
7. ✅ Product detail modal (role-gated editing)
8. ✅ Admin user management (full CRUD)