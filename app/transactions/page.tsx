import React from 'react';
import prisma from '@/lib/db'; // Note: Use the path to your lib/db.ts

export default async function TransactionsPage() {
  // This is a "Server Component"
  // It runs on the server, talks to the DB, and then sends HTML to the browser
  let productCount = 0;
  let dbStatus = "Connected";

  try {
    productCount = await prisma.product.count();
  } catch (error) {
    console.error("Database connection failed:", error);
    dbStatus = "Connection Failed";
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-8">
        <header className="flex justify-between items-end">
          <div className="space-y-2">
            <h1 className="text-3xl font-light text-slate-800 tracking-tight">
              Inventory Movements
            </h1>
            <p className="text-slate-500">
              Upload your CSV to sync records.
            </p>
          </div>
          <div className={`text-xs px-2 py-1 rounded-full ${dbStatus === 'Connected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            DB: {dbStatus} ({productCount} products)
          </div>
        </header>

        {/* Upload Zone */}
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center space-y-4 hover:border-slate-300 transition-colors">
           {/* ... existing upload UI code ... */}
           <p className="text-slate-400 text-sm">Select a file to begin</p>
        </div>
      </div>
    </main>
  );
}