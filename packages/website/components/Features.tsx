"use client";
import { ScanLine, FileText, GitCompare, ShieldCheck } from "lucide-react";

const features = [
  { Icon: ScanLine,    command: "soropkg inspect",  title: "Inspect any contract",          description: "Read the live interface of any deployed Soroban contract from the blockchain. No ABI files — the spec is stored on-chain in the WASM binary." },
  { Icon: GitCompare,  command: "soropkg diff",     title: "Diff two versions",             description: "Compare a contract's interface between two WASM versions and classify every change as breaking or non-breaking. Exits non-zero on breaking changes." },
  { Icon: ShieldCheck, command: "soropkg check",    title: "Watch for drift",               description: "Baseline the contracts you depend on, then detect breaking upgrades in CI. A dependency's in-place upgrade fails your build instead of your users." },
  { Icon: FileText,    command: "soropkg init",     title: "Initialize a project",          description: "Scaffold a soroban.toml manifest interactively. Declare your package metadata and contract IDs per network in under a minute." },
];

export default function Features() {
  return (
    <section id="features" style={{ padding: "100px 0", borderTop: "1px solid var(--border)" }}>
      <div className="section-inner">
        <div style={{ marginBottom: 64, maxWidth: 560 }}>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--yellow)", marginBottom: 20 }}>Features</p>
          <h2 className="serif section-heading" style={{ fontSize: "clamp(22px, 3.5vw, 44px)", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--white)" }}>
Inspect, diff, and monitor<br />Soroban contract interfaces
          </h2>
        </div>

        <div className="features-grid">
          {features.map(({ Icon, command, title, description }) => (
            <div key={command} style={{ background: "var(--surface-0)", padding: "36px 32px 40px", transition: "background 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-1)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--surface-0)")}
            >
              <div style={{ width: 40, height: 40, marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={22} strokeWidth={1.5} color="var(--yellow)" />
              </div>
              <code className="mono" style={{ fontSize: 11, color: "var(--lavender)", letterSpacing: "0.04em", fontWeight: 400 }}>{command}</code>
              <h3 style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 600, color: "var(--white)", marginTop: 10, marginBottom: 10, lineHeight: 1.25, letterSpacing: "-0.01em" }}>{title}</h3>
              <p style={{ fontSize: 14, color: "var(--text-mid)", lineHeight: 1.7, fontWeight: 400 }}>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
