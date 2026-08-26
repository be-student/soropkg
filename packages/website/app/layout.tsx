import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "soropkg — On-chain interface tooling for Soroban",
  description:
    "Inspect any deployed Soroban contract's interface straight from the chain, diff it across WASM versions, and watch the contracts you depend on for breaking upgrades.",
  keywords: ["Soroban", "Stellar", "smart contracts", "interface", "upgrade safety", "CI", "blockchain"],
  openGraph: {
    title: "soropkg — On-chain interface tooling for Soroban",
    description: "Inspect, diff, and monitor Soroban contract interfaces for breaking upgrades.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&family=Inconsolata:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
