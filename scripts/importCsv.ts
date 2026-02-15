import { config } from "dotenv";
config();

import fs from "fs";
import csv from "csv-parser";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { MovementType } from "@prisma/client";

//in order for us to have clean and the right type of data in our database, let's have functions that would parse them before submission to prisma
function parseMovementType(value: string): MovementType{
    const cleaned =  value.trim().toUpperCase();
    if(cleaned === 'SALE') return MovementType.SALE
    if(cleaned === 'PURCHASE') return MovementType.PURCHASE
    return MovementType.ADJUSTMENT
}

function parseDate(value: string): Date{
    return new Date(value)
}
function parseNumber(value: string): number{
    return Number(value) || 0;
}

async function run() {
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL
    });

    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    const rows: any[] = [];

    fs.createReadStream("rwanda_agri_hub_inventory.csv")
        .pipe(csv())
        .on("data", (row) => rows.push(row))
        .on("end", async () => {
            console.log("Rows loaded:", rows.length);
            // console.log("Processing row:", rows[0]);
            const row = rows[0]

                    // 👉 Parse the data types
            const movementType = parseMovementType(row.movement_type);
            const transactionDate = parseDate(row.transaction_date);
            
            console.log("\n Upserting Product...");

            const product = await prisma.product.upsert({
                where: { productCode: row.product_id},
                update: {},
                create: {
                    productCode: row.product_id,
                    category: row. category_id,
                    unitOfMeasure: row.unit_of_measure,
                    reorderPoint: parseNumber(row.reorder_point_units),
                    leadTimeDays: parseNumber(row.lead_time_buffer_days),
                    status: "ACTIVE"
                }
            })

            console.log("Product created or found: ", product.productCode);

            console.log("Upserting Region...");
            const region = await prisma.region.upsert({
                where: {name: row.region},
                update: {},
                create: {name: row.region}
            })

            console.log("Region created or found: ", region.name);

            console.log("Upserting Supplier...");
            const supplier = await prisma.supplier.upsert({
                where: {name: row.supplier_id},
                update: {},
                create: {name: row.supplier_id}
            })

            console.log("Supplier created or found: ", supplier.name)

            console.log("Upserting Customer...");
            const customer = await prisma.customer.upsert({
                where: {code: row.customer_id},
                update: {},
                create: {code: row.customer_id}
            })

            console.log("Customer created or found: ", customer.code)


            await prisma.$disconnect();
            await pool.end();
        });
}

run();