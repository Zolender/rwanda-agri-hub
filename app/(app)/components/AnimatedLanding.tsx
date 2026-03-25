'use client';

import Link from 'next/link';
import { Package, TrendingUp, Shield, Zap, BarChart3, FileUp, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

type AnimatedLandingProps = {
    session: any;
};

export default function AnimatedLanding({ session }: AnimatedLandingProps) {
    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.8 }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const scaleIn = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: { 
            scale: 1, 
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const float = {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50">
            {/* Navigation Bar */}
            <motion.nav 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50"
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <motion.div 
                        className="flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        <motion.div 
                            className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center"
                            animate={{
                                y: [0, -10, 0],
                                transition: {
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }
                            }}
                        >
                            <Package className="w-5 h-5 text-white" />
                        </motion.div>
                        <span className="text-xl font-bold text-slate-900">
                            Rwanda <span className="text-emerald-600">AgriHub</span>
                        </span>
                    </motion.div>
                    
                    <motion.div 
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {!session ? (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="/login"
                                    className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all"
                                >
                                    Sign In
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="/dashboard"
                                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all flex items-center gap-2"
                                >
                                    Go to Dashboard
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 py-20 text-center">
                <div className="max-w-3xl mx-auto space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4"
                    >
                        <Zap className="w-4 h-4" />
                        Real-time Inventory Management
                    </motion.div>
                    
                    <motion.h1 
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="text-6xl font-bold text-slate-900 leading-tight"
                    >
                        Streamline Your Agricultural Supply Chain
                    </motion.h1>
                    
                    <motion.p 
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-600 leading-relaxed"
                    >
                        Modern inventory management built for agri-input distributors in Rwanda. 
                        Track stock levels, manage transactions, and make data-driven decisions with ease.
                    </motion.p>

                    <motion.div 
                        className="flex gap-4 justify-center pt-6"
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.4 }}
                    >
                        {!session ? (
                            <>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link
                                        href="/login"
                                        className="px-8 py-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                                    >
                                        Get Started
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </motion.div>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }} 
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-white text-slate-900 rounded-xl font-medium border-2 border-slate-200 hover:border-emerald-300 transition-all"
                                >
                                    Watch Demo
                                </motion.button>
                            </>
                        ) : (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="/dashboard"
                                    className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                                >
                                    Open Dashboard
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* Stats Section with Float Animation */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    {[
                        { value: "2,000+", label: "Products Tracked" },
                        { value: "Real-time", label: "Stock Updates" },
                        { value: "3", label: "User Roles" }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={scaleIn}
                            whileHover={{ 
                                scale: 1.05, 
                                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                                transition: { duration: 0.2 }
                            }}
                            className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100"
                        >
                            <motion.div 
                                className="text-5xl font-bold text-emerald-600 mb-2"
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                            >
                                {stat.value}
                            </motion.div>
                            <div className="text-slate-600">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="bg-white border-y border-slate-200 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">
                            Everything you need to manage inventory
                        </h2>
                        <p className="text-xl text-slate-600">
                            Built specifically for agricultural distribution in Rwanda
                        </p>
                    </motion.div>

                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {[
                            {
                                icon: FileUp,
                                title: "CSV Import",
                                description: "Upload bulk transactions with smart validation and error reporting. Process thousands of records in seconds."
                            },
                            {
                                icon: BarChart3,
                                title: "Real-time Dashboard",
                                description: "Monitor KPIs, track low stock alerts, and visualize inventory value at a glance with live updates."
                            },
                            {
                                icon: TrendingUp,
                                title: "Transaction Filtering",
                                description: "Advanced filters by date, type, region, and product. Export filtered data to CSV for reporting."
                            },
                            {
                                icon: Shield,
                                title: "Role-Based Access",
                                description: "Secure authentication with Admin, Manager, and Analyst roles. Control who can import and modify data."
                            },
                            {
                                icon: Package,
                                title: "Stock Management",
                                description: "Track product quantities, reorder points, and unit costs. Search and sort through your entire catalog instantly."
                            },
                            {
                                icon: CheckCircle2,
                                title: "Error Handling",
                                description: "Clear error messages with downloadable reports. Fix issues quickly and retry imports without starting over."
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{ 
                                    y: -10,
                                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                                    borderColor: "rgb(16 185 129)",
                                    transition: { duration: 0.3 }
                                }}
                                className="group p-8 rounded-2xl border border-slate-200 transition-all bg-white"
                            >
                                <motion.div 
                                    className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-all"
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <feature.icon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-all" />
                                </motion.div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <motion.div 
                    className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-16 text-center text-white relative overflow-hidden"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Animated background circles */}
                    <motion.div
                        className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.5, 0.3, 0.5]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    
                    <div className="relative z-10">
                        <motion.h2 
                            className="text-4xl font-bold mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            Ready to optimize your inventory?
                        </motion.h2>
                        <motion.p 
                            className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            Join agricultural distributors across Rwanda who trust AgriHub to manage their supply chain.
                        </motion.p>
                        {!session && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 rounded-xl font-medium hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
                                >
                                    Get Started Now
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <motion.footer 
                className="border-t border-slate-200 bg-slate-50 py-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <motion.div 
                            className="flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-slate-900">
                                Rwanda <span className="text-emerald-600">AgriHub</span>
                            </span>
                        </motion.div>
                        
                        <div className="flex items-center gap-8 text-sm text-slate-600">
                            <span>© 2026 Rwanda AgriHub</span>
                            <span>•</span>
                            <motion.a 
                                href="https://github.com/Zolender/rwanda-agri-hub" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="hover:text-emerald-600 transition-colors"
                                whileHover={{ scale: 1.1 }}
                            >
                                GitHub
                            </motion.a>
                            <span>•</span>
                            <span>Built by Zolender</span>
                        </div>
                    </div>
                </div>
            </motion.footer>
        </div>
    );
}