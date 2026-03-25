import Link from 'next/link';
import { auth } from '../lib/auth';
import { Package, TrendingUp, Shield, Zap, BarChart3, FileUp, CheckCircle2, ArrowRight } from 'lucide-react';

export default async function HomePage() {
    const session = await auth();
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50">
            {/* Navigation Bar */}
            <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">
                            Rwanda <span className="text-emerald-600">AgriHub</span>
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {!session ? (
                            <Link
                                href="/login"
                                className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all"
                            >
                                Sign In
                            </Link>
                        ) : (
                            <Link
                                href="/dashboard"
                                className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all flex items-center gap-2"
                            >
                                Go to Dashboard
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 py-20 text-center">
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                        <Zap className="w-4 h-4" />
                        Real-time Inventory Management
                    </div>
                    
                    <h1 className="text-6xl font-bold text-slate-900 leading-tight">
                        Streamline Your Agricultural Supply Chain
                    </h1>
                    
                    <p className="text-xl text-slate-600 leading-relaxed">
                        Modern inventory management built for agri-input distributors in Rwanda. 
                        Track stock levels, manage transactions, and make data-driven decisions with ease.
                    </p>

                    <div className="flex gap-4 justify-center pt-6">
                        {!session ? (
                            <>
                                <Link
                                    href="/login"
                                    className="px-8 py-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                                >
                                    Get Started
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <button className="px-8 py-4 bg-white text-slate-900 rounded-xl font-medium border-2 border-slate-200 hover:border-emerald-300 transition-all">
                                    Watch Demo
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/dashboard"
                                className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                Open Dashboard
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                        <div className="text-5xl font-bold text-emerald-600 mb-2">2,000+</div>
                        <div className="text-slate-600">Products Tracked</div>
                    </div>
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                        <div className="text-5xl font-bold text-emerald-600 mb-2">Real-time</div>
                        <div className="text-slate-600">Stock Updates</div>
                    </div>
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                        <div className="text-5xl font-bold text-emerald-600 mb-2">3</div>
                        <div className="text-slate-600">User Roles</div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-white border-y border-slate-200 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">
                            Everything you need to manage inventory
                        </h2>
                        <p className="text-xl text-slate-600">
                            Built specifically for agricultural distribution in Rwanda
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="group p-8 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-all">
                                <FileUp className="w-6 h-6 text-emerald-600 group-hover:text-white transition-all" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                CSV Import
                            </h3>
                            <p className="text-slate-600">
                                Upload bulk transactions with smart validation and error reporting. Process thousands of records in seconds.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group p-8 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-all">
                                <BarChart3 className="w-6 h-6 text-emerald-600 group-hover:text-white transition-all" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                Real-time Dashboard
                            </h3>
                            <p className="text-slate-600">
                                Monitor KPIs, track low stock alerts, and visualize inventory value at a glance with live updates.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group p-8 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-all">
                                <TrendingUp className="w-6 h-6 text-emerald-600 group-hover:text-white transition-all" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                Transaction Filtering
                            </h3>
                            <p className="text-slate-600">
                                Advanced filters by date, type, region, and product. Export filtered data to CSV for reporting.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="group p-8 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-all">
                                <Shield className="w-6 h-6 text-emerald-600 group-hover:text-white transition-all" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                Role-Based Access
                            </h3>
                            <p className="text-slate-600">
                                Secure authentication with Admin, Manager, and Analyst roles. Control who can import and modify data.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="group p-8 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-all">
                                <Package className="w-6 h-6 text-emerald-600 group-hover:text-white transition-all" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                Stock Management
                            </h3>
                            <p className="text-slate-600">
                                Track product quantities, reorder points, and unit costs. Search and sort through your entire catalog instantly.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="group p-8 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-all">
                                <CheckCircle2 className="w-6 h-6 text-emerald-600 group-hover:text-white transition-all" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                Error Handling
                            </h3>
                            <p className="text-slate-600">
                                Clear error messages with downloadable reports. Fix issues quickly and retry imports without starting over.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-16 text-center text-white">
                    <h2 className="text-4xl font-bold mb-4">
                        Ready to optimize your inventory?
                    </h2>
                    <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
                        Join agricultural distributors across Rwanda who trust AgriHub to manage their supply chain.
                    </p>
                    {!session && (
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 rounded-xl font-medium hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
                        >
                            Get Started Now
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-slate-50 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-slate-900">
                                Rwanda <span className="text-emerald-600">AgriHub</span>
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-8 text-sm text-slate-600">
                            <span>© 2026 Rwanda AgriHub</span>
                            <span>•</span>
                            <a href="https://github.com/Zolender/rwanda-agri-hub" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">
                                GitHub
                            </a>
                            <span>•</span>
                            <span>Built by Zolender</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}