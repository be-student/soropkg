"use client";

const links = [
  { label: "GitHub",       href: "https://github.com/soropkg/soropkg" },
  { label: "Stellar",      href: "https://stellar.org" },
  { label: "Soroban Docs", href: "https://developers.stellar.org/docs/build/smart-contracts/overview" },
  { label: "SCF",          href: "https://communityfund.stellar.org" },
];

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      background: "var(--surface-0)",
    }}>
      {/* Yellow rule — Stellar brand */}
      <div style={{ height: 2, background: "var(--yellow)" }} />

      <div style={{
        maxWidth: 1140, margin: "0 auto", padding: "32px 32px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 3,
            background: "var(--yellow)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 13, color: "#0F0F0F" }}>S</span>
          </div>
          <span style={{ fontSize: 14, color: "var(--text-lo)", fontWeight: 400 }}>soropkg</span>
        </div>

        <nav style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {links.map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
              style={{
                fontSize: 12, color: "var(--text-lo)", textDecoration: "none",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--text-mid)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-lo)"}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <p style={{ fontSize: 11, color: "var(--text-lo)", fontWeight: 400 }}>
          Built on Stellar
        </p>
      </div>
    </footer>
  );
}
