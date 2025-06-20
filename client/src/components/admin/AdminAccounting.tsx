'use client'

import { BarChart, Newspaper, PiggyBankIcon, User } from "lucide-react";

export const AdminAccounting = () => {
    return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-100 dark:from-[#0d0d0d] dark:to-[#111] p-4">
        {/* Header */}
        <div className="mb-6 border-b border-blue-400 pb-2">
            <h1 className="text-3xl font-bold font-serif text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500">
                    <PiggyBankIcon className="w-6 h-6 text-white" />
                </div>
                <span>Accounting</span>
            </h1>
        </div>
    </div>
    );
}