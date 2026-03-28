"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck } from "lucide-react";
import { useDarkMode } from "@/app/(app)/components/DarkModeContext";
import { updateUserRoleAction } from "@/app/lib/actions/admin";

type UserRole = "ADMIN" | "MANAGER" | "ANALYST";

type User = {
    id: string;
    name: string | null;
    email: string | null;
    role: UserRole;
};

type EditRoleModalProps = {
    user: User | null;    // null = closed
    onClose: () => void;
};

// Role descriptions shown below the dropdown to explain what each role can do
const roleDescriptions: Record<UserRole, string> = {
    ANALYST: "Read-only access. Can view dashboards and transactions.",
    MANAGER: "Can record sales, receive stock, import data, and view all reports.",
    ADMIN:   "Full access. Can manage users and all system settings.",
};

const roleBadge: Record<UserRole, string> = {
    ADMIN:   "bg-rose-100 text-rose-700",
    MANAGER: "bg-amber-100 text-amber-700",
    ANALYST: "bg-sky-100 text-sky-700",
};

export default function EditRoleModal({ user, onClose }: EditRoleModalProps) {
    const { isDark } = useDarkMode();

    const [selectedRole, setSelectedRole]       = useState<UserRole>("ANALYST");
    const [isPending, startTransition]          = useTransition();
    const [error, setError]                     = useState<string | null>(null);
    const [success, setSuccess]                 = useState(false);

    // When a user is passed in (modal opens), seed the dropdown with their current role
    // useEffect with [user] dependency — runs every time the target user changes
    useEffect(() => {
        if (user) {
            setSelectedRole(user.role);
            setError(null);
            setSuccess(false);
        }
    }, [user]);

    function handleSave() {
        if (!user) return;
        setError(null);

        startTransition(async () => {
            const result = await updateUserRoleAction(user.id, selectedRole);
            if (result.success) {
                setSuccess(true);
                setTimeout(onClose, 1200);
            } else {
                setError(result.error ?? "Something went wrong.");
            }
        });
    }

    // Has the admin actually changed the role from what it currently is?
    const hasChanged = user?.role !== selectedRole;

    return (
        <AnimatePresence>
            {user && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backdropFilter: "blur(4px)", backgroundColor: "rgba(0,0,0,0.5)" }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                        className={`w-full max-w-sm rounded-2xl border shadow-2xl p-7 space-y-5 ${
                            isDark ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200"
                        }`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <h2 className={`text-base font-black tracking-tight ${isDark ? "text-stone-100" : "text-stone-900"}`}>
                                        Edit Role
                                    </h2>
                                    <p className={`text-xs ${isDark ? "text-stone-400" : "text-stone-500"}`}>
                                        {user.name ?? user.email}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-stone-800 text-stone-400" : "hover:bg-stone-100 text-stone-500"}`}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Current role */}
                        <div className="flex items-center gap-2">
                            <span className={`text-xs ${isDark ? "text-stone-400" : "text-stone-500"}`}>Current:</span>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${roleBadge[user.role]}`}>
                                <ShieldCheck className="w-3 h-3" />
                                {user.role}
                            </span>
                        </div>

                        {/* Role selector */}
                        <div className="space-y-2">
                            <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-stone-400" : "text-stone-500"}`}>
                                New Role
                            </label>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                                disabled={isPending}
                                className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500 ${
                                    isDark
                                        ? "bg-stone-800 border-stone-600 text-stone-100"
                                        : "bg-white border-stone-300 text-stone-800"
                                }`}
                            >
                                <option value="ANALYST">ANALYST</option>
                                <option value="MANAGER">MANAGER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>

                            {/* Role description — updates live as you change the dropdown */}
                            <p className={`text-xs leading-relaxed ${isDark ? "text-stone-400" : "text-stone-500"}`}>
                                {roleDescriptions[selectedRole]}
                            </p>
                        </div>

                        {/* Error / Success banners */}
                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm px-4 py-2.5 rounded-xl bg-red-50 text-red-700 font-medium"
                            >
                                {error}
                            </motion.p>
                        )}
                        {success && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-medium"
                            >
                                Role updated successfully!
                            </motion.p>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                disabled={isPending}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                                    isDark
                                        ? "border-stone-700 text-stone-300 hover:bg-stone-800"
                                        : "border-stone-200 text-stone-600 hover:bg-stone-100"
                                }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                // Disabled if: nothing changed, currently saving, or already succeeded
                                disabled={!hasChanged || isPending || success}
                                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {isPending ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                    />
                                ) : null}
                                {isPending ? "Saving…" : "Save Role"}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}