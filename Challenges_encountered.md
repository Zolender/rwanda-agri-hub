# Challenges & Solutions: Rwanda Agri-Hub

This log tracks the technical hurdles encountered during the development of the Rwanda Agri-Hub project and how they were resolved.

## 1. Prisma v7 Driver Adapter Conflict

* Challenge: After upgrading to Prisma v7, the standard PrismaClient initialization failed. TypeScript threw errors stating new PrismaClient() expected 1 argument (the adapter) and refused to accept the pg Pool due to a type mismatch.
* Solution:
	+ Implemented Driver Adapters using @prisma/adapter-pg and the pg library.
	+ Resolved the "Pool type mismatch" (caused by conflicting @types/pg versions) by using type casting: const adapter = new PrismaPg(pool as any).
	+ Moved to a Singleton pattern in lib/db.ts to prevent database connection exhaustion during Next.js hot-reloading.

## 2. The "Crypto" Module & Edge Runtime

* Challenge: When adding middleware.ts for route protection, the app crashed with the error: The edge runtime does not support Node.js 'crypto' module.
* Why it happened: Next.js Middleware runs on the "Edge Runtime" (a slimmed-down environment), while libraries like bcrypt and prisma require the full Node.js environment.
* Solution:
	+ Split the Auth Config: Created a "light" auth.config.ts for the Middleware and a "heavy" auth.ts for the server-side logic.
	+ Switched to bcryptjs: Replaced the native bcrypt with bcryptjs, which is written in pure JavaScript and more compatible with various runtimes.
	+ Session Strategy: Switched to strategy: "jwt" in the Auth config to ensure compatibility across the Edge.

## 3. Manual Database Seeding in Prisma 7

* Challenge: Running a seed script to create the first Admin user was failing because the script couldn't find the generated Prisma types or the database connection.
* Solution:
	+ Created prisma/seed.ts using tsx to handle TypeScript execution.
	+ Manually assembled the Prisma engine inside the script (Connection Pool -> Adapter -> Client).
	+ Added pool.end() in the .finally block to prevent the script from "hanging" after completion.

## 4. File Extension Sensitivity (.ts vs .tsx)

* Challenge: React components (like the Transactions page) showed cryptic syntax errors where HTML tags (e.g., <main>) were treated as "less than" operators.
* Solution:
	+ Ensured all files containing JSX/React components use the .tsx extension, while pure logic/utility files use .ts.

## 5. NextAuth (Auth.js) Role-Based Access (RBAC)

* Challenge: Needed a way to differentiate between Admin, Manager, and Analyst without querying the database on every single page load.
* Solution:
	+ Updated schema.prisma with a UserRole Enum.
	+ Used the Session Callback in auth.ts to "stamp" the user's role onto the session cookie. This allows the UI to instantly know the user's permissions.

## 6. Schema Mapping Discrepancy

* Challenge: Encountered Object literal may only specify known properties errors in Prisma.
* Why: The frontend code was using generic field names (sku, price) while the schema.prisma was using specific business names (id, unitCostRwf).
* Solution: Rewrote the Zod validation schema and Prisma upsert logic to strictly match the database model naming conventions.

## 7. The "Ghost Row" & Greedy Parsing

* Challenge: The CSV import kept crashing with a "Validation failed: expected string, received undefined" error, even though the data looked correct in the file.
* Discovery: * CSV parsers often read the trailing "Enter" (newline) at the end of a file as a new, empty row.
* Solution:
	+ Implemented skipEmptyLines: 'greedy' in the Papaparse configuration to ignore whitespace-only rows.
	+ Added a .filter() method in the Server Action to manually strip out rows missing an id before processing.

## 8. The "Silent Bouncer" (Session Context)

* Challenge: Even when logged in, the Server Action was returning "Security Fail: No Session," preventing the import.
* Why it happened: In Next.js, Server Actions sometimes lose the session context if the "handshake" between the browser cookie and the server is stale or if the auth import is misconfigured.
* Solution:
	+ Performed a "Hard Reset" (Logout -> Restart Server -> Login) to refresh the JWT.
	+ Strengthened the auth() check inside the action to return a clean error message instead of crashing the process.

## 9. Zod v3.x Error Handling

* Challenge: TypeScript error: Property 'errors' does not exist on type 'ZodError'.
* Solution: Updated the catch block to use .issues (the modern Zod standard) instead of .errors.
* Example: error.issues[0].message.

## 10. Schema-Code Naming Alignment

* Challenge: Data was not saving because the frontend used sku and price while the database schema used id and unitCostRwf.
* Solution: Renamed all Zod schema keys and Prisma upsert keys to strictly match the schema.prisma file.
