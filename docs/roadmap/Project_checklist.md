# Project Checklist (tick as you go)

## Phase 0 — Repo hygiene
- [ ] Confirm `dev` branch is the working branch
- [ ] Add `docs/roadmap/*`
- [ ] Add `.env.example`

## Phase 1 — Data understanding
- [ ] Paste CSV header row into docs/issue
- [ ] Identify required vs optional columns
- [ ] Define entities (Product/Supplier/Customer/Region/Transaction)
- [ ] Define enums (`movementType`, and `category` if present)
- [ ] Decide unique keys (e.g., `productCode` like `HUB-NPK-799`)

## Phase 2 — Prisma + DB
- [ ] Choose DB (PostgreSQL or SQLite)
- [ ] Create `.env` with `DATABASE_URL`
- [ ] Install Prisma + client
- [ ] Create `prisma/schema.prisma`
- [ ] Run first migration
- [ ] Open Prisma Studio and verify schema

## Phase 3 — CSV import
- [ ] Add CSV parser dependency
- [ ] Create importer script that reads `rwanda_agri_hub_inventory.csv`
- [ ] Upsert reference tables
- [ ] Insert transaction rows
- [ ] Validate counts match CSV
- [ ] Add `npm run import:csv`

## Phase 4 — First vertical slice: Transactions
- [ ] API endpoint `GET /api/transactions` with filters
- [ ] `/transactions` page with table + filters
- [ ] Pagination + sorting (date desc default)
- [ ] Loading/empty/error states

## Phase 5 — Dashboard v0
- [ ] `/dashboard` page
- [ ] Revenue over time chart
- [ ] Revenue by region chart
- [ ] Validate aggregates

## Phase 6 — Auth
- [ ] Add NextAuth
- [ ] Add roles (optional)
- [ ] Protect pages + API routes

## Phase 7 — Polish
- [ ] CI (lint + typecheck)
- [ ] Minimal tests for importer
- [ ] Improve onboarding docs