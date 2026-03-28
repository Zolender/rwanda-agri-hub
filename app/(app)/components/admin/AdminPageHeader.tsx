"use client";

import { ShieldCheck } from "lucide-react";
import { useDarkMode } from "@/app/(app)/components/DarkModeContext";

type AdminPageHeaderProps = {
    title: string;
    description: string;
};

export default function AdminPageHeader({ title, description }: AdminPageHeaderProps) {
    const { isDark } = useDarkMode();

    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                {/* Icon badge */}
                <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/20">
                    <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1
                        className={`text-2xl font-black tracking-tight ${isDark ? "text-stone-100" : "text-stone-900"}`}
                        style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                    >
                        {title}
                    </h1>
                    <p className={`text-sm mt-0.5 ${isDark ? "text-stone-400" : "text-stone-500"}`}>
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}