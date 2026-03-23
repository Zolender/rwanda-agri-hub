'use client';


import { useState, useEffect} from 'react';
import Papa from 'papaparse';
import { importInventoryAction } from '@/app/lib/actions/import-inventory';
import { toast } from 'sonner';
import { resetInventoryAction } from '@/app/lib/actions/reset-inventory';
import { TriangleAlert } from 'lucide-react';



export default function ImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isResetting, setIsResetting] = useState(false);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isUploading) {
            // Standard way to trigger the browser's "Are you sure?" prompt
            e.preventDefault();
            // Most browsers require this for the prompt to actually show
            return (e.returnValue = "Import in progress. Are you sure you want to leave?");
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        
        // Cleanup: very important so the warning goes away after import finishes
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
        }, [isUploading]);


    const handleImport = async () => {
        if (!file) return;
        const confirmMessage = `You are about to import ${file.name}. This will update stock levels for many products. Do you want to proceed?`;
        if (!window.confirm(confirmMessage)) return;

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
                    const startRow = i + 1;
                    const endRow = Math.min(i+chunkSize, allData.length)

                    setProgress(Math.round((i/allData.length) * 100));
                    
                    
                    try {
                        const response = await importInventoryAction(chunk);
                        if (response && response.count !== undefined && response.count > 0) {
                            totalImported += response.count

                            //let's now handle partial success
                            if(response.errors && response.errors.length > 0){
                                console.warn("Some products failed: ", response.errors)
                                toast.warning(response.message || `${response.errors.length} products failed`);
                            }else{
                                toast.success(`Processed rows ${startRow}-${endRow}`, {duration: 2000})
                            }
                        } else {
                            // LOG 2: If the server returns an error, show it
                            console.error(`Server Error at row ${startRow}:`, response?.error);
                            toast.error(response?.error || "Import failed at a chunk.");
                            break; 
                        }
                    } catch (err) {
                        console.error("Network Fetch Error:", err);
                        toast.error("Network error during import. Please check your connecion.")
                        break;
                    }
                }

                setProgress(100);

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

    const handleReset = async ()=>{
        const confirmed = window.confirm("WARNING: This will DELETE ALL products, transactions, shipments, FX rates, and metrics.\n\nUser accounts will NOT be affected\n\n\This action CANNOT be undone.\n\nType 'DELETE' in the next propt to confirm.")
        if(!confirmed)return 
        const secondConfirm = window.prompt("Type DELETE(in all caps) to confirm:")
        if(secondConfirm !== 'DELETE'){
            toast.error("Reset cancelled. You did not type Delete correctly.")
            return
        }
        setIsResetting(true);
        try{
            const response = await resetInventoryAction();

            if(response.success){
                toast.success(response.message || "Database reset successfully")
            }else{
                toast.error(response.error || "Failed to reset database")
            }
        }catch(err: any){
            toast.error(err.message || "Network error during reset")
        }finally{
            setIsResetting(false)
        }
    }
        
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFile(e.target.files[0]);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
        <header>
            <h1 className="text-2xl font-light text-slate-800 tracking-tight">Import Inventory</h1>
            <p className="text-slate-500 text-sm">Upload your distribution CSV to sync stock levels.</p>
        </header>

            {isUploading && (
                <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 max-w-sm text-center space-y-4">
                        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
                            <h3 className="font-semibold text-slate-800">Importing Data...</h3>
                            <p className="text-sm text-slate-500">Progress: {progress}%</p>
                            <p className="text-xs text-slate-400 mt-1">Please stay on this page until complete.</p>
                    </div>
                </div>
                )}
        
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
        <div className="mt-8 border-2 border-red-200 bg-red-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2 flex items-center gap-2">
                <TriangleAlert size={22}/> Danger Zone
            </h3>
            <p className="text-sm text-red-700 mb-4">This will permanently delete all inventory data (products, transactions, shipments, FX rates, metrics). <br /> <strong>User accounts are Not affected.</strong></p>
            <button
                onClick={handleReset}
                disabled={isResetting || isUploading}
                className='px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors'
            >{isResetting? "Resetting..." : "Reset Database"}</button>
        </div>
        </div>
    );
}
