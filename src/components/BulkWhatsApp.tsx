"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Eye, ChevronDown, ChevronUp } from "lucide-react";
import type { LeadRecord } from "@/app/dashboard/page";

interface Props {
    selectedRecords: LeadRecord[];
    onClose: () => void;
    onClearSelection: () => void;
}

const DEFAULT_TEMPLATE = `Hi {{name}},

I came across {{brand}} and was really impressed! I'd love to connect and explore potential collaboration opportunities.

Looking forward to hearing from you!`;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export default function BulkWhatsApp({ selectedRecords, onClose, onClearSelection }: Props) {
    const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
    const [previewIndex, setPreviewIndex] = useState(0);
    const [showPreview, setShowPreview] = useState(false);
    const [sendingIndex, setSendingIndex] = useState(-1);
    const [sentCount, setSentCount] = useState(0);

    const withPhone = selectedRecords.filter((r) => r.whatsapp_link);

    const personalize = (msg: string, record: LeadRecord) => {
        return msg
            .replace(/\{\{name\}\}/gi, record.Name || "there")
            .replace(/\{\{brand\}\}/gi, record.Name || "your business")
            .replace(/\{\{city\}\}/gi, record.City || "your city")
            .replace(/\{\{phone\}\}/gi, record.Phone || "");
    };

    const handleSendAll = async () => {
        setSentCount(0);
        const leadsData = withPhone.map(record => ({
            Phone: record.Phone,
            Message: personalize(template, record)
        }));

        setSendingIndex(0);
        try {
            const response = await fetch(`${API_BASE}/api/whatsapp/send-bulk`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leads: leadsData })
            });
            const data = await response.json();
            alert(data.message || "Bulk sending started in background. Please check the WhatsApp window.");
            setSentCount(withPhone.length);
        } catch (err) {
            console.error(err);
            alert("Failed to start WhatsApp automation.");
        }
        setSendingIndex(-1);
    };

    const previewRecord = withPhone[previewIndex] || selectedRecords[0];

    return (
        <div className="glass-card animate-fade-in-up" style={{ padding: "28px", position: "relative" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "40px",
                            height: "40px",
                            borderRadius: "12px",
                            background: "rgba(34, 197, 94, 0.15)",
                            color: "#22c55e",
                        }}
                    >
                        <MessageCircle size={20} />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                            Bulk WhatsApp Message
                        </h3>
                        <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            {selectedRecords.length} selected · {withPhone.length} have phone numbers
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid var(--border-secondary)",
                        borderRadius: "8px",
                        padding: "6px",
                        cursor: "pointer",
                        color: "var(--text-muted)",
                    }}
                >
                    <X size={18} />
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {/* Left: Message Template */}
                <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px", display: "block" }}>
                        Message Template
                    </label>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "10px" }}>
                        Use placeholders: <code style={{ color: "#22c55e", background: "rgba(34,197,94,0.1)", padding: "2px 6px", borderRadius: "4px" }}>{"{{name}}"}</code>{" "}
                        <code style={{ color: "#06b6d4", background: "rgba(6,182,212,0.1)", padding: "2px 6px", borderRadius: "4px" }}>{"{{brand}}"}</code>{" "}
                        <code style={{ color: "#8b5cf6", background: "rgba(139,92,246,0.1)", padding: "2px 6px", borderRadius: "4px" }}>{"{{city}}"}</code>
                    </p>
                    <textarea
                        value={template}
                        onChange={(e) => setTemplate(e.target.value)}
                        className="input-field"
                        style={{
                            minHeight: "180px",
                            resize: "vertical",
                            fontFamily: "inherit",
                            lineHeight: 1.6,
                            fontSize: "0.9rem",
                        }}
                    />
                </div>

                {/* Right: Preview */}
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                            Live Preview
                        </label>
                        {withPhone.length > 1 && (
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <button
                                    onClick={() => setPreviewIndex(Math.max(0, previewIndex - 1))}
                                    disabled={previewIndex === 0}
                                    className="btn-secondary"
                                    style={{ padding: "4px 8px", fontSize: "0.7rem" }}
                                >
                                    <ChevronUp size={14} />
                                </button>
                                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                                    {previewIndex + 1}/{withPhone.length}
                                </span>
                                <button
                                    onClick={() => setPreviewIndex(Math.min(withPhone.length - 1, previewIndex + 1))}
                                    disabled={previewIndex >= withPhone.length - 1}
                                    className="btn-secondary"
                                    style={{ padding: "4px 8px", fontSize: "0.7rem" }}
                                >
                                    <ChevronDown size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    {previewRecord && (
                        <div style={{ marginBottom: "8px" }}>
                            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                                Previewing for: <span style={{ color: "#22c55e", fontWeight: 600 }}>{previewRecord.Name}</span>
                                {previewRecord.Phone && <span> ({previewRecord.Phone})</span>}
                            </span>
                        </div>
                    )}

                    <div
                        style={{
                            background: "rgba(34, 197, 94, 0.06)",
                            border: "1px solid rgba(34, 197, 94, 0.15)",
                            borderRadius: "12px",
                            padding: "16px",
                            minHeight: "180px",
                            fontSize: "0.88rem",
                            lineHeight: 1.7,
                            color: "var(--text-primary)",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                        }}
                    >
                        {previewRecord ? personalize(template, previewRecord) : "Select records with phone numbers to preview."}
                    </div>
                </div>
            </div>

            {/* Actions Footer */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop: "1px solid var(--border-secondary)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {sentCount > 0 && (
                        <span style={{ fontSize: "0.8rem", color: "#22c55e", fontWeight: 600 }}>
                            ✓ {sentCount}/{withPhone.length} sent via WhatsApp
                        </span>
                    )}
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        onClick={() => {
                            onClearSelection();
                            onClose();
                        }}
                        className="btn-secondary"
                    >
                        Clear Selection
                    </button>
                    <button
                        onClick={handleSendAll}
                        disabled={withPhone.length === 0 || !template.trim()}
                        className="btn-primary"
                        style={{
                            background: withPhone.length > 0 ? "linear-gradient(135deg, #22c55e, #16a34a)" : undefined,
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <Send size={16} />
                        Send to {withPhone.length} contacts
                    </button>
                </div>
            </div>
        </div>
    );
}
