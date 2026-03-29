import { NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET() {
    // We'll collect the results of each check here
    const checks: Record<string, string> = {};
    let overallStatus: 'ok' | 'error' = 'ok';

    // --- Database check ---
    // We run the simplest possible query: SELECT 1
    // It touches the DB connection without reading any real data
    // If it throws, the DB is down or unreachable
    try {
        await prisma.$queryRaw`SELECT 1`;
        checks.database = 'ok';
    } catch (err) {
        checks.database = 'error';
        overallStatus = 'error';
    }

    // Build the response body
    const body = {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        checks,
    };

    // If everything is fine → 200 OK
    // If anything failed   → 503 Service Unavailable
    return NextResponse.json(body, {
        status: overallStatus === 'ok' ? 200 : 503,
    });
}