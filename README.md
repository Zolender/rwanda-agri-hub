# Rwanda AgriHub — Inventory Management System

A production-ready web application for Rwanda mid-market agri-input distributors to manage inventory transactions, track stock levels, and control user access with full audit logging.

🔗 **Live:** [agrihub-z.vercel.app](https://agrihub-z.vercel.app)

---

## What it does

- **Dashboard** — KPI cards (total products, low stock, inventory value, last import) + sortable stock-on-hand table
- **Transactions** — Full inventory ledger with filters (date range, movement type, region, product search) + CSV export
- **CSV Import** — Chunked upload with real-time progress, row validation, error reporting, and retry logic
- **Record Sale / Receive Stock** — Quick-entry forms for ANALYST (sales) and MANAGER+ (purchases)
- **User Management** — ADMIN can create, edit roles, and delete users with full self-protection guards
- **Audit Log** — Every mutation is logged (who, what, when) — paginated, ADMIN only
- **Profile** — Every user can view their account info and change their own password
- **Rate Limiting** — Login endpoint protected with Upstash Redis (5 attempts / 15 minutes per IP)
- **Dark Mode** — Persisted via localStorage, available across the entire app

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Auth | NextAuth v5 (JWT strategy, Credentials provider) |
| Database | PostgreSQL via Supabase |
| ORM | Prisma 7 (custom output path, driver adapter) |
| Styling | Tailwind CSS + Framer Motion |
| Icons | Lucide React |
| Validation | Zod |
| Rate Limiting | Upstash Redis (`@upstash/ratelimit`) |
| Deployment | Vercel |
| Testing | Vitest |

---

## Roles (RBAC)

| Role | Access |
|---|---|
| **ADMIN** | Everything — including user management and audit log |
| **MANAGER** | Dashboard, transactions, import, receive stock |
| **ANALYST** | Dashboard, transactions (read-only), record sale, profile |

> Role is stamped into the JWT on login — no extra DB query per request. Every server action re-enforces its own role check independently of the frontend.

---

## Getting Started

### Prerequisites
- Node.js 18+
- A PostgreSQL database (Supabase recommended)
- An Upstash Redis database (free tier works)

### 1. Clone & install

```bash
git clone https://github.com/Zolender/rwanda-agri-hub.git
cd rwanda-agri-hub
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

```env
# Database — Supabase provides both URLs
DATABASE_URL="postgresql://user:password@host:6543/database?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"   # generate with: openssl rand -base64 32

# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL="https://your-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"
```

> `DATABASE_URL` uses port 6543 (Supabase connection pooler — for runtime queries).  
> `DIRECT_URL` uses port 5432 (direct connection — for migrations only).

### 3. Run migrations & generate client

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Seed the first admin user

```bash
npx tsx prisma/seed.ts
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with the seeded admin credentials.

---

## Project Structure

```
app/
├── (public)/               # Public routes (no auth required)
│   ├── page.tsx            # Landing page
│   └── login/page.tsx      # Login page (rate limited)
├── (app)/                  # Protected routes (auth required)
│   ├── layout.tsx          # Auth guard + DashboardShell
│   ├── dashboard/          # Stock overview + KPIs
│   ├── transactions/       # Inventory ledger + filters
│   ├── import/             # CSV import (MANAGER+)
│   ├── profile/            # User profile + change password
│   ├── admin/
│   │   ├── (users)/        # /admin/users — user management (ADMIN)
│   │   └── audit/          # /admin/audit — audit log (ADMIN)
│   └── components/         # Shared UI components
├── api/
│   ├── health/             # GET /api/health — DB ping
│   └── transactions/export # GET /api/transactions/export — CSV download
└── lib/
    ├── actions/            # Server actions (admin, inventory, profile, login)
    ├── utils/              # password.ts, audit.ts, ratelimit.ts
    ├── auth.ts             # NextAuth full config (Node.js runtime)
    ├── auth.config.ts      # NextAuth light config (Edge runtime / middleware)
    └── db.ts               # Prisma singleton
middleware.ts               # Route protection (Edge runtime)
prisma/
├── schema.prisma
└── seed.ts
```

---

## CSV Import Format

The import page accepts a CSV file with the following columns:

`product_id`, `category_id`, `unit_of_measure`, `unit_cost_rwf`, `selling_price_rwf`, `reorder_point_units`, `lead_time_buffer_days`, `movement_type` *(Sale / Purchase / Adjustment)*, `quantity_ordered_units`, `quantity_fulfilled_units`, `remaining_stock_units`, `order_id`, `customer_id`, `region`, `lost_sale_qty_units`, `po_id`, `supplier_id`, `transaction_date`, `landed_cost_rwf`

> Large files are handled via client-side chunking (100 rows per batch) to stay within the 1MB server action limit.

---

## Scripts

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run test         # Run Vitest tests
npx prisma studio    # Open Prisma database GUI
npx prisma generate  # Regenerate Prisma client after schema changes
```

---

## License

MIT — see [LICENSE](./LICENSE)

**Maintainer:** [@Zolender](https://github.com/Zolender)