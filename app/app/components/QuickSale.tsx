'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { recordSaleAction } from '@/app/lib/actions/inventory';

export default function QuickSale() {
    const [sku, setSku] = useState('');
    const [qty, setQty] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSale = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        const result = await recordSaleAction(sku, qty, "Kigali Main Hub");

        if (result.success) {
        toast.success(`Sold ${qty} units of ${sku}`);
        setSku('');
        setQty(1);
        } else {
        toast.error(result.error);
        }
        setIsProcessing(false);
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Record a Sale</h2>
        <form onSubmit={handleSale} className="space-y-4">
            <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Product SKU (ID)</label>
            <input 
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                placeholder="e.g. FERT-001"
                className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all"
                required
            />
            </div>
            
            <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Quantity to Sell</label>
            <input 
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value))}
                className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all"
                required
            />
            </div>

            <button 
            disabled={isProcessing}
            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 shadow-lg shadow-emerald-100 transition-all"
            >
            {isProcessing ? 'Updating Ledger...' : 'Confirm Sale'}
            </button>
        </form>
        </div>
    );
}