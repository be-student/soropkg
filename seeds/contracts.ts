// Curated mainnet contract reference data — sourced from stellar-ecosystem-db.
// Used for examples and as a starting point for watchlists / test fixtures.
//
// Currently 5 contract IDs across 8 tracked orgs (Blend and Soroswap are
// populated; the rest are placeholders with empty contract lists).

export interface SeedContract {
  org: string;
  name: string;
  description: string;
  repository?: string;
  homepage?: string;
  contracts: { label: string; contractId: string }[];
  audits?: { name: string; url: string; auditor: string; date: string }[];
}

export const SEED_CONTRACTS: SeedContract[] = [
  {
    org: "blend-capital",
    name: "blend-protocol",
    description: "Decentralized lending and borrowing protocol built on Stellar/Soroban",
    repository: "https://github.com/blend-capital/blend-contracts",
    homepage: "https://blend.capital",
    contracts: [
      { label: "backstop",      contractId: "CAQQR5SWBXKIGZKPBZDH3KM5GQ5GUTPKB7JAFCINLZBC5WXPJKRG3IM7" },
      { label: "emitter",       contractId: "CCOQM6S7ICIUWA225O5PSJWUBEMXGFSSW2PQFO6FP4DQEKMS5DASRGRR" },
      { label: "pool_factory",  contractId: "CDSYOAVXFY7SM5S64IZPPPYB4GVGGLMQVFREPSQQEZVIWXX5R23G4QSU" },
    ],
    audits: [
      { name: "Blend Security Assessment", url: "https://sorobansecurity.com/report/1", auditor: "OtterSec", date: "2024-02-28" },
      { name: "Blend Formal Verification",  url: "https://sorobansecurity.com/report/9", auditor: "Certora", date: "2023-12-31" },
    ],
  },
  {
    org: "soroswap",
    name: "soroswap-protocol",
    description: "AMM DEX protocol built natively on Soroban",
    repository: "https://github.com/soroswap/core",
    homepage: "https://soroswap.finance",
    contracts: [
      { label: "router",  contractId: "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH" },
      { label: "factory", contractId: "CA4HEQTL2WPEUYKYKCDOHCDNIV4QHNJ7EL4J4NQ6VADP7SYHVRYZ7AW2" },
    ],
  },
  {
    org: "aquarius",
    name: "aquarius-amm",
    description: "Liquidity management and AMM rewards protocol on Stellar",
    repository: "https://github.com/AquaToken",
    homepage: "https://aqua.network",
    contracts: [],
  },
  {
    org: "phoenix-protocol",
    name: "phoenix-dex",
    description: "Multi-hop DEX and liquidity protocol on Soroban",
    repository: "https://github.com/Phoenix-Protocol-Group",
    homepage: "https://phoenix-hub.io",
    contracts: [],
  },
  {
    org: "fxdao",
    name: "fxdao-protocol",
    description: "Decentralized stablecoin protocol on Soroban",
    repository: "https://github.com/FxDAO",
    homepage: "https://fxdao.io",
    contracts: [],
  },
  {
    org: "reflector-network",
    name: "reflector-oracle",
    description: "Decentralized oracle network providing price feeds on Soroban",
    repository: "https://github.com/reflector-network",
    homepage: "https://reflector.network",
    contracts: [],
  },
  {
    org: "yieldblox",
    name: "yieldblox-protocol",
    description: "Decentralized lending protocol on Stellar",
    repository: "https://github.com/script3/yieldblox-docs",
    homepage: "https://yieldblox.finance",
    contracts: [],
  },
  {
    org: "centrifuge",
    name: "centrifuge-stellar",
    description: "Real-world asset financing protocol bridged to Stellar",
    repository: "https://github.com/centrifuge",
    homepage: "https://centrifuge.io",
    contracts: [],
  },
];
