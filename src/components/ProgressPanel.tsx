"use client";

import { AlertCircle, Loader2 } from "lucide-react";

interface Props {
    statusMessage: string;
    progress: number;
    isRunning: boolean;
    error: string;
}

export default function ProgressPanel({ statusMessage, progress, isRunning, error }: Props) {
    return (
        <div className="glass-card" style={{ padding: "20px 28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {isRunning ? (
                        <Loader2 size={16} color="#818cf8" style={{ animation: "spin 1s linear infinite" }} />
                    ) : error ? (
                        <AlertCircle size={16} color="#f87171" />
                    ) : null}
                    <span
                        style={{
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            color: error ? "#f87171" : isRunning ? "#818cf8" : "var(--accent-emerald)",
                        }}
                    >
                        {statusMessage}
                    </span>
                </div>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)" }}>
                    {Math.round(progress)}%
                </span>
            </div>

            <div className="progress-bar-container">
                <div
                    className="progress-bar-fill"
                    style={{
                        width: `${progress}%`,
                        background: error
                            ? "linear-gradient(135deg, #ef4444, #dc2626)"
                            : progress >= 100
                                ? "linear-gradient(135deg, #10b981, #059669)"
                                : undefined,
                    }}
                />
            </div>

            <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
