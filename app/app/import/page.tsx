'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { importInventoryAction } from '@/app/lib/actions/import-inventory';
import { toast } from 'sonner';



export default function ImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleImport = async () => {
    if (!file) return;
    setIsUploading(true);

    Papa.parse(file, {
        header: true,
        skipEmptyLines: 'greedy',
        transformHeader: h => h.trim(),
        complete: async (results) => {
            const allData = results.data as any[];
            
            // LOG 1: Check if PapaParse actually found rows
            console.log("Total rows found by PapaParse:", allData.length);
            console.log("First row sample:", allData[0]);

            if (allData.length === 0) {
                toast.error("The CSV file appears to be empty.");
                setIsUploading(false);
                return;
            }

            const chunkSize = 100;
            let totalImported = 0;

            for (let i = 0; i < allData.length; i += chunkSize) {
                const chunk = allData.slice(i, i + chunkSize);
                
                try {
                    const response = await importInventoryAction(chunk);
                    
                    if (response && response.success) {
                        totalImported += (response.count ?? 0);
                    } else {
                        // LOG 2: If the server returns an error, show it
                        console.error(`Server Error at row ${i}:`, response?.error);
                        toast.error(response?.error || "Import failed at a chunk.");
                        break; 
                    }
                } catch (err) {
                    console.error("Network Fetch Error:", err);
                    break;
                }
            }

            if (totalImported > 0) {
                toast.success(`Mission Accomplished! ${totalImported} items imported.`);
                setFile(null);
            } else {
                toast.error("Import finished but 0 records were saved. Check the console.");
            }
            
            setIsUploading(false);
        },
    });
};

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFile(e.target.files[0]);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
        <header>
            <h1 className="text-2xl font-light text-slate-800 tracking-tight">Import Inventory</h1>
            <p className="text-slate-500 text-sm">Upload your distribution CSV to sync stock levels.</p>
        </header>

        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center space-y-4 hover:border-emerald-300 transition-colors">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
            </svg>
            </div>
            
            <div className="text-center">
            <label className="cursor-pointer">
                <span className="text-emerald-600 font-medium hover:underline">Click to upload</span>
                <input type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                <span className="text-slate-400 text-sm block mt-1">or drag and drop your CSV file here</span>
            </label>
            </div>

            {file && (
            <div className="mt-4 p-3 bg-slate-50 rounded-xl flex items-center space-x-3">
                <span className="text-sm text-slate-600 font-medium">{file.name}</span>
                <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-500">×</button>
            </div>
            )}
        </div>

        <button
            onClick={handleImport}
            disabled={!file || isUploading}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-medium hover:bg-slate-800 disabled:opacity-50 transition-all"
        >
            {isUploading ? 'Processing Data...' : 'Start Import'}
        </button>
        </div>
    );
}
