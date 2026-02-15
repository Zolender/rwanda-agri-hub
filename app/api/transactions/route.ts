import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/src/generated/prisma/client";
import pg from "pg"
import { PrismaPg } from "@prisma/adapter-pg";


//creating db connection
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL})

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({adapter})

export async function GET(params:NextRequest) {
    try{
        //it first try fetching with related data
        const transactions = await prisma.transaction.findMany({
            take: 20,
            orderBy: { transactionDate: 'desc'},
            include: {
                product: true,
                region: true,
                supplier: true,
                customer: true
            }
        })

        return NextResponse.json({
            success: true,
            count: transactions.length,
            data: transactions
        })
    }
}