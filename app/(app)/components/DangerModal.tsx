'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TriangleAlert, X } from 'lucide-react';

type DangerModalProps = {
    isOpen: boolean;
    isDark: boolean;
    title: string;
    description: string;
    confirmWord?: string; // word user must type, defaults to "DELETE"
    confirmLabel?: string; // button label, defaults to "Confirm"
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function DangerModal({
    isOpen,
    isDark,
    title,
    description,
    confirmWord = 'DELETE',
    confirmLabel = 'Confirm',
    isLoading = false,
    onConfirm,
    onCancel,
}: DangerModalProps) {
    const [typed, setTyped] = useState('');
    const isMatch = typed === confirmWord;

    // Reset input when modal opens/closes
    useEffect(() => {
        if (!isOpen) setTyped('');
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onClick={onCancel}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                        className={`w-full max-w-md rounded-2xl border shadow-2xl p-7 space-y-6 ${
                            isDark
                                ? 'bg-stone-900 border-stone-800'
                                : 'bg-white border-stone-200'
                        }`}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                                    <TriangleAlert className="w-5 h-5 text-rose-600" />
                                </div>
                                <h2
                                    className={`text-lg font-black tracking-tight ${isDark ? 'text-stone-100' : 'text-stone-900'}`}
                                    style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                                >
                                    {title}
                                </h2>
                            </div>
                            <button
                                onClick={onCancel}
                                className={`p-1.5 rounded-lg transition-colors ${
                                    isDark ? 'hover:bg-stone-800 text-stone-400' : 'hover:bg-stone-100 text-stone-500'
                                }`}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Description */}
                        <p className={`text-sm leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                            {description}
                        </p>

                        {/* Confirm Input */}
                        <div className="space-y-2">
                            <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                                Type <span className="font-mono text-rose-500">{confirmWord}</span> to confirm
                            </label>
                            <input
                                type="text"
                                value={typed}
                                onChange={(e) => setTyped(e.target.value)}
                                placeholder={confirmWord}
                                autoFocus
                                className={`w-full px-4 py-3 rounded-xl border-2 font-mono text-sm outline-none transition-all ${
                                    typed.length > 0 && !isMatch
                                        ? 'border-rose-400 focus:border-rose-500 bg-rose-50 text-rose-700'
                                        : isMatch
                                        ? 'border-emerald-400 focus:border-emerald-500 bg-emerald-50 text-emerald-700'
                                        : isDark
                                        ? 'border-stone-700 bg-stone-800 text-stone-100 focus:border-stone-500'
                                        : 'border-stone-200 bg-stone-50 text-stone-900 focus:border-stone-400'
                                }`}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-1">
                            <button
                                onClick={onCancel}
                                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-colors border ${
                                    isDark
                                        ? 'border-stone-700 text-stone-300 hover:bg-stone-800'
                                        : 'border-stone-200 text-stone-600 hover:bg-stone-100'
                                }`}
                            >
                                Cancel
                            </button>
                            <motion.button
                                whileHover={{ scale: isMatch && !isLoading ? 1.02 : 1 }}
                                whileTap={{ scale: isMatch && !isLoading ? 0.97 : 1 }}
                                onClick={onConfirm}
                                disabled={!isMatch || isLoading}
                                className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                        />
                                        Processing...
                                    </>
                                ) : (
                                    confirmLabel
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}