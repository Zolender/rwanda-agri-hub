import { config } from "dotenv";
config();

import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

async function test() {
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL
    });

    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    console.log("📊 Database Summary:\n");

    const productCount = await prisma.product.count();
    const regionCount = await prisma.region.count();
    const supplierCount = await prisma.supplier.count();
    const customerCount = await prisma.customer.count();
    const transactionCount = await prisma.transaction.count();

    console.log(`Products: ${productCount}`);
    console.log(`Regions: ${regionCount}`);
    console.log(`Suppliers: ${supplierCount}`);
    console.log(`Customers: ${customerCount}`);
    console.log(`Transactions: ${transactionCount}`);

    console.log("\n Sample Products:");
    const products = await prisma.product.findMany({ take: 3 });
    products.forEach(p => console.log(`  - ${p.productCode} (${p.category})`));

    console.log("\n Recent Transactions:");
    const transactions = await prisma.transaction.findMany({
        take: 3,
        orderBy: { transactionDate: 'desc' },
        include: {
            product: true,
            region: true
        }
    });
    
    transactions.forEach(t => {
        console.log(`  - ${t.product.productCode} in ${t.region.name} (${t.movementType})`);
    });

    await prisma.$disconnect();
    await pool.end();
}

test();