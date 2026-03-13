"use client";

import { Users, MapPin, Phone, Globe, Instagram, Loader2 } from "lucide-react";
import type { LeadRecord } from "@/app/dashboard/page";

interface Props {
    records: LeadRecord[];
    totalFound: number;
    isRunning: boolean;
}

export default function StatsBar({ records, totalFound, isRunning }: Props) {
    const withPhone = records.filter((r) => r.Phone).length;
    const withWebsite = records.filter((r) => r.Website).length;
    const withInstagram = records.filter((r) => r.Instagram).length;
    const uniqueCities = new Set(records.map((r) => r.City).filter(Boolean)).size;

    const stats = [
        {
            label: "Leads Extracted",
            value: records.length,
            sub: totalFound ? `of ${totalFound} found` : "",
            icon: <Users size={20} />,
            color: "#818cf8",
        },
        {
            label: "Cities Covered",
            value: uniqueCities,
            sub: "",
            icon: <MapPin size={20} />,
            color: "#06b6d4",
        },
        {
            label: "With Phone",
            value: withPhone,
            sub: records.length ? `${Math.round((withPhone / records.length) * 100)}%` : "",
            icon: <Phone size={20} />,
            color: "#10b981",
        },
        {
            label: "With Website",
            value: withWebsite,
            sub: records.length ? `${Math.round((withWebsite / records.length) * 100)}%` : "",
            icon: <Globe size={20} />,
            color: "#8b5cf6",
        },
        {
            label: "With Instagram",
            value: withInstagram,
            sub: records.length ? `${Math.round((withInstagram / records.length) * 100)}%` : "",
            icon: <Instagram size={20} />,
            color: "#ec4899",
        },
    ];

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "12px",
            }}
        >
            {stats.map((stat, i) => (
                <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "36px",
                                height: "36px",
                                borderRadius: "10px",
                                background: `${stat.color}18`,
                                color: stat.color,
                            }}
                        >
                            {stat.icon}
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>
                            {stat.label}
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                        <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)" }}>
                            {stat.value}
                        </span>
                        {stat.sub && (
                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{stat.sub}</span>
                        )}
                        {isRunning && i === 0 && (
                            <Loader2
                                size={14}
                                color="#818cf8"
                                style={{ animation: "spin 1s linear infinite", marginLeft: "4px" }}
                            />
                        )}
                    </div>
                </div>
            ))}

            <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
