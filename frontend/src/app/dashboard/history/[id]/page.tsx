"use client";

import React, { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import DataTable from "@/components/DataTable";
import StatsBar from "@/components/StatsBar";
import ExportBar from "@/components/ExportBar";
import { Loader2, ArrowLeft, Download, MessageCircle, Database } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import BulkWhatsApp from "@/components/BulkWhatsApp";

export default function SearchDetailsPage({ params }: { params: { id: string } }) {
    const [search, setSearch] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
    const [showBulkWhatsApp, setShowBulkWhatsApp] = useState(false);

    useEffect(() => {
        fetchDetails();
    }, [params.id]);

    const fetchDetails = async () => {
        try {
            const { data } = await axios.get(`/api/search/${params.id}`);
            // Mapping stored leads back to LeadRecord format
            const formattedLeads = data.leads.map((l: any) => ({
                Name: l.name,
                City: l.city,
                Phone: l.phone,
                Website: l.website,
                Instagram: l.instagram,
                whatsapp_link: l.whatsapp_link,
                About: l.about,
                Address: l.address,
                Notes: l.notes,
                contactedSteps: [false, false, false, false, false]
            }));
            setSearch({ ...data, leads: formattedLeads });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
            <Loader2 size={48} className="animate-spin text-primary-500" />
        </div>
    );

    if (!search) return <div>Not found</div>;

    const selectedRecords = Array.from(selectedIndices)
        .sort((a, b) => a - b)
        .map((i) => search.leads[i])
        .filter(Boolean);

    return (
        <div className="min-h-screen bg-[#020617]">
            <DashboardHeader />

            <main style={{ padding: "24px", maxWidth: "1440px", margin: "0 auto" }}>
                <div className="flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Link href="/dashboard/history" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/5">
                                <ArrowLeft size={24} />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-black mb-1">{search.query}</h1>
                                <p className="text-gray-500 text-sm font-bold tracking-widest uppercase">
                                    Harvested on {new Date(search.createdAt).toLocaleDateString()} via {search.model === 'google_maps' ? 'Google Maps' : 'DuckDuckGo'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <StatsBar records={search.leads} totalFound={search.leadCount} isRunning={false} />

                    <ExportBar
                        records={search.leads}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        apiBase="/api"
                    />

                    {selectedIndices.size > 0 && (
                        <div className="glass-card flex items-center justify-between p-4 border-primary-500/20 bg-primary-500/5">
                            <span className="text-sm font-bold text-primary-400">
                                {selectedIndices.size} leads selected
                            </span>
                            <div className="flex gap-3">
                                <button onClick={() => setSelectedIndices(new Set())} className="px-4 py-2 rounded-xl bg-white/5 text-xs font-bold hover:bg-white/10 transition-all">
                                    Deselect
                                </button>
                                <button
                                    onClick={() => setShowBulkWhatsApp(true)}
                                    className="px-6 py-2 rounded-xl bg-green-600 font-bold text-xs flex items-center gap-2"
                                >
                                    <MessageCircle size={14} />
                                    Bulk WhatsApp
                                </button>
                            </div>
                        </div>
                    )}

                    {showBulkWhatsApp && selectedRecords.length > 0 && (
                        <BulkWhatsApp
                            selectedRecords={selectedRecords}
                            onClose={() => setShowBulkWhatsApp(false)}
                            onClearSelection={() => {
                                setSelectedIndices(new Set());
                                setShowBulkWhatsApp(false);
                            }}
                        />
                    )}

                    <DataTable
                        records={search.leads}
                        searchQuery={searchQuery}
                        selectedIndices={selectedIndices}
                        onToggleSelect={(i) => setSelectedIndices(prev => {
                            const next = new Set(prev);
                            if (next.has(i)) next.delete(i);
                            else next.add(i);
                            return next;
                        })}
                        onSelectAll={(indices) => setSelectedIndices(new Set(indices))}
                        onDeselectAll={() => setSelectedIndices(new Set())}
                        onToggleContactStep={() => { }} // Disabled for history view for now or can be implemented
                    />
                </div>
            </main>
        </div>
    );
}
