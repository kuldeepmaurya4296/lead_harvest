"use client";

import React, { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { Loader2, Trash2, Eye, Calendar, Database, Search } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function HistoryPage() {
    const [searches, setSearches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const { data } = await axios.get("/api/search/history");
            setSearches(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteSearch = async (id: string) => {
        if (!confirm("Are you sure you want to delete this search history?")) return;
        try {
            await axios.delete(`/api/search/${id}`);
            setSearches(searches.filter((s: any) => s._id !== id));
        } catch (err) {
            alert("Failed to delete.");
        }
    };

    return (
        <div className="min-h-screen bg-[#020617]">
            <DashboardHeader />

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-black mb-2">Search History</h1>
                        <p className="text-gray-400">Manage your past harvests and stored leads.</p>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-gray-400">
                        <Database size={16} className="text-primary-500" />
                        {searches.length} Saved Searches
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <Loader2 className="animate-spin text-primary-500 mb-4" size={48} />
                        <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">Loading your history...</p>
                    </div>
                ) : searches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 text-center">
                        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/5">
                            <Search size={32} className="text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No history found.</h3>
                        <p className="text-gray-500 max-w-xs mx-auto mb-8">You haven't saved any searches yet. Start harvesting and click "Save to History".</p>
                        <Link href="/dashboard" className="px-8 py-3 rounded-xl bg-primary-600 font-bold hover:bg-primary-500 transition-all">
                            Go to Extractor
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        <AnimatePresence>
                            {searches.map((item: any, i: number) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass-card p-6 flex items-center justify-between border-white/5 hover:border-white/10 group transition-all"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-primary-900/40 flex items-center justify-center text-primary-400">
                                            {item.model === 'google_maps' ? <MapPin size={24} /> : <Globe size={24} />}
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-white mb-1">{item.query}</div>
                                            <div className="flex items-center gap-4 text-xs text-gray-500 font-medium uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><Calendar size={12} className="text-indigo-400" /> {new Date(item.createdAt).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1.5"><Database size={12} className="text-primary-400" /> {item.leadCount} Leads</span>
                                                <span className="px-2 py-0.5 rounded bg-white/5 text-[10px]">{item.model === 'google_maps' ? 'GOOGLE MAPS' : 'DUCKDUCKGO'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Link href={`/dashboard/history/${item._id}`} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all flex items-center gap-2 text-sm font-bold">
                                            <Eye size={18} />
                                            View Results
                                        </Link>
                                        <button
                                            onClick={() => deleteSearch(item._id)}
                                            className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </main>
        </div>
    );
}

// Helper icons
const MapPin = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
);
const Globe = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
);
