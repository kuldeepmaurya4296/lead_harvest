"use client";

import { MapPin, Sparkles } from "lucide-react";

export default function Header() {
    return (
        <header style={{ textAlign: "center", paddingTop: "16px", paddingBottom: "8px" }}>
            <div
                className="animate-float"
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))",
                    border: "1px solid rgba(99,102,241,0.3)",
                    marginBottom: "16px",
                }}
            >
                <MapPin size={28} color="#818cf8" />
            </div>

            <h1
                style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.03em", margin: "0 0 8px" }}
            >
                Lead<span className="gradient-text">Harvest</span>
            </h1>

            <p
                style={{
                    fontSize: "1.05rem",
                    color: "var(--text-secondary)",
                    maxWidth: "520px",
                    margin: "0 auto",
                    lineHeight: 1.6,
                }}
            >
                Extract high-quality local business leads from Google Maps{" "}
                <Sparkles size={16} style={{ display: "inline", verticalAlign: "middle", color: "#f59e0b" }} /> instantly.
            </p>
        </header>
    );
}
