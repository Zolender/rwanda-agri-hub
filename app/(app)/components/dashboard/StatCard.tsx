import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export default function StatCard({ title, value, icon: Icon, description, trend }: StatCardProps) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
            <Icon size={24} />
            </div>
            {trend && (
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                trend.isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
                {trend.isPositive ? '+' : '-'}{trend.value}%
            </span>
            )}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
            {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
        </div>
        </div>
    );
}