import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/src/generated/prisma/client";
import pg from "pg"
import { PrismaPg } from "@prisma/adapter-pg";


//creating db connection
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL})

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({adapter})

export async function GET(request:NextRequest) {
    try{
        //we need now to define the filtering methods and so, upgrading this function
        const searchParams = request.nextUrl.searchParams;
        const region = searchParams.get('region')
        const movementType = searchParams.get('movementType')
        const productCode = searchParams.get('productCode')
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')

        //filter creation
        const where: any = {};

        if(region){
            where.region = { name: region}
        }
        if(movementType){
            where.movementType =  movementType
        }
        if(productCode){
            where.product = { productCode: productCode}
        }
        if(region){
            where.region = { name: region}
        }
        if(startDate || endDate){
            where.transactionDate = {}
            if(startDate) where.transactionDate.gte = new Date(startDate)
            if(endDate)where.transactionDate.lte = new Date(endDate)
        }



        const transactions = await prisma.transaction.findMany({
            where: where,
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
            filters: {region, movementType, productCode, startDate, endDate},
            data: transactions
        })
    } catch(error){
        console.error("Error fetching transactions: ", error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch transactions"
        },
        {
            status: 500
        }
    );
    }
}