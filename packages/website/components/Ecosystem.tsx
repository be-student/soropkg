"use client";
import { CheckCircle } from "lucide-react";

const contracts = [
  { name: "Blend Protocol",   category: "Lending",    count: 3, audited: true  },
  { name: "Soroswap",         category: "DEX / AMM",  count: 2, audited: false },
];

export default function Ecosystem() {
  return (
    <section id="ecosystem" style={{ padding: "100px 0", borderTop: "1px solid var(--border)" }}>
      <div className="section-inner">
        <div className="grid-sidebar">
          {/* Left */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--yellow)", marginBottom: 20 }}>Seed data</p>
            <h2 className="serif section-heading" style={{ fontSize: "clamp(20px, 3vw, 36px)", fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.02em", color: "var(--white)", marginBottom: 20 }}>
              The ecosystem, as seed data
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-mid)", lineHeight: 1.75, marginBottom: 32 }}>
              soropkg ships with seed data for 5 mainnet contracts across 2 protocols today, sourced from the Stellar ecosystem database.
            </p>
            <a href="https://github.com/soropkg/soropkg" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--yellow)", textDecoration: "none", borderBottom: "1px solid rgba(253,218,36,0.3)", paddingBottom: 2, transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--yellow)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(253,218,36,0.3)"}
            >
              View the seed data →
            </a>
          </div>

          {/* Right — table */}
          <div style={{ border: "1px solid var(--border)", overflowX: "auto" }}>
            <div className="eco-table-header" style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-1)" }}>
              {["Package", "Category", "Contracts", "Audited"].map((h, i) => (
                <span key={h} style={{ fontSize: 10, fontWeight: 500, color: "var(--text-lo)", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: i > 0 ? "center" : "left" as "center" | "left" }}>{h}</span>
              ))}
            </div>
            {contracts.map((c, i) => (
              <div key={c.name} className="eco-table-row"
                style={{ borderBottom: i < contracts.length - 1 ? "1px solid var(--border)" : "none", background: "var(--surface-0)", transition: "background 0.1s" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--surface-1)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--surface-0)"}
              >
                <span style={{ fontSize: 13, color: "var(--text-hi)", fontWeight: 400 }}>{c.name}</span>
                <span style={{ fontSize: 11, color: "var(--lavender)", textAlign: "center" }}>{c.category}</span>
                <span style={{ fontSize: 12, color: "var(--text-lo)", textAlign: "center" }}>{c.count}</span>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {c.audited ? <CheckCircle size={14} strokeWidth={1.5} color="var(--teal)" /> : <span style={{ fontSize: 12, color: "var(--border-hi)" }}>—</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
