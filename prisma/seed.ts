import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";
const { Pool } = pkg;
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";

dotenv.config();

// Assembly of the Prisma 7 Engine
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@agrihub.rw";
  const password = "ZenPassword123"; // Use this to log in later
  
  console.log("🌱 Seeding database...");

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Eben-Ezer",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`✅ Created Admin user: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // Properly close the connection
  });