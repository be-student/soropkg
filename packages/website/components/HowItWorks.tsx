"use client";

const steps = [
  {
    num: "01", color: "var(--yellow)",
    title: "Inspect any deployed contract",
    description: "Point soropkg at any contract address on mainnet, testnet, or futurenet. It fetches the WASM binary, parses the contractspecv0 section, and returns a typed interface — functions, arguments, return values, and custom error types.",
    code: `$ soropkg inspect CAQQR5SWBXKIGZKPBZDH...

Contract: CAQQR5SWBXKIGZKPBZDH3KM5GQ5GUTPKB7JAFCINLZBC5WXPJKRG3IM7
Network:  mainnet
WASM:     0f1e2d3c4b5a69788796a5b4c3d2e1f0...

Functions
  fn deposit(from: Address, pool: Address, amount: i128) → i128
  fn withdraw(from: Address, pool: Address, amount: i128) → i128
  fn claim(from: Address, pool_addresses: Vec<Address>) → i128

Errors
  error InvalidShareMintAmount = 1
  error InvalidTokenWithdrawAmount = 2`,
  },
  {
    num: "02", color: "var(--teal)",
    title: "Declare your manifest",
    description: "Run soropkg init to scaffold a soroban.toml. Declare your package metadata and contract IDs per network — one manifest, every deployment target.",
    code: `[package]
name        = "my-org/my-protocol"
version     = "1.0.0"
license     = "Apache-2.0"
repository  = "https://github.com/my-org/my-protocol"

[networks.mainnet]
vault = "CCVAULTMAINNET..."
pool  = "CCPOOLMAINNET..."`,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: "100px 0", borderTop: "1px solid var(--border)", background: "var(--surface-1)" }}>
      <div className="section-inner">
        <div style={{ marginBottom: 72, maxWidth: 480 }}>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--yellow)", marginBottom: 20 }}>How it works</p>
          <h2 className="serif section-heading" style={{ fontSize: "clamp(22px, 3.5vw, 44px)", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--white)" }}>
            From on-chain to your IDE<br />in two steps
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 72 }}>
          {steps.map((step, i) => (
            <div key={step.num} className="grid-2col" style={{ direction: i % 2 === 1 ? "rtl" : "ltr" } as React.CSSProperties}>
              <div style={{ direction: "ltr" }}>
                <div className="mono" style={{ fontSize: 11, color: "var(--text-lo)", letterSpacing: "0.08em", marginBottom: 20 }}>{step.num}</div>
                <div style={{ width: 32, height: 2, background: "var(--yellow)", marginBottom: 24 }} />
                <h3 className="serif" style={{ fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 600, color: "var(--white)", lineHeight: 1.25, letterSpacing: "-0.01em", marginBottom: 18 }}>{step.title}</h3>
                <p style={{ fontSize: 15, color: "var(--text-mid)", lineHeight: 1.8, fontWeight: 400 }}>{step.description}</p>
              </div>

              <div style={{ direction: "ltr" }}>
                <div style={{ background: "var(--surface-0)", border: "1px solid var(--border-hi)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderBottom: "1px solid var(--border)", background: "var(--surface-0)" }}>
                    {["var(--border-hi)", "var(--border-hi)", "var(--border-hi)"].map((c, j) => (
                      <div key={j} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
                    ))}
                    <span className="mono" style={{ fontSize: 10, color: "var(--text-lo)", marginLeft: 6 }}>terminal</span>
                  </div>
                  <pre className="mono" style={{ padding: "18px 20px 22px", fontSize: 12, lineHeight: 1.75, color: "var(--text-mid)", overflowX: "auto", margin: 0, whiteSpace: "pre" }}>
                    {step.code.split("\n").map((line, idx) => (
                      <span key={idx} style={{ display: "block" }}>
                        {line.startsWith("$") ? <span style={{ color: "var(--yellow)" }}>{line}</span>
                          : line.includes("✓") ? <span style={{ color: "var(--teal)" }}>{line}</span>
                          : line}
                      </span>
                    ))}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
