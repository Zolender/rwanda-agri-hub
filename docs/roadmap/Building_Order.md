# Build Order (Roadmap)

## Phase 1 — Understand the dataset (no coding yet)
Goal: convert the CSV into a clean domain model.

- Capture CSV header row (column names)
- Define entities (likely): Product, Supplier, Customer, Region, Transaction
- Define enums: `movementType = Purchase | Sale | Adjustment`
- Decide whether “stock level” is:
  - derived from transactions (preferred), or
  - stored as a field in the dataset

Exit criteria:
- Every CSV column maps to a field in a table (or is intentionally ignored).

---

## Phase 2 — Database + Prisma skeleton
Goal: migrations work and Prisma can access the DB.

- Pick DB (PostgreSQL recommended)
- Add `prisma/schema.prisma`
- Run first migration
- Add indexes (date, product, region, etc.)

Exit criteria:
- `npx prisma migrate dev` works
- Prisma Studio shows tables

---

## Phase 3 — CSV import
Goal: one repeatable command loads the CSV into the DB.

- Parse CSV
- Normalize strings (trim, casing)
- Parse decimals safely
- Parse dates safely
- Upsert reference tables (Region/Supplier/Customer/Product)
- Insert transactions
- Validate counts and basic totals

Exit criteria:
- Import can be rerun from scratch reliably.

---

## Phase 4 — First vertical slice UI/API: Transactions
Goal: prove end-to-end flow.

- API: `GET /api/transactions` with filters (date/region/product/movementType)
- UI: `/transactions` page with a table + filters
- Pagination + loading/empty states

Exit criteria:
- You can filter transactions and results match the DB.

---

## Phase 5 — Dashboard v0 (Chart.js)
- Revenue over time
- Revenue by region
- Top products

---

## Phase 6 — Auth + roles (NextAuth)
- Add authentication
- Add roles if needed (`admin`, `staff`, `viewer`)
- Protect pages and API routes

---

## Phase 7 — Quality
- Basic tests for importer
- CI: lint + typecheck
- Docs updates