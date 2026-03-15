import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";
const { Pool } = pkg;
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

// 1. Create the pool as usual
const pool = new Pool({ connectionString });

// 2. Cast the pool to 'any' when passing it to the adapter
// This tells TypeScript: "Trust me, I know what I'm doing."
const adapter = new PrismaPg(pool as any); 

const prisma = new PrismaClient({ adapter });

async function main() {
    const email = "analyst@agrihub.rw";
    const password = "ZenPassword123";
    
    console.log("🌱 Seeding database...");

    const hashedPassword = await bcrypt.hash(password, 10);

    const analyst = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
        email,
        name: "ZOLENDER",
        password: hashedPassword,
        role: "ANALYST",
        },
    });

    console.log(`✅ Created analyst user: ${analyst.email}`);
    }

    main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await (pool as any).end(); // Cast here too just in case
    }
);