import QuickSale from "@/app/(app)/components/inventory/QuickSale";
import { History } from "lucide-react";

export default function SalePage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8 p-6">
            {/* Header Section */}
            <header className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2 text-xs font-medium text-slate-400 uppercase tracking-widest">
                <span>Inventory</span>
                <span>/</span>
                <span className="text-emerald-600">Stock Out</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Record a Sale</h1>
                <p className="text-slate-500">Search for a product SKU to deduct stock and update the ledger.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: The Main Form */}
                <div className="lg:col-span-2">
                <QuickSale />
                </div>

                {/* Right Side: Quick Info/Guidance */}
                <div className="space-y-6">
                <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg">
                    <div className="flex items-center space-x-3 mb-4">
                    <History className="text-emerald-400" size={20} />
                    <h3 className="font-semibold">Quick Tip</h3>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                    Always verify the <strong>Product Preview</strong> before confirming. 
                    If the stock is below 10 units, the system will highlight it in amber.
                    </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl">
                    <h4 className="text-emerald-800 font-bold text-sm uppercase mb-2">Inventory Health</h4>
                    <p className="text-emerald-700 text-sm">
                    Any sale recorded here will instantly 
                    reflect on the main dashboard analytics.
                    </p>
                </div>
                </div>
            </div>
        </div>
    );
}