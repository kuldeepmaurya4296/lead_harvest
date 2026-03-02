"use client";

import { useState, useMemo } from "react";
import {
    ArrowUpDown,
    ExternalLink,
    Phone as PhoneIcon,
    MessageCircle,
    Globe,
    Instagram,
} from "lucide-react";
import type { LeadRecord } from "@/app/page";

interface Props {
    records: LeadRecord[];
    searchQuery: string;
    selectedIndices: Set<number>;
    onToggleSelect: (index: number) => void;
    onSelectAll: (indices: number[]) => void;
    onDeselectAll: () => void;
    onToggleContactStep: (recordIndex: number, stepIndex: number) => void;
}

type SortColumn = keyof LeadRecord | null;

export default function DataTable({
    records,
    searchQuery,
    selectedIndices,
    onToggleSelect,
    onSelectAll,
    onDeselectAll,
    onToggleContactStep,
}: Props) {
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortAsc, setSortAsc] = useState(true);

    const handleSort = (col: string) => {
        if (sortColumn === col) {
            setSortAsc(!sortAsc);
        } else {
            setSortColumn(col);
            setSortAsc(true);
        }
    };

    const filteredAndSorted = useMemo(() => {
        // We need to keep track of original indices for selection
        let data = records.map((r, i) => ({ ...r, _originalIndex: i }));

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            data = data.filter((row) =>
                Object.entries(row)
                    .filter(([k]) => k !== "_originalIndex")
                    .some(([, v]) => String(v).toLowerCase().includes(q))
            );
        }

        if (sortColumn) {
            data.sort((a, b) => {
                const vA = String((a as unknown as Record<string, string>)[sortColumn] || "").toLowerCase();
                const vB = String((b as unknown as Record<string, string>)[sortColumn] || "").toLowerCase();
                if (vA < vB) return sortAsc ? -1 : 1;
                if (vA > vB) return sortAsc ? 1 : -1;
                return 0;
            });
        }

        return data;
    }, [records, searchQuery, sortColumn, sortAsc]);

    const allVisibleSelected =
        filteredAndSorted.length > 0 &&
        filteredAndSorted.every((r) => selectedIndices.has(r._originalIndex));

    const handleSelectAllToggle = () => {
        if (allVisibleSelected) {
            onDeselectAll();
        } else {
            onSelectAll(filteredAndSorted.map((r) => r._originalIndex));
        }
    };

    const columns: { key: string; label: string; sortable: boolean; width?: string }[] = [
        { key: "Name", label: "Name", sortable: true, width: "220px" },
        { key: "Followup", label: "Follow-up Steps", sortable: false, width: "160px" },
        { key: "City", label: "City", sortable: true, width: "120px" },
        { key: "Phone", label: "Phone", sortable: true, width: "140px" },
        { key: "Website", label: "Website", sortable: true, width: "180px" },
        { key: "Instagram", label: "Social", sortable: true, width: "160px" },
        { key: "About", label: "About", sortable: false, width: "250px" },
    ];

    const truncate = (s: string, max: number) =>
        s && s.length > max ? s.substring(0, max) + "…" : s;

    const Dash = () => (
        <span style={{ color: "var(--text-muted)", opacity: 0.4 }}>—</span>
    );

    return (
        <div className="glass-card" style={{ overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            {/* Select All Checkbox */}
                            <th style={{ width: "44px", textAlign: "center" }}>
                                <input
                                    type="checkbox"
                                    checked={allVisibleSelected}
                                    onChange={handleSelectAllToggle}
                                    style={{ accentColor: "#6366f1", width: "16px", height: "16px", cursor: "pointer" }}
                                />
                            </th>
                            <th style={{ width: "44px", textAlign: "center" }}>#</th>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                    style={{ width: col.width, cursor: col.sortable ? "pointer" : "default" }}
                                >
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                        {col.label}
                                        {col.sortable && (
                                            <ArrowUpDown
                                                size={12}
                                                style={{
                                                    opacity: sortColumn === col.key ? 1 : 0.3,
                                                    color: sortColumn === col.key ? "#818cf8" : undefined,
                                                }}
                                            />
                                        )}
                                    </span>
                                </th>
                            ))}
                            <th style={{ width: "140px", textAlign: "center" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSorted.map((row, i) => {
                            const isSelected = selectedIndices.has(row._originalIndex);
                            const steps = row.contactedSteps || [false, false, false, false, false];
                            return (
                                <tr
                                    key={row._originalIndex}
                                    className="animate-fade-in"
                                    style={{
                                        animationDelay: `${Math.min(i * 0.02, 0.5)}s`,
                                        background: isSelected ? "rgba(99, 102, 241, 0.1)" : undefined,
                                    }}
                                >
                                    {/* Row Checkbox */}
                                    <td style={{ textAlign: "center" }}>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => onToggleSelect(row._originalIndex)}
                                            style={{ accentColor: "#6366f1", width: "16px", height: "16px", cursor: "pointer" }}
                                        />
                                    </td>

                                    <td style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.75rem" }}>
                                        {i + 1}
                                    </td>

                                    {/* Name */}
                                    <td
                                        style={{ color: "var(--text-primary)", fontWeight: 600, cursor: "pointer" }}
                                        onClick={() => onToggleSelect(row._originalIndex)}
                                    >
                                        {row.Name || <Dash />}
                                    </td>

                                    {/* Follow-up Steps (5 checkboxes) */}
                                    <td>
                                        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                                            {steps.map((checked, sIdx) => (
                                                <input
                                                    key={sIdx}
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        onToggleContactStep(row._originalIndex, sIdx);
                                                    }}
                                                    title={`Step ${sIdx + 1}`}
                                                    style={{
                                                        accentColor: "#10b981",
                                                        width: "14px",
                                                        height: "14px",
                                                        cursor: "pointer",
                                                        opacity: checked ? 1 : 0.4
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </td>

                                    {/* City */}
                                    <td>{row.City || <Dash />}</td>

                                    {/* Phone */}
                                    <td style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
                                        {row.Phone || <Dash />}
                                    </td>

                                    {/* Website */}
                                    <td>
                                        {row.Website ? (
                                            <a
                                                href={row.Website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    color: "#818cf8",
                                                    textDecoration: "none",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "4px",
                                                    fontSize: "0.8rem",
                                                }}
                                                title={row.Website}
                                            >
                                                {truncate(row.Website.replace(/^https?:\/\/(www\.)?/, ""), 24)}
                                                <ExternalLink size={11} style={{ opacity: 0.5 }} />
                                            </a>
                                        ) : (
                                            <Dash />
                                        )}
                                    </td>

                                    {/* Instagram */}
                                    <td>
                                        {row.Instagram ? (
                                            <a
                                                href={row.Instagram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    color: "#ec4899",
                                                    textDecoration: "none",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "4px",
                                                    fontSize: "0.8rem",
                                                }}
                                                title={row.Instagram}
                                            >
                                                {truncate(row.Instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, "@"), 20)}
                                                <ExternalLink size={11} style={{ opacity: 0.5 }} />
                                            </a>
                                        ) : (
                                            <Dash />
                                        )}
                                    </td>

                                    {/* About */}
                                    <td
                                        style={{
                                            fontSize: "0.78rem",
                                            color: "var(--text-muted)",
                                            maxWidth: "250px",
                                            whiteSpace: "normal",
                                            lineHeight: 1.4,
                                        }}
                                        title={row.About}
                                    >
                                        {row.About ? truncate(row.About, 80) : <Dash />}
                                    </td>

                                    {/* Actions */}
                                    <td>
                                        <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
                                            {row.whatsapp_link && (
                                                <a
                                                    href={row.whatsapp_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="action-icon"
                                                    title="WhatsApp"
                                                    style={{ color: "#22c55e" }}
                                                >
                                                    <MessageCircle size={16} />
                                                </a>
                                            )}
                                            {row.Phone && (
                                                <a
                                                    href={`tel:${row.Phone.replace(/[^\d+]/g, "")}`}
                                                    className="action-icon"
                                                    title="Call"
                                                    style={{ color: "#3b82f6" }}
                                                >
                                                    <PhoneIcon size={16} />
                                                </a>
                                            )}
                                            {row.Website && (
                                                <a
                                                    href={row.Website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="action-icon"
                                                    title="Website"
                                                    style={{ color: "#8b5cf6" }}
                                                >
                                                    <Globe size={16} />
                                                </a>
                                            )}
                                            {row.Instagram && (
                                                <a
                                                    href={row.Instagram}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="action-icon"
                                                    title="Instagram"
                                                    style={{ color: "#ec4899" }}
                                                >
                                                    <Instagram size={16} />
                                                </a>
                                            )}
                                            {!row.whatsapp_link && !row.Phone && !row.Website && !row.Instagram && <Dash />}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredAndSorted.length === 0 && (
                    <div
                        style={{
                            padding: "48px",
                            textAlign: "center",
                            color: "var(--text-muted)",
                            fontSize: "0.9rem",
                        }}
                    >
                        {searchQuery ? "No results match your filter." : "No records yet."}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div
                style={{
                    padding: "12px 20px",
                    borderTop: "1px solid var(--border-secondary)",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.78rem",
                    color: "var(--text-muted)",
                }}
            >
                <span>
                    Showing {filteredAndSorted.length} of {records.length} records
                    {selectedIndices.size > 0 && (
                        <span style={{ color: "#818cf8", marginLeft: "8px" }}>
                            · {selectedIndices.size} selected
                        </span>
                    )}
                </span>
                {searchQuery && (
                    <span style={{ color: "#818cf8" }}>Filtered by: &quot;{searchQuery}&quot;</span>
                )}
            </div>
        </div>
    );
}
