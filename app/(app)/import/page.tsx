'use client';

import { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import { importInventoryAction } from '@/app/lib/actions/import-inventory';
import { toast } from 'sonner';
import { resetInventoryAction } from '@/app/lib/actions/reset-inventory';
import { TriangleAlert, Download, AlertCircle, CheckCircle, Upload, FileText, Trash2, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

type ImportError = {
    productId: string;
    error: string;
    rowNumber?: number;
}

export default function ImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [displayProgress, setDisplayProgress] = useState(0);
    const [isResetting, setIsResetting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const [importResults, setImportResults] = useState<{
        totalProcessed: number;
        successCount: number;
        errorCount: number;
        errors: ImportError[];
    } | null>(null);

    // Smooth progress animation
    useEffect(() => {
        if (displayProgress < progress) {
            const timer = setTimeout(() => {
                setDisplayProgress(prev => {
                    const diff = progress - prev;
                    const increment = Math.max(1, Math.ceil(diff / 10));
                    return Math.min(prev + increment, progress);
                });
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [progress, displayProgress]);

    // Prevent navigation during upload
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isUploading) {
                e.preventDefault();
                return (e.returnValue = "Import in progress. Are you sure you want to leave?");
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isUploading]);

    const handleImport = async () => {
        if (!file) return;
        
        setIsUploading(true);
        setProgress(0);
        setDisplayProgress(0);
        setImportResults(null);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: 'greedy',
            transformHeader: h => h.trim(),
            complete: async (results) => {
                const allData = results.data as any[];

                if (allData.length === 0) {
                    toast.error("The CSV file appears to be empty.");
                    setIsUploading(false);
                    return;
                }

                const chunkSize = 100;
                let totalImported = 0;
                const allErrors: ImportError[] = [];

                for (let i = 0; i < allData.length; i += chunkSize) {
                    const chunk = allData.slice(i, i + chunkSize);
                    const startRow = i + 1;
                    const endRow = Math.min(i + chunkSize, allData.length);

                    setProgress(Math.round((i / allData.length) * 100));

                    try {
                        const response = await importInventoryAction(chunk);
                        if (response && response.count !== undefined && response.count > 0) {
                            totalImported += response.count;

                            if (response.errors && response.errors.length > 0) {
                                const errorsWithRowNumbers = response.errors.map((err, index) => ({
                                    ...err,
                                    rowNumber: startRow + index
                                }));
                                allErrors.push(...errorsWithRowNumbers);
                                toast.warning(response.message || `${response.errors.length} products failed`);
                            } else {
                                toast.success(`Processed rows ${startRow}-${endRow}`, { duration: 2000 });
                            }
                        } else {
                            toast.error(response?.error || "Import failed at a chunk.");
                            break;
                        }
                    } catch (err) {
                        toast.error("Network error during import. Please check your connection.");
                        break;
                    }
                }

                setProgress(100);
                setImportResults({
                    totalProcessed: allData.length,
                    successCount: totalImported,
                    errorCount: allErrors.length,
                    errors: allErrors
                });

                if (totalImported > 0) {
                    // Success confetti!
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                    toast.success(`Mission Accomplished! ${totalImported} items imported.`);
                    setFile(null);
                } else {
                    toast.error("Import finished but 0 records were saved. Check the console.");
                }

                setIsUploading(false);
            },
        });
    };

    const handleReset = async () => {
        const confirmed = window.confirm("WARNING: This will DELETE ALL products, transactions, shipments, FX rates, and metrics.\n\nUser accounts will NOT be affected\n\nThis action CANNOT be undone.\n\nType 'DELETE' in the next prompt to confirm.");
        if (!confirmed) return;
        
        const secondConfirm = window.prompt("Type DELETE (in all caps) to confirm:");
        if (secondConfirm !== 'DELETE') {
            toast.error("Reset cancelled. You did not type DELETE correctly.");
            return;
        }
        
        setIsResetting(true);
        try {
            const response = await resetInventoryAction();

            if (response.success) {
                toast.success(response.message || "Database reset successfully");
            } else {
                toast.error(response.error || "Failed to reset database");
            }
        } catch (err: any) {
            toast.error(err.message || "Network error during reset");
        } finally {
            setIsResetting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFile = e.target.files[0];
            const maxSize = 5 * 1024 * 1024;

            if (selectedFile.size > maxSize) {
                const sizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
                toast.warning(`File size is ${sizeMB}MB. Large files may take longer to process.`, { duration: 4000 });
            }
            setFile(selectedFile);
        }
    };

    // Drag and Drop handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.name.endsWith('.csv')) {
            setFile(droppedFile);
        } else {
            toast.error("Please upload a CSV file");
        }
    }, []);

    const downloadErrorReport = () => {
        if (!importResults || importResults.errors.length === 0) return;
        
        const headers = ["Row Number", "Product ID", "Error"];
        const rows = importResults.errors.map(err => [
            err.rowNumber || "Unknown",
            err.productId,
            err.error
        ]);
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.setAttribute("href", url);
        link.setAttribute("download", `import-errors-${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Error report downloaded!");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-black text-stone-900 tracking-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                    Import Inventory
                </h1>
                <p className="text-stone-500 text-sm mt-2">
                    Upload your distribution CSV to sync stock levels across the system.
                </p>
            </motion.header>

            {/* Upload Progress Modal */}
            <AnimatePresence>
                {isUploading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white p-8 rounded-2xl shadow-2xl border border-stone-200 max-w-md w-full mx-4"
                        >
                            <div className="space-y-6">
                                {/* Animated Upload Icon */}
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto"
                                >
                                    <Upload className="w-8 h-8 text-white" />
                                </motion.div>

                                <div className="text-center">
                                    <h3 className="font-bold text-xl text-stone-900 mb-2">Importing Data...</h3>
                                    <p className="text-sm text-stone-500">Please stay on this page until complete</p>
                                </div>

                                {/* Enhanced Progress Bar */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-semibold text-stone-700">{displayProgress}%</span>
                                        <span className="text-stone-500">Processing...</span>
                                    </div>
                                    <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${displayProgress}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Import Results */}
            <AnimatePresence>
                {importResults && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white border border-stone-200 rounded-2xl p-6 space-y-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h2 className="text-xl font-bold text-stone-900">Import Results</h2>
                            </div>
                            {importResults.errorCount > 0 && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={downloadErrorReport}
                                    className="flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors font-medium text-sm"
                                >
                                    <Download className="w-4 h-4" />
                                    Download Error Report
                                </motion.button>
                            )}
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="bg-stone-50 rounded-xl p-5 border border-stone-200"
                            >
                                <div className="text-stone-500 text-sm font-medium mb-1">Total Processed</div>
                                <div className="text-3xl font-black text-stone-900">
                                    {importResults.totalProcessed}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="bg-emerald-50 rounded-xl p-5 border border-emerald-200"
                            >
                                <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium mb-1">
                                    <CheckCircle className="w-4 h-4" />
                                    Successful
                                </div>
                                <div className="text-3xl font-black text-emerald-700">
                                    {importResults.successCount}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="bg-rose-50 rounded-xl p-5 border border-rose-200"
                            >
                                <div className="flex items-center gap-2 text-rose-700 text-sm font-medium mb-1">
                                    <AlertCircle className="w-4 h-4" />
                                    Failed
                                </div>
                                <div className="text-3xl font-black text-rose-700">
                                    {importResults.errorCount}
                                </div>
                            </motion.div>
                        </div>

                        {/* Error Details Table */}
                        {importResults.errors.length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold text-stone-700 mb-3 uppercase tracking-wide">
                                    Failed Records ({importResults.errors.length})
                                </h3>
                                <div className="border border-stone-200 rounded-xl overflow-hidden max-h-96 overflow-y-auto">
                                    <table className="w-full">
                                        <thead className="bg-stone-50 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-stone-700 uppercase tracking-wider">Row</th>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-stone-700 uppercase tracking-wider">Product ID</th>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-stone-700 uppercase tracking-wider">Error</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-stone-100">
                                            {importResults.errors.map((err, idx) => (
                                                <tr key={idx} className="hover:bg-stone-50 transition-colors">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-900">
                                                        {err.rowNumber || 'N/A'}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono font-medium text-stone-900">
                                                        {err.productId}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-rose-600">
                                                        {err.error}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* File Upload Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`bg-white border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center space-y-6 transition-all ${
                    isDragging
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-stone-300 hover:border-emerald-400'
                }`}
            >
                <motion.div
                    animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                        isDragging ? 'bg-emerald-500' : 'bg-emerald-50'
                    }`}
                >
                    <FileText className={`w-10 h-10 ${isDragging ? 'text-white' : 'text-emerald-600'}`} strokeWidth={1.5} />
                </motion.div>

                <div className="text-center">
                    <label className="cursor-pointer">
                        <span className="text-emerald-600 font-semibold text-lg hover:underline">
                            Click to upload
                        </span>
                        <input
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />
                        <span className="text-stone-500 text-sm block mt-2">
                            or drag and drop your CSV file here
                        </span>
                    </label>
                </div>

                {file && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl"
                    >
                        <FileText className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm text-stone-700 font-medium">{file.name}</span>
                        <button
                            onClick={() => setFile(null)}
                            className="ml-2 text-stone-400 hover:text-rose-500 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </motion.div>

            {/* Import Button */}
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: file && !isUploading ? 1.02 : 1 }}
                whileTap={{ scale: file && !isUploading ? 0.98 : 1 }}
                onClick={handleImport}
                disabled={!file || isUploading}
                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
                {isUploading ? (
                    <>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Processing Data...
                    </>
                ) : (
                    <>
                        <Upload className="w-5 h-5" />
                        Start Import
                    </>
                )}
            </motion.button>

            {/* Danger Zone */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="border-2 border-rose-200 bg-rose-50 rounded-xl p-6"
            >
                <h3 className="text-lg font-bold text-rose-900 mb-2 flex items-center gap-2">
                    <TriangleAlert className="w-5 h-5" />
                    Danger Zone
                </h3>
                <p className="text-sm text-rose-700 mb-4">
                    This will permanently delete all inventory data (products, transactions, shipments, FX rates, metrics).
                    <br />
                    <strong>User accounts are NOT affected.</strong>
                </p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    disabled={isResetting || isUploading}
                    className="px-6 py-2.5 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 disabled:bg-rose-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                    {isResetting ? (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            />
                            Resetting...
                        </>
                    ) : (
                        <>
                            <Trash2 className="w-4 h-4" />
                            Reset Database
                        </>
                    )}
                </motion.button>
            </motion.div>
        </div>
    );
}