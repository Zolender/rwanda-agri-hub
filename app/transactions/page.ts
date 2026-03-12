import React from 'react';

export default function TransactionsPage() {
    return (
        <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center">
        <div className="max-w-4xl w-full space-y-8">
            {/* Header Section */}
            <header className="space-y-2">
            <h1 className="text-3xl font-light text-slate-800 tracking-tight">
                Inventory Movements
            </h1>
            <p className="text-slate-500 font-normal">
                Upload your CSV to sync the Rwanda Agri-Hub records.
            </p>
            </header>

            {/* Upload Zone */}
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center space-y-4 hover:border-slate-300 transition-colors">
            <div className="bg-slate-100 p-4 rounded-full">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
            </div>
            <label className="cursor-pointer group">
                <span className="text-blue-600 font-medium group-hover:text-blue-700 underline-offset-4 underline">
                Click to upload CSV
                </span>
                <input type="file" className="hidden" accept=".csv" />
            </label>
            <p className="text-xs text-slate-400 uppercase tracking-widest">
                Accepted format: .CSV only
            </p>
            </div>
        </div>
        </div>
  );
}