# Challenges & Solutions: Rwanda AgriHub

This log tracks every technical hurdle encountered during development and how it was resolved. A living document — updated after every session.

---

## 1. Prisma v7 Driver Adapter Conflict

**Challenge:** After upgrading to Prisma v7, `new PrismaClient()` failed — it now requires a driver adapter argument.  
**Solution:**
- Implemented Driver Adapters using `@prisma/adapter-pg` and the `pg` library.
- Resolved "Pool type mismatch" (conflicting `@types/pg` versions) via type casting: `new PrismaPg(pool as any)`.
- Moved to a Singleton pattern in `lib/db.ts` to prevent connection exhaustion during hot-reloading.

---

## 2. The "Crypto" Module & Edge Runtime

**Challenge:** `middleware.ts` crashed with: *The edge runtime does not support Node.js 'crypto' module.*  
**Why:** Next.js Middleware runs on the Edge Runtime — no Node.js crypto, no Prisma, no bcrypt.  
**Solution:**
- Split auth config: `auth.config.ts` (light, Edge-safe) for middleware, `auth.ts` (full) for server-side.
- Switched from `bcrypt` to `bcryptjs` (pure JavaScript, runtime-agnostic).
- Set `session: { strategy: "jwt" }` for Edge compatibility.

---

## 3. Manual Database Seeding in Prisma 7

**Challenge:** Seed script couldn't find generated Prisma types or establish a DB connection.  
**Solution:**
- Used `tsx` to run TypeScript seed scripts directly.
- Manually assembled the Prisma engine: Pool → Adapter → Client.
- Added `pool.end()` in `.finally` to prevent the process from hanging.

---

## 4. File Extension Sensitivity (.ts vs .tsx)

**Challenge:** React components showed cryptic syntax errors — `<main>` treated as a "less than" operator.  
**Solution:** All files containing JSX use `.tsx`. Pure logic/utility files use `.ts`.

---

## 5. NextAuth Role-Based Access (RBAC)

**Challenge:** Needed role-based permissions without a DB query on every page load.  
**Solution:**
- Added `UserRole` enum to `schema.prisma`.
- Used the `jwt` callback in `auth.ts` to stamp `role` onto the token at login.
- Used the `session` callback to expose `role` on `session.user`.

---

## 6. Schema Mapping Discrepancy

**Challenge:** `Object literal may only specify known properties` Prisma errors.  
**Why:** Frontend used generic names (`sku`, `price`) while schema used business names (`id`, `unitCostRwf`).  
**Solution:** Rewrote Zod schemas and Prisma upsert logic to strictly match `schema.prisma` naming.

---

## 7. The "Ghost Row" & Greedy CSV Parsing

**Challenge:** Import crashed with *"expected string, received undefined"* — even though the CSV looked correct.  
**Discovery:** CSV parsers read trailing newlines as empty rows.  
**Solution:**
- Added `skipEmptyLines: 'greedy'` to Papaparse config.
- Added `.filter()` to strip rows missing a required `id` field before processing.

---

## 8. The "Silent Bouncer" — Lost Session Context

**Challenge:** Even when logged in, server actions returned *"Security Fail: No Session"*.  
**Solution:**
- Hard reset: Logout → Restart dev server → Login again to refresh the JWT.
- Strengthened `auth()` checks inside all actions to return clean error messages instead of crashing.

---

## 9. Zod v3.x Error Handling

**Challenge:** `Property 'errors' does not exist on type 'ZodError'`.  
**Solution:** Use `.issues` (modern Zod standard) instead of `.errors`. Example: `error.issues[0].message`.

---

## 10. Schema-Code Naming Alignment

**Challenge:** Data wasn't saving — frontend used `sku`/`price`, database schema used `id`/`unitCostRwf`.  
**Solution:** Renamed all Zod schema keys and Prisma upsert keys to exactly match `schema.prisma`.

---

## 11. The "Too Many Redirects" Loop

**Challenge:** Browser reported *"The page redirected you too many times"* on dashboard access.  
**Why:** Conflict between middleware and layout auth guard — each was redirecting the other's target.  
**Solution:**
- Refined the middleware matcher to exclude static assets and auth API routes.
- Ensured `SessionProvider` wrapped the root layout so auth state was consistent everywhere.

---

## 12. Client-Side Context (useSession Hurdle)

**Challenge:** `[next-auth]: useSession must be wrapped in a <SessionProvider />`.  
**Why:** `SidebarNav` became a Client Component but was rendered inside a Server Layout with no context.  
**Solution:** Created a `Providers.tsx` Client Component wrapping `{children}` in the root layout.

---

## 13. The "Mega-Dataset" 1MB Body Limit

**Challenge:** Importing 2,000+ row CSVs triggered `413 Payload Too Large`.  
**Why:** Next.js Server Actions default to a 1MB limit to prevent DoS attacks.  
**Solution:** Implemented client-side chunking — the frontend slices data into 100-row batches before sending.

---

## 14. Prisma Transaction Timeout

**Challenge:** `Transaction API error: A rollback cannot be executed on an expired transaction`.  
**Why:** Prisma's default interactive transaction timeout is 5 seconds. 100 upserts took longer.  
**Solution:** Replaced `$transaction` with `Promise.all()` for parallel processing without a global timeout.

---

## 15. Snake_case vs camelCase CSV Mapping

**Challenge:** Import finished with "0 records" — CSV used `product_id`/`unit_cost_rwf`, schema used `id`/`unitCostRwf`.  
**Solution:** Updated the Zod `RowSchema` to act as a translation layer — captures snake_case from CSV, maps to camelCase for Prisma.

---

## 16. Navigation Protection During Import

