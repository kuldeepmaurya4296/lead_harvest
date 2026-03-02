"use client";

import React, { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { Users, Search, CreditCard, ShieldCheck, ExternalLink, Trash2, Loader2, IndianRupee, Tag } from "lucide-react";
import axios from "axios";
import Link from "next/link";

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const { data } = await axios.get("/api/admin/stats");
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

    return (
        <div className="min-h-screen bg-[#020617]">
            <DashboardHeader />

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-black mb-2 flex items-center gap-4">
                        Admin Control Center
                        <span className="px-3 py-1 rounded bg-primary-600 text-[10px] font-black tracking-widest uppercase">System Admin</span>
                    </h1>
                    <p className="text-gray-400">Monitor system performance, manage users, and update growth settings.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: "Total Users", value: data.totalUsers, icon: Users, color: "text-blue-400" },
                        { label: "Active Subs", value: data.activeSubs, icon: ShieldCheck, color: "text-green-400" },
                        { label: "Total Searches", value: data.totalSearches, icon: Search, color: "text-purple-400" },
                        { label: "Revnue (Est)", value: `₹${data.activeSubs * 100}`, icon: IndianRupee, color: "text-yellow-400" },
                    ].map((stat, i) => (
                        <div key={i} className="glass-card p-6 flex flex-col items-center text-center border-white/5">
                            <stat.icon className={`${stat.color} mb-4`} size={32} />
                            <div className="text-3xl font-black mb-1">{stat.value}</div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* User Management */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Recent Users</h2>
                            <button className="text-sm font-bold text-primary-400 hover:text-white transition-colors">View All</button>
                        </div>

                        <div className="glass-card overflow-hidden border-white/5">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                    <tr>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Subscription</th>
                                        <th className="px-6 py-4">Joined</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {data.users.map((user: any) => (
                                        <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden">
                                                        {user.image && <img src={user.image} alt="" />}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-sm text-white">{user.name}</div>
                                                        <div className="text-[10px] text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-black ${user.subscriptionStatus === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {user.subscriptionStatus.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link href={`/admin/user/${user._id}`} className="p-2 rounded-lg bg-white/5 hover:bg-primary-600 text-gray-400 hover:text-white transition-all">
                                                        <ExternalLink size={14} />
                                                    </Link>
                                                    <button className="p-2 rounded-lg bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white transition-all">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Growth & Pricing Settings */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold">Growth Settings</h2>
                        <div className="glass-card p-8 border-white/5 divide-y divide-white/5 space-y-8">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <IndianRupee className="text-yellow-400" size={20} />
                                    <h3 className="font-bold">Subscription Pricing</h3>
                                </div>
                                <div className="space-y-4">
                                    <label className="block">
                                        <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">Current Price (INR)</span>
                                        <input type="number" defaultValue={100} className="input-field py-3" />
                                    </label>
                                    <button className="w-full py-3 rounded-xl bg-primary-600 font-bold hover:bg-primary-500 transition-all text-sm">Update Price</button>
                                </div>
                            </div>

                            <div className="pt-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Tag className="text-blue-400" size={20} />
                                    <h3 className="font-bold">Active Coupons</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                        <div>
                                            <div className="text-sm font-black text-white">LAUNCH50</div>
                                            <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">50% Discount</div>
                                        </div>
                                        <button className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                                    </div>
                                    <button className="w-full py-3 rounded-xl border border-dashed border-white/20 text-gray-500 font-bold hover:border-white/40 hover:text-white transition-all text-sm">Create Coupon</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
