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
                
            </div>
        </div>
    )
}