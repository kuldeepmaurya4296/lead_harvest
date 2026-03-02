"use client";

import React, { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { Loader2, ArrowLeft, Database, Search, User as UserIcon, Calendar, ShieldCheck } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";

export default function UserManagementPage({ params }: { params: { id: string } }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, [params.id]);

    const fetchUserData = async () => {
        try {
            const { data } = await axios.get(`/api/admin/user/${params.id}`);
            setData(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
            <Loader2 className="animate-spin text-primary-500" size={48} />
        </div>
    );

    if (!data) return <div>User not found</div>;

    return (
        <div className="min-h-screen bg-[#020617]">
            <DashboardHeader />

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex items-center gap-6 mb-12">
                    <Link href="/admin" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/5">
                        <ArrowLeft size={24} />
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 overflow-hidden border border-white/10">
                            {data.user.image && <img src={data.user.image} alt="" />}
                        </div>
                        <div>
                            <h1 className="text-3xl font-black mb-1 text-white">{data.user.name}</h1>
                            <div className="flex items-center gap-4 text-[10px] font-black tracking-widest uppercase">
                                <span className="text-gray-500 flex items-center gap-1.5"><Calendar size={12} /> Joined {new Date(data.user.createdAt).toLocaleDateString()}</span>
                                <span className={data.user.subscriptionStatus === 'active' ? 'text-green-400' : 'text-red-400'}>
                                    {data.user.subscriptionStatus} Account
                                </span>
                                <span className="text-primary-400 flex items-center gap-1.5"><Database size={12} /> {data.searches.length} Saved Searches</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4">
                    <h2 className="text-xl font-bold mb-4">User Search History</h2>
                    {data.searches.length === 0 ? (
                        <div className="p-20 text-center glass-card border-white/5 text-gray-500 font-bold uppercase tracking-widest text-xs">
                            No search activity recorded for this user.
                        </div>
                    ) : (
                        data.searches.map((item: any) => (
                            <div key={item._id} className="glass-card p-6 flex items-center justify-between border-white/5">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-500">
                                        <Search size={22} />
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-white mb-1">{item.query}</div>
                                        <div className="flex items-center gap-4 text-[10px] text-gray-500 font-black tracking-widest uppercase">
                                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                            <span className="text-primary-400">{item.leadCount} LEADS FOUND</span>
                                            <span className="bg-white/5 px-2 py-0.5 rounded italic">{item.model}</span>
                                        </div>
                                    </div>
                                </div>
                                <Link href={`/dashboard/history/${item._id}`} className="px-6 py-2 rounded-xl bg-primary-600/10 text-primary-400 font-black text-xs hover:bg-primary-600 hover:text-white transition-all">
                                    INVESTIGATE RESULTS
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
