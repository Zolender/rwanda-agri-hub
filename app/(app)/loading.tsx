export default function DashboardLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div>
                    <div className="h-8 w-48 bg-slate-200 rounded"></div>
                    <div className="h-4 w-32 bg-slate-200 rounded mt-2"></div>
                </div>
                <div className="h-10 w-32 bg-slate-200 rounded"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-lg shadow">
                        <div className="h-4 w-24 bg-slate-200 rounded mb-3"></div>
                        <div className="h-8 w-16 bg-slate-200 rounded"></div>
                    </div>
                ))}
            </div>

            <div>
                <div className="h-8 w-48 bg-slate-200 rounded mb-4"></div>
                <div className="bg-white rounded-lg shadow p-4 space-y-3">
                    <div className="h-10 bg-slate-200 rounded"></div>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-slate-100 rounded"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}