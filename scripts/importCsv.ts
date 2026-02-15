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

            console.log("Product Id: ", row.product_id)
            console.log("Movement type: ", row.movement_type)
            console.log("Transaction date: ", row.transaction_date)

                    // 👉 Parse the data types
            const movementType = parseMovementType(row.movement_type);
            const transactionDate = parseDate(row.transaction_date);
            const quantityOrdered = parseNumber(row.quantity_ordered_units);
            
            console.log("\n✅ Parsed values:");
            console.log("Movement Type (enum):", movementType);
            console.log("Transaction Date (Date):", transactionDate);
            console.log("Quantity Ordered (number):", quantityOrdered);

            await prisma.$disconnect();
            await pool.end();
        });
}

run();