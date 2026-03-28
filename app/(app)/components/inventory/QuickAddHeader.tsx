"use client";

import { PackagePlus, ShieldAlert, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDarkMode } from "../DarkModeContext";

type QuickAddHeaderProps = {
    role: string;
};

export default function QuickAddHeader({ role }: QuickAddHeaderProps) {
    const { isDark } = useDarkMode();
    const router = useRouter();

    return (
        <div className="space-y-3">
            {/* Breadcrumb / back button */}
            <button
                onClick={() => router.back()}
                className={`flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest transition-colors ${
                    isDark ? "text-stone-500 hover:text-stone-300" : "text-slate-400 hover:text-slate-600"
                }"}
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
            </button>

            {/* Title row */}
            <div className="flex items-center gap-3">
                <PackagePlus className="w-6 h-6 text-emerald-600 shrink-0" />
                <h1
                    className={`text-2xl font-black tracking-tight ${
                        isDark ? "text-stone-100" : "text-stone-900"
                    }"}
                    style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                    Receive Stock
                </h1>
            </div>

            {/* Subtitle */}
            <p className={`text-sm ml-9 ${isDark ? "text-stone-400" : "text-stone-500"}`}> 
                Record an incoming delivery or purchase for an existing product.
            </p>

            {/* Role badge */}
            <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border w-fit ${
                    isDark
                        ? "bg-emerald-950 border-emerald-900"
                        : "bg-emerald-50 border-emerald-100"
                }"}
            >
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className={`text-xs font-semibold ${isDark ? "text-emerald-400" : "text-emerald-700"}`}> 
                    {role === "ADMIN" ? "Admin" : "Manager"} access
                </span>
            </div>
        </div>
    );
}