"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DashboardHeaderProps = {
    lastUpdated: string;
};

export default function DashboardHeader({ lastUpdated }: DashboardHeaderProps) {
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.refresh(); // This triggers a server-side re-fetch
        
        // Reset the loading state after a short delay
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000);
    };

    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Last updated: <span className="font-medium text-slate-700">{lastUpdated}</span>
                </p>
            </div>
            
            <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-slate-300 text-slate-600 hover:cursor-pointer rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
        </div>
    );
}