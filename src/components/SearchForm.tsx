"use client";

import { useState, FormEvent } from "react";
import { Search, Play, Square } from "lucide-react";

interface Props {
    onSubmit: (url: string, model: string) => void;
    onStop: () => void;
    isRunning: boolean;
}

export default function SearchForm({ onSubmit, onStop, isRunning }: Props) {
    const [url, setUrl] = useState("");
    const [model, setModel] = useState("google_maps");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!url.trim() || isRunning) return;
        onSubmit(url.trim(), model);
    };

    return (
        <div className="glass-card" style={{ padding: "28px" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="input-field"
                    style={{
                        maxWidth: "180px",
                        padding: "0 12px",
                        height: "48px",
                    }}
                    disabled={isRunning}
                >
                    <option value="google_maps">Google Maps URL</option>
                    <option value="duckduckgo">DuckDuckGo Search</option>
                </select>

                <div style={{ position: "relative", flex: 1 }}>
                    <Search
                        size={18}
                        style={{
                            position: "absolute",
                            left: "16px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "var(--text-muted)",
                        }}
                    />
                    <input
                        type={model === "google_maps" ? "url" : "text"}
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder={model === "google_maps" ? "Paste Google Maps URL here..." : "Search e.g. 'Gyms in Gwalior'"}
                        className="input-field"
                        style={{ paddingLeft: "44px" }}
                        disabled={isRunning}
                        required
                    />
                </div>

                {isRunning ? (
                    <button
                        type="button"
                        onClick={onStop}
                        className="btn-primary"
                        style={{
                            background: "linear-gradient(135deg, #ef4444, #dc2626)",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            whiteSpace: "nowrap",
                        }}
                    >
                        <Square size={16} />
                        Stop
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={!url.trim()}
                        className="btn-primary"
                        style={{ display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}
                    >
                        <Play size={16} />
                        Extract Leads
                    </button>
                )}
            </form>
        </div>
    );
}
