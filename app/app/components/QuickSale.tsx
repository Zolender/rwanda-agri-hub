'use client';

import { useState, useEffect } from 'react';
import { getProductPreview, recordSaleAction } from '@/app/lib/actions/inventory';
import { toast } from 'sonner';

export default function QuickSale() {
    const [sku, setSku] = useState('');
    const [product, setProduct] = useState<any>(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(false);

    // Debounced search for the product preview
    useEffect(() => {
        const search = async () => {
        if (sku.length > 3) {
            const data = await getProductPreview(sku);
            setProduct(data);
        } else {
            setProduct(null);
        }
        };
        const timer = setTimeout(search, 500);
        return () => clearTimeout(timer);
    }, [sku]);

    const handleSale = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await recordSaleAction(sku, qty, "Kigali Hub");
        if (res.success) {
        toast.success("Sale recorded!");
        setSku('');
        setQty(1);
        } else {
        toast.error(res.error);
        }
        setLoading(false);
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">New Sale</h3>
            <form onSubmit={handleSale} className="space-y-4">
                <input 
                placeholder="Enter Product ID..." 
                value={sku} 
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500"
                />

                {/* --- THE PREVIEW SECTION --- */}
                {product && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-top-2">
                    <p className="text-xs font-bold text-emerald-700 uppercase">{product.categoryId}</p>
                    <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-slate-600">Stock: **{product.quantity} {product.unitOfMeasure}**</span>
                    <span className="text-sm font-bold text-slate-800">{product.sellingPriceRwf} RWF</span>
                    </div>
                </div>
                )}

                <input 
                type="number" 
                value={qty} 
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 rounded-xl border-none"
                />

                <button disabled={loading || !product} className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium disabled:opacity-30">
                {loading ? "Processing..." : "Confirm Transaction"}
                </button>
            </form>
        </div>
    );
}