# Rwanda Agri Hub — Start Here

This project is the **Rwanda Agricultural Hub Inventory Management System** (full-stack) built with:

- **Next.js** (frontend + API routes)
- **Prisma** (ORM)
- **Database**: TBD (PostgreSQL recommended; SQLite ok for prototyping)
- **Auth**: NextAuth.js (add after data import + first vertical slice)
- **Charts**: Chart.js (after data is in DB)

## How we avoid “vibe coding”
1. **Vertical slices**: ship one thin end-to-end feature at a time.
2. **Source of truth**: the CSV dataset drives the initial schema.
3. **Small commits**: one clear change per commit.
4. **Checklist-driven**: track work in `CHECKLIST.md`.

## What to build first (recommended)
**First vertical slice:** CSV import → DB → Transactions list page.

Why:
- forces the schema to be correct
- unlocks dashboards later
- proves the full stack (DB → API → UI)

## Local setup (npm)
```bash
npm install
npm run dev
```

## Decisions to lock early
- DB choice (PostgreSQL vs SQLite)
- CSV column mapping → Prisma schema
- Decimal handling (prices/costs should be DECIMAL, not float)
- Date parsing/timezone handling

## Next step
Open `docs/roadmap/01-build-order.md` and follow it in order.