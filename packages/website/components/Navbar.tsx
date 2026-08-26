"use client";
import { useState, useEffect } from "react";

const GithubIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      background: scrolled ? "rgba(15,15,15,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      transition: "all 0.2s",
    }}>
      <div style={{ height: 2, background: "var(--yellow)", width: "100%" }} />
      <div className="section-inner" style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 4, background: "var(--yellow)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 16, color: "#0F0F0F", lineHeight: 1 }}>S</span>
          </div>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 16, color: "var(--text-hi)", letterSpacing: "-0.01em" }}>
            soropkg
          </span>
        </a>

        {/* Nav links — hidden on mobile via CSS */}
        <div className="nav-links">
          {[["Features", "#features"], ["How it works", "#how-it-works"], ["Ecosystem", "#ecosystem"]].map(([label, href]) => (
            <a key={label} href={href} style={{
              color: "var(--text-mid)", textDecoration: "none", fontSize: 13,
              fontWeight: 400, padding: "6px 14px", borderRadius: 4, transition: "color 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--text-hi)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-mid)"}
            >
              {label}
            </a>
          ))}
          <a href="https://github.com/soropkg/soropkg" target="_blank" rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: 7,
              marginLeft: 8, padding: "7px 16px", borderRadius: 4,
              border: "1px solid var(--border-hi)", background: "transparent",
              color: "var(--text-hi)", textDecoration: "none", fontSize: 13, fontWeight: 500,
              transition: "border-color 0.15s, background 0.15s", flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--yellow)"; e.currentTarget.style.background = "rgba(253,218,36,0.06)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-hi)"; e.currentTarget.style.background = "transparent"; }}
          >
            <GithubIcon />
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
