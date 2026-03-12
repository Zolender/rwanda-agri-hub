# Rwanda Agri Hub — Inventory Orchestration (Web App)

A web application for Rwanda mid-market agri-input distributors to record, import, and analyze **inventory transactions** (Sales, Purchases, Adjustments) and track **stock-on-hand** over time.

> Current scope (for now): **Frontend + Backend only**  
> Out of scope (for now): ML/AI recommendation engine

---

## 1) Problem Context (Why this exists)

Agri-input distributors in Rwanda face frequent stock issues due to:
- long and variable import lead times (corridor/port/border delays),
- seasonality (Season A / Season B),
- pricing volatility (cost changes, landed cost changes).

Many SMEs rely on manual reorder points and spreadsheets. This project starts by building a **reliable system of record** for inventory movements and stock levels.

---

## 2) What this app will do (v1)

### Core features
- Import inventory transaction data from a CSV file
- Store transactions in a database (PostgreSQL)
- Provide dashboards and tables for:
  - Stock on hand (latest stock per product)
  - Transaction history filtered by product / region / time / movement type
  - Lost sales tracking (stockouts)

### Users (Authentication)
- Multiple users can log in.
- Roles (initial plan):
  - **Admin**: manage users, import data
  - **Manager**: view dashboards and transactions
  - **Analyst**: view/export reports (optional)

---

## 3) Tech Stack (planned)

This repository is TypeScript-first.

- Frontend: **Next.js (TypeScript)** + React
- Backend: **Next.js Route Handlers** (API inside the same app)
- Database: **PostgreSQL**
- ORM: **Prisma**
- Validation: **Zod**
- UI: (TBD) Tailwind CSS and later on GSAP for animation
- Testing: (later) Playwright + Vitest

---

## 4) Data Contract (CSV format)

### 4.1 CSV header (expected columns)

The CSV must include the following columns:

- `product_id`
- `category_id`
- `unit_of_measure`
- `unit_cost_rwf`
- `selling_price_rwf`
- `reorder_point_units`
- `lead_time_buffer_days`
- `movement_type` — allowed: `Sale`, `Purchase`, `Adjustment`
- `quantity_ordered_units`
- `quantity_fulfilled_units`
- `remaining_stock_units`
- `order_id`
- `customer_id`
- `region`
- `lost_sale_qty_units`
- `po_id`
- `supplier_id`
- `transaction_date`
- `landed_cost_rwf`

> Note: `product_status` is intentionally **not** part of the v1 model, because it is redundant (it was always “available” or “sold” in the source CSV).  
> If the CSV includes it, we may ignore it during import.

### 4.2 Key definitions (important)

#### Inventory transaction (row)
Each row represents a single **inventory movement event** at a specific time.

#### `movement_type`
- `Sale`: inventory decreases due to customer demand
- `Purchase`: inventory increases due to restocking
- `Adjustment`: inventory changes due to corrections, losses, breakage, etc.

#### `remaining_stock_units`
**This is the stock level AFTER the transaction**.

Example:
- If `movement_type = Sale` and `quantity_fulfilled_units = 31`
- and `remaining_stock_units = 2607`
- then stock before sale was `2638`.

#### `quantity_ordered_units` vs `quantity_fulfilled_units`
- `quantity_ordered_units`: what was requested by the market/customer (demand)
- `quantity_fulfilled_units`: what was actually delivered (supply fulfilled)

#### `lost_sale_qty_units`
A stockout indicator. Usually:
`lost_sale_qty_units = quantity_ordered_units - quantity_fulfilled_units` (when positive).

#### `order_id`
Currently unique per row due to the way the CSV was generated.
Future improvement: support orders containing multiple SKUs.

#### `po_id` / `supplier_id` on sales
In this dataset, `po_id` and `supplier_id` may appear even on sale rows (likely as batch/procurement lineage). The app will store them as provided.

#### `transaction_date` timezone
Unless otherwise specified, `transaction_date` values are interpreted as **Rwanda time (UTC+2)**.

---

## 5) Data Quality Rules (import validation)

On CSV import, we will validate:
- `movement_type` is one of: `Sale`, `Purchase`, `Adjustment`
- numeric columns parse correctly (RWF costs/prices, quantities)
- `transaction_date` parses correctly and is stored as a timestamp
- `remaining_stock_units >= 0`
- for `Sale`:
  - `quantity_fulfilled_units <= quantity_ordered_units` (when ordered exists)
  - `lost_sale_qty_units >= 0`

Invalid rows should be reported back to the user with clear error messages.

---

## 6) Roadmap (step-by-step)

### Phase 1 — System of Record
- Database schema
- CSV import API
- Transactions table view + filters
- Stock-on-hand dashboard

### Phase 2 — Operational UX
- User authentication + roles
- Audit logs (who imported what, when)
- Basic exports (CSV download)

### Phase 3 — Enhancements (non-AI)
- Multi-SKU orders (true order + order line items)
- Better supplier/customer views
- Charts and trends

---

## 7) Project Glossary (quick definitions)

- **SKU (`product_id`)**: a unique code for a product.
- **Inventory ledger**: a chronological log of inventory movements.
- **Normalize (database)**: store data in separate tables to reduce duplication.
- **Data contract**: agreed meaning of each column and its rules.

---

## 8) Next steps

1) Implement Prisma schema + migrations
2) Implement `/api/import/csv`
3) Implement the initial dashboard pages
