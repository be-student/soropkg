"use client";
import { useState } from "react";
import { ArrowRight, Copy, Check } from "lucide-react";

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const cmd = "npm install -g soropkg";
  const copy = () => { navigator.clipboard.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <section className="hero-section" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px 80px", position: "relative", overflow: "hidden" }}>
      <div className="dot-texture" style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.6 }} />
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(253,218,36,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 760, textAlign: "center", position: "relative", width: "100%" }}>
        <p className="hero-label" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--yellow)", marginBottom: 28 }}>
          Built for the Stellar ecosystem
        </p>

        <h1 className="serif hero-title" style={{ fontSize: "clamp(28px, 6.5vw, 80px)", fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.02em", color: "var(--white)", marginBottom: 28 }}>
          The package manager for{" "}<em style={{ fontStyle: "italic", color: "var(--yellow)" }}>Soroban</em>{" "}
          smart contracts
        </h1>

        <p className="hero-subtitle" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: "clamp(14px, 2vw, 17px)", lineHeight: 1.75, color: "var(--text-mid)", maxWidth: 560, margin: "0 auto 48px" }}>
          Inspect any deployed Soroban contract's live interface — parsed straight
          from the WASM on-chain. No ABI files, no trust assumptions.
        </p>

        {/* Install command */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div className="install-cmd">
            <div style={{ padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, borderRight: "1px solid var(--border)" }}>
              <span className="mono" style={{ fontSize: 13, color: "var(--text-lo)", userSelect: "none" }}>$</span>
              <code className="mono" style={{ fontSize: 14, color: "var(--text-hi)", whiteSpace: "nowrap" }}>{cmd}</code>
            </div>
            <button onClick={copy} style={{ padding: "0 16px", background: "transparent", border: "none", color: copied ? "var(--yellow)" : "var(--text-lo)", cursor: "pointer", display: "flex", alignItems: "center", transition: "color 0.15s", minHeight: 46 }} title="Copy">
              {copied ? <Check size={14} strokeWidth={2} /> : <Copy size={14} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* CTAs */}
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <a href="#how-it-works" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 4, background: "var(--yellow)", color: "#0F0F0F", textDecoration: "none", fontSize: 14, fontWeight: 600, transition: "opacity 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Get started <ArrowRight size={14} strokeWidth={2.5} />
          </a>
          <a href="https://github.com/soropkg/soropkg" target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 4, background: "transparent", color: "var(--text-hi)", textDecoration: "none", fontSize: 14, fontWeight: 400, border: "1px solid var(--border-hi)", transition: "border-color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--warm)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-hi)"}
          >
            View source
          </a>
        </div>

        {/* Stats */}
        <div className="stats-row" style={{ marginTop: 72, paddingTop: 48, borderTop: "1px solid var(--border)" }}>
          {[{ value: "5", label: "Seed contracts" }, { value: "3", label: "Networks" }, { value: "2", label: "CLI commands" }].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div className="serif" style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 600, color: "var(--yellow)", letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "var(--text-lo)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
