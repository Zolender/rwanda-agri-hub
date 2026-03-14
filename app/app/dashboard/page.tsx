export default function DashboardPage() {
    return (
        <div className="space-y-6">
        <header>
            <h1 className="text-2xl font-light text-slate-800 tracking-tight">
            System Overview
            </h1>
            <p className="text-slate-500 text-sm">Welcome to the Agri-Hub control center.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* We will put real KPI cards here later */}
            <div className="h-32 bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse" />
            <div className="h-32 bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse" />
            <div className="h-32 bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse" />
        </div>
        </div>
    );
}