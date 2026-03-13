"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, User as UserIcon, Shield, LayoutDashboard, History } from "lucide-react";
import Link from "next/link";

export default function DashboardHeader() {
    const { data: session } = useSession();

    return (
        <header className="h-20 border-b border-white/5 bg-[#020617]/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-10">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                        <LayoutDashboard size={18} className="text-white" />
                    </div>
                    <span className="text-xl font-black">LeadHarvest</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/dashboard" className="text-sm font-semibold text-white hover:text-primary-400 transition-colors">Extractor</Link>
                    <Link href="/dashboard/history" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">History</Link>
                    {session?.user.role === 'admin' && (
                        <Link href="/admin" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                            <Shield size={14} className="text-primary-500" />
                            Admin
                        </Link>
                    )}
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <div className="text-sm font-bold text-white">{session?.user.name}</div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group flex items-center justify-end gap-1">
                        {session?.user.subscriptionStatus === 'active' ? (
                            <span className="text-primary-500">PRO MEMBER</span>
                        ) : (
                            <span className="text-red-500">INACTIVE</span>
                        )}
                    </div>
                </div>

                <div className="relative group">
                    <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden hover:border-primary-500/50 transition-all">
                        {session?.user.image ? (
                            <img src={session.user.image} alt="User" />
                        ) : (
                            <UserIcon size={20} className="text-gray-400" />
                        )}
                    </button>

                    <div className="absolute right-0 mt-2 w-48 glass-card border-white/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