**Challenge:** Navigating away mid-import left the database partially updated.  
**Solution:**
- Added `beforeunload` event listener (active only while `isUploading` is true).
- Added a confirmation dialog before import starts.
- Added a full-screen overlay with progress percentage to prevent in-app navigation.

---

## 17. Schema Evolution — Missing Required Fields

**Challenge:** After making `quantityOrderedUnits` required in schema, imports failed with cryptic errors.  
**Why:** `recordSaleAction` was written for the old optional schema.  
**Solution:** Updated the action to include the field. Ran `npx prisma generate` to sync the client.  
**Key rule:** After every schema change → `prisma migrate dev` + `prisma generate`. Always.

---

## 18. Error Boundary Implementation (Next.js 15)

**Challenge:** Needed graceful error handling without white screens.  
**Solution:** Created `error.tsx` in route groups. Next.js 15 automatically wraps routes in error boundaries.

---

## 19. Loading States with Skeletons

**Challenge:** Tables showed blank screens while data loaded.  
**Solution:** Created `loading.tsx` with animated skeleton screens. `loading.tsx` automatically wraps async Server Components in Suspense.

---

## 20. Next.js 15 Async searchParams

**Challenge:** Filters weren't working — `searchParams` returned `undefined`.  
**Why:** Next.js 15 made `searchParams` async for Partial Prerendering support.  
**Solution:** Changed type to `Promise<SearchParams>` and added `await searchParams`.

---

## 21. `"use server"` Files Only Allow Async Exports

**Challenge:** *"Server action functions must be async"* — thrown on `checkPasswordStrength`, a sync utility inside a `"use server"` file.  
**Why:** The `"use server"` directive applies to every export in the file.  
**Solution:** Moved `checkPasswordStrength` to `app/lib/utils/password.ts` — a plain utility file with no directive. Imported from both server actions and client components.  
**Key rule:** `"use server"` files = async server actions only. Pure utilities → `lib/utils/`.

---

## 22. Stale Prisma Client After Schema Migration

**Challenge:** After adding `AuditLog` model, app threw `TypeError: Cannot read properties of undefined (reading 'findMany')` on `prisma.auditLog`.  
**Why:** `prisma migrate dev` creates the table but doesn't always regenerate the TypeScript client — especially with a custom `output` path.  
**Solution:** Always run `npx prisma generate` manually after migrations.  
**Key rule:** Schema change → `prisma migrate dev` + `prisma generate`. When in doubt, generate.

---

## 23. Server Component Dark Mode (The Split Component Pattern)

**Challenge:** A server component page (`/admin/audit`) ignored dark mode — `useDarkMode()` reads from React Context which doesn't exist on the server.  
**Solution:** Split into two files:
- `page.tsx` — server component: auth check + DB fetch, passes data as props.
- `AuditLogTable.tsx` — client component: receives props, calls `useDarkMode()`, renders UI.  
**Key rule:** Server components fetch data. Client components handle interactivity and browser APIs.

---

## 24. `session.user.id` Always Undefined

**Challenge:** `/profile` always redirected to `/login` even when the user was logged in.  
**Why:** The `jwt` callback in `auth.ts` was stamping `token.role` but never `token.id`. The `session` callback was never setting `session.user.id` from the token.  
**Result:** Every server action and page checking `session.user.id` received `undefined`.  
**Solution:** Added two lines to `auth.ts`:
```typescript
// jwt callback
token.id = user.id;

// session callback
session.user.id = token.id as string;
```
**Key rule:** After adding any field to the JWT, also explicitly map it in the session callback. They are separate objects — one doesn't automatically populate the other.  
**Side effect fixed:** `changePasswordAction`, `deleteUserAction`, and `updateUserRoleAction` were also silently operating with `undefined` user IDs. All now work correctly.

---

## 25. Turbopack Stale Module Hash (OneDrive Conflict)

**Challenge:** `Cannot find module '@prisma/client-2c3a283f134fdcb6/runtime/client'` — Turbopack appending a hash suffix to the `@prisma/client` package name, making it unresolvable. Error persisted across `node_modules` deletions and reinstalls.  
**Why:** The project was located inside `C:\Users\Eben\OneDrive\Desktop\Projects\`. OneDrive syncs files in real time — including `.next/` build artifacts and `node_modules/`. While Turbopack was writing build chunks, OneDrive was simultaneously locking those same files, corrupting module hash references. A full machine restart was needed to kill Turbopack's background processes.  
**Solution:**
1. Moved project from OneDrive to `C:\Projects\rwanda-agri-hub` (outside OneDrive sync scope).
2. Restarted the computer — Turbopack background processes hold stale hashes in memory even after `rm -rf .next`.
3. Ran clean `npm install` + `npx prisma generate` + `npm run dev` from the new path.  
**Key rule:** Never keep a Node.js project inside OneDrive, Google Drive, or any real-time sync folder. `node_modules/` and `.next/` must be excluded from cloud sync.

---

## 26. `middleware.ts` Wrong Location

**Challenge:** All protected routes redirected to `/login` even for authenticated users. Moving `middleware.ts` to the project root didn't immediately fix it.  
**Why:** `middleware.ts` was originally located at `app/middleware.ts`. Next.js only recognises middleware at the **project root** (same level as `package.json`). When inside `app/`, the file is completely ignored — no auth logic runs, so every protected route falls through to the default redirect.  
**Secondary cause:** After moving the file to root, the import path needed updating from `"./lib/auth.config"` to `"./app/lib/auth.config"` since the file is now one level up.  
**Solution:**
1. Deleted `app/middleware.ts`.
2. Created `middleware.ts` at project root with corrected import path.  
**Key rule:** `middleware.ts` must live at the project root, never inside `app/` or any subdirectory.