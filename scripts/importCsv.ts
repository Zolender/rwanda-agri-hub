import { config } from "dotenv";
config();

import fs from "fs";
import csv from "csv-parser";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

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
            console.log("Processing row:", rows[0]);
            await prisma.$disconnect();
            await pool.end();
        });
}

run();