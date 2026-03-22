import Link from 'next/link';
import { auth } from '../lib/auth';

export default async function HomePage() {

    const session = await auth();
    return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 to-slate-100 flex items-center justify-center p-8">
        <div className="max-w-2xl text-center space-y-8">
            <h1 className="text-5xl font-bold text-slate-900">
            Rwanda <span className="text-emerald-600">AgriHub</span>
        </h1>
        
        <p className="text-xl text-slate-600">
            Modern inventory management for agri-input distributors in Rwanda.
            Track stock, manage transactions, and optimize your supply chain.
        </p>

        <div className="flex gap-4 justify-center">
            {!session? 
            <Link
                href="/login"
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-medium hover:bg-slate-800 transition-all"
            >
            Sign In
            </Link>
                :
            <Link
                href="/dashboard"
                className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-medium border-2 border-slate-200 hover:border-emerald-300 transition-all"
            >
                Go to Dashboard
            </Link>
            }
        </div>

        <div className="pt-8 grid grid-cols-3 gap-6 text-sm text-slate-500">
            <div>
                <div className="text-3xl font-bold text-emerald-600">2,000+</div>
                <div>Products Tracked</div>
            </div>
            <div>
                <div className="text-3xl font-bold text-emerald-600">Real-time</div>
                <div>Stock Updates</div>
            </div>
            <div>
                <div className="text-3xl font-bold text-emerald-600">3</div>
                <div>User Roles</div>
            </div>
            </div>
        </div>
    </div>
    );
}