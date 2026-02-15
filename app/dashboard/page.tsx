"use client"
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";


interface Transaction {
    id: number;
    transactionDate: string;
    movementType: string;
    quantityOrdered: number;
    quantityFulfilled: number;
    sellingPriceRwf: number;
    product: {
        productCode: string;
        category: string;
    }
    region: {name: string}
    supplier: {name: string}
    customer: {code: string}
}

interface ApiResponse {
    success: boolean;
    count: number;
    data: Transaction[];
}

export default function Dashboard() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        region: '',
        movementType: ''
    });



    const headerRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const filtersRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLTableElement>(null);

    //now fetching transactions with filters
    useEffect(() => {
        fetchTransactions();
    }, [filters]);

    //gsap animations
    useEffect(() => {
        if(!loading){
            const tl = gsap.timeline();

            tl.from(headerRef.current, {
                y: -50,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            })
            .from(statsRef.current?.children || [], {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.15,
                ease: "power2.out",
            }, "-=0.4")
            .from(filtersRef.current, {
                y: 20,
                opacity: 0,
                duration: 0.5, 
                ease: "power2.out"
            }, "-=0.3")
            .from(tableRef.current, {
                y: 30,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.2")
        }
    }, [loading])



    const fetchTransactions = async () => {
        setLoading(true);
        try{
            const params = new URLSearchParams();
            if(filters.region) params.append('region', filters.region);
            if(filters.movementType) params.append('movementType', filters.movementType)
            
            const response = await fetch(`/api/transactions?${params.toString()}`)
            const data: ApiResponse = await response.json()

            if(data.success){
                setTransactions(data.data);
            }

        }catch(error){
            console.error("Error fetching transactions:", error);
        }finally{
            setLoading(false);
        }
    }

    const stats = {
        total: transactions.length,
        sales: transactions.filter((t)=> t.movementType === "SALE").length,
        purchases: transactions. filter((t)=> t.movementType === 'PURCHASE').length,
        revenue: transactions.filter(t=> t.movementType === 'SALE').reduce((sum, t)=> sum+t.quantityFulfilled * t.sellingPriceRwf, 0)
    }

    if(loading){
        return(
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to bg-slate-100">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 text-lg">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div ref={headerRef} className="text-center sm:text-left">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-2">
                        Rwanda Agri Hub
                    </h1>
                    <p className="text-slate-600 text-sm sm:text-base">
                        Inventory Managment Dashboard
                    </p>
                </div>
                <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500">
                        <p className="text-slate-600 text-sm font-medium mb-1">Total Transactions</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500">
                        <p className="text-slate-600 text-sm font-medium mb-1">Sales</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.sales}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500">
                        <p className="text-slate-600 text-sm font-medium mb-1">Revenues (RWF)</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.revenue.toLocaleString()}</p>
                    </div>
                </div>

                <div ref={filtersRef} className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Filters</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Region
                            </label>
                            <select 
                            className="w-full px-4 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition"
                            value={filters.region}
                            onChange={(e)=> setFilters({...filters, region: e.target.value})}
                            >
                                <option value="">All Regions</option>
                                <option value="Musanze">Musanze</option>
                                <option value="Huye">Huye</option>
                                <option value="Kigali">Kigali</option>
                                <option value="Rubavu">Rubavu</option>
                                <option value="Nyagatare">Nyagatare</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Movement Type</label>
                            <select
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition"
                                value={filters.movementType}
                                onChange={(e)=> setFilters({...filters, movementType: e.target.value})}
                            >
                                <option value="">All types</option>
                                <option value="SALE">Sale</option>
                                <option value="PURCHASE">Purchase</option>
                                <option value="ADJUSTMENT">Adjustment</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-1 flex items-end">
                            <button
                                className="w-full px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
                                onChange={()=> setFilters({region: '', movementType: ""})}
                                >
                                    Clear Filters
                                </button>
                        </div>
                    </div>
                </div>

                
            </div>
        </div>
    )
}